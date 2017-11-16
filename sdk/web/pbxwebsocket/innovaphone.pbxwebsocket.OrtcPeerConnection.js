/*---------------------------------------------------------------------------*/
/* innovaphone.pbxwebsocket.OrtcPeerConnection.js                            */
/* A library for adding WebRTC call functionality to websites using the      */
/* innovaphone PBX                                                           */
/*---------------------------------------------------------------------------*/

/*
 * Copyright (C) 2015 innovaphone AG
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *  * Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in
 *    the documentation and/or other materials provided with the
 *    distribution.
 *  * Neither the name of the copyright holder nor the names of
 *    contributors may be used to endorse or promote products derived
 *    from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
 * FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 * COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS
 * OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT
 * OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
 * SUCH DAMAGE.
 */


var innovaphone = innovaphone || {};
innovaphone.pbxwebsocket = innovaphone.pbxwebsocket || {};
innovaphone.pbxwebsocket.OrtcPeerConnection = innovaphone.pbxwebsocket.OrtcPeerConnection || (function (global) {

    "use strict";

    var idx; // required in strict mode
    var channels_data = null;
    var remote_channels_data = null;
    var localAudioSendCaps = null;
    var localVideoSendCaps = null;

    function isEmpty(obj) {
        if (obj) for (var x in obj) { return false; }
        return true;
    }

    function OrtcPeerConnection(iceOptions, onDone, onMediaConnected) {
        console.log("OrtcPeerConnection() iceOptions: " + JSON.stringify(iceOptions));

        this.nominatedAudio = null;
        this.nominatedVideo = null;

        var that = this;
        var remoteStream = new MediaStream();
        var local_audio_track = null;
        var local_video_track = null;
        var cb_onDone = onDone;
        var cb_onMediaConnected = onMediaConnected;
        var audio = { iceGatherer: null, iceTransport: null, dtlsTransport: null, Sender: null, Receiver: null, connected: false };
        var video = { iceGatherer: null, iceTransport: null, dtlsTransport: null, Sender: null, Receiver: null, connected: false };
        var share = { iceGatherer: null, iceTransport: null, dtlsTransport: null, Sender: null, Receiver: null, connected: false };
        var dtmfSender = null;

        function allocate_media_type(_kind, _iceOptions) {
            var sctp_supported = false; // Since Microsoft Edge does not implement the data channel, the RTCDataChannel and RTCSctpTransport objects are not supported.
            var _iceGatherer = new RTCIceGatherer(_iceOptions);
            var _iceTransport = new RTCIceTransport(_iceGatherer);
            var _dtlsTransport = new RTCDtlsTransport(_iceTransport);
            var _sctpTransport = (_kind === "share" && sctp_supported) ? new RTCSctpTransport(_dtlsTransport) : null;
            var _localCapabilities = (_kind === "audio" || _kind === "video") ? RTCRtpSender.getCapabilities(_kind) : null;
            return {
                kind: _kind,
                iceGatherer: _iceGatherer,
                iceTransport: _iceTransport,
                dtlsTransport: _dtlsTransport,
                sctpTransport: _sctpTransport,
                iceParameters: _iceGatherer.getLocalParameters(),
                dtlsParameters: _dtlsTransport.getLocalParameters(),
                localCapabilities: _localCapabilities,
                Sender: null,
                Receiver: null,
            };
        }

        function RTCRtpCodecParameters(localSendCaps, remote_channels_data) {
            // localSendCaps is either localAudioSendCaps or localVideoSendCaps
            //console.log(localSendCaps);
            //console.log(remote_channels_data);

            var codecs = [];
            var codecAdded = false;
            for (idx in remote_channels_data.channels) {
                var channel = remote_channels_data.channels[idx];
                if (localSendCaps && localSendCaps.codecs) {
                    localSendCaps.codecs.forEach(function (codec) {
                        if (strmatch_i(codec.name, channel.coder_name) && codec.clockRate === channel.clock_rate) {
                            var isDtmfCodec = strmatch_i(codec.name, "telephone-event");
                            if (!codecAdded || isDtmfCodec) {
                                //console.log("Found common " + channel.media_type + " codec: " + channel.coder_name);
                                codecs.push({
                                    name: codec.name,
                                    payloadType: channel.payload_type,
                                    clockRate: codec.clockRate,
                                    numChannels: codec.numChannels,
                                    rtcpFeedback: codec.rtcpFeedback,
                                    parameters: codec.parameters,
                                });
                                if (!isDtmfCodec) codecAdded = true;
                            }
                        }
                    })
                }
            }
            return codecs;
        }

        function RTCRtpEncodingParameters(inSsrc, inCodecPayloadType, inFec, inRtx, inPriority, inMaxBitRate, inMinQuality, inFramerateBias, inResolutionScale, inFramerateScale, inQualityScale, inActive, inEncodingId, inDependencyEncodingIds) {
            return {
                ssrc: inSsrc,
                codecPayloadType: inCodecPayloadType,
                fec: inFec,
                rtx: inRtx,
                priority: inPriority || 1.0,
                maxBitrate: inMaxBitRate || 2000000.0,
                minQuality: inMinQuality || 0,
                framerateBias: inFramerateBias || 0.5,
                resolutionScale: inResolutionScale || 1.0,
                framerateScale: inFramerateScale || 1.0,
                active: inActive || true,
                encodingId: inEncodingId,
                dependencyEncodingId: inDependencyEncodingIds
            };
        }

        function RTCRtcpParameters(inSsrc, inCname, inReducecdSize, inMux) {
            return {
                ssrc: inSsrc,
                cname: inCname,
                reducedSize: inReducecdSize,
                mux: inMux
            };
        }

        function startSendRecv(kind) {
            console.log("OrtcPeerConnection::startSendRecv(" + kind + ") ...");
            // start sending
            var senderCaps = RTCRtpSender.getCapabilities(kind);
            var commonCodecs = RTCRtpCodecParameters(senderCaps, remote_channels_data);
            if (commonCodecs.length) {
                var sendParams = {
                    muxId: "",
                    codecs: commonCodecs,
                    headerExtensions: [],
                    encodings: [],
                    rtcp: RTCRtcpParameters(0, "", false, true),
                };
                sendParams.encodings.push(RTCRtpEncodingParameters(1001, 0, 0, 0, 1.0));
                if (kind === "audio" && audio.Sender) audio.Sender.send(sendParams);
                if (kind === "video" && video.Sender) video.Sender.send(sendParams);
            }
            // start receiving
            var receiverCaps = RTCRtpReceiver.getCapabilities(kind);
            var commonCodecs = RTCRtpCodecParameters(receiverCaps, remote_channels_data);
            if (commonCodecs.length) {
                var recvParams = {
                    muxId: "",
                    codecs: commonCodecs,
                    headerExtensions: [],
                    encodings: [],
                    rtcp: RTCRtcpParameters(0, "", false, true),
                };
                recvParams.encodings.push(RTCRtpEncodingParameters(1001, 0, 0, 0, 1.0));
                if (kind === "audio" && audio.Receiver) audio.Receiver.receive(recvParams);
                if (kind === "video" && video.Receiver) video.Receiver.receive(recvParams);
                setTimeout(get_statistics, 5000);
            }
        };

        function get_statistics() {
            if (audio.Sender) audio.Sender.getStats().then(function (report) {
                //console.log(report);
                for (var idx in report) {
                    if (report[idx].type !== "outboundrtp") continue;
                    console.log("packetsSent=" + report[idx].packetsSent + " roundTripTime=" + report[idx].roundTripTime);
                }
            });
            if (audio.Receiver) audio.Receiver.getStats().then(function (report) {
                //console.log(report);
                for (var idx in report) {
                    if (report[idx].type !== "inboundrtp") continue;
                    console.log("packetsReceived=" + report[idx].packetsReceived + " packetsLost=" + report[idx].packetsLost + " jitter=" + report[idx].jitter);
                }
            });
            setTimeout(get_statistics, 5000);
        }

        function onicestatechange(evt) {
            var kind = (evt.target === audio.iceTransport) ? "audio" : (evt.target === video.iceTransport) ? "video" : null;
            console.log("OrtcPeerConnection::onicestatechange() component=" + evt.target.component + " kind=" + kind + " state=" + evt.state);
        };

        function ondtlsstatechange(evt) {
            console.log("OrtcPeerConnection::ondtlsstatechange() state=" + evt.state);
            if (evt.state === "connected") {
                if (evt.target === audio.dtlsTransport) { startSendRecv("audio"); audio.connected = true; }
                if (evt.target === video.dtlsTransport) { startSendRecv("video"); video.connected = true; }
                console.log("remoteStream.getAudioTracks().length=" + remoteStream.getAudioTracks().length + " audio.connected=" + audio.connected);
                console.log("remoteStream.getVideoTracks().length=" + remoteStream.getVideoTracks().length + " video.connected=" + video.connected);
                if (!remoteStream.getAudioTracks().length || audio.connected) {
                    if (!remoteStream.getVideoTracks().length || video.connected) {
                        // give a callback to OrtcEndpoint
                        if (cb_onMediaConnected) {
                            cb_onMediaConnected(remoteStream);
                            cb_onMediaConnected = null;
                        }
                    }
                }
            }
        };

        function onlocalcandidate(evt) {
            var cand = evt.candidate;
            var end = !cand || Object.keys(cand).length === 0;
            if (end) {
                // mark this iceGatherer as complete
                if (evt.target.state === undefined) {
                    evt.target.state = 'completed';
                }
            }
            else {
                if (evt.target == audio.iceGatherer || evt.target == video.iceGatherer) {
                    cand.component = 1; // RTP
                }
                if (evt.target == audio.iceGatherer && local_audio_track) {
                    channels_data.audio_ice.candidate.push(cand);
                    channels_data.audio_ice.common.count++;
                }
                else if (evt.target == video.iceGatherer && local_video_track) {
                    channels_data.video_ice.candidate.push(cand);
                    channels_data.video_ice.common.count++;
                }
                else return; // ignore
            }
            if (!audio.iceGatherer || audio.iceGatherer.state == 'completed') {
                if (!video.iceGatherer || video.iceGatherer.state == 'completed') {
                    // all iceGatherer are done
                    console.log("All ICE candidates gathered (state=" + evt.target.state + ")");
                    if (cb_onDone) {
                        cb_onDone(channels_data);
                        cb_onDone = null;
                    }
                }
            }
        };

        this.localStreams = [];
        this.remoteStreams = [];
        this.getLocalStreams = function () { return self.localStreams; };
        this.getRemoteStreams = function () { return self.remoteStreams; };

        this.addStream = function (localStream) {
            // The RTCPeerConnection.addStream() method adds a MediaStream as a local source of audio or video.
            // If the negotiation already happened, a new one will be needed for the remote peer to be able to use it.
            // Deprecated!!!
            // This method has been deprecated; you should, compatibility allowing, switch to using the addTrack() method instead.

            // delegate to addTrack()
            var audio_tracks = localStream.getAudioTracks();
            var video_tracks = localStream.getVideoTracks();

            if (audio_tracks.length) addTrack(audio_tracks[0], localStream);
            if (video_tracks.length) addTrack(video_tracks[0], localStream);
        };

        this.addTrack = function (track, stream) {
            console.log("OrtcPeerConnection::addTrack(" + track.kind + ") readyState=" + track.readyState);
            // The RTCPeerConnection method addTrack() adds a new media track to the connection.
            // The track is added to the set of tracks which will be transmitted to the other peer.
            if (track.kind === "audio") local_audio_track = track;
            if (track.kind === "video") local_video_track = track;
        };

        var OrtcDataChannel = function (defaultDataChannelLabel, defaultDataChannelOptions) {
            console.log("OrtcDataChannel::OrtcDataChannel() defaultDataChannelLabel=" + defaultDataChannelLabel + " defaultDataChannelOptions=" + defaultDataChannelOptions);

            var binaryType = true,
                onopen = null,
                onclose = null,
                onerror = null,
                onmessage = null;


            // public properties
            this.binaryType = binaryType;
            this.onopen = onopen;
            this.onclose = onclose;
            this.onerror = onerror;
            this.onmessage = onmessage;
            this.close = function () {
                console.log("OrtcDataChannel::close() ...");
            }
        };

        this.createDataChannel = function (defaultDataChannelLabel, defaultDataChannelOptions) {
            console.log("OrtcPeerConnection::createDataChannel() defaultDataChannelLabel=" + defaultDataChannelLabel + " defaultDataChannelOptions=" + defaultDataChannelOptions);
            return new OrtcDataChannel(defaultDataChannelLabel, defaultDataChannelOptions);
        }

        this.createOffer = function (constraints) {

            console.log("OrtcPeerConnection::createOffer() local_audio_track=" + local_audio_track + " local_video_track=" + local_video_track + " constraints=" + JSON.stringify(constraints));

            // initialize channels_data
            channels_data = {
                count: 0,
                key: {},
                channels: [],
                audio_ice: {
                    common: { count: 0, lite: false, rtcp_mux: true, fingerprint: {}, usr: "", pwd: "" },
                    candidate: []
                },
                video_ice: {
                    common: { count: 0, lite: false, rtcp_mux: true, fingerprint: {}, usr: "", pwd: "" },
                    candidate: []
                },
                collab_ice: {
                    common: { count: 0, lite: false, rtcp_mux: true, fingerprint: {}, usr: "", pwd: "" },
                    candidate: []
                },
            };

            // for each possible media-type allocate: iceGatherer, iceTransport, dtlsTransport
            audio = allocate_media_type("audio", iceOptions);
            video = allocate_media_type("video", iceOptions);
            share = allocate_media_type("share", iceOptions);

            channels_data.audio_ice.common.usr = audio.iceParameters.usernameFragment;
            channels_data.audio_ice.common.pwd = audio.iceParameters.password;
            channels_data.audio_ice.common.fingerprint = audio.dtlsParameters.fingerprints[0];

            channels_data.video_ice.common.usr = video.iceParameters.usernameFragment;
            channels_data.video_ice.common.pwd = video.iceParameters.password;
            channels_data.video_ice.common.fingerprint = video.dtlsParameters.fingerprints[0];

            if (constraints.sharing) {
                channels_data.collab_ice.common.usr = share.iceParameters.usernameFragment;
                channels_data.collab_ice.common.pwd = share.iceParameters.password;
                channels_data.collab_ice.common.fingerprint = share.dtlsParameters.fingerprints[0];
            }

            // add supported codecs to channels_data
            var allCodecs = audio.localCapabilities.codecs.concat(video.localCapabilities.codecs);
            for (idx in allCodecs) {
                var codec = allCodecs[idx];
                var channel_descriptor = {
                    media_type: codec.kind,
                    coder_name: codec.name,
                    clock_rate: codec.clockRate,
                    payload_type: codec.preferredPayloadType,
                    max_ptime: codec.maxptime,
                    num_ch: codec.numChannels,
                };
                if (codec.kind === 'video') {
                    // add extra codec parameters in case of video
                    if (!isEmpty(codec.parameters)) channel_descriptor.parameters = codec.parameters;
                    if (!constraints.video) continue; // do not add this coder
                }
                channels_data.channels.push(channel_descriptor);
                channels_data.count++;
            }
            if (constraints.sharing) {
                var channel_descriptor = { media_type: "application", coder_name: "JRFB", clock_rate: 8000, payload_type: 5000 };
                channels_data.channels.push(channel_descriptor);
                channels_data.count++;
            }

            // set same onlocalcandidate handler for all iceGatherer
            if (audio.iceGatherer) audio.iceGatherer.onlocalcandidate = onlocalcandidate;
            if (video.iceGatherer) video.iceGatherer.onlocalcandidate = onlocalcandidate;
            if (share.iceGatherer) share.iceGatherer.onlocalcandidate = onlocalcandidate;

            // set same onstatechange handler for all iceTransport
            if (audio.iceTransport) audio.iceTransport.onicestatechange = onicestatechange;
            if (video.iceTransport) video.iceTransport.onicestatechange = onicestatechange;
            if (share.iceTransport) share.iceTransport.onicestatechange = onicestatechange;

            // set same onstatechange handler for all dtlsTransport
            if (audio.dtlsTransport) audio.dtlsTransport.ondtlsstatechange = ondtlsstatechange;
            if (video.dtlsTransport) video.dtlsTransport.ondtlsstatechange = ondtlsstatechange;
            if (share.dtlsTransport) share.dtlsTransport.ondtlsstatechange = ondtlsstatechange;

            // set same onerror handler for all dtlsTransport
            if (audio.dtlsTransport) audio.dtlsTransport.onerror = function (error) { console.error(error.toString()); }
            if (video.dtlsTransport) video.dtlsTransport.onerror = function (error) { console.error(error.toString()); }
            if (share.dtlsTransport) share.dtlsTransport.onerror = function (error) { console.error(error.toString()); }

        }; // end of OrtcPeerConnection::createOffer

        function strmatch_i(s1, s2) {
            return (s1.toUpperCase() === s2.toUpperCase()) ? true : false;
        }

        function filter_rtp_candidates(candidates) {
            var result = [];
            if (candidates) {
                for (idx in candidates) {
                    var c = candidates[idx];
                    if (!c.component || c.component === 1 || c.component === "1") result.push(c);
                }
            }
            return result;
        }

        this.setRemoteDescription = function (channels_data) {
            console.log("OrtcPeerConnection::setRemoteDescription() localAudioSendCaps:" + JSON.stringify(localAudioSendCaps));
            console.log("OrtcPeerConnection::setRemoteDescription() localVideoSendCaps:" + JSON.stringify(localVideoSendCaps));

            // keep remote_channels_data
            remote_channels_data = channels_data;

            if (audio.iceTransport) {
                // read the audio candidates from channels_data
                var audioRtpCandidates = filter_rtp_candidates(channels_data.audio_ice.candidate);
                console.log("OrtcPeerConnection::setRemoteDescription() Got " + audioRtpCandidates.length + " ICE candidates for audio");
                console.log("DEBUG OrtcPeerConnection::setRemoteDescription() audioRtpCandidates=" + JSON.stringify(audioRtpCandidates));
                if (audioRtpCandidates.length) audio.iceTransport.setRemoteCandidates(audioRtpCandidates);

                // start audio.iceTransport and audio.dtlsTransport
                if (audioRtpCandidates.length && channels_data.audio_ice.common.fingerprint && channels_data.audio_ice.common.fingerprint.value) {
                    try {
                        var localIceRole = (channels_data.role === 'answer') ? 'controlling' : 'controlled';
                        var remoteIceParameters = {
                            usernameFragment: channels_data.audio_ice.common.usr,
                            password: channels_data.audio_ice.common.pwd
                        };
                        console.log("DEBUG OrtcPeerConnection::setRemoteDescription() localIceRole=" + localIceRole);
                        console.log("DEBUG OrtcPeerConnection::setRemoteDescription() remoteIceParameters=" + JSON.stringify(remoteIceParameters));
                        audio.iceTransport.start(audio.iceGatherer, remoteIceParameters, localIceRole);
                    }
                    catch (err) { console.error("RTCIceTransport::start() for audio failed: " + err); }

                    try {
                        var remoteDtlsParameters = {
                            role: "auto",
                            fingerprints: [{
                                algorithm: channels_data.audio_ice.common.fingerprint.algorithm,
                                value: channels_data.audio_ice.common.fingerprint.value.toUpperCase()
                            }]
                        };
                        console.log("DEBUG OrtcPeerConnection::setRemoteDescription() remoteDtlsParameters=" + JSON.stringify(remoteDtlsParameters));
                        console.log("OrtcPeerConnection::setRemoteDescription() audio.iceGatherer.state=" + audio.iceGatherer.state + " audio.iceTransport.state=" + audio.iceTransport.state + " audio.dtlsTransport.state=" + audio.dtlsTransport.state);
                        audio.dtlsTransport.start(remoteDtlsParameters);
                    }
                    catch (err) { console.error("RTCDtlsTransport::start() for audio failed: " + err); }
                }
            }

            if (video.iceTransport) {
                // read the video candidates from channels_data
                var videoRtpCandidates = filter_rtp_candidates(channels_data.video_ice.candidate);
                console.log("OrtcPeerConnection::setRemoteDescription() Got " + videoRtpCandidates.length + " ICE candidates for video");
                console.log("DEBUG OrtcPeerConnection::setRemoteDescription() videoRtpCandidates=" + JSON.stringify(videoRtpCandidates));
                if (videoRtpCandidates.length) video.iceTransport.setRemoteCandidates(videoRtpCandidates);

                // start video.iceTransport and video.dtlsTransport
                if (videoRtpCandidates.length && channels_data.video_ice.common.fingerprint && channels_data.video_ice.common.fingerprint.value) {
                    try {
                        var localIceRole = (channels_data.role === 'answer') ? 'controlling' : 'controlled';
                        var remoteIceParameters = {
                            usernameFragment: channels_data.video_ice.common.usr,
                            password: channels_data.video_ice.common.pwd
                        };
                        video.iceTransport.start(video.iceGatherer, remoteIceParameters, localIceRole);
                    }
                    catch (err) { console.error("RTCIceTransport::start() for video failed: " + err); }

                    try {
                        var remoteDtlsParameters = {
                            role: "auto",
                            fingerprints: [{
                                algorithm: channels_data.video_ice.common.fingerprint.algorithm,
                                value: channels_data.video_ice.common.fingerprint.value
                            }]
                        };
                        console.log("OrtcPeerConnection::setRemoteDescription() video.iceGatherer.state=" + video.iceGatherer.state + " video.iceTransport.state=" + video.iceTransport.state + " video.dtlsTransport.state=" + video.dtlsTransport.state);
                        video.dtlsTransport.start(remoteDtlsParameters);
                    }
                    catch (err) { console.error("RTCDtlsTransport::start() for video failed: " + err); }
                }
            }

            if (local_audio_track) {
                // create Sender and Receiver for Audio
                // Microsoft Edge does not support optional "rtcpTransport" argument! (https://msdn.microsoft.com/library/Mt502516)
                console.log("OrtcPeerConnection::setRemoteDescription() local_audio_track.readyState: " + JSON.stringify(local_audio_track.readyState));
                console.log("OrtcPeerConnection::setRemoteDescription() audio.dtlsTransport.state: " + JSON.stringify(audio.dtlsTransport.state));
                if (!audio.Sender) audio.Sender = new RTCRtpSender(local_audio_track, audio.dtlsTransport);
                if (!audio.Receiver) audio.Receiver = new RTCRtpReceiver(audio.dtlsTransport, 'audio');
                remoteStream.addTrack(audio.Receiver.track);
                audio.Sender.ononerror = function (error) {
                    console.error(error.toString());
                }
            }
            if (local_video_track) {
                // create Sender and Receiver for Video
                // Microsoft Edge does not support optional "rtcpTransport" argument! (https://msdn.microsoft.com/library/Mt502516)
                console.log("OrtcPeerConnection::setRemoteDescription() local_video_track.readyState: " + JSON.stringify(local_video_track.readyState));
                console.log("OrtcPeerConnection::setRemoteDescription() video.dtlsTransport.state: " + JSON.stringify(video.dtlsTransport.state));
                if (!video.Sender) video.Sender = new RTCRtpSender(local_video_track, video.dtlsTransport);
                if (!video.Receiver) video.Receiver = new RTCRtpReceiver(video.dtlsTransport, 'video');
                remoteStream.addTrack(video.Receiver.track);
                video.Sender.ononerror = function (error) {
                    console.error(error.toString());
                }
            }
        }; // end of OrtcPeerConnection::setRemoteDescription

        this.createDTMFSender = function (track) {
            console.log("OrtcPeerConnection::createDTMFSender() ...");
            var sendObject = (track.kind === "audio") ? audio.Sender : null;
            if (!dtmfSender) dtmfSender = new RTCDtmfSender(sendObject);
            return dtmfSender;
        };

        this.close = function () {
            console.log("OrtcPeerConnection::close() ...");

            // Calling this method terminates the RTCPeerConnection's ICE agent, ending any ongoing ICE processing and any active streams.
            // This also releases any resources in use by the ICE agent, including TURN permissions.
            // All RTCRtpSender objects are considered to be stopped once this returns (they may still be in the process of stopping,
            // but for all intents and purposes, they're stopped).
            // Once this method returns, the signaling state as returned by RTCPeerConnection.signalingState is closed.

            dtmfSender = null;

            if (audio.Sender) audio.Sender.stop();
            if (audio.Receiver) audio.Receiver.stop();
            if (audio.dtlsTransport) audio.dtlsTransport.stop();
            if (audio.iceTransport) audio.iceTransport.stop();
            audio.Sender = null;
            audio.Receiver = null;
            audio.dtlsTransport = null;
            audio.iceTransport = null;
            audio.iceGatherer = null;

            if (video.Sender) video.Sender.stop();
            if (video.Receiver) video.Receiver.stop();
            if (video.dtlsTransport) video.dtlsTransport.stop();
            if (video.iceTransport) video.iceTransport.stop();
            video.Sender = null;
            video.Receiver = null;
            video.dtlsTransport = null;
            video.iceTransport = null;
            video.iceGatherer = null;

            var videoRenderer = document.getElementById("rtcRenderer");
            if (videoRenderer) {
                videoRenderer.src = null;
                videoRenderer.srcObject = null;
                videoRenderer = null;
            }

            if (remoteStream) {
                remoteStream = null;
            }

            if (local_audio_track) {
                //local_audio_track.stop(); // do not call stop() (not the owner)
                local_audio_track = null;
            }

            if (local_video_track) {
                //local_video_track.stop(); // do not call stop() (not the owner)
                local_video_track = null;
            }
            console.log("OrtcPeerConnection::close() ... done.");
        }; // end of OrtcPeerConnection::close
        
    }; // end of OrtcPeerConnection constructor

    // public
    return {
        PeerConnection: OrtcPeerConnection,
    };

})(window);

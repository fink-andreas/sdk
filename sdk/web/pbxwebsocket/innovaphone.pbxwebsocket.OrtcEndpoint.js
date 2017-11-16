/*---------------------------------------------------------------------------*/
/* innovaphone.pbxwebsocket.OrtcEndpoint.js                                */
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

/// <reference path="innovaphone.pbxwebsocket.Connection.js" />
/// <reference path="innovaphone.pbxwebsocket.ToneGenerator.js" />
/// <reference path="innovaphone.pbxwebsocket.OrtcPeerConnection.js" />

var innovaphone = innovaphone || {};
innovaphone.pbxwebsocket = innovaphone.pbxwebsocket || {};
innovaphone.pbxwebsocket.Ortc = innovaphone.pbxwebsocket.Ortc || (function (global) {

    var PeerConnection = innovaphone.pbxwebsocket.OrtcPeerConnection.PeerConnection;

    // dependencies
    var Connection = innovaphone.pbxwebsocket.Connection,
        ToneGenerator = innovaphone.pbxwebsocket.ToneGenerator,
        AppSharing = innovaphone.applicationSharing ? innovaphone.applicationSharing.main : null,
        getUserMediaSupported = (navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
        ORTCSupported = !!getUserMediaSupported && window.RTCIceGatherer;
    if (!ORTCSupported) console.warn("ORTC not supported");

    var iceOptions = {
        gatherPolicy: "all",
        iceServers: [
            { urls: "turn:turn.innovaphone.com:3478?transport=udp", username: "innovaphone", credential: "turn4free" }
        ]
    };

    // private
    var testMode = false;

    // constants
    var defaultDataChannelOptions = { reliable: false, ordered: false },
        defaultDataChannelLabel = "myLabel",
        defaultDataChannelBinaryType = "arraybuffer";

    var activateTestMode = function () {
        testMode = true;
    }

    var Timer = function (startTime) {
        var time = startTime,
            timeout = null;

        this.start = function (callback) {
            if (timeout) {
                clearTimeout(timeout);
                time *= 2;
            }
            timeout = setTimeout(callback, time);
        }

        this.reset = function () {
            if (timeout) clearTimeout(timeout);
            timeout = null;
            time = startTime;
        }
    }

    var strmatch_i = function (s1, s2) {
        return (s1.toUpperCase() === s2.toUpperCase()) ? true : false;
    }

    var isAudioCodec = function (coder_name) {
        var compare = function (e) { return strmatch_i(e, coder_name) }
        return ["G722", "OPUS", "PCMU", "PCMA", "SILK"].find(compare);
    }

    var isVideoCodec = function (coder_name) {
        var compare = function (e) { return strmatch_i(e, coder_name) }
        return ["H264", "X-H264UC", "MYVIDEO"].find(compare);
    }

    var isDtmfCodec = function (coder_name) {
        return ("telephone-event" === coder_name.toLowerCase());
    }

    var isDataCodec = function (coder_name) {
        return ("JRFB" === coder_name.toUpperCase());
    }

    var mediaAnd = function (remote, local) {
        return {
            "audio": remote && local && remote.audio && local.audio,
            "video": remote && local && remote.video && local.video,
            "sharing": remote && local && remote.sharing && local.sharing
        }
    };

    this.allocChannel = function (id, send, displayName, onStream, onSharing, logFunction) {
        return new Channel(id, send, displayName, onStream, onSharing, logFunction);
    }
    var Channel = function (id, send, displayName, onStream, onSharing, logFunction) {
        var states = { IDLE: 0, CREATE_OFFER: 1, CREATE_ANSWER: 2, WAIT_ANSWER: 3, CONNECTED: 4 },
            state = states.IDLE,
            localStream = null,
            remoteStream = null,
            peerConnection = null,
            dataChannel = null,
            gatherTimeout = null,
            dtmfSender = null,
            sigOffer = null,
            sigAnswer = null,
            remote_channels_offer = null, // inbound call
            local_channels_answer = null, // inbound call
            local_channels_offer = null, // outbound call
            remote_channels_answer = null, // outbound call
            lastMediaInfo = {},
            currentUserMedia = {},
            log = logFunction ? function (text) { logFunction("Channel(" + id + "): " + text); } : function () { },
            appSharing = AppSharing ? new AppSharing(log, displayName) : null,
            toneGenerator = new ToneGenerator(log);

        var closePeerConnection = function () {
            if (remoteStream) {
                if (onStream) onStream(id, "remote", null);
                remoteStream = null;
            }
            if (dataChannel) {
                dataChannel.close();
                dataChannel.onopen = undefined;
                //dataChannel.onclose = undefined;  // If set, close function not being called
                dataChannel.onerror = undefined;
                dataChannel.onmessage = undefined;
                dataChannel = null;
            }
            if (dtmfSender) {
                dtmfSender = null;
            }
            if (peerConnection) {
                peerConnection.close();
                peerConnection.oniceconnectionstatechange = undefined;
                peerConnection.onsignalingstatechange = undefined;
                peerConnection.onnegotiationneeded = undefined;
                peerConnection.onicecandidate = undefined;
                peerConnection.onaddstream = undefined;
                peerConnection.onmediaconnected = undefined;
                peerConnection = null;
            }
        }

        var allocUserMedia = function (config, successCallback, errorCallback) {
            console.log("allocUserMedia() " + JSON.stringify(config));
            if (testMode && navigator.mozGetUserMedia) config.fake = true;
            if (config.audio == currentUserMedia.audio && config.video == currentUserMedia.video) {
                log("allocUserMedia() " + JSON.stringify(config) + " unchanged");
                if (onStream && localStream) onStream(id, "local", null);
                currentUserMedia = config;
                successCallback(localStream);
            }
            else {
                // media config changed
                if (currentUserMedia.audio && !config.audio) releaseUserMedia();
                if (currentUserMedia.video && !config.video) releaseUserMedia();
                currentUserMedia = config;
                console.log("allocUserMedia() " + JSON.stringify(config) + " asking for permission");
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    var constraints = {
                        audio: config && config.audio ? { echoCancellation: true } : false,
                        video: config && config.video ? { width: { min: 160, ideal: 352, max: 640 }, height: { min: 120, ideal: 288, max: 480 } } : false
                    };
                    navigator.mediaDevices.getUserMedia(constraints).then(successCallback).catch(errorCallback);
                }
                else console.error("navigator.mediaDevices.getUserMedia() missing!");
            }
        };

        var releaseUserMedia = function () {
            console.log("releaseUserMedia() " + JSON.stringify(currentUserMedia));
            if (localStream) {
                localStream.active = false;
                var tracks = localStream.getTracks();
                if (tracks) {
                    var len = tracks.length;
                    for (var i = 0; i < len; i++) tracks[i].stop();
                }
                localStream = null;
                if (onStream) onStream(id, "local", null);
            }
            currentUserMedia = {};
        }

        var stateIdle = function () {
            closePeerConnection();
            releaseUserMedia();
            if (gatherTimeout) window.clearTimeout(gatherTimeout);
            gatherTimeout = null;
            sigOffer = null;
            sigAnswer = null;
            toneGenerator.toneOff();
            toneGenerator.ringOff();
            log("state=IDLE");
            state = states.IDLE;
            sendMediaInfo();
        }

        function onPeerConnectionReady(local_channels_data) {
            // onPeerConnectionReady() is called when gathering of local candidates is done
            console.log("Channel::onPeerConnectionReady() state=" + state);
            if (gatherTimeout) window.clearTimeout(gatherTimeout);
            gatherTimeout = null;

            if (state == states.CREATE_OFFER) {
                // send local channnels OFFER
                log("state=WAIT_ANSWER");
                state = states.WAIT_ANSWER;
                local_channels_offer = local_channels_data;
                send(id, "Offer", local_channels_offer);
            }
            else if (state == states.CREATE_ANSWER) {
                // setup and send channnels ANSWER
                stateConnected(local_channels_data);
            }
        }

        function onMediaConnected(remoteStream) {
            console.log("Channel::onMediaConnected() remoteStream=" + remoteStream);
            this.remoteStream = remoteStream;
            // call endpoint's callback function
            if (onStream) onStream(id, "remote", remoteStream);
        }

        var stateCreateOffer = function (iceServers, local_config) {
            closePeerConnection();
            if (gatherTimeout) window.clearTimeout(gatherTimeout);
            gatherTimeout = null;
            sigOffer = null;
            sigAnswer = null;
            log("state=CREATE_OFFER");
            state = states.CREATE_OFFER;

            var constraints = {
                "audio": local_config && local_config.audio,
                "video": local_config && local_config.video
            };

            allocUserMedia(constraints,
                function (stream) {
                    console.log("allocUserMedia() succeeded (state=" + state + ")");
                    if (state == states.CREATE_OFFER) {
                        log("create offer");
                        localStream = stream;
                        if (onStream) onStream(id, "local", stream);
                        peerConnection = new PeerConnection(iceOptions, onPeerConnectionReady, onMediaConnected);
                        /*
                        if (lastMediaInfo && lastMediaInfo.sharing) {
                            log("stateCreateOffer() Create data channel ...");
                            dataChannel = peerConnection.createDataChannel(defaultDataChannelLabel, defaultDataChannelOptions);
                            dataChannel.binaryType = defaultDataChannelBinaryType;
                            dataChannel.onopen = onDataChannelOpen;
                            dataChannel.onclose = onDataChannelClose;
                            dataChannel.onerror = onDataChannelError;
                            dataChannel.onmessage = onDataChannelMessage;
                        }
                        */
                        var audio_tracks = localStream.getAudioTracks();
                        var video_tracks = localStream.getVideoTracks();
                        if (audio_tracks.length) peerConnection.addTrack(audio_tracks[0], localStream);
                        if (video_tracks.length) peerConnection.addTrack(video_tracks[0], localStream);
                        //peerConnection.addStream(localStream);
                        peerConnection.createOffer(constraints);
                    }
                },
                function (error) {
                    if (state == states.CREATE_OFFER) {
                        if (local_config.video) {
                            // re-try with audio-only
                            currentUserMedia = {};
                            delete local_config.video;
                            stateCreateOffer(iceServers, local_config);
                        }
                        else {
                            abortCall("Could not alloc media: " + (error.message || error.name || error.constraintName));
                        }
                    }
                }
            );
        }

        var stateCreateAnswer = function (remote_offer, iceServers, local_config) {
            if (remote_offer) {
                closePeerConnection();
                if (gatherTimeout) window.clearTimeout(gatherTimeout);
                gatherTimeout = null;

                // Must get local media capabilities,
                // check against received remote media capabilities
                // (try to find one common codec for every offered media-type)
                log("function stateCreateAnswer(...)");
                log(JSON.stringify(remote_offer));

                // keep remote offer in "remote_channels_offer"
                remote_channels_offer = remote_offer;

                var remote_media_set = {
                    audio: remote_offer.audio_ice.candidate ? "sendrecv" : null,
                    video: remote_offer.video_ice.candidate ? "sendrecv" : null,
                    sharing: remote_offer.collab_ice.candidate ? "recvonly" : null,
                };

                sigAnswer = null;
                log("state=CREATE_ANSWER");
                state = states.CREATE_ANSWER;
                var effectiveMedia = mediaAnd(remote_media_set, /*local_config*/remote_media_set);

                var constraints = {
                    "audio": effectiveMedia.audio,
                    "video": effectiveMedia.video,
                    "sharing": effectiveMedia.sharing
                };

                allocUserMedia(constraints,
                    function (stream) {
                        console.log("allocUserMedia() succeeded (state=" + state + ")");
                        if (state == states.CREATE_ANSWER) {
                            localStream = stream;
                            if (onStream) onStream(id, "local", stream);
                            log("create answer");
                            peerConnection = new PeerConnection(iceOptions, onPeerConnectionReady, onMediaConnected);

                            if (remote_media_set.sharing) {
                                console.log("stateCreateAnswer() Create data channel ...");
                                dataChannel = peerConnection.createDataChannel(defaultDataChannelLabel, defaultDataChannelOptions);
                                dataChannel.binaryType = defaultDataChannelBinaryType;
                                dataChannel.onopen = onDataChannelOpen;
                                dataChannel.onclose = onDataChannelClose;
                                dataChannel.onerror = onDataChannelError;
                                dataChannel.onmessage = onDataChannelMessage;
                            }

                            var audio_tracks = localStream.getAudioTracks();
                            var video_tracks = localStream.getVideoTracks();
                            if (audio_tracks.length) peerConnection.addTrack(audio_tracks[0], localStream);
                            if (video_tracks.length) peerConnection.addTrack(video_tracks[0], localStream);
                            //peerConnection.addStream(localStream);
                            peerConnection.createOffer(constraints);
                        }
                    },
                    function (error) {
                        if (state == states.CREATE_ANSWER) {
                            if (local_config.video) {
                                // re-try with audio-only
                                currentUserMedia = {};
                                delete local_config.video;
                                stateCreateOffer(iceServers, local_config);
                            }
                            else {
                                abortCall("Could not alloc media: " + (error.message || error.name || error.constraintName));
                            }
                        }
                    });
            }
            else {
                abortCall("Offer is null");
            }
        }

        var stateWaitAnswer = function (channels_data) {
        }

        var stateConnected = function (channels_data) {
            if (gatherTimeout) window.clearTimeout(gatherTimeout);
            gatherTimeout = null;

            log("Channel::stateConnected() state=" + state);

            var audioChannel = null, videoChannel = null, dtmfChannel = null, dataChannel = null;

            if (state == states.WAIT_ANSWER) {
                // channels_data is "remote_channels_answer"
                remote_channels_answer = channels_data;

                // read remote coder capabilities and match against local coder capabilities
                for (idx in remote_channels_answer.channels) {
                    var channel = remote_channels_answer.channels[idx];
                    if (!audioChannel && isAudioCodec(channel.coder_name)) audioChannel = channel;
                    if (!videoChannel && isVideoCodec(channel.coder_name)) videoChannel = channel;
                    if (!dtmfChannel && isDtmfCodec(channel.coder_name)) dtmfChannel = channel;
                    if (!dataChannel && isDataCodec(channel.coder_name)) dataChannel = channel;
                }
                sendMediaInfo(audioChannel, videoChannel);

                remote_channels_answer.role = "answer";
                peerConnection.setRemoteDescription(remote_channels_answer);
            }
            else if (state == states.CREATE_ANSWER) {
                // channels_data is "local_channels_answer"
                local_channels_answer = channels_data;
                // Hier habe ich nun das Remote-Offer und das Local-Offer
                // Nun muss ich:
                //  * die Coder-Auswahl treffen (follow remote offer's preference)
                //  * ein CHANNELS-SELECT zum Remote-EP rausschicken (siehe Channel::stateConnected())
                //  * Lokal die Medien-Streams starten
                console.log("Channel::stateConnected() remote_channels_offer: " + JSON.stringify(remote_channels_offer));
                console.log("Channel::stateConnected() local_channels_answer: " + JSON.stringify(local_channels_answer));
                for (i in remote_channels_offer.channels) {
                    var remote = remote_channels_offer.channels[i];
                    for (j in local_channels_answer.channels) {
                        var local = local_channels_answer.channels[j];
                        if (strmatch_i(remote.coder_name, local.coder_name) && (remote.clock_rate === remote.clock_rate)) {
                            if (!audioChannel && isAudioCodec(local.coder_name)) audioChannel = remote;
                            if (!videoChannel && isVideoCodec(local.coder_name)) videoChannel = remote;
                            if (!dtmfChannel && isDtmfCodec(local.coder_name)) dtmfChannel = remote;
                            if (!dataChannel && isDataCodec(local.coder_name)) dataChannel = remote;
                        }
                    }
                }

                // Setup local_channels_answer
                local_channels_answer.channels = [];
                if (audioChannel) local_channels_answer.channels.push(audioChannel);
                if (dtmfChannel) local_channels_answer.channels.push(dtmfChannel);
                if (videoChannel) local_channels_answer.channels.push(videoChannel);
                if (dataChannel) local_channels_answer.channels.push(dataChannel);
                local_channels_answer.count = local_channels_answer.channels.length;

                // Send filtered local_channels_answer as answer to remote endpoint
                send(id, "Answer", local_channels_answer);
                log("state=CONNECTED");
                state = states.CONNECTED;
                sendMediaInfo(audioChannel, videoChannel);

                remote_channels_offer.role = "offer";
                peerConnection.setRemoteDescription(remote_channels_offer);
            }

            if (audioChannel) console.log("Channel::stateConnected() Common audio codec found: " + JSON.stringify(audioChannel));
            if (videoChannel) console.log("Channel::stateConnected() Common video codec found: " + JSON.stringify(videoChannel));
            if (dtmfChannel) console.log("Channel::stateConnected() Common dtmf codec found: " + JSON.stringify(dtmfChannel));
            if (dataChannel) console.log("Channel::stateConnected() Common data codec found: " + JSON.stringify(dataChannel));
        } // end of Channel::stateConnected()

        var sendMediaInfo = function (audioChannel, videoChannel) {
            // setup mediaInfo from channels_answer
            var mediaInfo = {};
            if (audioChannel) { mediaInfo.audio = "sendrecv"; mediaInfo.audioCoder = audioChannel.coder_name; }
            if (videoChannel) { mediaInfo.video = "sendrecv"; mediaInfo.videoCoder = videoChannel.coder_name; }
            if (false) { mediaInfo.sharing = "sendrecv"; mediaInfo.sharingCoder = "JRFB"; }
            if (JSON.stringify(lastMediaInfo) != JSON.stringify(mediaInfo)) {
                lastMediaInfo = mediaInfo;
                send(id, "Info", null, mediaInfo);
            }
        }

        var abortCall = function (message) {
            log("Abort call: " + (message || ""));
            send(id, "CloseRequest", null);
            stateIdle();
        }

        var onDataChannelOpen = function () {
            log("DataChannel opened");
            if (appSharing) appSharing.init(dataChannel);
            if (onSharing) onSharing();
        }

        var onDataChannelClose = function (e) {
            log("DataChannel closed: " + JSON.stringify(e));
            if (appSharing) appSharing.close();
        }

        var onDataChannelError = function (e) {
            log("DataChannel error: " + JSON.stringify(e));
        }

        var onDataChannelMessage = function (event) {
            if (appSharing) appSharing.recv(event.data);
        }

        // public
        this.id = id;

        this.onsigchannels = function (command, remote_channels_data, iceServers, media) {
            if (command == "OfferRequest") stateCreateOffer(iceServers, media);
            else if (command == "Offer") stateCreateAnswer(remote_channels_data, iceServers, media);
            else if (command == "Answer") stateConnected(remote_channels_data);
            else if (command == "CloseRequest") stateIdle();
        }

        this.onsigringon = function () {
            toneGenerator.ringOn();
        }

        this.onsigringoff = function () {
            toneGenerator.ringOff();
        }

        this.onsigtoneon = function (tone, time) {
            toneGenerator.toneOn(tone, time[0], time[1], time[2], time[3], time[4], time[5], time[6], time[7]);
        }

        this.onsigtoneoff = function () {
            toneGenerator.toneOff();
        }

        this.onsigdtmf = function (digits) {
            if (!dtmfSender) {
                var dtmfTrack = null;
                var audioTracks = localStream.getAudioTracks();
                if (audioTracks && audioTracks.length > 0) dtmfTrack = audioTracks[0];
                if (dtmfTrack) dtmfSender = peerConnection.createDTMFSender(dtmfTrack);
            }
            if (dtmfSender && dtmfSender.canInsertDTMF) {
                log("send DTMF digits=" + digits);
                var duration = 500;
                dtmfSender.insertDTMF(digits, duration);
            }
            else {
                log("Can't send DTMF digits=" + digits);
            }
        }

        this.sharing_event = function (type, data) {
            if (appSharing) return appSharing.sharing_event(type, data);
            return false;
        }

        this.close = function () {
            stateIdle();
            toneGenerator.close();
            toneGenerator = null;
            send = null;
            if (onStream && localStream) onStream(id, "local", null);
            localStream = null;
        }
    }

    // constructor
    function OrtcEndpoint(url, username, password, hw, phys, regContext, logFunction, onCall, onAuthenticate) {
        var states = { IDLE: 0, WAIT_CONNECT: 1, CONNECT: 2, WAIT_CREATE_SIG: 3, CREATE_SIG: 4, UP: 5, ERROR: 6, CLOSED: 7 },
            state = states.IDLE,
            userInfo = null,
            timer = new Timer(1000),
            connection = null,
            sigId = 0,
            channels = [],
            localVideo = [], // HTML <video> container(s) provided by app
            remoteVideo = [], // HTML <video> container(s) provided by app
            audioPlayer = null, // HTML <audio> element to play remote audio
            appSharing_canvas = null,
            appSharing_createCb = null,
            appSharing_removeCb = null,
            appSharing_resizeCb = null,
            currentLocalVideoId = null,
            currentRemoteVideoId = null,
            localVideoStream = null,
            remoteVideoStream = null,
            log = logFunction ? function (text) { logFunction("OrtcEndpoint: " + text); } : function () { };

        var stateClosed = function () {
            log("state=CLOSED");
            state = states.CLOSED;
            if (connection) connection.close();
            connection = null;
            sigId = 0;
            closeChannels();
            timer.reset();
        }

        var stateWaitConnect = function (error) {
            if (connection) connection.close();
            connection = null;
            sigId = 0;
            closeChannels();
            log("state=WAIT_CONNECT" + (error ? " error=" + error : ""));
            state = states.WAIT_CONNECT;
            timer.start(stateConnect);
        }

        var stateConnect = function () {
            if (connection) connection.close();
            connection = null;
            sigId = 0;
            closeChannels();
            log("state=CONNECT");
            state = states.CONNECT;
            connection = new Connection(url, username, password);
            connection.onauthenticate = onAuthenticate;
            connection.onconnected = onconnected;
            connection.onerror = onerror;
            connection.onclosed = onclosed;
            connection.onsigcreated = onsigcreated;
            connection.onsigdeleted = onsigdeleted;
            connection.onsigchannels = onsigchannels;
            connection.onsigringon = onsigringon;
            connection.onsigringoff = onsigringoff;
            connection.onsigtoneon = onsigtoneon;
            connection.onsigtoneoff = onsigtoneoff;
            connection.onsigdtmf = onsigdtmf;
            connection.onsigcalladded = onsigcalladded;
            connection.onsigcallremoved = onsigcallremoved;
            connection.onsigcallupdated = onsigcallupdated;
        }

        var stateWaitCreateSig = function (error) {
            sigId = 0;
            closeChannels();
            log("state=WAIT_CREATE_SIG" + (error ? " error=" + error : ""));
            state = states.WAIT_CREATE_SIG;
            timer.start(stateCreateSig);
        }

        var stateCreateSig = function () {
            sigId = 0;
            closeChannels();
            log("state=CREATE_SIG");
            state = states.CREATE_SIG;
            connection.sendCreateSig(hw, phys, onCall ? true : false, regContext, true);
        }

        var stateUp = function (id) {
            closeChannels();
            log("state=UP id=" + id);
            state = states.UP;
            timer.reset();
            sigId = id;
        }

        var stateError = function (error) {
            if (connection) connection.close();
            connection = null;
            sigId = 0;
            closeChannels();
            log("state=ERROR" + (error ? " error=" + error : ""));
            state = states.ERROR;
        }

        // callbacks from websocket
        var onconnected = function (info) {
            userInfo = info;
            timer.reset();
            stateCreateSig();
        }

        var onerror = function (error) {
            if (state != states.CLOSED) stateWaitConnect(error);
        }

        var onclosed = function () {
            if (state != states.CLOSED) stateWaitConnect();
        }

        var onsigcreated = function (id, error) {
            if (error) {
                stateWaitCreateSig(error);
            }
            else {
                stateUp(id);
            }
        }

        var onsigdeleted = function (id) {
            if (id == sigId) {
                stateWaitCreateSig();
            }
        }

        var onsigchannels = function (id, channelId, command, channels_data, iceServers, media) {
            if (id == sigId) {
                iceServers = iceServers || [];
                media = media || {};
                log("recv SigChannels ch=" + channelId + ", cmd=" + command + " channels_data=" + channels_data + " iceServers=" + JSON.stringify(iceServers) + " media=" + JSON.stringify(media));
                var channel = getChannel(channelId);
                channel.onsigchannels(command, channels_data, iceServers, media);
            }
        }

        var onsigringon = function (id, channelId) {
            if (id == sigId) {
                log("recv SigRingOn ch=" + channelId);
                var channel = getChannel(channelId);
                channel.onsigringon();
            }
        }

        var onsigringoff = function (id, channelId) {
            if (id == sigId) {
                log("recv SigRingOff ch=" + channelId);
                var channel = getChannel(channelId);
                channel.onsigringoff();
            }
        }

        var onsigtoneon = function (id, channelId, tone, time) {
            if (id == sigId) {
                log("recv SigToneOn ch=" + channelId + ", tone=" + tone + ", time=" + JSON.stringify(time));
                var channel = getChannel(channelId);
                channel.onsigtoneon(tone, time);
            }
        }

        var onsigtoneoff = function (id, channelId) {
            if (id == sigId) {
                log("recv SigToneOff ch=" + channelId);
                var channel = getChannel(channelId);
                channel.onsigtoneoff();
            }
        }

        var onsigdtmf = function (id, channelId, digit) {
            if (id == sigId) {
                log("recv SigDtmf ch=" + channelId + " digit=" + digit);
                var channel = getChannel(channelId);
                channel.onsigdtmf(digit);
            }
        }

        var onsigcalladded = function (id, call) {
            if (id == sigId) {
                log("recv SigCallAdded call=" + JSON.stringify(call));
                if (onCall) onCall("added", call);
            }
        }

        var onsigcallremoved = function (id, call) {
            if (id == sigId) {
                log("recv SigCallRemoved call=" + JSON.stringify(call));
                if (onCall) onCall("removed", call);
            }
        }

        var onsigcallupdated = function (id, call) {
            if (id == sigId) {
                log("recv SigCallUpdated call=" + JSON.stringify(call));
                if (onCall) onCall("updated", call);
            }
        }

        var onsharing = function () {
            sharingEvent('setcontainer', appSharing_canvas);
            sharingEvent('createAppCallback', appSharing_createCb);
            sharingEvent('removeAppCallback', appSharing_removeCb);
            sharingEvent('resizeAppCallback', appSharing_resizeCb);
        }

        var onstream = function (id, type, stream) {
            var hasAudio = (stream && stream.getAudioTracks() && stream.getAudioTracks().length);
            var hasVideo = (stream && stream.getVideoTracks() && stream.getVideoTracks().length);
            log("OrtcEndpoint::onstream() " + id + " " + type + ":" + (hasAudio ? " audio" : "") + (hasVideo ? ", video" : "") + (!stream ? " null" : ""));
            if (stream && hasVideo) {
                if (type == "local") {
                    currentLocalVideoId = id;
                    localVideoStream = stream;
                    console.log("OrtcEndpoint::onstream() localVideo.length=" + localVideo.length);
                    var len = localVideo.length;
                    for (var i = 0; i < len; i++) {
                        var objectURL = window.URL.createObjectURL(stream);
                        log("OrtcEndpoint::onstream() start local video playback: objectURL=" + objectURL);
                        localVideo[i].autoplay = true;
                        localVideo[i].src = objectURL;
                    }
                }
                else if (type == "remote") {
                    currentRemoteVideoId = id;
                    remoteVideoStream = stream;
                    console.log("OrtcEndpoint::onstream() remoteVideo.length=" + remoteVideo.length);
                    var len = remoteVideo.length;
                    for (var i = 0; i < len; i++) {
                        var objectURL = window.URL.createObjectURL(stream);
                        log("OrtcEndpoint::onstream() start remote video playback: objectURL=" + objectURL);
                        remoteVideo[i].autoplay = true;
                        remoteVideo[i].src = objectURL;
                    }
                    if (audioPlayer) {
                        audioPlayer.pause();
                        audioPlayer = null;
                    }
                }
            }
            else {
                if (stream && hasAudio) {
                    if (type == "remote") {
                        if (!audioPlayer) audioPlayer = document.createElement("audio");
                        audioPlayer.autoplay = true;
                        audioPlayer.srcObject = stream;
                    }
                }
                if (type == "local" && id == currentLocalVideoId) {
                    log("stop local video playback");
                    currentLocalVideoId = null;
                    localVideoStream = null;
                }
                else if (type == "remote" && id == currentRemoteVideoId) {
                    log("stop remote video playback");
                    currentRemoteVideoId = null;
                    remoteVideoStream = null;
                }
            }
        }

        var sendSigChannels = function (channelsId, command, channels_data, media) {
            if (state == states.UP) {
                log("send SigChannels ch=" + channelsId + ", cmd=" + command + " channels_data=" + JSON.stringify(channels_data) + " media=" + JSON.stringify(media));
                connection.sendSigChannelsData(sigId, channelsId, command, channels_data, media);
            }
        }

        var getChannel = function (channelId) {
            for (var i in channels) {
                if (channels[i].id == channelId) return channels[i];
            }
            var displayName = userInfo.dn || userInfo.cn || userInfo.name || null;
            var ch = new Channel(channelId, sendSigChannels, displayName, onstream, onsharing, log);
            channels.push(ch);
            return ch;
        }

        var closeChannels = function () {
            var ch;
            while (ch = channels.pop()) ch.close();
        }

        var sharingEvent = function (type, data) {
            var ret = false;
            for (var i in channels) {
                var ret1 = channels[i].sharing_event(type, data);
                if (ret1 != 'unknown') ret = ret1;
            }
            return ret;
        }

        // public
        this.close = function () {
            stateClosed();
        }

        this.setAuthentication = function (username, clientNonce, digest) {
            if (connection) connection.setAuthentication(username, clientNonce, digest);
        }

        this.attachSharing = function (sharingDiv, createAppCallback, removeAppCallback, resizeCallbck) {
            appSharing_canvas = sharingDiv;
            appSharing_createCb = createAppCallback;
            appSharing_removeCb = removeAppCallback;
            appSharing_resizeCb = resizeCallbck;
            onsharing();
        }

        this.detachSharing = function (canvas) {
            if ((canvas != null) && (canvas == appSharing_canvas)) {
                appSharing_canvas = null;
                appSharing_createCb = null;
                appSharing_removeCb = null;
                appSharing_resizeCb = null;
                onsharing();
            }
        }

        this.attachVideo = function (local, remote) {
            if (local) {
                log("OrtcEndpoint::attachVideo() local video display: " + local);
                localVideo.push(local);
                if (localVideoStream) {
                    var objectURL = window.URL.createObjectURL(localVideoStream);
                    log("OrtcEndpoint::attachVideo() start local video playback: objectURL=" + objectURL);
                    local.autoplay = true;
                    try { local.src = objectURL; }
                    catch (err) { console.error("OrtcEndpoint::attachVideo() local video error: " + err); }
                }
            }
            if (remote) {
                log("OrtcEndpoint::attachVideo() remote video display: " + remote);
                remoteVideo.push(remote);
                if (remoteVideoStream) {
                    var objectURL = window.URL.createObjectURL(remoteVideoStream);
                    log("OrtcEndpoint::attachVideo() start remote video playback: objectURL=" + objectURL);
                    remote.autoplay = true;
                    try { remote.src = objectURL; }
                    catch (err) { console.error("OrtcEndpoint::attachVideo() remote video error: " + err); }
                }
            }
        }

        this.detachVideo = function (local, remote) {
            var len = localVideo.length;
            for (var i = 0; i < len; i++) {
                if (localVideo[i] == local) {
                    if (localVideoStream) log("stop local video playback");
                    log("OrtcEndpoint::detachVideo() local video display: " + local);
                    localVideo.splice(i, 1);
                    break;
                }
            }
            len = remoteVideo.length;
            for (var i = 0; i < len; i++) {
                if (remoteVideo[i] == remote) {
                    if (remoteVideoStream) log("stop remote video playback");
                    log("OrtcEndpoint::detachVideo() remote video display: " + remote);
                    remoteVideo.splice(i, 1);
                    break;
                }
            }
        }

        this.sharingEvent = function (type, data) {
            return sharingEvent(type, data);
        }

        this.initCall = function (name, number, video, sharing) {
            if (onCall && state == states.UP) {
                log("send SigCallInit name=" + name + ", number=" + number + " video=" + video + " sharing=" + sharing);
                connection.sendSigCallInit(sigId, name, number, video, sharing);
            }
        }

        this.connectCall = function (id) {
            if (onCall && state == states.UP) {
                log("send SigCallConnect id=" + id);
                connection.sendSigCallConnect(sigId, id);
            }
        }

        this.clearCall = function (id) {
            if (onCall && state == states.UP) {
                id = id || null;
                log("send SigCallClear id=" + id);
                connection.sendSigCallClear(sigId, id);
            }
        }

        this.dtmfCall = function (id, digits) {
            if (channels.length) {
                channels[0].onsigdtmf(digits);
                return;
            }
            if (onCall && state == states.UP) {
                log("send SigCallDtmf id=" + id + "digits=" + digits);
                connection.sendSigCallDtmf(sigId, id, digits);
            }
        }

        // start right away
        if (ORTCSupported) stateConnect();
        else stateError("browser does not support ORTC");
    }

    // public
    return {
        Endpoint: OrtcEndpoint,
        supported: ORTCSupported,
        activateTestMode: activateTestMode,
        allocChannel: allocChannel,
    };
})(window);

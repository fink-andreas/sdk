/*---------------------------------------------------------------------------*/
/* innovaphone.pbxwebsocket.Preauthentication.js                             */
/* A client for pre-authenticating and creating a session in the PBX for     */
/* regular authentication                                                    */
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
/// <reference path="../common/innovaphone.common.Crypto.js" />

var innovaphone = innovaphone || {};
innovaphone.pbxwebsocket = innovaphone.pbxwebsocket || {};
innovaphone.pbxwebsocket.Preauthentication = innovaphone.pbxwebsocket.Preauthentication || (function () {

    // dependencies
    var Connection = innovaphone.pbxwebsocket.Connection,
        Crypto = innovaphone.common.crypto;

    // private
    function arrayContains(array, item) {
        if (array && item) {
            var len = array.length;
            for (var i = 0; i < len; i++) if (array[i] == item) return true;
        }
        return false;
    }

    // public
    function createSessionConnected(connection, username, password, callback, logFunction) {
        var states = { WAIT_CHALLENGE: 0, WAIT_RESULT: 1, FINISHED: 2 },
            state = states.WAIT_CHALLENGE,
            log = logFunction ? function (text) { logFunction("createSession: " + text); } : function () { };

        var stateWaitChallenge = function () {
            log("creating session for " + username);
            log("send PreauthRequest");
            state = states.WAIT_CHALLENGE;
            connection.onpreauthchallenge = onpreauthchallenge;
            connection.onpreauthresult = onpreauthresult;
            connection.sendPreauthRequest();
        }

        var stateWaitResult = function (response) {
            log("send PreauthResponse");
            state = states.WAIT_RESULT;
            connection.sendPreauthResponse("ntlm", username, response);
        }

        var stateFinished = function (result, sessionUsername, sessionPassword) {
            log(result == "ok" ? "session " + sessionUsername + " created" : "creating session failed");
            state = states.FINISHED;
            connection.onpreauthchallenge = function () { };
            connection.onpreauthresult = function () { };
            if (callback) callback(result, sessionUsername, sessionPassword);
        }
        
        // callbacks from websocket
        var onpreauthchallenge = function (authTypes, challenge) {
            log("recv PreauthChallenge");
            if (state == states.WAIT_CHALLENGE && arrayContains(authTypes, "ntlm") && challenge) {
                var response = Crypto.ntlmResponse(password, challenge);
                stateWaitResult(response);
            }
            else {
                stateFinished("error");
            }
        }

        var onpreauthresult = function (result, seed, encryptedUsername, encryptedPassword) {
            log("recv PreauthResult");
            if (state == states.WAIT_RESULT) {
                if (result == "ok" && seed && encryptedUsername && encryptedPassword) {
                    var sessionKey = Crypto.ntlmSessionKey(password);
                    var sessionUsername = Crypto.rc4("innovaphonePbxWebsocket:encryptedUsername:" + seed + ":" + sessionKey, Crypto.hex2str(encryptedUsername));
                    var sessionPassword = Crypto.rc4("innovaphonePbxWebsocket:encryptedPassword:" + seed + ":" + sessionKey, Crypto.hex2str(encryptedPassword));
                    stateFinished(result, sessionUsername, sessionPassword);
                }
                else {
                    stateFinished(result);
                }
            }
            else {
                stateFinished("error");
            }
        }

        stateWaitChallenge();
    }

    function deleteSessionConnected(connection, sessionUsername, sessionPassword, callback, logFunction) {
        var states = { WAIT_RESULT: 0, FINISHED: 1 },
            state = states.WAIT_RESULT,
            log = logFunction ? function (text) { logFunction("deleteSession: " + text); } : function () { };

        var stateWaitResult = function () {
            log("deleting session " + sessionUsername);
            log("send PreauthDelete");
            state = states.WAIT_RESULT;
            connection.onpreauthdeleteresult = onpreauthdeleteresult;
            var digest = Crypto.sha256("innovaphonePbxWebsocket:PreauthDelete:" + sessionUsername + ":" + sessionPassword);
            connection.sendPreauthDelete(sessionUsername, digest);
        }

        var stateFinished = function (result) {
            log(result == "ok" ? "session " + sessionUsername + " deleted" : "session not deleted");
            connection.onpreauthdeleteresult = function () { };
            state = states.FINISHED;
            if (callback) callback(result);
        }

        // callbacks from websocket
        var onpreauthdeleteresult = function (result) {
            log("recv PreauthDeleteResult");
            stateFinished(result);
        }

        stateWaitResult();
    }

    function createSession(url, username, password, callback, logFunction) {
        var states = { CONNECT: 0, CREATE_SESSION: 1, CLOSED: 2 },
            state = states.CONNECT,
            connection = null,
            log = logFunction ? function (text) { logFunction("createSession: " + text); } : function () { };

        var stateConnect = function () {
            log("state=CONNECT");
            state = states.CONNECT;
            connection = new Connection(url);
            connection.onconnected = onconnected;
            connection.onclosed = onclosed;
            connection.onerror = onerror;
        }

        var stateCreateSession = function () {
            log("state=CREATE_SESSION");
            state = states.CREATE_SESSION;
            createSessionConnected(connection, username, password, stateClosed, logFunction);
        }

        var stateClosed = function (result, sessionUsername, sessionPassword) {
            log("state=CLOSED");
            state = states.CLOSED;
            connection.close();
            connection = null;
            if (callback) callback(result, sessionUsername, sessionPassword);
        }

        // callbacks from websocket
        var onconnected = function () {
            stateCreateSession();
        }

        var onerror = function (error) {
            if (state != states.CLOSED) {
                log("websocket error: " + error);
                stateClosed("error");
            }
        }

        var onclosed = function () {
            if (state != states.CLOSED) stateClosed("error");
        }

        stateConnect();
    }

    function deleteSession(url, sessionUsername, sessionPassword, callback, logFunction) {
        var states = { CONNECT: 0, DELETE_SESSION: 1, CLOSED: 2 },
            state = states.CONNECT,
            connection = null,
            log = logFunction ? function (text) { logFunction("deleteSession: " + text); } : function () { };

        var stateConnect = function () {
            log("state=CONNECT");
            state = states.CONNECT;
            connection = new Connection(url);
            connection.onconnected = onconnected;
            connection.onclosed = onclosed;
            connection.onerror = onerror;
        }

        var stateDeleteSession = function () {
            log("state=DELETE_SESSION");
            state = states.DELETE_SESSION;
            deleteSessionConnected(connection, sessionUsername, sessionPassword, stateClosed, logFunction);
        }

        var stateClosed = function (result) {
            log("state=CLOSED");
            state = states.CLOSED;
            connection.close();
            connection = null;
            if (callback) callback(result);
        }

        // callbacks from websocket
        var onconnected = function () {
            stateDeleteSession();
        }

        var onerror = function (error) {
            if (state != states.CLOSED) {
                log("websocket error: " + error);
                stateClosed("error");
            }
        }

        var onclosed = function () {
            if (state != states.CLOSED) {
                log("websocket closed");
                stateClosed("error");
            }
        }

        stateConnect();
    }

    // public
    return {
        createSession: createSession,
        deleteSession: deleteSession,
        createSessionConnected: createSessionConnected,
        deleteSessionConnected: deleteSessionConnected
    };
})();

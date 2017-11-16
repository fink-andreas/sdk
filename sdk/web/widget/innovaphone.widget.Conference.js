
var innovaphone = innovaphone || {};
innovaphone.widget = innovaphone.widget || {};
innovaphone.widget.pathPrefix = innovaphone.widget.pathPrefix || "";
innovaphone.widget.Conference = innovaphone.widget.Conference || (function () {

    function _Conference() {
        /*
         * Selectors
         */
    	instanceConference = this;
        instanceConference.widgetWrapper      = document.querySelector('#supporters-card-container');
        instanceConference.sharingWrapper     = document.querySelector('#remote-application-container');
        instanceConference.endpoint           = null;
        instanceConference.connection         = null;
        instanceConference.activity           = null;
        instanceConference.supporters         = [];
        instanceConference.currentSupporter   = null;
        instanceConference.call               = null;
        instanceConference.sharing_window 	  = null;
        instanceConference.sharing_window_attached = false;

        /*
         * Default options
         */
        var defaults = {
            urlPbx: "wss://pbx.example.com/PBX0/WEBSOCKET/websocket",
            urlAuth: "https://www.example.com/WidgetAuth.php",
            pathPrefix: "",
            remoteMaxWidth: "0",
            username: null,
            password: null,
            device: null,
            physicalLocation: null,
            regContext: "0",

            image: 'dummy.jpg',
            companyName: 'Company',
            companyStreet: 'Address 1',
            companyCity: 'Address 2',
            companyTrunk: '+01 123 / 12345 - 0',
            companyFax: '+01 123 / 12345 - 9',
            companyEmail: 'info@example.com',
            video: false,
            sharing: false,

            translations: {
     			available: "Available",
     			unavailable: "Not available",
     			call: "Call",
     			videocall: "Videocall",
     			email: "Email",
     			confirm: "By leaving this website, your connection will be terminated. Please use the right click to open a new tab.",
     			unsupported: "Your Browser does not support WebRTC",
     			enterdtmf: "Please enter the DTMF digits"
            },

            status: {
                available: {text: 'Verfügbar', className: 'available', active: true},
                away: {text: 'Abwesend', className: 'not-available', active: false},
                lunch: {text: 'Beim Essen', className: 'not-available', active: false},
                vacation: {text: 'Im Urlaub', className: 'not-available', active: false},
                busy: {text: 'Beschäftigt', className: 'offline', active: false},
                dnd: {text: 'Nicht stören', className: 'offline', active: false},
                closed: {text: 'Offline', className: 'offline', active: false}
            },

            mute: 'unmute'
        };

        /*
         * Check if arguments are passed at widget initialization.
         * If not use default options
         */
        if (arguments[0] && typeof arguments[0] === "object") {
            instanceConference.options = extendDefaults(defaults, arguments[0]);
        }else{
            instanceConference.options = defaults;
        }

        /*
         * Init!
         */
        init.call(instanceConference);
    };

    /*
     * ============================================
     *  Public methods
     * ============================================
     *
     */
    _Conference.prototype.prepareCall = function(clickedCardClass, clickedCardIndex, shortcut, phone, video, sharing){
        instanceConference.currentSupporter = instanceConference.supporters[clickedCardIndex];
        instanceConference.clickedCardClass = clickedCardClass;
        instanceConference.options.video = video;
        instanceConference.options.sharing = sharing;
    	instanceConference.displayname = shortcut || phone;
    	instanceConference.displaynumber = phone;
        initCall(shortcut, phone, video, sharing, instanceConference.endpoint);
    };

    /*
     * ============================================
     * Private methods
     * ============================================
     *
     */

    /*
     * Load innovaphone webrtc
     */
    function init(){
        innovaphone.pbxwebsocket.PathPrefix = instanceConference.options.pathPrefix;
        innovaphone.applicationSharing.PathPrefix = instanceConference.options.pathPrefix;
        var WebRtcEndpoint = innovaphone.pbxwebsocket.WebRtc.Endpoint;
        var Connection = innovaphone.pbxwebsocket.Connection;

        if (instanceConference.endpoint) instanceConference.endpoint.close();
        instanceConference.endpoint = new WebRtcEndpoint(instanceConference.options.urlPbx, instanceConference.options.username, instanceConference.options.password, instanceConference.options.device, instanceConference.options.physicalLocation, instanceConference.options.regContext, logFunction, onCall.bind(instanceConference), instanceConference.onAuthenticateWebRtc);

        if (instanceConference.connection) instanceConference.connection.close();
        instanceConference.connection = new Connection(instanceConference.options.urlPbx, instanceConference.options.username, instanceConference.options.password);
        instanceConference.connection.onauthenticate      = instanceConference.onAuthenticate;
        instanceConference.connection.onconnected         = onConnected.bind(instanceConference);
        instanceConference.connection.onerror             = onError.bind(instanceConference);
        instanceConference.connection.onclosed            = onClosed.bind(instanceConference);
        instanceConference.connection.onendpointpresence  = onEndpointPresence.bind(instanceConference);
    }


    /*
     * AUTHENTICATION
     */
    function getXmlTag(xml, tag) {
        var from, to = null;
        from = xml.search("<"+tag+">")+tag.length+2;
        to = xml.search("</"+tag+">");
        return xml.substring(from, to);
    }

    _Conference.prototype.onAuthenticateWebRtc = function(realm, sessionId, serverNonce) {
        var xmlHttp = new XMLHttpRequest();

        if (xmlHttp) {
            xmlHttp.open('GET', instanceConference.options.urlAuth + '?SID=' + sessionId+'&SNO='+serverNonce, true);
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState == 4) {
                    var xmlDoc = xmlHttp.responseText;
                    var username = getXmlTag(xmlDoc, "username");
                    var clientNonce = parseInt(getXmlTag(xmlDoc, "clientNonce"));
                    var digest = getXmlTag(xmlDoc, "digest");
                    instanceConference.endpoint.setAuthentication(username, clientNonce, digest);
               }
            };
            xmlHttp.send(null);
        }
    }

    _Conference.prototype.onAuthenticate = function(realm, sessionId, serverNonce) {
        var xmlHttp = new XMLHttpRequest();

        if (xmlHttp) {
            xmlHttp.open('GET', instanceConference.options.urlAuth + '?SID=' + sessionId+'&SNO='+serverNonce, true);
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState == 4) {
                    var xmlDoc = xmlHttp.responseText;
                    var username = getXmlTag(xmlDoc, "username");
                    var clientNonce = parseInt(getXmlTag(xmlDoc, "clientNonce"));
                    var digest = getXmlTag(xmlDoc, "digest");
                    instanceConference.connection.setAuthentication(username, clientNonce, digest);
               }
            };
            xmlHttp.send(null);
        }
    }

    /*
     * Extend default options with options passed as
     * arguments at widget initialization
     */
    function extendDefaults(source, properties) {
        var property;
        for (property in properties) {
            if (properties.hasOwnProperty(property)) {
                source[property] = properties[property];
            }
        }
        return source;
    }

    function logFunction(text) {
        console.log("WebRTC demo: " + text);
    }

    function onConnected(userInfo) {
        for(var i=0; i<instanceConference.options.supporters.length; i++){
            instanceConference.connection.sendSubscribeEndpoint(instanceConference.options.supporters[i].shortcut, null);
        }
    }
    function onError(error) {
        console.log("Error: " + error);
        console.log(error);
    }
    function onClosed() {
      console.log("Closed");
    }

    function createNewApplication(id, name) {
        var sharing_local = document.getElementById("sharing-local");
        if (sharing_local && !document.getElementById("appSharing_" + id)) {
            var new_app = document.createElement("input");
            new_app.setAttribute("id", "appSharing_" + id);
            new_app.setAttribute("value", name);
            new_app.setAttribute("type", "button");
            new_app.onclick = function () { instanceConference.endpoint.sharingEvent('changeDisplayApp', id); };
            sharing_local.appendChild(new_app);
        }
    }

    function removeApplication(id) {
        var input_b = document.getElementById("appSharing_" + id);
        if(input_b) document.getElementById("sharing-local").removeChild(input_b);
    }

    function sharingWindow(width, height) {
		if (instanceConference.sharing_window && !instanceConference.sharing_window.closed) {
			instanceConference.sharing_window.focus();
		}
		else {
			instanceConference.sharing_window = window.open(instanceConference.options.pathPrefix+"mypbx_sharing.html", "", "width="+width+", height="+height);
		}
		if (instanceConference.endpoint) {
			instanceConference.endpoint.sharingEvent('setname', instanceConference.displayname);
		}


        /* close */
        if (sharing) {
            if (that.sharing_window && !that.sharing_window.closed) {
                if (that.webrtc_connection) {
                    that.webrtc_connection.sharingEvent('setname', '');
                    that.sharing_window.document.title = "";
                }
                that.sharing_window.close();
            }
            that.sharing_window = null;
        }

    }

    function resizeApplication() {
        var maxWidth = parseInt(instanceConference.options.remoteMaxWidth);
        if (maxWidth > 0) {
            var sharing_local = document.getElementById("sharing-local");
            if (sharing_local) {
                var myCanvas = null;
                for (i = 0; i < sharing_local.childNodes.length; i++) {
                    if (sharing_local.childNodes[i].nodeName == 'CANVAS' || sharing_local.childNodes[i].nodeName == 'canvas') {
                        myCanvas = sharing_local.childNodes[i];
                        break;
                    }
                }
                var new_width = parseInt(myCanvas.style.width);
                var new_height = parseInt(myCanvas.style.height);
                console.log("new width: "+myCanvas.style.width);
                if (myCanvas && (new_width > maxWidth)) {

                    if  (!document.getElementById("fitid")) {
                        var new_fitbutton = document.createElement("input");
                        new_fitbutton.setAttribute("id", "fitid");
                        new_fitbutton.setAttribute("type", "button");
                        new_fitbutton.setAttribute("title", "herauslösen");
                        window_width = new_width + 12 + 12; /* left & right */
                        window_height = new_height + 33 + 12; /* top + 25 & bottom */
                        new_fitbutton.onclick = function () { sharingWindow(window_width, window_height); };
                        sharing_local.appendChild(new_fitbutton);
                    }

                 }

                if (myCanvas && (new_width <= maxWidth)) {
                    var fitid = document.getElementById("fitid")
                    if  (fitid) document.getElementById("sharing-local").removeChild(fitid);
                }

                   /*
                    <input id="fitid" type="button" style="margin-top: -1px; width: 25px; height: 25px; border: none; float: right; top: 0; background: url('fit_window_size.png') no-repeat; outline: none;" onclick="fitToElement();" title="An Fenster anpassen">
                    */

                    /*var new_height = parseInt(myCanvas.style.height);
                    var set_height = Math.ceil(maxWidth * new_height / new_width);
                    myCanvas.style.width = maxWidth+"px";
                    myCanvas.style.height = set_height+"px";*/
            }
        }
    }

    function onCall(event, call) {
        instanceConference.call = call;
        instanceConference.activity = instanceConference.options.status['available'];

        /*
         * Change view to active view with big supporter image
         * Add close call event to active phone icon
         */
        if(event==='updated' && call.state !== 'disconnecting' && call.state !== 'disconnected'){
            createActiveCallView.call(instanceConference);

            var videoElementLocal = document.querySelector('#innovaphone-widget-video-local');
            videoElementLocal.style.display = (instanceConference.options.video) ? 'block' : 'none';

            var activeIcon = document.querySelector('#iconActiveCall');
            /* activeIcon.style.background = '#ff3333'; */
            activeIcon.onclick = function(e) {
                clearCall.call(instanceConference, call.id);
                createWidget.call(instanceConference, instanceConference.currentSupporter);
            }

            var keypadIcon = document.querySelector('#iconKeypad');
            keypadIcon.onclick = function(e) {
                var dtmfDigits = prompt(instanceConference.options.translations.enterdtmf, "");
                dtmfCall.call(instanceConference, call.id, dtmfDigits);
            }

            var muteIcon = document.querySelector('#iconMute');
            muteIcon.onclick = function(e) {
                if (instanceConference.options.mute !== 'mute') {
                    instanceConference.options.mute = 'mute';
                    muteIcon.style.background = '#ffbb33';
                } else {
                    instanceConference.options.mute = 'unmute';
                    muteIcon.style.background = '#474747';
                }
            }

            if(call.state === 'connected'){
	            instanceConference.endpoint.attachVideo(document.querySelector("#innovaphone-widget-video-local"), document.querySelector("#innovaphone-widget-video-remote"));
	        	//var winURL = 'shared.html';
	            //var winName = 'innovaphone Application Sharing';
	            //var winSize = 'width=660,height=620,scrollbars=yes';
	            //var newwindow = window.open(winURL, winName, winSize);
                if (call.sharing) {
                    createRemoteApplicationView.call(instanceConference);
                    instanceConference.endpoint.attachSharing(document.getElementById("sharing-local"), createNewApplication, removeApplication, resizeApplication);
                }
            }
        }

        if (call.state === 'connected') {
            var callButton = document.querySelector('#call-button');
            callButton.src = instanceConference.options.pathPrefix + "innovaphone.widget.phone.svg";
        }


        /*
         * Close call, remove active view and redraw standard widget
         */
        if(event==='removed' || call.state == "disconnected") {
            createWidget.call(instanceConference, instanceConference.currentSupporter);
            removeRemoteApplicationView.call();
            instanceConference.call = null;

        }
    }

    function close() {
        if (instanceConference.connection) {
        	instanceConference.endpoint.detachSharing();
        	instanceConference.connection.close();
        }
        instanceConference.connection = null;
    }

    function initCall(name, number, video, sharing, endpoint) {
        if (endpoint) endpoint.initCall(name, number, video, sharing, endpoint);
    }

    function clearCall(id) {
        if (instanceConference.sharing_window) instanceConference.sharing_window.window.close();
        if (instanceConference.endpoint) instanceConference.endpoint.clearCall(id);
    }

    function dtmfCall(id, digits) {
        if (instanceConference.endpoint) instanceConference.endpoint.dtmfCall(id, digits);
    }


    /*
     * Method is called on supporter's status change
     */
    function onEndpointPresence(name, number, phoneStatus, imStatus, activity, note) {
        /*
         * Set supporters status globally
         */
        updateSupporterStatus(name, phoneStatus, imStatus, activity, note);

        if(instanceConference.call) return;
        var activeSupporter     = 0;
        var lastSupporter       = instanceConference.supporters[0];

        createWidget.call(instanceConference, instanceConference.supporters);

        /*
         * If no WebRTC is supported
         */
        if (!innovaphone.pbxwebsocket.WebRtc.supported) {
            var tooltips = document.querySelectorAll('.innovaphone-tooltip');
            document.querySelector('.iconCall').classList.remove('available');
            document.querySelector('.iconVideo').classList.remove('available');
            tooltips[0].innerHTML = instanceConference.options.translations.unsupported;
            tooltips[0].classList.add('innovaphone-tooltip--smaller');
            tooltips[1].innerHTML = instanceConference.options.translations.unsupported;
            tooltips[1].classList.add('innovaphone-tooltip--smaller');
        }
    }

    /*
     * Add status properties to global supporters object
     */
    function updateSupporterStatus(nameKey, phoneStatus, imStatus, activity, note) {
        instanceConference.supporters = instanceConference.options.supporters;
        for (var i=0; i < instanceConference.supporters.length; i++) {
            if (instanceConference.supporters[i].shortcut === nameKey) {
                instanceConference.supporters[i].phoneStatus = phoneStatus;
                instanceConference.supporters[i].imStatus    = imStatus;
                instanceConference.supporters[i].activity    = activity;
                instanceConference.supporters[i].note        = note;

                // set current supporter
                instanceConference.currentSupporter = instanceConference.supporters[i];

                return instanceConference.supporters[i];
            }
        }
    }

    /*
     * Create markup for HTML widget
     */
    function createWidget(supporters){
        instanceConference.widgetWrapper      = document.querySelector('#supporters-card-container');
        instanceConference.widgetWrapper.innerHTML = '';

        var view = '';
        instanceConference.supporters = instanceConference.options.supporters;
            for (var i=0; i < instanceConference.supporters.length; i++) {
                var supporter = instanceConference.supporters[i];
                var clickedCardClass = 'card-' + i;
                var status = (supporter.imStatus === "open" && supporter.activity === '') ? instanceConference.options.translations.available : instanceConference.options.translations.unavailable;
                var statusClass = (supporter.imStatus === "open" && supporter.activity === '') ? 'available' : 'offline';
                var activity = (supporter.imStatus === "open") ? 'available' : 'closed'; // MW 25.02.2016: fixed
                //var activity = (supporter.imStatus === "open" && supporter.activity === '') ? 'available' : 'closed'; // MW 25.02.2016: fixed
                var phoneClick = (activity == 'available') ? 'onclick="instanceConference.prepareCall(\''+clickedCardClass+'\', ' + i + ', \''+supporter.shortcut+'\', \''+ supporter.phone +'\', false, false)"' : '';
                var videoClick = (activity == 'available') ? 'onclick="instanceConference.prepareCall(\''+clickedCardClass+'\', ' + i + ', \''+supporter.shortcut+'\', \''+ supporter.phone +'\', true, false)"' : '';

                view+= '<div class="innovaphone-root-visitenkarten '+ clickedCardClass +'">'+
                            '<div class="innovaphone-image">'+
                                 '<img src="'+ supporter.img +'" class="innovaphone-tab__supporter-img '+ statusClass +'" alt="">'+
                            '</div>'+
                            '<div class="innovaphone-content">'+
                                 '<div class="innovaphone-content__headline">'+
                                      '<strong>'+ supporter.name +' | '+ supporter.department +'</strong>'+
                                 '</div>'+
                                 '<div class="innovaphone-content__status">'+
                                      '<div class="innovaphone-content__status__indicator '+ statusClass +'"></div> '+ status +
                                 '</div>'+
                                 '<div class="innovaphone-content__address">'+
                                      '<address><strong>'+ instanceConference.options.companyName +'</strong><br>'+ instanceConference.options.companyStreet +'<br>'+ instanceConference.options.companyCity +'<br><br>Tel. '+ instanceConference.options.companyTrunk +' - '+ supporter.phone + '<br><a href="mailto:'+ supporter.email +'">'+ supporter.email +'</a></address>'+
                                 '</div>'+
                            '</div>'+
                            '<div class="innovaphone-tab">'+
                                 '<div class="innovaphone-icons">'+
                                      '<div><a href="#" class="iconCall innovaphone-icons__item '+activity+'" '+phoneClick+'>'+
                                           '<div class="innovaphone-tooltip">'+instanceConference.options.translations.call+'</div>'+
                                           '<img src="' + instanceConference.options.pathPrefix + 'innovaphone.widget.phone.svg" alt="">' +
                                      '</a>'+
                                      '</div>'+
                                      '<div><a href="#" class="innovaphone-icons__item iconVideo '+activity+'" '+videoClick+'>'+
                                           '<div class="innovaphone-tooltip">'+instanceConference.options.translations.videocall+'</div>'+
                                           '<img src="' + instanceConference.options.pathPrefix + 'innovaphone.widget.video.svg" alt="">' +
                                      '</a>'+
                                      '</div>'+
                                      '<div><a href="mailto:'+ supporter.email +'" class="innovaphone-icons__item innovaphone-icons__item--mail">'+
                                           '<div class="innovaphone-tooltip">'+instanceConference.options.translations.email+'</div>'+
                                           '<img src="' + instanceConference.options.pathPrefix + 'innovaphone.widget.mail.svg" alt="">' +
                                      '</a>'+
                                      '</div>'+
                                 '</div>'+
                            '</div>'+
                            '<div class="innovaphone-copy">'+
                                 'Powered by <a href="https://www.innovaphone.com">innovaphone</a>'+
                            '</div>'+
                       '</div>';
        }

        instanceConference.widgetWrapper.innerHTML = view;
    }

    /*
     * Create markup for active call layer
     */
    function createActiveCallView(){
        var view = '<div class="innovaphone-active-layer clearfix">'+
        				'<video id="innovaphone-widget-video-remote" muted="muted"></video>'+
        				'<video id="innovaphone-widget-video-local" muted="muted"></video>'+
        				'<div class="innovaphone-active-img"><img src="'+instanceConference.currentSupporter.img+'"></div>'+
    					'<div class="innovaphone-tab">'+
                    		'<div class="innovaphone-active-icons">'+
                        		'<div>'+
                           			'<a href="#" class="innovaphone-icons__item '+instanceConference.activity.className+'" id="iconActiveCall" >'+
                           				'<img id="call-button" src="' + instanceConference.options.pathPrefix + 'innovaphone.widget.ringing.svg" alt="">' +
                           			'</a>'+
                       			'</div>'+
                                '<div>'+
                                    '<a href="#" class="innovaphone-icons__item '+instanceConference.activity.className+'" id="iconKeypad" >'+
                                        '<img class="open" src="' + instanceConference.options.pathPrefix + 'innovaphone.widget.keypad.svg" alt="">' +
                                    '</a>'+
                                '</div>'+
                                '<div>'+
                                    '<a href="#" class="innovaphone-icons__item '+instanceConference.activity.className+'" id="iconMute" >'+
                                        '<img class="open" src="' + instanceConference.options.pathPrefix + 'innovaphone.widget.mute.svg" alt="">' +
                                    '</a>'+
                                '</div>'+
                   			'</div>'+
                            '<div class="innovaphone-active-layer__supporter">'+
                            	'<div class="innovaphone-active-layer__name"><strong>'+instanceConference.currentSupporter.name+'</strong></div>'+
                            	'<div class="innovaphone-active-layer__department">'+instanceConference.options.companyName+' | '+instanceConference.currentSupporter.department+'</div>'+
                        	'</div>'+
                    	'</div>'+
                        '<div class="innovaphone-copy">'+
                             'Powered by <a href="https://www.innovaphone.com">innovaphone</a>'+
                        '</div>'+
                    '</div>';

        instanceConference.widgetWrapper      = document.querySelector('.' + instanceConference.clickedCardClass);
        instanceConference.widgetWrapper.innerHTML = view;
    }

    window.attach_sharing = function (canvases, createAppCallback, removeAppCallback, resizeCallback) {
        instanceConference.sharing_window_attached = true;
        if (instanceConference.endpoint) {
            // important to set child window first!
            if (instanceConference.sharing_window) {
                instanceConference.endpoint.sharingEvent('setname', instanceConference.displayname);
                instanceConference.sharing_window.document.title = instanceConference.displayname;
            }
            instanceConference.endpoint.attachSharing(canvases, createAppCallback, removeAppCallback, resizeCallback);
        }
        if (instanceConference.call_manager) instanceConference.call_manager.webrtc_sharing_changed();
    }

    window.detach_sharing = function (canvases) {
        instanceConference.sharing_window_attached = false;
        if (instanceConference.endpoint) {
            if (instanceConference.sharing_window) {
                instanceConference.endpoint.sharingEvent('setname', '');
                instanceConference.sharing_window.document.title = "";
            }
            instanceConference.endpoint.detachSharing(canvases);
        }
        if (instanceConference.call_manager) instanceConference.call_manager.webrtc_sharing_changed();

        if (instanceConference.call.sharing) {
            createRemoteApplicationView.call(instanceConference);
            instanceConference.endpoint.attachSharing(document.getElementById("sharing-local"), createNewApplication, removeApplication, resizeApplication);
        }
   }

    window.addEventListener("beforeunload", function (event) {
        if(!instanceConference.call) return;
        var confirmationMessage = instanceConference.options.translations.confirm;
        event.returnValue = confirmationMessage;
        return confirmationMessage;
    });

    function createRemoteApplicationView() {
        instanceConference.sharingWrapper = document.querySelector('#remote-application-container');
        instanceConference.sharingWrapper.innerHTML = '';

        var maxWidth = parseInt(instanceConference.options.remoteMaxWidth);
        if (maxWidth > 0) {
            var view = '<div id="sharing-local" style="max-width: '+instanceConference.options.remoteMaxWidth+'; overflow: hidden;"></div>';

    	} else {
            var view = '<div id="sharing-local"></div>';

        }
        instanceConference.sharingWrapper.innerHTML = view;
    }

    function removeRemoteApplicationView() {
        instanceConference.sharingWrapper = document.querySelector('#remote-application-container');
        instanceConference.sharingWrapper.innerHTML = '';
    }

    // public API
    return _Conference;
})();

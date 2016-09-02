/*
Custom videoplayer inspired on MDN's article about creating a cross-browser video player and adding captions to HTML5 video:
https://developer.mozilla.org/en-US/Apps/Fundamentals/Audio_and_video_delivery/cross_browser_video_player
https://developer.mozilla.org/en-US/Apps/Fundamentals/Audio_and_video_delivery/Adding_captions_and_subtitles_to_HTML5_video

Time indicator inspired on David Walsh:
https://davidwalsh.name/html5-video-duration

*/



var supportsVideo = !!document.createElement('video').canPlayType;
var videoContainer = document.querySelector('#video-container');
var videoPlayer = document.querySelector('#video-player');
var contentContainer = document.querySelector('#content');

if (supportsVideo) {

    /*------------------- CONTROLS ---------------------*/



    //Make controls container ready
    var divHTML = document.createElement('div');
    divHTML.setAttribute('id', 'video-controls');
    divHTML.setAttribute('class', 'controls');
    divHTML.setAttribute('data-state', 'hidden');

    // Define custom controls
    var playButtonHTML = '<button id="playpause" class="srt" type="button" data-state="play">Play/Pause</button>\n';
    var playBackSliderHTML = '<input type="range" id="speed-bar" min="0.5" max="2" step="0.25" value="1">\n';
    var playBackIndicatorHTML = '<span id="playback-indicator">' + videoPlayer.playbackRate + 'x' + '</span>';
    var stopButtonHTML = '<button id="stop" class="srt" type="button" data-state="stop">Stop</button>\n';
    var currentTimeIndicatorHTML = '<span id="current-time-indicator"></span>\n';
    var durationIndicatorHTML = '<span id="duration-indicator"></span>\n';
    var timeHTML = '<div id="time-indicator">' + currentTimeIndicatorHTML + ' / ' + durationIndicatorHTML + '</div>';
    var progressBarHTML = '<div id="progress-container" class="progress">\n' + '<span id="progress-bar"></span>\n' + '</span>\n' + '<span id="buffer-bar"></span>\n' + '</span>\n' + '</div>\n';
    var muteButtonHTML = '<button id="mute" class="srt" type="button" data-state="mute">Mute/Unmute</button>\n';
    var volumeSliderHTML = '<input type="range" id="volume-bar" min="0" max="1" step="0.1" value="1">\n';
    var fullscreenButtonHTML = '<button id="full-screen" class="srt" type="button" data-state="go-fullscreen">Fullscreen</button>\n';
    var captionsButtonHTML = '<button id="captions" type="button" data-state="captions">CC</button>\n';

    // Make controls HTML ready
    var controlsHTML = '';
    controlsHTML += progressBarHTML;
    controlsHTML += '<div id="button-container">';
    controlsHTML += playButtonHTML;
    controlsHTML += timeHTML;
    controlsHTML += stopButtonHTML;
    controlsHTML += playBackSliderHTML;
    controlsHTML += playBackIndicatorHTML;
    controlsHTML += captionsButtonHTML;
    controlsHTML += volumeSliderHTML;
    controlsHTML += muteButtonHTML;
    controlsHTML += fullscreenButtonHTML;
    controlsHTML += '</div>';


    // Add controls 
    divHTML.innerHTML = controlsHTML;
    videoContainer.appendChild(divHTML);

    // Hide the default controls
    videoPlayer.controls = false;

    // Display the user defined video controls
    var videoControls = document.querySelector('#video-controls');
    videoControls.style.display = 'block';

    // Bind the buttons
    // var buttonContainer = document.querySelector('#button-container');
    var playButton = document.querySelector('#playpause');
    var playBackSlider = document.querySelector('#speed-bar');
    var stopButton = document.querySelector('#stop');
    var muteButton = document.querySelector('#mute');
    var volumeSlider = document.querySelector('#volume-bar');
    var progressContainer = document.querySelector('#progress-container');
    var progressBar = document.querySelector('#progress-bar');
    var bufferBar = document.querySelector('#buffer-bar');
    var fullscreenButton = document.querySelector('#full-screen');
    var captionsButton = document.querySelector('#captions');

    //Indicators
    var playBackIndicator = document.querySelector('#playback-indicator');
    var currentTimeIndicator = document.querySelector('#current-time-indicator');
    var durationIndicator = document.querySelector('#duration-indicator');



    /*------------------- EVENT LISTENERS ---------------------*/
    // Event listener on the video itself
    videoPlayer.addEventListener('playing', function(e) {
        playButton.setAttribute('data-state', 'playing');
    });

    videoPlayer.addEventListener('ended', function(e) {
        playButton.setAttribute('data-state', 'paused');
    });

    // Event listener for the play button
    playButton.addEventListener('click', function(e) {
        if (videoPlayer.paused || videoPlayer.ended) {
            videoPlayer.play();
            this.setAttribute('data-state', 'playing');
        } else {
            videoPlayer.pause();
            this.setAttribute('data-state', 'paused');
        }
    });

    // Event listener for the playback speed
    playBackSlider.addEventListener("change", function() {
        // Update the video volume
        videoPlayer.playbackRate = playBackSlider.value;
        playBackIndicator.innerText = videoPlayer.playbackRate + 'x';
    });

    // Event listener for the stop button
    stopButton.addEventListener('click', function(e) {
        // Stop is not possible on a video element so we play pretend
        playButton.setAttribute('data-state', 'paused');
        videoPlayer.pause();
        videoPlayer.currentTime = 0;
    });

    // Event listener for the mute button
    muteButton.addEventListener('click', function(e) {
        // Toggle mute
        if (videoPlayer.muted) {
            videoPlayer.muted = false;
            this.setAttribute('data-state', 'sound');
            volumeSlider.removeAttribute('disabled');
        } else {
            videoPlayer.muted = true;
            this.setAttribute('data-state', 'muted');
            volumeSlider.setAttribute('disabled', 'disabled');
        }
    });

    // Event listener for the volume bar
    volumeSlider.addEventListener("change", function() {
        // Update the video volume
        videoPlayer.volume = volumeSlider.value;
        if (volumeSlider.value > 0) {
            muteButton.setAttribute('data-state', 'sound');
        } else {
            muteButton.setAttribute('data-state', 'muted');
        }
    });

    // Event listener for the time indicator
    setInterval(function() {
            if (videoPlayer.readyState > 0) {

                // Update video duration
                var minutes = parseInt(videoPlayer.duration / 60, 10);
                var seconds = Math.floor(videoPlayer.duration % 60);
                if (seconds < 10) {
                    durationIndicator.innerText = minutes + ':' + '0' + seconds;
                } else {
                    durationIndicator.innerText = minutes + ':' + seconds;
                }

                // Update time played
                var minutesPlayed = parseInt(videoPlayer.currentTime / 60, 10);
                var secondsPlayed = Math.floor(videoPlayer.currentTime % 60);
                if (secondsPlayed < 10) {
                    currentTimeIndicator.innerText = minutesPlayed + ':' + '0' + secondsPlayed;
                } else {
                    currentTimeIndicator.innerText = minutesPlayed + ':' + secondsPlayed;
                }

                // Update video duration
                var played = Math.floor((videoPlayer.currentTime / videoPlayer.duration) * 100);
                progressBar.style.width = played + '%';

                // Update buffer bar
                var buffered = videoPlayer.buffered.end(videoPlayer.buffered.length - 1);
                var bufferCalc = Math.floor((buffered / videoPlayer.duration) * 100);
                bufferBar.style.width = (bufferCalc - played) + '%';
            }
        },
        200);

    // Check if the browser is already in fullscreen mode
    var isFullScreen = function() {
        return !!(document.fullScreen || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement);
    };

    // Skip ahead
    progressContainer.addEventListener('click', function(e) {
        var positionClicked = e.pageX;
        var positionContent = contentContainer.offsetLeft;
        var positionProgress = this.offsetLeft;
        var playWidth = progressContainer.offsetWidth;
        var videoDuration = videoPlayer.duration;
        var multiPlier;
        if (isFullScreen()) {
            multiPlier = positionClicked / playWidth;
        } else if (positionContent === 0) {
            multiPlier = (positionClicked - positionProgress) / playWidth;
        } else {
            multiPlier = (positionClicked - positionContent - positionProgress) / playWidth;
        }
        var setTime = multiPlier * videoDuration;
        videoPlayer.currentTime = setTime;
    });

    // Check if browser supports the Fullscreen API
    var fullScreenEnabled = !!(document.fullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled || document.webkitSupportsFullscreen || document.webkitFullscreenEnabled || document.createElement('video').webkitRequestFullScreen);

    // Disable the fullscreen button if it's not supported
    if (!fullScreenEnabled) {
        fullscreenButton.style.display = 'none';
    }



    var setFullscreenData = function(state) {
        videoContainer.setAttribute('data-fullscreen', !!state);
    };

    // Add handler to the button
    fullscreenButton.addEventListener('click', function(e) {
        if (isFullScreen()) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            setFullscreenData(false);
        } else {
            if (videoContainer.requestFullscreen) {
                videoContainer.requestFullscreen();
            } else if (videoContainer.mozRequestFullScreen) {
                videoContainer.mozRequestFullScreen();
            } else if (videoContainer.webkitRequestFullScreen) {
                videoContainer.webkitRequestFullScreen();
            } else if (videoContainer.msRequestFullscreen) {
                videoContainer.msRequestFullscreen();
            }
            setFullscreenData(true);
        }

    });

    /*Used to listen for relevant events in order to call the setFullscreenData() 
    function to ensure the control styling is correct:*/
    document.addEventListener('fullscreenchange', function(e) {
        setFullscreenData(!!(document.fullScreen || document.fullscreenElement));
    });
    document.addEventListener('webkitfullscreenchange', function() {
        setFullscreenData(!!document.webkitIsFullScreen);
    });
    document.addEventListener('mozfullscreenchange', function() {
        setFullscreenData(!!document.mozFullScreen);
    });
    document.addEventListener('msfullscreenchange', function() {
        setFullscreenData(!!document.msFullscreenElement);
    });


    /*------------------- CAPTIONS ---------------------*/

    // Initially turn off all captions
    for (var i = 0; i < videoPlayer.textTracks.length; i++) {
        videoPlayer.textTracks[i].mode = 'hidden';
    }

    // Creation menu with captions
    var captionMenuButtons = [];
    // Using document fragments for better performance as this is just in memory and not in DOM
    var df = document.createDocumentFragment();
    var captionsMenu = df.appendChild(document.createElement('ul'));
    captionsMenu.setAttribute('data-state', 'hidden');
    var createMenuItem = function(id, lang, label) {
        var listItem = document.createElement('li');
        var button = listItem.appendChild(document.createElement('button'));
        button.setAttribute('id', id);
        button.className = 'captions-button';
        if (lang.length > 0) {
            button.setAttribute('lang', lang);
        }
        button.value = label;
        button.setAttribute('data-state', 'inactive');
        button.appendChild(document.createTextNode(label));
        button.addEventListener('click', function(e) {
            // Set all buttons to inactive
            captionMenuButtons.map(function(v, i, a) {
                captionMenuButtons[i].setAttribute('data-state', 'inactive');
            });
            // Find the language to activate
            var lang = this.getAttribute('lang');
            for (var i = 0; i < videoPlayer.textTracks.length; i++) {
                // For the 'captions-off' button, the first condition will never match so all captions be will turned off
                if (videoPlayer.textTracks[i].language === lang) {
                    videoPlayer.textTracks[i].mode = 'showing';
                    this.setAttribute('data-state', 'active');
                } else {
                    videoPlayer.textTracks[i].mode = 'hidden';
                }
            }
            captionsMenu.setAttribute('data-state', 'hidden');

        });
        captionMenuButtons.push(button);
        return listItem;
    };

    // Reading textTracks properties and building the menu
    if (videoPlayer.textTracks) {
        captionsMenu.className = 'captions-menu';
        captionsMenu.appendChild(createMenuItem('captions-off', '', 'Off'));
        for (var i = 0; i < videoPlayer.textTracks.length; i++) {
            captionsMenu.appendChild(createMenuItem('captions-' + videoPlayer.textTracks[i].language, videoPlayer.textTracks[i].language, videoPlayer.textTracks[i].label));
        }
        videoContainer.appendChild(captionsMenu);
        // Center the menu on the button
        (window.onresize = function() {
            centerCaptionsButton = captionsButton.offsetLeft + (captionsButton.offsetWidth / 2);
            positonCaptionsMenu = centerCaptionsButton - (captionsMenu.offsetWidth / 2);
            captionsMenu.style.left = positonCaptionsMenu + 'px';
        })();

    }



    // Event listener for the captions to toggle
    captionsButton.addEventListener('click', function(e) {
        if (captionsMenu.getAttribute("data-state") === 'visible') {
            captionsMenu.setAttribute('data-state', 'hidden');
        } else {
            captionsMenu.setAttribute('data-state', 'visible');
        }

    });


    // Update the captions HTML with the default language captions
    var captionsHTML = '';
    var trackElements = document.querySelectorAll("track");
    // for each track element
    for (var i = 0; i < trackElements.length; i++) {
        if (trackElements[i].hasAttribute("default")) {


            trackElements[i].addEventListener("load", function() {

                // Create a container for the captions
                var captionsContainer = contentContainer.appendChild(document.createElement('section'));
                captionsContainer.setAttribute('id', 'video-captions');

                var textTrack = this.track;

                // Set the paragraph
                captionsHTML += '<p>';
                // Get all the cues
                for (var j = 0; j < textTrack.cues.length; ++j) {
                    var cue = textTrack.cues[j];
                    captionsHTML += '<a href="#" id="' + cue.id + '" class="caption-cue" data-state="inactive" data-start="' + cue.startTime + '">' + cue.text + ' ' + '</a>';
                }
                // Close the paragraph
                captionsHTML += '</p>';
                // Update '#video-captions' with captions from default VTT file
                captionsContainer.innerHTML = captionsHTML;

                // Each time a cue changes check it's ID
                textTrack.oncuechange = function() {
                    // "this" is a textTrack
                    var cue = this.activeCues[0]; // assuming there is only one active cue
                    // Check the captions 
                    var captions = captionsContainer.getElementsByTagName("a");
                    for (var i = 0; i < captions.length; i++) {
                        // And see if the ID is similar to the active cue's ID
                        if (captions[i].id == cue.id) {
                            // Set the caption to 'active'
                            captions[i].setAttribute('data-state', 'active');
                        } else {
                            // Or 'inactive'
                            captions[i].setAttribute('data-state', 'inactive');
                        }
                    }
                };
                // Event listener for the time indicator
                function setCaptionTriggers() {
                    var captionTriggers = captionsContainer.getElementsByTagName("a");
                    for (var i = 0; i < captionTriggers.length; i++) {
                        // If a cue is clicked
                        captionTriggers[i].addEventListener('click', function(e) {
                            // Get the correct starting time
                            var triggerStartTime = this.getAttribute('data-start');
                            // Play video from here
                            videoPlayer.currentTime = triggerStartTime;
                            videoPlayer.play();
                        });
                    }
                }
                setCaptionTriggers();

            }, true);
        }
    }

}

/*TODO:
JS-->
refactor
*/

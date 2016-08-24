/*
Custom videoplayer inspired on MDN's article about creating a cross-browser video player and adding captions to HTML5 video:
https://developer.mozilla.org/en-US/Apps/Fundamentals/Audio_and_video_delivery/cross_browser_video_player
https://developer.mozilla.org/en-US/Apps/Fundamentals/Audio_and_video_delivery/Adding_captions_and_subtitles_to_HTML5_video

Time indicator inspired on David Walsh:
https://davidwalsh.name/html5-video-duration

*/



var supportsVideo = !!document.createElement('video').canPlayType;
var videoContainer = document.querySelector('#video-container');

if (supportsVideo) {

    /*------------------- CONTROLS ---------------------*/

    // Define custom controls
    var divHTML = document.createElement('div');
    var playButtonHTML = '<button id="playpause" type="button" data-state="play">Play/Pause</button>\n';
    var stopButtonHTML = '<button id="stop" type="button" data-state="stop">Stop</button>\n';
    var currentTimeIndicatorHTML = '<span id="current-time-indicator"></span>\n';
    var durationIndicatorHTML = '<span id="duration-indicator"></span>\n';
    var timeHTML = '<div id="time-indicator">' + currentTimeIndicatorHTML + ' / ' + durationIndicatorHTML + '</div>';
    var progressBarHTML = '<div class="progress">\n' + '<progress id="progress" value="0" min="0">\n' + '<span id="progress-bar"></span>\n' + '</progress>\n' + '</div>\n';
    var muteButtonHTML = '<button id="mute" type="button" data-state="mute">Mute/Unmute</button>\n';
    var volumeSliderHTML = '<input type="range" id="volume-bar" min="0" max="1" step="0.1" value="1">\n';
    var fullscreenButtonHTML = '<button id="full-screen" type="button" data-state="go-fullscreen">Fullscreen</button>\n';
    var captionsButtonHTML = '<button id="captions" type="button" data-state="captions">CC</button>\n';

    // Make controls HTML ready
    var controlsHTML = '';
    controlsHTML += progressBarHTML;
    controlsHTML += playButtonHTML;
    controlsHTML += stopButtonHTML;
    controlsHTML += timeHTML;
    controlsHTML += muteButtonHTML;
    controlsHTML += volumeSliderHTML;
    controlsHTML += fullscreenButtonHTML;
    controlsHTML += captionsButtonHTML;

    //Make controls container ready
    divHTML.setAttribute('id', 'video-controls');
    divHTML.setAttribute('class', 'controls');
    divHTML.setAttribute('data-state', 'hidden');

    // Add controls 
    divHTML.innerHTML = controlsHTML;
    videoContainer.appendChild(divHTML);

    // Hide the default controls
    var videoPlayer = document.querySelector('#video-player');
    videoPlayer.controls = false;

    // Display the user defined video controls
    var videoControls = document.querySelector('#video-controls');
    videoControls.style.display = 'block';

    // Bind the buttons
    var playButton = document.querySelector('#playpause');
    var stopButton = document.querySelector('#stop');
    var muteButton = document.querySelector('#mute');
    var volumeSlider = document.querySelector('#volume-bar');
    var progress = document.querySelector('#progress');
    var progressBar = document.querySelector('#progress-bar');
    var fullscreenButton = document.querySelector('#full-screen');
    var captionsButton = document.querySelector('#captions');

    //Indicators
    var currentTimeIndicator = document.querySelector('#current-time-indicator');
    var durationIndicator = document.querySelector('#duration-indicator');

    /*------------------- EVENT LISTENERS ---------------------*/

    // Event listener for the play button
    playButton.addEventListener('click', function(e) {
        if (videoPlayer.paused || videoPlayer.ended) {
            videoPlayer.play();
        } else {
            videoPlayer.pause();
        }
    });

    // Event listener for the stop button
    stopButton.addEventListener('click', function(e) {
        // Stop is not possible on a video element so we play pretend
        videoPlayer.pause();
        videoPlayer.currentTime = 0;
        progress.value = 0;
    });

    // Event listener for the mute button
    muteButton.addEventListener('click', function(e) {
        // Toggle mute
        videoPlayer.muted = !videoPlayer.muted;
        /*        if (videoPlayer.muted) {
        videoPlayer.setAttribute("disabled", "disabled");

        } else {
        volumeSlider.removeAttribute("disabled");
        }*/
    });

    // Event listener for the volume bar
    volumeSlider.addEventListener("change", function() {
        // Update the video volume
        videoPlayer.volume = volumeSlider.value;
        /*        if (videoPlayer.value === 0) {
        videoPlayer.muted = true;
        } else {
        videoPlayer.muted = false;
        }*/
    });

    // Event listener for the progress bar
    videoPlayer.addEventListener('loadedmetadata', function() {
        // Set the max value
        progress.setAttribute('max', videoPlayer.duration);


    });

    // Event listener for the time indicator
    var timeIndicator = setInterval(function() {
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
            }
        },
        200);

    // Update playbar + played time
    videoPlayer.addEventListener('timeupdate', function() {
        // Update the playbar 
        progress.value = videoPlayer.currentTime;
        progressBar.style.width = Math.floor((videoPlayer.currentTime / videoPlayer.duration) * 100) + '%';

    });

    videoPlayer.addEventListener('timeupdate', function() {
        //Solving mobile issues if it's not yet set
        if (!progress.getAttribute('max')) {
            progress.setAttribute('max', videoPlayer.duration);
        }
        progress.value = videoPlayer.currentTime;
        progressBar.style.width = Math.floor((videoPlayer.currentTime / videoPlayer.duration) * 100) + '%';
    });

    // Skip ahead
    progress.addEventListener('click', function(e) {
        var posClick = (e.pageX - this.offsetLeft) / this.offsetWidth;
        videoPlayer.currentTime = posClick * videoPlayer.duration;
    });


    // Skip ahead
    progress.addEventListener('click', function(e) {
        var posClick = (e.pageX - this.offsetLeft) / this.offsetWidth;
        videoPlayer.currentTime = posClick * videoPlayer.duration;
    });

    // Check if browser supports the Fullscreen API
    var fullScreenEnabled = !!(document.fullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled || document.webkitSupportsFullscreen || document.webkitFullscreenEnabled || document.createElement('video').webkitRequestFullScreen);

    // Disable the fullscreen button if it's not supported
    if (!fullScreenEnabled) {
        fullscreenButton.style.display = 'none';
    }

    // Check if the browser is already in fullscreen mode
    var isFullScreen = function() {
        return !!(document.fullScreen || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement);
    };

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
            captionsMenu.style.display = 'none';
        });
        captionMenuButtons.push(button);
        return listItem;
    };

    // Reading textTracks properties and building the menu
    var captionsMenu;
    if (videoPlayer.textTracks) {
        // Using document fragments for better performance as this is just in memory and not in DOM
        var df = document.createDocumentFragment();
        var captionsMenu = df.appendChild(document.createElement('ul'));
        captionsMenu.className = 'captions-menu';
        captionsMenu.appendChild(createMenuItem('captions-off', '', 'Off'));
        for (var i = 0; i < videoPlayer.textTracks.length; i++) {
            captionsMenu.appendChild(createMenuItem('captions-' + videoPlayer.textTracks[i].language, videoPlayer.textTracks[i].language, videoPlayer.textTracks[i].label));
        }
        videoContainer.appendChild(captionsMenu);
    }


    // Event listener for the captions to toggle
    captionsButton.addEventListener('click', function(e) {
        if (captionsMenu.style.display === 'block') {
            captionsMenu.style.display = 'none';
        } else {
            captionsMenu.style.display = 'block';
        }

    });



    // Update the captions HTML with the default language captions

    var trackElements = document.querySelectorAll("track");
    // for each track element
    for (var i = 0; i < trackElements.length; i++) {
        if ( trackElements[i].hasAttribute("align") ) {
            console.log(trackElements[i]);
        }
        /*var textTrack = this.track;
        var isShowing = textTrack.mode === "showing";
        if (isShowing) {
            alert(textTrack[i] + ' is showing');
            trackElements[i].addEventListener("load", function() {
                    // for each cue
                    for (var j = 0; j < textTrack.cues.length; ++j) {
                        var cue = textTrack.cues[j];
                        // do something
                    }
                }

            }
        }*/
    }

    // Update '#video-captions' with captions from VTT file
    // Get current time
    // Add '.active-caption' to the current playing cue
    // Remove class from all the others


    // If a cue is clicked
    //     Get the correct starting time
    //     Play video from here

    // EXCEEDS EXPECTATIONS:
    //     Embed VTT file
    //         Add CC button to toggle on/off
    //     Creative responsive design
    //     Playback speed control or other helpful controls
    //     Volume control
    //     Playback buffering indicator
}

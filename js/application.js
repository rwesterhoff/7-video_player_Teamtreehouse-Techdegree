/* ====================================================================================== *\
    GLOBAL VARIABLES
*\ ====================================================================================== */

var supportsVideo = !!document.createElement('video').canPlayType,
    videoContainer = document.getElementById('video-container'),
    videoPlayer = document.querySelector('#video-player'),
    contentContainer = document.getElementById('content-container'),
    progressContainerId = 'progress-container',
    progressId = 'progress-bar',
    bufferId = 'buffer-bar',
    currentTimeIndicatorId = 'current-time-indicator',
    durationIndicatorId = 'duration-indicator';

/* ====================================================================================== *\
    CONTROLS
*\ ====================================================================================== */

function Container(id, className, state) {
    this.id = id;
    this.className = className;
    this.state = state;
}

Container.prototype.createContainer = function(parent) {
    var container = document.createElement('div');
    container.setAttribute('id', this.id);
    container.setAttribute('class', this.className);
    container.setAttribute('data-state', this.state);
    parent.appendChild(container);
};

Container.prototype.toHTML = function() {
    var controlsHTML = '<div';
    controlsHTML += ' id="' + this.id + '"';
    controlsHTML += ' class="' + this.className + '"';
    controlsHTML += ' data-state="' + this.state + '"';
    controlsHTML += '>';
    controlsHTML += '</div>';
    return controlsHTML;
};

function ControlsGroup(id, content) {
    this.id = id;
    this.content = content;
}

ControlsGroup.prototype.toHTML = function() {
    var controlsHTML = '<div';
    controlsHTML += ' id="' + this.id + '"';
    controlsHTML += '>';
    controlsHTML += this.content;
    controlsHTML += '</div>';
    return controlsHTML;
};

function Progress(id) {
    this.id = id;
}

Progress.prototype.toHTML = function() {
    var controlsHTML = '<span';
    controlsHTML += ' id="' + this.id + '"';
    controlsHTML += '>';
    controlsHTML += '</span>';
    return controlsHTML;
};

function Button(id, srt, text) {
    this.id = id;
    this.srt = srt;
    this.text = text;
}

Button.prototype.toHTML = function() {
    var controlsHTML = '<button';
    controlsHTML += ' id="' + this.id + '"';
    if (this.srt) {
        controlsHTML += ' class="srt"';
    }
    controlsHTML += '>';
    controlsHTML += this.text;
    controlsHTML += '</button>';
    return controlsHTML;
};

function Indicator(id) {
    this.id = id;
}

Indicator.prototype.toHTML = function() {
    var controlsHTML = '<span';
    controlsHTML += ' id="' + this.id + '"';
    controlsHTML += ' class="indicator"';
    controlsHTML += '>';
    controlsHTML += '</span>';
    return controlsHTML;
};

function Slider(id, min, max, step, value) {
    this.id = id;
    this.min = min;
    this.max = max;
    this.step = step;
    this.value = value;
}

Slider.prototype.toHTML = function() {
    var controlsHTML = '<input';
    controlsHTML += ' type="range"';
    controlsHTML += ' id="' + this.id + '"';
    controlsHTML += ' min="' + this.min + '"';
    controlsHTML += ' max="' + this.max + '"';
    controlsHTML += ' step="' + this.step + '"';
    controlsHTML += ' value="' + this.value + '"';
    controlsHTML += '>';
    return controlsHTML;
};

/* ====================================================================================== *\
    VIDEO-PLAYER
*\ ====================================================================================== */

function VideoPlayer(id, controlsContainer, playerControls) {
    var videoObject = this;
    videoObject.id = id;
    videoObject.controlsContainer = controlsContainer;
    videoObject.playerControls = playerControls;

    videoObject.displayAll = function() {
        videoObject.displayProgress();
        videoObject.displayControls();
        videoObject.displayTime();
        videoObject.makeItWork();
        videoObject.setCaptions();
    };

    videoObject.displayProgress = function() {
        var progressContainer = new Container(progressContainerId, 'progress', 'visible'),
            parentVideoControls = document.getElementById(videoObject.controlsContainer);
        progressContainer.createContainer(parentVideoControls);
        var container = progressContainer.id,
            content = {
                progressBar: new Progress(progressId),
                bufferBar: new Progress(bufferId)
            },
            html = content;
        videoObject.renderInElement(container, html);
    };

    videoObject.displayControls = function() {
        var buttonContainer = new Container('button-container', 'buttons', 'visible'),
            parent = document.getElementById(videoObject.controlsContainer);
        buttonContainer.createContainer(parent);
        var container = buttonContainer.id,
            html = videoObject.playerControls;
        videoObject.renderInElement(container, html);
    };

    videoObject.displayTime = function() {
        var container = playerControls.timeIndicator.id,
            content = {
                currentTimeIndicator: new Indicator(currentTimeIndicatorId, '0:00'),
                durationIndicator: new Indicator(durationIndicatorId, '')
            },
            html = content;
        videoObject.renderInElement(container, html);
    };

    videoObject.makeItWork = function() {
        var hasPlayButton = videoObject.playerControls.playButton,
            hasStopButton = videoObject.playerControls.stopButton,
            hasSliders = document.querySelectorAll('input[type=range]'),
            hasPlayBackSlider = videoObject.playerControls.playBackSlider,
            hasMuteButton = videoObject.playerControls.muteButton,
            hasVolumeSlider = videoObject.playerControls.volumeSlider,
            hasFullscreenButton = videoObject.playerControls.fullscreenButton,
            setProgress = function() {
                if (videoPlayer.readyState > 0) {
                    var videoDuration = videoPlayer.duration,
                        videoCurrentTime = videoPlayer.currentTime,
                        minutesDuration = parseInt(videoDuration / 60, 10),
                        secondsDuration = Math.floor(videoDuration % 60),
                        minutesPlayed = parseInt(videoCurrentTime / 60, 10),
                        secondsPlayed = Math.floor(videoCurrentTime % 60),
                        played = Math.floor((videoCurrentTime / videoDuration) * 100),
                        buffered = videoPlayer.buffered.end(videoPlayer.buffered.length - 1),
                        bufferCalc = Math.floor((buffered / videoDuration) * 100),
                        durationIndicator = document.getElementById(durationIndicatorId),
                        currentTimeIndicator = document.getElementById(currentTimeIndicatorId),
                        progressContainer = document.getElementById(progressContainerId),
                        progressBar = document.getElementById(progressId),
                        bufferBar = document.getElementById(bufferId);

                    // Update time played
                    if (secondsPlayed < 10) {
                        currentTimeIndicator.innerText = minutesPlayed + ':' + '0' + secondsPlayed + ' / ';
                    } else {
                        currentTimeIndicator.innerText = minutesPlayed + ':' + secondsPlayed + ' / ';
                    }
                    // Update video duration
                    if (secondsDuration < 10) {
                        durationIndicator.innerText = minutesDuration + ':' + '0' + secondsDuration;
                    } else {
                        durationIndicator.innerText = minutesDuration + ':' + secondsDuration;
                    }
                    // Update bars
                    progressBar.style.width = played + '%';
                    bufferBar.style.width = (bufferCalc - played) + '%';
                    // Skip ahead
                    progressContainer.addEventListener('click', function(e) {
                        var positionClicked = e.pageX,
                            positionContent = contentContainer.offsetLeft,
                            positionProgress = this.offsetLeft,
                            playWidth = progressContainer.offsetWidth,
                            videoDuration = videoPlayer.duration,
                            multiplier;

                        if (isFullScreen()) {
                            multiplier = positionClicked / playWidth;
                        } else if (positionContent === 0) {
                            multiplier = (positionClicked - positionProgress) / playWidth;
                        } else {
                            multiplier = (positionClicked - positionContent - positionProgress) / playWidth;
                        }

                        var setTime = multiplier * videoDuration;
                        videoPlayer.currentTime = setTime;
                        videoPlayer.play();
                    });
                }
            };

        setInterval(setProgress, 200);

        if (hasPlayButton) {
            var playButton = document.getElementById(hasPlayButton.id);
            // Check if video is playing
            videoPlayer.addEventListener('playing', function(e) {
                playButton.setAttribute('data-state', 'playing');
            });
            // Event listener for the play button
            playButton.addEventListener('click', function(e) {
                if (videoPlayer.paused || videoPlayer.ended) {
                    videoPlayer.play();
                    playButton.setAttribute('data-state', 'playing');
                } else {
                    videoPlayer.pause();
                    playButton.setAttribute('data-state', 'paused');
                }
            });
        }
        if (hasStopButton) {
            var stopButton = document.getElementById(hasStopButton.id);
            // Event listener for the stop button
            stopButton.addEventListener('click', function(e) {
                // Stop is not possible on a video element so we play pretend
                playButton.setAttribute('data-state', 'paused');
                videoPlayer.pause();
                videoPlayer.currentTime = 0;
            });
        }
        if (hasSliders) {
            // Styling issues in Firefox
            var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
            if (isFirefox) {
                var sliders = hasSliders;
                for (var i = 0; i < sliders.length; ++i) {
                    sliders[i].style.background = 'transparent';
                }
            }
            if (hasPlayBackSlider) {
                var playBackSlider = document.getElementById(hasPlayBackSlider.id),
                    playBackIndicator = document.getElementById('playback-indicator'),
                    sliderValue = videoPlayer.playbackRate;

                // Event listener for initial indication
                videoPlayer.addEventListener('loadeddata', function(e) {
                    playBackIndicator.innerText = sliderValue + 'x';
                });
                // Event listener for the playback indicator
                playBackSlider.addEventListener("change", function() {
                    // Update the video speed
                    videoPlayer.playbackRate = playBackSlider.value;
                    playBackIndicator.innerText = videoPlayer.playbackRate + 'x';
                });
            }
            if (hasVolumeSlider) {
                var volumeSlider = document.getElementById(hasVolumeSlider.id);
                volumeSlider.addEventListener("change", function() {
                    // Update the video volume
                    videoPlayer.volume = volumeSlider.value;
                    if (volumeSlider.value > 0) {
                        muteButton.setAttribute('data-state', 'sound');
                    } else {
                        muteButton.setAttribute('data-state', 'muted');
                    }
                });
            }
        }
        if (hasMuteButton) {
            var muteButton = document.getElementById(hasMuteButton.id);
            muteButton.addEventListener('click', function(e) {
                // Toggle mute
                if (videoPlayer.muted) {
                    videoPlayer.muted = false;
                    muteButton.setAttribute('data-state', 'sound');
                    volumeSlider.removeAttribute('disabled');
                } else {
                    videoPlayer.muted = true;
                    muteButton.setAttribute('data-state', 'muted');
                    volumeSlider.setAttribute('disabled', 'disabled');
                }
            });
        }
        if (hasFullscreenButton) {
            var fullscreenButton = document.getElementById(hasFullscreenButton.id),
                isFullScreen = function() {
                    return !!(
                        document.fullScreen ||
                        document.webkitIsFullScreen ||
                        document.mozFullScreen ||
                        document.msFullscreenElement ||
                        document.fullscreenElement
                    );
                },
                setFullscreenData = function(state) {
                    videoContainer.setAttribute('data-fullscreen', !!state);
                },
                fullScreenEnabled = !!(document.fullscreenEnabled ||
                    document.mozFullScreenEnabled ||
                    document.msFullscreenEnabled ||
                    document.webkitSupportsFullscreen ||
                    document.webkitFullscreenEnabled ||
                    document.createElement('video').webkitRequestFullScreen);


            if (fullScreenEnabled) {
                // Event listener for the fullscreen button
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
            } else {
                // Remove the fullscreen button if it's not supported
                fullscreenButton.parentNode.removeChild(fullscreenButton);
            }
        }
    };
    videoObject.setCaptions = function() {
        var hasTextTracks = videoPlayer.textTracks.length > 0,
            hasCaptionsButton = videoObject.playerControls.captionsButton,
            captionsButton = document.getElementById(hasCaptionsButton.id);

        if (hasTextTracks) {
            var captionsContainer = contentContainer.appendChild(document.createElement('section')),
                df = document.createDocumentFragment(),
                captionsMenu = df.appendChild(document.createElement('ul')),
                captionMenuButtons = [],
                buildAutoCue = function() {
                    var captionsHTML = '',
                        trackElements = document.querySelectorAll("track"),
                        textTracks = videoPlayer.textTracks,
                        updateActiveCue = function() {
                            var cue = this.activeCues[0]; // assuming there is only one active cue
                            var captions = captionsContainer.getElementsByTagName("a");
                            for (var i = 0; i < captions.length; i++) {
                                // And see if the ID is similar to the active cue's ID
                                if (captions[i].id === cue.id) {
                                    captions[i].setAttribute('data-state', 'active');
                                } else {
                                    captions[i].setAttribute('data-state', 'inactive');
                                }
                            }
                        },
                        setCaptionTriggers = function() {
                            var captionTriggers = captionsContainer.getElementsByTagName("a"),
                                playThisCue = function(e) {
                                    var triggerStartTime = this.getAttribute('data-start');
                                    videoPlayer.currentTime = triggerStartTime;
                                    videoPlayer.play();
                                };
                            for (var i = 0; i < captionTriggers.length; i++) {
                                // Event listener for the clickable cues
                                captionTriggers[i].addEventListener('click', playThisCue);
                            }
                        };

                    // Check the tracks
                    for (var i = 0; i < textTracks.length; i++) {

                        if (trackElements[i].hasAttribute("default")) {
                            var textTrack = trackElements[i].track,
                                captionsContainer = contentContainer.appendChild(document.createElement('section'));
                            captionsContainer.setAttribute('id', 'video-captions');

                            if (trackElements[i].readyState > 0) {
                                // Set the paragraph
                                captionsHTML += '<p>';
                                // Get all the cues
                                for (var j = 0; j < textTrack.cues.length; ++j) {
                                    var cue = textTrack.cues[j];
                                    captionsHTML += '<a href="#" id="' + cue.id + '"';
                                    captionsHTML += 'class="caption-cue"';
                                    captionsHTML += 'data-state="inactive"';
                                    captionsHTML += 'data-start="' + cue.startTime + '">';
                                    captionsHTML += cue.text + ' ';
                                    captionsHTML += '</a>';
                                }
                                // Close the paragraph
                                captionsHTML += '</p>';
                                // Update '#video-captions' with captions from default VTT file
                                captionsContainer.innerHTML = captionsHTML;

                                // Each time a cue changes check it's ID
                                textTrack.oncuechange = updateActiveCue;
                            }
                            setCaptionTriggers();
                        }
                    }
                };
            buildAutoCue();

            if (hasCaptionsButton) {
                var buildCaptionsMenu = function() {
                    var createMenuItems = function(id, lang, label) {
                        var listItem = document.createElement('li'),
                            button = listItem.appendChild(document.createElement('button'));
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

                    captionsMenu.appendChild(createMenuItems('captions-off', '', 'Off'));
                    captionsMenu.className = 'captions-menu';
                    captionsMenu.setAttribute('data-state', 'hidden');
                    // Get the languages
                    for (var i = 0; i < videoPlayer.textTracks.length; i++) {
                        captionsMenu.appendChild(createMenuItems('captions-' + videoPlayer.textTracks[i].language,
                            videoPlayer.textTracks[i].language,
                            videoPlayer.textTracks[i].label));
                    }
                    videoContainer.appendChild(captionsMenu);
                    // Center the menu on the button
                    window.onresize = videoObject.centerElement(captionsButton, captionsMenu);
                };
                buildCaptionsMenu();
                // Event listener for the captions to toggle
                captionsButton.addEventListener('click', function(e) {
                    if (captionsMenu.getAttribute("data-state") === 'visible') {
                        captionsMenu.setAttribute('data-state', 'hidden');
                    } else {
                        captionsMenu.setAttribute('data-state', 'visible');
                    }
                });
            }
        } else {
            captionsButton.parentNode.removeChild(captionsButton);
        }
    };
}

VideoPlayer.prototype.renderInElement = function(container, html) {
    var content = html,
        element = document.getElementById(container);
    for (var prop in content) {
        if (content.hasOwnProperty(prop)) {
            element.innerHTML += content[prop].toHTML();
        }
    }
};

VideoPlayer.prototype.centerElement = function(relative, element) {
    var centerRelative = relative.offsetLeft + (relative.offsetWidth / 2),
        positionElement = centerRelative - (element.offsetWidth / 2);
    element.style.left = positionElement + 'px';
};

/* ====================================================================================== *\
    APP
*\ ====================================================================================== */

if (supportsVideo) {

    var videoControlsContainer = new Container('video-controls', 'controls', 'hidden'),
        playerControls = {
            playButton: new Button('playpause', true, 'Play/Pause'),
            timeIndicator: new ControlsGroup('time-indicator', ''),
            stopButton: new Button('stop', true, 'Stop'),
            playBackSlider: new Slider('speed-bar', 0.5, 2, 0.25, 1),
            playBackIndicator: new Indicator('playback-indicator'),
            captionsButton: new Button('captions', false, 'CC'),
            muteButton: new Button('mute', true, 'Mute/Unmute'),
            volumeSlider: new Slider('volume-bar', 0, 1, 0.1, 1),
            fullscreenButton: new Button('full-screen', true, 'Fullscreen')
        },
        video = new VideoPlayer('video-player', videoControlsContainer.id, playerControls);

    videoPlayer.controls = false;
    videoControlsContainer.createContainer(videoContainer);
    video.displayAll();
}

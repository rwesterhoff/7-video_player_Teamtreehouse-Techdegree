/* ====================================================================================== *\
    GLOBAL VARIABLES
*\ ====================================================================================== */

var supportsVideo = !!document.createElement('video').canPlayType,
    videoContainer = document.getElementById('video-container'),
    videoPlayer = document.getElementById('video-player'),
    contentContainer = document.getElementById('content-container'),
    progressContainerId = 'progress-container',
    progressId = 'progress-bar',
    bufferId = 'buffer-bar',
    currentTimeIndicatorId = 'current-time-indicator',
    durationIndicatorId = 'duration-indicator',
    isFullScreen = function() {
        return !!(
            document.fullScreen ||
            document.webkitIsFullScreen ||
            document.mozFullScreen ||
            document.msFullscreenElement ||
            document.fullscreenElement
        );
    },
    playerControls;

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
    this.id = id;
    this.controlsContainer = controlsContainer;
    this.playerControls = playerControls;
}

VideoPlayer.prototype.displayAll = function() {
    this.displayProgress();
    this.displayControls();
    this.displayTime();
    this.makeItWork();
    // this.setCaptions();
};

VideoPlayer.prototype.renderInElement = function(container, html) {
    var content = html,
        element = document.getElementById(container);
    for (var prop in content) {
        if (content.hasOwnProperty(prop)) {
            element.innerHTML += content[prop].toHTML();
        }
    }
};

VideoPlayer.prototype.displayProgress = function() {
    var progressContainer = new Container(progressContainerId, 'progress', 'visible'),
        parentVideoControls = document.getElementById(this.controlsContainer);
    progressContainer.createContainer(parentVideoControls);
    var container = progressContainer.id,
        content = {
            progressBar: new Progress(progressId),
            bufferBar: new Progress(bufferId)
        },
        html = content;
    this.renderInElement(container, html);
};

VideoPlayer.prototype.displayControls = function() {
    var buttonContainer = new Container('button-container', 'buttons', 'visible'),
        parent = document.getElementById(this.controlsContainer);
    buttonContainer.createContainer(parent);
    var container = buttonContainer.id,
        html = this.playerControls;
    this.renderInElement(container, html);
};

VideoPlayer.prototype.displayTime = function() {
    var container = playerControls.timeIndicator.id,
        content = {
            currentTimeIndicator: new Indicator(currentTimeIndicatorId, '0:00'),
            durationIndicator: new Indicator(durationIndicatorId, '')
        },
        html = content;
    this.renderInElement(container, html);
};

VideoPlayer.prototype.makeItWork = function() {
    this.setProgress();
    this.setPlayButton();
    // this.setStopButton();
    // this.setSliders();
    // this.setMuteButton();
    // this.setFullScreenButton();
};

VideoPlayer.prototype.setProgress = function() {
    setInterval(function() {
        if (videoPlayer.readyState > 0) {
            var updateTime = function() {
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
            };

        }
        updateTime();
    }, 200);
   /* var clickBarToPlay = function() {
        var progressContainer = document.getElementById(progressContainerId);
        progressContainer.addEventListener('click', function(e) {
            var positionClicked = e.pageX,
                positionContent = contentContainer.offsetLeft,
                positionProgress = progressContainer.offsetLeft,
                playWidth = progressContainer.offsetWidth,
                videoDuration = videoPlayer.duration,
                multiplier;

            if (isFullScreen) {
                multiplier = positionClicked / playWidth;
            } else if (positionContent === 0) {
                multiplier = (positionClicked - positionProgress) / playWidth;
            } else {
                multiplier = (positionClicked - positionContent - positionProgress) / playWidth;
            }

            var setTime = multiplier * videoDuration;

            videoPlayer.currentTime = setTime;
            // alert('positionContent =' + positionContent  + '; setTime =' + setTime);

            // videoPlayer.play();
        });
    };
    clickBarToPlay();*/
};

VideoPlayer.prototype.setPlayButton = function() {
    var hasPlayButton = this.playerControls.playButton;
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

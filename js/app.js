var supportsVideo = !!document.createElement('video').canPlayType,
    videoContainer = document.getElementById('video-container'),
    videoPlayer = document.querySelector('#video-player'),
    contentContainer = document.getElementById('content-container');

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

window.onload = function() {

    // Video
    var videoContainer = document.querySelector('#video-container');
    var videoPlayer = document.querySelector("#video-player");
    var videoDuration = Math.floor(videoPlayer.duration) / 100;

    // Remove default controls
    if (videoPlayer.hasAttribute("controls")) {
        videoPlayer.removeAttribute("controls");
    }

    // Add custom controls
    var div = document.createElement('div');
    div.setAttribute('id', 'video-controls');
    var controlsHTML = '';
    controlsHTML += '<button type="button" id="play-pause">Play</button>\n';
    controlsHTML += '<input type="range" id="seek-bar" value="0">\n';
    controlsHTML += '<button type="button" id="mute">Mute</button>\n';
    controlsHTML += '<input type="range" id="volume-bar" min="0" max="1" step="0.1" value="1">\n';
    controlsHTML += '<button type="button" id="full-screen">Full-Screen</button>\n';
    controlsHTML += '<p id="video-current-time">0.00 / </p>';
    controlsHTML += '<p id="video-duration">' + videoDuration + '</p>';
    div.innerHTML = controlsHTML;
    videoContainer.appendChild(div);


    // Buttons
    var playButton = document.querySelector("#play-pause");
    var muteButton = document.querySelector("#mute");
    var fullScreenButton = document.querySelector("#full-screen");

    // Sliders
    var seekBar = document.querySelector("#seek-bar");
    var volumeBar = document.querySelector("#volume-bar");

    // Event listener for the play/pause button
    playButton.addEventListener("click", function() {
        if (videoPlayer.paused === true) {
            // Play the video
            videoPlayer.plabackRate = 2;
            videoPlayer.play();

            // Update the button text to 'Pause'
            playButton.innerHTML = "Pause";
        } else {
            // Pause the video
            videoPlayer.pause();

            // Update the button text to 'Play'
            playButton.innerHTML = "Play";
        }
    });


    // Event listener for the mute button
    muteButton.addEventListener("click", function() {
        if (videoPlayer.muted === false) {
            // Mute the video
            videoPlayer.muted = true;

            // Update the button text
            muteButton.innerHTML = "Unmute";
        } else {
            // Unmute the video
            videoPlayer.muted = false;

            // Update the button text
            muteButton.innerHTML = "Mute";
        }
    });


    // Event listener for the full-screen button
    fullScreenButton.addEventListener("click", function() {
        if (videoPlayer.requestFullscreen) {
            videoPlayer.requestFullscreen();
        } else if (videoPlayer.mozRequestFullScreen) {
            videoPlayer.mozRequestFullScreen(); // Firefox
        } else if (videoPlayer.webkitRequestFullscreen) {
            videoPlayer.webkitRequestFullscreen(); // Chrome and Safari
        }
    });

    // Event listener for the seek bar
    seekBar.addEventListener("change", function() {
        // Calculate the new time
        var time = videoPlayer.duration * (seekBar.value / 100);

        // Update the video time
        videoPlayer.currentTime = time;
    });


    // Update the seek bar and current time as the video plays
    videoPlayer.addEventListener("timeupdate", function() {
        // Calculate the slider value
        var percValue = (100 / videoPlayer.duration) * videoPlayer.currentTime;

        // Update the slider value
        seekBar.value = percValue;


        //Update the current time
        var videoCurrentTime = document.querySelector('#video-current-time');
        videoCurrentTime.innerHTML = Math.round(videoPlayer.currentTime) / 100;
    });

    // Pause the video when the seek handle is being dragged
    seekBar.addEventListener("mousedown", function() {
        videoPlayer.pause();
    });

    // Play the video when the seek handle is dropped
    seekBar.addEventListener("mouseup", function() {
        videoPlayer.play();
    });

    // Event listener for the volume bar
    volumeBar.addEventListener("change", function() {
        // Update the video volume
        videoPlayer.volume = volumeBar.value;
    });
};

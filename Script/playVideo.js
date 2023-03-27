import {
  urlBase, elemCamera, playButton, progressBar, seek, duration, timeElapsed, volume, volumeButton, volumeIcons, volumeMute, volumeLow, volumeHigh,
  videoContainer, videoControls, playbackIcons, seekTooltip,
  fullscreenButton, fullscreenIcons, rewind, forward, pipButton,
  infoSongCont
} from "./inicialitation.js"


//  0.-  Hide native controls (only browser modern !!)
const video = document.createElement('video')
const isSupport = video.canPlayType  // See "HTML Audio/Video DOM canPlayType()"
if (isSupport !== "") {
  elemCamera.controls = false
  videoControls.classList.remove('hidden')
}

//  1.-  Set "src" atributte value of video:  Initial video:  (urlVideo = urlBase + urlNameVideo)
let urlVideo = `${urlBase}/The Beatles - Don't Let Me Down Take 1 - Rooftop Concert.mp4`
elemCamera.src = urlVideo

//  2.-  Function "togglePlay" :  toggles the "playback state" of the element video. If the video playback is
//                                paused or ended, the video is played, otherwise, the video is "paused"
export function togglePlay() {
  if (elemCamera.paused || elemCamera.ended) {
    elemCamera.play()
    infoSongCont.classList.remove('contInfoSong')
    infoSongCont.classList.add('active')
  } else {
    elemCamera.pause()
    infoSongCont.classList.remove('active')
    infoSongCont.classList.add('contInfoSong')
  }
}
//  Add eventListener for the buttom toogle play:  playButton => <button data-title="Play (k)" id="play">
playButton.addEventListener('click', togglePlay)

//  Icon play-pause.  "UpdatePlayButton" => updates the playback icon and tooltip depending on the playback state
export function updatePlayButton() {
  playbackIcons.forEach(icon => icon.classList.toggle('hidden'))

  if (elemCamera.paused || elemCamera.ended) {
    playButton.setAttribute('data-title', 'Play')
  } else {
    playButton.setAttribute('data-title', 'Pause')
  }
}
//  Add eventListeners for the element video (change the icons)
elemCamera.addEventListener('play', updatePlayButton)
elemCamera.addEventListener('pause', updatePlayButton)
elemCamera.addEventListener('ende', updatePlayButton)


//  3.-  Show video "duration" and "elapsed time"
//  The function "formatTime" takes a "time length" in seconds and returns the time in "minutes and seconds"
function formatTime(timeInSeconds) {
  let minutes = Math.floor(timeInSeconds / 60)
  let seconds = timeInSeconds % 60

  if (minutes < 10) {
    minutes = '0' + minutes.toString()
  }
  if (seconds < 10) {
    seconds = '0' + seconds.toString()
  }

  return {
    minutes: minutes,
    seconds: seconds,
  }
}

// Function "InitializeVideo": sets the "video duration" with the property "duration" of element video, 
//                             and maximum value of the progressBar
function initializeVideo() {  //  parElemSeek, parElemProgressBar, parElemtDuration
  const videoDuration = Math.round(elemCamera.duration)
  const time = formatTime(videoDuration)

  seek.setAttribute('max', videoDuration)
  progressBar.setAttribute('max', videoDuration)

  duration.textContent = `${time.minutes}:${time.seconds}`
  duration.setAttribute('datetime', `${time.minutes}m ${time.seconds}s`)
}
//  This function fires with the event "loadedmetadata" of element HTML <video>
elemCamera.addEventListener('loadedmetadata', initializeVideo)

// The function:  "updateTimeElapsed", indicates how far through the video the current playback is
function updateTimeElapsed() {
  const time = formatTime(Math.round(elemCamera.currentTime))
  timeElapsed.textContent = `${time.minutes}:${time.seconds}`
  timeElapsed.setAttribute('datetime', `${time.minutes}m ${time.seconds}s`)
}
//  When <video> fire "timeupdate" the function => "updateTimeElapse" 
elemCamera.addEventListener('timeupdate', updateTimeElapsed);


//  4.-  Updating the "progress bar" (element HTML: progress (name "progressBar"))
// Function "updateProgress": indicates how far through the video the current playback is by updating the progress bar
function updateProgress() {
  seek.value = Math.floor(elemCamera.currentTime)
  progressBar.value = Math.floor(elemCamera.currentTime)
}

elemCamera.addEventListener('timeupdate', updateProgress);


//  5.-  Progress bar: Function "go directly to a position the mouse"
//       The function "updateSeekTooltip" uses the position of the mouse on the progress bar to
//       roughly work out what point in the video the user will skip to if the progress bar is clicked at that point
function updateSeekTooltip(event) {
  const skipTo = Math.round((event.offsetX / event.target.clientWidth) * parseInt(event.target.getAttribute('max'), 10))
  seek.setAttribute('data-seek', skipTo)
  const t = formatTime(skipTo)
  seekTooltip.textContent = `${t.minutes}:${t.seconds}`
  const rect = elemCamera.getBoundingClientRect()
  seekTooltip.style.left = `${event.pageX - rect.left}px`
}

seek.addEventListener('mousemove', updateSeekTooltip)

//       The function "skipAhead" jumps to a different point in the video when the "progress bar" (seek) is "clicked"
function skipAhead(event) {
  const skipTo = event.target.dataset.seek ? event.target.dataset.seek : event.target.value
  elemCamera.currentTime = skipTo
  progressBar.value = skipTo
  seek.value = skipTo
}

seek.addEventListener('input', skipAhead)


//  6.- Volume:  Volume controls
//      The function "updateVolume" updates the video's volume and "disables" the muted state if this active is
function updateVolume() {
  if (elemCamera.muted) {
    elemCamera.muted = false
  }
  elemCamera.volume = volume.value
}
//  Event "input" in the element "input" of volume
volume.addEventListener('input', updateVolume);

// The function "updateVolumeIcon", updates the "volume icon" so that it correctly reflects the volume of the video
function updateVolumeIcon() {
  volumeIcons.forEach(icon => {
    icon.classList.add('hidden')
  })

  volumeButton.setAttribute('data-title', 'Mute (m)')

  if (elemCamera.muted || elemCamera.volume === 0) {
    volumeMute.classList.remove('hidden')
    volumeButton.setAttribute('data-title', 'Unmute (m)')
  } else if (elemCamera.volume > 0 && elemCamera.volume <= 0.5) {
    volumeLow.classList.remove('hidden')
  } else {
    volumeHigh.classList.remove('hidden')
  }
}

elemCamera.addEventListener('volumechange', updateVolumeIcon);

// Muted:  The function "toggleMute" "mutes" or "unmutes" the video when executed
// When the video is "unmuted", the "volume" is returned to the value it was set to before the video was muted
function toggleMute() {
  elemCamera.muted = !elemCamera.muted

  if (elemCamera.muted) {
    volume.setAttribute('data-volume', volume.value)
    volume.value = 0
  } else {
    volume.value = volume.dataset.volume
  }
}

volumeButton.addEventListener('click', toggleMute)


//  7.-  To do click on the video element (screen) to play or pause it
elemCamera.addEventListener('click', togglePlay);
elemCamera.addEventListener('click', animatePlayback);  //  see ende the function "animatePlayback"


//   8.- Full screen video.  The function "toggleFullScreen", toggles the full screen state of the video
//                           If the browser is currently in fullscreen mode, then it should exit and vice-versa.
function toggleFullScreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen()
  } else if (document.webkitFullscreenElement) {
    // Need this to support Safari
    document.webkitExitFullscreen()
  } else if (videoContainer.webkitRequestFullscreen) {
    // Need this to support Safari
    videoContainer.webkitRequestFullscreen()
  } else {
    videoContainer.requestFullscreen()
  }
}

fullscreenButton.addEventListener('click', toggleFullScreen)

//  The function "updateFullscreenButton", changes the "icon" of the "full screen button" and "tooltip" to reflect the 
//  current full screen state of the video
function updateFullscreenButton() {
  fullscreenIcons.forEach(icon => icon.classList.toggle('hidden'))

  if (document.fullscreenElement) {  //  enter in full screen
    fullscreenButton.setAttribute('data-title', 'Exit full screen (f)')
  } else {  //  out from full screen
    fullscreenButton.setAttribute('data-title', 'Full screen (f)')
  }
}

videoContainer.addEventListener('fullscreenchange', updateFullscreenButton);

//  Document: fullscreenchange event
/*
    El evento "fullscreenchange" se activa inmediatamente después de que el navegador cambia o sale del modo de pantalla completa.

    El evento se envía al "Element" que está en transición hacia o desde el modo de pantalla completa, y este evento 
    luego se propaga (burbujea) al "Document".

    Para averiguar si "Element" está entrando o saliendo del modo de pantalla completa, verifique el valor de 
    "Document.fullscreenElement": si este valor es "null" entonces el elemento está saliendo del modo de pantalla completa, 
    de lo contrario está entrando en el modo de pantalla completa.
*/

//  9.-  Video rewinding and forward
rewind.addEventListener('click', mediaBackward);
forward.addEventListener('click', mediaForward);

let intervalRwd;
let intervalFwd;

function mediaBackward() {
  clearInterval(intervalFwd);
  forward.classList.remove('active');

  if (rewind.classList.contains('active')) {
    rewind.classList.remove('active');
    clearInterval(intervalRwd);
    elemCamera.play();
  } else {
    rewind.classList.add('active');
    elemCamera.pause();
    intervalRwd = setInterval(windBackward, 200);
  }
}

function windBackward() {
  if (elemCamera.currentTime <= 3) {
    rewind.classList.remove('active');
    clearInterval(intervalRwd);
    stopMedia();
  } else {
    elemCamera.currentTime -= 3;
  }
}

function windForward() {
  if (elemCamera.currentTime >= elemCamera.duration - 3) {
    forward.classList.remove('active');
    clearInterval(intervalFwd);
    stopMedia();
  } else {
    elemCamera.currentTime += 3;
  }
}

function stopMedia() {
  elemCamera.pause();
  elemCamera.currentTime = 0;
  // elemCamera.setAttribute('data-icon','P');
}

function mediaForward() {
  clearInterval(intervalRwd);
  rewind.classList.remove('active');

  if (forward.classList.contains('active')) {
    forward.classList.remove('active');
    clearInterval(intervalFwd);
    elemCamera.play();
  } else {
    forward.classList.add('active');
    elemCamera.pause();
    intervalFwd = setInterval(windForward, 200);
  }
}

//  10.-  Picture-in-Picture support:  API PIP:  Display videos in a floating window (always on top of other windows).
//  Checking if the API PIP is supported by the browser
document.addEventListener('DOMContentLoaded', () => {
  if (!('pictureInPictureEnabled' in document)) {
    pipButton.classList.add('hidden');
  }
})

//  Function "togglePip":  Picture-in-Picture mode toggle function
async function togglePip() {
  try {
    if (elemCamera !== document.pictureInPictureElement) {
      pipButton.disabled = true
      await elemCamera.requestPictureInPicture()
    } else {
      await document.exitPictureInPicture()
    }
  } catch (error) {
    console.error(error)
  } finally {
    pipButton.disabled = false
  }
}

//  Event "click" of "pipButton" => function "togglePip"
pipButton.addEventListener('click', togglePip)


//  11.-  Toggle video controls
// hideControls hides the video controls when not in use
// if the video is paused, the controls must remain visible
function hideControls() {
  if (elemCamera.paused) {
    return;
  }

  videoControls.classList.add('hide');
}

// showControls displays the video controls
function showControls() {
  videoControls.classList.remove('hide');
}


//  Events of mouse (enter => showControls, leave => hide controls)
elemCamera.addEventListener('mouseenter', showControls);
elemCamera.addEventListener('mouseleave', hideControls);
videoControls.addEventListener('mouseenter', showControls);
videoControls.addEventListener('mouseleave', hideControls);




//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  API Animation:  Function "animatePlayback", displays an "animation" when the video is played or paused
//  Nicht funkcioniert  !!
function animatePlayback() {
  elemCamera.animate([
    {
      opacity: 1,
      transform: "scale(1.1)",
    },
    {
      opacity: 0,
      transform: "scale(1)",
    }], {
    duration: 200,
  });
}


//////////////////////////////////////////////////////////////////////////////
/*
    HTML Audio/Video DOM canPlayType() Method

    Check if your browser can play different types of video

    1.-  Definition and Usage

    The canPlayType() method checks if the browser can play the specified audio/video type.

    Return Value:	A "string", representing the level of support. The canPlayType() method can return one of the 
                  following values:

                  "probably" - most likely support, the browser most likely supports this audio/video type
                  "maybe" - might support, the browser might support this audio/video type
                  "" - (empty string) no support, the browser does not support this audio/video type


    2.-  Syntax:  audio|video.canPlayType(type)

    3.-  Parameter - Values

        Value	                               Description

        type	                               Specifies the audio/video type (and optional codecs) to test support for.
                                              Common values:
                                                              video/ogg
                                                              video/mp4
                                                              video/webm
                                                              audio/mpeg
                                                              audio/ogg
                                                              audio/mp4

                                              Common values, including codecs:
                                                                                video/ogg; codecs="theora, vorbis"
                                                                                video/mp4; codecs="avc1.4D401E, mp4a.40.2"
                                                                                video/webm; codecs="vp8.0, vorbis"
                                                                                audio/ogg; codecs="vorbis"
                                                                                audio/mp4; codecs="mp4a.40.5"

                                              Note: This method can only return "probably" if codecs are included.

*/

/*    HTML Audio and Video DOM Reference

      The HTML5 DOM has methods, properties, and events for the <audio> and <video> elements.

      1.-  HTML Audio/Video Methods

      Method	                    Description

      addTextTrack()	            Adds a new text track to the audio/video

      canPlayType()	              Checks if the browser can play the specified audio/video type

      load()	                    Re-loads the audio/video element

      play()	                    Starts playing the audio/video

      pause()	                    Pauses the currently playing audio/video


      2.-  HTML Audio/Video Properties

      Property	                  Description

      audioTracks	                Returns an AudioTrackList object representing available audio tracks

      autoplay	                  Sets or returns whether the audio/video should start playing as soon as it is loaded

      buffered	                  Returns a "TimeRanges object", representing the buffered parts of the audio/video

      controller	                Returns the "MediaController object", representing the current media controller of the audio/video

      controls	                  Sets or returns whether the audio/video should display controls (like play/pause etc.)

      crossOrigin	                Sets or returns the CORS settings of the audio/video

      currentSrc	                Returns the URL of the current audio/video

      currentTime	                Sets or returns the "current playback position" in the audio/video (in seconds)

      defaultMuted	              Sets or returns whether the audio/video should be muted by default

      defaultPlaybackRate	        Sets or returns the "default speed" of the audio/video playback

      duration	                  Returns the "length (in seconds)"" of the current audio/video (in seconds)

      ended	                      Returns whether the playback of the audio/video has ended or not (boolean)

      error	                      Returns a "MediaError object" representing the "error state" of the audio/video

      loop	                      Sets or returns whether the audio/video should start over again when finished

      mediaGroup	                Sets or returns the group the audio/video belongs to (used to link multiple audio/video elements)

      muted	                      Sets or returns whether the audio/video is muted or not

      networkState	              Returns the "current network state" of the audio/video

      paused	                    Returns whether the audio/video is paused or not

      playbackRate	              Sets or returns "the speed" of the audio/video playback

      played	                    Returns a "TimeRanges object", representing the played parts of the audio/video

      preload	                    Sets or returns whether the audio/video should be loaded when the page loads

      readyState	                Returns the current "ready state" of the audio/video

      seekable	                  Returns a "TimeRanges object" representing the seekable parts of the audio/video

      seeking	                    Returns whether the user is currently seeking in the audio/video

      src	                        Sets or returns the "current source" of the audio/video element

      startDate	                  Returns a Date object representing the current time offset

      textTracks	                Returns a TextTrackList object representing the available text tracks

      videoTracks	                Returns a VideoTrackList object representing the available video tracks

      volume	                    Sets or returns "the volume" of the audio/video


      3.-  HTML Audio/Video Events

      Event	                      Description

      abort	                      Fires when the loading of an audio/video is aborted

      canplay	                    Fires when the browser can start playing the audio/video

      canplaythrough	            Fires when the browser can play through the audio/video without stopping for buffering

      durationchange	            Fires when "the duration" of the audio/video is changed

      emptied	                    Fires when the current playlist is empty

      ended	                      Fires when the current playlist is ended

      error	                      Fires when an error occurred during the loading of an audio/video

      loadeddata	                Fires when the browser has loaded the current frame of the audio/video

      loadedmetadata	            Fires when the browser has loaded meta data for the audio/video

      loadstart	                  Fires when the browser starts looking for the audio/video

      pause	                      Fires when the audio/video has been paused

      play	                      Fires when the audio/video has been started or is no longer paused

      playing	                    Fires when the audio/video is playing after having been paused or stopped for buffering

      progress	                  Fires when the browser is downloading the audio/video

      ratechange	                Fires when "the playing speed of the audio/video is changed"

      seeked	                    Fires when the user is finished moving/skipping to a new position in the audio/video

      seeking	                    Fires when the user starts moving/skipping to a new position in the audio/video

      stalled	                    Fires when the browser is trying to get media data, but data is not available

      suspend	                    Fires when the browser is intentionally not getting media data

      timeupdate	                Fires when the current playback position has changed

      volumechange	              Fires when the volume has been changed

      waiting	                    Fires when the video stops because it needs to buffer the next frame
*/

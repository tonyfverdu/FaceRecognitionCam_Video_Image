////    CONSTANTS:  urlBase, urlModels
//  Initial video:  (urlVideo = urlBase + urlNameVideo)
export const urlBase = "./assets/videos"
export const urlModels = "./assets/models"
export let canvasCtx


//  1.-  ELEMENTS HTML - REFERENCES
//  Elements "radio buttons" for select "camera", "video" or "image"
//  <input class="radioBtn" type="radio" id="rbtnInput1" name="input" value="camera" checked="checked">
export const elemtRadioBtn = document.querySelectorAll(".selectBtn")
export const radiobtnCamera = document.querySelector("#camaraInput")
export const radiobtnVideo = document.querySelector("#videoInput")
export const radiobtnImage = document.querySelector("#imageInput")

export const sortNameBtn = document.querySelector("#sortName")
export const sortYearBtn = document.querySelector("#sortYear")

//  Elements "select" for select videos off-line:  <select id="selectVideos" name="selectVideos" class="select"></select>
export const selectVideos = document.querySelector("#selectVideos")

//  Element "button" of select video:  <button id="buttonSelectVideo" type="submit" class="buttonSelect">Select</button>
export const elemBtnSelectVideo = document.querySelector("#buttonSelectVideo")

//  3.-  ELEMENTS HTML OF INFO VIDEO
export const infoSongCont = document.querySelector('#infoSongCont')
export const titleSongOfAlbum = document.querySelector("#titleSongOfAlbum")
export const vocalsOfSong = document.querySelector('#vocalsOfSong')
export const imageAlbumOfSong = document.querySelector('#imageAlbumOfSong')
export const infoAlbum = document.querySelector('#infoAlbum')
export const infoYear = document.querySelector('#infoYear')
export const infoDuration = document.querySelector('#infoDuration')

//  2.-  ELEMENTS HTML OF CONTAINER VIDEO
//  2.0.-  Element container of video:  <div class="contVideo" id="video-container"></div>
export const videoContainer = document.querySelector('#contOfVideo')

//  2.1.-  Element div "playback-animation":  <div class="" id="playback-animation"></div>
export const playbackAnimation = document.querySelector('#playback-animation')

//  2.2.-  Element Video-Camera: <video id="cameraWeb" class="video" width="1200px" height="600px" controls muted preload="metadata" poster="./assets/imag/carousel12.jpg"></video>
export const elemCamera = document.querySelector("#cameraWeb")

//  2.3.-  New video controls:
//  2.3.0.-  Video controls container: <div class="video-controls hidden" id="video-controls"></div>
export const videoControls = document.querySelector('#video-controls')

//  2.3.1.-  Progress bar: <progress id="progress-bar" value="0" min="0"></progress>
export const progressBar = document.querySelector('#progress-bar')

//  2.3.2.-  Element "range" (seek):  <input class="seek" id="seek" value="0" min="0" type="range" step="1">
export const seek = document.querySelector('#seek')

//  2.3.3.-  Element div "seek-tooltip":  <div class="seek-tooltip" id="seek-tooltip">00:00</div>
export const seekTooltip = document.querySelector('#seek-tooltip')

//  2.4.-    Elements of bottoms gruppe
//  2.4.1.-  Element buttom:  "play":  //  Toggle playback status
export const playButton = document.querySelector('#play')

//  2.4.1.2.-  Elements "svg":  Icons of play/pausse
export const playbackIcons = document.querySelectorAll('.playback-icons use')
/*
<button data-title="Play (k)" id="play">
    <svg class="playback-icons">
        <use href="#play-icon"></use>
        <use class="hidden" href="#pause"></use>
     </svg>
</button>
*/


//  2.4.2.-  Elements HTML volume control:  <div class="volume-controls"></div>
//  2.4.2.1- Buttom "volume":  <button data-title="Mute (m)" class="volume-button" id="volume-button">...</button>
export const volumeButton = document.querySelector('#volume-button')

//  2.4.2.2.-  Array of elementsHTML icons: <svg><use class="hidden" href="..."></use>
export const volumeIcons = document.querySelectorAll('.volume-button use')

//  2.4.2.3.-  Select element "volumeMute":  <use class="hidden" href="#volume-mute"></use>
export const volumeMute = document.querySelector('use[href="#volume-mute"]')

//  2.4.2.4.-  Select element "volumeLow":  <use class="hidden" href="#volume-low"></use>
export const volumeLow = document.querySelector('use[href="#volume-low"]')

//  2.4.2.5.-  Select element "volumeHigh":  <use class="hidden" href="#volume-high></use>
export const volumeHigh = document.querySelector('use[href="#volume-high"]')

//  2.4.2.6.-  Select element "volume":  <input type="range" class="volume" id="volume" value="1" 
//                             data-mute="0.5" max="1" min="0" step="0.01">
export const volume = document.querySelector('#volume')
/*
 <div class="volume-controls">
    <button data-title="Mute (m)" class="volume-button" id="volume-button">
      <svg>
        <use class="hidden" href="#volume-mute"></use>
        <use class="hidden" href="#volume-low"></use>
        <use href="#volume-high"></use>
      </svg>
    </button>

    <input class="volume" id="volume" value="0.6" data-mute="0.5" type="range" max="1" min="0" step="0.01">
 </div>
*/


//  2.4.3.-  Elements of time elapsed
//  2.4.3.1.-  Element "time" "time-elapsed":  <time id="time-elapsed">00:00</time>
export const timeElapsed = document.querySelector('#time-elapsed')

//  2.4.3.2.-  Element "time" "duration": <time id="duration">00:00</time>
export const duration = document.querySelector('#duration')
/*
<div class="time">
  <time id="time-elapsed">00:00</time>
  <span> / </span>
  <time id="duration">00:00</time>
</div>
*/


// 2.4.4.-  Elements of buttons "forward and rewind"
//  2.4.4.1.-  Element button "rewind"
export const rewind = document.querySelector("#rwd")

//  2.4.4.2.-  Element button "forward"
export const forward = document.querySelector("#fwd")
/*
<div class="contRwdFwd">
  <button id="rwd" class="wd" data-icon="B" aria-label="rewind"></button>
  <button id="fwd" class="wd" data-icon="F" aria-label="fast forward"></button>
</div>
*/


//  2.4.5.-  Right controls:  button "PIP" and button "Full screen"
//  2.4.5.1.-  Elements (array) of "icons" of use:  
export const fullscreenIcons = document.querySelectorAll('use')

//  2.4.5.2.-  Element "buttom":  "full screen":  <button data-title="Full screen (f)" class="fullscreen-button" id="fullscreen-button">
export const fullscreenButton = document.getElementById('fullscreen-button')

//  2.4.5.3.-  Element "buttom":  "PIP":   <button data-title="PIP (p)" class="pip-button" id="pip-button">
export const pipButton = document.querySelector("#pip-button")
/*
<button data-title="Full screen (f)" class="fullscreen-button" id="fullscreen-button">
  <svg>
    <use href="#fullscreen"></use>
    <use href="#fullscreen-exit" class="hidden"></use>
  </svg>
</button>
*/


//  3.-  IMAGE   ///////////////////////////////////////////////////////
//  3.1.-  container of image:  <div id="contOfImage" class="contImage">
export const contImage = document.querySelector("#contOfImage")
export const styleContImage = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  width: "1200px",
  height: "600px",
  padding: "0%",
  borderRadius: "9px 0px 0px 9px",
  gap: "0.3 %"
}
//  Element input type="file:  "image upload":  <input type="file" id="imageUpload" class="imageUpload">
export const imageUpload = document.querySelector('#imageUpload')
export const contImgInfo = document.querySelector("#contImg-Info")
export const infoLoad = document.querySelector("#infoLoad")

export const img = document.querySelector("#imageCentral")

//  Constants
export const url_Models = "./assets/models"
export const labelsOfModels = ['George Harrison', 'John Lennon', 'Paul McCartney', 'Ringo Starr']

//    *******   Facial recognition video processing     ***************************************************
import { typeSignal, toogleFaceRecognition, putGeneralLandmarks, videoName } from "./main.js"
import { generalLandmarks, elemtNumberOfFace, radiobtnVideo, videoContainer, elemCamera, contImage, urlBase, urlModels } from "./inicialitation.js"
import { inputSignal, controlActiveInfoSong, toggleImageFace, promiseFaceapi, starVideo } from "./functions.js"
import dataVideos from "../assets/videos/dataVideos.js"


//    Input Signal:  Videos off-line

// 1.- Variables
let tipoSenal = ""
let toogleVideo = false
let detections
export let theVideoName = "Don't Let Me Down"

export let videoFile = "The Beatles - Don't Let Me Down Take 1 - Rooftop Concert.mp4"
let urlVideo = `${urlBase}/${videoFile}`

elemtNumberOfFace.textContent = ""

let theVideo = null
let resizedDetections = null
const displaySize = { width: 600, height: 550 }  //  <== Image dimensions always the same (fixed)

//  2.-  Events
//  2.1-  Select of input signal: typeSignal = 'video':  Event "click" in the radio button of select ("radiobtnVideo")
radiobtnVideo.addEventListener('click', (ev) => {
  //  If there is a canvas for video signal recognition processing, then delete it:  const myCanvas = await faceapi.createCanvasFromMedia(parElemVideo)
  if (document.querySelector('#myCanvasCamera')) {
    console.log('entro aquiiiii')
    document.querySelector('#myCanvasCamera').remove()
  }

  //  Stop disk animation:
  imageAlbumOfSong.style.animation = 'none'
  tipoSenal = inputSignal('video', elemCamera)

  controlActiveInfoSong(infoSongCont, imageAlbumOfSong, elemCamera, tipoSenal)

  //  "Setter" of container in main
  videoContainer.style.display = "flex"
  contImage.style.display = "none"
  toggleImageFace(infoFaceRecogCont, 'video')

  toogleVideo = !toogleVideo
  if (toogleVideo) {
    const videoSelect = dataVideos.find(video => video.name === theVideoName)
    theVideoName = videoSelect.video
    elemCamera.setAttribute("poster", `./assets/imag/portadas/${videoSelect.image[0]}`)
    urlVideo = `${urlBase}/${theVideoName}`
    promiseFaceapi(recognitionVideo(urlVideo, elemCamera), urlModels) //  <=  Loading of the required faceapi face recognition models
  }
}, false)

//  3.-  Functions for management video recognition

// export function starVideo(parVideo, parCamera) {
//   if (typeof (parVideo) === "string" && parCamera instanceof HTMLElement) {
//     parCamera.src = parVideo
//   } else {
//     console.error('Error: The arguments of the function "starVideo(parVideo, parCamera)" must be a string and instanceof HTMLElement!!')
//   }
// }


async function recognitionVideo(parUrlVideo, parCamera) {
  //  Delete old canvas from video (id="newCanvas")
  const theCanvas = document.querySelector('#myCanvasCamera')
  console.log('Antes hay canvas:  ', theCanvas)
  if (theCanvas !== null) {
    console.log('entro aqui a remover canvas')
    theCanvas.remove()
  }
  console.log('despues hay canvas:  ', theCanvas)

  starVideo(urlVideo, elemCamera)
  // const newCanvas = faceapi.createCanvasFromMedia(theImage)
  // newCanvas.setAttribute('id', 'newCanvas')
  // // const displaySize = { width: 600, height: 550 }
  // faceapi.matchDimensions(newCanvas, displaySize)
  // newCanvas.style.top = "44px"
  // newCanvas.style.left = "300px"
  // newCanvas.style.borderRadius = "0px"
  // contImage.append(newCanvas)

  // console.log(newCanvas)

  
   //  Get image from faceapi with: "bufferToImage(imageUpload.files[0])"
  //  theImage = await faceapi.bufferToImage(imageUpload.files[0])
  //  img.src = theImage.src

  /*
  if (toogleFaceRecognition) {
    //  1.-  Create and initialize new canvas from "image" and put in front of image (id="newCanvas")
    const newCanvas = faceapi.createCanvasFromMedia(theImage)
    newCanvas.setAttribute('id', 'newCanvas')
    // const displaySize = { width: 600, height: 550 }
    faceapi.matchDimensions(newCanvas, displaySize)
    newCanvas.style.top = "44px"
    newCanvas.style.left = "300px"
    newCanvas.style.borderRadius = "0px"
    contImage.append(newCanvas)

    const ctxNewcanvas = newCanvas.getContext("2d")
    // ctxNewcanvas.clearRect(0, 0, newCanvas.width, newCanvas.height)
    ctxNewcanvas.fillStyle = 'red';
    ctxNewcanvas.fillRect(0, 0, newCanvas.width, newCanvas.height)


    //  2.-  Use the "faceapi" to detect all the faces of the image:  method "detectAllFaces(theImage)" with the default model "SSD Mobilenet v1"
    detections = await faceapi.detectAllFaces(theImage)
      .withFaceLandmarks()
      .withFaceDescriptors()
      .withFaceExpressions()
      .withAgeAndGender()

    //  3.-  Draw face in canvas
    // customBox(canvasFace, detections, theImage)  //  !!  ACHTUNG  ************************************************* 
    // customBoxSingleFace(canvasFace, numberOfFaceSelect, detections, theImage)
    drawFacesRecogCanvas(newCanvas, canvasFace, detections, displaySize, resizedDetections, putLandMark, numberOfFaceSelect, theImage)

    infoLoad.textContent = `Images faces recognition:  ${detections.length}`
    uploadSelectFaces(detections.length, selectFaces)
  } else {
    infoLoad.textContent = `Not images faces recognition`
  }
  */
}

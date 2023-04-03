//    *******   Facial recognition image processing     ***************************************************
import { toogleFaceRecognition } from "./main.js"
import {
  urlModels, elemCamera, selectLandmarks, radiobtnImage, imageAlbumOfSong, infoSongCont, videoContainer, contImage,
  infoFaceRecogCont, infoLoad, selectFaces, buttonSelectFaces, elemtNumberOfFace, imageUpload, img
} from "./inicialitation.js"
import {
  inputSignal, controlActiveInfoSong, toggleImageFace, printInfo, promiseFaceapi, resetDataFace,
  drawFacesRecogCanvas, customBox, customBoxSingleFace, uploadSelectFaces, loadInfoOfFace
} from "./functions.js"


//    Input Signal:  Images

// 1.- Variables
let putLandMark = false
let tipoSenal = ""
let toogleImage = false
let detections

elemtNumberOfFace.textContent = ""

let theImage = null
let resizedDetections = null
const displaySize = { width: 600, height: 550 }  //  <== Image dimensions always the same (fixed)


//  2.-  Events.
//  1.-  Select "land marks" for face recognition in image:  
//       Event "change" in checkbox "selectLandmarks" => Selection or not of face marking (landmarks) drawing
selectLandmarks.addEventListener('change', ev => {
  if (ev.target.value === 'off') {
    putLandMark = true
    selectLandmarks.value = 'on'
  } else {
    putLandMark = false
    selectLandmarks.value = 'off'
  }
  console.table(putLandMark, selectLandmarks.value)
}, false)

//  2.-  Select of input signal image:  Event "click" in the radio button of select ("radiobtnImage") of input signal of image
radiobtnImage.addEventListener('click', () => {
  //  If there is a canvas for video signal recognition processing, then delete it:  const myCanvas = await faceapi.createCanvasFromMedia(parElemVideo)
  if (document.querySelector('#myCanvas')) {
    console.log('  Entro en borarr canvas para el tratamiento de video senal')
    document.querySelector('#myCanvas').remove()
  }
  imageAlbumOfSong.style.animation = 'none'
  tipoSenal = inputSignal('image', elemCamera)

  //  Stop disk animation:  <img id="imageAlbumOfSong" src="./assets/imag/portadas/TheBeatlesGetBackTheRooftopPerformance.jpg" alt="" class="imgAlbum"> 
  controlActiveInfoSong(infoSongCont, imageAlbumOfSong, elemCamera, tipoSenal)

  //  "Setter" of container in main
  videoContainer.style.display = "none"
  contImage.style.display = "flex"
  toggleImageFace(infoFaceRecogCont, tipoSenal)

  toogleImage = !toogleImage
  if (toogleImage) {
    elemCamera.setAttribute('poster', './assets/imag/portadas/TheBeatlesGetBackTheRooftopPerformance.jpg')
    printInfo(infoLoad)
    promiseFaceapi(recognitionImage, urlModels) //  <=  Loading of the required faceapi face recognition models
  }
}, false)


//  3.1.-  Obtaining and processing of facial recognition information.
let faceSelect = "Face 1"                 //  <==  Initialization of "selectFaces":  "string" of option from selectFaces:  'Face 1', 'Face 2', ...
let numberOfFaceSelect = 1                //  <==  Initialization of index of faces selected:  "integer" => "index + 1" of face select


async function recognitionImage() {
  //  Delete old canvas from image (id="newCanvas")
  const canvas = document.querySelector("#newCanvas")
  if (canvas !== null) canvas.remove()

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
   theImage = await faceapi.bufferToImage(imageUpload.files[0])
   img.src = theImage.src

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
}


//  3.1.1.-  Get info (value of option) of faces selectFaces element HTML => event "change"
selectFaces.addEventListener('change', function (ev) {
  const optionFaces = document.querySelectorAll(".optionFaces")
  faceSelect = optionFaces[ev.target.selectedIndex].value
}, false)

//  3.1.2.-  In the event of button "buttonSelectFaces", get "index + 1" of face select.  
//           Callback "loadInfoOfFace", show info from the face selected (return "theFaceSelect")
buttonSelectFaces.addEventListener('click', (ev) => {
  //  ***************************************************************************   <<==  MIRAR BIEN
  resetDataFace()
  //  Recreate the conditions of the image canvas when changing face
  const ctxCanvasFace = document.querySelector('#canvasFace').getContext('2d')
  ctxCanvasFace.clearRect(0, 0, canvasFace.width, canvasFace.height)

  // const newCanvas = faceapi.createCanvasFromMedia(theImage)
  // newCanvas.setAttribute('id', 'newCanvas')
  // // const displaySize = { width: 600, height: 550 }
  // faceapi.matchDimensions(newCanvas, displaySize)
  // newCanvas.style.top = "44px"
  // newCanvas.style.left = "300px"
  // newCanvas.style.borderRadius = "0px"
  // contImage.append(newCanvas)

  // console.log(newCanvas)

  // const ctxNewcanvas = newCanvas.getContext("2d")
  // ctxNewcanvas.clearRect(0, 0, newCanvas.width, newCanvas.height)

  numberOfFaceSelect = parseInt(faceSelect.slice(5), 10)
  loadInfoOfFace(numberOfFaceSelect, detections)

  recognitionImage()

  //  Draw new select face in canvasFace
  // drawFacesRecogCanvas(newCanvas, detections, displaySize, resizedDetections, putLandMark, numberOfFaceSelect)
  // customBoxSingleFace(canvasFace, numberOfFaceSelect, detections, theImage)
}, false)


//  3.2.-  Function "recognitionImage":  Event "change" in the element HTML "imageUpload":  <input type="file" id="imageUpload" class="imageUpload">
//         use faceapi with "image" input ==> recognition of image faces from faceapi
imageUpload.addEventListener('change', ev => {
  infoLoad.textContent = ev.target.value
  printInfo(infoLoad)
  recognitionImage()
}, false)


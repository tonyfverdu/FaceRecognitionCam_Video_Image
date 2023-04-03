/* eslint-disable no-undef */
//  0.-  Function "uploadData":  Videos data upload (from parJSON) in the select element (parElemSelect)
export function uploadData(parJSON, parElemSelect, parClassOptions) {
  let arrayOfData = []
  if (Array.isArray(parJSON)) {
    arrayOfData = parJSON.map((elem, index) => {
      const optionElem = document.createElement("option")
      optionElem.classList.add(parClassOptions)
      optionElem.value = elem.name
      optionElem.textContent = `${elem.name}`
      parElemSelect.append(optionElem)
      if (index === 0) {
        const atrSelected = document.createAttribute("selected")
        optionElem.setAttributeNode(atrSelected)
      }
    })
  } else {
    console.error('Error:  The argument "parJSON" of the function "uploadData" must be an array (JSON of data)!')
    arrayOfData = null
  }
  return arrayOfData
}
export function sortDataString(parArrayData, parDirection) {
  let arraySorted = []

  if (Array.isArray(parArrayData) && (parDirection === 'AZ' || parDirection === 'ZA')) {
    const elemtOptions = document.querySelectorAll('option')
    const arrayOfElementsOpt = Array.from(elemtOptions)
    arrayOfElementsOpt.forEach(option => option.remove())

    if (parDirection === 'AZ') {
      arraySorted = parArrayData.sort((x, y) => x.name.localeCompare(y.name))
    } else {
      arraySorted = parArrayData.sort((x, y) => y.name.localeCompare(x.name))
    }
  } else {
    console.error('Error: The argument of the function "sortDataString" must be an array!')
    arraySorted = null
  }
  return arraySorted
}
export function sortDataNum(parArrayData, parDirection) {
  let arraySorted = []

  if (Array.isArray(parArrayData) && (parDirection === 'growing' || parDirection === 'decreasing')) {
    const elemtOptions = document.querySelectorAll('option')
    const arrayOfElementsOpt = Array.from(elemtOptions)
    arrayOfElementsOpt.forEach(option => option.remove())

    if (parDirection === 'growing') {
      arraySorted = parArrayData.sort((x, y) => x.year - y.year)
    } else {
      arraySorted = parArrayData.sort((x, y) => y.year - x.year)
    }
  } else {
    console.error('Error: The argument of the function "sortDataNum" must be an array!')
    arraySorted = null
  }
  return arraySorted
}

//  1.-  Play Video:  startVideo => element HTML:  <video id="cameraWeb" class="video" width="760px" height="520px" preload="metadata" controls
//                                                  poster="./assets/imag/portadas/TheBeatlesGetBackTheRooftopPerformance.jpg">
export function starVideo(parUrlVideo, parCamera) {
  if (typeof (parUrlVideo) === "string" && parCamera instanceof HTMLElement) {
    parCamera.src = parUrlVideo
  } else {
    console.error('Error: The arguments of the function "starVideo(parUrlVideo, parCamera)" must be a string and instanceof HTMLElement!!')
  }
}

//  2.1-  Play stream live of Camera Web (parCamera)
export function starCam(parCamera) {
  if (parCamera instanceof HTMLElement) {
    navigator.mediaDevices.getUserMedia({ "video": true, "audio": false })
      .then(stream => parCamera.srcObject = stream)
      .catch(error => console.error(`There is an Error !!:  error: ${error}`))
  } else {
    console.error('Error:  The arguments of the function "starCam(parCamera)" must be a instance of HTMLElement')
  }
}

// 2.2.-  Stop steam in cam
export function stopStreamVideoOnly(stream, parElemCamera) {
  if (parElemCamera.srcObject) parElemCamera.srcObject = null
  stream.getTracks().forEach(track => {
    if (track.readyState == 'live' && track.kind === 'video') {
      track.stop()
    }
  })
}

//  3.-  Async function of get all promises of the models-face-api
export async function promiseFaceapi(parFunctionVideo, parURL_Models) {
  await Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromUri(parURL_Models),
    faceapi.nets.tinyFaceDetector.loadFromUri(parURL_Models),
    faceapi.nets.faceLandmark68Net.loadFromUri(parURL_Models),
    faceapi.nets.faceRecognitionNet.loadFromUri(parURL_Models),
    faceapi.nets.faceExpressionNet.loadFromUri(parURL_Models),
    faceapi.nets.ageGenderNet.loadFromUri(parURL_Models),
  ])
    .then(parFunctionVideo)
    .catch(err => console.error(`Error:  There is a error in the function "promiseFaceapi".  ${err}`))
}

//  4.-  Creation of canvas from the method "createCanvasFromMedia" of faceapi
export async function createCanvas(parElem, parIdCanvas) {
  const myCanvas = await faceapi.createCanvasFromMedia(parElem)
  myCanvas.setAttribute("id", parIdCanvas)
  // myCanvas.classList.add(parClassCanvas)
  document.body.append(myCanvas)          //  <== Place the created canvas in the body of the document (See better in contVideo)
}

//  5.-  Delete canvas of face recognition
export function deleteCanvas(parIdCanvas) {
  const TheCanvas = document.querySelector(parIdCanvas)
  if (TheCanvas !== null) TheCanvas.remove()
}

//  6.-  Function "getter" of info of video select.
export function getInfoVideo(parDataJSON, parNameVideo) {
  let resultVideo = {}
  if (Array.isArray(parDataJSON) && typeof (parNameVideo) === "string") {
    resultVideo = parDataJSON.find(video => {
      return video.name === parNameVideo
    })
  } else {
    console.error('Error:  The arguments of the function "getInfoVideo" must be an array and a string!')
    resultVideo = null
  }
  return resultVideo
}

//  7.-  Function upload the select faces recognitions.
export function uploadSelectFaces(parDetectionsNumber, parSelectFaces) {
  if (Number.isInteger(parDetectionsNumber) && parDetectionsNumber > 0) {
    const optionsInSelect = parSelectFaces.querySelectorAll('option')
    const arrayOptionsFaces = Array.from(optionsInSelect)
    for (let j = 0; j < arrayOptionsFaces.length; j++) {
      arrayOptionsFaces[j].remove()
    }

    for (let i = 1; i <= parDetectionsNumber; i++) {
      const optionFaces = document.createElement('option')
      optionFaces.classList.add('optionFaces')
      optionFaces.textContent = `Face ${i}`
      parSelectFaces.appendChild(optionFaces)
    }
  } else {
    console.log('Error:  The argument of the function "uploadSelectFaces" must be an integer greater than zero!')
  }
}

//  8.- Function "uploadDetections":  load the data of all faces (detections)
export function uploadDetections(parDetections) {
  let facesDetection = []
  if (parDetections) {
    facesDetection = Array.from(parDetections).map(detection => {
      // console.log('detection:  ', detection)
      return {
        arrayLandmarks: detection.landmarks._shift,
        dimensionsBox: detection.detection._box,
        expressions: {
          neutral: `${please2decimals(detection.expressions.neutral * 100)}%`,
          happy: `${please2decimals(detection.expressions.happy * 100)}%`,
          sad: `${please2decimals(detection.expressions.sad * 100)}%`,
          angry: `${please2decimals(detection.expressions.angry * 100)}%`,
          surprised: `${please2decimals(detection.expressions.surprised * 100)}%`,
          fearful: `${please2decimals(detection.expressions.fearful * 100)}%`,
          disgusted: `${please2decimals(detection.expressions.disgusted * 100)}%`
        },
        age: Math.round(detection.age),
        gender: detection.gender,
        genderProbability: `${please2decimals(detection.genderProbability * 100)}%`
      }
    })
  } else {
    console.error('Error:  The argument of the function "uploadDetections" must be an array of detections of faces!!')
    facesDetection = null
  }
  return facesDetection
}

//  9.-  Show info from the face selected
export function loadInfoOfFace(parNumFace, parDetections) {
  let theFaceSelect = {}
  resetDataFace()
  const faceDetection = uploadDetections(parDetections)

  const faceSelect = faceDetection[parNumFace - 1]

  const dimBoxFace = faceSelect.dimensionsBox

  const elemtNumberOfFace = document.querySelector('#numberOfFace')
  const elemtExpNeutral = document.querySelector('#expNeutral')
  const elemtExpHappy = document.querySelector('#expHappy')
  const elemtExpSad = document.querySelector('#expSad')
  const elemtExpAngry = document.querySelector('#expAngry')
  const elemtExpSusprised = document.querySelector('#expSusprised')
  const elemtExpFearful = document.querySelector('#expFearful')
  const elemtExpDisgusted = document.querySelector('#expDisgusted')

  const elemtAge = document.querySelector('#age')
  const elemtGender = document.querySelector('#gender')
  const elemtGenderProbability = document.querySelector('#genderProbability')

  if (Number.isInteger(parNumFace) && parNumFace > 0) {
    theFaceSelect = {
      numberOfFaces: parDetections.length,
      index: parNumFace,
      dimensions: dimBoxFace,
      expressions: {
        neutral: faceDetection[parNumFace - 1].expressions.neutral,
        happy: faceDetection[parNumFace - 1].expressions.happy,
        sad: faceDetection[parNumFace - 1].expressions.sad,
        angry: faceDetection[parNumFace - 1].expressions.angry,
        surprised: faceDetection[parNumFace - 1].expressions.surprised,
        fearful: faceDetection[parNumFace - 1].expressions.fearful,
        disgusted: faceDetection[parNumFace - 1].expressions.disgusted
      },
      age: faceDetection[parNumFace - 1].age,
      gender: faceDetection[parNumFace - 1].gender,
      genderprobability: faceDetection[parNumFace - 1].genderProbability
    }

    elemtNumberOfFace.textContent = theFaceSelect.index
    elemtExpNeutral.textContent = theFaceSelect.expressions.neutral
    elemtExpHappy.textContent = theFaceSelect.expressions.happy
    elemtExpSad.textContent = theFaceSelect.expressions.sad
    elemtExpAngry.textContent = theFaceSelect.expressions.angry
    elemtExpSusprised.textContent = theFaceSelect.expressions.surprised
    elemtExpFearful.textContent = theFaceSelect.expressions.fearful
    elemtExpDisgusted.textContent = theFaceSelect.expressions.disgusted

    elemtAge.textContent = theFaceSelect.age
    elemtGender.textContent = theFaceSelect.gender
    elemtGenderProbability.textContent = theFaceSelect.genderProbability

  } else {
    console.error('Error:  The argument of the function "loadInfoOfFace" must be an integer greater als zero!!')
    theFaceSelect = null
  }
  return theFaceSelect
}

//  10.-  Initialization of the value of all elements HTML of information faces.
export function resetDataFace() {
  const toDelete = document.querySelector('#newCanvas')
  if (toDelete) toDelete.remove()

  const elemtNumberOfFace = document.querySelector('#numberOfFace')
  const elemtExpNeutral = document.querySelector('#expNeutral')
  const elemtExpHappy = document.querySelector('#expHappy')
  const elemtExpSad = document.querySelector('#expSad')
  const elemtExpAngry = document.querySelector('#expAngry')
  const elemtExpSusprised = document.querySelector('#expSusprised')
  const elemtExpFearful = document.querySelector('#expFearful')
  const elemtExpDisgusted = document.querySelector('#expDisgusted')

  const elemtAge = document.querySelector('#age')
  const elemtGender = document.querySelector('#gender')
  const elemtGenderProbability = document.querySelector('#genderProbability')

  elemtNumberOfFace.textContent = ''
  elemtExpNeutral.textContent = ""
  elemtExpHappy.textContent = ""
  elemtExpSad.textContent = ""
  elemtExpAngry.textContent = ""
  elemtExpSusprised.textContent = ""
  elemtExpFearful.textContent = ""
  elemtExpDisgusted.textContent = ""

  elemtAge.textContent = ""
  elemtGender.textContent = ""
  elemtGenderProbability.textContent = ""
}

//  11.-  Function transform a num only with 2 decimals
function please2decimals(parNum) {
  let result = null
  if (!Number.isNaN(parNum) && typeof (parNum) === 'number') {
    result = Math.round(parNum * 100) / 100
  } else {
    console.error('Error:  The argument of the function "please2decimals" must be a number!!')
  }
  return result
}

//  12.-  Function "toggleImageFace":  toggles of images faces recognition. If the video playback is
//                                     paused or ended, the video is played, otherwise, the video is "paused"
export function toggleImageFace(parInfoFaceRecogCont, parSignalType) {
  if (parSignalType === 'image') {
    parInfoFaceRecogCont.classList.remove('infoFacesRecognitions')
    parInfoFaceRecogCont.classList.add('activeInfoFacesRecognitions')
  } else {
    parInfoFaceRecogCont.classList.remove('activeInfoFacesRecognitions')
    parInfoFaceRecogCont.classList.add('infoFacesRecognitions')
  }
}

//  13.-  Function of control active or not of div infoSongCont
export function controlActiveInfoSong(parInfoSongCont, parImageAlbumOfSong, parElemtCamera, parInputSignal) {
  switch (parInputSignal) {
    case "camera":
      parInfoSongCont.classList.remove('active')
      parInfoSongCont.classList.add('contInfoSong')
      parImageAlbumOfSong.style.animation = 'none'
      break;

    case "video":
      if (parElemtCamera.paused || parElemtCamera.ended) {
        parInfoSongCont.classList.remove('contInfoSong')
        parInfoSongCont.classList.add('active')
        parImageAlbumOfSong.style.animation = 'rotateRecord 30s linear infinite;'
      } else {
        parInfoSongCont.classList.remove('active')
        parInfoSongCont.classList.add('contInfoSong')
        parImageAlbumOfSong.style.animation = 'none'
      }
      break;

    case "image":
      parInfoSongCont.classList.remove('active')
      parInfoSongCont.classList.add('contInfoSong')
      // parImageAlbumOfSong.style.animation = 'none'

      break;

    default:
      break;
  }

  // if (parInputSignal !== 'video') {



  //   if(parInputSignal !== 'camera'){
  //     parInfoSongCont.classList.remove('contInfoSong')
  //     parInfoSongCont.classList.add('active')
  //     parImageAlbumOfSong.style.animation = 'none'
  //   }

  //   if(parInputSignal !== 'camera'){

  //     parImageAlbumOfSong.style.animation = 'none'
  //   }

}

//  14.-  Desastualizado ....
export function drawFaceInCanvas(parCanvasNew, parCanvasFace, parNumberOfFaceSelect, parDetections) {
  //  1.-  Get "canvas reference" for face information:  canvasFace => dimensions: "newCanvas" * relationOfCanvas
  const relationOfCanvas = 1
  const dimCanvasFace = { width: Math.round(parCanvasNew.width), height: Math.round(parCanvasNew.height) }

  const ctxCanvasFace = parCanvasFace.getContext('2d')
  ctxCanvasFace.clearRect(0, 0, dimCanvasFace.width, dimCanvasFace.height)
  ctxCanvasFace.fillStyle = 'rgb(231, 230, 230)';
  ctxCanvasFace.fillRect(0, 0, dimCanvasFace.width, dimCanvasFace.height)

  //  1.-  Load the data of all faces (array "detections") in the variable of array of objects: "infoTheFaceSelect"
  const infoTheFaceSelect = loadInfoOfFace(parNumberOfFaceSelect, parDetections)

  const resizedCanvasFace = {
    x0: parseInt(infoTheFaceSelect.dimensions._x * relationOfCanvas, 10),
    y0: parseInt(infoTheFaceSelect.dimensions._y * relationOfCanvas, 10),
    width: parseInt(infoTheFaceSelect.dimensions._width * relationOfCanvas, 10),
    height: parseInt(infoTheFaceSelect.dimensions._height * relationOfCanvas, 10)
  }
  ctxCanvasFace.fillStyle = 'rgb(13, 13, 13)';
  ctxCanvasFace.fillRect(60, 10, resizedCanvasFace.width, resizedCanvasFace.height)

  if (putLandMark) {
    ctxCanvasFace.fillStyle = 'rgb(250, 29, 29)'
    ctxCanvasFace.lineWidth = 2

    ctxCanvasFace.save()
    ctxCanvasFace.beginPath()
    ctxCanvasFace.translate(60, 10);
    ctxCanvasFace.arc(15, 15, 5, 0, 2 * Math.PI)
    ctxCanvasFace.fill()
    ctxCanvasFace.closePath()
    ctxCanvasFace.restore()
  }
}

//  15.-  Function "drawFacesRecogCanvas":  draw on the main canvas, "parCanvas", the set of recognized faces ("parDetections") of 
//                                          the input image
export function drawFacesRecogCanvas(parCanvasA, parCanvasB, parDetections, parDisplaySize, parResizedDetections, parPutLandMark, parNumberOfFaceSelect, parImage) {
  if (Array.isArray(parDetections)) {
    const ctxCanvasA = parCanvasA.getContext('2d')
    ctxCanvasA.clearRect(0, 0, parCanvasA.width, parCanvasA.height)
    ctxCanvasA.fillStyle = 'red';
    ctxCanvasA.fillRect(0, 0, parCanvasA.width, parCanvasA.height)

    parResizedDetections = faceapi.resizeResults(parDetections, parDisplaySize)

    parResizedDetections.forEach((detection, i) => {
      if (parPutLandMark) faceapi.draw.drawFaceLandmarks(parCanvasA, parResizedDetections)
      faceapi.draw.drawFaceExpressions(parCanvasA, parResizedDetections)

      const box = parResizedDetections[i].detection._box
      const drawBox = new faceapi.draw.DrawBox(box, { label: `Face ${i + 1}` })
      drawBox.draw(parCanvasA)

      if (i === (parNumberOfFaceSelect - 1)) {
        const box2 = parResizedDetections[i].detection.box
        const drawBox = new faceapi.draw.DrawBox(box2, { label: `Face: ${i + 1} ${Math.round(detection.age)} years ${detection.gender}, (${detection.genderProbability.toFixed(4) * 100}%)` })
        drawBox.draw(parCanvasA)

        ctxCanvasA.lineWidth = 2;
        ctxCanvasA.strokeStyle = 'rgb(250, 29, 29)';
        ctxCanvasA.strokeRect(detection.detection._box._x, detection.detection._box._y, detection.detection._box._width, detection.detection._box._height);

        ctxCanvasA.strokeStyle = "rgb(252, 249, 112)"
        ctxCanvasA.lineWidth = 3;

        ctxCanvasA.beginPath()
        ctxCanvasA.arc(detection.detection._box._x, detection.detection._box._y, 4, 0, 2 * Math.PI)
        ctxCanvasA.stroke()
        ctxCanvasA.closePath()

        ctxCanvasA.beginPath()
        ctxCanvasA.arc(detection.detection._box._x + detection.detection._box._width, detection.detection._box._y, 3, 0, 2 * Math.PI)
        ctxCanvasA.stroke()
        ctxCanvasA.closePath()

        ctxCanvasA.beginPath()
        ctxCanvasA.arc(detection.detection._box._x + detection.detection._box._width, detection.detection._box._y + detection.detection._box._height, 3, 0, 2 * Math.PI)
        ctxCanvasA.stroke()
        ctxCanvasA.closePath()

        ctxCanvasA.beginPath()
        ctxCanvasA.arc(detection.detection._box._x, detection.detection._box._y + detection.detection._box._height, 3, 0, 2 * Math.PI)
        ctxCanvasA.stroke()
        ctxCanvasA.closePath()
      }
    })
    ////////////////////////////////////////////////////////
    const box = {
      // Set boundaries to their inverse infinity, so any number is greater/smaller
      bottom: -Infinity,
      left: Infinity,
      right: -Infinity,
      top: Infinity,

      // Methods "getters":  given the boundaries, we can compute width and height
      get height() {
        return this.bottom - this.top;
      },

      get width() {
        return this.right - this.left;
      }
    }

    // Update the box boundaries
    // for (const face of parDetections) {
    //   box.bottom = Math.max(box.bottom, face.detection.box.bottom)
    //   box.left = Math.min(box.left, face.detection.box.left)
    //   box.right = Math.max(box.right, face.detection.box.right)
    //   box.top = Math.min(box.top, face.detection.box.top)
    // }
    if (parDetections[parNumberOfFaceSelect - 1]) {
      box.bottom = Math.max(box.bottom, parDetections[parNumberOfFaceSelect - 1].detection._box.bottom)
      box.left = Math.min(box.left, parDetections[parNumberOfFaceSelect - 1].detection._box.left)
      box.right = Math.max(box.right, parDetections[parNumberOfFaceSelect - 1].detection._box.right)
      box.top = Math.min(box.top, parDetections[parNumberOfFaceSelect - 1].detection._box.top)
    }

    // Draw the result (image) in the canvas "parCanvas"
    const ctx = parCanvasB.getContext("2d")

    parCanvasB.width = box.width
    parCanvasB.height = box.height

    ctx.clearRect(0, 0, parCanvasB.width, parCanvasB.height)

    //  1.-  Load the data of all faces (array "detections") in the variable of array of objects: "infoTheFaceSelect"
    const infoTheFaceSelect = loadInfoOfFace(parNumberOfFaceSelect, parDetections)
    const relationOfCanvas = 1
    const resizedCanvasFace = {
      x0: parseInt(infoTheFaceSelect.dimensions._x * relationOfCanvas, 10),
      y0: parseInt(infoTheFaceSelect.dimensions._y * relationOfCanvas, 10),
      width: parseInt(infoTheFaceSelect.dimensions._width * relationOfCanvas, 10),
      height: parseInt(infoTheFaceSelect.dimensions._height * relationOfCanvas, 10)
    }

    ctx.drawImage(parImage, box.left, box.top, box.width, box.height, 0, 0, parCanvasB.width, parCanvasB.height)
  } else {
    console.error('Error:  The argument "parDetections" of the function "customBox" must be an array of detections!!')
  }
}


//  16 .- Function "customBox": Calculation of the custom square (box) containing all the faces detected in the input image.
export function customBox(parCanvas, parDetections, parImage) {
  if (Array.isArray(parDetections)) {
    const box = {
      // Set boundaries to their inverse infinity, so any number is greater/smaller
      bottom: -Infinity,
      left: Infinity,
      right: -Infinity,
      top: Infinity,

      // Methods "getters":  given the boundaries, we can compute width and height
      get height() {
        return this.bottom - this.top;
      },

      get width() {
        return this.right - this.left;
      }
    }

    // Update the box boundaries
    for (const face of parDetections) {
      box.bottom = Math.max(box.bottom, face.detection.box.bottom)
      box.left = Math.min(box.left, face.detection.box.left)
      box.right = Math.max(box.right, face.detection.box.right)
      box.top = Math.min(box.top, face.detection.box.top)
    }

    // Draw the result (image) in the canvas "parCanvas"
    const ctx = parCanvas.getContext("2d")

    parCanvas.width = 200
    parCanvas.height = 200

    // parCanvas.height = box.height
    // parCanvas.width = box.width

    ctx.drawImage(parImage, box.left, box.top, box.width, box.height, 0, 0, parCanvas.width, parCanvas.height)

    // if (putLandMark) {
    //   ctx.fillStyle = 'rgb(250, 29, 29)'
    //   ctx.lineWidth = 2

    //   ctx.save()
    //   ctx.beginPath()
    //   ctx.translate(60, 10);
    //   ctx.arc(15, 15, 5, 0, 2 * Math.PI)
    //   ctx.fill()
    //   ctx.closePath()
    //   ctx.restore()
    // }
  } else {
    console.error('Error:  The argument "parDetections" of the function "customBox" must be an array of detections!!')
  }
}

//  17 .- Function "customBoxSingleFace": Calculation of the custom square (box) containing the face detected in the input image.
export function customBoxSingleFace(parCanvas, parNumberOfFaceSelect, parDetections, parImage) {
  if (Array.isArray(parDetections)) {
    const box = {
      // Set boundaries to their inverse infinity, so any number is greater/smaller
      bottom: -Infinity,
      left: Infinity,
      right: -Infinity,
      top: Infinity,

      // Methods "getters":  given the boundaries, we can compute width and height
      get height() {
        return this.bottom - this.top;
      },

      get width() {
        return this.right - this.left;
      }
    }

    // Update the box boundaries
    // for (const face of parDetections) {
    //   box.bottom = Math.max(box.bottom, face.detection.box.bottom)
    //   box.left = Math.min(box.left, face.detection.box.left)
    //   box.right = Math.max(box.right, face.detection.box.right)
    //   box.top = Math.min(box.top, face.detection.box.top)
    // }
    if (parDetections[parNumberOfFaceSelect - 1]) {
      box.bottom = Math.max(box.bottom, parDetections[parNumberOfFaceSelect - 1].detection._box.bottom)
      box.left = Math.min(box.left, parDetections[parNumberOfFaceSelect - 1].detection._box.left)
      box.right = Math.max(box.right, parDetections[parNumberOfFaceSelect - 1].detection._box.right)
      box.top = Math.min(box.top, parDetections[parNumberOfFaceSelect - 1].detection._box.top)
    }

    // Draw the result (image) in the canvas "parCanvas"
    const ctx = parCanvas.getContext("2d")

    parCanvas.width = box.width
    parCanvas.height = box.height

    // ctx.clearRect(0, 0, parCanvas.width, parCanvas.height)
    // ctx.fillStyle = 'rgb(231, 230, 230)';
    // ctx.fillRect(0, 0, parCanvas.width, parCanvas.height)

    //  1.-  Load the data of all faces (array "detections") in the variable of array of objects: "infoTheFaceSelect"
    const infoTheFaceSelect = loadInfoOfFace(parNumberOfFaceSelect, parDetections)
    const relationOfCanvas = 1
    const resizedCanvasFace = {
      x0: parseInt(infoTheFaceSelect.dimensions._x * relationOfCanvas, 10),
      y0: parseInt(infoTheFaceSelect.dimensions._y * relationOfCanvas, 10),
      width: parseInt(infoTheFaceSelect.dimensions._width * relationOfCanvas, 10),
      height: parseInt(infoTheFaceSelect.dimensions._height * relationOfCanvas, 10)
    }

    ctx.drawImage(parImage, box.left, box.top, box.width, box.height, 0, 0, parCanvas.width, parCanvas.height)
  } else {
    console.error('Error:  The argument "parDetections" of the function "customBox" must be an array of detections!!')
  }
}

//  18.-  Function "inputSignal":  select of input signal in face recognition
export function inputSignal(parSignal, parElemtCamera) {
  let signalIs = ''
  if (typeof (parSignal) === "string" && (parSignal === 'camera' || parSignal === 'video' || parSignal === 'image')) {
    signalIs = parSignal

    //    The stream signal must be deleted in the camera if it exists
    if (parElemtCamera.srcObject) parElemtCamera.srcObject = null
    parElemtCamera.pause()
  } else {
    console.error('Error:  The argument of the function "inputSignal" must be a string:  "camera", "video" or "image"!!')
    signalIs = null
  }
  return signalIs
}

//  19.-  Print info (text in element HTML: "infoLoad" ) of image loaded and numbers of faces recognized
export function printInfo(parElemtTarget) {
  parElemtTarget.textContent = "Loaded face recognitions ...!"
}

/*
//  1.-  Load the data of all faces (array "detections") in the variable of array of objects: "infoTheFaceSelect"
const infoTheFaceSelect = loadInfoOfFace(parNumberOfFaceSelect, parDetections)

const resizedCanvasFace = {
  x0: parseInt(infoTheFaceSelect.dimensions._x * relationOfCanvas, 10),
  y0: parseInt(infoTheFaceSelect.dimensions._y * relationOfCanvas, 10),
  width: parseInt(infoTheFaceSelect.dimensions._width * relationOfCanvas, 10),
  height: parseInt(infoTheFaceSelect.dimensions._height * relationOfCanvas, 10)
}
ctxCanvasFace.fillStyle = 'rgb(13, 13, 13)';
ctxCanvasFace.fillRect(60, 10, resizedCanvasFace.width, resizedCanvasFace.height)

if (putLandMark) {
  ctxCanvasFace.fillStyle = 'rgb(250, 29, 29)'
  ctxCanvasFace.lineWidth = 2

  ctxCanvasFace.save()
  ctxCanvasFace.beginPath()
  ctxCanvasFace.translate(60, 10);
  ctxCanvasFace.arc(15, 15, 5, 0, 2 * Math.PI)
  ctxCanvasFace.fill()
  ctxCanvasFace.closePath()
  ctxCanvasFace.restore()
}

*/

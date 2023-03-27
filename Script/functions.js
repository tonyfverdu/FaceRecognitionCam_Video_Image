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
export function starVideo(parVideo, parCamera) {
  if (typeof (parVideo) === "string" && parCamera instanceof HTMLElement) {
    parCamera.src = parVideo
  } else {
    console.error('Error: The arguments of the function "starVideo(parVideo, parCamera)" must be a string and instanceof HTMLElement!!')
  }
}
// parCamera.remove()
    // const elemtVideo = document.createElement('video')
    // elemtVideo.classList.add("video")
    // elemtVideo.setAttribute('id', 'cameraWeb')
    // elemtVideo.setAttribute('width', '760px')
    // elemtVideo.setAttribute('height', '520px')
    // elemtVideo.setAttribute('preload', 'metadata')
    // elemtVideo.setAttribute('controls', true)
    // elemtVideo.setAttribute('poster', './assets/imag/portadas/TheBeatlesGetBackTheRooftopPerformance.jpg')
    // elemtVideo.textContent = 'Your browser does not support the video tag.'
    // videoContainer.append(elemtVideo)
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
  if(parElemCamera.srcObject) parElemCamera.srcObject = null
  stream.getTracks().forEach(track => {
    if (track.readyState == 'live' && track.kind === 'video') {
      track.stop()
    }
  })
}

//  3.-  Async function of get all promises of the models-face-api
export async function promiseFaceapi(parFunctionVideo, parURL_Models) {
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(parURL_Models),
    faceapi.nets.faceLandmark68Net.loadFromUri(parURL_Models),
    faceapi.nets.faceRecognitionNet.loadFromUri(parURL_Models),
    faceapi.nets.faceExpressionNet.loadFromUri(parURL_Models),
    faceapi.nets.ageGenderNet.loadFromUri(parURL_Models),
    faceapi.nets.ssdMobilenetv1.loadFromUri(parURL_Models),
  ])
    .then(parFunctionVideo)
    .catch(err => console.error(`Error:  There is a error in the function "promiseFaceapi":  ${err}`))
}

//  4.-  Creation of canvas from the method "createCanvasFromMedia" of faceapi
export async function createCanvas(parElemVideo, parIdCanvas, parClassCanvas) {
  const myCanvas = await faceapi.createCanvasFromMedia(parElemVideo)
  myCanvas.setAttribute("id", parIdCanvas)
  myCanvas.classList.add(parClassCanvas)
  document.body.append(myCanvas)          //  <== Place the created canvas in the body of the document (See better in contVideo)
}

//  5.-  Delete canvas of face recognition
export function deleteCanvas(parIdCanvas) {
  const TheCanvas = document.querySelector(parIdCanvas)
  if (TheCanvas !== null) {
    TheCanvas.remove()
  }
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







/* eslint-disable no-undef */
import {
  urlBase, urlModels, videoContainer, radiobtnCamera, radiobtnVideo, radiobtnImage, elemCamera, selectVideos, sortNameBtn, sortYearBtn,
  elemBtnSelectVideo, infoSongCont, contImage, img
} from "./inicialitation.js"
import { promiseFaceapi, starCam, stopStreamVideoOnly, uploadData, starVideo, sortDataString, sortDataNum, getInfoVideo, deleteCanvas } from "./functions.js"
import { togglePlay, updatePlayButton } from "./playVideo.js"
import dataVideos from "../assets/videos/dataVideos.js"
import { printInfo } from "./faceImage.js"


let videoName = "The Beatles - Don't Let Me Down Take 1 - Rooftop Concert.mp4"
let urlVideo = `${urlBase}/${videoName}`
let toogleCamera = false
let toogleVideo = false
let toogleImage = false

let inputSelect = 'video'

//  A.-  Management of videos   **********************************************************
//  0.-  Inicial values of videos and images (load videos and create options in the element HTML: "selectVideos")
uploadData(dataVideos, selectVideos, "optionVideo")


//  0.1.-  Evet "change" in the element HTML "selectVideos" ('change' => "videoName" is value selected)
selectVideos.addEventListener('change', function (ev) {
  const optionVideos = document.querySelectorAll(".optionVideo")
  videoName = optionVideos[ev.target.selectedIndex].value
}, false)

//  0.2.-  Event "click" in the element HTML "elemBtnSelectVideo" ('click' => select option of video and load in element video and infoVideo)
elemBtnSelectVideo.addEventListener('click', () => {
  const videoSelect = dataVideos.find(video => video.name === videoName)
  urlVideo = `${urlBase}/${videoSelect.video}`
  elemCamera.setAttribute("poster", `./assets/imag/portadas/${videoSelect.image[0]}`)
  elemCamera.src = urlVideo

  infoSongCont.classList.remove('contInfoSong')
  infoSongCont.classList.add('active')

  const videoElemt = getInfoVideo(dataVideos, videoName)
  document.querySelector('#titleSongOfAlbum').textContent = videoElemt.name
  document.querySelector('#vocalsOfSong').textContent = `by ${videoElemt.vocals}`
  document.querySelector('#infoAlbum').textContent = videoElemt.album[0]
  document.querySelector('#infoYear').textContent = videoElemt.year
  document.querySelector('#infoDuration').textContent = videoElemt.duration
  document.querySelector('#imageAlbumOfSong').setAttribute('src', `./assets/imag/portadas/${videoElemt.image[0]}`)
}, false)

//  0.3.-  Event "sort" by "name of video" in the element
let sortedDirectionString = false
sortNameBtn.addEventListener('click', () => {
  sortedDirectionString = !sortedDirectionString
  if (sortedDirectionString) {
    uploadData(sortDataString(dataVideos, 'AZ'), selectVideos, "optionVideo")
  } else {
    uploadData(sortDataString(dataVideos, 'ZA'), selectVideos, "optionVideo")
  }
})

//  0.4.-  Event "sort" by "year of video" in the element
let sortedDirectionNum = false
sortYearBtn.addEventListener('click', () => {
  sortedDirectionNum = !sortedDirectionNum
  if (sortedDirectionNum) {
    uploadData(sortDataNum(dataVideos, 'growing'), selectVideos, "optionVideo")
  } else {
    uploadData(sortDataNum(dataVideos, 'decreasing'), selectVideos, "optionVideo")
  }
})

function inputSignal(parSignal) {
  if (typeof (parSignal) === "string") {
    inputSelect = parSignal
    if (elemCamera.srcObject) elemCamera.srcObject = null
    deleteCanvas('#myCanvas')
    elemCamera.pause()
  } else {
    console.log('Error:  The arguments of the function "" must be a string!!')
  }
}

//  B.-  Select Input ("camera", "video" and "image")  ******************************
// 1.- Input signal: inputSelect = 'camera'
radiobtnCamera.addEventListener('click', async () => {
  inputSignal('camera')
  videoContainer.style.display = "flex"
  contImage.style.display = "none"

  toogleCamera = !toogleCamera
  if (toogleCamera && inputSelect === 'camera') {
    elemCamera.setAttribute('poster', './assets/imag/facial-recognition.png')
    inputCamera()
  } else {
    const stream = elemCamera.srcObject
    if (stream) stopStreamVideoOnly(stream, elemCamera)
    if (inputSelect === 'camera') inputCamera()
  }
}, false)

async function inputCamera() {
  deleteCanvas('#myCanvas')
  await promiseFaceapi(starCam(elemCamera), urlModels)

  elemCamera.addEventListener('play', () => {
    deleteCanvas('#myCanvas')
    const canvas = faceapi.createCanvasFromMedia(elemCamera)
    canvas.setAttribute('id', 'myCanvas')
    canvas.style.top = "0%"
    canvas.style.left = "16.9%"

    const displaySize = { width: 795, height: 597 }
    faceapi.matchDimensions(canvas, displaySize)
    videoContainer.append(canvas)

    async function loop() {
      const detections = await faceapi.detectAllFaces(elemCamera, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions()
        .withFaceDescriptors()

      const resizedDetections = faceapi.resizeResults(detections, displaySize)
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle ="rgba(242, 242, 242, 0.3)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      faceapi.draw.drawDetections(canvas, resizedDetections)
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
      // faceapi.draw.drawFaceDescriptors(canvas, resizedDetections)

      window.requestAnimationFrame(loop)
    }
    loop()
  })
}

// 2.- Video
radiobtnVideo.addEventListener('click', () => {
  inputSignal('video')
  videoContainer.style.display = "flex"
  contImage.style.display = "none"

  toogleVideo = !toogleVideo
  if (toogleCamera && inputSelect === 'video') {
    const videoSelect = dataVideos.find(video => video.video === videoName)
    elemCamera.setAttribute("poster", `./assets/imag/portadas/${videoSelect.image[0]}`)
    starVideo(urlVideo, elemCamera)
  }
}, false)


// 3.- Image
radiobtnImage.addEventListener('click', () => {
  inputSignal('image')
  videoContainer.style.display = "none"
  contImage.style.display = "flex"

  toogleImage = !toogleImage
  if (toogleImage) {
    elemCamera.setAttribute('poster', './assets/imag/portadas/TheBeatlesGetBackTheRooftopPerformance.jpg')
    promiseFaceapi(recognitionImage, urlModels)
    recognitionImage()
  }
}, false)

//  1.-  Launch all the promises of the faceapi-models in parallel (in the foldel: url_Models),  
//       if all ok, the function passed by parameter (recognitionImage) is launched.
promiseFaceapi(recognitionImage, urlModels)

//  2.-  Function "recognitionImage":  recognition of image faces
async function recognitionImage() {
  printInfo()

  imageUpload.addEventListener("change", async (e) => {
    infoLoad.textContent = e.target.value
    const canvas = document.querySelector("#newCanvas")
    if (canvas !== null) document.querySelector("#newCanvas").remove()
    const theImage = await faceapi.bufferToImage(imageUpload.files[0])
    img.src = theImage.src

    const newCanvas = faceapi.createCanvasFromMedia(theImage)
    newCanvas.setAttribute('id', 'newCanvas')
    const displaySize = { width: 600, height: 550 }
    faceapi.matchDimensions(newCanvas, displaySize)
    newCanvas.style.top = "44px"
    newCanvas.style.left = "300px"
    newCanvas.style.borderRadius = "9px"
    contImage.append(newCanvas)

    const ctx = newCanvas.getContext("2d")
    ctx.clearRect(0, 0, newCanvas.width, newCanvas.height)
    // ctx.fillStyle = "rgba(242, 242, 242, 0.3)"
    // ctx.fillRect(0, 0, newCanvas.width, newCanvas.height)

    const detections = await faceapi.detectAllFaces(theImage)
      .withFaceLandmarks()
      .withFaceExpressions()
      .withFaceDescriptors()

    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    // const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))

    resizedDetections.forEach((detection, i) => {
      // faceapi.draw.drawFaceLandmarks(newCanvas, resizedDetections)
      const box = resizedDetections[i].detection.box
      const drawBox = new faceapi.draw.DrawBox(box, { label: `Face: ${i + 1}` })
      drawBox.draw(newCanvas)
    })

    infoLoad.textContent = `Images faces recognition:  ${detections.length}`
  })
}
//  ************************************************************************************
/*
import {promiseFaceapi} from "./functions.js"


const theVideo = document.querySelector('#cameraWeb')

// promiseFaceapi(startVideo, '/models')
Promise.all([
  faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
  faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  faceapi.nets.faceExpressionNet.loadFromUri("/models"),
  faceapi.nets.ageGenderNet.loadFromUri("/models")
])
.then(startVideo)



function startVideo() {
  navigator.mediaDevices.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

theVideo.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(theVideo)
  document.body.append(canvas)
  const displaySize = { width: theVideo.width, height: theVideo.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(theVideo, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
  }, 100)
})
*/

/////////////////////////////////////////////////
/*  Method navigator.getUserMedia is deprecated !!

  The method "navigator.getUserMedia" is now "deprecated", and is replaced by "navigator.mediaDevices.getUserMedia". 

  1.-  Method "MediaDevices.getUserMedia()" (by MDN, experimental tecnology)

  El método "mediaDevices.getUserMedia()" solicita al usuario "permisos" para usar un dispositivo de entrada de vídeo y/o 
  uno de audio, como una cámara web o compartir la pantalla y/o micrófono. 

  Si el usuario proporciona los "permisos", entonces le retornará una "Promise", que es resuelta por el resultado del 
  objeto "MediaStream". Si el usuario niega el permiso, o si el recurso multimedia no es válido, entonces el promise es 
  rechazado con "PermissionDeniedError" o "NotFoundError" respectivamente. 

  Nota.- Es posible que la "promise" retornada no sea ni resuelto ni rechazado, ya que no se requiere que el usuario 
  tome una decisión.

  1.1.-  Sintaxis:  const gumPromise = MediaDevices.getUserMedia(constraints);

  Generalmente, accederás al objeto singleton "MediaDevices", usando: "navigator.mediaDevices", de esta forma:

                navigator.mediaDevices.getUserMedia(myConstraints)
                .then(function(mediaStream) {
                      / * usar el flujo de datos * /
                  })
                .catch(function(err) {
                     / * manejar el error * /
                });


  Parámetros:  constraints

  El "contraints" es un "objeto MediaStreamConstraints", que especifica los "tipos de recursos a solicitar", junto 
  con cualquier requerimiento para cada tipo.

  El parámetro objeto "constraints" es un "objeto MediaStreamConstaints" con dos miembros: video y audio, que describen 
  los tipos de recurso solicitados. Debe especificarse uno o ambos. Si el navegador no puede encontrar todas las 
  pistas de recursos con los tipos especificados que reúnan las restricciones dadas, entonces la "promise" retornada es 
  rechazado con "NotFoundError".


  Ejemplo:  Lo siguiente realiza la petición de recursos, tanto "audio" como "vídeo" sin requerimientos específicos:

              navigator.mediaDevices.getUserMedia({ audio: true, video: true })

            Nota.-  Mientras que la información acerca de las cámaras y micrófonos de los usuarios se encuentran 
                    inaccesibles por razones de privacidad, una aplicación puede solicitar la cámara y las capacidades 
                    del micrófono que este requiera, usando "restricciones adicionales". 
                    
                    El siguiente código es para mostrar una resolución de una cámara de 1280x720.

                      {
                        audio: true,
                        video: { width: 1280, height: 720 }
                      }

                    El navegador tratará de respetar esto, pero puede devolver otras resoluciones si una coincidencia 
                    exacta no está disponible o si el usuario la reemplaza.

                    Para conseguir otras resoluciones, puede utilizar las propiedades: min, max, or exact 
                    (también conocido como min == max). 

  El siguiente ejemplo le muestra cómo solicitar una "resolución mínima" de 1280x720.

          {
            audio: true,
            video: {
                      width: { min: 1280 },
                      height: { min: 720 }
                    }
          }

  Si no existe una cámara con una resolución mínima para trabajar, entonces la promesa devuelta será rechazada con 
  "NotFoundError", y no se le pedirá al usuario.

  La razón de esto es debido a que las propiedades "min", "max", y "exact" son inherentemente obligatorias, mientras 
  que los valores planos y una propiedad llamada ideal no lo son. He aquí un ejemplo más completo:

          {
            audio: true,
            video: {
                    width: { min: 1024, ideal: 1280, max: 1920 },
                    height: { min: 776, ideal: 720, max: 1080 }
            }
          }

  Un valor perteneciente a la propiedad "ideal", cuando es usada, tiene gravedad, lo que significa que el navegador 
  tratará de encontrar la configuración (una cámara, si tienes más de una), con la distancia de aptitud más pequeña 
  (fitness distance) de los valores ideales dados.

  Los valores planos son inherentemente ideales, lo que significa que de los ejemplos mostrados anteriormente, podrían 
  haberse escrito de la siguiente manera:

          {
            audio: true,
            video: {
                      width: { ideal: 1280 },
                      height: { ideal: 720 }
            }
          }

  No todas las restricciones son números. Por ejemplo, en dispositivos móviles, los siguientes preferirán la cámara 
  frontal (si está disponible) sobre la posterior:

          { audio: true, video: { facingMode: "user" } }

  Para solicitar la cámara frontal, use:

          { audio: true, video: { facingMode: { exact: "environment" } } }


  1.2.-  Valor de retorno: retorna una "Promise" que resuelve a un "objeto MediaStream".


  1.3.-  Errores:   los rechazos de la promesa devuelta se realizan con un objeto "MediaStreamError", que está modelado 
                    en DOMException. Los errores más relevantes son:

                    SecurityError:  permiso para usar un dispositivo fue denegado por el usuario o por el sistema.

                    NotFoundError:  no se encontraron pistas multimedia del tipo especificado que satisfagan las 
                                  restricciones especificadas.


       Ejemplos:  usando la Promesa (Promise)

                  Este ejemplo asigna el objeto MediaStream (resultado de la promesa devuelta) al elemento apropiado.

                    const p = navigator.mediaDevices.getUserMedia({ audio: true, video: true });

                    p.then(function(mediaStream) {
                      const video = document.querySelector('video');
                      video.src = window.URL.createObjectURL(mediaStream);  // o bien: video.srcObject =  mediaStream
                      video.onloadedmetadata = function(e) {
                        // Do something with the video here.
                      };
                    });

                    p.catch(function(err) { console.log(err.name); });     // always check for errors at the end.


  1.4.-  Ancho y alto.

  He aquí un ejemplo del uso del metodo: "mediaDevices.getUserMedia()", incluyendo un "polyfill" para hacer frente a los 
  navegadores más antiguos.

      const promisifiedOldGUM = function(constraints, successCallback, errorCallback) {

      // First get ahold of getUserMedia, if present
      const getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia);

      // Some browsers just don't implement it - return a rejected promise with an error to keep a consistent interface
      if(!getUserMedia) {
          return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
      }

      // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
      return new Promise(function(successCallback, errorCallback) {
        getUserMedia.call(navigator, constraints, successCallback, errorCallback);
      });

      }

      // Older browsers might not implement mediaDevices at all, so we set an empty object first
      if(navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {};
      }

      // Some browsers partially implement mediaDevices. We can't just assign an object with getUserMedia as it would 
      // overwrite existing properties. Here, we will just add the getUserMedia property if it's missing.
      if(navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = promisifiedOldGUM;
      }


      // Prefer camera resolution nearest to 1280x720.
      const constraints = { audio: true, video: { width: 1280, height: 720 } };

      navigator.mediaDevices.getUserMedia(constraints)
        .then(function(stream) {
          const video = document.querySelector('video');
          video.src = window.URL.createObjectURL(stream);
          video.onloadedmetadata = function(e) {
            video.play();
          };
        })
        .catch(function(err) {
          console.log(err.name + ": " + err.message);
        });


  1.5.- Control del "frame-rate" (cuadros por segundo) del video

  Pocos "frame-rates" ó "cuadros por segundo" pueden ser deseables en algunos casos, como transmisiones WebRTC con 
  restricciones de ancho de banda.

    const constraints = { video: { frameRate: { ideal: 10, max: 15 } } };


  1.6.-  Camara frontal y camara trasera.

         En telefonos moviles.

         let front = false;
         document.getElementById('flip-button').onclick = function() { front = !front; };

         const constraints = { video: { facingMode: (front? "user" : "environment") } };


  1.7.-  Permisos.

  Para usar "getUserMedia()"" en una app instalable (por ejemplo, una Firefox OS app), necesitas especificar uno o 
  ambos de los siguientes campos dentro de tu archivo manifest:

      "permissions": {
        "audio-capture": {
          "description": "Required to capture audio using getUserMedia()"
        },
        "video-capture": {
          "description": "Required to capture video using getUserMedia()"
        }
      }
*/
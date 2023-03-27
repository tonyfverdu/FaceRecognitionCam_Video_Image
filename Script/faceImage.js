/* eslint-disable no-undef */
import { elemCamera, elemtRadioBtn, imageUpload } from "./inicialitation.js"
import { promiseFaceapi } from "./functions.js"

const contVideo = document.querySelector("#video-container")
const arrayOptionImg = Array.from(elemtRadioBtn)
const values = arrayOptionImg.map(option => option.value)
const checked = arrayOptionImg.map(option => option.checked)

arrayOptionImg.forEach(opt => {
  console.log(opt.value)
  if (opt.value === "Image" && opt.checked) {
    console.log('entro aqui, en arrayOptionImg')
    contVideo.remove()
  }
})

//  2.-  Print info (text) of image loaded and numbers of faces recognized
export function printInfo() {
  infoLoad.textContent = "Loaded face image recognitions!"
}

//  3.-  Function "inputCamera":  Input signal "video of camera web online"
export function inputCamera() {
  promiseAllFaceapi(starCamera(cameraWeb), url_Models)

  cameraWeb.addEventListener('play', () => {
    document.querySelector("canvas").remove()
    const myCanvas = faceapi.createCanvasFromMedia(cameraWeb)
    myCanvas.setAttribute("id", "myCanvas")
    contInfo.appendChild(myCanvas)
    const displaySize = { width: cameraWeb.width, height: cameraWeb.height }
    faceapi.matchDimensions(myCanvas, displaySize)

    async function loop() {
      const detections = await faceapi.detectAllFaces(cameraWeb, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions()
      // .withFaceDescriptors()

      const resizedDetections = faceapi.resizeResults(detections, displaySize)
      myCanvas.getContext('2d').clearRect(0, 0, myCanvas.width, myCanvas.height)
      faceapi.draw.drawDetections(myCanvas, resizedDetections)
      faceapi.draw.drawFaceLandmarks(myCanvas, resizedDetections)
      faceapi.draw.drawFaceExpressions(myCanvas, resizedDetections)
      // faceapi.draw.drawFaceDescriptor(myCanvas, resizedDetections)

      window.requestAnimationFrame(loop)
    }
    loop()
  })
}

//  4.-  Function "getLabeledFaceDescription" =>  parLabelsOfModels :  array of name (strings) of the "models of images" to recognized
//       const labelsOfModels = ['George Harrison', 'John Lennon', 'Paul McCartney', 'Ringo Starr']
export function getLabeledFacesDescription() {
  // const labelsOfModels = ['George Harrison', 'John Lennon', 'Paul McCartney', 'Ringo Starr']
  const labelsOfModels = ['John Lennon', 'Paul McCartney', 'Ringo Starr']
  return Promise.all(
    labelsOfModels.map(async label => {
      const descriptions = []
  
      for (let i = 1; i <= 4; i++) {
        let image
        await fetch(`./assets/Members/${label}/${i}.jpg`)
        .then(async responseURL => {
          image = await faceapi.fetchImage(responseURL.url)
          console.log(`i: ${i}  ${`./assets/Members/${label}/${i}.jpg`}  ${image instanceof HTMLImageElement}`)  // ?true
        })
        .catch(error => console.log(error))
  
        const detections = await faceapi.detectSingleFace(image)
          .withFaceLandmarks()
          .withFaceDescriptor()

        descriptions.push(detections.descriptor)
      }
      console.log('label:  ', label, 'Descriptions:  ', descriptions)
      return new faceapi.LabeledFaceDescriptors(label, descriptions)
    })
  )
}

//  5.-  Function "recognitionOfFaces" => 
export async function recognitionOfFaces() {
  const labeledFaceDescriptors = await getLabeledFacesDescription()
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors)
  console.log('faceMatcher:  ', faceMatcher)

  cameraWeb.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(cameraWeb)
    document.body.append(canvas)
    console.log(canvas)

    const displaySize = { width: cameraWeb.width, height: cameraWeb.height}
    faceapi.matchDimensions(canvas, displaySize)

    setInterval(async () => {
      const detections = await faceapi.detectAllFaces()
      .withFaceLandmarks()
      .withFaceDescriptor()

      const resizedDetections = faceapi.resizeResults(detections, )

      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height)
      const results = resizedDetections.map(d => {
        return faceMatcher.findBestMatch(d.descriptor)
      }) 

      results.forEach((result, i) => {
        const box = resizeddetections[i].detections.box
        const drawBox = new faceapi.draw.DrawBox(box, { label: result})
        drawBox.draw(canvas)
      })
    }, 100)
  })
}



/*
Promise.all([
  faceapi.nets.ssdMobilenetv1.loadFromUri('./assets/models'),
  faceapi.nets.tinyFaceDetector.loadFromUri('./assets/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('./assets/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('./assets/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('./assets/models')
])
.then(faceRecognitions)


//promiseFaceapi(faceRecognitions, './assets/models')

async function faceRecognitions() {
  const container = document.createElement('div')
  container.style.position = 'relative'
  container.style.width = "50px"
  container.style.height = "50px"
  document.body.append(container)

  // if (canvas) canvas.remove()

  const labeledFaceDescriptors = await getlabeledFaceDescriptions()
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)

  let image
  let canvas
  elemCamera.addEventListener('play', () => {
    imageUpload.addEventListener('change', async () => {
      if (image) image.remove()
      if (canvas) canvas.remove()
      img = await faceapi.bufferToImage(imageUpload.files[0])
      console.log(img)
      container.append(img)
      canvas = faceapi.createCanvasFromMedia(image)
      container.append(canvas)
      const displaySize = { width: image.width, height: image.height }
      faceapi.matchDimensions(canvas, displaySize)
      const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors()
      const resizedDetections = faceapi.resizeResults(detections, displaySize)
      const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
      results.forEach((result, i) => {
        const box = resizedDetections[i].detection.box
        const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
        drawBox.draw(canvas)
      })
    })

  })

  /*

    const canvas = faceapi.createCanvasFromMedia(elemCamera)
    document.body.append(canvas)

    const displaySize = { width: elemCamera.width, height: elemCamera.height }
    faceapi.matchDimensions(canvas, displaySize)

    setInterval(async () => {
      const detections = await faceapi.detectAllFaces(elemCamera)
        .withFaceLandmarks()
        .withFaceDescriptors()

      const resizeDetections = faceapi.resizeResults(detections, displaySize)
      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height)

      const results = resizeDetections.map((detection) => {
        return faceMatcher.findBestMatch(detection.descriptor)
      })

      results.forEach((result, i) => {
        const box = resizeDetections[i].detection.box
        const drawBox = new faceapi.draw.DrawBox(box, { label: result })
        drawBox.draw(canvas)

      })
    }, 100)
  })
* /

   // document.body.append('Loaded')

}

function getlabeledFaceDescriptions() {
  const labels = ['George Harrison', 'John Lennon', 'Paul McCartney', 'Ringo Starr']
  return Promise.all(
    labels.map(async label => {
      const descriptions = []
      for (let i = 1; i <= 6; i++) {
        const img = await faceapi.fetchImage(`./assets/imag/Members/${label}/${i}.jpg`)
        const detections = await faceapi
          .detectSingleFace(img)
          .withFaceLandmarks()
          .withFaceDescriptor()
console.log(detections)
        descriptions.push(detections.descriptor)
      }
      return new faceapi.LabeledFaceDescriptors(label, descriptions)
    })
  )
}
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
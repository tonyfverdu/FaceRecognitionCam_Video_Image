//  Detección de rostros en la Web con Face-api.js
//  by Tim Severien (https://www.sitepoint.com/face-api-js-face-detection/)

/*
    Los navegadores web se vuelven más potentes cada día. Los sitios web y las aplicaciones web también están aumentando en complejidad. 
    Las operaciones que requerían una supercomputadora hace algunas décadas ahora se ejecutan en un teléfono inteligente. Una de esas cosas 
    es la detección de rostros (face recognition).
*/

/*
    La capacidad de detectar y analizar una "cara" (rostro - face) es muy útil, ya que nos permite agregar funciones inteligentes. Piense en 
    desenfocar automáticamente las caras (como lo hace Google Maps), desplazar y escalar la transmisión de una cámara web para enfocarse en 
    las personas (como Microsoft Teams), validar un pasaporte, agregar filtros tontos (como Instagram y Snapchat) y mucho más. Pero antes de 
    que podamos hacer todo eso, ¡primero debemos encontrar la cara!

    "Face-api.js" es una biblioteca que permite a los desarrolladores usar la detección de rostros en sus aplicaciones sin necesidad de tener 
    experiencia en aprendizaje automático.
*/

//  Detección de rostros con aprendizaje automático
/*  
    Detectar objetos, como un rostro, es bastante complejo. Piénselo: tal vez podríamos escribir un programa que escanee píxeles para encontrar
    los ojos, la nariz y la boca. Se puede hacer, pero hacerlo totalmente "fiable" es prácticamente inalcanzable, dados los muchos factores a 
    tener en cuenta. Piense en las condiciones de iluminación, el vello facial, la gran variedad de formas y colores, el maquillaje, los 
    ángulos de enfoque, las máscaras faciales y mucho más.

    Sin embargo, las "redes neuronales" sobresalen en este tipo de problemas y pueden generalizarse para dar cuenta de la mayoría (si no de 
    todas) las condiciones. Podemos crear, entrenar y usar "redes neuronales" en el navegador con "TensorFlow.js", una popular biblioteca de 
    aprendizaje automático de JavaScript. Sin embargo, incluso si usamos un modelo preentrenado listo para usar, todavía nos meteríamos un 
    poco en el meollo de la cuestión de proporcionar la información a "TensorFlow" e interpretar el resultado. Si está interesado en los 
    detalles técnicos del aprendizaje automático, consulte " Principios básicos sobre el aprendizaje automático con Python ".

      ||  REDES NEURONALES  ||  ==>  Aprendidaje automatico de patrones  (Ejemplo:  Tensorflow.js)


    // face-api.js: JavaScript API for "face detection and face recognition" in the browser implemented on top of the tensorflow.js core API 
                    (tensorflow/tfjs-core)

                    Es un "módulo de javascript", creado sobre el núcleo de "tensorflow.js", que implementa varias CNN (redes neuronales 
                    convolucionales) para resolver la detección de rostros, el reconocimiento de rostros y la detección de puntos de 
                    referencia faciales, optimizado para el web y para dispositivos móviles.

    Libreria: face-api.js: envuelve todo esto (las tareas a realizar con Tensorflow.js) en una API intuitiva. Podemos pasar un elemento img, 
                           canvas o un video, y la biblioteca devolverá uno o un conjunto de resultados. "Face-api.js" puede detectar caras, 
                           pero también "estimar" varias cosas en ellas, como se indica a continuación.

                           1.-  Face detection: obtener los "límites" de uno o varios rostros. Esto es útil para determinar dónde y qué tamaño 
                                                tienen las caras en una imagen.

                           2.-  Detección de "puntos de referencia faciales" (landmarks) : obtener la posición y la forma de las cejas, los 
                                                                                           ojos, la nariz, la boca, los labios y la barbilla. 
                                                                                           Esto se puede usar para determinar la dirección de 
                                                                                           orientación o para proyectar gráficos en regiones 
                                                                                           específicas, como un bigote entre la nariz y los 
                                                                                           labios.

                           3.-  Reconocimiento facial (face recognition): determina quién está en la imagen.

                           4.-  Detección de expresión facial: obtener la "expresión" de una cara. Tenga en cuenta que el kilometraje puede 
                                                               variar para diferentes culturas.

                           5.-  Detección de edad y sexo: obtenga la edad y el sexo de una cara. Tenga en cuenta que para la clasificación 
                                                          de "género", clasifica un rostro como femenino o masculino, lo que no necesariamente 
                                                          revela su género.

    Antes de usar cualquiera de estas estimaciones en el reconocimiento faciial con faceapi, más allá de los experimentos, hay que tener en 
    cuenta que la "inteligencia artificial" sobresale en la amplificación de "sesgos". La "clasificación de género" funciona bien para las 
    personas cisgénero, pero no puede detectar el género de mis amigos no binarios. Identificará a las personas blancas la mayor parte del 
    tiempo, pero con frecuencia no detecta a las personas de color.

    Sea muy cuidadoso con el uso de esta tecnología y realice pruebas exhaustivas con un grupo de pruebas diverso.
*/

//  Instalacion de faceapi.  Pasos.
/*
    1.-  Instalacion de la libreria face-api.js:  podemos instalar la libreria "face-api.js" a través de npm:  npm install face-api.js

         Nota.-  Sin embargo, para omitir la "configuración de las herramientas de compilación", ise puede incluir el paquete UMD a través de 
                 unpkg.org:

                 / * globals faceapi * /
                 import 'https://unpkg.com/face-api.js@0.22.2/dist/face-api.min.js';


    2.-  Descargar de los "modelos" preentrenados:  después de eso, necesitaremos descargar los "modelos pre-entrenados" correctos del 
                                                    repositorio de la biblioteca. Determine qué queremos saber de las caras y use la sección 
                                                    "Modelos disponibles" para determinar qué modelos se requieren. Algunas funciones 
                                                    funcionan con varios modelos. En ese caso, tenemos que elegir entre ancho de 
                                                    banda/rendimiento y precisión. Compara el tamaño de archivo de los distintos modelos 
                                                    disponibles y elige el que creas que es mejor para tu proyecto.

         ¿No está seguro de qué modelos necesita para su uso? Puede volver a este paso más tarde. Cuando usamos la API sin cargar los modelos 
         requeridos, se arrojará un error que indica qué modelo espera la biblioteca.
*/
//  Ejemplos:  
/*  
    Ejemplo 1:  Deteccion de rostros (face detection) con recorte de imagenes.

    Para los ejemplos a continuación, cargaré una imagen aleatoria de "Unsplash Source" con esta función:

    function loadRandomImage() {
      const image = new Image();

      image.crossOrigin = true;

      return new Promise((resolve, reject) => {
        image.addEventListener('error', (error) => reject(error));
        image.addEventListener('load', () => resolve(image));
        image.src = 'https://source.unsplash.com/512x512/?face,friends';
      });
    }

    A.-  Recortar una imagen.

        1.-  Carga de los modelos de faceapi, de reconocedor de rostros:   Primero, tenemos que elegir y cargar el "modelo" de reconocedor de 
             caras a utilizar. Para recortar una imagen, solo necesitamos conocer el "cuadro de límite" de una cara, por lo que la detección 
             de rostros es suficiente. 
         
         Podemos usar dos modelos reconocedores de caras: el modelo "SSD Mobilenet V1" (poco menos de 6 MB) y el modelo "Tiny Face Detector" 
         (menos de 200 KB). Digamos que la precisión no es importante porque los usuarios también tienen la opción de recortar manualmente. 
         Además, supongamos que los visitantes usan esta función con una conexión a Internet lenta. Debido a que nuestro enfoque está en el 
         ancho de banda y elrendimiento, elegiremos el modelo "Tiny Face Detector" más pequeño.

        Después de descargar el modelo, podemos cargarlo:

            await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
            / *
              //  Async function of get all promises of the models-face-api
                  const parURL_Models ="./assets/models"
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
                      .catch(err => console.error(`Error:  There is a error in the function "promiseFaceapi":  ${err}`))
                  }
            * /


    B.-  Seleccion de la "imagen de entrada":  Ahora podemos cargar una imagen de entrada y pasarla a la libreria face-api.js. 
         El metodo "faceapi.detectAllFaces" usa el modelo "SSD Mobilenet v1" por defecto, por lo que tendremos que pasar explícitamente 
         una opcion de carga del otro modelo reconocedor, "new faceapi.TinyFaceDetectorOptions()", para forzarlo a usar el modelo de reconocedor 
         de faces "Tiny Face Detector".

            const image = await loadRandomImage();
            const faces = await faceapi.detectAllFaces(image, new faceapi.TinyFaceDetectorOptions());

            / *
            //  Get image from faceapi with: "bufferToImage(imageUpload.files[0])"
            const theImage = await faceapi.bufferToImage(imageUpload.files[0])
            img.src = theImage.src

            //  const detections = await faceapi.detectAllFaces(elemCamera, new faceapi.TinyFaceDetectorOptions())
                  .withFaceLandmarks()
                  .withFaceExpressions()
                  .withAgeAndGender()
                  .withFaceDescriptors()

          * /

          La variable "faces" (detections) ahora contiene una "matriz de resultados" (detectiones realizada por el modelo). 
          Cada resultado tiene una propiedad "box" y otra "score". 

          La puntuación (score) indica qué tan segura está la red neuronal de que el resultado es, de hecho, una cara. 
          La propiedad "box" contiene un "objeto" con las coordenadas de la cara (x, y, width, height). 
          Podríamos seleccionar el primer resultado (o podríamos usar faceapi.detectSingleFace()), pero si el usuario envía una foto grupal, 
          queremos verlos a todos en la imagen recortada. Para hacer eso, podemos calcular un "cuadro de límite personalizado":

              //  Calculo del cuadrado personalizado (box) que contiene en su interior la cara detectada en la imagen de entrada:

              const box = {
              // Set boundaries to their inverse infinity, so any number is greater/smaller
                bottom: -Infinity,
                left: Infinity,
                right: -Infinity,
                top: Infinity,

              // Given the boundaries, we can compute width and height
                get height() {
                  return this.bottom - this.top;
                },

                get width() {
                  return this.right - this.left;
                },
              };

              // Update the box boundaries
                for (const face of faces) {
                  box.bottom = Math.max(box.bottom, face.box.bottom);
                  box.left = Math.min(box.left, face.box.left);
                  box.right = Math.max(box.right, face.box.right);
                  box.top = Math.min(box.top, face.box.top);
                }


          Finalmente, podemos crear un lienzo (canvas) y mostrar el resultado:

          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');

          canvas.height = box.height;
          canvas.width = box.width;

          context.drawImage(image, box.left, box.top, box.width, box.height, 0, 0, canvas.width, canvas.height );
*/


/*  Ejemplo: ejecutar el "face recognition" a partir de una imagen de entrada que muestra varias personas:

  1.-  Incluyendo la libreria  en primer lugar, obtenga la última compilación de dist/face-api.js o la versión minimizada de dist/face-api.min.js
       e incluya el script:

                             <script src="face-api.js"></script>

                             En caso de que trabaje con npm:  npm i face-api.js --save


  2.-  Cargando los datos de los "modelo":  dependiendo de los requisitos de su aplicación, puede cargar específicamente los modelos que 
        (preentrenados)                     necesita, pero para ejecutar un ejemplo completo de "extremo" a "extremo", necesitaremos cargar el 
                                            "modelo de detección de rostros" (face detection), los "puntos de referencia faciales" (landmarks)
                                            y el "reconocimiento de rostros" (face recognition). 
                                            
                                            Los archivos del modelo están disponibles en el repositorio (models)

       Los "pesos del modelo" se han "cuantificado" (ponderado) para reducir el tamaño del archivo del modelo en un 75% en comparación con el 
       modelo original para permitir que su cliente (programa javascript) solo cargue los datos mínimos necesarios.

       Además, los "pesos del modelo" se dividen en fragmentos de un máximo de 4 MB, para permitir que el navegador almacene en caché estos 
       archivos, de modo que solo tengan que cargarse una vez.

       Los "archivos del modelo" simplemente se pueden proporcionar como "activos estáticos" en su aplicación web o puede alojarlos en otro lugar
       y se pueden cargar especificando la ruta o la URL de los archivos.

       Digamos que los está proporcionando en un directorio de modelos (assets/models) junto con sus activos en público/modelos.

               const MODEL_URL = './assets/models'

               async function loadModels() {
                  await faceapi.loadSsdMobilenetv1Model(MODEL_URL)
                  await faceapi.loadFaceLandmarkModel(MODEL_URL)
                  await faceapi.loadFaceRecognitionModel(MODEL_URL)
               }

               o bien:

               //  Async function of get all promises of the models-face-api
               async function promiseFaceapi(parFunctionVideo, parURL_Models) {
                await Promise.all([
                  faceapi.nets.ssdMobilenetv1.loadFromUri(parURL_Models)
                  faceapi.nets.tinyFaceDetector.loadFromUri(parURL_Models),
                  faceapi.nets.faceLandmark68Net.loadFromUri(parURL_Models),
                  faceapi.nets.faceRecognitionNet.loadFromUri(parURL_Models),
                  faceapi.nets.faceExpressionNet.loadFromUri(parURL_Models),
                  faceapi.nets.ageGenderNet.loadFromUri(parURL_Models),
    
                ])
                  .then(parFunctionVideo)
                  .catch(err => console.error(`Error:  There is a error in the function "promiseFaceapi":  ${err}`))
               }
               

  3.-  Reciba una "descripción completa" de todas las caras (faces) de una imagen de entrada.

       Las "redes neuronales" aceptan imágenes HTML, lienzos (canvas) o elementos de video o tensores como entradas de datos. 
       Para detectar todos los "cuadros delimitadores de caras" (face descriptor) de una imagen de entrada, simplemente decimos:

              const input = document.querySelector('#myImage')  // <img id="myImage" class="theImageInput" alt="The image" >
              let fullFaceDescriptions = await faceapi.detectAllFaces(input)
                                                      .withFaceLandmarks()
                                                      .withFaceDescriptors()

              o bien:

              //  Use the "faceapi" to detect all the faces of the image:  method "detectAllFaces(theImage)"
              const detections = await faceapi.detectAllFaces(input)
                  .withFaceLandmarks()
                  .withFaceDescriptors()
                  .withFaceExpressions()
                  .withAgeAndGender()

       Una "descripción completa de la cara" contiene el resultado de la detección (cuadro delimitador + puntuación), los "puntos de 
       referencia de la cara" (landmarks) y el "descriptor calculado". Al omitir el segundo parámetro de opciones de "faceapi.detectAllFaces" 
       (entrada, opciones), la "SSD MobileNet V1" se usará para la "detección de rostros" de forma predeterminada. 
       
       Para usar el modelo "Tiny Face Detector" o "MTCNN" de detection de rostros en su lugar, simplemente puede hacerlo, especificando las 
       opciones correspondientes (new faceapi.TinyFaceDetectorOptions())

       Para obtener documentación detallada sobre las opciones de detección de rostros, consulte la sección correspondiente en el archivo 
       "Readme" del repositorio de github. Tenga en cuenta que debe cargar el modelo correspondiente de antemano para el detector de rostros 
       que desea usar como hicimos con el modelo "SSD MobileNet V1".

       Landmarks:  los "cuadros delimitadores" (landmarks) devueltos y las "posiciones de los puntos de referencia" son relativos a la 
                   imagen original/tamaño del medio. En caso de que el tamaño de la imagen mostrada no corresponda con el tamaño de la imagen 
                   original, simplemente puede cambiar su tamaño:

                        fullFaceDescriptions = faceapi.resizeResults(fullFaceDescriptions)


       Podemos visualizar los resultados de la detección de rostros de la imagen dibujando los cuadros delimitadores en un lienzo (canvas):

                        faceapi.draw.drawDetections(canvas, fullFaceDescriptions)


       Los "puntos de referencia" (landmarks) de la cara se pueden mostrar de la siguiente manera:

                        faceapi.draw.drawLandmarks(canvas, fullFaceDescriptions)


       Por lo general, lo que hago para la visualización es superponer un lienzo absolutamente posicionado en la parte superior del elemento 
       "img" con el mismo ancho y alto (consulte los ejemplos de github para obtener más información).


  4.-  Reconocimiento facial ("face recognition")

      Ahora que sabemos cómo recuperar las "ubicaciones" (landmarks) y los "descriptores" de todos los rostros dada una imagen de entrada, 
      obtendremos algunas imágenes que muestren una persona cada una y calcularemos sus "descriptores faciales". Estos "descriptores" serán 
      nuestros datos de referencia.

      Suponiendo que tenemos disponibles algunas imágenes de ejemplo para nuestros temas, primero buscamos las imágenes de una URL y creamos 
      elementos de imagen HTML a partir de sus búferes de datos usando: 
               
      "faceapi.fetchImage": para cada imagen recuperada, ubicaremos la cara de los sujetos y calcularemos el "descriptor" de la cara, tal como 
                            lo hicimos anteriormente con nuestra imagen de entrada:

                      const labels = ['sheldon' 'raj', 'leonard', 'howard']

                      const labeledFaceDescriptors = await Promise.all(
                          labels.map(async label => {
                            // fetch image data from "urls" and convert "blob" to "HTMLImage element"
                            const imgUrl = `${label}.png`
                            const img = await faceapi.fetchImage(imgUrl)
    
                          // detect the face with the highest score in the image and compute it's landmarks and face descriptor
                          const fullFaceDescription = await faceapi.detectSingleFace(img)
                                                                   .withFaceLandmarks()
                                                                   .withFaceDescriptor()
    
                          if (!fullFaceDescription) {
                            throw new Error(`no faces detected for ${label}`)
                          }
    
                          const faceDescriptors = [fullFaceDescription.descriptor]

                          return new faceapi.LabeledFaceDescriptors(label, faceDescriptors)
                        })
                )


      Tenga en cuenta que esta vez estamos usando "faceapi.detectSingleFace", que devolverá "solo" la cara detectada con la puntuación más 
      alta, ya que asumimos que solo se muestra el carácter de la etiqueta dada en esa imagen.

      Ahora, todo lo que queda por hacer es hacer coincidir los "descriptores faciales" de los rostros detectados de nuestra imagen de entrada 
      con nuestros datos de referencia, por ejemplo, los descriptores faciales etiquetados. Para este propósito, podemos utilizar 
      "faceapi.FaceMatcher" de la siguiente manera:

                // 0.6 is a good distance threshold value to judge whether the descriptors match or not
                const maxDescriptorDistance = 0.6
                const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, maxDescriptorDistance)

                const results = fullFaceDescriptions.map(fd => faceMatcher.findBestMatch(fd.descriptor))


      El comparador de caras usa la "distancia euclidiana" como una "métrica de similitud", lo que resulta funcionar bastante bien. 
      Terminamos con la mejor coincidencia para cada rostro detectado en nuestra imagen de entrada, que contiene la etiqueta + la distancia 
      euclidiana de la coincidencia.

      Finalmente, podemos dibujar los cuadros delimitadores junto con sus etiquetas en un lienzo para mostrar los resultados:

                results.forEach((bestMatch, i) => {
                  const box = fullFaceDescriptions[i].detection.box
                    const text = bestMatch.toString()
                    const drawBox = new faceapi.draw.DrawBox(box, { label: text })
                    drawBox.draw(canvas)
                })
*/
//  FUNCTION START MEDIA (WITH getUserMedia)
/*
    El método "MediaDevices.getUserMedia()" solicita al usuario "permisos" para usar un dispositivo de entrada de vídeo 
    y/o uno de audio como una cámara o compartir la pantalla y/o micrófono. Si el usuario proporciona los permisos, 
    entonces le retornará un "Promise",que es resuelto por el resultado del objeto "MediaStream". Si el usuario niega 
    el permiso, o si el recurso multimedia no es válido, entonces el promise es rechazado con "PermissionDeniedError" o 
    "NotFoundError" respectivamente. Nótese que es posible que el promise retornado no sea ni resuelto ni rechazado, ya 
    que no se requiere que el usuario tome una decisión.

    Sintaxis:  const gumPromise = MediaDevices.getUserMedia(constraints);

               //  Generalmente, se accedera al objeto singleton "MediaDevices" usando: "navigator.mediaDevices":

               navigator.mediaDevices.getUserMedia(myConstraints)
               .then(function(mediaStream) {
                  / * usar el flujo de datos * /
                }).catch(function(err) {
                    / * manejar el error * /
                });

    contsraints:  Es un objeto "MediaStreamConstraints", que especifica los "tipos de recursos" a solicitar, (audio y/o video)
                  junto con cualquier requerimiento para cada tipo.

                  El parámetro "constraints" es un "objeto MediaStreamConstaints" con dos miembros: video y audio, 
                  que describen los tipos de recurso solicitados. Debe especificarse uno o ambos. Si el navegador no puede
                  encontrar todas las pistas de recursos con los tipos especificados que reúnan las restricciones dadas, 
                  entonces la "promise" retornada es rechazado con el error: "NotFoundError".

                  Lo siguiente realiza la petición de tanto audio como vídeo sin requerimientos específicos:

                      Objeto MediaStreamConstaints:  { audio: true, video: true }

                  Mientras que la información acerca de las cámaras y micrófonos de los usuarios se encuentran inaccesibles 
                  por razones de privacidad, una aplicación puede solicitar la cámara y las capacidades del micrófono que este 
                  requiera, usando "restricciones adicionales". El siguiente código es para mosrtar una resolución de una 
                  cámara de 1280 x 720.

                      {
                        audio: true,
                        video: { width: 1280, height: 720 }
                      }


    Valor de retorno:  Una "Promise" que se resuelve a un objeto MediaStream.
*/

//  face-api.js:  JavaScript API for "face detection and face recognition" in the browser implemented on top of the tensorflow.js core API (tensorflow/tfjs-core)

/*  face-api.js: una forma de crear un "sistema de reconocimiento facial" en el navegador.
    A JavaScript API for Face Detection, Face Recognition and Face Landmark Detection.

    face-api.js — JavaScript API for Face Recognition in the Browser with tensorflow.js (by Vincent Mühler )

    ¡Estoy emocionado de decir que finalmente es posible ejecutar el reconocimiento facial en el navegador! 
    Con este artículo, presento "face-api.js", un módulo de javascript, creado sobre el núcleo de "tensorflow.js", 
    que implementa varias CNN (redes neuronales convolucionales) para resolver la detección de rostros, 
    el reconocimiento de rostros y la detección de puntos de referencia faciales, optimizado para el web y para 
    dispositivos móviles.

    Como siempre, veremos un ejemplo de código simple, que lo ayudará a comenzar de inmediato con el paquete en 
    solo unas pocas líneas de código. Si quieres jugar con algunos ejemplos primero, ¡mira la página de demostración ! 
    Pero no te olvides de volver a leer el artículo. ;)

    ¡Vamos a sumergirnos en él!

    Tenga en cuenta que el proyecto está en desarrollo activo. Asegúrese de consultar también mis últimos artículos 
    para mantenerse actualizado sobre las últimas funciones de face-api.js:

    1.-  Seguimiento y reconocimiento facial JavaScript en tiempo real mediante el detector facial MTCNN de face-api.js

         Primero "face-recognition.js", ¿ahora otro paquete más?
         Si ha leído mi otro artículo sobre el reconocimiento facial con nodejs: Node.js + face-recognition.js: 
         Reconocimiento facial simple y robusto mediante el aprendizaje profundo, es posible que sepa que hace algún
         tiempo, armé un paquete similar, por ejemplo, "face- Recognition.js", trayendo el reconocimiento facial a nodejs.

         Al principio, no esperaba que hubiera tanta demanda de un paquete de reconocimiento facial en la comunidad de 
         JavaScript. Para muchas personas, "face-recognition.js" parece ser una alternativa de código abierto y de uso 
         gratuito decente a los servicios pagos para el reconocimiento facial, como los proporcionados por Microsoft o 
         Amazon, por ejemplo. Pero también me han preguntado mucho si es posible ejecutar la tubería de reconocimiento 
         facial completo completamente en el navegador.

         ¡Finalmente lo es, gracias a "tensorflow.js"! Logré implementar herramientas parcialmente similares usando 
         "tfjs-core", que le dará casi los mismos resultados que "face-recognition.js", ¡pero en el navegador! Además, 
         "face-api.js" proporciona "modelos" que están optimizados para la web y para ejecutarse en dispositivos móviles 
         de recursos. Y lo mejor de todo es que no hay necesidad de configurar ninguna dependencia externa, funciona 
         directamente desde el primer momento. Como beneficio adicional, está acelerado por GPU y ejecuta operaciones en 
         un backend WebGL.

         ¡Esta fue razón suficiente para convencerme de que la comunidad de JavaScript necesita un paquete de este tipo 
         para el navegador! Lo dejaré a su imaginación, qué variedad de aplicaciones puede crear con esto. ;)


    2.-  Cómo resolver el reconocimiento facial con aprendizaje profundo.

         Si usted es ese tipo de chico (o chica), que simplemente busca comenzar lo más rápido posible, puede omitir 
         esta sección y saltar directamente al código. Pero para comprender mejor el enfoque utilizado en "face-api.js" 
         para implementar el reconocimiento facial, le recomiendo encarecidamente que lo siga, ya que me preguntan sobre 
         esto con bastante frecuencia.

         Para simplificar, lo que realmente queremos lograr es identificar a una persona dada una imagen de su rostro. 
         La forma en que lo hacemos es proporcionar una (o más) imágenes para cada persona que queremos reconocer, 
         "etiquetadas" con el nombre de la persona, por ejemplo, el dato de referencia. Ahora comparamos la imagen de 
         entrada con los datos de referencia y encontramos la imagen "más similar" a la de la referencia. Si ambas imágenes
         son lo suficientemente similares, generamos el nombre de persona, de lo contrario sacamos'desconocido'.

         ¡Suena como un plan! Sin embargo, quedan dos problemas. En primer lugar, ¿qué pasa si tenemos una imagen que 
         muestra a varias personas y queremos reconocerlas a todas? Y en segundo lugar, necesitamos poder obtener ese tipo 
         de métrica de similitud para dos imágenes de rostros para poder compararlas...


    3.-  Detección de rostro. (face recognition)

         La respuesta al primer problema es la "detección de rostros". En pocas palabras, primero ubicaremos todas las 
         caras en la imagen de entrada. "Face-api.js" implementa múltiples detectores de rostros para diferentes casos de 
         uso.

         El "detector de rostros" más preciso es un SSD (detector de caja múltiple de disparo único), que es básicamente 
         una CNN basada en "MobileNet V1", con algunas capas de predicción de caja adicionales apiladas en la parte 
         superior de la red.

         Además, "face-api.js" implementa un "Tiny Face Detector" optimizado, básicamente una versión aún más pequeña 
         de "Tiny Yolo v2" que utiliza circunvoluciones separables en profundidad en lugar de circunvoluciones regulares, 
         que es un detector de rostros mucho más rápido, pero un poco menos preciso en comparación con "SSD MobileNet V1".

         Por último, también hay una implementación de "MTCNN" (red neuronal convolucional en cascada multitarea), que, 
         sin embargo, existe principalmente en la actualidad con fines experimentales.

         Las redes devuelven los "cuadros delimitadores" de cada cara, con sus puntuaciones correspondientes, por ejemplo, 
         la probabilidad de que cada cuadro delimitador muestre una cara. Las puntuaciones se utilizan para filtrar los 
         cuadros delimitadores, ya que puede ser que una imagen no contenga ningún rostro. Tenga en cuenta que la detección
        de rostros también debe realizarse incluso si solo hay una persona para recuperar el cuadro delimitador.


    4.-  Detección de puntos de referencia faciales y alineación de rostros.

        ¡Primer problema resuelto! Sin embargo, quiero señalar que queremos alinear los cuadros delimitadores, de modo que 
        podamos extraer las imágenes centradas en la cara de cada cuadro antes de pasarlas a la red de reconocimiento facial,
        ¡ya que esto hará que el reconocimiento facial sea mucho más preciso!

        Para ese propósito, "face-api.js" implementa una CNN simple, que devuelve los "68 puntos de referencia" de la cara 
        de una imagen de cara dada.

        Desde las posiciones de los "puntos de referencia", el cuadro delimitador se puede centrar en la cara.


    5.-  Reconocimiento facial.

         Ahora podemos alimentar las imágenes faciales extraídas y alineadas en la "red de reconocimiento facial", que se 
         basa en una arquitectura similar a "ResNet-34" y básicamente corresponde a la arquitectura implementada en dlib. 
         La red ha sido entrenada para aprender a mapear las características de un rostro humano a un descriptor de rostro 
         (un vector de características con 128 valores), que a menudo también se conoce como "incrustaciones de rostros".

         Ahora, para volver a nuestro problema original de comparar dos rostros: usaremos el "descriptor de rostro" de 
         cada imagen de rostro extraída y los compararemos con los descriptores de rostro de los datos de referencia. 
         Más precisamente, podemos calcular la "distancia euclidiana" entre dos descriptores de rostros y juzgar si dos 
         rostros son similares en función de un valor de umbral (para imágenes de rostros de tamaño 150 x 150, 0,6 es un 
        buen valor de umbral). El uso de la "distancia euclidiana" funciona sorprendentemente bien, pero, por supuesto, 
        puede usar cualquier tipo de clasificador de su elección.
    

    6.-  Ejemplo: y ahora que ingerimos la teoría del reconocimiento facial, podemos comenzar a codificar un ejemplo.

         En este breve ejemplo, veremos paso a paso cómo ejecutar el "reconocimiento facial" en la siguiente imagen de 
         entrada que muestra varias personas:


        6.1.-  Incluyendo el guión:  en primer lugar, obtenga la última compilación de dist/face-api.js o la versión 
               minimizada de dist/face-api.min.js e incluya el script:

               <script src="face-api.js"></script>

               En caso de que trabaje con npm:  npm i face-api.js


        6.2.-  Cargando los datos del "modelo":  dependiendo de los requisitos de su aplicación, puede cargar 
               específicamente los modelos que necesita, pero para ejecutar un ejemplo completo de extremo a extremo, 
               necesitaremos cargar el "modelo de detección de rostros", los "puntos de referencia faciales" y el 
               "reconocimiento de rostros". Los archivos del modelo están disponibles en el repositorio.

               Los "pesos del modelo" se han cuantificado para reducir el tamaño del archivo del modelo en un 75% en 
               comparación con el modelo original para permitir que su cliente solo cargue los datos mínimos necesarios. 
               Además, los "pesos del modelo" se dividen en fragmentos de un máximo de 4 MB, para permitir que el 
               navegador almacene en caché estos archivos, de modo que solo tengan que cargarse una vez.

               Los "archivos del modelo" simplemente se pueden proporcionar como activos estáticos en su aplicación web 
               o puede alojarlos en otro lugar y se pueden cargar especificando la ruta o la URL de los archivos. 
               Digamos que los está proporcionando en un directorio de modelos junto con sus activos en público/modelos.

               const MODEL_URL = '/models'

               await faceapi.loadSsdMobilenetv1Model(MODEL_URL)
               await faceapi.loadFaceLandmarkModel(MODEL_URL)
               await faceapi.loadFaceRecognitionModel(MODEL_URL)

        6.3.-  Reciba una "descripción completa" de todas las caras de una imagen de entrada.

               Las "redes neuronales" aceptan imágenes HTML, lienzos o elementos de video o tensores como entradas. 
               Para detectar todos los cuadros delimitadores de caras de una imagen de entrada, simplemente decimos:

               const input = document.getElementById('myImage')
               let fullFaceDescriptions = await faceapi.detectAllFaces(input)
                                                  .withFaceLandmarks()
                                                  .withFaceDescriptors()


               Una "descripción completa de la cara" contiene el resultado de la detección (cuadro delimitador + puntuación)
               , los "puntos de referencia de la cara" (landmarks) y el "descriptor calculado". Al omitir el segundo 
               parámetro de opciones de "faceapi.detectAllFaces" (entrada, opciones), la "SSD MobileNet V1" se usará para 
               la "detección de rostros" de forma predeterminada. Para usar "Tiny Face Detector" o "MTCNN" en su lugar, 
               simplemente puede hacerlo, especificando las opciones correspondientes.


               Para obtener documentación detallada sobre las opciones de detección de rostros, consulte la sección 
               correspondiente en el archivo "Readme" del repositorio de github. Tenga en cuenta que debe cargar el 
               modelo correspondiente de antemano para el detector de rostros que desea usar como hicimos con el modelo 
               "SSD MobileNet V1".

               Los "cuadros delimitadores devueltos" y las "posiciones de los puntos de referencia" son relativos a la 
               imagen original/tamaño del medio. En caso de que el tamaño de la imagen mostrada no corresponda con el 
               tamaño de la imagen original, simplemente puede cambiar su tamaño:

                fullFaceDescriptions = faceapi.resizeResults(fullFaceDescriptions)


               Podemos visualizar los resultados de la detección dibujando los cuadros delimitadores en un lienzo:

                faceapi.draw.drawDetections(canvas, fullFaceDescriptions)


               Los "puntos de referencia" (landmarks) de la cara se pueden mostrar de la siguiente manera:

               faceapi.draw.drawLandmarks(canvas, fullFaceDescriptions)


              Por lo general, lo que hago para la visualización es superponer un lienzo absolutamente posicionado en 
              la parte superior del elemento img con el mismo ancho y alto (consulte los ejemplos de github para obtener 
              más información).


        6.4.-  Reconocimiento facial.

               Ahora que sabemos cómo recuperar las ubicaciones y los descriptores de todos los rostros dada una imagen 
               de entrada, obtendremos algunas imágenes que muestren una persona cada una y calcularemos sus descriptores 
               faciales. Estos descriptores serán nuestros datos de referencia.

               Suponiendo que tenemos disponibles algunas imágenes de ejemplo para nuestros temas, primero buscamos las 
               imágenes de una URL y creamos elementos de imagen HTML a partir de sus búferes de datos usando: 
               
               "faceapi.fetchImage". Para cada imagen recuperada, ubicaremos la cara de los sujetos y calcularemos el 
               descriptor de la cara, tal como lo hicimos anteriormente con nuestra imagen de entrada:

                
                const labels = ['sheldon' 'raj', 'leonard', 'howard']

                const labeledFaceDescriptors = await Promise.all(
                    labels.map(async label => {
                      // fetch image data from urls and convert blob to HTMLImage element
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


              Tenga en cuenta que esta vez estamos usando "faceapi.detectSingleFace", que devolverá "solo" la cara 
              detectada con la puntuación más alta, ya que asumimos que solo se muestra el carácter de la etiqueta 
              dada en esa imagen.

              Ahora, todo lo que queda por hacer es hacer coincidir los descriptores faciales de los rostros detectados 
              de nuestra imagen de entrada con nuestros datos de referencia, por ejemplo, los descriptores faciales 
              etiquetados. Para este propósito, podemos utilizar "faceapi.FaceMatcher" de la siguiente manera:

              // 0.6 is a good distance threshold value to judge
              // whether the descriptors match or not
              const maxDescriptorDistance = 0.6
              const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, maxDescriptorDistance)

              const results = fullFaceDescriptions.map(fd => faceMatcher.findBestMatch(fd.descriptor))


             El comparador de caras usa la "distancia euclidiana" como una "métrica de similitud", lo que resulta 
             funcionar bastante bien. Terminamos con la mejor coincidencia para cada rostro detectado en nuestra 
             imagen de entrada, que contiene la etiqueta + la distancia euclidiana de la coincidencia.

             Finalmente, podemos dibujar los cuadros delimitadores junto con sus etiquetas en un lienzo para 
             mostrar los resultados:

            results.forEach((bestMatch, i) => {
              const box = fullFaceDescriptions[i].detection.box
              const text = bestMatch.toString()
              const drawBox = new faceapi.draw.DrawBox(box, { label: text })
              drawBox.draw(canvas)
            })

            ¡Aquí vamos! Por ahora, espero que tengas una primera idea de cómo usar la API. También recomendaría 
            echar un vistazo a los otros ejemplos en el repositorio. ¡Y ahora, diviértete jugando con el paquete! ;)
*/

/*  face-api.js:  "JavaScript API" for "face detection" and "face recognition" in the browser implemented on top of 
                  the "tensorflow.js core API" (tensorflow/tfjs-core)

    1.-  Modelos Disponibles:  
    
    1.1.-  Modelos de detección de rostros.

          A.- SSD Mobilenet V1:  Para la detección de rostros, este proyecto implementa un SSD (Single Shot 
                                 Multibox Detector) basado en "MobileNetV1". La "red neuronal" calculará las 
                                 ubicaciones de cada rostro en una imagen y devolverá los cuadros delimitadores 
                                 junto con su probabilidad para cada rostro. 
           
              Este "detector de rostros" tiene como objetivo obtener una "alta precisión" en la detección de 
              cuadros delimitadores de rostros en lugar de un tiempo de inferencia bajo. El tamaño del modelo 
              cuantificado es de aproximadamente 5,4 MB ( ssd_mobilenetv1_model ).

              El modelo de detección de rostros se entrenó en el conjunto de datos WIDERFACE y yeephycho 
              proporciona los pesos en este repositorio.


          B.-  Detector de rostro diminuto (Tiny Face Detector): El "Tiny Face Detector" es un detector de rostros 
                                                                 en tiempo real de "gran rendimiento", que es 
                                                                 mucho más rápido, más pequeño y consume menos 
                                                                 recursos en comparación con el detector de rostros
                                                                "SSD Mobilenet V1"; a cambio, funciona un poco 
                                                                 menos bien en la detección de rostros pequeños. 
                                                                 Este modelo es extremadamente móvil y compatible 
                                                                 con la web, por lo que debería ser su detector de
                                                                rostros GO-TO en dispositivos móviles y clientes 
                                                                con recursos limitados. El tamaño del modelo 
                                                                cuantificado es de solo 190 KB 
                                                                ( tiny_face_detector_model ).

                El detector de rostros se entrenó en un conjunto de datos personalizado de ~14K imágenes 
                etiquetadas con cuadros delimitadores. Además, el modelo ha sido entrenado para predecir cuadros 
                delimitadores, que cubren por completo los puntos de las características faciales, por lo que, en 
                general, produce mejores resultados en combinación con la detección posterior de puntos de 
                referencia faciales que SSD Mobilenet V1.

                Este modelo es básicamente una versión aún más pequeña de "Tiny Yolo V2", que reemplaza las 
                circunvoluciones regulares de Yolo con circunvoluciones separables en profundidad. Yolo es 
                completamente convolucional, por lo que puede adaptarse fácilmente a diferentes tamaños de imagen 
                de entrada para compensar la precisión por el rendimiento (tiempo de inferencia).


          C.-  MTCNN: Tenga en cuenta que este modelo se mantiene principalmente en este repositorio por razones 
                      "experimentales". En general, los otros detectores de rostros deberían funcionar mejor, 
                      pero, por supuesto, puedes jugar con MTCNN.

                      MTCNN (Redes neuronales convolucionales en cascada multitarea) representa un detector de 
                      rostros alternativo a "SSD Mobilenet v1" y "Tiny Yolo v2", que ofrece mucho más espacio para
                      la configuración. Al ajustar los parámetros de entrada, MTCNN debería poder detectar una 
                      amplia gama de tamaños de cuadros delimitadores de rostros. MTCNN es una CNN en cascada de 
                      3 etapas, que devuelve simultáneamente 5 puntos de referencia de cara junto con los cuadros 
                      delimitadores y puntuaciones para cada cara. Además, el tamaño del modelo es de solo 2 MB.

                      MTCNN se ha presentado en el artículo Detección y alineación de caras conjuntas utilizando 
                      redes convolucionales en cascada multitarea por Zhang et al. y los pesos del modelo se 
                      proporcionan en el repositorio oficial de la implementación de MTCNN.


    1.2.-  Modelos de detección de "puntos de referencia de cara" de 68 puntos (face_landmark_68_model)

           Este paquete implementa un "detector de referencias faciales de 68 puntos", muy liviano y rápido, pero 
           preciso. El modelo predeterminado tiene un tamaño de solo 350 kb (face_landmark_68_model ) y el modelo 
           pequeño tiene solo 80 kb (face_landmark_68_tiny_model). Ambos modelos emplean las ideas de 
           circunvoluciones separables en profundidad, así como bloques densamente conectados. 
           
           Los modelos han sido entrenados en un conjunto de datos de ~35k imágenes de caras etiquetadas con 68 
           puntos de referencia de caras.


    1.3.-  Modelo de reconocimiento facial (face_recognition_model)

           Para el "reconocimiento facial", se implementa una arquitectura similar a "ResNet-34" para calcular un 
           "descriptor facial" (un vector de características con 128 valores) a partir de cualquier imagen facial 
           dada, que se utiliza para describir las características del rostro de una persona. 
           
           El modelo no se limita al conjunto de rostros utilizados para el entrenamiento, lo que significa que 
           puede usarlo para el reconocimiento facial de cualquier persona, por ejemplo, usted mismo. Puede 
           determinar la similitud de dos caras arbitrarias comparando sus descriptores de cara, por ejemplo, 
           calculando la distancia euclidiana o utilizando cualquier otro clasificador de su elección.

           La red neuronal es equivalente a "FaceRecognizerNet" utilizada en "face-recognition.js" y la red 
           utilizada en el ejemplo de reconocimiento facial de dlib. 
           
           Los pesos han sido entrenados por davisking y el modelo logra una precisión de predicción del 99,38% en 
           el punto de referencia LFW (Labeled Faces in the Wild) para el reconocimiento facial.

          El tamaño del modelo cuantificado es de aproximadamente 6,2 MB (face_recognition_model).


    1.4.-  Modelo de reconocimiento de "expresiones faciales" ()

          El "modelo de reconocimiento de expresiones faciales" es ligero, rápido y proporciona una precisión 
          razonable. El modelo tiene un tamaño de aproximadamente 310kb y emplea circunvoluciones separables en 
          profundidad y bloques densamente conectados. Ha sido entrenado en una variedad de imágenes de conjuntos 
          de datos disponibles públicamente, así como en imágenes extraídas de la web. Tenga en cuenta que el uso 
          de anteojos puede disminuir la precisión de los resultados de la predicción.
*/

//    PASOS Y PARTES
/*
    1.-  Empezando

    1.1.-  face-api.js para el navegador: Simplemente incluya el script más reciente de dist/face-api.js, o 
    instálelo a través de npm:  npm i face-api.js

    2.-  face-api.js para Nodejs: podemos usar la API equivalente en un entorno de nodejs rellenando algunas 
    especificaciones del navegador, como HTMLImageElement, HTMLCanvasElement e ImageData. 
    
    La forma más sencilla de hacerlo es instalando el paquete "node-canvas".

    Alternativamente, puede simplemente construir sus propios tensores a partir de datos de imagen y pasar 
    tensores como entradas a la API.

    Además, desea instalar "@tensorflow/tfjs-node" (no es obligatorio, pero sí muy recomendable), lo que acelera 
    drásticamente las cosas al compilar y enlazar con la biblioteca nativa de Tensorflow C++:

        npm i face-api.js canvas @tensorflow/tfjs-node

    Ahora simplemente parcheamos el entorno para usar los polyfills:

        // import nodejs bindings to native tensorflow,not required, but will speed up things drastically (python required)
        import '@tensorflow/tfjs-node';

        // implements nodejs wrappers for HTMLCanvasElement, HTMLImageElement, ImageData
        import * as canvas from 'canvas';

        import * as faceapi from 'face-api.js';

        // patch nodejs environment, we need to provide an implementation of HTMLCanvasElement and 
        // HTMLImageElement, additionally an implementation of ImageData is required, in case you want to use 
        // the MTCNN
        const { Canvas, Image, ImageData } = canvas
        faceapi.env.monkeyPatch({ Canvas, Image, ImageData })


      2.-  Uso.

      2.1.-  Cargando los modelos: para cargar un modelo, debe proporcionar el archivo "manifest.json" 
             correspondiente, así como los archivos de peso del modelo (fragmentos) como activos. Simplemente 
             cópielos en su carpeta pública o de assets. Los archivos "manifest.json" y "shard" de un modelo deben 
             estar ubicados en el mismo directorio / accesibles bajo la misma ruta.

             Suponiendo que los modelos residen en público/modelos :

            await faceapi.loadSsdMobilenetv1Model('/models')

            // accordingly for the other models:
            // await faceapi.loadTinyFaceDetectorModel('/models')
            // await faceapi.loadMtcnnModel('/models')
            // await faceapi.loadFaceLandmarkModel('/models')
            // await faceapi.loadFaceLandmarkTinyModel('/models')
            // await faceapi.loadFaceRecognitionModel('/models')
            // await faceapi.loadFaceExpressionModel('/models')


          Todas las instancias de redes neuronales globales se exportan a través de "faceapi.nets":

            console.log(faceapi.nets)

          Lo siguiente es equivalente a await faceapi.loadSsdMobilenetv1Model('/models'):

            await faceapi.nets.ssdMobilenetv1.loadFromUri('/models')


          En un entorno nodejs, además, puede cargar los modelos directamente desde el disco:

            await faceapi.nets.ssdMobilenetv1.loadFromDisk('./models')

          También puede cargar el modelo desde un tf.NamedTensorMap:

            await faceapi.nets.ssdMobilenetv1.loadFromWeightMap(weightMap)

          Alternativamente, también puede crear instancias propias de las redes neuronales:

            const net = new faceapi.SsdMobilenetv1()
            await net.load('/models')

          También puedes cargar los pesos como un Float32Array (en caso de que quieras usar los modelos sin 
          comprimir):

            // using fetch
            net.load(await faceapi.fetchNetWeights('/models/face_detection_model.weights'))

            // using axios
            const res = await axios.get('/models/face_detection_model.weights', { responseType: 'arraybuffer' })
            const weights = new Float32Array(res.data)
            net.load(weights)


      3.-  API de alto nivel.

           En la entrada puede haber diferentes elementos HTML: img, video o canvas o la identificación de ese 
           elemento.

<img id="myImg" src="images/example.png" />
<video id="myVideo" src="media/example.mp4" />
<canvas id="myCanvas" />
const input = document.getElementById('myImg')
// const input = document.getElementById('myVideo')
// const input = document.getElementById('myCanvas')
// or simply:
// const input = 'myImg'
Detección de rostros
Detecta todas las caras en una imagen. Devuelve Array< FaceDetection > :

const detections = await faceapi.detectAllFaces(input)
Detecta la cara con la puntuación de confianza más alta en una imagen. Devuelve FaceDetection | indefinido :

const detection = await faceapi.detectSingleFace(input)
De forma predeterminada, detectAllFaces y detectSingleFace utilizan el detector de rostros SSD Mobilenet V1. Puede especificar el detector de rostros pasando el objeto de opciones correspondiente:

const detections1 = await faceapi.detectAllFaces(input, new faceapi.SsdMobilenetv1Options())
const detections2 = await faceapi.detectAllFaces(input, new faceapi.TinyFaceDetectorOptions())
const detections3 = await faceapi.detectAllFaces(input, new faceapi.MtcnnOptions())
Puede ajustar las opciones de cada detector de rostros como se muestra aquí .

Detección de 68 puntos de referencia faciales
Después de la detección de rostros, podemos predecir los puntos de referencia faciales para cada rostro detectado de la siguiente manera:

Detecta todas las caras en una imagen + calcula 68 puntos de referencia de cara para cada cara detectada. Devuelve Array< WithFaceLandmarks<WithFaceDetection<{}>> > :

const detectionsWithLandmarks = await faceapi.detectAllFaces(input).withFaceLandmarks()
Detecta la cara con la puntuación de confianza más alta en una imagen y calcula 68 puntos de referencia de la cara para esa cara. Devuelve WithFaceLandmarks<WithFaceDetection<{}>> | indefinido :

const detectionWithLandmarks = await faceapi.detectSingleFace(input).withFaceLandmarks()
También puede especificar usar el modelo diminuto en lugar del modelo predeterminado:

const useTinyModel = true
const detectionsWithLandmarks = await faceapi.detectAllFaces(input).withFaceLandmarks(useTinyModel)
Cálculo de descriptores faciales
Después de la detección de rostros y la predicción de puntos de referencia faciales, los descriptores faciales para cada rostro se pueden calcular de la siguiente manera:

Detecta todas las caras en una imagen + calcula 68 puntos de referencia de cara para cada cara detectada. Devuelve Array< WithFaceDescriptor<WithFaceLandmarks<WithFaceDetection<{}>>> > :

const results = await faceapi.detectAllFaces(input).withFaceLandmarks().withFaceDescriptors()
Detecta la cara con la puntuación de confianza más alta en una imagen + calcula 68 puntos de referencia de la cara y la descripción de la cara para esa cara. Devuelve WithFaceDescriptor<WithFaceLandmarks<WithFaceDetection<{}>>> | indefinido :

const result = await faceapi.detectSingleFace(input).withFaceLandmarks().withFaceDescriptor()
Reconocer las expresiones faciales
El reconocimiento de expresiones faciales se puede realizar para las caras detectadas de la siguiente manera:

Detecta todas las caras en una imagen y reconoce las expresiones faciales. Devuelve Array< WithFaceExpressions<WithFaceDetection<{}>> > :

const detectionsWithExpressions = await faceapi.detectAllFaces(input).withFaceExpressions()
Detecta el rostro con la puntuación de confianza más alta en una imagen y reconoce la expresión facial de ese rostro. Devuelve WithFaceExpressions<WithFaceDetection<{}>> | indefinido :

const detectionWithExpressions = await faceapi.detectSingleFace(input).withFaceExpressions()
Composición de Tareas
Las tareas se pueden componer de la siguiente manera:

// all faces
await faceapi.detectAllFaces(input)
await faceapi.detectAllFaces(input).withFaceExpressions()
await faceapi.detectAllFaces(input).withFaceLandmarks()
await faceapi.detectAllFaces(input).withFaceExpressions().withFaceLandmarks()
await faceapi.detectAllFaces(input).withFaceExpressions().withFaceLandmarks().withFaceDescriptors()

// single face
await faceapi.detectSingleFace(input)
await faceapi.detectSingleFace(input).withFaceExpressions()
await faceapi.detectSingleFace(input).withFaceLandmarks()
await faceapi.detectSingleFace(input).withFaceExpressions().withFaceLandmarks()
await faceapi.detectSingleFace(input).withFaceExpressions().withFaceLandmarks().withFaceDescriptor()
Reconocimiento facial por coincidencia de descriptores
Para realizar el reconocimiento facial, se puede usar faceapi.FaceMatcher para comparar los descriptores faciales de referencia con los descriptores faciales de consulta.

Primero, inicializamos el FaceMatcher con los datos de referencia, por ejemplo, podemos simplemente detectar caras en una imagen de referencia y hacer coincidir los descriptores de las caras detectadas con las caras de las imágenes subsiguientes:

const results = await faceapi
  .detectAllFaces(referenceImage)
  .withFaceLandmarks()
  .withFaceDescriptors()

if (!results.length) {
  return
}

// create FaceMatcher with automatically assigned labels
// from the detection results for the reference image
const faceMatcher = new faceapi.FaceMatcher(results)
Ahora podemos reconocer el rostro de una persona que se muestra en queryImage1 :

const singleResult = await faceapi
  .detectSingleFace(queryImage1)
  .withFaceLandmarks()
  .withFaceDescriptor()

if (singleResult) {
  const bestMatch = faceMatcher.findBestMatch(singleResult.descriptor)
  console.log(bestMatch.toString())
}
O podemos reconocer todas las caras que se muestran en queryImage2 :

const results = await faceapi
  .detectAllFaces(queryImage2)
  .withFaceLandmarks()
  .withFaceDescriptors()

results.forEach(fd => {
  const bestMatch = faceMatcher.findBestMatch(fd.descriptor)
  console.log(bestMatch.toString())
})
También puede crear descriptores de referencia etiquetados de la siguiente manera:

const labeledDescriptors = [
  new faceapi.LabeledFaceDescriptors(
    'obama',
    [descriptorObama1, descriptorObama2]
  ),
  new faceapi.LabeledFaceDescriptors(
    'trump',
    [descriptorTrump]
  )
]

const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors)

Visualización de resultados de detección
Dibujar las caras detectadas en un lienzo:

const detections = await faceapi.detectAllFaces(input)

// resize the detected boxes in case your displayed image has a different size then the original
const detectionsForSize = faceapi.resizeResults(detections, { width: input.width, height: input.height })
// draw them into a canvas
const canvas = document.getElementById('overlay')
canvas.width = input.width
canvas.height = input.height
faceapi.drawDetection(canvas, detectionsForSize, { withScore: true })
Dibujar puntos de referencia faciales en un lienzo:

const detectionsWithLandmarks = await faceapi
  .detectAllFaces(input)
  .withFaceLandmarks()

// resize the detected boxes and landmarks in case your displayed image has a different size then the original
const detectionsWithLandmarksForSize = faceapi.resizeResults(detectionsWithLandmarks, { width: input.width, height: input.height })
// draw them into a canvas
const canvas = document.getElementById('overlay')
canvas.width = input.width
canvas.height = input.height
faceapi.drawLandmarks(canvas, detectionsWithLandmarks, { drawLines: true })
Finalmente también puedes dibujar cuadros con texto personalizado:

const boxesWithText = [
  new faceapi.BoxWithText(new faceapi.Rect(x, y, width, height), text))
  new faceapi.BoxWithText(new faceapi.Rect(0, 0, 50, 50), 'some text'))
]

const canvas = document.getElementById('overlay')
faceapi.drawDetection(canvas, boxesWithText)

*/

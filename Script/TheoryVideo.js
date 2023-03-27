///////////////////////////////////////////////////////////////////////////////////////////
/*  Audio y video en la web.

    Los desarrolladores web han querido usar audio y video en la web por mucho tiempo, desde comienzos del 2000 cuando
    empezamos a tener un ancho de banda suficientemente rápido para soportar cualquier tipo de video (los archivos de video
    son mucho más grandes que texto o imágenes). En los inicios, las tecnologías web nativas como HTML no tenían el soporte
    para incrustar audio y video en la Web, tecnologías privadas (o basadas en plugins) como Flash (y después, Silverlight)
    se convirtieron populares para manipular este tipo de contenido. Este tipo de tecnología funcionó bien, pero tenía ciertos
    problemas, incluídos el no trabajar bien con las características de HTML/CSS, problemas de seguridad y problemas de
    accesibilidad.

    Una solución "nativa" podría resolver mucho de esto si es implementado correctamente. Afortunadamente, unos pocos años
    después la especificación HTML5 tenía tales características agregadas, con los elementosHTML: "<video>" y "<audio>", y
    algo nuevo: JavaScript APIs para controlar estos.

    Nota: Antes de empezar, también deberías saber que hay un puñado de OVPs (proveedores de video online) como YouTube,
          Dailymotion y Vimeo, y proveedores de audio como Soundcloud. Tales compañías ofrecen una conveniente fácil forma
          de hospedar y consumir videos, y que no tienes que preocuparte sobre el enorme ancho de banda que se consume.
          Los OVPs normalmente usan "código prefabricado" para incrustar video/audio en tus sitios web; si usas ese camino,
          puedes evitar algunas dificultades que discutimos en este artículo.
*/
//  Etiqueta: <video>
/*
    El elemento HTML "<video>" se utiliza para mostrar (incrustar) video en una página HTML.

    Etiquetas de vídeo HTML
                                Tag	                      Description

                                <video>	                  Defines a video or movie

                                <source>	                Defines multiple media resources for media elements,
                                                          such as <video> and <audio>

                                <track>	                  Defines text tracks in media players

    1.-  El elemento HTML <video>

    Para mostrar un video en HTML, use el elemento (etiqueta) HTML: <video>:

    Ejemplo:
              <video width="320" height="240" controls autoplay muted poster="posterimage.jpg">
                <source src="movie.mp4" type="video/mp4">
                <source src="movie.ogg" type="video/ogg">
                Your browser does not support the video tag.
              </video>

    El atributo "controls" agrega "controles de video", como: reproducción, pausa y volumen. El atributo "poster" moistrara
    una imagen mientras se carga el video.

    Nota:  Es una buena idea incluir siempre los atributos: "width" y "height". Si no se configuran la altura y el ancho,
           la página puede parpadear mientras se carga el video.

    El elemento (etiqueta) HTML: <source>, permite especificar los "archivos de video alternativos" que el navegador puede
    elegir. El navegador utilizará el primer formato reconocido.

    El texto entre las etiquetas "<video>" y "</video>" solo se mostrará en navegadores que no admitan el elemento <video>.

    El atributo "autoplay" iniciara el video automaticamente al cargarse.


    Nota: los navegadores Chromium no permiten la reproducción automática en la mayoría de los casos. Sin embargo, la
          reproducción automática silenciada siempre está permitida con el atributo: "muted"

          Agregue el atributo "muted" después del atributo "autoplay" para permitir que su video comience a reproducirse
          automáticamente (pero silenciado):


    2.-  Formatos de vídeo HTML.

    Hay "tres formatos de video" compatibles: MP4, WebM y Ogg.

    Contenidos de un archivo de medios
Repasemos la terminología rápidamente. Formatos como MP3, MP4 y WebM son llamados formatos contenedores. Estos contienen diferentes partes que componen toda la canción o video — como una pista de audio y una pista de video (en el caso del video), y metadatos para describir los contenidos que se presentan, qué codecs se usan para codificar sus canales, etcétera.

Un archivo WebM contiene una película que tiene una pista principal de video y otra pista con un ángulo alternativo, junto con audio en inglés y español, además de una pista con comentarios en inglés, lo que puede ser conceptualizado en el siguiente diagrama. También se incluyeron pistas de texto que contienen los subtítulos de la película en inglés, español y para el comentario.


Las pistas de audio y video dentro del contenedor mantienen los datos en un formato adecuado para el codec usado para codificar ese medio. Se usan diferentes formatos para pistas de audio versus de video. Cada pista de audio es codificada usando un codec de audio mientras que las pistas de video son codificadas (como probablemente ya has adivinado) usando un codec de video. Así como hemos hablado previamente, diferentes navegadores soportan diferentras formatos de audio y video, y diferentes formatos contenedores (como MP3, MP4 y WebM, que pueden contener diferentes tipos de video y audio).

Por ejemplo:

Un WebM usualmente contiene paquetes de Ogg Vorbis audio con VP8/VP9 video. Soportado principalmente por Firefox y Chrome.
Un MP4 contiene a menudo paquetes AAC o audio MP3 con videos H.264. Principalmente soportados en Internet Explorer y Safari.
El antiguo contenedor Ogg suele usar audio Ogg Vorbis y video Ogg Theora. Es principalmente soportado por Firefox y Chrome, pero básicamente ha sido reemplazado por el formato WebM de mejor calidad.
Un reproductor de audio tenderá a reproducir directamente un track de audio. Por ejemplo un archivo MP3 u Ogg. No necesitan contenedores.

Nota: No es tan simple como se ve en nuestra tabla de compatibilidad de codecs audio-video (en-US). Además, muchos browsers de plataformas móviles pueden reproducir un formato no soportado entregándoselo al reproductor multimedia del sistema subyacente para que lo reproduzca. Pero esto servirá por ahora.

Los formatos anteriores existen para comprimir los archivos de audio y video volviéndolos manejables (el tamaño sin comprimir es muy grande). Los browsers contienen diferentes Codecs, como Vorbis o H.264, los cuales son usados para convertir el sonido y video comprimidos en binario y viceversa. Pero desafortunadamente, como indicamos antes, no todos los browsers soportan los mismos codecs, por lo tanto, habrá que proveer varios archivos para cada producción multimedia. Si te falta el codec correcto para decodificar el medio, simplemente no se reproducirá.

Nota: Debes estar preguntándote por qué sucede esto. El MP3 (para audio) y el MP4/H.264 (para video) son ampliamente compatibles y de buena calidad, sin embargo, también están patentados — sus patentes cubren MP3 al menos hasta 2017 y a H.264 hasta 2027, lo que significa que los browsers que no tienen la patente tienen que pagar grandes sumas de dinero para soportar estos formatos. Además, mucha gente no permite el software con restricciones, por estar a favor de formatos abiertos. Por todo esto es que tenemos que proveer múltiples formatos para los diferentes browsers.

Está bien, ¿pero cómo lo hacemos? Miremos el siguiente ejemplo actualizado (pruébalo en vivo aquí), o acá:

<video controls>
  <source src="rabbit320.mp4" type="video/mp4">
  <source src="rabbit320.webm" type="video/webm">
  <p>Su navegador no soporta video HTML5. Aquí hay un <a href="rabbit320.mp4">enlace al video</a>.</p>
</video>
Copy to Clipboard
Tomamos el atributo src del tag <video> y en su lugar incluimos elementos separados <source> que apuntan a sus propias fuentes. En este caso el browser irá a los elementos <source> y reproducirá el primero de los elementos que el codec soporte. Incluir fuentes WebM y MP4 debería bastar para reproducir el video en la mayoría de los browsers en estos días.

Cada elemento <source> tambien tiene un atributo type . Esto es opcional, pero se recomienda que se incluyan, ya que contienen MIME types (en-US) de los archivos de vídeo y los navegadores pueden leerlos y omitir inmediatamente los vídeos que no tienen. Si no estan incluidos, los navegadores cargarán e intentarán reproducir cada archivo hasta que encuentren uno que funcione, lo que llevará aún más tiempo y recursos.

Nota: Nuestro articulo sobre soporte de formatos multimedia (en-US) contiene algunos de los habituales MIME types (en-US).


    3.-  Atributos de la etiqueta HTML "<video"

    autoplay: atributo booleano; si se especifica, el video comenzará a reproducirse automáticamente tan pronto como sea posible,
              sin detenerse para terminar de cargar los datos.

    buffered:  atributo que se puede leer (read only) para determinar qué "intervalos de tiempo" del multimedia se han
               almacenado en búfer. Este atributo contiene un objeto: "TimeRanges"

    controls:  atributo booleano;  si se especifica, se mostraran "controles" para permitir que el usuario controle la
               reproducción de video, incluyendo volumen, búsqueda y pausar/reanudar reproducción.

    loop:  atributo booleano; si se especifica, al alcanzar el final del video, buscaremos automáticamente hasta el principio.

    preload:  se utiliza para almacenar en "búfer" archivos grandes.

              Es un atributo enumerado que proporciona una sugerencia al navegador sobre qué cree el autor que llevará a la
              mejor experiencia para el usuario. Puede tener uno de los siguientes valores:

              none: sugiere bien que el autor cree que el usuario no tendrá que consultar ese video, bien que el servidor
                    desea minimizar su tráfico; es decir, esta sugerencia indica que no se debe almacenar en caché este video.

              metadatos: sugiere que aunque el autor piensa que el usuario no tendrá que consultar este video, es razonable
                         capturar los metadatos (p. ej. longitud).

              auto: sugiere que el usuario necesita tener prioridad; es decir, esta sugerencia indica que, si es necesario,
                    se puede descargar el video completo, incluso aunque el usuario no vaya a usarlo.

              la cadena vacía: que es un sinónimo del valor auto.

    poster: Una URL que indica un "marco de póster" (una imagen) para mostrar el resultado hasta que el usuario reproduzca
            o busque. La "URL" de una "imagen" que se mostrará antes de reproducir el vídeo.

            Está destinado a ser utilizado para una pantalla de presentación o pantalla publicitaria (miniatura del vídeo).
            Si este atributo no se especifica, no se muestra nada hasta que el primer cuadro está disponible, entonces se
            muestra el primer marco como el marco de póster.

    height:  La altura del área de visualización del vídeo en píxeles CSS (tambien se puede hacer directamente en CSS)

    width:  La anchura del área de visualización del vídeo en píxeles CSS (tambien se puede hacer directamente en CSS)

    src:  atributo con un string de la "URL" del vídeo que se va a insertar. Es opcional; podrás optar, en su lugar, por
          el elemento HTML: "<source>" dentro del bloque de vídeo para especificar el video que se va a incrustar.


    4.-  Vídeo HTML: métodos, propiedades y eventos.

    El HTML DOM define métodos, propiedades y eventos para el elemento "<video>".

    Esto permite cargar el video, reproducir y pausarlo, así como configurar la duración y el volumen.

    También hay eventos DOM que pueden notificarle cuando un video comienza a reproducirse, se detiene, etc.
*/

////    HTML Audio/Video DOM Reference
/*

    El DOM de HTML5 tiene "métodos", "propiedades" y "eventos" para los elementos HTML multimedia: <audio>y <video>.

    1.-  Métodos de audio/vídeo HTML

         Method	                      Description

         addTextTrack()	              Adds a new text track to the audio/video

         canPlayType()	              Checks if the browser can play the specified audio/video type

         load()	                      Re-loads the audio/video element

         play()	                      Starts playing the audio/video

         pause()	                    Pauses the currently playing audio/video


    2.-  Propiedades de audio/vídeo HTML.

        Property	                    Description

        audioTracks	                  Returns an AudioTrackList object representing available audio tracks

        autoplay	                    Sets or returns whether the audio/video should start playing as soon as it is loaded

        buffered	                    Returns a TimeRanges object representing the buffered parts of the audio/video

        controller	                  Returns the MediaController object representing the current media controller of the
                                      audio/video

        controls	                    Sets or returns whether the audio/video should display controls (like play/pause etc.)

        crossOrigin	                  Sets or returns the CORS settings of the audio/video

        currentSrc	                  Returns the URL of the current audio/video

        currentTime	                  Sets or returns the current playback position in the audio/video (in seconds)

        defaultMuted	                Sets or returns whether the audio/video should be muted by default

        defaultPlaybackRate	          Sets or returns the default speed of the audio/video playback

        duration	                    Returns the length of the current audio/video (in seconds)

        ended	                        Returns whether the playback of the audio/video has ended or not

        error	                        Returns a MediaError object representing the error state of the audio/video

        loop	                        Sets or returns whether the audio/video should start over again when finished

        mediaGroup	                  Sets or returns the group the audio/video belongs to (used to link multiple audio/video
                                      elements)

        muted	                        Sets or returns whether the audio/video is muted or not

        networkState	                Returns the current network state of the audio/video

        paused	                      Returns whether the audio/video is paused or not

        playbackRate	                Sets or returns the speed of the audio/video playback

        played	                      Returns a TimeRanges object representing the played parts of the audio/video

        preload	                      Sets or returns whether the audio/video should be loaded when the page loads

        readyState	                  Returns the current ready state of the audio/video

        seekable	                    Returns a TimeRanges object representing the seekable parts of the audio/video

        seeking	                      Returns whether the user is currently seeking in the audio/video

        src	                          Sets or returns the current source of the audio/video element

        startDate	                    Returns a Date object representing the current time offset

        textTracks	                  Returns a TextTrackList object representing the available text tracks

        videoTracks	                  Returns a VideoTrackList object representing the available video tracks

        volume	                      Sets or returns the volume of the audio/video


    3.-  Eventos de audio/vídeo HTML

        Event	                        Description

        abort	                        Fires when the loading of an audio/video is aborted

        canplay	                      Fires when the browser can start playing the audio/video

        canplaythrough	              Fires when the browser can play through the audio/video without stopping for buffering

        durationchange	              Fires when the duration of the audio/video is changed

        emptied	                      Fires when the current playlist is empty

        ended	                        Fires when the current playlist is ended

        error	                        Fires when an error occurred during the loading of an audio/video

        loadeddata	                  Fires when the browser has loaded the current frame of the audio/video

        loadedmetadata	              Fires when the browser has loaded meta data for the audio/video

        loadstart	                    Fires when the browser starts looking for the audio/video

        pause	                        Fires when the audio/video has been paused

        play	                        Fires when the audio/video has been started or is no longer paused

        playing	                      Fires when the audio/video is playing after having been paused or stopped for buffering

        progress	                    Fires when the browser is downloading the audio/video

        ratechange	                  Fires when the playing speed of the audio/video is changed

        seeked	                      Fires when the user is finished moving/skipping to a new position in the audio/video

        seeking	                      Fires when the user starts moving/skipping to a new position in the audio/video

        stalled	                      Fires when the browser is trying to get media data, but data is not available

        suspend	                      Fires when the browser is intentionally not getting media data

        timeupdate	                  Fires when the current playback position has changed

        volumechange	                Fires when the volume has been changed

        waiting	                      Fires when the video stops because it needs to buffer the next frame
*/

////    Video and Audio APIs
/*
    HTML viene con elementos (etiquetas HTML) para incrustar medios enriquecidos en documentos, "<video>" y "<audio>"
    que a su vez vienen con sus "propias APIs" para controlar la reproducción, la búsqueda, etc. Este artículo le muestra 
    cómo realizar tareas comunes, como crear controles de reproducción personalizados.

    1.-  El vídeo y audio en HTML.

    Los elementos HTML: <video> y <audio> nos permiten "incrustar" (cargar y reproducir) contenido multimedia video y audio 
    en páginas web. Una implementación típica se ve así:

      <video controls autoplay muted>
        <source src="rabbit320.mp4" type="video/mp4" />
        <source src="rabbit320.webm" type="video/webm" />
        <p>
          Your browser doesn't support HTML video.
        </p>
      </video>

    Esto crea un "reproductor de video" standard dentro del navegador así:

    El atributo "controls" habilita el conjunto predeterminado de controles de reproducción. Si no especifica, no se obtiene 
    en la visualizacion del elemento "<video>" controles de reproducción.

    Nota.-  Esto no es inmediatamente útil para la reproducción de video, pero tiene desventajas. Un gran problema con los 
            controles nativos es que son diferentes en cada navegador, ¡no es muy bueno para la compatibilidad con navegadores! Otro gran problema es que los controles nativos en la mayoría de los navegadores no son muy accesibles desde el teclado.

            Puede resolver estos problemas "ocultando los controles nativos" (eliminando el atributo: "controls") y programando
            los suyos propios con HTML, CSS y JavaScript. 


    2.-  La API HTML MediaElement
Como parte de la especificación HTML, la HTMLMediaElementAPI proporciona funciones que le permiten controlar los reproductores de video y audio mediante programación, por ejemplo HTMLMediaElement.play(), HTMLMediaElement.pause(), etc. Esta interfaz está disponible para los elementos <audio>y <video>, ya que las funciones que querrá implementar son casi idénticas. Veamos un ejemplo, agregando funciones a medida que avanzamos.

Nuestro ejemplo terminado se verá (y funcionará) de la siguiente manera:


Empezando
Para comenzar con este ejemplo, descargue nuestro media-player-start.zip y descomprímalo en un nuevo directorio en su disco duro. Si descargó nuestro repositorio de ejemplos , lo encontrará en javascript/apis/video-audio/start/.

En este punto, si carga el HTML, debería ver un reproductor de video HTML perfectamente normal, con los controles nativos representados.

Explorando el HTML
Abra el archivo de índice HTML. Verá una serie de características; el HTML está dominado por el reproductor de video y sus controles:

<div class="player">
  <video controls>
    <source src="video/sintel-short.mp4" type="video/mp4" />
    <source src="video/sintel-short.webm" type="video/webm" />
    <!-- fallback content here -->
  </video>
  <div class="controls">
    <button class="play" data-icon="P" aria-label="play pause toggle"></button>
    <button class="stop" data-icon="S" aria-label="stop"></button>
    <div class="timer">
      <div></div>
      <span aria-label="timer">00:00</span>
    </div>
    <button class="rwd" data-icon="B" aria-label="rewind"></button>
    <button class="fwd" data-icon="F" aria-label="fast forward"></button>
  </div>
</div>
Copiar al portapapeles
Todo el jugador está envuelto en un <div>elemento, por lo que se puede diseñar como una sola unidad si es necesario.
El <video>elemento contiene dos <source>elementos para que se puedan cargar diferentes formatos dependiendo del navegador que esté viendo el sitio.
El HTML de los controles es probablemente el más interesante:
Tenemos cuatro <button>s: reproducción/pausa, parada, rebobinado y avance rápido.
Cada uno <button>tiene un classnombre, un data-iconatributo para definir qué ícono debe mostrarse en cada botón (le mostraremos cómo funciona esto en la sección a continuación) y un aria-labelatributo para proporcionar una descripción comprensible de cada botón, ya que no proporcionamos un etiqueta legible por humanos dentro de las etiquetas. aria-labelLos lectores de pantalla leen el contenido de los atributos cuando sus usuarios se enfocan en los elementos que los contienen.
También hay un temporizador <div>, que informará el tiempo transcurrido cuando se reproduce el video. Solo por diversión, proporcionamos dos mecanismos de informes: uno <span>que contiene el tiempo transcurrido en minutos y segundos, y otro adicional <div>que usaremos para crear una barra indicadora horizontal que se alarga a medida que transcurre el tiempo. Para tener una idea de cómo se verá el producto terminado, consulte nuestra versión terminada .
Explorando el CSS
Ahora abra el archivo CSS y eche un vistazo al interior. El CSS del ejemplo no es demasiado complicado, pero aquí destacaremos las partes más interesantes. En primer lugar, observe el .controlsestilo:

.controls {
  visibility: hidden;
  opacity: 0.5;
  width: 400px;
  border-radius: 10px;
  position: absolute;
  bottom: 20px;
  left: 50%;
  margin-left: -200px;
  background-color: black;
  box-shadow: 3px 3px 5px black;
  transition: 1s all;
  display: flex;
}

.player:hover .controls,
.player:focus-within .controls {
  opacity: 1;
}
Copiar al portapapeles
Comenzamos con la visibilityconfiguración de los controles personalizados en hidden. En nuestro JavaScript más adelante, estableceremos los controles en visibley eliminaremos el controlsatributo del <video>elemento. Esto es para que, si JavaScript no se carga por alguna razón, los usuarios aún puedan usar el video con los controles nativos.
Le damos a los controles un opacityvalor de 0.5 por defecto, para que distraigan menos cuando intenta ver el video. Solo cuando se desplaza o se enfoca sobre el reproductor, los controles aparecen con opacidad total.
Distribuimos los botones dentro de la barra de control usando Flexbox ( display: flex), para facilitar las cosas.
A continuación, veamos los iconos de nuestros botones:

@font-face {
  font-family: "HeydingsControlsRegular";
  src: url("fonts/heydings_controls-webfont.eot");
  src: url("fonts/heydings_controls-webfont.eot?#iefix") format("embedded-opentype"),
    url("fonts/heydings_controls-webfont.woff") format("woff"),
    url("fonts/heydings_controls-webfont.ttf") format("truetype");
  font-weight: normal;
  font-style: normal;
}

button:before {
  font-family: HeydingsControlsRegular;
  font-size: 20px;
  position: relative;
  content: attr(data-icon);
  color: #aaa;
  text-shadow: 1px 1px 0px black;
}
Copiar al portapapeles
En primer lugar, en la parte superior del CSS usamos un @font-facebloque para importar una fuente web personalizada. Esta es una fuente de ícono: todos los caracteres del alfabeto equivalen a íconos comunes que quizás desee usar en una aplicación.

A continuación, usamos el contenido generado para mostrar un icono en cada botón:

Usamos el ::beforeselector para mostrar el contenido antes de cada <button>elemento.
Usamos la contentpropiedad para establecer que el contenido que se mostrará en cada caso sea igual al contenido del data-iconatributo. En el caso de nuestro botón de reproducción, data-iconcontiene una "P" mayúscula.
Aplicamos la fuente web personalizada a nuestros botones usando font-family. En esta fuente, "P" es en realidad un ícono de "reproducir", por lo tanto, el botón de reproducción tiene un ícono de "reproducir".
Las fuentes de íconos son geniales por muchas razones: reducen las solicitudes HTTP porque no necesita descargar esos íconos como archivos de imagen, gran escalabilidad y el hecho de que puede usar propiedades de texto para darles estilo, como colory text-shadow.

Por último, pero no menos importante, veamos el CSS del temporizador:

.timer {
  line-height: 38px;
  font-size: 10px;
  font-family: monospace;
  text-shadow: 1px 1px 0px black;
  color: white;
  flex: 5;
  position: relative;
}

.timer div {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.2);
  left: 0;
  top: 0;
  width: 0;
  height: 38px;
  z-index: 2;
}

.timer span {
  position: absolute;
  z-index: 3;
  left: 19px;
}
Copiar al portapapeles
Configuramos el .timerelemento externo para que tenga flex: 5, por lo que ocupa la mayor parte del ancho de la barra de controles. También le damos , para que podamos colocar los elementos dentro de él convenientemente según sus límites, y no los límites del elemento.position: relative<body>
El interior <div>está absolutamente posicionado para sentarse directamente sobre el exterior <div>. También se le da un ancho inicial de 0, por lo que no puede verlo en absoluto. A medida que se reproduce el video, el ancho se incrementará a través de JavaScript a medida que transcurre el video.
El <span>también está absolutamente posicionado para sentarse cerca del lado izquierdo de la barra del temporizador.
También le damos a nuestro interno <div>y <span>la cantidad correcta de z-indexpara que el temporizador se muestre en la parte superior y el interno <div>debajo de eso. De esta manera, nos aseguramos de que podemos ver toda la información: una casilla no oscurece a otra.
Implementando el JavaScript
Ya tenemos una interfaz HTML y CSS bastante completa; ahora solo tenemos que conectar todos los botones para que los controles funcionen.

Cree un nuevo archivo JavaScript en el mismo nivel de directorio que su archivo index.html. Llámalo custom-player.js_
En la parte superior de este archivo, inserte el siguiente código:
const media = document.querySelector('video');
const controls = document.querySelector('.controls');

const play = document.querySelector('.play');
const stop = document.querySelector('.stop');
const rwd = document.querySelector('.rwd');
const fwd = document.querySelector('.fwd');

const timerWrapper = document.querySelector('.timer');
const timer = document.querySelector('.timer span');
const timerBar = document.querySelector('.timer div');
Copiar al portapapeles
Aquí estamos creando constantes para contener referencias a todos los objetos que queremos manipular. Tenemos tres grupos:
El <video>elemento y la barra de controles.
Los botones de reproducción/pausa, parada, rebobinado y avance rápido.
El envoltorio del temporizador exterior <div>, la lectura del temporizador digital <span>y el interior <div>que se ensancha a medida que transcurre el tiempo.
A continuación, inserte lo siguiente en la parte inferior de su código:
media.removeAttribute('controls');
controls.style.visibility = 'visible';
Copiar al portapapeles
Estas dos líneas eliminan los controles predeterminados del navegador del video y hacen visibles los controles personalizados.
Reproducir y pausar el video
Implementemos probablemente el control más importante: el botón de reproducción/pausa.

En primer lugar, agregue lo siguiente al final de su código, para que la playPauseMedia()función se invoque cuando se haga clic en el botón de reproducción:
play.addEventListener('click', playPauseMedia);
Copiar al portapapeles
Ahora para definir playPauseMedia(), agregue lo siguiente, nuevamente en la parte inferior de su código:
function playPauseMedia() {
  if (media.paused) {
    play.setAttribute('data-icon','u');
    media.play();
  } else {
    play.setAttribute('data-icon','P');
    media.pause();
  }
}
Copiar al portapapeles
Aquí usamos una ifdeclaración para verificar si el video está en pausa. La HTMLMediaElement.pausedpropiedad devuelve verdadero si los medios están en pausa, que es cualquier momento en que el video no se está reproduciendo, incluso cuando se establece en 0 de duración después de que se carga por primera vez. Si está en pausa, establecemos el data-iconvalor del atributo en el botón de reproducción en "u", que es un icono "en pausa", e invocamos el HTMLMediaElement.play()método para reproducir los medios. En el segundo clic, el botón volverá a alternar: el ícono "reproducir" se mostrará nuevamente y el video se pausará con HTMLMediaElement.pause().
Deteniendo el video
A continuación, agreguemos la funcionalidad para manejar la detención del video. Agregue las siguientes addEventListener()líneas debajo de la anterior que agregó:
stop.addEventListener('click', stopMedia);
media.addEventListener('ended', stopMedia);
Copiar al portapapeles
El clickevento es obvio: queremos detener el video ejecutando nuestra stopMedia()función cuando se hace clic en el botón de detener. Sin embargo, también queremos detener el video cuando termine de reproducirse; esto está marcado por la endedactivación del evento, por lo que también configuramos un oyente para ejecutar la función en la activación de ese evento.
A continuación, definamos stopMedia(): agregue la siguiente función a continuación playPauseMedia():
function stopMedia() {
  media.pause();
  media.currentTime = 0;
  play.setAttribute('data-icon','P');
}
Copiar al portapapeles
no hay ningún stop()método en la API de HTMLMediaElement: el equivalente es pause()el video y establezca su currentTimepropiedad en 0. Al establecer currentTimeun valor (en segundos), los medios saltan inmediatamente a esa posición. Todo lo que queda por hacer después de eso es configurar el icono que se muestra en el icono "reproducir". Independientemente de si el video estaba en pausa o reproduciéndose cuando se presiona el botón de detener, desea que esté listo para reproducirse después.
Buscando de ida y vuelta
Hay muchas maneras de implementar la funcionalidad de rebobinado y avance rápido; aquí te mostramos una forma relativamente compleja de hacerlo, que no se rompe cuando se presionan los diferentes botones en un orden inesperado.

En primer lugar, añade las siguientes dos addEventListener()líneas debajo de las anteriores:
rwd.addEventListener('click', mediaBackward);
fwd.addEventListener('click', mediaForward);
Copiar al portapapeles
Ahora pasemos a las funciones del controlador de eventos: agregue el siguiente código debajo de sus funciones anteriores para definir mediaBackward()y mediaForward():
let intervalFwd;
let intervalRwd;

function mediaBackward() {
  clearInterval(intervalFwd);
  fwd.classList.remove('active');

  if (rwd.classList.contains('active')) {
    rwd.classList.remove('active');
    clearInterval(intervalRwd);
    media.play();
  } else {
    rwd.classList.add('active');
    media.pause();
    intervalRwd = setInterval(windBackward, 200);
  }
}

function mediaForward() {
  clearInterval(intervalRwd);
  rwd.classList.remove('active');

  if (fwd.classList.contains('active')) {
    fwd.classList.remove('active');
    clearInterval(intervalFwd);
    media.play();
  } else {
    fwd.classList.add('active');
    media.pause();
    intervalFwd = setInterval(windForward, 200);
  }
}
Copiar al portapapeles
Notará que primero, inicializamos dos variables, intervalFwdy intervalRwdmás adelante descubrirá para qué sirven. Pasemos a través mediaBackward()(la funcionalidad para mediaForward()es exactamente la misma, pero a la inversa):
Borramos las clases y los intervalos que están configurados en la función de avance rápido; hacemos esto porque si presionamos el rwdbotón después de presionar el fwdbotón, queremos cancelar cualquier función de avance rápido y reemplazarla con la función de rebobinado. Si tratáramos de hacer las dos cosas a la vez, el reproductor se rompería.
Usamos una ifdeclaración para verificar si la activeclase se ha establecido en el rwdbotón, lo que indica que ya se presionó. Es classListuna propiedad bastante útil que existe en cada elemento: contiene una lista de todas las clases establecidas en el elemento, así como métodos para agregar/eliminar clases, etc. Usamos el método para verificar si classList.contains()la lista contiene la activeclase. Esto devuelve un resultado true/ booleano false.
Si activese configuró en el rwdbotón, lo eliminamos usando classList.remove(), borramos el intervalo que se configuró cuando se presionó el botón por primera vez (vea más abajo para obtener más explicaciones) y usamos HTMLMediaElement.play()para cancelar el rebobinado y comenzar a reproducir el video normalmente.
Si aún no se ha configurado, agregamos la activeclase al rwdbotón usando classList.add(), pausamos el video usando HTMLMediaElement.pause()y luego configuramos la intervalRwdvariable para que sea igual a una setInterval()llamada. Cuando se invoca, setInterval()crea un intervalo activo, lo que significa que ejecuta la función dada como primer parámetro cada x milisegundos, donde x es el valor del segundo parámetro. Así que aquí estamos ejecutando la windBackward()función cada 200 milisegundos: usaremos esta función para retroceder el video constantemente. Para detener una setInterval()ejecución, hay que llamar a clearInterval(), dándole el nombre identificativo del intervalo a borrar, que en este caso es el nombre de la variable intervalRwd(ver la clearInterval()llamada anterior en la función).
Finalmente, necesitamos definir las funciones windBackward()y windForward()invocadas en las setInterval()llamadas. Agregue lo siguiente debajo de sus dos funciones anteriores:
function windBackward() {
  if (media.currentTime <= 3) {
    rwd.classList.remove('active');
    clearInterval(intervalRwd);
    stopMedia();
  } else {
    media.currentTime -= 3;
  }
}

function windForward() {
  if (media.currentTime >= media.duration - 3) {
    fwd.classList.remove('active');
    clearInterval(intervalFwd);
    stopMedia();
  } else {
    media.currentTime += 3;
  }
}
Copiar al portapapeles
Nuevamente, revisaremos la primera de estas funciones, ya que funcionan casi de manera idéntica, pero al revés. Hacemos windBackward()lo siguiente: tenga en cuenta que cuando el intervalo está activo, esta función se ejecuta una vez cada 200 milisegundos.
Comenzamos con una ifdeclaración que verifica si el tiempo actual es inferior a 3 segundos, es decir, si retroceder otros tres segundos lo llevaría al inicio del video. Esto provocaría un comportamiento extraño, por lo que, si este es el caso, detenemos la reproducción del video llamando a stopMedia(), eliminamos la activeclase del botón de rebobinado y borramos el intervalRwdintervalo para detener la funcionalidad de rebobinado. Si no hiciéramos este último paso, el video seguiría rebobinándose para siempre.
Si la hora actual no está dentro de los 3 segundos del inicio del video, eliminamos tres segundos de la hora actual ejecutando media.currentTime -= 3. Entonces, en efecto, estamos rebobinando el video 3 segundos, una vez cada 200 milisegundos.
Actualización del tiempo transcurrido
La última pieza de nuestro reproductor multimedia para implementar son las pantallas de tiempo transcurrido. Para hacer esto, ejecutaremos una función para actualizar las pantallas de tiempo cada vez que timeupdatese active el evento en el <video>elemento. La frecuencia con la que se activa este evento depende de su navegador, la potencia de la CPU, etc. ( consulte esta publicación de StackOverflow ).

Agregue la siguiente addEventListener()línea justo debajo de las otras:

media.addEventListener('timeupdate', setTime);
Copiar al portapapeles
Ahora a definir la setTime()función. Agregue lo siguiente al final de su archivo:

function setTime() {
  const minutes = Math.floor(media.currentTime / 60);
  const seconds = Math.floor(media.currentTime - minutes * 60);

  const minuteValue = minutes.toString().padStart(2, '0');
  const secondValue = seconds.toString().padStart(2, '0');

  const mediaTime = `${minuteValue}:${secondValue}`;
  timer.textContent = mediaTime;

  const barLength = timerWrapper.clientWidth * (media.currentTime/media.duration);
  timerBar.style.width = `${barLength}px`;
}
Copiar al portapapeles
Esta es una función bastante larga, así que analicémosla paso a paso:

En primer lugar, calculamos la cantidad de minutos y segundos en el HTMLMediaElement.currentTimevalor.
Luego inicializamos dos variables más: minuteValuey secondValue. Solemos padStart()hacer que cada valor tenga 2 caracteres, incluso si el valor numérico es solo un dígito.
El valor de tiempo real para mostrar se establece como minuteValuemás un carácter de dos puntos más secondValue.
El Node.textContentvalor del temporizador se establece en el valor de tiempo, por lo que se muestra en la interfaz de usuario.
La longitud en la que debemos establecer el interior <div>se calcula calculando primero el ancho del exterior <div>(la propiedad de cualquier elemento clientWidthcontendrá su longitud), y luego multiplicándolo por el HTMLMediaElement.currentTimedividido por el total HTMLMediaElement.durationde los medios.
Establecemos el ancho del interior <div>para que sea igual a la longitud de la barra calculada, más "px", por lo que se establecerá en esa cantidad de píxeles.
Arreglando reproducción y pausa
Queda un problema por solucionar. Si se presionan los botones reproducir/pausar o detener mientras la funcionalidad de rebobinado o avance rápido está activa, simplemente no funcionarán. ¿Cómo podemos solucionarlo para que cancelen la funcionalidad del botón rwd/ fwdy reproduzcan/detengan el video como se esperaba? Esto es bastante fácil de arreglar.

En primer lugar, agregue las siguientes líneas dentro de la stopMedia()función; cualquier lugar servirá:

rwd.classList.remove('active');
fwd.classList.remove('active');
clearInterval(intervalRwd);
clearInterval(intervalFwd);
Copiar al portapapeles
Ahora agregue las mismas líneas nuevamente, al comienzo de la playPauseMedia()función (justo antes del comienzo de la ifdeclaración).

En este punto, podría eliminar las líneas equivalentes de las funciones windBackward()y windForward(), ya que esa funcionalidad se implementó en la stopMedia()función.

Nota: También podría mejorar aún más la eficiencia del código creando una función separada que ejecute estas líneas, y luego llamarla en cualquier lugar que sea necesario, en lugar de repetir las líneas varias veces en el código. Pero eso te lo dejamos a ti.

Resumen
Creo que te hemos enseñado suficiente en este artículo. La HTMLMediaElementAPI ofrece una gran cantidad de funciones para crear reproductores de audio y video simples, y eso es solo la punta del iceberg. Consulte la sección "Ver también" a continuación para obtener enlaces a funciones más complejas e interesantes.

Aquí hay algunas sugerencias de formas en que podría mejorar el ejemplo existente que hemos creado:

La visualización de la hora actualmente se interrumpe si el video dura una hora o más (bueno, no mostrará las horas, solo minutos y segundos). ¿Puedes averiguar cómo cambiar el ejemplo para que muestre las horas?
Debido a que <audio>los elementos tienen la misma HTMLMediaElementfuncionalidad disponible para ellos, podría fácilmente hacer que este reproductor <audio>también funcione para un elemento. Intenta hacerlo.
¿Puede encontrar una manera de convertir el <div>elemento interno del temporizador en una verdadera barra de búsqueda/desplazamiento, es decir, cuando hace clic en algún lugar de la barra, salta a esa posición relativa en la reproducción de video? Como sugerencia, puede encontrar los valores X e Y de los lados izquierdo/derecho y superior/inferior del elemento a través del getBoundingClientRect()método, y puede encontrar las coordenadas de un clic del mouse a través del objeto de evento del evento de clic, llamado en el Documentobjeto. Por ejemplo:
document.onclick = function(e) {
  console.log(e.x, e.y);
}

*/
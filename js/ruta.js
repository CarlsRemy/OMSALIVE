
function initMap() {


  let Rute;
  let RuteEnd;
  let name1;
  let name2;


  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const Ruta = urlParams.get('ruta') || 1;

  if (Ruta == 1) {
    /**   Oficina Omsa / UASD **/
    Rute = { lat: 19.48906106526994, lng: -70.71721851843783 };
    RuteEnd = {
      lat: 19.42643365555118, lng: - 70.73006629979726
    };

    name1 = "Oficina Omsa";
    name2 = "UASD";
  }
  else {
    /**    Avenida 27 De Febrero Y Calle 1 / Carretera Gregorio Luperon calle 20 **/

    Rute = { lat: 19.48731078142793, lng: -70.7190194361155 };
    RuteEnd = { lat: 19.42643365555118, lng: -70.6590110389465 };

    name1 = "Avenida 27 De Febrero Y Calle 1 ";
    name2 = "Carretera Gregorio Luperon calle 20";
  }



  // The location of Uluru
  const uluru = { lat: 19.472856977725773, lng: -70.69266546175004 };

  // The map, centered at Uluru
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 24,
    center: uluru,
  });


  let marker = new google.maps.Marker({
    position: Rute,
    map: map,
    title: name1
  }, {
    position: RuteEnd,
    map: map,
    title: name2
  });

  marker.setMap(map);
  const directionsService = new google.maps.DirectionsService();

  const directionsRenderer = new google.maps.DirectionsRenderer({
    map: map,
    zoom: 45, // Zoom deseado
    center: uluru
  });


  // directionsRenderer.setMap(map);

  const request = {
    origin: Rute, // latitud y longitud de ciudad de origen
    destination: RuteEnd, // latitud y longitud de ciudad de destino
    travelMode: google.maps.TravelMode.TRANSIT,
  };

  directionsService.route(request, function (result, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsRenderer.setDirections(result);

      // obtener límites de la ruta
      const bounds = new google.maps.LatLngBounds();
      const route = result.routes[0].legs[0];
      bounds.extend(route.start_location);
      bounds.extend(route.end_location);
      map.fitBounds(bounds);

      document.getElementById("map").setAttribute("style", "");
    }
  });

}



(() => {


  initMap();


  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBnKRkIBBk21MBSZygXCMUKv0sVHR4Tfes",
    authDomain: "fir-e76ac.firebaseapp.com",
    projectId: "fir-e76ac",
    storageBucket: "fir-e76ac.appspot.com",
    messagingSenderId: "172069873295",
    appId: "1:172069873295:web:69d0d74e62b27bc6d9f2fa",
    measurementId: "G-KX7V4QZ40J"
  };

  firebase.initializeApp(firebaseConfig);



  // Verificamos si el navegador soporta notificaciones
  if ('Notification' in window) {


    new Promise((resolve, reject) => {
      // Solicitamos permiso al usuario para mostrar notificaciones

      Notification.requestPermission().then(function (permission) {
        if (permission === 'granted') {

          resolve()
          // Aquí puedes registrar el servicio de mensajería de Firebase
        } else if (permission === 'denied') {
          reject('Permiso para notificaciones denegado.');
        } else if (permission === 'default') {
          reject('El usuario cerró el cuadro de diálogo de permiso.');
        }
      });

    }).then(() => {

      // Obtiene una instancia de Firebase Messaging
      const messaging = firebase.messaging();

      // Solicita el permiso para recibir notificaciones
      messaging.requestPermission().then(() => {
        alert('Permiso concedido')
        console.log('Permiso concedido');

        // Obtiene el token de registro del dispositivo

        // Registramos un callback para recibir los mensajes
        messaging.onMessage((payload) => {
          console.log('Mensaje recibido:', payload);
          // Aquí puedes hacer lo que necesites con el mensaje recibido
        });

        messaging.getToken().then((token) => {
          console.log('Token de registro:', token);

          // Envía el mensaje a través de la API de FCM
          const data = {
            to: token,
            notification: {
              title: 'Título del mensaje',
              body: 'Contenido del mensaje'
            }
          };

          fetch('https://fcm.googleapis.com/fcm/send', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'key=<AIzaSyBnKRkIBBk21MBSZygXCMUKv0sVHR4Tfes>'
            },
            body: JSON.stringify(data)
          }).then(() => {
            console.log('Mensaje enviado');
          }).catch((error) => {
            console.error('Error al enviar el mensaje:', error);
          });
        });
      }).catch((error) => {
        console.error('Error al solicitar el permiso:', error);
      });
    }).catch((mensaje) => {
      console.warn(mensaje);

    });


  } else {
    console.warn('Este navegador no soporta notificaciones.');
  }



})()
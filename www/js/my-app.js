
// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

var app = new Framework7({
  // App root element
  root: '#app',
  // App Name
  name: 'My App',
  // App id
  id: 'com.myapp.test',
  // Enable swipe panel
  panel: {
    swipe: 'left',
  },
  // Add default routes
  routes: [
    {
      path: '/about/',
      url: 'about.html',
    },
    {
      path: '/index/',
      url: 'index.html',
    },
    {
      path: '/paginaPrincipal1/',
      url: 'paginaPrincipal1.html',
    },
    {
      path: '/paginaPrincipal2/',
      url: 'paginaPrincipal2.html',
    },
    {
      path: '/crearArticulos/',
      url: 'creararticulos.html',
    },
    {
      path: '/ingresarArticulos/',
      url: 'ingresararticulos.html',
    },
    {
      path: '/crearEtiquetasProductos/',
      url: 'crearEtiquetasProductos.html',
    },
    {
      path: '/crearEtiquetasEnvios/',
      url: 'crearEtiquetasEnvios.html',
    },
  ]
  // ... other parameters
});

var mainView = app.views.create('.view-main');
var email;

$$("#loginAPP").on("click", loginApp);

/* 
$$('#loginAPP').on('click', function () {

  var email = $$('#emailIN').val();
  var password = $$('#passwordIN').val();

  //var email = "usuario@dominio.com";
  // var password = "12345678";


  //esta funcion hace el SignIn Email Password
  firebase.auth().signInWithEmailAndPassword(email, password).then(function () {
    mainView.router.navigate("/about/");
  }).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    alert('el error fue: ' + errorMessage);
    // ...
  })

});
*/


$$('#volverAsignIN').on('click', function () {
  $$('#formRegistrarUser').removeClass("display-block"); $$('#formRegistrarUser').addClass("display-none");
  $$('#formValidarUser').removeClass("display-none"); $$('#formValidarUser').addClass("display-block");
})

$$('#irAregistrase').on('click', function () {
  $$('#formValidarUser').removeClass("display-block"); $$('#formValidarUser').addClass("display-none");
  $$('#formRegistrarUser').removeClass("display-none"); $$('#formRegistrarUser').addClass("display-block");
})

$$("#registrarUser").on('click', RegistrarUser);



// Handle Cordova Device Ready Event
$$(document).on('deviceready', function () {
  console.log("Device is ready!");






  // esto crea una coleccion en la db
  var db = firebase.firestore();
  var stock = 8;
  stock++;

  var articulos = db.collection("articulos");
  var miID = "12345";

  datosArticulos = {
    id_articulo: "13",
    ean: "54654565465",
    descripcion: "remera verde",
    talles: "XL",
    stock: stock,
    foto: "rutaejemplo/imagen.jpg",
    precio: "777",
    ubicacion: "7b",
    codigoqr: "rutaejemplo/12.pdf",
    medidas: "",
  }

  articulos.doc(miID).set(datosArticulos);
  // esto crea una coleccion en la db

});


// Option 1. Using one 'page:init' handler for all pages
$$(document).on('page:init', function (e) {
  // Do something here when page loaded and initialized
  console.log(e);
})

// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="about"]', function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  console.log(e);

})


function RegistrarUser() {
  if ($$('#passwordCreate').val() === $$('#passwordCreate2').val()) {
    email = $$('#emailCreate').val();
    password = $$('#passwordCreate').val();

    firebase.auth().createUserWithEmailAndPassword(email, password).then(function () {
      console.log("usuario creado correctamente");
      mainView.router.navigate("/paginaPrincipal1/");
    })
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/weak-password') {
          alert('Clave muy débil.');
        } else {
          alert(errorMessage);

        }
        console.log(error);

      });
  } else { alert('las contraseñas no son iguales'); }


}


function loginApp() {
  email = $$('#emailIN').val();
  var password = $$('#passwordIN').val();
  //var email = "usuario@dominio.com";
  // var password = "12345678";
  //esta funcion hace el SignIn Email Password

  firebase.auth().signInWithEmailAndPassword(email, password).then(function () {
    mainView.router.navigate("/paginaPrincipal1/");
  }).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    alert('el error fue: ' + errorMessage);
    // ...
  })
}

function fnReg2() {
  /*
  coleccion: personas
  id: email@email.com
  datos:  nombre: 
          apellido:
          foto(servicio de storage): 
          latitud:
          longitud:
  
  */

  var db = firebase.firestore();
  var colPersonas = db.collection('DatosUsuarios');

  //email
  claveDeColeccion = email;
  nombre = $('#regNombre').val();
  apellido = $('#regApellido').val();

  datosUsuario = {
    nombre: nombre,
    apellido: apellido,
    //foto: mas adelante,
    latitud: 0,
    longitud: 0,
  }

  colPersonas.doc(claveDeColeccion).set(datosUsuario)

    .then(function () {
      mainView.router.navigate("/paginaPrincipal1/");
    })

    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      alert('el error fue: ' + errorMessage);
      // ...
    })
    ;


}
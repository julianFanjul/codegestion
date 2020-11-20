
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
    {
      path: '/generarListaDePrecios/',
      url: 'generarListaDePrecios.html',
    },
    {
      path: '/consultarPrecios/',
      url: 'consultarPrecios.html',
    },
  ]
  // ... other parameters
});




//declaracion de variables globales
var mainView = app.views.create('.view-main');
var email;



var categoriaArticulo = "";
var marcaArticulo = "";
var descripcionArticulo = "";
var EanArticulo = "";
var precioArticulo = 0;
var sucursalUsuario = "sucursal2";
//declaracion de variables globales


$$("#crearArticuloEnBaseDeDatos").on("click", crearArticuloEnBase);



//funcion para crear articulo en base
function crearArticuloEnBase() {
  var db = firebase.firestore();
  descripcionArticulo = $$("#crearDescripcionArticulo").val();
  EanArticulo = $$("#crearEanArticulo").val();
  categoriaArticulo = $$("#crearCategoriaArticulo").val();
  marcaArticulo = $$("#crearMarcaArticulo").val();
  precioArticulo = $$("#crearPrecioArticulo").val();

  console.log('se creo el articulo' + descripcionArticulo + 'en la base');

  var datosArticulos = {
    id_articulo: "133",
    ean: EanArticulo,
    descripcion: descripcionArticulo,
    talles: "XL",
    stock: 8,
    foto: "rutaejemplo/imagen.jpg",
    precio: precioArticulo,
    ubicacion: "7b",
    codigoqr: "rutaejemplo/12.pdf",
    medidas: "",
    usuarioDeCreacion: email,
  }
  db.collection("sucursal").doc(sucursalUsuario).collection("categorias").doc(categoriaArticulo).collection(marcaArticulo).doc(descripcionArticulo).set(datosArticulos);
}
//funcion para crear articulo en base


$$("#loginAPP").on("click", loginApp);
$$("#registrarUser").on('click', RegistrarUser);

// funciones para ir a registrarse o a login
$$('#volverAsignIN').on('click', function () {
  $$('#formRegistrarUser').removeClass("display-block"); $$('#formRegistrarUser').addClass("display-none");
  $$('#formValidarUser').removeClass("display-none"); $$('#formValidarUser').addClass("display-block");
})

$$('#irAregistrase').on('click', function () {
  $$('#formValidarUser').removeClass("display-block"); $$('#formValidarUser').addClass("display-none");
  $$('#formRegistrarUser').removeClass("display-none"); $$('#formRegistrarUser').addClass("display-block");
})
// funciones para ir a registrarse o a login










// Handle Cordova Device Ready Event
$$(document).on('deviceready', function () {
  console.log("Device is ready!");


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

//funcion registrar usuario
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
//funcion registrar usuario

//funcion login app
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
//funcion login app


//funcion para guardar datos usuario *** todavia falta implementar
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
}//funcion para guardar datos usuario *** todavia falta implementar
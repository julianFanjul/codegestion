
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
      path: '/creararticulos/',
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
      path: '/escaneocodigos/',
      url: 'escaneocodigos.html',
    },
    {
      path: '/consultas/',
      url: 'consultas.html',
    },
    {
      path: '/consultas-por-categoria/',
      url: 'consultas-por-categoria.html',
      options: {
        transition: 'f7-circle',
      },
    },
    {
      path: '/consultas-por-descripcion/',
      url: 'consultas-por-descripcion.html',
    },
    {
      path: '/consultas-por-escaneo/',
      url: 'consultas-por-escaneo.html',
    },
    {
      path: '/emitir-pedido/',
      url: 'emitirpedidos.html',
    },
    {
      path: '/consultas-por-id/',
      url: 'consultas-por-id.html',
    },
    {
      path: '/consultas-por-marca/',
      url: 'consultas-por-marca.html',
    },
    {
      path: '/ajustarprecio/',
      url: 'actualizarprecios.html',
    },
  ]
  // ... other parameters
});



//declaracion de variables globales
var mainView = app.views.create('.view-main');
var email;
var id_articulo;

var categoriaArticulo = "";
var marcaArticulo = "";
var descripcionArticulo = "";
var EanArticulo = "";
var precioArticulo = 0;
var sucursalUsuario = "sucursal2";
var tablacompleta = "";
var idGLOBAL;
var categoriasSucursalUser = [];
var marcasSucursalUser = [];
var articulosExistentes = [];
var directionSucursalUser;
var mailSucursalUser;
var telefonoSucursalUser;
var qrwebsucursal = "";
var qrWhatsapp = "";
var pruebasnap = "";
var nombreEmpresa = "";
var cuitdni = "";
var webuser = "";
var id_global_envio = 0;
var paralistadeprecios = "";
var tareasExistentes = [];
var vencimientosTareasExistentes = [];
var id_tarea = 0;
var paralistadepreciosStockYpRECIO = "";
var paralistadepreciosStock = "";
var ReporteElegido = "";
//declaracion de variables globales

var botonAborrar;
function tareaCompletada(id) {
  $$('.buttondelete').on('click', function () {
    botonAborrar = this.id;
    botonAborrar = botonAborrar.toString();
    console.log(botonAborrar);
    var db = firebase.firestore();
    db.collection("sucursal").doc(sucursalUsuario).collection("tareas").doc(botonAborrar).delete()
      .then(function () {
        console.log("Document successfully deleted!");
        $$('#lastareas').html(tareasArealizar);
      }).catch(function (error) {
        console.error("Error removing document: ", error);
      });
  })



}
//funcion generadora qr  

function ingresarNuevaTarea() {
  var tareaCompleta = [];
  function tareaIngresada() {
    return new Promise(resolve => {
      var nuevatarea = prompt('ingresa la nueva tarea');
      var vencimientotarea = prompt('ingresa el vencimiento de la tarea');
      tareaCompleta.push(nuevatarea);
      tareaCompleta.push(vencimientotarea);
      resolve(tareaCompleta);
    });
  }

  async function recogerNuevaTarea() {
    const area = await tareaIngresada();
    console.log(tareaCompleta);
    id_tarea = parseInt(id_tarea)
    id_tarea = id_tarea + 1;
    id_tarea = id_tarea.toString();
    var taresAenviar = {
      tarea: tareaCompleta[0],
      vence: tareaCompleta[1],
      id_tarea: id_tarea
    }


    var db = firebase.firestore();
    db.collection("sucursal").doc(sucursalUsuario).collection("tareas").doc(id_tarea).set(taresAenviar)
      .then(function () {
        console.log('nueva tarea actualizada correctamente');
      })
      .catch(function (error) {
        alert("error al crear el articulo");
      });


    db.collection("sucursal").doc(sucursalUsuario).update
      ({ id_tareas: parseInt(id_tarea) })
      .then(function () {
        console.log("id de articulo actualizado ok");
      })
      .catch(function (error) {
        console.log("Error al cargar id de articulo: " + error);
      });
  }

  recogerNuevaTarea();


}






let codigoBase64;
/*
function generadorQr(id) {
  var id_articulo = id.toString();
  let qrcode = new QRCode("output", {
    text: id_articulo,
    width: 177,
    height: 177,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });

  qrcode._oDrawing._elImage.onload = ev => {
    codigoBase64 = ev.target.src;
    console.log(ev.target.src);
    console.log(codigoBase64);
  }

}
*/

function generadorQr(id) {

  var id_articulo = id.toString();
  let options = {
    width: 256,
    height: 256,
    colorDark: "#000000",
    colorLight: "#ffffff",
  };

  cordova.plugins.qrcodejs.encode('TEXT_TYPE', id_articulo, (base64EncodedQRImage) => {
    codigoBase64 = base64EncodedQRImage;
    console.info('QRCodeJS response is ' + base64EncodedQRImage);
    $$('#output').html('<img src="' + base64EncodedQRImage + '" alt="">');
  }, (err) => {
    console.error('QRCodeJS error is ' + JSON.stringify(err));
  }, options);
}



/*
function generadorQr() {
  var variable = "hola";
  let qrcode = new QRCode("output", {
    text: variable,
    width: 177,
    height: 177,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });


}*/

//funcion generadora qr  



/*var app = {

  // Application Constructor
  initialize: function () {
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
  },

  // deviceready Event Handler
  // Bind any cordova events here. Common events are:
  // 'pause', 'resume', etc.

  onDeviceReady: function () {
    this.receivedEvent('deviceready');
  },



  // Update DOM on a Received Event

  receivedEvent: function (id) {

    var parentElement = document.getElementById('indexx');
    var listeningElement = parentElement.querySelector('.listening');
    var receivedElement = parentElement.querySelector('.received');
    listeningElement.setAttribute('style', 'display:none;');
    receivedElement.setAttribute('style', 'display:block;');

    console.log('Received Event: ' + id);

  }

};


function imprmir2() {
  pdf.fromData('<p>hello</p>', { type: 'share' })
}
app.initialize();


function imprimir() {


  var parentElement = document.getElementById("indexx");
  var listeningElement = parentElement.querySelector('.listening');
  var receivedElement = parentElement.querySelector('.received');

  listeningElement.setAttribute('style', 'display:none;');
  receivedElement.setAttribute('style', 'display:block;');


  // Our code start here
  var opts = {
    type: "share",         //Open a context menu and ask the user what to do next (print, mail, etc..).
    fileName: 'v8-tutorial.pdf' //it will use this filename as a place-holder
  }

  pdf.fromURL('https://cesarvr.io/post/2015-11-20-javascript-v8/', opts)
    .then(() => 'ok')
    .catch((err) => console.err(err))
  pdf.fromData(url, options)

}



var app = {

  // Update DOM on a Received Event



};
*/



function imprimirEtiqEnvio() {

  nombreDestinatario = $$('#etiqdestintario').val();
  dniOcuitDestinatario = $$('#etiqdnicuit').val();
  dnicuiteDestinatario = $$('#etiqdnicuitnumero').val();
  domicilioDestinatario = $$('#etiqdomicilio').val();
  telefonoDestinatario = $$('#etiqtelefono').val();
  localidadDestinatario = $$('#etiqlocalidad').val();
  cpDestinatario = $$('#etiqcp').val();
  provinciaDestinatario = $$('#etiqprovincia').val();
  adicionalesDestinatario = $$('#etiqadicionales').val();
  CantidadetiqDestinatario = parseInt($$('#etiqcantidad').val());



  var etiquetaEnvioHead = '<!DOCTYPE html>' +
    '<html lang="es">' +
    '<head>' +
    '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">' +
    '<link rel="preconnect" href="https://fonts.gstatic.com">' +
    '<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap" rel="stylesheet">' +
    '<title>Etiquetas de envio</title>' +
    '<style>' +
    '* { margin: 0; padding: 0; }' +
    '#contenedorEtiqueta { height: 11.2cm; width: 17cm; margin: 1cm;outline: 1px solid black; display: inline-block; }' +
    '#cabezera { height: 3.5cm; width: 17cm; outline: 1px solid black; display: flex; }' +
    'p { font-size: 20px; }' +
    '#informacionremitente { width: 10cm; height: 3cm; margin-left: 1cm; margin-top: 0.4cm; }' +
    '#logo { margin-left: 0.2cm; height: 3cm; }' +
    '	#cuerpo { width: 17cm; height: 6cm; outline: 1px solid black; display: flex; }' +
    '#footer { height: 2cm; width: 17cm; outline: 1px solid black; }' +
    '	#fragil { width: 2cm; height: 5cm; margin-top: 0.5cm }' +
    '#datosdestinatario {width: 14.5cm; height: 6cm;}' +
    '#destinatario {margin-top: 0.9cm; margin-left: 1cm; padding-right: 1cm;}' +
    '#footer {display: flex; height: 1.7cm;}' +
    '#idenvio { width: 2cm; padding-top: 0.7cm; text-align: center; outline: 1px solid black;}' +
    '#web { width: 12cm; padding-top: 0.6cm; outline: 1px solid black; text-align: center;}' +
    '#qrweb { margin-top: 0.1cm;margin-left: 0.7cm; width: 1.5cm; height: 1.5cm;}' +
    '#qridenvio{width: 3cm;height: 3cm;margin-top: 0.2cm;margin-left: 2cm;}' +
    '</style >' +
    '</head >' +
    '<body body>';
  var etiquetaEnvioBody = '<div id="contenedorEtiqueta">' +
    '<div id="cabezera">' +
    '<div id="informacionremitente">' +
    '<p>REMITENTE: ' + nombreEmpresa + '</p>' +
    '<p>CUIT: ' + cuitdni + '</p>' +
    '<p>DIRECCIÓN: ' + directionSucursalUser + '</p>' +
    '<p>TELÉFONO: ' + telefonoSucursalUser + '</p>' +
    '</div>' +
    '<img src="' + qrwebsucursal + '" alt="" id="qridenvio">' +
    '</div>' +
    '<div id="cuerpo">' +
    '<div id="datosdestinatario">' +
    '<div id="destinatario">' +
    '<p>DESTINATARIO: ' + nombreDestinatario + '</p>' +
    '<p>' + dniOcuitDestinatario + ': ' + dnicuiteDestinatario + '</p>' +
    '<p>DIRECCIÓN: ' + domicilioDestinatario + ' - CP: ' + cpDestinatario + ' - ' + localidadDestinatario + ' - ' + provinciaDestinatario + '</p>' +
    '<p>TELÉFONO: ' + telefonoDestinatario + '</p>' +
    '<p>OBSERVACIONES: ' + adicionalesDestinatario + '</p>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '<div id="footer">' +
    '<div id="idenvio"><b>' + id_global_envio + '</b></div>' +
    '<div id="web">' +
    '<p>' + webuser + '</p>' +
    '</div>' +
    '<img src="' + qrwebsucursal + '" alt="" id="qrweb">' +
    '</div>' +
    '</div>';

  for (let i = 1; i < CantidadetiqDestinatario; i++) {

    etiquetaEnvioBody = etiquetaEnvioBody + '<div id="contenedorEtiqueta">' +
      '<div id="cabezera">' +
      '<div id="informacionremitente">' +
      '<p>REMITENTE: ' + nombreEmpresa + '</p>' +
      '<p>CUIT: ' + cuitdni + '</p>' +
      '<p>DIRECCIÓN: ' + directionSucursalUser + '</p>' +
      '<p>TELÉFONO: ' + telefonoSucursalUser + '</p>' +
      '</div>' +
      '<img src="' + qrwebsucursal + '" alt="" id="qridenvio">' +
      '</div>' +
      '<div id="cuerpo">' +
      '<div id="datosdestinatario">' +
      '<div id="destinatario">' +
      '<p>DESTINATARIO: ' + nombreDestinatario + '</p>' +
      '<p>' + dniOcuitDestinatario + ': ' + dnicuiteDestinatario + '</p>' +
      '<p>DIRECCIÓN: ' + domicilioDestinatario + ' - CP: ' + cpDestinatario + ' - ' + localidadDestinatario + ' - ' + provinciaDestinatario + '</p>' +
      '<p>TELÉFONO: ' + telefonoDestinatario + '</p>' +
      '<p>OBSERVACIONES: ' + adicionalesDestinatario + '</p>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '<div id="footer">' +
      '<div id="idenvio"><b>' + id_global_envio + '</b></div>' +
      '<div id="web">' +
      '<p>' + webuser + '</p>' +
      '</div>' +
      '<img src="' + qrwebsucursal + '" alt="" id="qrweb">' +
      '</div>' +
      '</div>';
  }

  var etiquetaEnvioFooter = '</body>' + '</html>';

  var etiquetaEnvio = etiquetaEnvioHead + etiquetaEnvioBody + etiquetaEnvioFooter;

  pdf.fromData(etiquetaEnvio, { type: 'share' })


}











function elegirTipoConsulta(params) {
  var tipoDeReporte = $$('#tipodereporte').val();
  switch (tipoDeReporte) {
    case "stockprecio":
      ReporteElegido = paralistadepreciosStockYpRECIO;
      console.log('reporte elegido: ' + ReporteElegido);
      break;
    case "stock":
      ReporteElegido = paralistadepreciosStock;
      console.log('reporte elegido: ' + ReporteElegido);
      break;
    case "precio":
      ReporteElegido = paralistadeprecios;
      console.log('reporte elegido: ' + ReporteElegido);
      break;

  }


  imprimir2(3);
}




var qrAimprimir;
var articuloAgenerarEtiqueta;
function buscarParaImprimir() {
  return new Promise(resolve => {
    var db = firebase.firestore();
    query4articulos = db.collection("sucursal").doc(sucursalUsuario).collection("articulos");
    query4articulos.where("descripcion", "==", articuloAgenerarEtiqueta)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          qrAimprimir = doc.data().codigoqr;
          resolve(qrAimprimir);
        });
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  });
}
async function imprimir2(option) {

  if (option == 1) {
    articuloAgenerarEtiqueta = $$('#crearDescripcionArticulo').val();
    cantidadEtiqAimprimir = parseInt($$('#crearStockArticulo').val());
    buscarParaImprimir();
    const imagenEtiqAimprimir = await buscarParaImprimir();

    var seimprime = '<!DOCTYPE html>' +
      '<html lang="en">' +
      '<head>' +
      '<meta charset="utf-8">' +
      '<title>etiqueta de envio</title>' +
      '<style>' +
      '.full {' +
      'width:100%;' +
      'height:100%;' +
      'background-color: white;' +
      'overflow: hidden;' +
      'display: inline-block;' +
      ' }' +
      '.contenedor-etiqueta{' +
      'border: 1px dashed black;' +
      'padding: 34px;' +
      'width: 100px;' +
      'display: inline-block;' +
      'margin: 3px;' +
      '}' +
      '.contenedor-etiqueta img {' +
      'width: 90px;' +
      'display: inline-block;' +
      '}' +
      '#boton{' +
      'display: block;' +
      '}' +
      '</style>' +
      '<script>' +
      'function clonar() {' +
      'for (let index = 1; index <' + cantidadEtiqAimprimir + '; index++) {' +
      'var c = document.getElementById("full");' +
      'var clon = c.cloneNode("full");' +
      'clon.style.width = "100px";' +
      'clon.style.height = "100px";' +
      'document.body.appendChild(clon);' +
      '}}' +
      '</script>' +
      '</head>' +
      '<body class="full" id="contenedor" body onload="clonar()" >' +
      '<div class="contenedor-etiqueta" id="full">' +
      '<img src="' + imagenEtiqAimprimir + '" alt="">' +
      '</div>' +
      '</body>' +
      '</html>';


    pdf.fromData(seimprime, { type: 'share' })


  }
  if (option == 2) {
    articuloAgenerarEtiqueta = $$('#autocomplete-dropdown-descripcion-etiquetas').val();
    cantidadEtiqAimprimir = parseInt($$('#cantidadEtiqAimpmir').val());
    buscarParaImprimir();
    const imagenEtiqAimprimir = await buscarParaImprimir();

    var seimprime = '<!DOCTYPE html>' +
      '<html lang="en">' +
      '<head>' +
      '<meta charset="utf-8">' +
      '<title>etiqueta de envio</title>' +
      '<style>' +
      '.full {' +
      'width:100%;' +
      'height:100%;' +
      'background-color: white;' +
      'overflow: hidden;' +
      'display: inline-block;' +
      ' }' +
      '.contenedor-etiqueta{' +
      'border: 1px dashed black;' +
      'padding: 34px;' +
      'width: 100px;' +
      'display: inline-block;' +
      'margin: 3px;' +
      '}' +
      '.contenedor-etiqueta img {' +
      'width: 90px;' +
      'display: inline-block;' +
      '}' +
      '#boton{' +
      'display: block;' +
      '}' +
      '</style>' +
      '<script>' +
      'function clonar() {' +
      'for (let index = 1; index <' + cantidadEtiqAimprimir + '; index++) {' +
      'var c = document.getElementById("full");' +
      'var clon = c.cloneNode("full");' +
      'clon.style.width = "100px";' +
      'clon.style.height = "100px";' +
      'document.body.appendChild(clon);' +
      '}}' +
      '</script>' +
      '</head>' +
      '<body class="full" id="contenedor" body onload="clonar()" >' +
      '<div class="contenedor-etiqueta" id="full">' +
      '<img src="' + imagenEtiqAimprimir + '" alt="">' +
      '</div>' +
      '</body>' +
      '</html>';
    pdf.fromData(seimprime, { type: 'share' })
  }
  if (option == 3) {
    fecha = prompt('Indicá la fecha: DÍA/MES/AÑO');
    hojalistadeprecios = '<!DOCTYPE html>' +
      '<html lang="es">' +
      '<head>' +
      '<meta charset="UTF-8">' +
      '<title>REMITO</title>' +
      '<style>' +
      '#contenedor{border: 1px solid black;width: 19cm;}' +
      '.col-100 {width: 100%;}' +
      'p {padding-left: 1cm;}' +
      '#cabezera {border: 1px solid black;padding-top: 0.5cm;}' +
      '#fecha{ padding-left: 9cm;}' +
      '#top{ display: flex;}' +
      '#footer {border: 1px solid black;display: flex;}' +
      '	#cuerpo {border: 1px solid black; }' +
      '#datos2 { display: flex;}' +
      '#qrweb { padding-left: 7.1cm;}' +
      '#qrweb img { width: 2.8cm;}' +
      '#visitaweb { padding-left: 0cm;margin: 0; font-size: 10px ; padding-bottom: 0.2cm;}' +
      '#qrwsp img{ padding-top: 0.2cm; width: 1.5cm; padding-left:8cm;}' +
      '#qrwsp { }' +
      '#qrwspp { padding: 0; font-size: 10px; margin: 0; padding-bottom: 0.2cm;}' +
      '#webb { padding-top: 0.5cm;}' +
      '#qrwsp p {padding-left: 7.8cm; }' +
      '</style>' +
      '</head>' +
      '<body>' +
      '<div id="contenedor">' +
      '<div id="cabezera">' +
      '<div id="top"><p><b>' + nombreEmpresa + '</b> - Lista de precios</p><p id="fecha"> ' + fecha + '</p></div>' +
      '<hr>' +
      '<div id="datos2">' +
      '<div id="datos">' +
      '<p>Dirección: ' + directionSucursalUser + '</p>' +
      '<p>Teléfono: ' + telefonoSucursalUser + '</p>' +
      '<p>Email: ' + mailSucursalUser + '</p>' +
      '</div>' +
      '<div id="qrweb"><img src="' + qrWhatsapp + '" alt="whatsapp">' +
      '<p id="visitaweb">Contactanos por Whatsapp</p></div></div>' +
      '</div>' +
      '<div id="cuerpo">' +
      ReporteElegido +
      '</div>' +
      '<div id="footer">' +
      '<div id="webescrita"><p id="webb">' + webuser + '</p></div><div id="qrwsp"><img src="' + qrwebsucursal + '" alt="web"> <p id="qrwspp">Visitá nuestra web</p></div>' +
      '</div>' +
      '</div>' +
      '</body>' +
      '</html>';

    pdf.fromData(hojalistadeprecios, { type: 'share' })

  }

}



/*
function imprimir2() {
  imagenEtiqAimprimir = "data:image/png;base64,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";
  cantidadEtiqAimprimir = 55;
  var elID = "ID: 5455"
  var seimprime = '<!DOCTYPE html>' +
    '<html lang="en">' +
    '<head>' +
    '<meta charset="utf-8">' +
    '<title>Hello World</title>' +
    '<style>' +
    '.full {' +
    'width:100%;' +
    'height:100%;' +
    'background-color: white;' +
    'overflow: hidden;' +
    'display: inline-block;' +
    ' }' +
    '.contenedor-etiqueta{' +
    'border: 1px dashed black;' +
    'padding: 35px;' +
    'width: 100px;' +
    'display: inline-block;' +
    'margin: 3px;' +
    '}' +
    '.contenedor-etiqueta img {' +
    'width: 90px;' +
    'display: inline-block;' +
    '}' +
    '#boton{' +
    'display: block;' +
    '}' +
    '</style>' +
    '<script>' +
    'function clonar() {' +
    'for (let index = 0; index <' + cantidadEtiqAimprimir + '; index++) {' +
    'var c = document.getElementById("full");' +
    'var clon = c.cloneNode("full");' +
    'clon.style.width = "100px";' +
    'clon.style.height = "100px";' +
    'document.body.appendChild(clon);' +
    '}}' +
    '</script>' +
    '</head>' +
    '<body class="full" id="contenedor" body onload="clonar()" >' +
    '<div class="contenedor-etiqueta" id="full">' +
    '<img src="' + imagenEtiqAimprimir + '" alt="">' +
    '</div>' +
    '</body>' +
    '</html>';


  pdf.fromData(seimprime, { type: 'share' })
}
*/






function crearPDF() {
  alert('andando');
  const $elementoParaConvertir = document.querySelector("#bodyconsultas"); // <-- Aquí puedes elegir cualquier elemento del DOM
  html2pdf()
    .set({
      margin: 1,
      filename: 'documento.pdf',
      image: {
        type: 'jpeg',
        quality: 0.98
      },
      html2canvas: {
        scale: 3, // A mayor escala, mejores gráficos, pero más peso
        letterRendering: true,
      },
      jsPDF: {
        unit: "in",
        format: "a3",
        orientation: 'portrait' // landscape o portrait
      }
    })
    .from($elementoParaConvertir)
    .save()
    .catch(err => console.log(err));
}


//funcion para crear articulo en base
/*

function crearArticuloEnBase() {
  var db = firebase.firestore();
  descripcionArticulo = $$("#crearDescripcionArticulo").val();
  EanArticulo = $$("#crearEanArticulo").val();
  categoriaArticulo = $$("#crearCategoriaArticulo").val();
  marcaArticulo = $$("#crearMarcaArticulo").val();
  precioArticulo = $$("#crearPrecioArticulo").val();

  console.log('se creo el articulo' + descripcionArticulo + 'en la base');

  var datosArticulos = {
            id_articulo: "1",
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
  id_articulo++;
  alert(id_articulo);

  db.collection("sucursal").doc(sucursalUsuario).collection("datosSucursal").doc("losDatos").update
    ({id_articulo: id_articulo })
    .then(function () {

            console.log("actualizado ok");

    })
    .catch(function (error) {

            console.log("Error: " + error);

    });
}function crearArticuloEnBase() {
  var db = firebase.firestore();
  descripcionArticulo = ($$("#crearDescripcionArticulo").val().toLowerCase());
  EanArticulo = ($$("#crearEanArticulo").val().toLowerCase());
  categoriaArticulo = ($$("#crearCategoriaArticulo").val()).toLowerCase();
  marcaArticulo = ($$("#crearMarcaArticulo").val()).toLowerCase();
  precioArticulo = parseInt($$("#crearPrecioArticulo").val());
  stockArticulo = parseInt($$("#crearStockArticulo").val());
  datosExtra = ($$("#crearMarcaArticulo").val()).toLowerCase();
  Ubicacion = ($$("#crearUbicacionArticulo").val()).toLowerCase()
  if (parseInt($$("#crearPrecioArticulo").val()) == "") {stockArticulo = 0; }
  console.log('se creo el articulo' + descripcionArticulo + 'en la base');

  var datosArticulos = {
            id_articulo: "1",
    categoria: categoriaArticulo,
    marca: marcaArticulo,
    ean: EanArticulo,
    descripcion: descripcionArticulo,
    stock: stockArticulo,
    foto: "rutaejemplo/imagen.jpg",
    precio: precioArticulo,
    ubicacion: Ubicacion,
    codigoqr: "rutaejemplo/12.pdf",
    datos_extra: datosExtra,
    usuarioDeCreacion: email,
  }






*/
//funcion para crear articulo en base



function escanearYasignarCbarras() {
  cordova.plugins.barcodeScanner.scan(
    function (result) {
      barrasEscaneado = result.text;
      tipoDeCodigo = result.format;
      tipoDeCodigo = tipoDeCodigo.toString()
      console.log('tipo de codigo:' + tipoDeCodigo);
      EanArticulo = barrasEscaneado;
      $$('#insertarEanEscaneado').text(barrasEscaneado);
    },
    function (error) {
      alert("Scaneo fallido: " + error);
    }
  );
}



//funcion para crear articulo en base 2
function crearArticuloEnBase() {
  console.log('entro a la funcion crear articulo en base')

  var db = firebase.firestore();
  db.collection("sucursal").doc(sucursalUsuario)
    .get()
    .then(function (querySnapshot) {

      // doc.data() is never undefined for query doc snapshots
      idGLOBAL = querySnapshot.data().id_articulo;
      idGLOBAL = idGLOBAL + 1;
      console.log(idGLOBAL);
      setTimeout(generadorQr(idGLOBAL), 100);

      var prueba1 = $$('#output>img').attr('src');
      console.log('valor prueba: ' + prueba1);
      function asignarValores() {
        descripcionArticulo = ($$("#crearDescripcionArticulo").val()).toLowerCase();
        if ($$("#crear-codigo-ean").val() !== "") { EanArticulo = ($$("#crear-codigo-ean").val().toLowerCase()); }
        categoriaArticulo = ($$("#autocomplete-dropdown-categorias").val()).toLowerCase();
        marcaArticulo = ($$("#autocomplete-dropdown-marcas").val()).toLowerCase();
        precioArticulo = parseInt($$("#crearPrecioArticulo").val());
        stockArticulo = parseInt($$("#crearStockArticulo").val());
        ubicacionArticulo = ($$("#crearUbicacionArticulo").val()).toLowerCase();
        id_articulo = idGLOBAL;
      }
      setTimeout(asignarValores, 500);

      db.collection("sucursal").doc(sucursalUsuario).update
        ({ id_articulo: idGLOBAL })
        .then(function () {
          console.log("id de articulo actualizado ok");
        })
        .catch(function (error) {
          console.log("Error al cargar id de articulo: " + error);
        });

      function enviarabase() {
        var datosArticulos = {
          id_articulo: id_articulo,
          categoria: categoriaArticulo,
          marca: marcaArticulo,
          ean: EanArticulo,
          descripcion: descripcionArticulo,
          stock: stockArticulo,
          foto: "",
          precio: precioArticulo,
          ubicacion: ubicacionArticulo,
          codigoqr: codigoBase64,
          medidas: "",

        }

        var existeMarcaEnSucursal = false;
        for (let i = 0; i < marcasSucursalUser.length; i++) {
          if (marcaArticulo == marcasSucursalUser[i]) {
            existeMarcaEnSucursal = true;
          }
        }
        if (existeMarcaEnSucursal == false) {
          marcasSucursalUser.push(marcaArticulo);
          db.collection("sucursal").doc(sucursalUsuario).update
            ({ marcas: marcasSucursalUser })
            .then(function () {
              console.log("actualizado marcas ok");
            })
            .catch(function (error) {
              console.log("Error al cargar marca: " + error);
            });
        }

        var existeCategoriaEnSucursal = false;
        for (let i = 0; i < categoriasSucursalUser.length; i++) {
          if (categoriaArticulo == categoriasSucursalUser[i]) {
            existeCategoriaEnSucursal = true;
          }
        }
        if (existeCategoriaEnSucursal == false) {
          categoriasSucursalUser.push(categoriaArticulo);
          db.collection("sucursal").doc(sucursalUsuario).update
            ({ categorias: categoriasSucursalUser })
            .then(function () {
              console.log("actualizado categoria ok");
            })
            .catch(function (error) {
              console.log("Error al cargar categoria: " + error);
            });
        }

        db.collection("sucursal").doc(sucursalUsuario).collection("articulos").doc(descripcionArticulo).set(datosArticulos)
          .then(function () {
            console.log('se creo el articulo' + descripcionArticulo + 'en la base');
            console.log("artículo creado con éxito");
            var articuloCreadoConExito;
            // Create dynamic Popup
            var dynamicPopup = app.popup.create({
              content: '<div class="popup">' +
                '<div class="block">' +
                '<div class="card card-outline">' +
                '<div class="card-header mas-pad">Artículo creado con éxito</div>' +
                '<div class="card-content card-content-padding pad-left">' +
                '<img src="' + codigoBase64 + '"alt="articulo creado"></img>' +
                '<p>Descripción: ' + descripcionArticulo + '</p>' +
                '<p>Precio: $' + precioArticulo + '</p>' +
                '<p>Stock: ' + stockArticulo + '</p>' +
                '<p>Código de barras: ' + EanArticulo + '</p>' +
                '<p>Ubicación: ' + ubicacionArticulo + '</p>' +
                '</div>' +
                '<div class="card-footer"><button button class= "col button button-outline button-raised" onclick="imprimir2(1)">imprimir etiquetas</button><button button class= "col button button-outline button-raised link popup-close"> Cerrar</button></div>' +
                '</div>',

              // Events
              on: {
                open: function (popup) {
                  console.log('Popup open');
                },
                opened: function (popup) {
                  console.log('Popup opened');
                },
              }
            });
            dynamicPopup.open();


            $$('#output').html(articuloCreadoConExito);
          })
          .catch(function (error) {
            console.log("Error al crear el artículo");
            alert("error al crear el articulo");
          });

      }
      setTimeout(enviarabase, 1000);


    })
    .catch(function (error) {
      console.log("Error getting documents: ", error);
    });




}
//funcion para crear articulo en base 2



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


// ver esta funcion
var JSONQUERY = "";

function llamarjson() {

  var db = firebase.firestore();
  var query4articulos = db.collection("sucursal").doc(sucursalUsuario).collection("articulos");

  query4articulos
    .get()
    .then(function (querySnapshot) {

      JSONQUERY = JSON.stringify(querySnapshot)

      console.log(doc.id, " => ", doc.data());
      ean = doc.data().ean;
      console.log(JSONQUERY);
    })
    .catch(function (error) {
      console.log("Error getting documents: ", error);
    });

}
// ver esta funcion




var qrEscaneado;
function scanBarcode() {

  cordova.plugins.barcodeScanner.scan(
    function (result) {
      qrEscaneado = result.text + "\n";
      /* alert("We got a barcode\n" +
        "Result: " + result.text + "\n" +
        "Format: " + result.format + "\n" +
        "Cancelled: " + result.cancelled);*/

      var db = firebase.firestore();
      var query4articulos = db.collection("sucursal").doc(sucursalUsuario).collection("articulos");

      query4articulos.where("ean", "==", "716165177333")
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            ean = doc.data().ean;
            alert(doc.data().descripcion);
          });
        })
        .catch(function (error) {
          console.log("Error getting documents: ", error);
        });

    },
    function (error) {
      alert("Scaneo fallido: " + error);
    }
  );

}

function scanBarcodeEan() {
  return new Promise(resolve => {
    cordova.plugins.barcodeScanner.scan(
      function (result) {
        qrEscaneado = result.text;
        tipoDeCodigo = result.format;
        tipoDeCodigo = (tipoDeCodigo).toString()
        console.log('tipo de codigo:' + tipoDeCodigo);
        resolve(qrEscaneado);
        /* alert("We got a barcode\n" +
          "Result: " + result.text + "\n" +
          "Format: " + result.format + "\n" +
          "Cancelled: " + result.cancelled);*/
      },
      function (error) {
        alert("Scaneo fallido: " + error);
      }
    );
  });


}
async function buscarConEscaneo() {

  var eanEscaneado = await scanBarcodeEan();


  function asignarEan() {
    return new Promise(resolve => {
      eanEscaneado = eanEscaneado.toString();
      console.log('ean escaneado:' + eanEscaneado);
      resolve(eanEscaneado);
    });
  }
  var eanEscaneadoOk;
  async function conEanOk() {
    var db = firebase.firestore();
    var consultaCodigoBase = "ean";
    console.log('espero para ejecutar la llamada');

    eanEscaneadoOk = await asignarEan();
    console.log('tipo de codigo antes del if:' + tipoDeCodigo);

    if (eanEscaneadoOk.length < 7) {
      eanEscaneadoOk = parseInt(eanEscaneadoOk);
      console.log('entro en codigo qr');
      var query4articulos = db.collection("sucursal").doc(sucursalUsuario).collection("articulos").where("id_articulo", "==", eanEscaneadoOk);
    } else {
      var query4articulos = db.collection("sucursal").doc(sucursalUsuario).collection("articulos").where("ean", "==", eanEscaneadoOk);
      consultaCodigoBase = "id_articulo";
    }

    query4articulos
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots


          console.log(doc.id, " => ", doc.data());
          id = doc.data().id_articulo;
          qr = doc.data().codigoqr;
          descripcion = doc.data().descripcion;
          precio = doc.data().precio;
          stock = doc.data().stock;
          ubicacion = doc.data().ubicacion;

          ean = doc.data().ean;


          var articuloEncontrado = '<div class="row" id="resultadosBusquedaEscaneo">' +
            ' <div class="col-20" id="imagenbusqueda">' +
            '<img src="' + qr + '"alt="" id="imagenBusquedaQR">' +
            '</div>' +
            '<div class="col-60" id="datosConsultaEscaneo">' +
            '<p>ID: ' + id + '</p>' +
            '<p>Descripción: ' + descripcion + '</p>' +
            '<p>Precio: $ ' + precio + '</p>' +
            '<p>Stock: ' + stock + '</p>' +
            '<p>Ubicación: ' + ubicacion + ' </p>' +
            '</div>' +
            '</div>';

          $$('#bodyconsultas').append(articuloEncontrado);
        });
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  }

  conEanOk();

}






var tareasArealizar = "";

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function () {
  console.log("Device is ready!");




  var db = firebase.firestore();

  db.collection("sucursal").doc(sucursalUsuario).collection("articulos")
    .onSnapshot(function (querySnapshot) {
      articulosExistentesEnQuery = [];
      querySnapshot.forEach(function (doc) {
        articulosExistentesEnQuery.push(doc.data().descripcion);
      });
      articulosExistentes = articulosExistentesEnQuery;
      console.log("estos son todos los articulos: ", articulosExistentes);
    });

  db.collection("sucursal").doc(sucursalUsuario).collection("tareas")
    .onSnapshot(function (querySnapshot) {
      tareasArealizar = "";
      querySnapshot.forEach(function (doc) {
        tarea = doc.data().tarea;
        vence = doc.data().vence;
        id_tarea = doc.data().id_tarea;
        tareasArealizar += '<div class="card card-outline" id="background">' +
          '<div class="card-content card-content-padding">' + tarea + ' <a href="#" class="link card-close card-opened-fade-in color-black"style="position: absolute; right: 15px; top: 15px">' +
          '<i class="icon f7-icons buttondelete" onClick="tareaCompletada(this)" id="' + id_tarea + '" >xmark_circle_fill</i>' +
          '</a></div>' +
          '<div class="card-footer">Vence: ' + vence + ' </div>' +
          '</div>';

      });
      $$('#lastareas').html(tareasArealizar);
      console.log(tareasArealizar);


    });

  db.collection("sucursal").doc(sucursalUsuario)
    .onSnapshot(function (querySnapshot) {
      id_tarea = querySnapshot.data().id_tareas;
      idGLOBAL = querySnapshot.data().id_articulo;
      categoriasSucursalUser = querySnapshot.data().categorias;
      marcasSucursalUser = querySnapshot.data().marcas;
      sucursalUsuario = querySnapshot.data().nombre;
      webuser = querySnapshot.data().web;
      cuitdni = querySnapshot.data().cuitdni;
      id_global_envio = querySnapshot.data().id_global_envio;
      nombreEmpresa = querySnapshot.data().nombre_empresa;
      directionSucursalUser = querySnapshot.data().direccion;
      mailSucursalUser = querySnapshot.data().email;
      telefonoSucursalUser = querySnapshot.data().telefono;
      qrwebsucursal = querySnapshot.data().qrweb;
      qrWhatsapp = querySnapshot.data().qrwhatsapp;
      console.log(querySnapshot.data());
      console.log(querySnapshot.data().direccion);
      console.log('marcas : ' + querySnapshot.data().marcas);
      console.log(querySnapshot.data().categorias);

    });


});


//esto me trae toda una coleccion

function autocompleteDescripcion(id) {
  var id = id;
  var autocompleteDescripcion = app.autocomplete.create({
    inputEl: id,
    openIn: 'dropdown',
    source: function (query, render) {
      var results = [];
      if (query.length === 0) {
        render(results);
        return;
      }
      // Find matched items
      for (var i = 0; i < articulosExistentes.length; i++) {
        if (articulosExistentes[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(articulosExistentes[i]);
      }
      // Render items by passing array with result items
      render(results);
    }
  });
}


function autocompleteCategorias(id) {
  var id = id;
  var autocompleteCategorias = app.autocomplete.create({
    inputEl: id,
    openIn: 'dropdown',
    source: function (query, render) {
      var results = [];
      if (query.length === 0) {
        render(results);
        return;
      }
      // Find matched items
      for (var i = 0; i < categoriasSucursalUser.length; i++) {
        if (categoriasSucursalUser[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(categoriasSucursalUser[i]);
      }
      // Render items by passing array with result items
      render(results);
    }
  });
}


function autocompleteMarcas(id) {
  var id = id;
  var autocompleteMarcas = app.autocomplete.create({
    inputEl: id,
    openIn: 'dropdown',
    source: function (query, render) {
      var results = [];
      if (query.length === 0) {
        render(results);
        return;
      }
      // Find matched items
      for (var i = 0; i < marcasSucursalUser.length; i++) {
        if (marcasSucursalUser[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(marcasSucursalUser[i]);
      }
      // Render items by passing array with result items
      render(results);
    }
  });

}

// Option 2. Using live 'page:init' event handlers for each page



// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="paginaPrincipal1"]', function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized

  $$('#lastareas').html(tareasArealizar);

})
$$(document).on('page:init', '.page[data-name="generarListaDePrecios"]', function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  autocompleteMarcas('#autocomplete-dropdown-marcas');
  autocompleteCategorias('#autocomplete-dropdown-categorias');

})

// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="actualizarprecios"]', function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  console.log(e);
  autocompleteDescripcion('#autocomplete-dropdown-descripcion-actualizar-precios');

})

function actualizarPrecio(accion) {
  var accion = accion;
  var db = firebase.firestore();
  var query4articulos = db.collection("sucursal").doc(sucursalUsuario).collection("articulos");
  var precio = 0;
  var precioAnterior = 0;
  var descripcion = "";
  var nuevoPrecio = parseFloat($$('#actualizarPrecioArticulo').val());
  var ArticuloAactualizar = $$('#autocomplete-dropdown-descripcion-actualizar-precios').val();

  query4articulos.where("descripcion", "==", ArticuloAactualizar)
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        precio = doc.data().precio;
        descripcion = doc.data().descripcion;
        if (accion == 1) {
          pusharticuloIngresado1 = '<div class="card m-auto col-90 margin-2">' +
            '<div class="card-content card-content-padding">' +
            '<p class="col-100"><b>-</b> Descripción:<b> ' + descripcion + '</b></p>' +
            '<p><b>-</b> Precio actual: $' + precio + '</b></p>' +
            '</div>' +
            '</div>';
          $$('#preciosactualizados').append(pusharticuloIngresado1);
        }
      });
    })
    .catch(function (error) {
      var pusharticulonoencontrado = '<div class="card m-auto col-90 margin-2">' +
        '<div class="card-content card-content-padding">' +
        '<p class="col-100"><b>-</b> Artículo no encontrado </p>' +
        '</div>' +
        '</div>';
      $$('#preciosactualizados').append(pusharticulonoencontrado);
      console.log('articulo no encontrado');
    });
  if (nuevoPrecio > 0 && ArticuloAactualizar != "") {
    precio = nuevoPrecio;
    console.log(nuevoPrecio);
    query4articulos.doc(ArticuloAactualizar).update
      ({ precio: precio })
      .then(function () {
        pusharticuloIngresado2 = '<div class="card m-auto col-90 margin-2">' +
          '<div class="card-content card-content-padding">' +
          '<p class="col-100"><b>-</b>Artículo actualizado correctamente</p>' +
          '<p class="col-100"><b>-</b> Descripción:<b> ' + descripcion + ' - Precio actualizado a : $' + precio + '</b></p>' +
          '</div>' +
          '</div>';
        $$('#preciosactualizados').append(pusharticuloIngresado2);
      })
      .catch(function (error) {
        console.log("Error: " + error);
      });
  }
  else if (accion != 1) {
    alert('Rellená los campos necesarios');
  }
}

var cantidadArticulosAdescontar = [];
var stockArticulosAdescontar = [];
var ArticulosAdescontar = [];
var sumaTotalesAemitir = 0;
var articulosAgregados4remito = "";
var tipoDeEntregaRemito = "";
var clienteRemito = "";
function agregarArticuloParaPedido() {

  var db = firebase.firestore();
  var query4articulos = db.collection("sucursal").doc(sucursalUsuario).collection("articulos");
  ArticuloAemitir = $$('#autocomplete-dropdown-emitir-pedido').val();
  cantidAdarticulo = $$('#cantidadaagregar').val();
  tipoDeEntregaRemito = $$('#tipodeentrega').val();
  clienteRemito = $$('#clientepedido').val();
  precioArticuloAemitir = 0;
  query4articulos.where("descripcion", "==", ArticuloAemitir)
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        stockarticuloAemitir = doc.data().stock;
        precioArticuloAemitir = doc.data().precio;
        descripcion = doc.data().descripcion;
        if (cantidAdarticulo <= stockarticuloAemitir && cantidAdarticulo != "") {
          $$('#totalarticuloscargados').removeClass('d-none');
          cantidadArticulosAdescontar.push(cantidAdarticulo);
          ArticulosAdescontar.push(descripcion);
          stockArticulosAdescontar.push(stockarticuloAemitir);
          articulosAgregados4remito += '<p class="articulos">x ' + cantidAdarticulo + ' - ' + descripcion + ' - $' + precioArticuloAemitir + '</p>';
          var articuloAgregado = '<div class="card m-auto col-90 margin-2 ">' +
            '<div class="card-content card-content-padding">' +
            '<p class="col-100"><b>-x ' + cantidAdarticulo + '</b> - ' + descripcion + ' - $' + precioArticuloAemitir + '</p>' +
            '</div>' +
            '</div>';
          $$('#productoscargados').append(articuloAgregado);
          sumaTotalesAemitir = sumaTotalesAemitir + precioArticuloAemitir;
          $$('#totalaemitir').html('<b>- </b>TOTAL PEDIDO: $' + sumaTotalesAemitir);
        }
        if (cantidAdarticulo > stockarticuloAemitir) {
          alert('Tu stock es de: ' + stockarticuloAemitir + ' Y queres descontar: ' + cantidAdarticulo + ' No tienes suficiente stock para ejecutar esta operacion');
        }

      });
    })
    .catch(function (error) {
      alert('articulo no encontrado');
      console.log('articulo no encontrado');
    });






}

function emitirpedido() {
  if (ArticulosAdescontar.length == 0) {
    alert('no tienes nigun articulo cargado');
  } else {
    for (let i = 0; i < ArticulosAdescontar.length; i++) {
      var nuevoStockArticulo = stockArticulosAdescontar[i] - cantidadArticulosAdescontar[i];
      var db = firebase.firestore();
      var query4articulos = db.collection("sucursal").doc(sucursalUsuario).collection("articulos");
      query4articulos.doc(ArticulosAdescontar[i]).update
        ({ stock: nuevoStockArticulo })
        .then(function () {
          console.log(ArticulosAdescontar[i] + 'actualizado ok');
        })
        .catch(function (error) {
          console.log(ArticulosAdescontar[i] + 'error');
          console.log("Error: " + error);
        });
    }
  }

  var remitoPedido = '<!DOCTYPE html>' +
    '<html lang="es">' +
    '<head>' +
    '<meta charset="UTF-8">' +
    '<title>REMITO</title>' +
    '<style>' +
    'body {width: 12cm;border: 3px solid black;}' +
    '#cliente {padding-left: 1cm;}' +
    '#tipodeentrega {padding-left: 1cm;}' +
    '#totalpedido {padding-left: 1cm;}' +
    '.articulos {margin-left: 1cm;}' +
    '</style>' +
    '</head>' +
    '<body>' +
    '<hr>' +
    '<hr>' +
    '<div id="cliente">' +
    '<p>Cliente: ' + clienteRemito + ' </p>' +
    '</div>' +
    '<hr>' +
    ' <hr>' +
    '<p id="tipodeentrega">Tipo de entrega : ' + tipoDeEntregaRemito + '</p>' +
    '</div>' +
    '<hr>' +
    articulosAgregados4remito +
    '<p id="totalpedido">TOTAL PEDIDO: $' + sumaTotalesAemitir + '</p>' +
    '<hr>' +
    '<hr>' +
    '</body>' +
    '</html>';


  pdf.fromData(remitoPedido, { type: 'share' })



}

$$(document).on('page:init', '.page[data-name="emitir-pedido"]', function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  console.log('abierto emitir pedidos');
  autocompleteDescripcion('#autocomplete-dropdown-emitir-pedido');
  cantidadArticulosAdescontar = [];
  ArticulosAdescontar = [];
  sumaTotalesAemitir = 0;
  stockArticulosAdescontar = [];
  articulosAgregados4remito = "";
  tipoDeEntregaRemito = "";
  clienteRemito = "";
})



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
var paratabla = false;
// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="ingresararticulos"]', function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  var autocompleteDescripcionEtiquetas = app.autocomplete.create({
    inputEl: '#autocomplete-dropdown-descripcion-ingresar',
    openIn: 'dropdown',
    source: function (query, render) {
      var results = [];
      if (query.length === 0) {
        render(results);
        return;
      }
      // Find matched items
      for (var i = 0; i < articulosExistentes.length; i++) {
        if (articulosExistentes[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(articulosExistentes[i]);
      }
      // Render items by passing array with result items
      render(results);
    }
  });




})

function actualizarStock() {



  var db = firebase.firestore();
  var query4articulos = db.collection("sucursal").doc(sucursalUsuario).collection("articulos");
  var stock = 0;
  var stockAnterior = 0;
  var descripcion = "";
  var cantidadAingresar = parseInt($$('#cantidadarticulosaingresar').val());
  var articuloAingresar = $$('#autocomplete-dropdown-descripcion-ingresar').val();
  var operacionArealizar = $$('#tipodeajustedestock').val();
  cantidadAingresar = parseInt(cantidadAingresar);
  console.log(cantidadAingresar);

  query4articulos.where("descripcion", "==", articuloAingresar)
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        var stock = doc.data().stock;
        descripcion = doc.data().descripcion;
        console.log('stock en query ' + stock);
        console.log('descripcion en query ' + descripcion);
        stockAnterior = stock;

        switch (operacionArealizar) {
          case "agregar":
            stock = stock + cantidadAingresar;
            break;
          case "restar":
            stock = stock - cantidadAingresar;
            break;
        }

        console.log('stock con cantidad sumada' + stock);

        query4articulos.doc(articuloAingresar).update
          ({ stock: stock })
          .then(function () {
            pusharticuloIngresado = '<div class="card m-auto col-90 margin-2">' +
              '<div class="card-content card-content-padding">' +
              '<p class="col-100"><b>-</b> Descripción:<b> ' + descripcion + '</b></p>' +
              '<p><b>-</b> Stock previo: ' + stockAnterior + ' - <b>Stock actual: ' + stock + '</b></p>' +
              '</div>' +
              '</div>';

            $$('#articulosingresados').append(pusharticuloIngresado);

          })
          .catch(function (error) {

            console.log("Error: " + error);

          });

      });
    })
    .catch(function (error) {
      var pusharticulonoencontrado = '<div class="card m-auto col-90 margin-2">' +
        '<div class="card-content card-content-padding">' +
        '<p class="col-100"><b>-</b> Artículo no encontrado </p>' +
        '</div>' +
        '</div>';
      $$('#articulosingresados').append(pusharticulonoencontrado);
      console.log('articulo no encontrado');


    });




}

$$(document).on('page:init', '.page[data-name="crearEtiquetasProductos"]', function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  console.log(e);
  var autocompleteDescripcionEtiquetas = app.autocomplete.create({
    inputEl: '#autocomplete-dropdown-descripcion-etiquetas',
    openIn: 'dropdown',
    source: function (query, render) {
      var results = [];
      if (query.length === 0) {
        render(results);
        return;
      }
      // Find matched items
      for (var i = 0; i < articulosExistentes.length; i++) {
        if (articulosExistentes[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(articulosExistentes[i]);
      }
      // Render items by passing array with result items
      render(results);
    }
  });


})


// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="consultas"]', function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  var autocompleteDescripcion = app.autocomplete.create({
    inputEl: '#autocomplete-dropdown-descripcion',
    openIn: 'dropdown',
    source: function (query, render) {
      var results = [];
      if (query.length === 0) {
        render(results);
        return;
      }
      // Find matched items
      for (var i = 0; i < articulosExistentes.length; i++) {
        if (articulosExistentes[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(articulosExistentes[i]);
      }
      // Render items by passing array with result items
      render(results);
    }
  });



  console.log(e);
  var autocompleteMarcas = app.autocomplete.create({
    inputEl: '#autocomplete-dropdown-marcas',
    openIn: 'dropdown',
    source: function (query, render) {
      var results = [];
      if (query.length === 0) {
        render(results);
        return;
      }
      // Find matched items
      for (var i = 0; i < marcasSucursalUser.length; i++) {
        if (marcasSucursalUser[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(marcasSucursalUser[i]);
      }
      // Render items by passing array with result items
      render(results);
    }
  });


  var autocompleteCategorias = app.autocomplete.create({
    inputEl: '#autocomplete-dropdown-categorias',
    openIn: 'dropdown',
    source: function (query, render) {
      var results = [];
      if (query.length === 0) {
        render(results);
        return;
      }
      // Find matched items
      for (var i = 0; i < categoriasSucursalUser.length; i++) {
        if (categoriasSucursalUser[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(categoriasSucursalUser[i]);
      }
      // Render items by passing array with result items
      render(results);
    }
  });

})



// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="creararticulos"]', function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized

  $$('#escanear-ean-crear').on('click', escanearYasignarCbarras);


  var autocompleteMarcas = app.autocomplete.create({
    inputEl: '#autocomplete-dropdown-marcas',
    openIn: 'dropdown',
    source: function (query, render) {
      var results = [];
      if (query.length === 0) {
        render(results);
        return;
      }
      // Find matched items
      for (var i = 0; i < marcasSucursalUser.length; i++) {
        if (marcasSucursalUser[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(marcasSucursalUser[i]);
      }
      // Render items by passing array with result items
      render(results);
    }
  });


  var autocompleteCategorias = app.autocomplete.create({
    inputEl: '#autocomplete-dropdown-categorias',
    openIn: 'dropdown',
    source: function (query, render) {
      var results = [];
      if (query.length === 0) {
        render(results);
        return;
      }
      // Find matched items
      for (var i = 0; i < categoriasSucursalUser.length; i++) {
        if (categoriasSucursalUser[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(categoriasSucursalUser[i]);
      }
      // Render items by passing array with result items
      render(results);
    }
  });

})

//-------------------------------------------------------------------------------------------------------------------
// funciones de pagina de CONSULTAS
//-------------------------------------------------------------------------------------------------------------------
var consultaArealizar = "";
var valorConsultaArealizar = "";
var operadorConsultaArealizar = "";


//---------------------------------------------------------------------------


//document.getElementById("consultaMedianteCategoria").addEventListener("click", navegarAconsultarporcategoria);

/*$$('#consultaMedianteCategoria').on('click', function () {
            mainView.router.navigate('/consultas-por-categoria/');
})
 
porque no funciona????
 
*/

function navegarEnConsultas(tipoConsultaRecibida) {
  //mainView.router.navigate('/consultas-por-categoria/');
  var consultaRecibida = tipoConsultaRecibida;

  switch (consultaRecibida) {
    case 1:
      $$(".todos").addClass("d-none");
      $$("#consulta-descripcion").removeClass("d-none");
      break;
    case 2:
      $$(".todos").addClass("d-none");
      $$("#consulta-categoria").removeClass("d-none");
      break;
    case 3:
      $$(".todos").addClass("d-none");
      $$("#consulta-marca").removeClass("d-none");
      break;
    case 4:
      $$(".todos").addClass("d-none");
      $$("#consulta-precio").removeClass("d-none");
      break;
    case 5:
      $$(".todos").addClass("d-none");
      $$("#consulta-stock").removeClass("d-none");
      break;
    case 6:
      $$(".todos").addClass("d-none");
      $$("#consulta-escaneo").removeClass("d-none");
      break;
    case 7:
      $$(".todos").addClass("d-none");
      $$("#consulta-compuesta").removeClass("d-none");
      break;
  }


}



//-----------------------------------------------------------------------------


$$("#consultarDesdePaginaPorCategoria").on("click", function () {
  consultaArealizar = "categoria";
  valorConsultaArealizar = $$("#consultar-por-categoria").val();
  operadorConsultaArealizar = "==";
  consultas4articulos();
})






$$(document).on('page:init', '.page[data-name="consultas"]', function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized








  /* 
    console.log('pagina activa: consultas');
    query4articulos.where("id_articulo", "==", "1")
      .onSnapshot(function (snapshot) {
        snapshot.docChanges().forEach(function (change) {
          if (change.type === "added") {
            console.log("New city: ", change.doc.data());
          }
          if (change.type === "modified") {
            console.log("Modified city: ", change.doc.data());
          }
          if (change.type === "removed") {
            console.log("Removed city: ", change.doc.data());
          }
        });
      });
        */

})

var estoYafuereflejadoEnpantalla = "";
function consultaryescribir(consultaelegida) {
  console.log('funcionando consultaryescribir');
  var db = firebase.firestore();
  query4articulos = db.collection("sucursal").doc(sucursalUsuario).collection("articulos");
  var laConsultaAejecturar = consultaelegida;
  var filaAinsertar = "";
  var debePintarlo = false;

  switch (laConsultaAejecturar) {
    case 1:
      consultaArealizar = "descripcion";
      valorConsultaArealizar = $$("#autocomplete-dropdown-descripcion").val();
      operadorConsultaArealizar = "==";
      break;
    case 2:
      consultaArealizar = "categoria";
      valorConsultaArealizar = $$("#consultar-por-categoria").val();
      operadorConsultaArealizar = "==";

      break;
    case 3:
      consultaArealizar = "marca";
      valorConsultaArealizar = $$("#consultar-por-marca").val();
      operadorConsultaArealizar = "==";

      break;
    case 4:
      consultaArealizar = "precio";
      valorConsultaArealizar = $$("#consultar-por-precio").val();
      operadorConsultaArealizar = "==";
      break;
    case 5:
      consultaArealizar = "stock";
      valorConsultaArealizar = $$("#consultar-por-stock").val();
      operadorConsultaArealizar = "==";
      break;
    case 6:
      consultaArealizar = "escaneo";
      valorConsultaArealizar = $$("#consultar-por-escaneo").val();
      operadorConsultaArealizar = "==";
      break;


    default:
      break;
  }

  function query4DB(valor1, valor2, valor3) {
    query4articulos.where(consultaArealizar, operadorConsultaArealizar, valorConsultaArealizar)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          var descripcion = doc.data().descripcion;
          var talles = doc.data().talles;
          var marca = doc.data().marca;
          var precio = doc.data().precio;
          var stock = doc.data().stock;
          var idArticulo = doc.data().id_articulo;


          debePintarlo = true;
          filaAinsertar += '<tr><td class="label-cell" id="descripcion' + idArticulo + '">' + descripcion + '</td><td class="numeric-cell">' + stock + '</td><td class="numeric-cell">$ ' + precio + '</td></tr>';

        });


        switch (debePintarlo) {
          case true:
            if (estoYafuereflejadoEnpantalla != valorConsultaArealizar) {
              $$("#bodyconsultas").append('<div class= "col-100"><div class="data-table card"><table><thead><thead><tr><th class="label-cell"><b>' + valorConsultaArealizar.toUpperCase() + '</b> <br> <br>Descripción  </th><th class="numeric-cell"><br><br>stock</th><th class="numeric-cell"><br><br>precio</th></tr></thead></thead><tbody id="cuerpotabla">' + filaAinsertar + '</tbody></table></div>');
              estoYafuereflejadoEnpantalla = valorConsultaArealizar;
            } else { alert('ya consultaste esta ' + consultaArealizar); }
            break;

          case false:
            alert('No se encontraron resultados');
            break;

        }
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });


  }
  query4DB(consultaArealizar, operadorConsultaArealizar, valorConsultaArealizar);







  // funcion hecha con jorge --------------------------------

  /*
    var db = firebase.firestore();
 
    var consulta = db.collection("sucursal").doc("sucursal2").collection("categorias").doc("Remeras").collection("Nike");
    var arraydescripcion = [];
    var arraytalles = [];
    var arrayprecio = [];
    var arraystock = [];
    var arrayTotaLColecciones = [];
    var vueltass = 0;
    var filaAinsertar = "";
    //esto me trae toda una coleccion
    consulta.get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
              console.log(doc.id, " => ", doc.data());
              var descripcion = doc.data().descripcion;
              var talles = doc.data().talles;
              var precio = doc.data().precio;
              var stock = doc.data().stock;
              var idArticulo = doc.data().id_articulo;
 
              arraydescripcion.push(descripcion);
              arraytalles.push(talles);
              arrayprecio.push(precio);
              arraystock.push(stock);
 
              filaAinsertar += '<tr><td class="label-cell" id="descripcion' + idArticulo + '">' + descripcion + '</td><td class="numeric-cell">' + stock + '</td><td class="numeric-cell">' + precio + '</td></tr>'
              console.log('vuelta n :' + vueltass);
 
              vueltass++;
            });
      if (true) {$$('#bodyConsultas').append('<div class= "col-100"><div class="data-table card"><table><thead><thead><tr><th class="label-cell">Descripción</th><th class="numeric-cell">stock</th><th class="numeric-cell">precio</th></tr></thead></thead><tbody id="cuerpotabla">' + filaAinsertar + '</tbody></table></div>'); }
 
    })
 
    */
} let compuestaStock = 0;

var compuestaPrecio = 0;


function queryCompuesta() {

  var db = firebase.firestore();
  var query4articulos = db.collection("sucursal").doc(sucursalUsuario).collection("articulos");
  let operadorStock;
  let compuestaPrecio;

  operadorPrecio = $$('#consulta-compuesta-precio').val();
  compuestaPrecio = parseInt($$('#consultar-por-precio-compuesta').val());
  compuestaStock = parseInt($$('#consultar-por-stock-compuesta').val());
  operadorStock = $$('#query4articulos').val();

  if (operadorStock == "menor") {
    console.log('se asigno menor: ' + operadorStock);
    operadorStock = "<";
    console.log('se asigno menor: ' + operadorStock);
  }
  else if (operadorStock == "mayor") {
    console.log('se asigno mayor :' + operadorStock);
    operadorStock = ">";
  } else if (operadorStock == ">=") {
    compuestaStock = 0;
  }

  let debePintarlo;
  let compuestaCategoria = $$("#autocomplete-dropdown-categorias").val();
  let ComputestaMarca = $$("#autocomplete-dropdown-marcas").val();

  if (ComputestaMarca == "") {

    query4articulos = query4articulos.where('categoria', '==', compuestaCategoria).where('stock', operadorStock, compuestaStock);
  } else if (compuestaCategoria == "") {
    query4articulos = query4articulos.where('marca', '==', ComputestaMarca).where('stock', operadorStock, compuestaStock);
  } else {
    query4articulos = query4articulos.where('marca', '==', ComputestaMarca).where('categoria', '==', compuestaCategoria).where('stock', operadorStock, compuestaStock);
  }


  var filaAinsertar = "";
  var valorConsultaArealizar = ComputestaMarca + " " + compuestaCategoria;

  query4articulos
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        var descripcion = doc.data().descripcion;
        var talles = doc.data().talles;
        var marca = doc.data().marca;
        var precio = doc.data().precio;
        var stock = doc.data().stock;
        var idArticulo = doc.data().id_articulo;
        console.log('entro foreach query4articulos');

        paralistadepreciosStockYpRECIO += '<p> ID:' + idArticulo + '- Stock: ' + stock + '  - ' + descripcion + ' - $ ' + precio + '</p>';

        paralistadeprecios += '<p> ID:' + idArticulo + ' - ' + descripcion + ' - $ ' + precio + '</p>';

        paralistadepreciosStock += '<p> ID:' + idArticulo + ' - ' + descripcion + ' - Stock: ' + stock + '</p>';




        if ($$('#consulta-compuesta-precio').val() == ">=") {
          if (precio >= 0) {
            console.log('entro 1 if');
            console.log("valor operador: " + operadorStock);
            console.log("valor consulta numero stock: " + compuestaStock);
            debePintarlo = true;
            filaAinsertar += '<tr><td class="label-cell" id="descripcion' + idArticulo + '">' + descripcion + '</td><td class="numeric-cell">' + stock + '</td><td class="numeric-cell">$ ' + precio + '</td></tr>';
          }
        } else if ($$('#consulta-compuesta-precio').val() == "mayor") {
          if (precio > compuestaPrecio) {
            console.log('entro 2 if');
            debePintarlo = true;
            filaAinsertar += '<tr><td class="label-cell" id="descripcion' + idArticulo + '">' + descripcion + '</td><td class="numeric-cell">' + stock + '</td><td class="numeric-cell">$ ' + precio + '</td></tr>';
          }
        } else if ($$('#consulta-compuesta-precio').val() == "menor") {
          if (precio < compuestaPrecio) {
            console.log('entro 3 if');
            debePintarlo = true;
            filaAinsertar += '<tr><td class="label-cell" id="descripcion' + idArticulo + '">' + descripcion + '</td><td class="numeric-cell">' + stock + '</td><td class="numeric-cell">$ ' + precio + '</td></tr>';
          }
        }



      });

      tablacompleta = '<div class="col-100"><div class="data-table card"><table><thead><thead><tr><th class="label-cell"><b>' + valorConsultaArealizar.toUpperCase() + '</b> <br> <br>Descripción  </th><th class="numeric-cell"><br><br>stock</th><th class="numeric-cell"><br><br>precio</th></tr></thead></thead><tbody id="cuerpotabla">' + filaAinsertar + '</tbody></table></div>';
      $$("#bodyconsultas").append(tablacompleta);


    })
    .catch(function (error) {
      console.log("Error getting documents: ", error);
    });

}


//-------------------------------------------------------------------------------------------------------------------
// funciones de pagina de CONSULTAS
//-------------------------------------------------------------------------------------------------------------------


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

  var email = $$('#emailIN').val();

  var password = $$('#passwordIN').val();
  //var email = "usuario@dominio.com";
  // var password = "12345678";
  //esta funcion hace el SignIn Email Password

  firebase.auth().signInWithEmailAndPassword(email, password).then(function () {
    $$('#appbar').removeClass('d-none');
    console.log(email);
    console.log(password);
    mainView.router.navigate("/paginaPrincipal1/");
  }).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    alert('el error fue: ' + errorMessage);
    // ...
  })

  var db = firebase.firestore();

  var datosSucursal = {
    nombreSucursal: "sucursal2",
    direccion: "calle prueba 1",
    telefono: "11523377",
    horario: "9 a 18hs",
    usuarioCreador: email,

  }

  //db.collection("sucursal").doc(sucursalUsuario).collection("datosSucursal").doc("losDatos").set(datosSucursal);





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





/*
  //esta funcion obtiene los datos de los productos en base a su descripcion

  var docRef = db.collection("sucursal").doc("sucursal2").collection("categorias").doc("Remeras").collection("Adidas").doc("Remera adidas amarilla XL");

  docRef.get().then(function (doc) {
    if (doc.exists) {
              console.log("Document data:", doc.data());
    } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
    }
  }).catch(function (error) {
              console.log("Error getting document:", error);
  });
  //esta funcion obtiene los datos de los productos en base a su descripcion
 */


var contador = 1;
//var flickr="6062d00828a9b40e4b553470fa1c01e0";

document.addEventListener('DOMContentLoaded',init,false);

  function init() {
    var bloques = document.querySelectorAll(".bloque");
    var cuest = document.querySelectorAll("section");
    document.querySelector("input[name=crea]").addEventListener("click", addCuestionario);
    bloques.forEach(function(bloque) {
      addCruz(bloque);
    });

    cuest.forEach(function(cuest) {
      addFormPregunta(cuest);
      //addWikipedia(cuest.id,cuest.querySelector(".formulario")); //Para meter la info a los cuestionarios iniciales 
      //addFlickr(cuest.id, cuest.querySelector(".img"));
    });
  }
  function addCruz (bloque){
    // Obtener una referencia al elemento en el que se quiere insertar un nuevo nodo
    // Obtener una referencia al primer hijo
    //var theFirstChild = bloque.firstChild;

    var newElement=document.createElement("div");
    newElement.classList.add("borra");
    newElement.textContent= "\u2612";

    newElement.addEventListener("click",borraPregunta,false)
    //bloque.insertBefore(newElement, theFirstChild);
    insertAsFirstChild(bloque,newElement);

  }
  function addCuestionario(evento) {
    var formulario = document.querySelector("#nuevoCuestionario");
    var tema = formulario.querySelector("input[name=tema]");
    
    var imagen="https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57723/globe_east_540.jpg";
    if(tema.value == "" ) {
      window.alert("Rellene los huecos");
    } else {
      var cuestionario = document.createElement("section");
      var code="<encabezado-cuestionario data-tema=\""+ tema.value+"\"></encabezado-cuestionario>"
      //var code =  "<h2>" +
      //              "<img class=\"img\" src=\"" + imagen.value + "\" alt=\"Una imagen de " + tema.value + ".\">" + "Cuestionario sobre " + tema.value +
      //            "</h2>";
      cuestionario.setAttribute("id", "c" + contador);
      cuestionario.innerHTML = code;
      insertAsLastChild(document.body.querySelector("main"), cuestionario);
      var indice = document.body.querySelector("nav > ul"); //Cojo el ul que es donde está el indice
      var li = document.createElement("li");
      var a = document.createElement("a");
      var texto = document.createTextNode(tema.value);
      a.setAttribute("href", "#c" + contador);
      insertAsLastChild(a, texto); // A a ,le meto el texto
      insertAsLastChild(li, a);
      insertAsLastChild(indice, li);// y ya sería parte del índice
      addFormPregunta(cuestionario);
      //addWikipedia(tema.value, cuestionario.querySelector(".formulario")); // Le pasamos tema value, porque es el término a buscar,y el nodo que vamos a necesitar como padre
      //addFlickr(tema.value, cuestionario.querySelector(".img"));
      tema.value = "";
      imagen.value = "";
      contador++;
    }
  }
  function addPregunta(evento) {

    
    var cuestionario = queryAncestorSelector(this, "section");
    var formulario = queryAncestorSelector(this, ".formulario");
    var enunciado = formulario.querySelector("input[type=text]");
    var opcion = formulario.querySelector("input[type=\"radio\"]");
    if(enunciado.value == "") {
      window.alert("Introduzca un enunciado");
    } else {
      var bloque = document.createElement("div");
      bloque.classList.add("bloque");
      var code=  "<div class=\"pregunta\">" + enunciado.value +"</div>" + "<div class=\"respuesta\" data-valor=\"" + opcion.checked + "\"></div>";
      bloque.innerHTML = code;
      insertAsLastChild(cuestionario, bloque);
      //Inserto la cruz para poder eliminarlo
      addCruz(bloque);

      //Deja en blanco el campo del formulario y el boton se queda a true
      enunciado.value = "";
      opcion.checked = true;
    }
  }

  
function addFormPregunta(cuestionario) {
  var formulario = document.createElement("div");
  var tema = cuestionario.getAttribute("id");
  var code =  "<ul>" +
                "<li>" +
                  "<label>Enunciado de la pregunta:</label>" +
                  "<input type=\"text\" name=\"" + tema + "_pregunta\">" +
                "</li>" +
                "<li>" +
                  "<label>Respuesta:</label>" +
                  "<input type=\"radio\" name=\"" + tema + "_respuesta\" value=\"verdadero\" checked>Verdadero" +
                  "<input type=\"radio\" name=\"" + tema + "_respuesta\" value=\"falso\">Falso" +
                "</li>" +
                "<li>" +
                  "<input type=\"button\" value=\"Añadir nueva pregunta\">" +
                "</li>" +
              "</ul>";
  formulario.classList.add("formulario");
  formulario.innerHTML = code;
  formulario.querySelector("input[type=button]").addEventListener("click", addPregunta);
  insertBeforeChild(cuestionario, cuestionario.children[1], formulario);

  return formulario;
}
 /* function addWikipedia(cadena,formulario) {
    var cuestionario = queryAncestorSelector(formulario, "section");
    var informacion = document.createElement("div");
    informacion.classList.add("wiki");
    informacion.textContent = "";
    
    fetch('https://es.wikipedia.org/w/api.php?origin=*&format=json&action=query&prop=extracts&exintro&explaintext&continue&titles='+cadena)
    .then(function(response) {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    })
    //.then(function(str){  //Para quitar corchetes y numeros
      
    //  var replacement="";
    // })
    
    .then(function(responseAsObject) {
        for (page in responseAsObject.query.pages) {
          informacion.textContent += responseAsObject.query.pages[page].extract;
        }
      })
    .catch(function(error) {
      console.log('Ha habido un problema: \n', error);
    });
    insertBeforeChild(cuestionario, cuestionario.children[1], informacion);
  }
*/
/*
  function addFlickr (cadena,imagen){
    var cuestionario = queryAncestorSelector(imagen, "section");
    var src="https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57723/globe_east_540.jpg"; //La imagen del mundo de default
    
    fetch('https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=6062d00828a9b40e4b553470fa1c01e0&text='+cadena +'&format=json&per_page=10&media=photos&sort=relevance&nojsoncallback=1')
    .then(function(response) {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    }) 
    .then(function(responseAsObject){
           var id = responseAsObject.photos.photo[0].id;
           fetch('https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=6062d00828a9b40e4b553470fa1c01e0&photo_id=' + id + '&format=json&nojsoncallback=1')
           .then(function(response) {
            if (!response.ok) {
              throw Error(response.statusText);
            }
            return response.json();
          })
          .then(function(responseAsObject){
            return responseAsObject.sizes.size[0].source;
          })
          .then(function(url) {
            src = url;
            imagen.src = src;
            })
          .catch(function(error) {
              console.log('Ha habido un problema: \n', error);
            });
    })
    .catch(function(error) {
      console.log('Ha habido un problema: \n', error);
    });
    imagen.src=src;
  }
*/
  function borraPregunta(evento) {
    var nodopregunta=queryAncestorSelector(this, ".bloque");
    var cuestionario = queryAncestorSelector(this, "section");
    var indices = document.body.querySelectorAll("a");
    var tema = "#" + cuestionario.getAttribute("id");

    removeElement(nodopregunta);

    if(cuestionario.querySelector(".bloque") == null) { //Si el cuestionario no tiene preguntas
      removeElement(cuestionario);
      for(let i=0; i< indices.length;i++) { //Busca entre los indices
        var referencia=indices[i].getAttribute("href"); //Coge los href(#paris) y mira si coincide
        if(referencia == tema) {
          removeElement(indices[i]);
          break;
        }
      }
    }
  }
  function insertAsLastChild(padre,hijo) {
    padre.appendChild(hijo);
  }
  
  function insertAsFirstChild(padre,hijo) {
    var hijoprim = padre.children[0];
    padre.insertBefore(hijo, hijoprim);
  }
  
  function insertBeforeChild(padre,hijo,nuevoHijo) {
    padre.insertBefore(nuevoHijo, hijo);
  }
  
  function removeElement(nodo) {
    
    nodo.parentNode.removeChild(nodo);
  }

  function queryAncestorSelector (node,selector) {
    var parent= node.parentNode;
    var all = document.querySelectorAll(selector);
    var found= false;
    while (parent !== document && !found) {
      for (var i = 0; i < all.length && !found; i++) {
        found= (all[i] === parent)?true:false;
      }
      parent= (!found)?parent.parentNode:parent;
    }
    return (found)?parent:null;
  }






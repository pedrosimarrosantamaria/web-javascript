(function() {
    const template = document.createElement('template');
  
    template.innerHTML = `
    <style>
        .wiki{
            font-size: 90%;
        }
        img{
            width: 50px;
            height: 50px;
            margin-right: 10px;
            border-color: gray;
            border-width: 1px;
            border-style: solid;
            vertical-align: text-top;
        }
        h2{
            font-size: 25px;
            font-weight: bold  ;
        }
    </style>
    

      <script>
        console.log("Template instanciado");
      </script>
    <h2>
        <img class="img"  >
    </h2>`;
  
    class Cuestionario extends HTMLElement {
      constructor() {
        super();
        let clone = template.content.cloneNode(true);
        let shadowRoot = this.attachShadow({
          mode: 'open'
        });
        shadowRoot.appendChild(clone);
      }
  
      connectedCallback() {
        var a=this;
        a.tema= this.hasAttribute('data-tema')?this.getAttribute('data-tema'):0;
        var valor=a.tema
        var texto = document.createTextNode("Cuestionario sobre "+valor);
        //var cuestionario = queryAncestorSelector(formulario, "section");
        var informacion = document.createElement("div");
        informacion.classList.add("wiki");
        informacion.textContent = "";
        var src="https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57723/globe_east_540.jpg"; //La imagen del mundo de default


        let img= a.shadowRoot.querySelector('img');
        let h2= a.shadowRoot.querySelector('h2');
        
        fetch('https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=6062d00828a9b40e4b553470fa1c01e0&text='+valor +'&format=json&per_page=10&media=photos&sort=relevance&nojsoncallback=1')
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
                img.src = src;
                })
              .catch(function(error) {
                  console.log('Ha habido un problema: \n', error);
                });
        })
        .catch(function(error) {
          console.log('Ha habido un problema: \n', error);
        });
        img.src=src;

        img.setAttribute("src",img.src);
        img.setAttribute("alt",valor);
        h2.appendChild(texto);
        
        fetch('https://es.wikipedia.org/w/api.php?origin=*&format=json&action=query&prop=extracts&exintro&explaintext&continue&titles='+valor)
        .then(function(response) {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return response.json();
        })
        .then(function(responseAsObject) {
            for (var page in responseAsObject.query.pages) {
              informacion.textContent += responseAsObject.query.pages[page].extract;
            }
            return informacion.textContent;
          })
        //.then(function(respuesta){
        //    var regex = /\b'['/g;
        //  var replacement = '';
        //    var result = respuesta.replace(regex, replacement);
        //    document.write(result);
       // }
        
        //)
        .catch(function(error) {
          console.log('Ha habido un problema: \n', error);
        });
        
        this.shadowRoot.appendChild(informacion);


      }
    }
  
    customElements.define("encabezado-cuestionario", Cuestionario);
  
  })();



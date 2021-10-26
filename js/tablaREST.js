document.addEventListener('DOMContentLoaded', main);

function main () { 
   "use strict";
   //Se declara contante el link a la API donde se almacenan los datos.
   const url = `https://60c29691917002001739d3ba.mockapi.io/api/v1/catalogoPedidos`;
   //Constante que determina la cantidad de objetos que se mostraran en cada pagina.
   const limItems = 10;
   //Variable para controlar el numero de pagina.
   let pagina = 1;
   //Variable donde se almacena la cantidad de paginas que ocupa el JSON.
   let cantPaginas = 0;
  
   //LLamada a la funcion que crea la tabla en el DOM con los datos de la API.
   cargarTabla(pagina);

   //Funcion encargada de la paginacion de la tabla.
   function paginarURL (val) {
      if (val === 1){
         if (pagina < cantPaginas) {
            document.querySelector("#btn-Anterior").classList.remove("desactivado");
            document.querySelector("#btn-Primero").classList.remove("desactivado");
         }
         pagina++;
         cargarTabla(pagina);
         if (pagina === cantPaginas){
            document.querySelector("#btn-Siguiente").classList.add("desactivado");
            document.querySelector("#btn-Ultimo").classList.add("desactivado");
         }
      } else if (pagina > 1) {
         if (pagina === cantPaginas) {
            document.querySelector("#btn-Siguiente").classList.remove("desactivado");
            document.querySelector("#btn-Ultimo").classList.remove("desactivado");
         }
         pagina--;
         cargarTabla(pagina);
         if (pagina === 1){
            document.querySelector("#btn-Anterior").classList.add("desactivado");
            document.querySelector("#btn-Primero").classList.add("desactivado");
         }
      }
   }
  
   //Esta funcion elimina los datoas que pudieran haber quedado cargados en los inputs y los deja listos
   //para una nueva carga.
   function limpiarInputs(){
      let entradas = document.getElementsByTagName("input");
      for (let x = 0; x < entradas.length; x++){
         entradas[x].value = "";
      }
      let select = document.getElementById("itemsCol");
      select.selectedIndex = 0;
   }

   //Funcion para buscar pedidos, lo hace localmente, sin recargar la tabla desde la API.
   function buscarPedido(col, datoBuscado){
      document.querySelector("#btn-quitarFiltro").classList.remove("ocultar");
      //Se oculta el boton btn-nuevoPedido
      document.querySelector("#btn-nuevoPedido").classList.add("ocultar");
      document.querySelector("#btn-Anterior").classList.add("ocultar");
      document.querySelector("#btn-Siguiente").classList.add("ocultar");
      document.querySelector("#txtPaginacion").classList.add("ocultar");
      document.querySelector("#btn-Primero").classList.add("ocultar");
      document.querySelector("#btn-Ultimo").classList.add("ocultar");
      let tag = "";
      switch (col) {
         case "Marca":
            tag = "#marcaTd";
            break;
         case "Modelo":
            tag = "#modeloTd";
            break;
         case "Color":
            tag = "#colorTd";
            break;
         case "Nombre":
            tag = "#nombreTd";
            break;
         case "Apellido":
            tag = "#apellidoTd";
            break;
         case "Email":
            tag = "#emailTd";
            break;
         default:
            break;
      }
      //Se selecciona el cuerpo de la tabla y se crean las variables de control.
      let tabla = document.querySelector("#cuerpoTabla");
      let tablita = document.querySelectorAll(`${tag}`);
      let x = 0;
      let y = tablita.length;
      let fila = document.getElementById("cuerpoTabla").getElementsByTagName("tr");
      let esDatoBuscado = false;
      //Mientras la variable x sea menor que el largo del arreglo de elementos tr, busca el contenido dentro
      //de la tabla, y les aplica el estilo "display = none" a los que no coinciden.
      while (x < y){
         let dato = tablita[x].innerHTML;
         if (dato.toLowerCase() != datoBuscado.toLowerCase()){
            fila[x].classList.add("ocultar");
            tablita = document.querySelectorAll(`${tag}`);  
            y = tablita.length;
            x++;
         }
         else{
            esDatoBuscado = true;
            x++;
         }
      }
      //La variable booleana esDatoBuscado cambia a true cuando encuentra algun dato. Esta parte del codigo lo que 
      //hace es mostrar un mensaje indicando que no hay datos en la tabla que coicidan con la busqueda.
      if (esDatoBuscado === false){
         quitarFiltro(col, datoBuscado);
         mostrarMensajeInfo("avisoNoEncontrado", datoBuscado.toUpperCase());
      }
      else {
         //Esta parte de la funcion, selecciona todos los botones borrar del DOM y queda a la espera del click para 
         //eliminar el dato de la fila mediante la funcion eliminar datos.
         let btnBorrar = document.querySelectorAll("#btn-borrar");
            for (let x = 0; x < btnBorrar.length; x++) {
               btnBorrar[x].onclick = function() {
                  let idEd = parseInt(this.dataset.id);
                  mostrarMensajeInfo("avisoBorrar", idEd);
                  document.querySelector("#btn-eliminar").classList.remove("ocultar");
                  //Una vez hecho el click en el boton eliminar, se elimina la fila de la tabla creada en el DOM
                  //y se llama a la fucnion eliminarDato que se encarga de hacer lo propio en el JSON.
                  document.querySelector("#btn-eliminar").onclick = function (){
                     tabla.deleteRow(x);
                     modalContainerMensaje.classList.remove("mostrar");
                     eliminarDato(idEd);
                     };  
               }
            }  
         //Similar a la porcion anterior del codigo pero con el boton editar.
         let btnEditar = document.querySelectorAll("#btn-edit");
         let buscarDato = true;
         for (let j = 0; j < btnEditar.length; j++) {
               btnEditar[j].onclick = function() {
               let idEd = parseInt(this.dataset.id);
               document.querySelector("#modalContainerEdicion").classList.add("mostrar");
               document.querySelector("#legendEditar").innerHTML = `Editar Item ${idEd}`;
               let trTabla = document.getElementById(`${idEd}`);
                  document.querySelector("#marcaEd").value = trTabla.querySelector("#marcaTd").textContent;
                  document.querySelector("#modeloEd").value = trTabla.querySelector("#modeloTd").textContent;
                  document.querySelector("#colorEd").value = trTabla.querySelector("#colorTd").textContent;
                  document.querySelector("#nombreEd").value = trTabla.querySelector("#nombreTd").textContent;
                  document.querySelector("#apellidoEd").value = trTabla.querySelector("#apellidoTd").textContent;
                  document.querySelector("#mailEd").value = trTabla.querySelector("#emailTd").textContent; 
               document.querySelector("#cerrarEdPedido").addEventListener("click", function (e){
                  e.preventDefault();
                  modalContainerEdicion.classList.remove("mostrar");});
               //Cuando se hace click en btn.guardar se llama a la funcion editarDato con los valores de id,
               //dato para buscar en la tabla, columna en donde buscar y el booleano datoBuscado para diferenciar
               //esta ejecucion de la que se hace en la funcion cargarTabla.
               document.querySelector("#btn-guardar").onclick = function (e){
                  e.preventDefault();
                  modalContainerEdicion.classList.remove("mostrar");
                  editarDato(idEd, buscarDato, col, datoBuscado);
               };  
            }
         }
      } 
   }   
   
   //Esta funcion quita de los filtro que se hayan credo y muestra la tabla completa nuevamente.  
   function quitarFiltro(col, datoBuscado){
      let tag = "";
      document.querySelector("#btn-Anterior").classList.remove("ocultar");
      document.querySelector("#btn-Siguiente").classList.remove("ocultar");
      document.querySelector("#txtPaginacion").classList.remove("ocultar");
      document.querySelector("#btn-Primero").classList.remove("ocultar");
      document.querySelector("#btn-Ultimo").classList.remove("ocultar");
      switch (col) {
         case "Marca":
            tag = "#marcaTd";
            break;
         case "Modelo":
            tag = "#modeloTd";
            break;
         case "Color":
            tag = "#colorTd";
            break;
         case "Nombre":
            tag = "#nombreTd";
            break;
         case "Apellido":
            tag = "#apellidoTd";
            break;
         case "Email":
            tag = "#emailTd";
            break;
         default:
            break;
      }
      let tablita = document.querySelectorAll(`${tag}`);
      let x = 0;
      let y = tablita.length;
      let fila = document.getElementById("cuerpoTabla").getElementsByTagName("tr");
      while (x < y){
         if (tablita[x].innerHTML != datoBuscado){
            fila[x].classList.remove("ocultar");
            tablita = document.querySelectorAll(`${tag}`);  
            y = tablita.length;
            x++;
         }
         else
            x++;
      };
      document.querySelector("#btn-quitarFiltro").classList.add("ocultar");
      cargarTabla(pagina);
   }

   //Funcion para mostrar los mensajes de salida del control seleccionado.
   function mostrarMensajeInfo(rta, dato){
      let texto = "";
      switch (rta) {
         case "modifDato200":
            texto = `Item #${dato} modificado con exito.`;
            break;
         case "elimDato200":
            texto = `Item #${dato} eliminado con exito.`;
            break;
         case "nuevoDato200":
            texto = "Nuevo pedido agregado con exito.";
            break;
         case "500":
            texto = "500 - Server Error.";
            break;
         case "campoVacio":
            texto = "Todos los campos deben estar completos.";
            break;
         case "campoBuscadoVacio": 
            texto = "El campo de busqueda no puede estar vacio.";
            document.querySelector("#btn-quitarFiltro").classList.remove("ocultar");
            document.querySelector("#btn-nuevoPedido").classList.add("ocultar");
            break;
         case "avisoBorrar":
            texto = `El elemento id #${dato} sera eliminado, ¿esta seguro?`;
            break;
         case "avisoNoEncontrado": 
            texto = `No se encuentran pedidos para ${dato}.`;
            document.querySelector("#btn-quitarFiltro").classList.remove("ocultar");
            document.querySelector("#btn-nuevoPedido").classList.add("ocultar");
            break;
         default:
            break;
      }
      //Se toma control del modal del mensaje y se muesta el que corresponde segun la variable rta.
      document.querySelector("#modalContainerMensaje").classList.add("mostrar");
      textoMsje.textContent = texto;
      document.querySelector("#btn-eliminar").classList.add("ocultar");
      document.querySelector("#cerrarMsje").addEventListener("click", function (e){
         e.preventDefault();
         modalContainerMensaje.classList.remove("mostrar");});
   }

   //Funcion que carga la tabla en el DOM con los datos obtenidos de la API.
   async function cargarTabla(pag){
      let lista = document.querySelector("#cuerpoTabla");
      lista.innerHTML = "";
      let link = `${url}/?page=${pag}&limit=${limItems}`;
      try {
         let res = await fetch(link);
         let json = await res.json(); 
         //Por cada dato del JSON se crean los distintos elementos que componen la tabla.
            for (let datos of json) {
               let detalle = document.createElement("tr");
               detalle.setAttribute(`id`,`${datos.id}`);
               let idNro = datos.id;
               let idTd = document.createElement("td");
               idTd.setAttribute("id","idTd");
               detalle.appendChild(idTd);
               idTd.textContent = idNro;
               let marca = datos.marca;
               let marcaTd = document.createElement("td");
               marcaTd.setAttribute("id","marcaTd");
               detalle.appendChild(marcaTd);
               marcaTd.textContent = marca;
               let modelo = datos.modelo;
               let modeloTd = document.createElement("td");
               modeloTd.setAttribute("id","modeloTd");
               modeloTd.textContent = modelo;
               detalle.appendChild(modeloTd);
               let color = datos.color;
               let colorTd = document.createElement("td");
               colorTd.setAttribute("id","colorTd");
               colorTd.textContent = color;
               detalle.appendChild(colorTd);
               let nombre = datos.nombre;
               let nombreTd = document.createElement("td");
               nombreTd.setAttribute("id","nombreTd");
               nombreTd.textContent = nombre;
               detalle.appendChild(nombreTd);
               let apellido = datos.apellido;
               let apellidoTd = document.createElement("td");
               apellidoTd.setAttribute("id","apellidoTd");
               apellidoTd.textContent = apellido;
               detalle.appendChild(apellidoTd);
               let email = datos.email;
               let emailTd = document.createElement("td");
               emailTd.setAttribute("id","emailTd");
               emailTd.textContent = email;
               detalle.appendChild(emailTd);
               lista.appendChild(detalle);
               //Se crean los botones EDITAR y BORRAR.
               let btnEditTd = document.createElement("td");
               btnEditTd.innerHTML = `<button type="submit" class="btn-edit" id="btn-edit" data-id="${idNro}"></button>`;
               detalle.appendChild(btnEditTd);
               let btnBorrarTd = document.createElement("td");
               btnBorrarTd.innerHTML = `<button type="submit" class="btn-borrar" id="btn-borrar" data-id="${idNro}"></button>`;
               detalle.appendChild(btnBorrarTd);
               lista.appendChild(detalle);
            }
         } catch (error) {
            console.log(error);
         }
         //Con el llamado a esta funcion se hace un fecth de la API completa para 
         //poder contar la cantidad elemntos y saber la cantidad de paginas.
         contarPaginas();
         //Similares al codigo en la funcion buscarPedido.
         let btnBorrar = document.querySelectorAll("#btn-borrar");
         for (let x = 0; x < btnBorrar.length; x++) {
            btnBorrar[x].onclick = function() {
               let idEd = parseInt(this.dataset.id);
               mostrarMensajeInfo("avisoBorrar", idEd);
               document.querySelector("#btn-eliminar").classList.remove("ocultar");
               document.querySelector("#btn-eliminar").onclick = function (){
                  lista.deleteRow(x);
                  modalContainerMensaje.classList.remove("mostrar");
                  eliminarDato(idEd);
               }  
            }
         }  
         //Similares al codigo en la funcion buscarPedido.
         let btnEditar = document.querySelectorAll("#btn-edit");
         let busDato = false;
         for (let j = 0; j < btnEditar.length; j++) {
               btnEditar[j].onclick = function() {
               let idEd = parseInt(this.dataset.id);
               document.querySelector("#modalContainerEdicion").classList.add("mostrar");
               document.querySelector("#legendEditar").innerHTML = `Editar Item ${idEd}`;
               //Se toman los datos del item seleccionado desde la tabla para poder hacer una pre-carga
               //del formulario de edicion.
               let trTabla = document.getElementById(`${idEd}`);
                  document.querySelector("#marcaEd").value = trTabla.querySelector("#marcaTd").textContent;
                  document.querySelector("#modeloEd").value = trTabla.querySelector("#modeloTd").textContent;
                  document.querySelector("#colorEd").value = trTabla.querySelector("#colorTd").textContent;
                  document.querySelector("#nombreEd").value = trTabla.querySelector("#nombreTd").textContent;
                  document.querySelector("#apellidoEd").value = trTabla.querySelector("#apellidoTd").textContent;
                  document.querySelector("#mailEd").value = trTabla.querySelector("#emailTd").textContent; 
               document.querySelector("#cerrarEdPedido").addEventListener("click", function (e){
                  e.preventDefault();
                  modalContainerEdicion.classList.remove("mostrar");});
               document.querySelector("#btn-guardar").onclick = function (e){
                  e.preventDefault();
                  modalContainerEdicion.classList.remove("mostrar");
                  editarDato(idEd, busDato);
               }  
            }
         }
   }

   //Funcion encargada de contar los registros para calcular la cantinda de paginas a mostrar.
   async function contarPaginas() {
      try{
         let resPagina = await fetch(url);
         let json = await resPagina.json(); 
         let tamJASON = json.length;
         let auxCantPag = cantPaginas;
         //De acuerdo a la cantidad de elementos, se calcula la cantidad de paginas que se veran.
         //Aqui tambien se controla que no se excedan los limites de la cantidad de paginas y no de 
         //error la paginacion. 
         if ((tamJASON % limItems) === 0) {
            cantPaginas = (tamJASON / limItems);
            if (auxCantPag < cantPaginas){
               document.querySelector("#btn-Siguiente").classList.remove("desactivado");
               document.querySelector("#btn-Ultimo").classList.remove("desactivado");
            }
            else if (auxCantPag > cantPaginas){
               document.querySelector("#btn-Siguiente").classList.add("desactivado");
               document.querySelector("#btn-Ultimo").classList.add("desactivado");
            }     
         } else {
            cantPaginas = Math.trunc((tamJASON / limItems)) + 1;
            if (auxCantPag < cantPaginas){
               document.querySelector("#btn-Siguiente").classList.remove("desactivado");
               document.querySelector("#btn-Ultimo").classList.remove("desactivado");
            }
            else if (auxCantPag > cantPaginas){
               document.querySelector("#btn-Siguiente").classList.add("desactivado");
               document.querySelector("#btn-Ultimo").classList.add("desactivado");
            }     
         }
         
      } catch (error) {
         console.log(error);
      }
      document.querySelector("#txtPaginacion").innerHTML = `<p>Pagina ${pagina} de ${cantPaginas}.</p>`;
   }

   //Funcion encargada de editar los datos presentes en la fila de la tabla seleccionada.
   async function editarDato(idEdit, busDato, colBus, datBus){
      let marcaEd = document.querySelector("#marcaEd").value;
      let modeloEd = document.querySelector("#modeloEd").value;
      let colorEd = document.querySelector("#colorEd").value;
      let nombreEd = document.querySelector("#nombreEd").value;
      let apellidoEd = document.querySelector("#apellidoEd").value;
      let emailEd = document.querySelector("#mailEd").value;
      let datoEditado = {
         "id": idEdit,
         "marca": marcaEd,
         "modelo": modeloEd,
         "color": colorEd,
         "nombre": nombreEd,
         "apellido": apellidoEd,
         "email": emailEd,
      }
      //Se general el link al dato en el JSON ubicado en la API.
      let link = (`https://60c29691917002001739d3ba.mockapi.io/api/v1/catalogoPedidos/${idEdit}`); //CAMBIO PAG
      try {
         let res = await fetch(link);
         let json = await res.json();
            //Mediante el verbo PUT se modifican los datos en el JSON
            let res1 = await fetch(link, {
               "method": "PUT",
               "headers": { "Content-type": "application/json" },
               "body": JSON.stringify(datoEditado)
            });
            //Se evaluan los codigos de respuesta o error y se muesta el mensaje correspondiente
            //mediante la funcion mostrarMensajeInfo.
            if ((res1.status == 200) || (res1.status == 201)){
               mostrarMensajeInfo("modifDato200", idEdit);
               limpiarInputs();
               if (busDato == false){
                  document.querySelector("#cuerpoTabla").innerHTML = "";
                  await cargarTabla(pagina);
               }
               else {
                  await cargarTabla(pagina);
                  buscarPedido(colBus, datBus);
               }
            } else if (res1.status == 500) {
               mostrarMensajeInfo("500");
               limpiarInputs();
            }
      } catch (error) {
         console.log(error);
      }   
   }

   //Esta funcion es la encargada de elimanar el objeto seleccionado en la tabla del JSON.
   async function eliminarDato(elimId){  
      try {
         let newUrl = (`${url}/` + elimId);
         let res = await fetch(newUrl, {
            "method": "DELETE",
         });

         if ((res.status == 200) || (res.status == 201)) {
            mostrarMensajeInfo("elimDato200", elimId);               
         } else if (res1.status == 500) {
            mostrarMensajeInfo("500");
            limpiarInputs();
         }
      } catch (error) {
         console.log(error);
      }
   }

   //Esta funcion es la encargada de cargar un nuevo item en el JSON.
   async function cargarNuevo(){
      let marca = document.querySelector("#marca").value;
      let modelo = document.querySelector("#modelo").value;
      let color = document.querySelector("#color").value;
      let nombre = document.querySelector("#nombre").value;
      let apellido = document.querySelector("#apellido").value;
      let email = document.querySelector("#mail").value;
      if ((marca == "") || (modelo == "") || (color == "") || (nombre == "") || (apellido == "") || (email == ""))
         mostrarMensajeInfo("campoVacio");
      else {
         //Se crea el nuevo objeto para agregar.
         let nuevoPedido = {
            "marca": marca,
            "modelo": modelo,
            "color": color,
            "nombre": nombre,
            "apellido": apellido,
            "email": email,
         }
         try {
            let res = await fetch(url, {
               "method": "POST",
               "headers": { "Content-type": "application/json" },
               "body": JSON.stringify(nuevoPedido)
            });
            //Se evaluan los codigos de respuesta o error y se muestra el mensaje correspondiente.
            if ((res.status == 200) || (res.status == 201)){
               mostrarMensajeInfo("nuevoDato200");
               document.querySelector("#cuerpoTabla").innerHTML = "";
               await cargarTabla(pagina);
            } else if (res.status == 500) {
               mostrarMensajeInfo("500");
               limpiarInputs();
            }
         } catch (error) {
            console.log(error);
         }   
      }
   }

   //Funcion encargada de agregar tres elementos del mismo tipo al JSON.
   async function cargarTres(){
      for (let index = 0; index < 3; index++) {
            await cargarNuevo();
      }
      limpiarInputs();
   }

   /*Se selecciona el boton btn-nuevoPedido y se queda a la escucha del click para mostrar la ventana
   modal de carga.*/
   document.querySelector("#btn-nuevoPedido").addEventListener("click", function(e){
      e.preventDefault(); 
      modalContainerCargar.classList.add("mostrar");
      });

   /*Al hacer click en el boton cerrarNuevoPedido se quita la clase "mostrar" en la ventana modal
   de carga.*/
   document.querySelector("#cerrarNuevoPedido").addEventListener("click", function(e){
      e.preventDefault();
      modalContainerCargar.classList.remove("mostrar");});

   //Esta seleccion del btn-cargar queda a la escucha de click para ejecutar la funcion cargarNuevo.
   document.querySelector("#btn-cargar").addEventListener("click", function(e){
      e.preventDefault(); 
      cargarNuevo();
      limpiarInputs();
      modalContainerCargar.classList.remove("mostrar");});

   //Al hacer click en este boton, se ejecuta la funcion cargarTres.
   document.querySelector("#btn-cargarTres").addEventListener("click", function(e){
      e.preventDefault(); cargarTres();
      modalContainerCargar.classList.remove("mostrar");});

   /*Se selecciona el boton btn-buscar y se queda a la escucha del click para mostrar la ventana
   modal de busqueda.*/
   document.querySelector("#btn-buscar").addEventListener("click", function(e){
      e.preventDefault(); 
      modalContainerBuscar.classList.add("mostrar");
      });

   /*Se selecciona el boton btn-buscarPedido del modal de busqueda anterior y se queda a la escucha del
   click para iniciar la busqueda.*/
   document.querySelector("#btn-buscarPedido").addEventListener("click", function(e){
      e.preventDefault(); 
      let columna = document.querySelector("#itemsCol").value;
      let datoABuscar = document.querySelector("#busqueda").value;
      //Si el campo input esta en vacio se muestra un mensaje de error.
      if (datoABuscar == ""){         
         mostrarMensajeInfo("campoBuscadoVacio");
         modalContainerBuscar.classList.remove("mostrar");
      }
      else {
         //Se ejecuta la funcion buscarPedido con los datos obtenidos de los inputs de la ventana de busqueda.
         buscarPedido(columna, datoABuscar);
         modalContainerBuscar.classList.remove("mostrar");
         limpiarInputs();
      }
   });

   
   /*Al hacer click en el boton cerrarBusqueda se quita la clase "mostrar" en la ventana modal
   de busqueda.*/
   document.querySelector("#cerrarBusqueda").addEventListener("click", function(e){
      e.preventDefault();
      limpiarInputs();
      modalContainerBuscar.classList.remove("mostrar");});

   /*Se selecciona el bton quitarFiltro y se queda a la escucha del click para quitar la seleccion 
   hecha por el filtro y que se vuelvan a mostrar los items ocultos.*/
   document.querySelector("#btn-quitarFiltro").classList.add("ocultar");
   document.querySelector("#btn-quitarFiltro").addEventListener("click", function(e){
      let col = document.querySelector("#itemsCol").value;
      let dato = document.querySelector("#busqueda").value;
      e.preventDefault(); quitarFiltro(col, dato);
      document.querySelector("#btn-nuevoPedido").classList.remove("ocultar");
     });

   //Se desactiva el boton anterior para evitar un error al intentar cargar la pagina "-1".
   document.querySelector("#btn-Anterior").classList.add("desactivado");
   //Se selecciona el btn-Anterior y se queda a la escucha del click.
   document.querySelector("#btn-Anterior").addEventListener("click", function(e){
      e.preventDefault(); paginarURL(-1);
   });
   //Se selecciona el btn-Siguiente y se queda a la escucha del click.
   document.querySelector("#btn-Siguiente").addEventListener("click", function(e){
      e.preventDefault(); paginarURL(1);
   });

   //Aqui se controla la funcion del boton primero. Este boton muestra automaticamente la
   //primer pagina y desactiva los botones "primero" y "Anterior".
   document.querySelector("#btn-Primero").classList.add("desactivado");
   document.querySelector("#btn-Primero").addEventListener("click", function(e){
      document.querySelector("#btn-Anterior").classList.add("desactivado");
      document.querySelector("#btn-Primero").classList.add("desactivado");
      document.querySelector("#btn-Siguiente").classList.remove("desactivado");
      document.querySelector("#btn-Ultimo").classList.remove("desactivado");
      e.preventDefault(); cargarTabla(1); pagina = 1;
   });

   //Aqui se controla la funcion del boton primero. Este boton muestra automaticamente la
   //primer pagina y desactiva los botones "ultimo" y "Siguiente".
   document.querySelector("#btn-Ultimo").addEventListener("click", function(e){
      document.querySelector("#btn-Siguiente").classList.add("desactivado");
      document.querySelector("#btn-Ultimo").classList.add("desactivado");
      document.querySelector("#btn-Anterior").classList.remove("desactivado");
      document.querySelector("#btn-Primero").classList.remove("desactivado");
      e.preventDefault(); cargarTabla(cantPaginas); pagina = cantPaginas;
   });
}  

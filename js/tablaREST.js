document.addEventListener('DOMContentLoaded', main);

function main() {
    "use strict";
    //Se declara contante el link a la API donde se almacenan los datas.
    const url = `https://60c29691917002001739d3ba.mockapi.io/api/v1/catalogoPedidos`;
    //Constante que determina la cantidad de objetos que se mostraran en cada pagina.
    const limitItems = 10;
    //Variable para controlar el numero de pagina.
    let page = 1;
    //Variable donde se almacena la cantidad de paginas que ocupa el JSON.
    let maxPages = 0;

    //LLamada a la funcion que crea la tabla en el DOM con los datas de la API.
    loadTable(page);

    //Funcion encargada de la paginacion de la tabla.
    function paginateURL(value) {
        if (value === 1) {
            if (page < maxPages) {
                document.querySelector("#button-previous").classList.remove("disabled");
                document.querySelector("#button-first").classList.remove("disabled");
            }
            page++;
            loadTable(page);
            if (page === maxPages) {
                document.querySelector("#button-incoming").classList.add("disabled");
                document.querySelector("#button-last").classList.add("disabled");
            }
        } else if (page > 1) {
            if (page === maxPages) {
                document.querySelector("#button-incoming").classList.remove("disabled");
                document.querySelector("#button-last").classList.remove("disabled");
            }
            page--;
            loadTable(page);
            if (page === 1) {
                document.querySelector("#button-previous").classList.add("disabled");
                document.querySelector("#button-first").classList.add("disabled");
            }
        }
    }

    //Esta funcion elimina los dataas que pudieran haber quedado cargados en los inputs y los deja listos
    //para una nueva carga.
    function cleanInputs() {
        let entrances = document.getElementsByTagName("input");
        for (let x = 0; x < entrances.length; x++) {
            entrances[x].value = "";
        }
        let select = document.getElementById("itemsColumn");
        select.selectedIndex = 0;
    }

    //Funcion para buscar pedidos, lo hace localmente, sin recargar la tabla desde la API.
    function searchOrder(column, dataSearched) {
        document.querySelector("#button-removeFilter").classList.remove("hide");
        //Se oculta el boton button-newOrder
        document.querySelector("#button-newOrder").classList.add("hide");
        document.querySelector("#button-previous").classList.add("hide");
        document.querySelector("#button-incoming").classList.add("hide");
        document.querySelector("#textPagination").classList.add("hide");
        document.querySelector("#button-first").classList.add("hide");
        document.querySelector("#button-last").classList.add("hide");
        let tag = "";
        switch (column) {
            case "brand":
                tag = "#brandTd";
                break;
            case "model":
                tag = "#modelTd";
                break;
            case "color":
                tag = "#colorTd";
                break;
            case "name":
                tag = "#nameTd";
                break;
            case "surname":
                tag = "#surnameTd";
                break;
            case "email":
                tag = "#emailTd";
                break;
            default:
                break;
        }
        //Se selecciona el cuerpo de la tabla y se crean las variables de control.
        let table = document.querySelector("#bodyTable");
        let littleTable = document.querySelectorAll(`${tag}`);
        let x = 0;
        let y = littleTable.length;
        let row = document.getElementById("bodyTable").getElementsByTagName("tr");
        let isDataSearched = false;
        //Mientras la variable x sea menor que el largo del arreglo de elementos tr, busca el contenido dentro
        //de la tabla, y les aplica el estilo "display = none" a los que no coinciden.
        while (x < y) {
            let data = littleTable[x].innerHTML;
            if (data.toLowerCase() != dataSearched.toLowerCase()) {
                row[x].classList.add("hide");
                littleTable = document.querySelectorAll(`${tag}`);
                y = littleTable.length;
                x++;
            } else {
                isDataSearched = true;
                x++;
            }
        }
        //La variable booleana isDataSearched cambia a true cuando encuentra algun data. Esta parte del codigo lo que 
        //hace es mostrar un mensaje indicando que no hay datas en la tabla que coicidan con la busqueda.
        if (isDataSearched === false) {
            removeFilter(column, dataSearched);
            showMessageInfo("noticeNotFound", dataSearched.toUpperCase());
        } else {
            //Esta parte de la funcion, selecciona todos los botones borrar del DOM y queda a la espera del click para 
            //eliminar el data de la fila mediante la funcion eliminar datas.
            let buttonDelete = document.querySelectorAll("#button-delete");
            for (let x = 0; x < buttonDelete.length; x++) {
                buttonDelete[x].onclick = function() {
                    let idEd = parseInt(this.dataset.id);
                    showMessageInfo("noticeDelete", idEd);
                    document.querySelector("#button-delete").classList.remove("hide");
                    //Una vez hecho el click en el boton eliminar, se elimina la fila de la tabla creada en el DOM
                    //y se llama a la funcion deleteData que se encarga de hacer lo propio en el JSON.
                    document.querySelector("#button-delete").onclick = function() {
                        tabla.deleteRow(x);
                        modalContainerMessage.classList.remove("show");
                        deleteData(idEd);
                    };
                }
            }
            //Similar a la porcion previous del codigo pero con el boton editar.
            let buttonEdit = document.querySelectorAll("#button-edit");
            let searchData = true;
            for (let j = 0; j < buttonEdit.length; j++) {
                buttonEdit[j].onclick = function() {
                    let idEd = parseInt(this.dataset.id);
                    document.querySelector("#modalContainerEdition").classList.add("show");
                    document.querySelector("#legendEdit").innerHTML = `Edit Item ${idEd}`;
                    let tresponseble = document.getElementById(`${idEd}`);
                    document.querySelector("#brandEd").value = tresponseble.querySelector("#brandTd").textContent;
                    document.querySelector("#modelEd").value = tresponseble.querySelector("#modelTd").textContent;
                    document.querySelector("#colorEd").value = tresponseble.querySelector("#colorTd").textContent;
                    document.querySelector("#nameEd").value = tresponseble.querySelector("#nameEd").textContent;
                    document.querySelector("#surnameEd").value = tresponseble.querySelector("#surnameTd").textContent;
                    document.querySelector("#mailEd").value = tresponseble.querySelector("#emailTd").textContent;
                    document.querySelector("#closeEdOrder").addEventListener("click", function(e) {
                        e.preventDefault();
                        modalContainerEdition.classList.remove("show");
                    });
                    //Cuando se hace click en button.save se llama a la funcion editData con los valueores de id,
                    //data para buscar en la tabla, column en donde buscar y el booleano dataSearched para diferenciar
                    //esta ejecucion de la que se hace en la funcion loadTable.
                    document.querySelector("#button-save").onclick = function(e) {
                        e.preventDefault();
                        modalContainerEdition.classList.remove("show");
                        editData(idEd, searchData, column, dataSearched);
                    };
                }
            }
        }
    }

    //Esta funcion quita de los filtro que se hayan credo y muestra la tabla completa nuevamente.  
    function removeFilter(column, dataSearched) {
        let tag = "";
        document.querySelector("#button-previous").classList.remove("hide");
        document.querySelector("#button-incoming").classList.remove("hide");
        document.querySelector("#textPagination").classList.remove("hide");
        document.querySelector("#button-first").classList.remove("hide");
        document.querySelector("#button-last").classList.remove("hide");
        switch (column) {
            case "brand":
                tag = "#brandTd";
                break;
            case "model":
                tag = "#modelTd";
                break;
            case "color":
                tag = "#colorTd";
                break;
            case "name":
                tag = "#nameTd";
                break;
            case "surname":
                tag = "#surnameTd";
                break;
            case "email":
                tag = "#emailTd";
                break;
            default:
                break;
        }
        let littleTable = document.querySelectorAll(`${tag}`);
        let x = 0;
        let y = littleTable.length;
        let row = document.getElementById("bodyTable").getElementsByTagName("tr");
        while (x < y) {
            if (littleTable[x].innerHTML != dataSearched) {
                row[x].classList.remove("hide");
                littleTable = document.querySelectorAll(`${tag}`);
                y = littleTable.length;
                x++;
            } else
                x++;
        };
        document.querySelector("#button-removeFilter").classList.add("hide");
        loadTable(page);
    }

    //Funcion para mostrar los mensajes de salida del control seleccionado.
    function showMessageInfo(response, data) {
        let text = "";
        switch (response) {
            case "modificateData200":
                text = `Item #${data} modificado con exito.`;
                break;
            case "deleteData200":
                text = `Item #${data} eliminado con exito.`;
                break;
            case "newData200":
                text = "Nuevo pedido agregado con exito.";
                break;
            case "500":
                text = "500 - Server Error.";
                break;
            case "blankInput":
                text = "Todos los campos deben estar completos.";
                break;
            case "blankSearch":
                text = "El campo de busqueda no puede estar vacio.";
                document.querySelector("#button-removeFilter").classList.remove("hide");
                document.querySelector("#button-newOrder").classList.add("hide");
                break;
            case "noticeDelete":
                text = `El elemento id #${data} sera eliminado, ¿esta seguro?`;
                break;
            case "noticeNotFound":
                text = `No se encuentran pedidos para ${data}.`;
                document.querySelector("#button-removeFilter").classList.remove("hide");
                document.querySelector("#button-newOrder").classList.add("hide");
                break;
            default:
                break;
        }
        //Se toma control del modal del mensaje y se muesta el que corresponde segun la variable response.
        document.querySelector("#modalContainerMessage").classList.add("show");
        textMessage.textContent = text;
        document.querySelector("#button-delete").classList.add("hide");
        document.querySelector("#closeMessage").addEventListener("click", function(e) {
            e.preventDefault();
            modalContainerMessage.classList.remove("show");
        });
    }

    //Funcion que carga la tabla en el DOM con los datas obtenidos de la API.
    async function loadTable(page) {
        let list = document.querySelector("#bodyTable");
        list.innerHTML = "";
        let link = `${url}/?page=${page}&limit=${limitItems}`;
        try {
            let res = await fetch(link);
            let json = await res.json();
            //Por cada data del JSON se crean los distintos elementos que componen la tabla.
            for (let datas of json) {
                let detail = document.createElement("tr");
                detail.setAttribute(`id`, `${datas.id}`);
                let idNumber = datas.id;
                let idTd = document.createElement("td");
                idTd.setAttribute("id", "idTd");
                detail.appendChild(idTd);
                idTd.textContent = idNumber;
                let brand = datas.brand;
                let brandTd = document.createElement("td");
                brandTd.setAttribute("id", "brandTd");
                detail.appendChild(brandTd);
                brandTd.textContent = brand;
                let model = datas.model;
                let modelTd = document.createElement("td");
                modelTd.setAttribute("id", "modelTd");
                modelTd.textContent = model;
                detail.appendChild(modelTd);
                let color = datas.color;
                let colorTd = document.createElement("td");
                colorTd.setAttribute("id", "colorTd");
                colorTd.textContent = color;
                detail.appendChild(colorTd);
                let name = datas.name;
                let nameTd = document.createElement("td");
                nameTd.setAttribute("id", "nameTd");
                nameTd.textContent = name;
                detail.appendChild(nameTd);
                let surname = datas.surname;
                let surnameTd = document.createElement("td");
                surnameTd.setAttribute("id", "surnameTd");
                surnameTd.textContent = apellido;
                detail.appendChild(surnameTd);
                let email = datas.email;
                let emailTd = document.createElement("td");
                emailTd.setAttribute("id", "emailTd");
                emailTd.textContent = email;
                detail.appendChild(emailTd);
                list.appendChild(detail);
                //Se crean los botones EDITAR y BORRAR.
                let buttonEditTd = document.createElement("td");
                buttonEditTd.innerHTML = `<button type="submit" class="button-edit" id="button-edit" data-id="${idNumber}"></button>`;
                detail.appendChild(buttonEditTd);
                let buttonDeleteTd = document.createElement("td");
                buttonDeleteTd.innerHTML = `<button type="submit" class="button-borrar" id="button-borrar" data-id="${idNumber}"></button>`;
                detail.appendChild(buttonDeleteTd);
                list.appendChild(detail);
            }
        } catch (error) {
            console.log(error);
        }
        //Con el llamado a esta funcion se hace un fecth de la API completa para 
        //poder contar la cantidad elemntos y saber la cantidad de paginas.
        countPages();
        //Similares al codigo en la funcion searchOrder.
        let buttonDelete = document.querySelectorAll("#button-borrar");
        for (let x = 0; x < buttonDelete.length; x++) {
            buttonDelete[x].onclick = function() {
                let idEd = parseInt(this.dataset.id);
                showMessageInfo("noticeDelete", idEd);
                document.querySelector("#button-delete").classList.remove("hide");
                document.querySelector("#button-delete").onclick = function() {
                    list.deleteRow(x);
                    modalContainerMessage.classList.remove("show");
                    deleteData(idEd);
                }
            }
        }
        //Similares al codigo en la funcion searchOrder.
        let buttonEdit = document.querySelectorAll("#button-edit");
        let searchedData = false;
        for (let j = 0; j < buttonEdit.length; j++) {
            buttonEdit[j].onclick = function() {
                let idEd = parseInt(this.dataset.id);
                document.querySelector("#modalContainerEdition").classList.add("show");
                document.querySelector("#legendEdit").innerHTML = `Edit Item ${idEd}`;
                //Se toman los datas del item seleccionado desde la tabla para poder hacer una pre-carga
                //del formulario de edicion.
                let tresponseble = document.getElementById(`${idEd}`);
                document.querySelector("#brandEd").value = tresponseble.querySelector("#brandTd").textContent;
                document.querySelector("#modelEd").value = tresponseble.querySelector("#modelTd").textContent;
                document.querySelector("#colorEd").value = tresponseble.querySelector("#colorTd").textContent;
                document.querySelector("#nameEd").value = tresponseble.querySelector("#nameEd").textContent;
                document.querySelector("#surnameEd").value = tresponseble.querySelector("#surnameEd").textContent;
                document.querySelector("#mailEd").value = tresponseble.querySelector("#emailTd").textContent;
                document.querySelector("#closeEdOrder").addEventListener("click", function(e) {
                    e.preventDefault();
                    modalContainerEdition.classList.remove("show");
                });
                document.querySelector("#button-save").onclick = function(e) {
                    e.preventDefault();
                    modalContainerEdition.classList.remove("show");
                    editData(idEd, searchedData);
                }
            }
        }
    }

    //Funcion encargada de contar los registros para calcular la cantinda de paginas a mostrar.
    async function countPages() {
        try {
            let responsePage = await fetch(url);
            let json = await responsePage.json();
            let sizeJson = json.length;
            let auxMaxPages = maxPages;
            //De acuerdo a la cantidad de elementos, se calcula la cantidad de paginas que se veran.
            //Aqui tambien se controla que no se excedan los limites de la cantidad de paginas y no de 
            //error la paginacion. 
            if ((sizeJson % limitItems) === 0) {
                maxPages = (sizeJson / limitItems);
                if (auxMaxPages < maxPages) {
                    document.querySelector("#button-incoming").classList.remove("disabled");
                    document.querySelector("#button-last").classList.remove("disabled");
                } else if (auxMaxPages > maxPages) {
                    document.querySelector("#button-incoming").classList.add("disabled");
                    document.querySelector("#button-last").classList.add("disabled");
                }
            } else {
                maxPages = Math.trunc((sizeJson / limitItems)) + 1;
                if (auxMaxPages < maxPages) {
                    document.querySelector("#button-incoming").classList.remove("disabled");
                    document.querySelector("#button-last").classList.remove("disabled");
                } else if (auxMaxPages > maxPages) {
                    document.querySelector("#button-incoming").classList.add("disabled");
                    document.querySelector("#button-last").classList.add("disabled");
                }
            }

        } catch (error) {
            console.log(error);
        }
        document.querySelector("#textPagination").innerHTML = `<p>Pagina ${pagina} de ${maxPages}.</p>`;
    }

    //Funcion encargada de editar los datas presentes en la fila de la tabla seleccionada.
    async function editData(idEdit, searchedData, columnBus, datBus) {
        let brandEd = document.querySelector("#brandEd").value;
        let modelEd = document.querySelector("#modelEd").value;
        let colorEd = document.querySelector("#colorEd").value;
        let nameEd = document.querySelector("#nameEd").value;
        let surnameEd = document.querySelector("#surnameEd").value;
        let emailEd = document.querySelector("#mailEd").value;
        let dataEdited = {
                "id": idEdit,
                "brand": brandEd,
                "model": modelEd,
                "color": colorEd,
                "name": nameEd,
                "surname": surnameEd,
                "email": emailEd,
            }
            //Se general el link al data en el JSON ubicado en la API.
        let link = (`https://60c29691917002001739d3ba.mockapi.io/api/v1/catalogoPedidos/${idEdit}`); //CAMBIO PAG
        try {
            let res = await fetch(link);
            let json = await res.json();
            //Mediante el verbo PUT se modifican los datas en el JSON
            let res1 = await fetch(link, {
                "method": "PUT",
                "headers": { "Content-type": "application/json" },
                "body": json.stringify(dataEdited)
            });
            //Se evalueuan los codigos de respuesta o error y se muesta el mensaje correspondiente
            //mediante la funcion showMessageInfo.
            if ((res1.status == 200) || (res1.status == 201)) {
                showMessageInfo("modificateData200", idEdit);
                cleanInputs();
                if (searchedData == false) {
                    document.querySelector("#bodyTable").innerHTML = "";
                    await loadTable(page);
                } else {
                    await loadTable(page);
                    searchOrder(columnBus, datBus);
                }
            } else if (res1.status == 500) {
                showMessageInfo("500");
                cleanInputs();
            }
        } catch (error) {
            console.log(error);
        }
    }

    //Esta funcion es la encargada de elimanar el objeto seleccionado en la tabla del JSON.
    async function deleteData(elimId) {
        try {
            let newUrl = (`${url}/` + elimId);
            let res = await fetch(newUrl, {
                "method": "DELETE",
            });

            if ((res.status == 200) || (res.status == 201)) {
                showMessageInfo("deleteData200", elimId);
            } else if (res1.status == 500) {
                showMessageInfo("500");
                cleanInputs();
            }
        } catch (error) {
            console.log(error);
        }
    }

    //Esta funcion es la encargada de cargar un nuevo item en el JSON.
    async function loadNew() {
        let brand = document.querySelector("#brand").value;
        let model = document.querySelector("#model").value;
        let color = document.querySelector("#color").value;
        let name = document.querySelector("#name").value;
        let surname = document.querySelector("#surname").value;
        let email = document.querySelector("#mail").value;
        if ((brand == "") || (model == "") || (color == "") || (name == "") || (surname == "") || (email == ""))
            showMessageInfo("blankInput");
        else {
            //Se crea el nuevo objeto para agregar.
            let newOrder = {
                "brand": brand,
                "model": model,
                "color": color,
                "name": name,
                "surname": surname,
                "email": email,
            }
            try {
                let res = await fetch(url, {
                    "method": "POST",
                    "headers": { "Content-type": "application/json" },
                    "body": JSON.stringify(newOrder)
                });
                //Se evalueuan los codigos de respuesta o error y se muestra el mensaje correspondiente.
                if ((res.status == 200) || (res.status == 201)) {
                    showMessageInfo("newData200");
                    document.querySelector("#bodyTable").innerHTML = "";
                    await loadTable(page);
                } else if (res.status == 500) {
                    showMessageInfo("500");
                    cleanInputs();
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    //Funcion encargada de agregar tres elementos del mismo tipo al JSON.
    async function loadThree() {
        for (let index = 0; index < 3; index++) {
            await loadNew();
        }
        cleanInputs();
    }

    /*Se selecciona el boton button-newOrder y se queda a la escucha del click para mostrar la ventana
    modal de carga.*/
    document.querySelector("#button-newOrder").addEventListener("click", function(e) {
        e.preventDefault();
        modalContainerLoad.classList.add("show");
    });

    /*Al hacer click en el boton closeNewOrder se quita la clase "show" en la ventana modal
    de carga.*/
    document.querySelector("#closeNewOrder").addEventListener("click", function(e) {
        e.preventDefault();
        modalContainerLoad.classList.remove("show");
    });

    //Esta seleccion del button-load queda a la escucha de click para ejecutar la funcion loadNew.
    document.querySelector("#button-load").addEventListener("click", function(e) {
        e.preventDefault();
        loadNew();
        cleanInputs();
        modalContainerLoad.classList.remove("show");
    });

    //Al hacer click en este boton, se ejecuta la funcion loadThree.
    document.querySelector("#button-loadThree").addEventListener("click", function(e) {
        e.preventDefault();
        loadThree();
        modalContainerLoad.classList.remove("show");
    });

    /*Se selecciona el boton button-search y se queda a la escucha del click para mostrar la ventana
    modal de busqueda.*/
    document.querySelector("#button-search").addEventListener("click", function(e) {
        e.preventDefault();
        modalContainerSearch.classList.add("show");
    });

    /*Se selecciona el boton button-searchOrder del modal de busqueda previous y se queda a la escucha del
    click para iniciar la busqueda.*/
    document.querySelector("#button-searchOrder").addEventListener("click", function(e) {
        e.preventDefault();
        let column = document.querySelector("#itemsColumn").value;
        let dataToSearch = document.querySelector("#search").value;
        //Si el campo input esta en vacio se muestra un mensaje de error.
        if (dataToSearch == "") {
            showMessageInfo("blankSearch");
            modalContainerSearch.classList.remove("show");
        } else {
            //Se ejecuta la funcion searchOrder con los datas obtenidos de los inputs de la ventana de busqueda.
            searchOrder(column, dataToSearch);
            modalContainerSearch.classList.remove("show");
            cleanInputs();
        }
    });


    /*Al hacer click en el boton closeSearch se quita la clase "show" en la ventana modal
    de busqueda.*/
    document.querySelector("#closeSearch").addEventListener("click", function(e) {
        e.preventDefault();
        cleanInputs();
        modalContainerSearch.classList.remove("show");
    });

    /*Se selecciona el bton removeFilter y se queda a la escucha del click para quitar la seleccion 
    hecha por el filtro y que se vuelvan a mostrar los items ocultos.*/
    document.querySelector("#button-removeFilter").classList.add("hide");
    document.querySelector("#button-removeFilter").addEventListener("click", function(e) {
        let column = document.querySelector("#itemsColumn").value;
        let data = document.querySelector("#search").value;
        e.preventDefault();
        removeFilter(column, data);
        document.querySelector("#button-newOrder").classList.remove("hide");
    });

    //Se desactiva el boton previous para evitar un error al intentar cargar la pagina "-1".
    document.querySelector("#button-previous").classList.add("disabled");
    //Se selecciona el button-previous y se queda a la escucha del click.
    document.querySelector("#button-previous").addEventListener("click", function(e) {
        e.preventDefault();
        paginateURL(-1);
    });
    //Se selecciona el button-incoming y se queda a la escucha del click.
    document.querySelector("#button-incoming").addEventListener("click", function(e) {
        e.preventDefault();
        paginateURL(1);
    });

    //Aqui se controla la funcion del boton first. Este boton muestra automaticamente la
    //primer pagina y desactiva los botones "first" y "previous".
    document.querySelector("#button-first").classList.add("disabled");
    document.querySelector("#button-first").addEventListener("click", function(e) {
        document.querySelector("#button-previous").classList.add("disabled");
        document.querySelector("#button-first").classList.add("disabled");
        document.querySelector("#button-incoming").classList.remove("disabled");
        document.querySelector("#button-last").classList.remove("disabled");
        e.preventDefault();
        loadTable(1);
        page = 1;
    });

    //Aqui se controla la funcion del boton first. Este boton muestra automaticamente la
    //primer pagina y desactiva los botones "last" e "incoming".
    document.querySelector("#button-last").addEventListener("click", function(e) {
        document.querySelector("#button-incoming").classList.add("disabled");
        document.querySelector("#button-last").classList.add("disabled");
        document.querySelector("#button-previous").classList.remove("disabled");
        document.querySelector("#button-first").classList.remove("disabled");
        e.preventDefault();
        loadTable(maxPages);
        page = maxPages;
    });
}
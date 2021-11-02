document.addEventListener('DOMContentLoaded', main);

function main() {
    "use strict";

    //Se declara la variable global que se utiliza para enviar el valor de los captcha
    //colocados por el sistema.
    let returnFirstCaptcha;

    //Se ejecuta la funcion que coloca el primer captcha al actualizar o cargar la pagina.
    firstCaptcha();
    //Se asigna el evento al boton enviar para que ejecute la funcion que verifica los captcha.
    let button = document.querySelector("#button-enviar");
    button.addEventListener("click", verifyCaptcha());

    //Esta funcion coloca el primer captcha al cargarse la pagina y retorna el valor del mismo.
    function firstCaptcha() {
        //Se genera un nro aleatorio entre 1 y 5 para decidir que imagen ira en el captcha.  
        let numberCaptcha = Math.floor((Math.random() * 5) + 1);
        //Se coloca el la imagen correspondiente en el cuadro de captcha.*/
        document.querySelector("#imageCaptcha").src = "../img/captcha/captcha" + numberCaptcha + ".jpg";
        returnFirstCaptcha = ("captcha" + numberCaptcha);
    }

    //Esta funcion compara el captcha ingresado por teclado con el mostrado por sistema.
    function verifyCaptcha(e) {
        e.preventDefault();
        /*declaro constantes con valores de Captcha.*/
        let captcha1 = "Kmm98g";
        let captcha2 = "EkkL93";
        let captcha3 = "pWW99h";
        let captcha4 = "m5Gt67";
        let captcha5 = "ZZTop4";
        let modal = null;

        let name = document.querySelector("#name");
        let surname = document.querySelector("#surname");
        let email = document.querySelector("#email");
        let telephoneNumber = document.querySelector("#telephoneNumber");
        let comment = document.querySelector("#comment");
        let captcha = document.querySelector("#captcha");


        if (name.value == "" || surname.value == "" || email.value == "" || telephoneNumber.value == "") {
            captcha.value = "";
            modal = "emptyText";
        } else {
            //Declaracion de variables.
            let compareCaptcha = null;
            // La variable comparar captcha toma el valor de enviada al momento de generar un nuevo captcha.
            compareCaptcha = returnFirstCaptcha;

            // Se asigna el valor de la constante de acuerdo al captcha retornado por el sistema.
            switch (returnFirstCaptcha) {
                case "captcha1":
                    compareCaptcha = captcha1;
                    break;
                case "captcha2":
                    compareCaptcha = captcha2;
                    break;
                case "captcha3":
                    compareCaptcha = captcha3;
                    break;
                case "captcha4":
                    compareCaptcha = captcha4;
                    break;
                case "captcha5":
                    compareCaptcha = captcha5;
                    break;
            }

            //Se obtiene el valor ingresado en el cuadro de texto por el usuario.
            let inputCaptcha = captcha.value;

            //Se compara el texto ingresado en el cuadro con el del captcha mostrado.
            if (inputCaptcha === compareCaptcha) {
                //Se limpia el formulario para que quede listo para una nueva carga.
                name.value = "";
                surname.value = "";
                email.value = "";
                telephoneNumber.value = "";
                comment.value = "";
                captcha.value = "";
                modal = "querySended";
            } else {
                //Se pone en blanco el cuadro para que el usuario ingrese el nuevo captcha.
                captcha.value = "";
                modal = "errorCaptcha";
            }
            //Se genera el nuevo captcha a mostrar
            let numberCaptcha = Math.floor((Math.random() * 5) + 1);
            document.querySelector("#imageCaptcha").src = "../img/captcha/captcha" + numberCaptcha + ".jpg";
            returnFirstCaptcha = ("captcha" + numberCaptcha);
        }

        /*Ventana modal para mostrar el mensaje correspondiente.*/
        /*Se asigna a cada variable el control del id correspondiente a cada una.*/
        let modalContainer = document.querySelector("#modalContainer");
        let close = document.querySelector("#close");
        let textModal = document.querySelector("#textModal");
        /*Dependiendo el valor de la variable modal, se ejecuta el codigo que muestra la ventana correspondiente.*/
        if (modal === "emptyText") {
            /*Se crea una nueva clase "show" en el div modalContainer que hace que se muestre la ventana modal.*/
            modalContainer.classList.add("show");
            /*Se cambia el texto que se muestra dentro de la ventana.*/
            textModal.innerHTML = "Los campos name, surname, eMail y teléfono, no deben estar vacíos.";
        } else {
            if (modal === "querySended") {
                modalContainer.classList.add("mostrar");
                textModal.innerHTML = "Gracias, su consulta fue enviada.";
            } else {
                modalContainer.classList.add("mostrar");
                textModal.innerHTML = "El captcha ingresado es incorrecto.";
            }
        }
        /*Se asigna el evento addEnvenListener al boton cerrar del cuadro modal*/
        /*Se crea una funcion anonima que borra la clase "show" agregada al div modalContainer*/
        close.addEventListener("click", function() {
            modalContainer.classList.remove("show")
        });
    }
}
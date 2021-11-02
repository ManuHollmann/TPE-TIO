document.addEventListener('DOMContentLoaded', main);
function main() {
    "use strict";

    //Se declara la variable global que se utiliza para enviar el valor de los captcha
    //colocados por el sistema.
    let retornoPrimerCaptcha;

    //Se ejecuta la funcion que coloca el primer captcha al actualizar o cargar la pagina.
    primerCaptcha();
    //Se asigna el evento al boton enviar para que ejecute la funcion que verifica los captcha.
    let btn = document.querySelector("#btn-enviar");
    btn.addEventListener("click", verificarCaptcha);

    //Esta funcion coloca el primer captcha al cargarse la pagina y retorna el valor del mismo.
    function primerCaptcha(){
        //Se genera un nro aleatorio entre 1 y 5 para decidir que imagen ira en el captcha.  
        let nroCaptcha = Math.floor((Math.random() * 5) + 1);
        //Se coloca el la imagen correspondiente en el cuadro de captcha.*/
        document.querySelector("#imagenCaptcha").src = "../img/captcha/captcha" + nroCaptcha + ".jpg";
        retornoPrimerCaptcha = ("captcha" + nroCaptcha);
    }

    //Esta funcion compara el captcha ingresado por teclado con el mostrado por sistema.
    function verificarCaptcha(e){    
        e.preventDefault();
        /*declaro constantes con valores de Captcha.*/
        let captcha1 = "Kmm98g";
        let captcha2 = "EkkL93";
        let captcha3 = "pWW99h";
        let captcha4 = "m5Gt67";
        let captcha5 = "ZZTop4";
        let modal = null;

        let nombre = document.querySelector("#nombre");
        let apellido = document.querySelector("#apellido");
        let email = document.querySelector("#email");
        let telefono = document.querySelector("#telefono");
        let comentario = document.querySelector("#comentario");
        let captcha = document.querySelector("#captcha");
    
            
        if (nombre.value == "" || apellido.value == "" || email.value == "" || telefono.value == ""){
            captcha.value = "";
            modal = "textoVacio";
        }
        else {
            //Declaracion de variables.
            let compararCaptcha = null;
            // La variable comparar captcha toma el valor de enviada al momento de generar un nuevo captcha.
            compararCaptcha = retornoPrimerCaptcha;
            
            // Se asigna el valor de la constante de acuerdo al captcha retornado por el sistema.
            switch (retornoPrimerCaptcha) {
                case "captcha1" : 
                    compararCaptcha = captcha1;
                    break;
                case "captcha2" : 
                    compararCaptcha = captcha2;
                    break;
                case "captcha3" : 
                    compararCaptcha = captcha3;
                    break; 
                case "captcha4" : 
                    compararCaptcha = captcha4;
                    break;
                case "captcha5" : 
                    compararCaptcha = captcha5;
                    break;
            }
           
            //Se obtiene el valor ingresado en el cuadro de texto por el usuario.
            let captchaIngresado = captcha.value;
            
            //Se compara el texto ingresado en el cuadro con el del captcha mostrado.
            if (captchaIngresado === compararCaptcha){        
                //Se limpia el formulario para que quede listo para una nueva carga.
                nombre.value = "";
                apellido.value = "";
                email.value = "";
                telefono.value ="";
                comentario.value = "";
                captcha.value = "";
                modal = "consultaEnviada";
            }               
            else {
                //Se pone en blanco el cuadro para que el usuario ingrese el nuevo captcha.
                captcha.value = "";
                modal = "errorCaptcha";
            }  
            //Se genera el nuevo captcha a mostrar
            let nroCaptcha = Math.floor((Math.random() * 5) + 1);        
            document.querySelector("#imagenCaptcha").src = "../img/captcha/captcha" + nroCaptcha + ".jpg";
            retornoPrimerCaptcha = ("captcha" + nroCaptcha);
        }
            
        /*Ventana modal para mostrar el mensaje correspondiente.*/
        /*Se asigna a cada variable el control del id correspondiente a cada una.*/
        let modalContainer = document.querySelector("#modalContainer");
        let cerrar = document.querySelector("#cerrar");
        let textoModal = document.querySelector("#txtModal");
        /*Dependiendo el valor de la variable modal, se ejecuta el codigo que muestra la ventana correspondiente.*/
        if (modal === "textoVacio") {
            /*Se crea una nueva clase "show" en el div modalContainer que hace que se muestre la ventana modal.*/
            modalContainer.classList.add("mostrar");
            /*Se cambia el texto que se muestra dentro de la ventana.*/
            textoModal.innerHTML = "Los campos nombre, apellido, eMail y teléfono, no deben estar vacíos.";  
        }
        else { if (modal === "consultaEnviada") {
            modalContainer.classList.add("mostrar");
            textoModal.innerHTML = "Gracias, su consulta fue enviada.";  
            }
            else {
                modalContainer.classList.add("mostrar");
                textoModal.innerHTML = "El captcha ingresado es incorrecto."; 
            }
        } 
        /*Se asigna el evento addEnvenListener al boton cerrar del cuadro modal*/
        /*Se crea una funcion anonima que borra la clase "show" agregada al div modalContainer*/
        cerrar.addEventListener("click", function (){
            modalContainer.classList.remove("mostrar")
        });
    } 
}
    




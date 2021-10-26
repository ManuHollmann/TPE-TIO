/* modificamos para que detecte al hacer click en "menu" */
document.querySelector(".btn_menu").addEventListener("click", toggleMenu);


/*selecciona "navigation" y realiza el a clase "show"*/
function toggleMenu() {
    document.querySelector(".navigation").classList.toggle("show");
}
/* modificamos para que detecte al hacer click en "menu" */
document.querySelector(".buttonMenu").addEventListener("click", toggleMenu);


/*selecciona "navigation" y realiza el a clase "show"*/
function toggleMenu() {
    document.querySelector(".navigation").classList.toggle("show");
}
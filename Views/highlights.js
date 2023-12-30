// Función para obtener el título del libro desde la URL
function getBookTitleFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('title');
}

// Función para mostrar el título del libro en la página
function displayBookTitle() {
    const bookTitle = getBookTitleFromUrl();
    if (bookTitle) {
        document.getElementById('bookTitle').innerText = bookTitle;
    }
}

// Función principal para ejecutar cuando se carga la página
function main() {
    displayBookTitle();
    // Puedes agregar más lógica aquí según sea necesario
}

// Ejecutar la función principal cuando la página se haya cargado completamente
document.addEventListener('DOMContentLoaded', main);
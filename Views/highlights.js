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

function populateTagsList(){
    const tags = ['BL', 'Cultivadores', 'Easy Reading'];
    const existingTagsElement = document.getElementById('existingTags');
    const tagContainer = document.createElement('div');
    tagContainer.id = 'tagContainer';

    tags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'tag';
        tagElement.innerText = tag;
        tagElement.addEventListener('click', toggleTag);
        tagContainer.appendChild(tagElement);
    });

    existingTagsElement.appendChild(tagContainer);

    // Add newTagContainer at the bottom
    const newTagContainer = document.getElementById('newTagContainer');
    existingTagsElement.parentElement.appendChild(newTagContainer);
}

function toggleTag() {
    this.classList.toggle('selected-tag');
}

function addNewTag() {
    const newTagInput = document.getElementById('newTagInput');
    const newTagName = newTagInput.value.trim();
    if (newTagName !== '') {
        const tagContainer = document.getElementById('tagContainer');
        const newTagElement = document.createElement('span');
        newTagElement.className = 'tag selected-tag'; // Resalta el nuevo tag por defecto
        newTagElement.innerText = newTagName;
        newTagElement.addEventListener('click', toggleTag);
        tagContainer.appendChild(newTagElement);
        newTagInput.value = ''; // Limpiar el input después de agregar la etiqueta
    }
}
// Función principal para ejecutar cuando se carga la página
function main() {
    displayBookTitle();
    populateTagsList();
    // Puedes agregar más lógica aquí según sea necesario
}

document.getElementById('newTagInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
       document.getElementById('newTagButton').click();
    }
   });
// Ejecutar la función principal cuando la página se haya cargado completamente
document.addEventListener('DOMContentLoaded', main);
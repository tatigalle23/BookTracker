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

function populateTagsList() {
    const tags = ['BL', 'Cultivadores', 'Easy Reading'];
    const existingTagsElement = document.getElementById('existingTags');

    // Limpiar el contenido existente antes de agregar nuevas etiquetas
    existingTagsElement.innerHTML = '';

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

function saveInfo() {
    const bookTitle = getBookTitleFromUrl();
    const rating = document.querySelector('input[name="rating"]:checked').value;
    const dateOfReading = document.getElementById('fdateReading').value;
    const comments = document.querySelector('input[placeholder="What was your opinion of the book?"]').value;

    // Obtén las etiquetas seleccionadas
    const selectedTags = document.querySelectorAll('.selected-tag');
    const tags = Array.from(selectedTags).map(tag => tag.innerText);

    // Ahora puedes hacer lo que quieras con la información, como enviarla al servidor
    // en una solicitud POST

    const bookInfo = {
        bookTitle,
        rating,
        dateOfReading,
        comments,
        tags
    };
    // Aquí puedes realizar una solicitud POST al servidor para guardar la información
    fetch('/saveInfo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookInfo),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            displaySavedInfo(bookInfo);
            // Puedes realizar alguna acción adicional después de guardar la información
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function editInfo() {
    const existingTable = document.getElementById('descriptionTable');
    existingTable.style.display = 'block';
    const savedInfoContainer = document.getElementById('savedInfoContainer');
    savedInfoContainer.style.display = 'none';

    // Obtén el contenedor donde deseas agregar la tabla    
    const infoContainer = document.getElementById('descriptionTable');
    
    // Llamar a la función para cargar y mostrar la información existente
    loadAndDisplayExistingInfo();
}

function loadAndDisplayExistingInfo() {
    const bookTitle = getBookTitleFromUrl();

    if (bookTitle) {
        fetch(`/getInfo?title=${encodeURIComponent(bookTitle)}`)
            .then(response => response.json())
            .then(data => {
                // Verificar si hay información existente
                if (data) {
                    // Mostrar la información existente en las casillas de edición
                    populateEditForm(data);
                } else {
                    console.log('No hay información existente para editar.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}

function populateEditForm(bookInfo) {
    // Llenar las casillas de edición con la información existente
    document.querySelector('input[name="rating"][value="' + bookInfo.rating + '"]').checked = true;
    document.getElementById('fdateReading').value = bookInfo.dateOfReading;

    // Manejar las etiquetas seleccionadas
    const existingTags = bookInfo.tags;
    const tagContainer = document.getElementById('tagContainer');
    
    // Limpiar las etiquetas existentes antes de agregar las nuevas
    tagContainer.innerHTML = '';

    existingTags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'tag selected-tag';
        tagElement.innerText = tag;
        tagElement.addEventListener('click', toggleTag);
        tagContainer.appendChild(tagElement);
    });

    document.querySelector('input[placeholder="What was your opinion of the book?"]').value = bookInfo.comments;
}

function displaySavedInfo(bookInfo) {
    // Hide the existing information table
    const existingTable = document.getElementById('descriptionTable');
    existingTable.style.display = 'none';

    // Show the container with saved information
    const infoContainer = document.getElementById('savedInfoContainer');
    infoContainer.style.display = 'block';

    console.log('infoContainer:', infoContainer);
    // Check if the infoContainer element exists
    if (infoContainer) {
        // Clear existing content
        infoContainer.innerHTML = '';
        // Crear un objeto con la información de la tabla
        const tableData = [
            { label: 'Rating', content: createStarRating(bookInfo.rating) },
            { label: 'Date of Reading', content: bookInfo.dateOfReading },
            { label: 'Tags', content: createTagElements(bookInfo.tags) },
            { label: 'Comments', content: bookInfo.comments },
        ];
        // Crear un elemento de tabla
        const tableElement = document.createElement('table');
        const tbodyElement = document.createElement('tbody');

        // Iterar sobre los datos y construir la tabla en JavaScript
        tableData.forEach(data => {
            const rowElement = document.createElement('tr');
            const labelCell = document.createElement('th');
            const contentCell = document.createElement('td');

            labelCell.textContent = data.label;
            contentCell.innerHTML = data.content;

            rowElement.appendChild(labelCell);
            rowElement.appendChild(contentCell);
            tbodyElement.appendChild(rowElement);
        });

        // Agregar la tbody a la tabla y la tabla al contenedor
        tableElement.appendChild(tbodyElement);
        infoContainer.appendChild(tableElement);

    } else {
        console.error('Error: infoContainer not found in the DOM');
    }
}

function createStarRating(rating) {
    const starContainer = document.createElement('div');
    starContainer.classList.add('star-rating');

    for (let i = 5; i >= 1; i--) {
        const starElement = document.createElement('span');
        starElement.classList.add('star');
        starElement.innerHTML = '★';
        starElement.style.color = i <= rating ? '#f2be3e' : '#8f8f8f';

        starContainer.appendChild(starElement);
    }

    return starContainer.outerHTML;
}
function createTagElements(tags) {
    const tagContainer = document.createElement('div');

    tags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'tag';
        tagElement.innerText = tag;
        tagContainer.appendChild(tagElement);
    });

    return tagContainer.outerHTML;
}
function showEditTable() {
    const existingTable = document.getElementById('descriptionTable');
    existingTable.style.display = 'block';
    const savedInfoContainer = document.getElementById('savedInfoContainer');
    savedInfoContainer.style.display = 'none';
}
//**SECTION 2 */



// Función principal para ejecutar cuando se carga la página
function main() {
    const bookTitle = getBookTitleFromUrl();
    displayBookTitle();
    populateTagsList();
    if (bookTitle) {
        fetch(`/getInfo?title=${encodeURIComponent(bookTitle)}`)
            .then(response => response.json())
            .then(data => {
                if (data) {
                    // Si hay información, mostrarla
                    displaySavedInfo(data);
                } else {
                    // Si no hay información, mostrar la tabla de edición
                    showEditTable();
                }
            })
            .catch(error => {
                console.error('Error:', error);
                // En caso de error, mostrar la tabla de edición
                showEditTable();
            });
    } else {
        // Si no hay título, mostrar la tabla de edición
        showEditTable();
    }

}

document.getElementById('newTagInput').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        document.getElementById('newTagButton').click();
    }
});
// Ejecutar la función principal cuando la página se haya cargado completamente
document.addEventListener('DOMContentLoaded', main);
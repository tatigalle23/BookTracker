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

////HACER LO DEL TAG AQUI 
function getTags() {
    fetch('/getTags')
        .then(response => response.json())
        .then(data => {
            const selecTags = document.getElementById('tags');

            data.forEach(tag => {
                const newTag = document.createElement('option');
                newTag.value = tag;
                newTag.textContent = tag;
                selecTags.appendChild(newTag);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

async function saveTags(tags) {
    const response = await fetch('/saveTags', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tags }),
    });
    const result = await response.json();
    console.log(result);
}

function addNewTag() {
    const newTagValue = document.getElementById('newTagInput').value;

    if (newTagValue.trim() !== '') {
        const selectedTagsElement = document.getElementById('tags');
        const newOption = document.createElement('option');
        newOption.value = newTagValue;
        newOption.textContent = newTagValue;
        selectedTagsElement.appendChild(newOption);

        const selectedTagsOptions = selectedTagsElement.selectedOptions;
        const currentTags = Array.from(selectedTagsOptions).map(option => option.value);

        // Guarda los tags actualizados en el archivo
        saveTags(currentTags);

        document.getElementById('newTagInput').value = '';
    }
}

// function addNewTagToDropdown() {
//     const newTagValue = document.getElementById('newTagInput').value;

//     if (newTagValue.trim() !== '') {
//        const selectElement = document.getElementById('tags');
//        const newOption = document.createElement('option');
//        newOption.value = newTagValue;
//        newOption.textContent = newTagValue;
//        selectElement.appendChild(newOption);

//        const currentTags = Array.from(selectElement.options).map(option => option.value);
//        localStorage.setItem('tags', JSON.stringify(currentTags));

//        document.getElementById('newTagInput').value = '';
//     }
//  }


function saveInfo() {
    const bookTitle = getBookTitleFromUrl();
    const rating = document.querySelector('input[name="rating"]:checked').value;
    const author = document.querySelector('input[placeholder="Author name"]').value;
    const dateOfReading = document.getElementById('fdateReading').value;
    const comments = document.querySelector('input[placeholder="What was your opinion of the book?"]').value;
    const song = document.querySelector('input[placeholder="Embedded Link"]').value

    // Obtén las etiquetas seleccionadas
    const selectedTagsElement = document.getElementById('tags');
    const selectedTagsOptions = selectedTagsElement.selectedOptions;
    const tags = Array.from(selectedTagsOptions).map(option => option.value);

    const bookInfo = {
        bookTitle,
        author,
        rating,
        dateOfReading,
        comments,
        tags,
        song,

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

//Have the old values when editing in the boxes
function populateEditForm(bookInfo) {
    // Llenar las casillas de edición con la información existente
    document.querySelector('input[name="rating"][value="' + bookInfo.rating + '"]').checked = true;
    document.querySelector('input[placeholder="Author name"]').value = bookInfo.author;
    document.getElementById('fdateReading').value = bookInfo.dateOfReading;
    document.querySelector('input[placeholder="Embedded Link"]').value = bookInfo.song;

    // // Manejar las etiquetas seleccionadas
    // const existingTags = bookInfo.tags;
    // const tagContainer = document.getElementById('tagContainer');

    // // Limpiar las etiquetas existentes antes de agregar las nuevas
    // tagContainer.innerHTML = '';

    // existingTags.forEach(tag => {
    //     const tagElement = document.createElement('span');
    //     tagElement.className = 'tag selected-tag';
    //     tagElement.innerText = tag;
    //     tagElement.addEventListener('click', toggleTag);
    //     tagContainer.appendChild(tagElement);
    // });

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
            { label: 'Author', content: bookInfo.author },
            { label: 'Date of Reading', content: bookInfo.dateOfReading },
            // { label: 'Tags', content: createTagElements(bookInfo.tags) },
            { label: 'Comments', content: bookInfo.comments },
            { label: 'Playlist/Song', content: createPlaylistElement(bookInfo.song) },
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

function createPlaylistElement(embeddedLink) {
    // Verificar si el enlace está presente
    if (embeddedLink) {
        // Devolver el elemento iframe con el enlace incrustado
        return embeddedLink;
    } else {
        // Devolver un mensaje indicando que no hay enlace disponible
        return 'No playlist or song provided';
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
function saveNotes() {
    const bookTitle = getBookTitleFromUrl();
    const notes = document.getElementById('noteText').value;

    const bookInfo = {
        bookTitle,
        notes
    };

    fetch('/saveNotes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookInfo),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            displayNotes();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function displayNotes() {
    const bookTitle = getBookTitleFromUrl();
    if (bookTitle) {
        fetch(`/getNotes?title=${encodeURIComponent(bookTitle)}`)
            .then(response => response.json())
            .then(data => {
                populatedNotesInfo(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

}
function populatedNotesInfo(bookInfo) {
    document.getElementById('noteText').value = bookInfo.notes;
}

function mainDisplay(bookTitle) {
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
// Función principal para ejecutar cuando se carga la página
function main() {
    const bookTitle = getBookTitleFromUrl();
    document.title = `Highlights - ${bookTitle || 'Libro sin título'}`;
    mainDisplay(bookTitle);
    displayBookTitle();
    displayNotes();
    getTags();

}

document.getElementById('newTagInput').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        document.getElementById('newTagButton').click();
    }
});
// Ejecutar la función principal cuando la página se haya cargado completamente
document.addEventListener('DOMContentLoaded', main);
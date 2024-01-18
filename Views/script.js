let isEraseMode = false;
// Función para obtener y mostrar los libros desde el servidor
function getAndDisplayBooks() {
  // Hacer una solicitud al servidor para obtener los libros
  fetch('/books')
      .then(response => response.json())
      .then(books => {
          const bookListContainer = document.getElementById('bookList');
          
          // Limpiar el contenido existente antes de agregar nuevos libros
          bookListContainer.innerHTML = '';

          // Iterar sobre la lista de libros y agregarlos al contenedor
          books.forEach(book => {
            const bookContainer = document.createElement('div');
            bookContainer.className = 'book-container';
        
            // Establece un enlace único para cada libro
            const bookLink = document.createElement('a');
            bookLink.href = `highlights.html?title=${encodeURIComponent(book.bookName)}`;
            bookContainer.appendChild(bookLink);
        
            const bookImageSection = document.createElement('div');
            bookImageSection.className = 'book-image-section';
        
            const bookImage = document.createElement('img');
            bookImage.className = 'book-image';
            bookImage.src = book.imagePath;
            bookImage.alt = 'Portada del libro';
        
            bookImageSection.appendChild(bookImage);
            bookLink.appendChild(bookImageSection);
        
            const bookTitleSection = document.createElement('div');
            bookTitleSection.className = 'book-title-section';
        
            const bookTitle = document.createElement('h3');
            bookTitle.textContent = book.bookName;
        
            bookTitleSection.appendChild(bookTitle);
            bookLink.appendChild(bookTitleSection);

            if (isEraseMode) {
              const deleteButton = document.createElement('button');
              deleteButton.className = 'delete-button';
              deleteButton.innerHTML = '<i class="fa-solid fa-circle-xmark"></i>';
        
              deleteButton.addEventListener('click', function (event) {
                  event.stopPropagation();
                  deleteBook(book.id);
              });
        
              bookContainer.appendChild(deleteButton);
            }
        
            bookListContainer.appendChild(bookContainer);
        
            // Agrega un evento de clic para redirigir al usuario a la página de resaltados
            bookLink.addEventListener('click', function (event) {
                event.preventDefault();
                window.location.href = this.href;
            });
        }); 
        
      })
      .catch(error => console.error('Error al obtener los libros:', error));
}

function eraseBook(){
  isEraseMode = !isEraseMode;
  getAndDisplayBooks();

}

function deleteBook(bookId) {
  // Hacer una solicitud al servidor para eliminar el libro
  fetch(`/deleteBook/${bookId}`, {
    method: 'DELETE',
  })
    .then(response => response.json())
    .then(result => {
      // Vuelve a cargar los libros después de la eliminación
      getAndDisplayBooks();
      console.log(result.message);
    })
    .catch(error => console.error('Error al eliminar el libro:', error));
}


// Función para abrir el formulario
function openForm(event) {
  event.stopPropagation(); // Detener la propagación del evento

  const addBookForm = document.getElementById('addBookForm');
  addBookForm.style.display = 'block';
  
  // Agregar event listener para clicks fuera del formulario
  document.addEventListener('click', handleClickOutside);
}

// Función para cerrar el formulario
function closeForm() {
  const addBookForm = document.getElementById('addBookForm');
  addBookForm.style.display = 'none';
  
  // Remover event listener para clicks fuera del formulario
  document.removeEventListener('click', handleClickOutside);
}

// Función para manejar clicks fuera del formulario
function handleClickOutside(event) {
  const addBookForm = document.getElementById('addBookForm');
  if (addBookForm && !addBookForm.contains(event.target)) {
    closeForm();
  }
}

// Agregar event listener al botón
const addBookButton = document.getElementById('addBookButton');
addBookButton.addEventListener('click', openForm);

// Llamar a la función para obtener y mostrar los libros cuando la página carga
document.addEventListener('DOMContentLoaded', getAndDisplayBooks);

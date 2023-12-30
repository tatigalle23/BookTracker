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

// Función para abrir el formulario
function openForm() {
  document.getElementById('addBookForm').style.display = 'block';
}

// Función para cerrar el formulario
function closeForm() {
  document.getElementById('addBookForm').style.display = 'none';
}

// Agregar un evento clic al botón
document.getElementById('addBookButton').addEventListener('click', openForm);

// Llamar a la función para obtener y mostrar los libros cuando la página carga
document.addEventListener('DOMContentLoaded', getAndDisplayBooks);
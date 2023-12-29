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
            const bookContainer = document.createElement('a');
            bookContainer.className = 'book-container';
            bookContainer.href = 'highlights.html'; // Establece el enlace a highlights.html
        
            const bookImageSection = document.createElement('div');
            bookImageSection.className = 'book-image-section';
        
            const bookImage = document.createElement('img');
            bookImage.className = 'book-image';
            bookImage.src = book.imagePath;
            bookImage.alt = 'Portada del libro';
        
            bookImageSection.appendChild(bookImage);
            bookContainer.appendChild(bookImageSection);
        
            const bookTitleSection = document.createElement('div');
            bookTitleSection.className = 'book-title-section';
        
            const bookTitle = document.createElement('h3');
            bookTitle.textContent = book.bookName;
        
            bookTitleSection.appendChild(bookTitle);
            bookContainer.appendChild(bookTitleSection);
        
            bookListContainer.appendChild(bookContainer);
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
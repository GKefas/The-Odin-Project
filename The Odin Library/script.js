'use strict';

const overlay = document.querySelector('.overlay');
const modal = document.querySelector('.modal');
const formOpen = document.querySelector('.open-modal');
const formClose = document.querySelector('.close-modal');
const getBookBtn = document.querySelector('.get-book');

const booksContainer = document.querySelector('.books__container');

const getBookName = document.getElementById('book-name');
const getBookAuthor = document.getElementById('book-author');
const getBookPages = document.getElementById('book-pages');

const CheckedList = [];

const DeleteBtnsList = [];
/////////////////
// Modal
const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

formOpen.addEventListener('click', openModal);

formClose.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Library

class Book {
  #name;
  #author;
  #pages;
  isRead;
  constructor(name, author, pages) {
    this.#name = name;
    this.#author = author;
    this.#pages = pages;
    this.isRead = false;
  }

  getName() {
    return this.#name;
  }

  getAuthor() {
    return this.#author;
  }

  getPages() {
    return this.#pages;
  }
}

const Library = [];

const addBookToLibrary = function (...books) {
  Library.push(...books);
};

const BookEl = function (book, i) {
  return `
  <figure class="book" data-name="${book.getName()}">
    <h2 class="heading-secondary">${book.getName()}</h2>
    <ul class="book__list">

      <!-- 01 -->
      <li class="book__item">
        <svg class="icon book__icon">
          <use xlink:href="/sprite.svg#icon-user"></use>
        </svg>
        <span class="book__author">${book.getAuthor()}</span>
      </li>

      <!-- 02-->
      <li class="book__item">
        <svg class="icon book__icon">
          <use xlink:href="/sprite.svg#icon-book-open"></use>
        </svg>
        <span class="book__pages">${book.getPages()}</span>
      </li>
      <!-- 03 -->

      <li class="book__item">
        <form action="#" class="form-checkbox">
          <label for="${i + 1}" class="from-checkbox__label">Read</label>
          <input type="checkbox" name="complete" id="complete${
            i + 1
          }" class="form-checkbox__input">
        </form>
      </li>
    </ul>
    <button class="btn btn--close btn--delete" data-number="${i + 1}">
      <svg class="icon book__icon">
        <use xlink:href="/sprite.svg#icon-x"></use>
      </svg>
    </button>
  </figure>
  `;
};

const addReadListener = function (single = true) {
  if (single) {
    const checked = document.getElementById(`complete${Library.length}`);
    CheckedList.push(checked);
    checked.addEventListener('click', function (e) {
      Library[length].isRead = e.target.checked;
      console.log(Library);
    });
    return;
  }

  CheckedList.forEach((cb, i) => {
    cb.addEventListener('click', function (e) {
      const length = Library.length - 1 < 0 ? 0 : i;

      Library[length].isRead = e.target.checked;
      console.log(Library);
    });
  });
};

const removeBook = function (e) {
  const currentBook = e.currentTarget
    .closest('.book')
    .getAttribute('data-name');

  const removedElementIndex = Library.findIndex(
    book => book.getName() === currentBook
  );

  Library.splice(removedElementIndex, 1);
  CheckedList.splice(removedElementIndex, 1);
  DeleteBtnsList.splice(removedElementIndex, 1);

  addBookUI(Library, false);
};

const addDelete = function (single = true) {
  if (single) {
    const deleteBtn =
      document.querySelectorAll('.btn--delete')[Library.length - 1];
    DeleteBtnsList.push(deleteBtn);
    deleteBtn.addEventListener('click', removeBook);
    return;
  }
  DeleteBtnsList.forEach((btn, i) => {
    btn.addEventListener('click', removeBook);
  });
};

const addBookUI = function (books, single = true) {
  console.log(Library);

  if (single) {
    const bookComponent = BookEl(books, Library.length - 1);
    booksContainer.insertAdjacentHTML('beforeend', bookComponent);
    addReadListener();
    addDelete();
    return;
  }
  booksContainer.innerHTML = '';
  books.forEach((book, i) => {
    const bookComponent = BookEl(book, i);
    booksContainer.insertAdjacentHTML('beforeend', bookComponent);
  });

  CheckedList.push(...document.querySelectorAll('.form-checkbox__input'));
  DeleteBtnsList.push(...document.querySelectorAll('.btn--delete'));

  addReadListener(false);
  addDelete(false);
};

const init = function () {
  const book1 = new Book('American History', 'David Stanle', 563);
  const book2 = new Book('The Alchemist', 'Paulo Coelho', 784);
  addBookToLibrary(book1, book2);
  addBookUI(Library, false);
};

init();

// Event Handlers

getBookBtn.addEventListener('click', function (e) {
  e.preventDefault();
  const book = new Book(
    getBookName.value,
    getBookAuthor.value,
    +getBookPages.value
  );
  addBookToLibrary(book);
  addBookUI(book);
  closeModal();
});

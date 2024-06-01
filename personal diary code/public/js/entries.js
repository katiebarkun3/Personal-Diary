// Функция для прокрутки вниз к последней записи в контейнере записей
function scrollDownToLastEntry() {
  // Получение контейнера записей
  const entriesContainer = document.querySelector(".entries-container");

  // Прокрутка контейнера вниз до конца
  entriesContainer.scrollTop = entriesContainer.scrollHeight;
}

// Событие, срабатывающее после полной загрузки документа, вызывает функцию прокрутки
document.addEventListener("DOMContentLoaded", scrollDownToLastEntry);

// Функция для отображения/скрытия меню с эмодзи
function toggleEmojiMenu() {
  // Получение элемента с меню эмодзи
  const emojiMenu = document.getElementById("emoji-menu");

  // Установка стиля display в "block" для отображения меню
  emojiMenu.style.display = "block";
}

// Функция для добавления выбранного эмодзи в текстовое поле
function addEmoji(emoji) {
  // Получение элемента текстового поля
  const textarea = document.getElementById("entry-textarea");

  // Добавление выбранного эмодзи к текущему содержимому текстового поля
  textarea.value += emoji;
}

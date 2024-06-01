document.addEventListener("DOMContentLoaded", function () {
  // Получаем коллекции кнопок редактирования и удаления
  const editButtons = document.querySelectorAll(".edit-button");
  const deleteButtons = document.querySelectorAll(".delete-button");

  // Добавляем обработчик события для каждой кнопки редактирования
  editButtons.forEach(function (button, index) {
    button.addEventListener("click", function () {
      // Вызываем функцию редактирования с передачей индекса записи
      editEntry(index);
    });
  });

  // Добавляем обработчик события для каждой кнопки удаления
  deleteButtons.forEach(function (button, index) {
    button.addEventListener("click", function () {
      // Вызываем функцию удаления с передачей индекса записи
      deleteEntry(index);
    });
  });
});

// Функция редактирования записи
function editEntry(index) {
  // Получаем текстовое поле записи по индексу
  const entryText = document.querySelectorAll(".entry-text")[index];
  // Запрашиваем у пользователя новый текст через диалоговое окно
  const newText = prompt("Введите новый текст", entryText.textContent);

  // Проверяем, был ли введен новый текст
  if (newText !== null) {
    // Обновляем текст записи на странице
    entryText.textContent = newText;

    // Отправляем запрос на сервер для обновления текста записи
    fetch(`/edit/${index}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: newText }),
    })
      .then(function (response) {
        // Проверяем успешность запроса и выводим соответствующее сообщение
        if (response.ok) {
          alert("Запись успешно отредактирована!");
        } else {
          // В случае ошибки выводим сообщение об ошибке
          throw new Error("Ошибка редактирования записи :(");
        }
      })
      .catch(function (error) {
        // Выводим сообщение об ошибке в консоль и в окно оповещения
        console.error(error);
        alert("Ошибка");
      });
  }
}

// Функция удаления записи
function deleteEntry(index) {
  // Проверяем у пользователя подтверждение на удаление записи
  if (confirm("Вы уверены, что хотите удалить запись?")) {
    // Отправляем запрос на сервер для удаления записи
    fetch(`/delete/${index}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        // Проверяем успешность запроса и перезагружаем страницу в случае успеха
        if (response.ok) {
          window.location.reload();
        } else {
          // В случае ошибки выводим сообщение об ошибке
          throw new Error("Ошибка удаления записи :(");
        }
      })
      .catch(function (error) {
        // Выводим сообщение об ошибке в консоль и в окно оповещения
        console.error(error);
        alert("Ошибка");
      });
  }
}

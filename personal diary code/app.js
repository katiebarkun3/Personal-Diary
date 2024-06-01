// Подключение необходимых библиотек и настройка приложения Express
const express = require("express");
const session = require("express-session");
const hbs = require("hbs");
const moment = require("moment");
const fileUpload = require("express-fileupload");

const app = express();
const port = 3000;
const today = moment().format("DD MMMM YYYY");

// Настройка шаблонизатора Handlebars и подключение middleware
app.set("view engine", "hbs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

// Настройка сессий для отслеживания аутентификации пользователя
app.use(
  session({
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: true,
  })
);

// Инициализация массива для хранения записей и Map для хранения пользователей
let entries = [];
let users = new Map();

// Middleware для проверки аутентификации пользователя
const checkAuth = (req, res, next) => {
  if (req.session.user) {
    return next();
  } else {
    return res.redirect("/");
  }
};

// Маршрут для отображения главной страницы "index.hbs"
app.get("/index", checkAuth, (req, res) => {
  // Фильтрация записей по автору
  const userEntries = entries.filter(
    (entry) => entry.author === req.session.user
  );
  res.render("index", { entries: userEntries });
});

// Маршруты для страниц регистрации и аутентификации
app.get("/", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  // Получение данных из формы регистрации
  const { username, password, email } = req.body;

  // Проверка наличия пользователя с таким же именем
  if (users.has(username)) {
    return res.render("register", {
      error: "A user with this username already exists.",
    });
  }

  // Генерация уникального идентификатора пользователя
  const userId = generateUniqueId();

  // Добавление нового пользователя в Map
  users.set(username, { username, password, email, userId });

  // Установка сессии для аутентификации
  req.session.user = username;
  req.session.userId = userId;

  // Редирект на главную страницу
  res.redirect("/index");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  // Получение данных из формы аутентификации
  const { username, password, email } = req.body;

  // Проверка соответствия логина и пароля
  if (
    users.has(username) &&
    users.get(username).password === password &&
    users.get(username).email === email
  ) {
    req.session.user = username;
    req.session.userId = users.get(username).userId;
    return res.redirect("/index");
  } else {
    return res.render("login", {
      error: "Incorrect username, email or password.",
    });
  }
});

app.post("/submit", checkAuth, (req, res) => {
  // Обработка формы создания записи
  const currentDate = moment().format("DD MMMM YYYY");
  const text = req.body.text;
  const currentTime = moment().format("HH:mm");

  let imageUrl = null;
  // Обработка загруженного изображения
  if (req.files && req.files.image) {
    const image = req.files.image;
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const imageName = `${uniqueSuffix}-${image.name}`;
    imageUrl = `/images/${imageName}`;

    // Сохранение изображения в папке public/images
    image.mv(`public/images/${imageName}`, (err) => {
      if (err) {
        console.error(err);
      }
    });
  }

  // Добавление новой записи в массив
  entries.push({
    currentDate,
    text,
    currentTime,
    image: imageUrl,
    author: req.session.user,
  });

  // Редирект на главную страницу
  res.redirect("/index");
});

// Новый маршрут для выхода из аккаунта
app.get("/logout", (req, res) => {
  res.render("logout");
});

// Обработка запроса на редактирование записи
app.post("/edit/:index", (req, res) => {
  const index = req.params.index;
  const newText = req.body.text;

  // Обновление текста записи по индексу
  entries[index].text = newText;

  // Отправка успешного статуса
  res.sendStatus(200);
});

// Обработка запроса на удаление записи
app.post("/delete/:index", (req, res) => {
  const index = req.params.index;

  // Удаление записи по индексу
  entries.splice(index, 1);

  // Отправка успешного статуса
  res.sendStatus(200);
});

// Маршрут для отображения записей за текущий день
app.get("/today", (req, res) => {
  // Фильтрация записей по текущей дате и автору
  const todayEntries = entries.filter(
    (entry) => entry.currentDate === today && entry.author === req.session.user
  );
  res.render("today", { entries: todayEntries, today: today });
});

// Обработка формы создания записи для текущего дня
app.post("/submit-today", (req, res) => {
  const currentDate = moment().format("DD MMMM YYYY");
  const text = req.body.text;
  const currentTime = moment().format("HH:mm");

  let imageUrl = null;
  // Обработка загруженного изображения
  if (req.files && req.files.image) {
    const image = req.files.image;
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const imageName = `${uniqueSuffix}-${image.name}`;
    imageUrl = `/images/${imageName}`;

    // Сохранение изображения в папке public/images
    image.mv(`public/images/${imageName}`, (err) => {
      if (err) {
        console.error(err);
      }
    });
  }

  // Добавление новой записи в массив
  entries.push({
    currentDate,
    text,
    currentTime,
    image: imageUrl,
    author: req.session.user,
  });

  // Редирект на страницу с записями за текущий день
  res.redirect("/today");
});

// Маршрут для отображения профиля пользователя
app.get("/profile", checkAuth, (req, res) => {
  const user = users.get(req.session.user);
  res.render("profile", { user });
});

// Запуск сервера на указанном порту
app.listen(port, () => {
  console.log(`The server is running on port ${port}`);
});

// Функция для генерации уникального идентификатора
function generateUniqueId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

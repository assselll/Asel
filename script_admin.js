// Хранилище новостей
let newsData = JSON.parse(localStorage.getItem('admin_news_storage')) || [];
let currentEditId = null;

// Элементы формы
const form = document.querySelector('.admin-form');
const titleInput = document.getElementById('title');
const categoryInput = document.getElementById('category');
const contentInput = document.getElementById('content');

const saveBtn = document.getElementById('save-btn');
const cancelBtn = document.getElementById('cancel-btn');

const newsList = document.getElementById('news-list');
const formTitle = document.getElementById('form-title');

// Отрисовка новостей
function renderNews() {
    newsList.innerHTML = '';

    if (newsData.length === 0) {
        newsList.innerHTML = `
            <tr>
                <td colspan="4">Новостей пока нет</td>
            </tr>
        `;
        return;
    }

    newsData.forEach(news => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${news.date}</td>
            <td><strong>${news.title}</strong></td>
            <td>
                <span class="status-badge">
                    ${getCategoryName(news.category)}
                </span>
            </td>
            <td>
                <div class="btn-group">
                    <button class="edit-btn" onclick="editNews(${news.id})">
                        Редактировать
                    </button>

                    <button class="delete-btn" onclick="deleteNews(${news.id})">
                        Удалить
                    </button>
                </div>
            </td>
        `;

        newsList.appendChild(row);
    });

    // Сохранение
    localStorage.setItem(
        'admin_news_storage',
        JSON.stringify(newsData)
    );
}

// Название категории
function getCategoryName(category) {
    switch(category) {
        case 'politics':
            return 'Политика';

        case 'tech':
            return 'Технологии';

        case 'culture':
            return 'Культура';

        default:
            return category;
    }
}

// Добавление / редактирование
form.addEventListener('submit', function(event) {
    event.preventDefault();

    const title = titleInput.value.trim();
    const category = categoryInput.value;
    const content = contentInput.value.trim();

    if (!title || !content) {
        alert('Заполните все поля');
        return;
    }

    const currentDate = new Date().toLocaleDateString('ru-RU');

    const newsItem = {
        id: currentEditId || Date.now(),
        title,
        category,
        content,
        date: currentDate
    };

    // Редактирование
    if (currentEditId) {
        newsData = newsData.map(item =>
            item.id === currentEditId ? newsItem : item
        );

        currentEditId = null;

        saveBtn.textContent = 'Опубликовать';
        formTitle.textContent = 'Добавить новую новость';

        cancelBtn.style.display = 'none';

    } else {
        // Добавление
        newsData.unshift(newsItem);
    }

    form.reset();
    renderNews();
});

// Удаление
window.deleteNews = function(id) {
    const confirmDelete = confirm(
        'Удалить эту новость?'
    );

    if (confirmDelete) {
        newsData = newsData.filter(
            item => item.id !== id
        );

        renderNews();
    }
};

// Редактирование
window.editNews = function(id) {
    const news = newsData.find(
        item => item.id === id
    );

    if (!news) return;

    titleInput.value = news.title;
    categoryInput.value = news.category;
    contentInput.value = news.content;

    currentEditId = id;

    saveBtn.textContent = 'Сохранить';
    formTitle.textContent = 'Редактирование новости';

    cancelBtn.style.display = 'inline-block';

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

// Отмена редактирования
cancelBtn.addEventListener('click', () => {
    currentEditId = null;

    form.reset();

    saveBtn.textContent = 'Опубликовать';
    formTitle.textContent = 'Добавить новую новость';

    cancelBtn.style.display = 'none';
});

// Первый запуск
renderNews();
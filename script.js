<<<<<<< HEAD
// Ключ для LocalStorage
const STORAGE_KEY = 'newsPortalData';

// Загрузка новостей: сначала пытаемся взять из localStorage,
// если пусто — загружаем из data.json и сохраняем в localStorage
async function loadNews() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error('Ошибка парсинга JSON из localStorage', e);
            return await fetchAndInit();
        }
    } else {
        return await fetchAndInit();
    }
}

// Загрузка из data.json и сохранение в localStorage
async function fetchAndInit() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error('Не удалось загрузить data.json');
        const data = await response.json();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return data;
    } catch (error) {
        console.error('Ошибка загрузки начальных данных:', error);
        return [];
    }
}

// Сохранение массива новостей в LocalStorage
function saveNews(newsArray) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newsArray));
}

// Генерация нового ID
function getNextId(newsArray) {
    if (newsArray.length === 0) return 1;
    return Math.max(...newsArray.map(item => item.id)) + 1;
}

// Отрисовка карточек новостей
function renderNews(newsArray) {
    const container = document.getElementById('newsContainer');
    if (!newsArray.length) {
        container.innerHTML = '<p>Новостей пока нет. Добавьте первую!</p>';
        return;
    }

    const categoryNames = {
        tech: 'Технологии',
        politics: 'Политика',
        sport: 'Спорт',
        culture: 'Культура',
        gossip: 'Сплетни'
    };

    let html = '';
    newsArray.forEach(article => {
        const catClass = article.category;
        const catName = categoryNames[article.category] || article.category;

        html += `
            <div class="card" data-id="${article.id}">
                <div class="card-body">
                    <span class="badge ${catClass}">${catName}</span>
                    <h3 class="card-title">${escapeHTML(article.title)}</h3>
                    <p class="card-text">${escapeHTML(article.text)}</p>
                    <div class="card-meta">
                        <span>${article.date}</span>
                        <span>Автор: ${escapeHTML(article.author)}</span>
                    </div>
                </div>
                <div class="card-actions">
                    <button class="btn danger" onclick="deleteNews(${article.id})">Удалить</button>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

// Экранирование HTML
function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Удаление новости по ID
function deleteNews(id) {
    let news = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    news = news.filter(article => article.id !== id);
    saveNews(news);
    renderNews(news);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', async () => {
    // Загружаем новости (асинхронно, если нужен fetch)
    let news = await loadNews();
    renderNews(news);

    // Обработчики событий
    document.getElementById('toggleFormBtn').addEventListener('click', () => {
        document.getElementById('addForm').classList.toggle('active');
    });

    document.getElementById('cancelBtn').addEventListener('click', () => {
        document.getElementById('addForm').classList.remove('active');
        document.getElementById('newsForm').reset();
    });

    document.getElementById('newsForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value.trim();
        const category = document.getElementById('category').value;
        const text = document.getElementById('text').value.trim();
        const author = document.getElementById('author').value.trim();

        if (!title || !text || !author) return;

        const newsArray = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        const newArticle = {
            id: getNextId(newsArray),
            title,
            category,
            text,
            author,
            date: new Date().toISOString().split('T')[0]
        };

        newsArray.push(newArticle);
        saveNews(newsArray);
        renderNews(newsArray);

        // Сброс формы и скрытие
        document.getElementById('newsForm').reset();
        document.getElementById('addForm').classList.remove('active');
    });

    document.getElementById('resetBtn').addEventListener('click', async () => {
        if (confirm('Удалить все изменения и вернуть демо-новости?')) {
            localStorage.removeItem(STORAGE_KEY);
            const freshNews = await loadNews(); // снова загрузит из data.json
            renderNews(freshNews);
        }
    });
=======
// Ключ для LocalStorage
const STORAGE_KEY = 'newsPortalData';

// Загрузка новостей: сначала пытаемся взять из localStorage,
// если пусто — загружаем из data.json и сохраняем в localStorage
async function loadNews() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error('Ошибка парсинга JSON из localStorage', e);
            return await fetchAndInit();
        }
    } else {
        return await fetchAndInit();
    }
}

// Загрузка из data.json и сохранение в localStorage
async function fetchAndInit() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error('Не удалось загрузить data.json');
        const data = await response.json();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return data;
    } catch (error) {
        console.error('Ошибка загрузки начальных данных:', error);
        return [];
    }
}

// Сохранение массива новостей в LocalStorage
function saveNews(newsArray) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newsArray));
}

// Генерация нового ID
function getNextId(newsArray) {
    if (newsArray.length === 0) return 1;
    return Math.max(...newsArray.map(item => item.id)) + 1;
}

// Отрисовка карточек новостей
function renderNews(newsArray) {
    const container = document.getElementById('newsContainer');
    if (!newsArray.length) {
        container.innerHTML = '<p>Новостей пока нет. Добавьте первую!</p>';
        return;
    }

    const categoryNames = {
        tech: 'Технологии',
        politics: 'Политика',
        sport: 'Спорт',
        culture: 'Культура',
        gossip: 'Сплетни'
    };

    let html = '';
    newsArray.forEach(article => {
        const catClass = article.category;
        const catName = categoryNames[article.category] || article.category;

        html += `
            <div class="card" data-id="${article.id}">
                <div class="card-body">
                    <span class="badge ${catClass}">${catName}</span>
                    <h3 class="card-title">${escapeHTML(article.title)}</h3>
                    <p class="card-text">${escapeHTML(article.text)}</p>
                    <div class="card-meta">
                        <span>${article.date}</span>
                        <span>Автор: ${escapeHTML(article.author)}</span>
                    </div>
                </div>
                <div class="card-actions">
                    <button class="btn danger" onclick="deleteNews(${article.id})">Удалить</button>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

// Экранирование HTML
function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Удаление новости по ID
function deleteNews(id) {
    let news = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    news = news.filter(article => article.id !== id);
    saveNews(news);
    renderNews(news);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', async () => {
    // Загружаем новости (асинхронно, если нужен fetch)
    let news = await loadNews();
    renderNews(news);

    // Обработчики событий
    document.getElementById('toggleFormBtn').addEventListener('click', () => {
        document.getElementById('addForm').classList.toggle('active');
    });

    document.getElementById('cancelBtn').addEventListener('click', () => {
        document.getElementById('addForm').classList.remove('active');
        document.getElementById('newsForm').reset();
    });

    document.getElementById('newsForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value.trim();
        const category = document.getElementById('category').value;
        const text = document.getElementById('text').value.trim();
        const author = document.getElementById('author').value.trim();

        if (!title || !text || !author) return;

        const newsArray = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        const newArticle = {
            id: getNextId(newsArray),
            title,
            category,
            text,
            author,
            date: new Date().toISOString().split('T')[0]
        };

        newsArray.push(newArticle);
        saveNews(newsArray);
        renderNews(newsArray);

        // Сброс формы и скрытие
        document.getElementById('newsForm').reset();
        document.getElementById('addForm').classList.remove('active');
    });

    document.getElementById('resetBtn').addEventListener('click', async () => {
        if (confirm('Удалить все изменения и вернуть демо-новости?')) {
            localStorage.removeItem(STORAGE_KEY);
            const freshNews = await loadNews(); // снова загрузит из data.json
            renderNews(freshNews);
        }
    });
>>>>>>> 19d836885a980ed6bf2f11e2ee7f9c08cbe7239d
});
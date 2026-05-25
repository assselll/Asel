const STORAGE_KEY = 'newsPortalData';

// --- Работа с данными ---
async function loadNews() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error('Ошибка парсинга JSON', e);
            return await fetchInitial();
        }
    } else {
        return await fetchInitial();
    }
}

async function fetchInitial() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error('data.json не найден');
        const data = await response.json();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return data;
    } catch (err) {
        console.error('Ошибка загрузки начальных данных:', err);
        return [];
    }
}

function saveNews(newsArray) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newsArray));
}

function getNextId(newsArray) {
    return newsArray.length ? Math.max(...newsArray.map(item => item.id)) + 1 : 1;
}

// --- Отрисовка списка ---
function renderAdminList(newsArray) {
    const container = document.getElementById('adminNewsList');
    if (!newsArray.length) {
        container.innerHTML = '<p>Новостей пока нет. Добавьте первую.</p>';
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
        const catName = categoryNames[article.category] || article.category;
        html += `
            <div class="admin-item">
                <div class="info">
                    <strong>${escapeHTML(article.title)}</strong>
                    <div class="meta">
                        <span class="badge ${article.category}">${catName}</span>
                        ${article.date} | Автор: ${escapeHTML(article.author)}
                    </div>
                </div>
                <div class="actions">
                    <button class="btn warning edit-btn" data-id="${article.id}">✏️</button>
                    <button class="btn danger delete-btn" data-id="${article.id}">🗑️</button>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;

    // Навешиваем обработчики
    container.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteNews(parseInt(btn.dataset.id)));
    });
    container.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => startEdit(parseInt(btn.dataset.id)));
    });
}

function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// --- CRUD ---
async function deleteNews(id) {
    let news = await loadNews();
    news = news.filter(a => a.id !== id);
    saveNews(news);
    renderAdminList(news);
}

async function startEdit(id) {
    const news = await loadNews();
    const article = news.find(a => a.id === id);
    if (!article) return;

    document.getElementById('editId').value = article.id;
    document.getElementById('title').value = article.title;
    document.getElementById('category').value = article.category;
    document.getElementById('text').value = article.text;
    document.getElementById('author').value = article.author;
    document.getElementById('formTitle').textContent = 'Редактирование новости';
    document.getElementById('addForm').classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetForm() {
    document.getElementById('newsForm').reset();
    document.getElementById('editId').value = '';
    document.getElementById('formTitle').textContent = 'Новая публикация';
}

// --- Инициализация ---
document.addEventListener('DOMContentLoaded', async () => {
    let news = await loadNews();
    renderAdminList(news);

    document.getElementById('toggleAddFormBtn').addEventListener('click', () => {
        resetForm();
        document.getElementById('addForm').classList.toggle('active');
    });

    document.getElementById('cancelFormBtn').addEventListener('click', () => {
        document.getElementById('addForm').classList.remove('active');
        resetForm();
    });

    document.getElementById('newsForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const editId = document.getElementById('editId').value;
        const title = document.getElementById('title').value.trim();
        const category = document.getElementById('category').value;
        const text = document.getElementById('text').value.trim();
        const author = document.getElementById('author').value.trim();
        if (!title || !text || !author) return;

        let newsArray = await loadNews();

        if (editId) {
            const id = parseInt(editId);
            const index = newsArray.findIndex(a => a.id === id);
            if (index !== -1) {
                newsArray[index] = { ...newsArray[index], title, category, text, author };
            }
        } else {
            const newArticle = {
                id: getNextId(newsArray),
                title,
                category,
                text,
                author,
                date: new Date().toISOString().split('T')[0]
            };
            newsArray.push(newArticle);
        }

        saveNews(newsArray);
        renderAdminList(newsArray);
        document.getElementById('addForm').classList.remove('active');
        resetForm();
    });

    document.getElementById('resetBtn').addEventListener('click', async () => {
        if (confirm('Удалить все изменения и вернуть демо-новости?')) {
            localStorage.removeItem(STORAGE_KEY);
            const fresh = await fetchInitial();
            renderAdminList(fresh);
        }
    });
});
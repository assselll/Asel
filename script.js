// Инициализация БД
if (!localStorage.getItem('news')) localStorage.setItem('news', JSON.stringify([]));
let currentUser = JSON.parse(localStorage.getItem('session')) || null;

// Функция входа
function login() {
    const name = document.getElementById('username').value;
    const role = document.getElementById('userRole').value;
    if (!name) return alert("Введите имя");
    
    currentUser = { name, role, subscriptions: { authors: [], categories: [] } };
    localStorage.setItem('session', JSON.stringify(currentUser));
    updateUI();
}

function logout() {
    localStorage.removeItem('session');
    currentUser = null;
    updateUI();
}

function updateUI() {
    const authBlock = document.getElementById('authBlock');
    const userInfo = document.getElementById('userInfo');
    const editorPanel = document.getElementById('editorPanel');
    const feedBtn = document.getElementById('feedBtn');

    if (currentUser) {
        authBlock.classList.add('hidden');
        userInfo.classList.remove('hidden');
        document.getElementById('welcomeText').innerText = `${currentUser.name} (${currentUser.role})`;
        if (currentUser.role === 'editor' || currentUser.role === 'admin') editorPanel.classList.remove('hidden');
        feedBtn.classList.remove('hidden');
    } else {
        authBlock.classList.remove('hidden');
        userInfo.classList.add('hidden');
        editorPanel.classList.add('hidden');
        feedBtn.classList.add('hidden');
    }
    renderNews();
}

// Работа с новостями
function addNews() {
    const title = document.getElementById('newsTitle').value;
    const content = document.getElementById('newsContent').value;
    const category = document.getElementById('newsCategory').value;

    const news = JSON.parse(localStorage.getItem('news'));
    const newItem = {
        id: Date.now(),
        title,
        content,
        category,
        author: currentUser.name,
        likes: 0,
        comments: [],
        approved: currentUser.role === 'admin' // Админу не нужна модерация
    };

    news.push(newItem);
    localStorage.setItem('news', JSON.stringify(news));
    renderNews();
}

function toggleLike(id) {
    let news = JSON.parse(localStorage.getItem('news'));
    const item = news.find(n => n.id === id);
    item.likes++;
    localStorage.setItem('news', JSON.stringify(news));
    renderNews();
}

function renderNews(filter = 'all') {
    const container = document.getElementById('newsContainer');
    let news = JSON.parse(localStorage.getItem('news'));

    // Фильтрация
    if (filter !== 'all' && filter !== 'my-feed') {
        news = news.filter(n => n.category === filter);
    }

    container.innerHTML = news.map(item => `
        <div class="news-item">
            <small>${item.category} | Автор: ${item.author}</small>
            <h2>${item.title}</h2>
            <p>${item.content}</p>
            <button onclick="toggleLike(${item.id})">❤️ ${item.likes}</button>
            
            <div class="comment-section">
                <strong>Комментарии:</strong>
                ${item.comments.map(c => `<div>${c.user}: ${c.text}</div>`).join('')}
                ${currentUser ? `
                    <input type="text" placeholder="Ваш коммент" onchange="addComment(${item.id}, this.value)">
                ` : ''}
            </div>
            
            ${currentUser?.role === 'admin' ? `
                <button style="background:red" onclick="deleteNews(${item.id})">Удалить (Админ)</button>
            ` : ''}
        </div>
    `).join('');
}

function addComment(newsId, text) {
    let news = JSON.parse(localStorage.getItem('news'));
    const item = news.find(n => n.id === newsId);
    item.comments.push({ user: currentUser.name, text });
    localStorage.setItem('news', JSON.stringify(news));
    renderNews();
}

function deleteNews(id) {
    let news = JSON.parse(localStorage.getItem('news'));
    news = news.filter(n => n.id !== id);
    localStorage.setItem('news', JSON.stringify(news));
    renderNews();
}

// Первичный запуск
updateUI();
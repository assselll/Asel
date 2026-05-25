const STORAGE_KEY = 'newsPortalData';

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

function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function renderNews(newsArray) {
    const container = document.getElementById('newsContainer');
    if (!newsArray.length) {
        container.innerHTML = '<p>Новостей пока нет.</p>';
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
            <div class="card">
                <div class="card-body">
                    <span class="badge ${catClass}">${catName}</span>
                    <h3 class="card-title">${escapeHTML(article.title)}</h3>
                    <p class="card-text">${escapeHTML(article.text)}</p>
                    <div class="card-meta">
                        <span>${article.date}</span>
                        <span>Автор: ${escapeHTML(article.author)}</span>
                    </div>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', async () => {
    const news = await loadNews();
    renderNews(news);
});
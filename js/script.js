let allVideos = [];
let currentFilter = 'all';

function toggleMenu() {
    document.getElementById('navLinks').classList.toggle('active');
}

function closeMenu() {
    document.getElementById('navLinks').classList.remove('active');
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.hidden').forEach(el => observer.observe(el));

function handleSubmit(e) {
    e.preventDefault();
    alert('Thanks for reaching out! I will get back to you soon.');
    e.target.reset();
}

async function loadPortfolio() {
    try {
        const res = await fetch('data/portfolio.json');
        allVideos = await res.json();
        renderPortfolio(allVideos);
    } catch (err) {
        console.error('Failed to load portfolio:', err);
    }
}

function renderPortfolio(videos) {
    const grid = document.getElementById('portfolioGrid');
    if (!grid) return;

    grid.innerHTML = videos.map(v => `
        <div class="portfolio-item hidden" data-id="${v.id}">
            <div class="placeholder">
                <i class="fas ${v.icon || 'fa-play-circle'}"></i>
                <span>${v.title}</span>
            </div>
            <div class="portfolio-overlay">
                <h4>${v.title}</h4>
                <p>${v.description}</p>
            </div>
        </div>
    `).join('');

    const newItems = grid.querySelectorAll('.hidden');
    newItems.forEach(el => observer.observe(el));

    grid.querySelectorAll('.portfolio-item').forEach(item => {
        item.addEventListener('click', () => {
            const id = parseInt(item.dataset.id);
            const video = allVideos.find(v => v.id === id);
            if (video) openLightbox(video);
        });
    });
}

function setFilter(filter) {
    currentFilter = filter;

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });

    const filtered = filter === 'all'
        ? allVideos
        : allVideos.filter(v => v.category === filter);

    renderPortfolio(filtered);
    document.getElementById('portfolio').scrollIntoView({ behavior: 'smooth' });
}

function openLightbox(video) {
    const lightbox = document.getElementById('lightbox');
    const embed = document.getElementById('lightboxEmbed');
    const title = document.getElementById('lightboxTitle');
    const desc = document.getElementById('lightboxDesc');

    title.textContent = video.title;
    desc.textContent = video.description;

    if (video.videoUrl) {
        embed.innerHTML = `<iframe src="${video.videoUrl}" allowfullscreen></iframe>`;
    } else {
        embed.innerHTML = `
            <div class="lightbox-placeholder">
                <i class="fas fa-play-circle"></i>
                <h3>${video.title}</h3>
                <p>${video.description}</p>
            </div>
        `;
    }

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
    document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
});

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => setFilter(btn.dataset.filter));
    });

    loadPortfolio();
});

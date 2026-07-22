let entries = [];
let editingId = null;

const form = document.getElementById('form');
const entryList = document.getElementById('entryList');
const emptyState = document.getElementById('emptyState');
const addBtn = document.getElementById('addBtn');
const saveBtn = document.getElementById('saveBtn');
const deleteBtn = document.getElementById('deleteBtn');
const cancelBtn = document.getElementById('cancelBtn');
const pushBtn = document.getElementById('pushBtn');
const status = document.getElementById('status');

const title = document.getElementById('title');
const description = document.getElementById('description');
const category = document.getElementById('category');
const videoUrl = document.getElementById('videoUrl');
const thumbnailPreview = document.getElementById('thumbnailPreview');
const thumbnailImg = document.getElementById('thumbnailImg');

function getYoutubeId(url) {
    if (!url) return '';
    const m = url.match(/(?:embed\/|shorts\/|v=|\/)([a-zA-Z0-9_-]{11})/);
    return m ? m[1] : '';
}

function setStatus(msg, type) {
    status.textContent = msg;
    status.className = type || '';
    setTimeout(() => { status.textContent = ''; status.className = ''; }, 3000);
}

function renderSidebar() {
    entryList.innerHTML = entries.map(e => `
        <div class="entry-item${editingId === e.id ? ' active' : ''}" data-id="${e.id}">
            <h4>${e.title}</h4>
            <p>${e.description.slice(0, 40)}${e.description.length > 40 ? '...' : ''}</p>
            <span class="badge">${categoryLabel(e.category)}</span>
        </div>
    `).join('');

    entryList.querySelectorAll('.entry-item').forEach(el => {
        el.addEventListener('click', () => editEntry(parseInt(el.dataset.id)));
    });
}

function categoryLabel(cat) {
    const map = { gameplay: 'Gaming Edit', video: 'Cinematic Video', 'color-grading': 'Color Grading', 'motion-graphics': 'Social Media' };
    return map[cat] || cat;
}

function resetForm() {
    editingId = null;
    form.reset();
    thumbnailPreview.style.display = 'none';
    form.style.display = 'none';
    emptyState.style.display = 'block';
    saveBtn.textContent = 'Save';
    renderSidebar();
}

function editEntry(id) {
    const entry = entries.find(e => e.id === id);
    if (!entry) return;
    editingId = id;
    title.value = entry.title;
    description.value = entry.description;
    category.value = entry.category;
    videoUrl.value = entry.videoUrl;
    updateThumbnail(entry.videoUrl);
    form.style.display = 'flex';
    emptyState.style.display = 'none';
    saveBtn.textContent = 'Update';
    deleteBtn.style.display = 'inline-block';
    renderSidebar();
}

function updateThumbnail(url) {
    const vid = getYoutubeId(url);
    if (vid) {
        thumbnailImg.src = `https://img.youtube.com/vi/${vid}/hqdefault.jpg`;
        thumbnailPreview.style.display = 'block';
    } else {
        thumbnailPreview.style.display = 'none';
    }
}

videoUrl.addEventListener('input', () => updateThumbnail(videoUrl.value));

addBtn.addEventListener('click', () => {
    editingId = null;
    form.reset();
    thumbnailPreview.style.display = 'none';
    form.style.display = 'flex';
    emptyState.style.display = 'none';
    saveBtn.textContent = 'Save';
    deleteBtn.style.display = 'none';
    title.focus();
    renderSidebar();
});

cancelBtn.addEventListener('click', resetForm);

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        title: title.value.trim(),
        description: description.value.trim(),
        category: category.value,
        videoUrl: videoUrl.value.trim(),
        icon: { gameplay: 'fa-gamepad', video: 'fa-film', 'color-grading': 'fa-palette', 'motion-graphics': 'fa-magic' }[category.value],
        thumbnail: '',
    };

    if (editingId) {
        const idx = entries.findIndex(e => e.id === editingId);
        entries[idx] = { ...entries[idx], ...data };
    } else {
        const maxId = entries.reduce((m, e) => Math.max(m, e.id), 0);
        entries.push({ id: maxId + 1, ...data });
    }

    const res = await window.api.savePortfolio(entries);
    if (res.success) {
        setStatus('Saved', 'success');
        resetForm();
    } else {
        setStatus('Save failed: ' + res.error, 'error');
    }
});

deleteBtn.addEventListener('click', async () => {
    if (editingId === null) return;
    if (!confirm('Delete this entry?')) return;
    entries = entries.filter(e => e.id !== editingId);
    const res = await window.api.savePortfolio(entries);
    if (res.success) {
        setStatus('Deleted', 'success');
        resetForm();
    } else {
        setStatus('Delete failed: ' + res.error, 'error');
    }
});

pushBtn.addEventListener('click', async () => {
    const msg = document.getElementById('commitMsg').value.trim() || 'update portfolio';
    pushBtn.disabled = true;
    pushBtn.textContent = 'Pushing...';
    const res = await window.api.gitPush(msg);
    if (res.success) {
        setStatus('Pushed to ' + res.remotes.join(', '), 'success');
    } else {
        setStatus('Push failed: ' + res.error, 'error');
    }
    pushBtn.disabled = false;
    pushBtn.textContent = 'Push to GitHub';
});

async function init() {
    const res = await window.api.loadPortfolio();
    if (res.success) {
        entries = res.data;
        renderSidebar();
    } else {
        setStatus('Failed to load portfolio: ' + res.error, 'error');
    }
}

init();

// 1. ТАЙИН КАРДАНИ ТЕМА
function applyTheme() {
    const activeTheme = localStorage.getItem("activeTheme") || 'light';
    document.body.className = "theme-" + activeTheme;
}

// 2. НАМОИШИ КОРТҲО
async function render() {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const grid = document.getElementById("mainGrid");
    
    if(users.length === 0) {
        grid.innerHTML = `<div class="text-center w-100 mt-5"><h2 class="opacity-50">Маълумот нест</h2></div>`;
        return;
    }

    grid.innerHTML = users.map(u => `
        <div class="col-md-4 col-sm-6">
            <div class="card h-100">
                <img src="${u.img || 'https://via.placeholder.com/300'}" class="card-img-top" alt="user">
                <div class="card-body p-4">
                    <h4 class="fw-800 mb-1">${u.name}</h4>
                    <p class="opacity-75 mb-2">${u.info || 'Маълумот нест'}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="badge bg-primary rounded-pill">${u.age} сола, ${u.year} сол таҷриба</span>
                        <div>
                            <button class="btn btn-sm btn-outline-info rounded-pill me-1" onclick="openInfo(${u.id})">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join("");
}

// 3. ЗАХИРАИ КОРБАРИ НАВ
async function saveUser() {
    const name = document.getElementById("newName").value;
    const age = document.getElementById("newAge").value;
    const year = document.getElementById("newYear").value;
    const info = document.getElementById("newInfo").value;
    const imgFile = document.getElementById("newImgFile").files[0];

    if(!name || !age) return alert("Пур кунед!");

    let img = '';
    if(imgFile) {
        img = await toBase64(imgFile);
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    users.push({ id: Date.now(), name, age, year, info, img });
    localStorage.setItem("users", JSON.stringify(users));
    
    bootstrap.Modal.getInstance(document.getElementById('addModal')).hide();
    await render();
}

// Функсия барои табдил ба base64
function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// Функсия барои намоиши модалҳои иттилоот
function showModal(title, message, type) {
    const modalHtml = `
        <div class="modal fade" id="infoModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content rounded-4 border-0 p-4 ${type === 'success' ? 'bg-success text-white' : 'bg-danger text-white'}">
                    <div class="text-center">
                        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'} fa-3x mb-3"></i>
                        <h4>${title}</h4>
                        <p>${message}</p>
                        <button class="btn btn-light rounded-pill" data-bs-dismiss="modal">Хуб</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    new bootstrap.Modal(document.getElementById('infoModal')).show();
    document.getElementById('infoModal').addEventListener('hidden.bs.modal', () => {
        document.getElementById('infoModal').remove();
    });
}

async function openInfo(id) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.id === id);
    if(!user) return showModal('Хатогӣ', 'Истифодабаранда ёфт нашуд.', 'error');

    const infoHtml = `
        <div class="modal fade" id="userInfoModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content rounded-4 border-0 shadow-lg overflow-hidden">
                    <div class="row g-0">
                        <div class="col-md-5">
                            <img src="${user.img || 'https://via.placeholder.com/600x400'}" class="img-fluid h-100 w-100" alt="${user.name}">
                        </div>
                        <div class="col-md-7 p-4">
                            <h3 class="fw-800 mb-3">${user.name}</h3>
                            <p class="mb-2"><strong>Синну сол:</strong> ${user.age} сола</p>
                            <p class="mb-2"><strong>Таърифа:</strong> ${user.year} сол таҷриба</p>
                            <p class="mb-3"><strong>Маълумот:</strong> ${user.info || 'Маълумоти иловагӣ вуҷуд надорад'}</p>
                            <button class="btn btn-primary rounded-pill me-2" data-bs-dismiss="modal">Бастан</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', infoHtml);
    new bootstrap.Modal(document.getElementById('userInfoModal')).show();
    document.getElementById('userInfoModal').addEventListener('hidden.bs.modal', () => {
        document.getElementById('userInfoModal').remove();
    });
}

// Дар вақти бор шудани саҳифа
window.onload = async () => {
    await applyTheme();
    await render();
};

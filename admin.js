const PASS = "2010";
const themes = [
    { id: 'light', color: '#ffffff', name: 'Standard' },
    { id: 'dark', color: '#1e293b', name: 'Midnight' },
    { id: 'purple', color: '#581c87', name: 'Royal' },
    { id: 'ocean', color: '#0369a1', name: 'Ocean' },
    { id: 'forest', color: '#14532d', name: 'Forest' },
    { id: 'sunset', color: '#9a3412', name: 'Sunset' },
    { id: 'premium', color: 'linear-gradient(45deg, #000, #434343)', name: 'Premium' }
];

// Auth logic
document.getElementById("adminPass").addEventListener("keypress", e => e.key === "Enter" && checkAuth());

function checkAuth() {
    if(document.getElementById("adminPass").value === PASS) {
        document.getElementById("authSection").remove();
        document.getElementById("adminPanel").classList.remove("d-none");
        initAdmin();
    } else {
        alert("❌ Хато!");
    }
}

function initAdmin() {
    renderThemes();
    renderTable();
}

// Theme Logic
function renderThemes() {
    const grid = document.getElementById("themeGrid");
    const currentTheme = localStorage.getItem("activeTheme") || 'light';
    
    grid.innerHTML = themes.map(t => `
        <div class="theme-btn ${currentTheme === t.id ? 'active' : ''}" 
             style="background: ${t.color}" 
             onclick="setTheme('${t.id}')" 
             title="${t.name}"></div>
    `).join("");
}

function setTheme(themeId) {
    localStorage.setItem("activeTheme", themeId);
    renderThemes();
    alert(`✅ Темаи "${themeId}" фаъол шуд!`);
}

// User Table Logic
function renderTable() {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const table = document.getElementById("adminTable");
    document.getElementById("userCount").innerText = users.length + " нафар";

    table.innerHTML = users.map(u => `
        <tr class="user-row">
            <td><img src="${u.img}"></td>
            <td>
                <div class="fw-800">${u.name}</div>
                <div class="small text-muted">${u.age} сола</div>
            </td>
            <td class="text-end">
                <button class="btn btn-edit btn-sm rounded-pill p-2 px-3 me-1" onclick="openEdit(${u.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-del btn-sm rounded-pill p-2 px-3" onclick="deleteUser(${u.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join("");
}

// EDIT MODAL Logic
const editModal = new bootstrap.Modal(document.getElementById('editModal'));

function openEdit(id) {
    const users = JSON.parse(localStorage.getItem("users"));
    const u = users.find(x => x.id === id);
    
    document.getElementById("editId").value = u.id;
    document.getElementById("editName").value = u.name;
    document.getElementById("editAge").value = u.age;
    document.getElementById("editExp").value = u.exp;
    
    editModal.show();
}

function updateUser() {
    const id = Number(document.getElementById("editId").value);
    let users = JSON.parse(localStorage.getItem("users"));
    
    const index = users.findIndex(u => u.id === id);
    users[index].name = document.getElementById("editName").value;
    users[index].age = document.getElementById("editAge").value;
    users[index].exp = document.getElementById("editExp").value;
    
    localStorage.setItem("users", JSON.stringify(users));
    editModal.hide();
    renderTable();
}

function deleteUser(id) {
    if(confirm("Нест карда шавад?")) {
        let users = JSON.parse(localStorage.getItem("users"));
        users = users.filter(u => u.id !== id);
        localStorage.setItem("users", JSON.stringify(users));
        renderTable();
    }
}

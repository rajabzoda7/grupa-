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

// ============ THEME LOGIC - FIREBASE ============

function renderThemes() {
    const grid = document.getElementById("themeGrid");
    getTheme().then(currentTheme => {
        grid.innerHTML = themes.map(t => `
            <div class="theme-btn ${currentTheme === t.id ? 'active' : ''}" 
                 style="background: ${t.color}" 
                 onclick="setTheme('${t.id}')" 
                 title="${t.name}"></div>
        `).join("");
    });
}

async function setTheme(themeId) {
    await setThemeData(themeId);
    renderThemes();
    alert(`✅ Темаи "${themeId}" фаъол шуд!`);
}

// ============ USER TABLE LOGIC - FIREBASE REAL-TIME SYNC ============

function renderTable() {
    // REAL-TIME listener - аз Firebase дата мегирем
    onUsersChange((users) => {
        const table = document.getElementById("adminTable");
        document.getElementById("userCount").innerText = users.length + " нафар";

        if(!users || users.length === 0) {
            table.innerHTML = '<tr><td colspan="3" class="text-center text-muted p-4">Корбари нест</td></tr>';
            return;
        }

        table.innerHTML = users.map(u => `
            <tr class="user-row">
                <td><img src="${u.img || 'https://via.placeholder.com/60'}" style="width: 60px; height: 60px; border-radius: 15px; object-fit: cover;"></td>
                <td>
                    <div class="fw-800">${u.name}</div>
                    <div class="small text-muted">${u.age} сола</div>
                </td>
                <td class="text-end">
                    <button class="btn btn-edit btn-sm rounded-pill p-2 px-3 me-1" onclick="openEdit('${u.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-del btn-sm rounded-pill p-2 px-3" onclick="deleteUserFromFirebase('${u.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join("");
    });
}

// ============ EDIT MODAL LOGIC - FIREBASE ============

const editModal = new bootstrap.Modal(document.getElementById('editModal'));

async function openEdit(id) {
    const users = await getUsers();
    const u = users.find(x => x.id === id);
    
    document.getElementById("editId").value = u.id;
    document.getElementById("editName").value = u.name;
    document.getElementById("editAge").value = u.age;
    document.getElementById("editExp").value = u.year || u.exp || '';
    
    editModal.show();
}

async function updateUser() {
    const id = document.getElementById("editId").value;
    const updates = {
        name: document.getElementById("editName").value,
        age: Number(document.getElementById("editAge").value),
        year: Number(document.getElementById("editExp").value)
    };
    
    await updateUserData(id, updates);
    editModal.hide();
    renderTable();
}

async function deleteUserFromFirebase(id) {
    if(confirm("Нест карда шавад?")) {
        await deleteUserData(id);
        renderTable();
    }
}


// verificar autenticacion
const currentUser = requireAuth();
if (currentUser) {
    document.getElementById("user-info").textContent = currentUser.username + " (" + currentUser.role + ")";
}

// datos iniciales
const DEFAULT_BUGS = [
    { id: 1, titulo: "Error al cargar imagenes en el carrito", description: "Las imagenes de los productos no se muestran cuando se agregan al carrito. Solo aparece el alt text.", priority: "alta", status: "abierto", assignee: "dev", fecha: "2026-03-10" },
    { id: 2, titulo: "Boton de pago no responde en mobile", description: "En dispositivos iOS el boton 'Finalizar compra' no tiene respuesta al toque. Funciona en Android.", priority: "alta", status: "en progreso", assignee: "dev", fecha: "2026-03-12" },
    { id: 3, titulo: "Filtro de precio no ordena correctamente", description: "Al seleccionar 'Precio mayor a menor' algunos productos quedan desordenados. Parece que compara como string.", priority: "media", status: "abierto", assignee: "tester", fecha: "2026-03-14" },
    { id: 4, titulo: "Falta validacion en campo email", description: "El formulario de registro acepta emails sin @ ni dominio. Ej: 'asd' se acepta como email valido.", priority: "media", status: "cerrado", assignee: "dev", fecha: "2026-03-08" },
    { id: 5, titulo: "Typo en pagina de confirmacion", description: "Dice 'Graicas por tu compra' en vez de 'Gracias por tu compra'.", priority: "baja", status: "cerrado", assignee: "admin", fecha: "2026-03-06" },
    { id: 6, titulo: "Sesion no expira despues de inactividad", description: "El usuario permanece logueado indefinidamente. Deberia expirar despues de 30 min de inactividad.", priority: "media", status: "abierto", assignee: "Sin asignar", fecha: "2026-03-18" },
    { id: 7, titulo: "Carrito se vacia al refrescar pagina", description: "Si el usuario refresca la pagina (F5) se pierden todos los items del carrito. No hay persistencia.", priority: "alta", status: "en progreso", assignee: "dev", fecha: "2026-03-20" },
    { id: 8, titulo: "Responsive roto en tablet", description: "En resoluciones de 768px el menu se superpone con el logo. El navbar no se adapta bien.", priority: "baja", status: "abierto", assignee: "Sin asignar", fecha: "2026-03-22" },
];

// cargar bugs de localStorage o usar los default
function loadBugs() {
    const saved = localStorage.getItem("bugtracker_bugs");
    if (saved) {
        return JSON.parse(saved);
    }
    saveBugs(DEFAULT_BUGS);
    return DEFAULT_BUGS;
}

function saveBugs(bugs) {
    localStorage.setItem("bugtracker_bugs", JSON.stringify(bugs));
}

let bugs = loadBugs();
let editingBugId = null;
let deletingBugId = null;

// actualizar estadisticas
function updateStats() {
    const total = bugs.length;
    const open = bugs.filter(b => b.status === "abierto").length;
    const progress = bugs.filter(b => b.status === "en progreso").length;
    const closed = bugs.filter(b => b.status === "cerrado").length;

    document.querySelector("#stat-total .stat-number").textContent = total;
    document.querySelector("#stat-open .stat-number").textContent = open;
    document.querySelector("#stat-progress .stat-number").textContent = progress;
    document.querySelector("#stat-closed .stat-number").textContent = closed;
}

// renderizar tabla
function renderTable() {
    const searchTerm = document.getElementById("search-input").value.toLowerCase();
    const statusFilter = document.getElementById("filter-status").value;
    const priorityFilter = document.getElementById("filter-priority").value;

    let filtered = bugs.filter(bug => {
        const matchSearch = bug.titulo.toLowerCase().includes(searchTerm) ||
                           bug.description.toLowerCase().includes(searchTerm);
        const matchStatus = statusFilter === "todos" || bug.status === statusFilter;
        const matchPriority = priorityFilter === "todos" || bug.priority === priorityFilter;
        return matchSearch && matchStatus && matchPriority;
    });

    const tbody = document.getElementById("bug-table-body");
    const emptyState = document.getElementById("empty-state");

    if (filtered.length === 0) {
        tbody.innerHTML = "";
        emptyState.style.display = "block";
        return;
    }

    emptyState.style.display = "none";

    tbody.innerHTML = filtered.map(bug => `
        <tr data-id="${bug.id}">
            <td><span class="bug-id">#${bug.id}</span></td>
            <td><span class="bug-title-cell">${bug.titulo}</span></td>
            <td><span class="badge badge-${bug.priority}">${capitalize(bug.priority)}</span></td>
            <td><span class="badge badge-${bug.status.replace(" ", "-")}">${capitalize(bug.status)}</span></td>
            <td>${formatDate(bug.fecha)}</td>
            <td>${bug.assignee}</td>
            <td>
                <button class="action-btn edit" onclick="openEditModal(${bug.id})" title="Editar">Editar</button>
                <button class="action-btn delete" onclick="openDeleteModal(${bug.id})" title="Eliminar">Eliminar</button>
            </td>
        </tr>
    `).join("");
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatDate(dateStr) {
    const parts = dateStr.split("-");
    return parts[2] + "/" + parts[1] + "/" + parts[0];
}

// toast notifications
function showToast(message, type) {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = "toast toast-" + (type || "success");
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// modal de bug (nuevo / editar)
const bugModal = document.getElementById("bug-modal");
const bugForm = document.getElementById("bug-form");

document.getElementById("new-bug-btn").addEventListener("click", () => {
    editingBugId = null;
    document.getElementById("modal-title").textContent = "Nuevo Bug";
    bugForm.reset();
    document.getElementById("bug-status").value = "abierto";
    clearFormErrors();
    bugModal.classList.add("open");
});

function openEditModal(id) {
    const bug = bugs.find(b => b.id === id);
    if (!bug) return;

    editingBugId = id;
    document.getElementById("modal-title").textContent = "Editar Bug #" + id;
    document.getElementById("bug-title").value = bug.titulo;
    document.getElementById("bug-description").value = bug.description;
    document.getElementById("bug-priority").value = bug.priority;
    document.getElementById("bug-status").value = bug.status;
    document.getElementById("bug-assignee").value = bug.assignee;
    clearFormErrors();
    bugModal.classList.add("open");
}

function closeModal() {
    bugModal.classList.remove("open");
    editingBugId = null;
}

document.getElementById("modal-close").addEventListener("click", closeModal);
document.getElementById("modal-cancel").addEventListener("click", closeModal);

bugModal.addEventListener("click", function(e) {
    if (e.target === bugModal) closeModal();
});

function clearFormErrors() {
    document.getElementById("title-error").textContent = "";
    document.getElementById("priority-error").textContent = "";
}

bugForm.addEventListener("submit", function(e) {
    e.preventDefault();
    clearFormErrors();

    const titulo = document.getElementById("bug-title").value.trim();
    const description = document.getElementById("bug-description").value.trim();
    const priority = document.getElementById("bug-priority").value;
    const status = document.getElementById("bug-status").value;
    const assignee = document.getElementById("bug-assignee").value;

    let valid = true;
    if (!titulo) {
        document.getElementById("title-error").textContent = "El titulo es obligatorio";
        valid = false;
    }
    if (!priority) {
        document.getElementById("priority-error").textContent = "Selecciona una prioridad";
        valid = false;
    }
    if (!valid) return;

    if (editingBugId) {
        // editar
        const bug = bugs.find(b => b.id === editingBugId);
        bug.titulo = titulo;
        bug.description = description;
        bug.priority = priority;
        bug.status = status;
        bug.assignee = assignee;
        showToast("Bug #" + editingBugId + " actualizado", "success");
    } else {
        // nuevo
        const newId = bugs.length > 0 ? Math.max(...bugs.map(b => b.id)) + 1 : 1;
        const today = new Date().toISOString().split("T")[0];
        bugs.push({
            id: newId,
            titulo: titulo,
            description: description,
            priority: priority,
            status: status,
            assignee: assignee,
            fecha: today
        });
        showToast("Bug #" + newId + " creado", "success");
    }

    saveBugs(bugs);
    updateStats();
    renderTable();
    closeModal();
});

// modal de eliminacion
const deleteModal = document.getElementById("delete-modal");

function openDeleteModal(id) {
    deletingBugId = id;
    deleteModal.classList.add("open");
}

function closeDeleteModal() {
    deleteModal.classList.remove("open");
    deletingBugId = null;
}

document.getElementById("delete-modal-close").addEventListener("click", closeDeleteModal);
document.getElementById("delete-cancel").addEventListener("click", closeDeleteModal);

deleteModal.addEventListener("click", function(e) {
    if (e.target === deleteModal) closeDeleteModal();
});

document.getElementById("delete-confirm").addEventListener("click", function() {
    if (deletingBugId) {
        bugs = bugs.filter(b => b.id !== deletingBugId);
        saveBugs(bugs);
        updateStats();
        renderTable();
        showToast("Bug eliminado", "success");
        closeDeleteModal();
    }
});

// filtros y busqueda
document.getElementById("search-input").addEventListener("input", renderTable);
document.getElementById("filter-status").addEventListener("change", renderTable);
document.getElementById("filter-priority").addEventListener("change", renderTable);

// init
updateStats();
renderTable();

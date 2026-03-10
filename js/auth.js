// usuarios validos
const USERS = [
    { username: "admin", password: "admin123", role: "Administrador" },
    { username: "tester", password: "tester123", role: "QA Tester" },
    { username: "dev", password: "dev123", role: "Desarrollador" },
];

function getCurrentUser() {
    const data = sessionStorage.getItem("bugtracker_user");
    if (!data) return null;
    return JSON.parse(data);
}

function requireAuth() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = "index.html";
        return null;
    }
    return user;
}

function logout() {
    sessionStorage.removeItem("bugtracker_user");
    window.location.href = "index.html";
}

// login
const loginForm = document.getElementById("login-form");
if (loginForm) {
    // si ya esta logueado, mandarlo al dashboard
    if (getCurrentUser()) {
        window.location.href = "dashboard.html";
    }

    loginForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const usernameInput = document.getElementById("username");
        const passwordInput = document.getElementById("password");
        const usernameError = document.getElementById("username-error");
        const passwordError = document.getElementById("password-error");
        const loginError = document.getElementById("login-error");

        // limpiar errores
        usernameError.textContent = "";
        passwordError.textContent = "";
        loginError.classList.remove("show");
        usernameInput.classList.remove("input-error");
        passwordInput.classList.remove("input-error");

        let valid = true;
        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        // validaciones
        if (!username) {
            usernameError.textContent = "El usuario es obligatorio";
            usernameInput.classList.add("input-error");
            valid = false;
        }
        if (!password) {
            passwordError.textContent = "La contraseña es obligatoria";
            passwordInput.classList.add("input-error");
            valid = false;
        }

        if (!valid) return;

        // buscar usuario
        const user = USERS.find(u => u.username === username && u.password === password);

        if (user) {
            sessionStorage.setItem("bugtracker_user", JSON.stringify({
                username: user.username,
                role: user.role
            }));
            window.location.href = "dashboard.html";
        } else {
            loginError.textContent = "Usuario o contraseña incorrectos";
            loginError.classList.add("show");
        }
    });
}

// logout button
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
}

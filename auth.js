// ====================================
// SISTEMA DE AUTENTICACIÓN
// Archivo: auth.js
// ====================================

// Configuración de autenticación
const AUTH_CONFIG = {
    // Cambiar a 'google' para usar Google Sign-In, o 'manual' para cuentas manuales
    authType: 'manual', // 'google' o 'manual'
    
    // Para autenticación manual: usuarios autorizados
    authorizedUsers: [
        { username: 'admin', password: 'admin123', role: 'admin', name: 'Administrador' },
        { username: 'supervisor', password: 'super123', role: 'supervisor', name: 'Supervisor' }
        // Agregar más usuarios aquí
    ],
    
    // Para Google Sign-In: emails autorizados
    authorizedGoogleEmails: [
        'admin@ejemplo.com',
        'supervisor@ejemplo.com'
        // Agregar emails autorizados aquí
    ],
    
    // Google Client ID (obtener de Google Cloud Console)
    googleClientId: 'TU_GOOGLE_CLIENT_ID.apps.googleusercontent.com'
};

// Almacenar sesión
const SESSION_KEY = 'fleet_auth_session';

// Clase de gestión de autenticación
class AuthManager {
    constructor() {
        this.currentUser = this.loadSession();
    }
    
    // Cargar sesión guardada
    loadSession() {
        const session = localStorage.getItem(SESSION_KEY);
        if (session) {
            const user = JSON.parse(session);
            // Verificar que no haya expirado (24 horas)
            if (user.expiresAt > Date.now()) {
                return user;
            } else {
                this.logout();
            }
        }
        return null;
    }
    
    // Guardar sesión
    saveSession(user) {
        const session = {
            ...user,
            loginTime: Date.now(),
            expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        this.currentUser = session;
    }
    
    // Login manual
    loginManual(username, password) {
        const user = AUTH_CONFIG.authorizedUsers.find(
            u => u.username === username && u.password === password
        );
        
        if (user) {
            this.saveSession({
                username: user.username,
                name: user.name,
                role: user.role,
                authType: 'manual'
            });
            return { success: true, user: this.currentUser };
        }
        
        return { success: false, error: 'Usuario o contraseña incorrectos' };
    }
    
    // Login con Google
    async loginWithGoogle(googleUser) {
        const email = googleUser.getBasicProfile().getEmail();
        const name = googleUser.getBasicProfile().getName();
        
        if (AUTH_CONFIG.authorizedGoogleEmails.includes(email)) {
            this.saveSession({
                email: email,
                name: name,
                role: 'user',
                authType: 'google'
            });
            return { success: true, user: this.currentUser };
        }
        
        return { success: false, error: 'Email no autorizado' };
    }
    
    // Verificar si está autenticado
    isAuthenticated() {
        return this.currentUser !== null;
    }
    
    // Obtener usuario actual
    getCurrentUser() {
        return this.currentUser;
    }
    
    // Logout
    logout() {
        localStorage.removeItem(SESSION_KEY);
        this.currentUser = null;
        
        // Si es Google, también hacer sign out
        if (typeof gapi !== 'undefined' && gapi.auth2) {
            const auth2 = gapi.auth2.getAuthInstance();
            if (auth2) {
                auth2.signOut();
            }
        }
    }
    
    // Verificar si tiene permisos de administrador
    isAdmin() {
        return this.currentUser && this.currentUser.role === 'admin';
    }
}

// Instancia global del gestor de autenticación
const authManager = new AuthManager();

// Función para proteger páginas
function requireAuth(redirectTo = '../index.html') {
    if (!authManager.isAuthenticated()) {
        window.location.href = redirectTo;
        return false;
    }
    return true;
}

// Función para mostrar información del usuario
function displayUserInfo() {
    const user = authManager.getCurrentUser();
    if (user) {
        const userInfoElement = document.getElementById('userInfo');
        if (userInfoElement) {
            userInfoElement.innerHTML = `
                <span class="user-name">👤 ${user.name || user.username}</span>
                <button class="btn btn-secondary btn-sm" onclick="handleLogout()">Cerrar Sesión</button>
            `;
        }
    }
}

// Manejar logout
function handleLogout() {
    if (confirm('¿Está seguro de cerrar sesión?')) {
        authManager.logout();
        window.location.href = '../index.html';
    }
}

// Inicializar Google Sign-In (si se usa)
function initGoogleSignIn() {
    if (AUTH_CONFIG.authType === 'google' && typeof gapi !== 'undefined') {
        gapi.load('auth2', function() {
            gapi.auth2.init({
                client_id: AUTH_CONFIG.googleClientId
            });
        });
    }
}

// Ejecutar al cargar
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        // Si estamos en la página de equipos, verificar autenticación
        if (window.location.pathname.includes('equipos.html') || 
            window.location.pathname.includes('admin')) {
            if (requireAuth()) {
                displayUserInfo();
            }
        }
        
        // Inicializar Google Sign-In si es necesario
        if (AUTH_CONFIG.authType === 'google') {
            initGoogleSignIn();
        }
    });
}

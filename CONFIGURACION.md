# 🔐 GUÍA DE CONFIGURACIÓN COMPLETA
## Sistema de Mantenimiento de Flota - Barinas

---

## 📋 ÍNDICE

1. [Configuración de Autenticación](#autenticación)
2. [Configuración de Google Forms (3 Formularios)](#formularios)
3. [Configuración de Google Sheets](#google-sheets)
4. [Configuración de Google Apps Script](#apps-script)
5. [Deployment en GitHub Pages](#github-pages)
6. [Usuarios y Permisos](#usuarios)

---

## 🔐 1. AUTENTICACIÓN

### Opción A: Autenticación Manual (Más Fácil - Recomendado)

**Paso 1:** Editar el archivo `auth.js`

Busca la sección `authorizedUsers` (línea ~10):

```javascript
authorizedUsers: [
    { username: 'admin', password: 'admin123', role: 'admin', name: 'Administrador' },
    { username: 'supervisor', password: 'super123', role: 'supervisor', name: 'Supervisor' }
    // Agregar más usuarios aquí
]
```

**Paso 2:** Agregar tus propios usuarios:

```javascript
authorizedUsers: [
    { username: 'admin', password: 'CAMBIA_ESTA_CLAVE', role: 'admin', name: 'Tu Nombre' },
    { username: 'mecanico1', password: 'mecanico123', role: 'user', name: 'Juan Pérez' },
    { username: 'supervisor', password: 'super123', role: 'supervisor', name: 'María López' }
]
```

**⚠️ IMPORTANTE:** Cambia las contraseñas por defecto antes de subir a internet.

**Paso 3:** Guardar y listo. La autenticación ya funciona.

**Acceso al sistema:**
- Usuarios autorizados: Pueden entrar a "Gestión de Equipos" desde `login.html`
- Cualquier persona: Puede ver el dashboard principal (solo lectura)

### Opción B: Google Sign-In (Más Seguro)

**Paso 1:** Crear proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto: "Sistema Mantenimiento Barinas"
3. Activa "Google+ API"

**Paso 2:** Crear credenciales OAuth 2.0

1. Ve a "Credenciales" → "Crear credenciales" → "ID de cliente de OAuth"
2. Tipo: "Aplicación web"
3. Orígenes autorizados: Agrega tu URL (ej: `https://tu-usuario.github.io`)
4. Copia el "Client ID"

**Paso 3:** Configurar en `auth.js`

```javascript
const AUTH_CONFIG = {
    authType: 'google', // Cambiar de 'manual' a 'google'
    googleClientId: 'TU_CLIENT_ID.apps.googleusercontent.com',
    authorizedGoogleEmails: [
        'admin@tuempresa.com',
        'supervisor@tuempresa.com'
    ]
};
```

---

## 📝 2. CONFIGURACIÓN DE LOS 3 FORMULARIOS

### Formulario 1: Reporte de Daño/Necesidad de Mantenimiento

**Crear el formulario:**

1. Ve a [Google Forms](https://forms.google.com)
2. Nuevo formulario vacío
3. Título: "Reporte de Daño - Sistema Barinas"
4. Copia los campos del archivo `PLANTILLA-FORMULARIOS.txt` (Formulario 1)

**Campos más importantes:**
- Nombre del equipo *
- Referencia/Placa *
- **Ubicación actual** *
- Descripción del problema *
- **Evidencia fotográfica (subir archivos)** *
- Gravedad del problema *
- Reportado por *

**Configurar subida de fotos:**
1. Agregar pregunta tipo "Subir archivos"
2. Permitir solo imágenes
3. Máximo 3 archivos
4. Tamaño máximo: 10MB por archivo

**Obtener URL:**
1. Click en "Enviar"
2. Ícono de enlace 🔗
3. "Acortar URL"
4. Copiar URL

### Formulario 2: Reporte de Mantenimiento Realizado

**Crear el formulario:**

1. Nuevo formulario
2. Título: "Mantenimiento Realizado - Sistema Barinas"
3. Copiar campos del Formulario 2

**Campos más importantes:**
- Nombre del equipo *
- Referencia/Placa *
- **Ubicación donde se realizó** *
- Tipo de mantenimiento *
- Trabajo realizado *
- Repuestos utilizados
- **Evidencia fotográfica (antes/después)** *
- Estado final del equipo *
- Técnico responsable *

### Formulario 3: Solicitud de Repuestos

**Crear el formulario:**

1. Nuevo formulario
2. Título: "Solicitud de Repuestos - Sistema Barinas"
3. Copiar campos del Formulario 3

**Campos más importantes:**
- Nombre del equipo *
- Referencia/Placa *
- Repuestos solicitados *
- Cantidad *
- Nivel de urgencia *
- **Foto del repuesto o problema**
- Solicitante *

### Conectar Formularios a Google Sheets

Para **cada formulario:**

1. En el formulario, click en "Respuestas"
2. Click en el ícono de Google Sheets (verde)
3. Seleccionar "Crear una hoja de cálculo nueva"
4. Nombrar apropiadamente:
   - "Reportes de Daños"
   - "Mantenimientos Realizados"
   - "Solicitudes de Repuestos"

**O mejor aún:** Crear un solo Google Sheet con 3 hojas (tabs) y conectar cada formulario a una hoja diferente.

### Configurar en app.js

Edita `app.js` línea ~15:

```javascript
const CONFIG = {
    DAMAGE_FORM_URL: 'https://forms.gle/ABC123',  // Formulario 1
    MAINTENANCE_FORM_URL: 'https://forms.gle/DEF456',  // Formulario 2
    PARTS_FORM_URL: 'https://forms.gle/GHI789',  // Formulario 3
    SHEETS_VIEW_URL: 'https://docs.google.com/spreadsheets/d/TU_ID_AQUI'
};
```

---

## 📊 3. GOOGLE SHEETS - ESTRUCTURA

### Crear el Google Sheet Principal

1. Nombre: "Sistema Mantenimiento - Base de Datos"

### Estructura de Hojas (Tabs):

#### Hoja 1: "Equipos"
Columnas:
```
ID | Nombre | Referencia | Tipo | Estado | Tipo Odómetro | Lectura Actual | 
Tipo Mantto | Estado Operativo | Solicitud Repuestos | Detalles Repuestos | 
Observaciones | Último Mantto | Próximo Mantto | Fecha Creación | Última Actualización
```

#### Hoja 2: "Reportes de Daños"
(Conectada del Formulario 1 - se llena automáticamente)

#### Hoja 3: "Mantenimientos Realizados"
(Conectada del Formulario 2 - se llena automáticamente)

#### Hoja 4: "Solicitudes de Repuestos"
(Conectada del Formulario 3 - se llena automáticamente)

#### Hoja 5: "Dashboard" (Opcional - con fórmulas)
Puedes crear resúmenes automáticos con fórmulas como:
```
=COUNTIF('Reportes de Daños'!D:D,"Urgente")
```

---

## ⚙️ 4. GOOGLE APPS SCRIPT

### Paso 1: Abrir Editor de Scripts

1. En tu Google Sheet principal
2. Extensiones → Apps Script

### Paso 2: Pegar el Código

1. Borra el código por defecto
2. Copia TODO el contenido de `google-apps-script.js`
3. Pégalo en el editor
4. Guarda (Ctrl+S)

### Paso 3: Deployar como Web App

1. Click en "Implementar" → "Nueva implementación"
2. Tipo: "Aplicación web"
3. Descripción: "API Sistema Mantenimiento v1"
4. Ejecutar como: "Yo (tu email)"
5. Quién tiene acceso: "Cualquier persona"
6. Click "Implementar"
7. **Autorizar permisos** (primera vez)
8. **COPIAR LA URL** que te da (muy importante)

### Paso 4: Configurar la URL en app.js

```javascript
const CONFIG = {
    APPS_SCRIPT_URL: 'https://script.google.com/macros/s/ABC.../exec',
    // ... resto de configuración
};
```

### Paso 5: Probar

En el editor de Apps Script:
1. Selecciona la función `testScript`
2. Click en "Ejecutar"
3. Verifica que se cree una fila de prueba en tu Sheet

---

## 🚀 5. DEPLOYMENT EN GITHUB PAGES

### Opción A: Interfaz Web (Más Fácil)

1. **Crear cuenta en GitHub**
   - Ve a [github.com](https://github.com)
   - Registrarte gratis

2. **Crear repositorio**
   - Click en "New repository"
   - Nombre: `mantenimiento-flota`
   - Público
   - Create repository

3. **Subir archivos**
   - Click en "uploading an existing file"
   - Arrastra TODOS los archivos del proyecto
   - Commit changes

4. **Activar GitHub Pages**
   - Settings del repositorio
   - Páginas (Pages)
   - Source: "main" branch
   - Save

5. **Tu sitio estará en:**
   ```
   https://TU-USUARIO.github.io/mantenimiento-flota/
   ```

### Opción B: Netlify Drop (Aún más fácil)

1. Ve a [netlify.com/drop](https://app.netlify.com/drop)
2. Arrastra la carpeta completa del proyecto
3. ¡Listo! Obtienes URL instantánea
4. Puedes personalizar el dominio después

---

## 👥 6. GESTIÓN DE USUARIOS Y PERMISOS

### Roles Disponibles

1. **Admin**
   - Acceso completo
   - Puede agregar, editar, eliminar equipos
   - Ve historial completo

2. **Supervisor**
   - Puede editar equipos
   - Ve historial completo
   - No puede eliminar

3. **User**
   - Solo lectura
   - Puede ver información

### Agregar Usuarios

Editar `auth.js`:

```javascript
authorizedUsers: [
    { 
        username: 'nuevo_usuario', 
        password: 'password123', 
        role: 'user',  // o 'supervisor' o 'admin'
        name: 'Nombre Completo' 
    }
]
```

### Cambiar Contraseñas

**⚠️ MUY IMPORTANTE:** Antes de subir a internet, cambia TODAS las contraseñas por defecto.

Recomendaciones:
- Mínimo 8 caracteres
- Mezcla de letras y números
- Evita palabras comunes

---

## ✅ CHECKLIST DE CONFIGURACIÓN

Antes de poner en producción, verifica:

- [ ] Contraseñas cambiadas en `auth.js`
- [ ] 3 formularios de Google creados y probados
- [ ] Google Sheets estructurado con las 4-5 hojas
- [ ] Google Apps Script deployado y URL copiada
- [ ] Todas las URLs actualizadas en `app.js`
- [ ] Sistema probado localmente
- [ ] Subido a GitHub Pages o Netlify
- [ ] URL pública funcionando
- [ ] Probado en móvil
- [ ] Usuarios de prueba creados
- [ ] Documentación compartida con el equipo

---

## 🆘 SOLUCIÓN DE PROBLEMAS COMUNES

### "No puedo iniciar sesión"
- Verifica que el usuario y contraseña sean correctos (distingue mayúsculas)
- Borra caché del navegador
- Prueba en modo incógnito

### "Los formularios no abren"
- Verifica que las URLs estén configuradas en `app.js`
- Asegúrate de que los formularios sean públicos
- Prueba abriendo las URLs directamente

### "Google Sheets no sincroniza"
- Verifica que la URL de Apps Script sea correcta
- Revisa que el script tenga permisos ("Cualquier persona")
- Mira la consola del navegador (F12) para errores

### "Las fotos no se suben en los formularios"
- Verifica que configuraste el tipo de pregunta como "Subir archivos"
- Asegúrate de que permitiste tipos de archivo de imagen
- Los usuarios deben estar conectados a internet

### "No veo el historial de mantenimiento"
- El historial se nutre de los formularios completados
- Inicialmente estará vacío hasta que haya reportes

---

## 📞 SOPORTE

Para más ayuda:
1. Revisa los archivos README.md e INICIO-RAPIDO.md
2. Verifica la consola del navegador (F12) para errores
3. Asegúrate de que todos los archivos estén en la misma carpeta

---

**Sistema desarrollado para Barinas - 2026**
**Versión 2.0 con Autenticación y Kanban**

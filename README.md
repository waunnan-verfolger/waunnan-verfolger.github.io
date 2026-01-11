# 🚛 Sistema de Mantenimiento de Flota

Sistema web completo para gestionar el mantenimiento de camiones y maquinaria pesada. Desarrollado en español colombiano (LATAM) con integración a servicios gratuitos de Google.

## 📋 Características

- ✅ **Panel de Control**: Visualización en tiempo real del estado de todos los equipos
- 🔧 **Gestión de Equipos**: Agregar, editar y eliminar equipos con información detallada
- 📊 **Exportación a Excel**: Descarga de datos en formato CSV compatible con Excel
- 📝 **Integración con Google Forms**: Para reportes de mantenimiento y solicitudes de repuestos
- 💾 **Almacenamiento Local**: Los datos se guardan en el navegador (LocalStorage)
- 🔄 **Sincronización con Google Sheets**: Opcional para respaldo en la nube
- 📱 **Diseño Responsive**: Funciona perfecto en computadoras, tablets y móviles

## 🚀 Instalación Rápida

### Opción 1: Uso Local (Sin servidor)

1. **Descarga los archivos** en una carpeta de tu computadora
2. **Abre** el archivo `index.html` en tu navegador web
3. ¡Listo! Ya puedes comenzar a usar el sistema

### Opción 2: Hosting Gratuito (GitHub Pages)

1. **Crea una cuenta** en [GitHub](https://github.com) (si no tienes)
2. **Crea un nuevo repositorio** llamado `mantenimiento-flota`
3. **Sube todos los archivos** del proyecto
4. **Activa GitHub Pages**:
   - Ve a Settings → Pages
   - En "Source", selecciona "main" branch
   - Click en "Save"
5. Tu sitio estará disponible en: `https://tu-usuario.github.io/mantenimiento-flota/`

### Opción 3: Netlify Drop (Más fácil)

1. Ve a [Netlify Drop](https://app.netlify.com/drop)
2. Arrastra la carpeta completa del proyecto
3. ¡Listo! Obtendrás una URL pública instantánea

## 📊 Configuración de Google Sheets (Opcional)

Para tener respaldo en la nube y compartir datos:

### Paso 1: Crear Google Sheet

1. Ve a [Google Sheets](https://sheets.google.com)
2. Crea una nueva hoja de cálculo llamada "Mantenimiento Flota"
3. Crea las siguientes columnas en la primera fila:
   ```
   Nombre | Referencia | Tipo | Estado | Tipo Odómetro | Lectura Actual | Tipo Mantto | Estado Operativo | Solicitud Repuestos | Detalles Repuestos | Observaciones | Último Mantto | Próximo Mantto | Fecha Creación
   ```

### Paso 2: Crear Google Apps Script

1. En tu Google Sheet, ve a **Extensiones → Apps Script**
2. Borra el código existente y pega este código:

```javascript
// API para Sistema de Mantenimiento
function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Equipos');
  const data = sheet.getDataRange().getValues();
  
  // Convertir a JSON
  const headers = data[0];
  const rows = data.slice(1);
  const jsonData = rows.map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });
  
  return ContentService.createTextOutput(JSON.stringify(jsonData))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Equipos');
  const data = JSON.parse(e.postData.contents);
  
  // Agregar nueva fila
  sheet.appendRow([
    data.name,
    data.reference,
    data.type,
    data.status,
    data.odometerType,
    data.odometerValue,
    data.maintenanceType,
    data.operationalStatus,
    data.partsRequest,
    data.partsDetails,
    data.observations,
    data.lastMaintenance,
    data.nextMaintenance,
    new Date()
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({success: true}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Guarda el proyecto (Ctrl+S)
4. Click en **Implementar → Nueva implementación**
5. Selecciona **Aplicación web**
6. Configuración:
   - **Ejecutar como**: Tu cuenta
   - **Quién tiene acceso**: Cualquier persona
7. Click en **Implementar**
8. **Copia la URL** que te genera (será algo como: `https://script.google.com/macros/s/...`)

### Paso 3: Configurar el Sistema

1. Abre el archivo `app.js`
2. Busca la sección `CONFIG` al inicio del archivo
3. Reemplaza los valores:

```javascript
const CONFIG = {
    GOOGLE_SHEET_ID: 'TU_ID_DEL_SHEET', // Lo sacas de la URL de tu Google Sheet
    APPS_SCRIPT_URL: 'TU_URL_DE_APPS_SCRIPT', // La URL que copiaste
    MAINTENANCE_FORM_URL: 'TU_URL_DE_FORMULARIO_MANTENIMIENTO',
    PARTS_FORM_URL: 'TU_URL_DE_FORMULARIO_REPUESTOS',
    SHEETS_VIEW_URL: 'URL_COMPLETA_DE_TU_GOOGLE_SHEET'
};
```

## 📝 Crear Formularios de Google

### Formulario de Mantenimiento

1. Ve a [Google Forms](https://forms.google.com)
2. Crea un nuevo formulario: "Reporte de Mantenimiento"
3. Agrega estos campos:
   - **Nombre del Equipo** (respuesta corta)
   - **Referencia/Placa** (respuesta corta)
   - **Tipo de Mantenimiento** (opción múltiple: Preventivo, Correctivo)
   - **Trabajo Realizado** (párrafo)
   - **Repuestos Utilizados** (párrafo)
   - **Observaciones** (párrafo)
   - **Técnico Responsable** (respuesta corta)
   - **Fecha del Servicio** (fecha)
4. En **Respuestas**, conecta con Google Sheets (se creará automáticamente)
5. Copia la URL del formulario y pégala en `MAINTENANCE_FORM_URL` en `app.js`

### Formulario de Solicitud de Repuestos

1. Crea otro formulario: "Solicitud de Repuestos"
2. Agrega estos campos:
   - **Nombre del Equipo** (respuesta corta)
   - **Referencia/Placa** (respuesta corta)
   - **Repuestos Solicitados** (párrafo)
   - **Cantidad** (respuesta corta)
   - **Urgencia** (opción múltiple: Baja, Media, Alta, Urgente)
   - **Justificación** (párrafo)
   - **Solicitante** (respuesta corta)
   - **Fecha** (fecha)
3. Conecta con Google Sheets
4. Copia la URL y pégala en `PARTS_FORM_URL` en `app.js`

## 📖 Uso del Sistema

### Panel Principal (Dashboard)

- **Estadísticas Rápidas**: Ver resumen de equipos activos, que requieren mantenimiento, etc.
- **Filtros**: Buscar equipos por estado, tipo de mantenimiento o nombre
- **Tabla Completa**: Ver todos los equipos con su información
- **Alertas**: Notificaciones de mantenimientos vencidos o próximos

### Gestión de Equipos

1. **Agregar Equipo**:
   - Click en "Agregar Equipo"
   - Llena el formulario con todos los datos
   - Click en "Guardar Equipo"

2. **Editar Equipo**:
   - Click en el botón "Editar" (✏️) del equipo
   - Modifica los campos necesarios
   - Click en "Actualizar Equipo"

3. **Eliminar Equipo**:
   - Click en el botón "Eliminar" (🗑️)
   - Confirma la eliminación

### Exportar Datos

- Click en "📊 Exportar Excel" en el menú superior
- Se descargará un archivo CSV con todos los datos
- Abre con Excel o Google Sheets

## 🔧 Personalización

### Cambiar Colores

Edita el archivo `styles.css` en la sección `:root`:

```css
:root {
    --primary-color: #2563eb;  /* Color principal */
    --success-color: #16a34a;  /* Color de éxito */
    --warning-color: #f59e0b;  /* Color de advertencia */
    --danger-color: #dc2626;   /* Color de peligro */
}
```

### Agregar Tipos de Equipos

Edita `equipos.html` y busca el select `equipmentType`:

```html
<select id="equipmentType" required>
    <option value="mi_nuevo_tipo">Mi Nuevo Tipo</option>
</select>
```

También actualiza `equipos.js` en el objeto `typeLabels`.

## 📱 Uso Móvil

El sistema es completamente responsive. Los trabajadores pueden:
- Acceder desde sus teléfonos
- Ver el estado de equipos
- Llenar formularios de Google Forms desde el móvil
- Todo sincroniza automáticamente

## 🔒 Seguridad y Privacidad

- Los datos se almacenan localmente en tu navegador
- Con Google Sheets, los datos están en tu cuenta de Google
- Puedes restringir el acceso a los formularios y hojas
- No se envía información a terceros

## 🆘 Solución de Problemas

### Los datos no se guardan
- Verifica que tu navegador permita LocalStorage
- Prueba en modo incógnito para descartar extensiones

### Google Sheets no sincroniza
- Verifica que la URL de Apps Script sea correcta
- Asegúrate de que el script tenga permisos de "Cualquier persona"
- Revisa la consola del navegador (F12) para errores

### El diseño se ve mal
- Limpia la caché del navegador (Ctrl+Shift+R)
- Verifica que todos los archivos CSS estén cargando

## 📞 Soporte

Para reportar problemas o sugerencias:
1. Describe el problema detalladamente
2. Incluye capturas de pantalla si es posible
3. Indica qué navegador y dispositivo estás usando

## 📄 Licencia

Este proyecto es de uso libre. Puedes modificarlo y adaptarlo a tus necesidades.

## 🎯 Próximas Mejoras Sugeridas

- [ ] Notificaciones por email para mantenimientos próximos
- [ ] Gráficos de estadísticas con Chart.js
- [ ] Historial de mantenimientos por equipo
- [ ] Gestión de técnicos y asignación de trabajos
- [ ] Calculadora de costos de mantenimiento
- [ ] Generación de reportes en PDF
- [ ] Modo oscuro
- [ ] Multi-idioma

---

**Desarrollado para Barinas - Sistema de Mantenimiento de Flota 2026**

# 🚀 Guía de Inicio Rápido

## ⏱️ Configuración en 10 Minutos

### Paso 1: Abrir el Sistema (2 minutos)

**Opción A - Uso Local:**
1. Abre el archivo `index.html` con tu navegador
2. ¡Ya está funcionando! Puedes empezar a agregar equipos

**Opción B - Publicar en Internet:**
1. Ve a https://app.netlify.com/drop
2. Arrastra toda la carpeta del proyecto
3. Obtendrás una URL pública para compartir

### Paso 2: Agregar tu Primer Equipo (3 minutos)

1. Click en "Gestión de Equipos" en el menú superior
2. Llena el formulario:
   - **Nombre**: Ej: "Camión Volqueta 1"
   - **Referencia**: Ej: "ABC-123"
   - **Tipo**: Selecciona el tipo de equipo
   - **Estado**: Activo/Inactivo
   - **Odómetro**: Kilometraje o horas de uso
   - **Tipo de Mantenimiento**: Ninguno/Preventivo/Correctivo
   - **Estado Operativo**: Cómo está funcionando
3. Click en "Guardar Equipo"
4. ¡Listo! Tu equipo aparecerá en el panel principal

### Paso 3: Ver el Panel de Control (1 minuto)

1. Click en "Panel Principal"
2. Verás:
   - 📊 Estadísticas resumidas
   - 📋 Tabla con todos los equipos
   - ⚠️ Alertas de mantenimiento

### Paso 4 (Opcional): Conectar con Google (5 minutos)

Si quieres respaldo en la nube y formularios:

#### 4.1 Crear Google Sheet
1. Ve a https://sheets.google.com
2. Crea nueva hoja: "Mantenimiento Flota"
3. Copia la URL completa

#### 4.2 Crear Formularios
1. Ve a https://forms.google.com
2. Crea dos formularios:
   - **Formulario 1**: "Reporte de Mantenimiento"
     - Campos: Equipo, Tipo de mantto., Trabajo realizado, Repuestos, Técnico, Fecha
   - **Formulario 2**: "Solicitud de Repuestos"
     - Campos: Equipo, Repuestos solicitados, Cantidad, Urgencia, Solicitante
3. Copia las URLs de ambos formularios

#### 4.3 Actualizar Configuración
1. Abre el archivo `app.js` con un editor de texto
2. Busca la sección `CONFIG` (línea 10 aprox.)
3. Reemplaza los valores:
```javascript
const CONFIG = {
    SHEETS_VIEW_URL: 'PEGA_AQUI_LA_URL_DE_TU_GOOGLE_SHEET',
    MAINTENANCE_FORM_URL: 'PEGA_AQUI_URL_FORMULARIO_MANTENIMIENTO',
    PARTS_FORM_URL: 'PEGA_AQUI_URL_FORMULARIO_REPUESTOS'
};
```
4. Guarda el archivo

¡Listo! Ahora los enlaces en el footer funcionarán.

## 📱 Uso Diario

### Para Supervisores/Administradores:
1. Abrir el panel principal
2. Ver estado de todos los equipos
3. Agregar/editar equipos según sea necesario
4. Exportar datos a Excel cuando se necesite

### Para Técnicos/Operadores:
1. Cuando hagan mantenimiento:
   - Abrir el "Formulario de Mantenimiento" (link en el footer)
   - Llenar el reporte desde su teléfono
2. Cuando necesiten repuestos:
   - Abrir el "Formulario de Repuestos" (link en el footer)
   - Solicitar lo que necesiten

## 🎯 Casos de Uso Comunes

### Agregar un nuevo camión:
```
1. Gestión de Equipos → Agregar Equipo
2. Llenar datos básicos
3. Guardar
```

### Marcar equipo para mantenimiento:
```
1. Panel Principal → Click en ✏️ junto al equipo
2. Cambiar "Tipo de Mantenimiento" a "Preventivo" o "Correctivo"
3. Cambiar "Estado Operativo" según corresponda
4. Actualizar Equipo
```

### Ver qué equipos necesitan atención:
```
1. Panel Principal
2. Usar filtros:
   - "Tipo de Mantenimiento" → Seleccionar tipo
   - O buscar por nombre
3. Ver alertas en la sección de abajo
```

### Exportar reporte mensual:
```
1. Click en "📊 Exportar Excel" (menú superior)
2. Abrir el archivo descargado con Excel
3. ¡Listo para imprimir o compartir!
```

## ⚙️ Configuraciones Recomendadas

### Frecuencias de Mantenimiento Sugeridas:

**Camiones y Volquetas:**
- Preventivo: Cada 10,000 km o 6 meses
- Revisión de frenos: Cada 5,000 km
- Cambio de aceite: Cada 5,000-7,000 km

**Maquinaria Pesada (excavadoras, cargadores):**
- Preventivo: Cada 250 horas de uso
- Cambio de filtros: Cada 500 horas
- Revisión hidráulica: Cada 1,000 horas

### Campos Importantes a Llenar:
- ✅ **Siempre llenar**: Nombre, Referencia, Tipo, Estado, Odómetro
- 📅 **Recomendado**: Fechas de último y próximo mantenimiento
- 📝 **Útil**: Observaciones (cualquier detalle importante)

## 🆘 Problemas Comunes

### "No puedo agregar equipos"
- Verifica que todos los campos obligatorios (con *) estén llenos
- Prueba en otro navegador (Chrome recomendado)

### "Los datos desaparecieron"
- Los datos se guardan en el navegador
- Si limpias la caché del navegador, se borran
- **Solución**: Exporta a Excel regularmente como respaldo
- **O**: Configura Google Sheets para respaldo automático

### "Los formularios no abren"
- Verifica que hayas configurado las URLs en `app.js`
- Si no has creado los formularios, créalos primero

### "El diseño se ve raro en el móvil"
- Actualiza la página (F5)
- Verifica tu conexión a internet
- Prueba en otro navegador móvil

## 📞 Contacto y Soporte

Si necesitas ayuda:
1. Revisa el archivo `README.md` completo
2. Verifica que todos los archivos estén en la misma carpeta
3. Prueba en modo incógnito del navegador

## ✨ Tips Pro

1. **Respaldo Regular**: Exporta a Excel cada semana
2. **Fotos de Equipos**: Guarda fotos con el mismo nombre de referencia
3. **Códigos QR**: Pega un código QR en cada equipo que abra su ficha directamente
4. **Recordatorios**: Usa el teléfono para recordar mantenimientos programados
5. **Reportes Rápidos**: Los técnicos pueden llenar formularios desde el campo

---

## 🎉 ¡Todo Listo!

Ya tienes todo lo necesario para gestionar tu flota de manera profesional.

**Próximos pasos sugeridos:**
- [ ] Agregar todos tus equipos actuales
- [ ] Configurar fechas de próximos mantenimientos
- [ ] Crear los formularios de Google
- [ ] Compartir el link con tu equipo
- [ ] Hacer el primer reporte mensual

¡Éxito con tu gestión de mantenimiento! 🚛✨

// ============================================
// GOOGLE APPS SCRIPT - BACKEND API
// ============================================
// Instrucciones de instalación:
// 1. Abre tu Google Sheet
// 2. Ve a Extensiones → Apps Script
// 3. Borra todo el código existente
// 4. Pega este código completo
// 5. Guarda (Ctrl+S)
// 6. Implementa como Aplicación Web
// ============================================

// Configuración
const SHEET_NAME = 'Equipos'; // Nombre de la hoja donde se guardarán los datos

// Función para manejar peticiones GET (leer datos)
function doGet(e) {
  try {
    const sheet = getOrCreateSheet();
    const data = sheet.getDataRange().getValues();
    
    // Si la hoja está vacía, crear encabezados
    if (data.length === 0) {
      createHeaders(sheet);
      return ContentService.createTextOutput(JSON.stringify([]))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
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
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Función para manejar peticiones POST (agregar/actualizar datos)
function doPost(e) {
  try {
    const sheet = getOrCreateSheet();
    const data = JSON.parse(e.postData.contents);
    
    // Verificar si la hoja tiene encabezados
    if (sheet.getLastRow() === 0) {
      createHeaders(sheet);
    }
    
    // Si tiene ID, buscar y actualizar; sino, agregar nuevo
    if (data.id) {
      updateEquipment(sheet, data);
    } else {
      addEquipment(sheet, data);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Datos guardados correctamente'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Obtener o crear la hoja de equipos
function getOrCreateSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    createHeaders(sheet);
  }
  
  return sheet;
}

// Crear encabezados de columnas
function createHeaders(sheet) {
  const headers = [
    'ID',
    'Nombre',
    'Referencia',
    'Tipo',
    'Estado',
    'Tipo Odómetro',
    'Lectura Actual',
    'Tipo Mantto.',
    'Estado Operativo',
    'Solicitud Repuestos',
    'Detalles Repuestos',
    'Observaciones',
    'Último Mantto.',
    'Próximo Mantto.',
    'Fecha Creación',
    'Última Actualización'
  ];
  
  sheet.appendRow(headers);
  
  // Formatear encabezados
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('#ffffff');
  
  // Congelar primera fila
  sheet.setFrozenRows(1);
}

// Agregar nuevo equipo
function addEquipment(sheet, data) {
  const row = [
    data.id || generateId(),
    data.name || '',
    data.reference || '',
    data.type || '',
    data.status || '',
    data.odometerType || '',
    data.odometerValue || 0,
    data.maintenanceType || '',
    data.operationalStatus || '',
    data.partsRequest || '',
    data.partsDetails || '',
    data.observations || '',
    data.lastMaintenance || '',
    data.nextMaintenance || '',
    new Date(),
    new Date()
  ];
  
  sheet.appendRow(row);
}

// Actualizar equipo existente
function updateEquipment(sheet, data) {
  const allData = sheet.getDataRange().getValues();
  const headers = allData[0];
  const idIndex = headers.indexOf('ID');
  
  // Buscar la fila con el ID correspondiente
  for (let i = 1; i < allData.length; i++) {
    if (allData[i][idIndex] === data.id) {
      // Actualizar la fila
      sheet.getRange(i + 1, 1, 1, headers.length).setValues([[
        data.id,
        data.name || '',
        data.reference || '',
        data.type || '',
        data.status || '',
        data.odometerType || '',
        data.odometerValue || 0,
        data.maintenanceType || '',
        data.operationalStatus || '',
        data.partsRequest || '',
        data.partsDetails || '',
        data.observations || '',
        data.lastMaintenance || '',
        data.nextMaintenance || '',
        allData[i][14], // Mantener fecha de creación
        new Date() // Actualizar fecha de modificación
      ]]);
      return;
    }
  }
  
  // Si no se encontró, agregar como nuevo
  addEquipment(sheet, data);
}

// Generar ID único
function generateId() {
  return Utilities.getUuid();
}

// Función para eliminar equipo (opcional)
function deleteEquipment(id) {
  const sheet = getOrCreateSheet();
  const allData = sheet.getDataRange().getValues();
  const headers = allData[0];
  const idIndex = headers.indexOf('ID');
  
  for (let i = 1; i < allData.length; i++) {
    if (allData[i][idIndex] === id) {
      sheet.deleteRow(i + 1);
      return true;
    }
  }
  
  return false;
}

// Función de prueba (ejecutar para verificar que todo funciona)
function testScript() {
  const sheet = getOrCreateSheet();
  Logger.log('Hoja creada/encontrada: ' + sheet.getName());
  Logger.log('Total de filas: ' + sheet.getLastRow());
  
  // Prueba de agregar datos
  const testData = {
    name: 'Equipo de Prueba',
    reference: 'TEST-001',
    type: 'camion',
    status: 'activo',
    odometerType: 'km',
    odometerValue: 1000,
    maintenanceType: 'ninguno',
    operationalStatus: 'operativo',
    partsRequest: 'no'
  };
  
  addEquipment(sheet, testData);
  Logger.log('Datos de prueba agregados correctamente');
}

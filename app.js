// ====================================
// SISTEMA DE MANTENIMIENTO DE FLOTA
// Archivo Principal: app.js
// ====================================

// Configuración de Google Sheets (Actualizar con tus propios enlaces)
const CONFIG = {
    // ID de tu Google Sheet (lo obtienes de la URL)
    GOOGLE_SHEET_ID: '1WvbMVjomjO6-dNA2hEtECJ0hcD1bFibpMIBdhQ_M8bg',
    
    // URL de Google Apps Script Web App (después de deployar)
    APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbwNIzIKG4aYuGIJu9L5mEpJX0tn67nxXLtvI9pSvSS9kML9YbYePL9KBoioTHFTnSIM/exec',
    
    // Enlaces de Google Forms (2 formularios)
    DAMAGE_FORM_URL: 'https://forms.gle/oN7ELCcV5zd4yuDt6',
    MAINTENANCE_FORM_URL: 'https://forms.gle/JBQPFYVCL6EAEJ6C9',
    PARTS_FORM_URL: '',
    
    // URL de Google Sheets para visualización
    SHEETS_VIEW_URL: 'https://docs.google.com/spreadsheets/d/1WvbMVjomjO6-dNA2hEtECJ0hcD1bFibpMIBdhQ_M8bg/edit'
};

// Almacenamiento Local (LocalStorage como respaldo)
const STORAGE_KEY = 'fleet_equipment_data';

// ====================================
// CLASE DE GESTIÓN DE DATOS
// ====================================
class EquipmentManager {
    constructor() {
        this.equipment = this.loadFromLocalStorage();
    }

    // Cargar datos desde LocalStorage
    loadFromLocalStorage() {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : this.getDefaultData();
    }

    // Guardar datos en LocalStorage
    saveToLocalStorage() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.equipment));
    }

    // Datos de ejemplo (para comenzar)
    getDefaultData() {
        return [
            {
                id: '1',
                name: 'Camión Volqueta 1',
                reference: 'ABC-123',
                type: 'volqueta',
                status: 'activo',
                odometerType: 'km',
                odometerValue: 125000,
                maintenanceType: 'preventivo',
                operationalStatus: 'operativo',
                partsRequest: 'no',
                partsDetails: '',
                observations: 'En buen estado general',
                lastMaintenance: '2026-01-05',
                nextMaintenance: '2026-02-05',
                createdAt: new Date().toISOString()
            },
            {
                id: '2',
                name: 'Excavadora CAT 320',
                reference: 'EXC-001',
                type: 'excavadora',
                status: 'activo',
                odometerType: 'horas',
                odometerValue: 3450,
                maintenanceType: 'correctivo',
                operationalStatus: 'requiere_servicio_urgente',
                partsRequest: 'si',
                partsDetails: 'Filtro de aceite, filtros hidráulicos',
                observations: 'Presenta fuga en sistema hidráulico',
                lastMaintenance: '2025-12-20',
                nextMaintenance: '2026-01-15',
                createdAt: new Date().toISOString()
            }
        ];
    }

    // Obtener todos los equipos
    getAllEquipment() {
        return this.equipment;
    }

    // Obtener equipo por ID
    getEquipmentById(id) {
        return this.equipment.find(eq => eq.id === id);
    }

    // Agregar nuevo equipo
    addEquipment(equipmentData) {
        const newEquipment = {
            ...equipmentData,
            id: this.generateId(),
            createdAt: new Date().toISOString()
        };
        this.equipment.push(newEquipment);
        this.saveToLocalStorage();
        return newEquipment;
    }

    // Actualizar equipo
    updateEquipment(id, equipmentData) {
        const index = this.equipment.findIndex(eq => eq.id === id);
        if (index !== -1) {
            this.equipment[index] = { ...this.equipment[index], ...equipmentData };
            this.saveToLocalStorage();
            return this.equipment[index];
        }
        return null;
    }

    // Eliminar equipo
    deleteEquipment(id) {
        const index = this.equipment.findIndex(eq => eq.id === id);
        if (index !== -1) {
            this.equipment.splice(index, 1);
            this.saveToLocalStorage();
            return true;
        }
        return false;
    }

    // Generar ID único
    generateId() {
        return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    }

    // Obtener estadísticas
    getStats() {
        return {
            active: this.equipment.filter(eq => eq.status === 'activo').length,
            needsMaintenance: this.equipment.filter(eq => 
                eq.maintenanceType === 'preventivo' || eq.maintenanceType === 'correctivo'
            ).length,
            critical: this.equipment.filter(eq => 
                eq.operationalStatus === 'fuera_de_servicio' || 
                eq.operationalStatus === 'requiere_servicio_urgente'
            ).length,
            partsRequests: this.equipment.filter(eq => eq.partsRequest === 'si').length
        };
    }
}

// Instancia global del manager
const equipmentManager = new EquipmentManager();

// ====================================
// FUNCIONES DE UTILIDAD
// ====================================

// Formatear fecha
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
}

// Obtener badge HTML según el valor
function getStatusBadge(status) {
    const badges = {
        activo: '<span class="badge badge-success">Activo</span>',
        inactivo: '<span class="badge badge-danger">Inactivo</span>'
    };
    return badges[status] || status;
}

function getMaintenanceBadge(type) {
    const badges = {
        preventivo: '<span class="badge badge-warning">Preventivo</span>',
        correctivo: '<span class="badge badge-danger">Correctivo</span>',
        ninguno: '<span class="badge badge-success">Ninguno</span>'
    };
    return badges[type] || type;
}

function getOperationalBadge(status) {
    const badges = {
        operativo: '<span class="badge badge-success">Operativo</span>',
        mantenimiento_programado: '<span class="badge badge-info">Mantto. Programado</span>',
        requiere_servicio_urgente: '<span class="badge badge-warning">Servicio Urgente</span>',
        fuera_de_servicio: '<span class="badge badge-danger">Fuera de Servicio</span>'
    };
    return badges[status] || status;
}

function getPartsRequestBadge(hasRequest) {
    return hasRequest === 'si' 
        ? '<span class="badge badge-warning">Sí</span>' 
        : '<span class="badge badge-secondary">No</span>';
}

// ====================================
// EXPORTAR A EXCEL
// ====================================
function exportToExcel() {
    const equipment = equipmentManager.getAllEquipment();
    
    // Crear encabezados
    const headers = [
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
        'Próximo Mantto.'
    ];
    
    // Crear filas de datos
    const rows = equipment.map(eq => [
        eq.name,
        eq.reference,
        eq.type,
        eq.status,
        eq.odometerType,
        eq.odometerValue,
        eq.maintenanceType,
        eq.operationalStatus,
        eq.partsRequest,
        eq.partsDetails || '',
        eq.observations || '',
        eq.lastMaintenance || '',
        eq.nextMaintenance || ''
    ]);
    
    // Crear CSV
    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
        csv += row.map(cell => `"${cell}"`).join(',') + '\n';
    });
    
    // Descargar archivo
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `equipos_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ====================================
// INICIALIZACIÓN DE ENLACES
// ====================================
document.addEventListener('DOMContentLoaded', function() {
    // Configurar enlaces de exportación
    const exportButtons = document.querySelectorAll('#exportExcel');
    exportButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            exportToExcel();
        });
    });
    
    // Configurar enlaces de Google Forms y Sheets
    const linkGoogleSheets = document.getElementById('linkGoogleSheets');
    if (linkGoogleSheets) {
        linkGoogleSheets.addEventListener('click', function(e) {
            e.preventDefault();
            if (CONFIG.SHEETS_VIEW_URL && CONFIG.SHEETS_VIEW_URL !== 'TU_URL_DE_GOOGLE_SHEETS') {
                window.open(CONFIG.SHEETS_VIEW_URL, '_blank');
            } else {
                alert('Por favor, configura la URL de Google Sheets en el archivo app.js');
            }
        });
    }
    
    // Formulario de Daños/Necesidad de Mantenimiento
    const linkDamageForm = document.getElementById('linkDamageForm');
    if (linkDamageForm) {
        linkDamageForm.addEventListener('click', function(e) {
            e.preventDefault();
            if (CONFIG.DAMAGE_FORM_URL && CONFIG.DAMAGE_FORM_URL !== 'TU_URL_DE_FORMULARIO_DANO') {
                window.open(CONFIG.DAMAGE_FORM_URL, '_blank');
            } else {
                alert('Por favor, configura la URL del Formulario de Daños en el archivo app.js');
            }
        });
    }
    
    // Formulario de Mantenimiento Realizado
    const linkMaintenanceForm = document.getElementById('linkMaintenanceForm');
    if (linkMaintenanceForm) {
        linkMaintenanceForm.addEventListener('click', function(e) {
            e.preventDefault();
            if (CONFIG.MAINTENANCE_FORM_URL && CONFIG.MAINTENANCE_FORM_URL !== 'TU_URL_DE_FORMULARIO_MANTENIMIENTO') {
                window.open(CONFIG.MAINTENANCE_FORM_URL, '_blank');
            } else {
                alert('Por favor, configura la URL del Formulario de Mantenimiento en el archivo app.js');
            }
        });
    }
    
    // Formulario de Solicitud de Repuestos
    const linkPartsForm = document.getElementById('linkPartsForm');
    if (linkPartsForm) {
        linkPartsForm.addEventListener('click', function(e) {
            e.preventDefault();
            if (CONFIG.PARTS_FORM_URL && CONFIG.PARTS_FORM_URL !== 'TU_URL_DE_FORMULARIO_REPUESTOS') {
                window.open(CONFIG.PARTS_FORM_URL, '_blank');
            } else {
                alert('Por favor, configura la URL del Formulario de Repuestos en el archivo app.js');
            }
        });
    }
});

// ====================================
// FUNCIONES PARA DASHBOARD (index.html)
// ====================================
if (document.getElementById('equipmentTableBody')) {
    // Cargar estadísticas
    function loadStats() {
        const stats = equipmentManager.getStats();
        document.getElementById('activeCount').textContent = stats.active;
        document.getElementById('maintenanceCount').textContent = stats.needsMaintenance;
        document.getElementById('criticalCount').textContent = stats.critical;
        document.getElementById('partsCount').textContent = stats.partsRequests;
    }

    // Cargar tabla de equipos
    function loadEquipmentTable(filters = {}) {
        const tbody = document.getElementById('equipmentTableBody');
        let equipment = equipmentManager.getAllEquipment();
        
        // Aplicar filtros
        if (filters.status && filters.status !== 'all') {
            equipment = equipment.filter(eq => eq.status === filters.status);
        }
        if (filters.maintenance && filters.maintenance !== 'all') {
            equipment = equipment.filter(eq => eq.maintenanceType === filters.maintenance);
        }
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            equipment = equipment.filter(eq => 
                eq.name.toLowerCase().includes(searchLower) || 
                eq.reference.toLowerCase().includes(searchLower)
            );
        }
        
        tbody.innerHTML = '';
        
        if (equipment.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center">No se encontraron equipos</td></tr>';
            return;
        }
        
        equipment.forEach(eq => {
            const row = `
                <tr>
                    <td><strong>${eq.name}</strong></td>
                    <td>${eq.reference}</td>
                    < críticas (equipos fuera de servicio)
    function loadCriticalAlerts() {
        const container = document.getElementById('criticalAlertsContainer');
        const equipment = equipmentManager.getAllEquipment();
        
        const criticalAlerts = [];
        
        equipment.forEach(eq => {
            if (eq.operationalStatus === 'fuera_de_servicio') {
                criticalAlerts.push({
                    type: 'danger',
                    message: `<strong>${eq.name}</strong> (${eq.reference}) está fuera de servicio`
                });
            } else if (eq.operationalStatus === 'requiere_servicio_urgente') {
                criticalAlerts.push({
                    type: 'danger',
                    message: `<strong>${eq.name}</strong> (${eq.reference}) requiere servicio urgente`
                });
            }
        });
        
        if (criticalAlerts.length === 0) {
            container.innerHTML = '<div class="alert alert-info">✅ No hay equipos en estado crítico</div>';
        } else {
            container.innerHTML = criticalAlerts.map(alert => 
                `<div class="alert alert-${alert.type}">${alert.message}</div>`
            ).join('');
        }
    }
    
    // Cargar alertas de mantenimiento
    function loadMaintenanceAlerts() {
        const container = document.getElementById('maintenanceAlertsContainer');
        const equipment = equipmentManager.getAllEquipment();
        
        const maintenanceAlerts = [];
        
        equipment.forEach(eq => {
            // Alertas de solicitud de repuestos
            if (eq.partsRequest === 'si') {
                maintenanceAlerts.push({
                    type: 'warning',
                    message: `<strong>${eq.name}</strong> (${eq.reference}) tiene solicitud de repuestos pendiente`
                });
            }
            
            // Alertas de mantenimiento próximo
            if (eq.nextMaintenance) {
                const nextDate = new Date(eq.nextMaintenance);
                const today = new Date();
                const diffDays = Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24));
                
                if (diffDays <= 7 && diffDays >= 0) {
                    maintenanceAlerts.push({
                        type: 'warning',
                        message: `<strong>${eq.name}</strong> (${eq.reference}) tiene mantenimiento programado en ${diffDays} día(s)`
                    });
                } else if (diffDays < 0) {
                    maintenanceAlerts.push({
                        type: 'danger',
                        message: `<strong>${eq.name}</strong> (${eq.reference}) tiene mantenimiento vencido hace ${Math.abs(diffDays)} día(s)`
                    });
                }
            }
            
            // Alertas de mantenimiento requerido
            if (eq.maintenanceType === 'correctivo') {
                maintenanceAlerts.push({
                    type: 'info',
                    message: `<strong>${eq.name}</strong> (${eq.reference}) requiere mantenimiento correctivo`
                });
            } else if (eq.maintenanceType === 'preventivo') {
                maintenanceAlerts.push({
                    type: 'info',
                    message: `<strong>${eq.name}</strong> (${eq.reference}) requiere mantenimiento preventivo`
                });
            }
        });
        
        if (maintenanceAlerts.length === 0) {
            container.innerHTML = '<div class="alert alert-info">✅ No hay alertas de mantenimiento pendientes</div>';
        } else {
            container.innerHTML = maintenanceAlerts.map(alert => 
                `<div class="alert alert-${alert.type}">${alert.message}</div>`
            ).join('');
        }
    }
    
    // Cargar vista previa de Kanban
    function loadKanbanPreview() {
        const container = document.getElementById('kanbanPreview');
        if (!container) return;
        
        // Esta función se puede expandir cuando tengamos solicitudes reales
        container.innerHTML = `
            <div class="stat-card info">
                <h4>📝 Reportados</h4>
                <p class="stat-number">2</p>
            </div>
            <div class="stat-card warning">
                <h4>🔧 En Proceso</h4>
                <p class="stat-number">1</p>
            </div>
            <div class="stat-card secondary">
                <h4>⏳ Esperando</h4>
                <p class="stat-number">1</p>
            </div>
            <div class="stat-card success">
                <h4>✅ Completados</h4>
                <p class="stat-number">3</p>
            </div>
        `;       } else if (diffDays < 0) {
                    alerts.push({
                        type: 'danger',
                        message: `<strong>${eq.name}</strong> tiene mantenimiento vencido`
        CriticalAlerts();
    loadMaintenanceAlerts();
    loadEquipmentTable();
    loadKanbanPreview  }
            }
        });
        
        if (alerts.length === 0) {
            container.innerHTML = '<div class="alert alert-info">✅ No hay alertas en este momento</div>';
        } else {
            container.innerHTML = alerts.map(alert => 
                `<div class="alert alert-${alert.type}">${alert.message}</div>`
            ).join('');
        }
    }

    // Event listeners para filtros
    document.getElementById('filterStatus').addEventListener('change', applyFilters);
    document.getElementById('filterMaintenance').addEventListener('change', applyFilters);
    document.getElementById('searchEquipment').addEventListener('input', applyFilters);

    function applyFilters() {
        const filters = {
            status: document.getElementById('filterStatus').value,
            maintenance: document.getElementById('filterMaintenance').value,
            search: document.getElementById('searchEquipment').value
        };
        loadEquipmentTable(filters);
    }

    // Funciones globales para acciones
    window.viewEquipment = function(id) {
        const eq = equipmentManager.getEquipmentById(id);
        if (eq) {
            alert(`
Detalles de: ${eq.name}
━━━━━━━━━━━━━━━━━━━━━━
Referencia: ${eq.reference}
Tipo: ${eq.type}
Estado: ${eq.status}
Odómetro: ${eq.odometerValue} ${eq.odometerType}
Mantenimiento: ${eq.maintenanceType}
Estado Operativo: ${eq.operationalStatus}
Solicitud Repuestos: ${eq.partsRequest}
${eq.partsDetails ? 'Detalles: ' + eq.partsDetails : ''}
${eq.observations ? 'Observaciones: ' + eq.observations : ''}
Último Mantto.: ${formatDate(eq.lastMaintenance)}
Próximo Mantto.: ${formatDate(eq.nextMaintenance)}
            `);
        }
    };

    window.editEquipment = function(id) {
        window.location.href = `equipos.html?edit=${id}`;
    };

    // Inicializar dashboard
    loadStats();
    loadEquipmentTable();
    loadAlerts();
}

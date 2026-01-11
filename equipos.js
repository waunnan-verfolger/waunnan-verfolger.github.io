// ====================================
// GESTIÓN DE EQUIPOS
// Archivo: equipos.js
// ====================================

// Esperar a que equipmentManager esté disponible
function waitForManager(callback) {
    if (window.equipmentManager) {
        callback();
    } else {
        setTimeout(() => waitForManager(callback), 100);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    waitForManager(initEquipmentPage);
});

function initEquipmentPage() {
    const form = document.getElementById('equipmentForm');
    const partsRequestSelect = document.getElementById('partsRequest');
    const partsDetailsGroup = document.getElementById('partsDetailsGroup');
    const cancelBtn = document.getElementById('cancelBtn');
    
    // Mostrar/ocultar campo de detalles de repuestos
    partsRequestSelect.addEventListener('change', function() {
        if (this.value === 'si') {
            partsDetailsGroup.style.display = 'block';
        } else {
            partsDetailsGroup.style.display = 'none';
            document.getElementById('partsDetails').value = '';
        }
    });
    
    // Verificar si estamos editando un equipo
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('edit');
    
    if (editId) {
        loadEquipmentForEdit(editId);
    }
    
    // Manejar envío del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        saveEquipment();
    });
    
    // Botón cancelar
    cancelBtn.addEventListener('click', function() {
        if (confirm('¿Está seguro de cancelar? Los cambios no guardados se perderán.')) {
            resetForm();
            window.location.href = 'index.html';
        }
    });
    
    // Cargar lista de equipos
    loadEquipmentList();
}

// Cargar equipo para edición
function loadEquipmentForEdit(id) {
    const equipment = window.equipmentManager.getEquipmentById(id);
    if (!equipment) {
        alert('Equipo no encontrado');
        return;
    }
    
    document.getElementById('formTitle').textContent = 'Editar Equipo';
    document.getElementById('equipmentId').value = equipment.id;
    document.getElementById('equipmentName').value = equipment.name;
    document.getElementById('equipmentReference').value = equipment.reference;
    document.getElementById('equipmentType').value = equipment.type;
    document.getElementById('equipmentStatus').value = equipment.status;
    document.getElementById('odometerType').value = equipment.odometerType;
    document.getElementById('odometerValue').value = equipment.odometerValue;
    document.getElementById('maintenanceType').value = equipment.maintenanceType;
    document.getElementById('operationalStatus').value = equipment.operationalStatus;
    document.getElementById('partsRequest').value = equipment.partsRequest;
    
    if (equipment.partsRequest === 'si') {
        document.getElementById('partsDetailsGroup').style.display = 'block';
        document.getElementById('partsDetails').value = equipment.partsDetails || '';
    }
    
    document.getElementById('observations').value = equipment.observations || '';
    document.getElementById('lastMaintenance').value = equipment.lastMaintenance || '';
    document.getElementById('nextMaintenance').value = equipment.nextMaintenance || '';
    
    document.getElementById('submitBtn').innerHTML = '💾 Actualizar Equipo';
}

// Guardar equipo (crear o actualizar)
function saveEquipment() {
    try {
        // Usar window.equipmentManager directamente
        const manager = window.equipmentManager;
        
        if (!manager) {
            alert('❌ Error: Sistema no inicializado correctamente. Por favor, recargue la página.');
            console.error('equipmentManager no está disponible en window');
            return;
        }
        
        console.log('Guardando equipo con manager:', manager);
        
        const equipmentData = {
            name: document.getElementById('equipmentName').value,
            reference: document.getElementById('equipmentReference').value,
            type: document.getElementById('equipmentType').value,
            status: document.getElementById('equipmentStatus').value,
            odometerType: document.getElementById('odometerType').value,
            odometerValue: parseInt(document.getElementById('odometerValue').value) || 0,
            maintenanceType: document.getElementById('maintenanceType').value,
            operationalStatus: document.getElementById('operationalStatus').value,
            partsRequest: document.getElementById('partsRequest').value,
            partsDetails: document.getElementById('partsDetails').value,
            observations: document.getElementById('observations').value,
            lastMaintenance: document.getElementById('lastMaintenance').value,
            nextMaintenance: document.getElementById('nextMaintenance').value
        };
        
        console.log('Datos del equipo:', equipmentData);
        
        const editId = document.getElementById('equipmentId').value;
        
        if (editId) {
            // Actualizar
            manager.updateEquipment(editId, equipmentData);
            console.log('Equipo actualizado:', editId);
            alert('✅ Equipo actualizado exitosamente');
        } else {
            // Crear nuevo
            manager.addEquipment(equipmentData);
            console.log('Equipo agregado');
            alert('✅ Equipo agregado exitosamente');
        }
        
        resetForm();
        loadEquipmentList();
        
        // Opcional: redirigir al dashboard
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
        
    } catch (error) {
        console.error('Error al guardar equipo:', error);
        alert('❌ Error al guardar el equipo: ' + error.message + '. Por favor, intente nuevamente.');
    }
}

// Resetear formulario
function resetForm() {
    document.getElementById('equipmentForm').reset();
    document.getElementById('equipmentId').value = '';
    document.getElementById('formTitle').textContent = 'Agregar Nuevo Equipo';
    document.getElementById('submitBtn').innerHTML = '💾 Guardar Equipo';
    document.getElementById('partsDetailsGroup').style.display = 'none';
    
    // Eliminar parámetro de edición de la URL
    const url = new URL(window.location);
    url.searchParams.delete('edit');
    window.history.replaceState({}, '', url);
}

// Cargar lista de equipos
function loadEquipmentList() {
    try {
        const grid = document.getElementById('equipmentGrid');
        const manager = window.equipmentManager;
        
        if (!manager) {
            grid.innerHTML = '<p class="text-center">⚠️ Error: Sistema no inicializado. Por favor, recargue la página.</p>';
            console.error('equipmentManager no está disponible en window');
            return;
        }
        
        const equipment = manager.getAllEquipment();
        console.log('Equipos cargados:', equipment.length);
        
        if (equipment.length === 0) {
            grid.innerHTML = '<p class="text-center">No hay equipos registrados aún.</p>';
            return;
        }
        
        grid.innerHTML = '';
        
        equipment.forEach(eq => {
            const card = createEquipmentCard(eq);
            grid.innerHTML += card;
        });
        
    } catch (error) {
        console.error('Error al cargar equipos:', error);
        const grid = document.getElementById('equipmentGrid');
        grid.innerHTML = '<p class="text-center">❌ Error al cargar equipos. Por favor, recargue la página.</p>';
    }
}

// Crear tarjeta de equipo
function createEquipmentCard(eq) {
    const typeLabels = {
        camion: 'Camión',
        volqueta: 'Volqueta',
        excavadora: 'Excavadora',
        retroexcavadora: 'Retroexcavadora',
        cargador: 'Cargador',
        grua: 'Grúa',
        maquinaria_pesada: 'Maquinaria Pesada',
        otro: 'Otro'
    };
    
    const operationalLabels = {
        operativo: 'Operativo',
        mantenimiento_programado: 'Mantto. Programado',
        requiere_servicio_urgente: 'Servicio Urgente',
        fuera_de_servicio: 'Fuera de Servicio'
    };
    
    return `
        <div class="equipment-card">
            <div class="equipment-card-header">
                <div>
                    <h4 class="equipment-card-title">${eq.name}</h4>
                    <p class="equipment-card-reference">${eq.reference}</p>
                </div>
                <div>
                    ${getStatusBadge(eq.status)}
                </div>
            </div>
            <div class="equipment-card-body">
                <div class="equipment-card-info">
                    <span class="equipment-card-label">Tipo:</span>
                    <span>${typeLabels[eq.type] || eq.type}</span>
                </div>
                <div class="equipment-card-info">
                    <span class="equipment-card-label">Odómetro:</span>
                    <span>${eq.odometerValue} ${eq.odometerType}</span>
                </div>
                <div class="equipment-card-info">
                    <span class="equipment-card-label">Mantenimiento:</span>
                    ${getMaintenanceBadge(eq.maintenanceType)}
                </div>
                <div class="equipment-card-info">
                    <span class="equipment-card-label">Estado Operativo:</span>
                    ${getOperationalBadge(eq.operationalStatus)}
                </div>
                <div class="equipment-card-info">
                    <span class="equipment-card-label">Repuestos:</span>
                    ${getPartsRequestBadge(eq.partsRequest)}
                </div>
            </div>
            <div class="equipment-card-actions">
                <button class="btn btn-primary btn-sm" onclick="editEquipmentFromCard('${eq.id}')">
                    ✏️ Editar
                </button>
                <button class="btn btn-secondary btn-sm" onclick="viewHistory('${eq.id}')">
                    📜 Historial
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteEquipmentFromCard('${eq.id}')">
                    🗑️ Eliminar
                </button>
            </div>
        </div>
    `;
}

// Editar equipo desde tarjeta
window.editEquipmentFromCard = function(id) {
    loadEquipmentForEdit(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Eliminar equipo desde tarjeta
window.deleteEquipmentFromCard = function(id) {
    const equipment = equipmentManager.getEquipmentById(id);
    if (!equipment) return;
    
    if (confirm(`¿Está seguro de eliminar el equipo "${equipment.name}"?\n\nEsta acción no se puede deshacer.`)) {
        equipmentManager.deleteEquipment(id);
        alert('✅ Equipo eliminado exitosamente');
        loadEquipmentList();
    }
};

// Ver historial de mantenimiento
window.viewHistory = function(id) {
    const equipment = equipmentManager.getEquipmentById(id);
    if (!equipment) return;
    
    const historySection = document.getElementById('maintenanceHistorySection');
    const historyEquipmentName = document.getElementById('historyEquipmentName');
    const historyTimeline = document.getElementById('historyTimeline');
    
    historyEquipmentName.textContent = `${equipment.name} (${equipment.reference})`;
    
    // Obtener historial del equipo (de requestsManager si existe)
    let history = [];
    if (typeof requestsManager !== 'undefined') {
        history = requestsManager.getRequestsByEquipment(equipment.reference);
    }
    
    // Agregar información de mantenimientos programados
    if (equipment.lastMaintenance) {
        history.push({
            id: 'last-' + equipment.id,
            type: 'maintenance_done',
            description: 'Último mantenimiento registrado',
            reportedDate: equipment.lastMaintenance,
            status: 'completed',
            reportedBy: 'Sistema'
        });
    }
    
    if (history.length === 0) {
        historyTimeline.innerHTML = '<p class="text-center">No hay historial de mantenimiento para este equipo</p>';
    } else {
        // Ordenar por fecha (más reciente primero)
        history.sort((a, b) => new Date(b.reportedDate) - new Date(a.reportedDate));
        
        historyTimeline.innerHTML = history.map(item => {
            const statusLabels = {
                reported: '📝 Reportado',
                in_progress: '🔧 En Proceso',
                waiting_parts: '⏳ Esperando Repuestos',
                completed: '✅ Completado'
            };
            
            const typeLabels = {
                damage: '⚠️ Daño Reportado',
                maintenance_done: '✅ Mantenimiento Realizado',
                parts_request: '📦 Solicitud de Repuestos'
            };
            
            return `
                <div class="timeline-item status-${item.status}">
                    <div class="timeline-marker"></div>
                    <div class="timeline-content">
                        <div class="timeline-header">
                            <span class="timeline-status">${statusLabels[item.status]}</span>
                            <span class="timeline-date">${formatDate(item.reportedDate)}</span>
                        </div>
                        <div class="timeline-type">${typeLabels[item.type]}</div>
                        <p class="timeline-description">${item.description || 'Sin descripción'}</p>
                        <div class="timeline-footer">
                            <span>Por: ${item.reportedBy || 'N/A'}</span>
                            ${item.location ? '<span>📍 ' + item.location + '</span>' : ''}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    historySection.style.display = 'block';
    window.scrollTo({ top: historySection.offsetTop - 100, behavior: 'smooth' });
};

// Cerrar historial
window.closeHistory = function() {
    document.getElementById('maintenanceHistorySection').style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// ====================================
// VISTA KANBAN
// Archivo: kanban.js
// ====================================

// Almacenamiento de solicitudes de mantenimiento
const MAINTENANCE_REQUESTS_KEY = 'fleet_maintenance_requests';
const PARTS_REQUESTS_KEY = 'fleet_parts_requests';

// Clase para gestionar solicitudes
class MaintenanceRequestsManager {
    constructor() {
        this.requests = this.loadRequests();
    }

    loadRequests() {
        const data = localStorage.getItem(MAINTENANCE_REQUESTS_KEY);
        return data ? JSON.parse(data) : this.getDefaultRequests();
    }

    saveRequests() {
        localStorage.setItem(MAINTENANCE_REQUESTS_KEY, JSON.stringify(this.requests));
    }

    getDefaultRequests() {
        // Datos de ejemplo para demostración
        return [
            {
                id: '1',
                type: 'damage',
                equipmentName: 'Camión Volqueta 1',
                equipmentRef: 'ABC-123',
                description: 'Problema en frenos delanteros',
                priority: 'alta',
                status: 'reported',
                reportedBy: 'Juan Pérez',
                reportedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                location: 'Planta Principal',
                hasPhoto: true
            },
            {
                id: '2',
                type: 'maintenance_done',
                equipmentName: 'Excavadora CAT 320',
                equipmentRef: 'EXC-001',
                description: 'Cambio de filtros hidráulicos completado',
                priority: 'media',
                status: 'completed',
                reportedBy: 'Carlos Gómez',
                reportedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                completedDate: new Date().toISOString(),
                location: 'Taller Central'
            },
            {
                id: '3',
                type: 'damage',
                equipmentName: 'Cargador Frontal',
                equipmentRef: 'CAR-002',
                description: 'Requiere cambio de aceite motor',
                priority: 'media',
                status: 'in_progress',
                reportedBy: 'María López',
                reportedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                location: 'Zona Norte'
            },
            {
                id: '4',
                type: 'damage',
                equipmentName: 'Volqueta Mercedes',
                equipmentRef: 'VOL-005',
                description: 'Fuga en sistema de refrigeración',
                priority: 'urgente',
                status: 'waiting_parts',
                reportedBy: 'Pedro Ramírez',
                reportedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                location: 'Obra El Bosque'
            }
        ];
    }

    getAllRequests() {
        return this.requests;
    }

    getRequestsByStatus(status) {
        return this.requests.filter(req => req.status === status);
    }

    getRequestsByEquipment(equipmentRef) {
        return this.requests.filter(req => req.equipmentRef === equipmentRef);
    }

    addRequest(request) {
        const newRequest = {
            ...request,
            id: this.generateId(),
            reportedDate: new Date().toISOString(),
            status: 'reported'
        };
        this.requests.push(newRequest);
        this.saveRequests();
        return newRequest;
    }

    updateRequestStatus(id, newStatus) {
        const request = this.requests.find(req => req.id === id);
        if (request) {
            request.status = newStatus;
            if (newStatus === 'completed') {
                request.completedDate = new Date().toISOString();
            }
            this.saveRequests();
        }
    }

    generateId() {
        return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    }
}

const requestsManager = new MaintenanceRequestsManager();

// Inicializar Kanban
document.addEventListener('DOMContentLoaded', function() {
    loadKanbanView();
    setupEventListeners();
    loadEquipmentFilterOptions();
});

function setupEventListeners() {
    document.getElementById('kanbanType').addEventListener('change', function() {
        const type = this.value;
        if (type === 'equipment') {
            document.getElementById('equipmentFilterGroup').style.display = 'block';
            showEquipmentKanban();
        } else {
            document.getElementById('equipmentFilterGroup').style.display = 'none';
            showMaintenanceKanban();
        }
    });

    document.getElementById('equipmentFilter').addEventListener('change', function() {
        const equipmentRef = this.value;
        loadEquipmentKanban(equipmentRef);
    });
}

function loadEquipmentFilterOptions() {
    const select = document.getElementById('equipmentFilter');
    const equipment = equipmentManager.getAllEquipment();
    
    select.innerHTML = '<option value="all">Todos los equipos</option>';
    equipment.forEach(eq => {
        const option = document.createElement('option');
        option.value = eq.reference;
        option.textContent = `${eq.name} (${eq.reference})`;
        select.appendChild(option);
    });
}

function showMaintenanceKanban() {
    document.getElementById('maintenanceKanban').style.display = 'flex';
    document.getElementById('equipmentKanban').style.display = 'none';
    loadMaintenanceKanban();
}

function showEquipmentKanban() {
    document.getElementById('maintenanceKanban').style.display = 'none';
    document.getElementById('equipmentKanban').style.display = 'block';
    loadEquipmentKanban('all');
}

function loadKanbanView() {
    loadMaintenanceKanban();
}

function loadMaintenanceKanban() {
    const requests = requestsManager.getAllRequests();
    
    // Limpiar columnas
    document.getElementById('columnReported').innerHTML = '';
    document.getElementById('columnInProgress').innerHTML = '';
    document.getElementById('columnWaiting').innerHTML = '';
    document.getElementById('columnCompleted').innerHTML = '';
    
    // Contar por estado
    const counts = {
        reported: 0,
        in_progress: 0,
        waiting_parts: 0,
        completed: 0
    };
    
    // Distribuir tarjetas
    requests.forEach(request => {
        const card = createKanbanCard(request);
        const columnId = getColumnId(request.status);
        document.getElementById(columnId).innerHTML += card;
        counts[request.status]++;
    });
    
    // Actualizar contadores
    document.getElementById('countReported').textContent = counts.reported;
    document.getElementById('countInProgress').textContent = counts.in_progress;
    document.getElementById('countWaiting').textContent = counts.waiting_parts;
    document.getElementById('countCompleted').textContent = counts.completed;
    
    // Actualizar estadísticas
    updateKanbanStats(requests);
}

function getColumnId(status) {
    const mapping = {
        reported: 'columnReported',
        in_progress: 'columnInProgress',
        waiting_parts: 'columnWaiting',
        completed: 'columnCompleted'
    };
    return mapping[status] || 'columnReported';
}

function createKanbanCard(request) {
    const priorityColors = {
        urgente: 'danger',
        alta: 'warning',
        media: 'info',
        baja: 'secondary'
    };
    
    const priorityLabels = {
        urgente: '🚨 Urgente',
        alta: '⚠️ Alta',
        media: '📌 Media',
        baja: '📋 Baja'
    };
    
    const typeLabels = {
        damage: '⚠️ Daño Reportado',
        maintenance_done: '✅ Mantto. Realizado',
        parts_request: '📦 Solicitud Repuestos'
    };
    
    const daysAgo = Math.floor((Date.now() - new Date(request.reportedDate)) / (1000 * 60 * 60 * 24));
    
    return `
        <div class="kanban-card" data-id="${request.id}">
            <div class="kanban-card-header">
                <span class="badge badge-${priorityColors[request.priority]}">
                    ${priorityLabels[request.priority]}
                </span>
                <span class="kanban-card-date">${daysAgo === 0 ? 'Hoy' : `Hace ${daysAgo}d`}</span>
            </div>
            <div class="kanban-card-body">
                <div class="kanban-card-type">${typeLabels[request.type]}</div>
                <h4 class="kanban-card-equipment">${request.equipmentName}</h4>
                <p class="kanban-card-ref">${request.equipmentRef}</p>
                <p class="kanban-card-description">${request.description}</p>
                <div class="kanban-card-footer">
                    <span class="kanban-card-location">📍 ${request.location || 'N/A'}</span>
                    ${request.hasPhoto ? '<span class="kanban-card-photo">📷</span>' : ''}
                </div>
                <div class="kanban-card-reporter">Por: ${request.reportedBy}</div>
            </div>
            <div class="kanban-card-actions">
                ${createStatusButtons(request)}
            </div>
        </div>
    `;
}

function createStatusButtons(request) {
    const statusFlow = {
        reported: { next: 'in_progress', label: '🔧 Iniciar' },
        in_progress: { next: 'waiting_parts', label: '⏳ Esperar Repuestos', alt: 'completed', altLabel: '✅ Completar' },
        waiting_parts: { next: 'in_progress', label: '🔧 Reanudar' },
        completed: null
    };
    
    const flow = statusFlow[request.status];
    if (!flow) return '';
    
    let buttons = `<button class="btn-kanban btn-sm" onclick="moveCard('${request.id}', '${flow.next}')">${flow.label}</button>`;
    if (flow.alt) {
        buttons += `<button class="btn-kanban btn-sm" onclick="moveCard('${request.id}', '${flow.alt}')">${flow.altLabel}</button>`;
    }
    
    return buttons;
}

function moveCard(requestId, newStatus) {
    requestsManager.updateRequestStatus(requestId, newStatus);
    loadMaintenanceKanban();
}

function loadEquipmentKanban(equipmentRef) {
    const container = document.getElementById('equipmentKanbanContent');
    
    if (equipmentRef === 'all') {
        const equipment = equipmentManager.getAllEquipment();
        container.innerHTML = '<h3>Seleccione un equipo específico para ver su historial</h3>';
        return;
    }
    
    const requests = requestsManager.getRequestsByEquipment(equipmentRef);
    const equipment = equipmentManager.getAllEquipment().find(eq => eq.reference === equipmentRef);
    
    if (!equipment) {
        container.innerHTML = '<p>Equipo no encontrado</p>';
        return;
    }
    
    // Crear vista de timeline para el equipo
    let html = `
        <div class="equipment-kanban-header">
            <h3>${equipment.name}</h3>
            <p>${equipment.reference}</p>
            <div class="equipment-status">
                ${getStatusBadge(equipment.status)}
                ${getOperationalBadge(equipment.operationalStatus)}
            </div>
        </div>
        <div class="equipment-timeline">
    `;
    
    if (requests.length === 0) {
        html += '<p class="text-center">No hay solicitudes para este equipo</p>';
    } else {
        requests.sort((a, b) => new Date(b.reportedDate) - new Date(a.reportedDate));
        requests.forEach(req => {
            html += createTimelineItem(req);
        });
    }
    
    html += '</div>';
    container.innerHTML = html;
}

function createTimelineItem(request) {
    const statusLabels = {
        reported: '📝 Reportado',
        in_progress: '🔧 En Proceso',
        waiting_parts: '⏳ Esperando Repuestos',
        completed: '✅ Completado'
    };
    
    return `
        <div class="timeline-item status-${request.status}">
            <div class="timeline-marker"></div>
            <div class="timeline-content">
                <div class="timeline-header">
                    <span class="timeline-status">${statusLabels[request.status]}</span>
                    <span class="timeline-date">${formatDate(request.reportedDate)}</span>
                </div>
                <p class="timeline-description">${request.description}</p>
                <div class="timeline-footer">
                    <span>Por: ${request.reportedBy}</span>
                    <span>📍 ${request.location || 'N/A'}</span>
                </div>
            </div>
        </div>
    `;
}

function updateKanbanStats(requests) {
    document.getElementById('totalRequests').textContent = requests.length;
    
    // Calcular tiempo promedio de resolución
    const completed = requests.filter(r => r.status === 'completed' && r.completedDate);
    if (completed.length > 0) {
        const totalDays = completed.reduce((sum, req) => {
            const start = new Date(req.reportedDate);
            const end = new Date(req.completedDate);
            return sum + Math.floor((end - start) / (1000 * 60 * 60 * 24));
        }, 0);
        const avgDays = Math.round(totalDays / completed.length);
        document.getElementById('avgTime').textContent = `${avgDays} días`;
    }
    
    // Contar equipos únicos atendidos
    const uniqueEquipment = new Set(requests.map(r => r.equipmentRef));
    document.getElementById('equipmentServiced').textContent = uniqueEquipment.size;
}

function refreshKanban() {
    const type = document.getElementById('kanbanType').value;
    if (type === 'equipment') {
        const equipmentRef = document.getElementById('equipmentFilter').value;
        loadEquipmentKanban(equipmentRef);
    } else {
        loadMaintenanceKanban();
    }
}

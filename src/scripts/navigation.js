/**
 * Sistema de Navegación SPA para FrontDesk
 * Maneja la navegación entre vistas sin recargar la página
 */

import { 
  formatCurrency, 
  formatDate, 
  getStatusClass, 
  updateElement, 
  showToast 
} from './utils.js';

class SPANavigator {
  constructor() {
    this.currentView = 'dashboard';
    this.views = ['dashboard', 'loadbill', 'invoices', 'settings'];
    this.mockData = null;
    this.isInitialized = false;
    this.init();
  }

  /**
   * Inicializa el navegador SPA
   */
  init() {
    if (this.isInitialized) {
      console.warn('SPANavigator ya está inicializado');
      return;
    }
    
    this.setupEventListeners();
    this.loadMockData();
    this.navigateTo('dashboard'); // Vista por defecto
    this.isInitialized = true;
    
    showToast('Sistema de navegación inicializado', 'success', 2000);
  }

  /**
   * Configura los event listeners para los botones de navegación
   */
  setupEventListeners() {
    // Escuchar clicks en botones de navegación
    document.addEventListener('click', (event) => {
      const button = event.target.closest('[data-target]');
      if (button) {
        event.preventDefault();
        const target = button.getAttribute('data-target');
        this.navigateTo(target);
      }
    });

    // Manejar navegación con teclas
    document.addEventListener('keydown', (event) => {
      if (event.altKey) {
        switch(event.key) {
          case '1':
            this.navigateTo('dashboard');
            break;
          case '2':
            this.navigateTo('loadbill');
            break;
          case '3':
            this.navigateTo('invoices');
            break;
          case '4':
            this.navigateTo('settings');
            break;
        }
      }
    });
  }

  /**
   * Navega a una vista específica
   * @param {string} viewName - Nombre de la vista
   */
  navigateTo(viewName) {
    if (!this.views.includes(viewName)) {
      console.warn(`Vista '${viewName}' no encontrada`);
      return;
    }

    // Ocultar vista actual
    const currentViewElement = document.getElementById(`${this.currentView}-view`);
    if (currentViewElement) {
      currentViewElement.classList.remove('active');
    }

    // Mostrar nueva vista
    const newViewElement = document.getElementById(`${viewName}-view`);
    if (newViewElement) {
      newViewElement.classList.add('active');
    }

    // Actualizar navegación activa
    this.updateActiveNavigation(viewName);

    // Actualizar vista actual
    this.currentView = viewName;

    // Cargar datos específicos de la vista
    this.loadViewData(viewName);

    // Actualizar URL sin recargar (opcional)
    this.updateURL(viewName);

    console.log(`Navegando a: ${viewName}`);
  }

  /**
   * Actualiza la navegación activa visualmente
   * @param {string} viewName - Nombre de la vista activa
   */
  updateActiveNavigation(viewName) {
    // Remover clase activa de todos los botones
    document.querySelectorAll('.icon-btn').forEach(btn => {
      btn.classList.remove('active');
    });

    // Agregar clase activa al botón correspondiente
    const activeButton = document.querySelector(`[data-target="${viewName}"]`);
    if (activeButton) {
      activeButton.classList.add('active');
    }
  }

  /**
   * Carga datos específicos para cada vista
   * @param {string} viewName - Nombre de la vista
   */
  loadViewData(viewName) {
    switch(viewName) {
      case 'dashboard':
        this.loadDashboardData();
        break;
      case 'invoices':
        this.loadInvoicesData();
        break;
      case 'loadbill':
        this.loadBillFormData();
        break;
      case 'settings':
        this.loadSettingsData();
        break;
    }
  }

  /**
   * Carga datos del dashboard
   */
  loadDashboardData() {
    if (!this.mockData) return;

    try {
      // Actualizar estadísticas del dashboard
      this.updateDashboardStats();
      this.updateRecentInvoices();
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
      showToast('Error al cargar datos del dashboard', 'error');
    }
  }

  /**
   * Actualiza las estadísticas del dashboard
   */
  updateDashboardStats() {
    const stats = this.mockData.stats;
    
    // Actualizar elementos del DOM con las estadísticas
    this.updateElement('.total-invoices', stats.totalInvoices);
    this.updateElement('.total-amount', this.formatCurrency(stats.totalAmount));
    this.updateElement('.pending-invoices', stats.pendingInvoices);
    this.updateElement('.active-suppliers', stats.activeSuppliers);
    this.updateElement('.monthly-growth', `${stats.monthlyGrowth}%`);
  }

  /**
   * Carga facturas recientes en el dashboard
   */
  loadRecentInvoices() {
    const container = document.querySelector('#recent-invoices');
    if (!container || !this.mockData) return;

    try {
      const recentInvoices = this.mockData.invoices.slice(0, 5);
      
      container.innerHTML = recentInvoices.map(invoice => `
        <div class="invoice-item" data-invoice-id="${invoice.id}">
          <div class="invoice-info">
            <h4>${invoice.supplierName}</h4>
            <p>Factura #${invoice.invoiceNumber}</p>
            <span class="date">${formatDate(invoice.issueDate)}</span>
          </div>
          <div class="invoice-amount">
            <span class="amount">${formatCurrency(invoice.amount)}</span>
            <span class="status ${getStatusClass(invoice.status)}">${invoice.status}</span>
          </div>
        </div>
      `).join('');

      // Agregar event listeners para ver facturas
      container.querySelectorAll('.invoice-item').forEach(item => {
        item.addEventListener('click', (e) => {
          const invoiceId = e.currentTarget.dataset.invoiceId;
          this.viewInvoice(invoiceId);
        });
      });
    } catch (error) {
      console.error('Error cargando facturas recientes:', error);
      showToast('Error al cargar facturas recientes', 'error');
    }
  }

  /**
   * Carga datos de facturas
   */
  loadInvoicesData() {
    if (!this.mockData) return;

    const container = document.querySelector('.invoices-list');
    if (!container) return;

    try {
      this.showLoadingState('invoices');
      
      const invoices = this.mockData.invoices;
      
      container.innerHTML = invoices.map(invoice => `
        <tr>
          <td>${invoice.invoiceNumber}</td>
          <td>${invoice.supplierName}</td>
          <td>${formatCurrency(invoice.amount)}</td>
          <td>${formatDate(invoice.issueDate)}</td>
          <td>${formatDate(invoice.dueDate)}</td>
          <td><span class="status ${getStatusClass(invoice.status)}">${invoice.status}</span></td>
          <td>
            <button class="btn-sm" onclick="viewInvoice(${invoice.id})">Ver</button>
            <button class="btn-sm" onclick="editInvoice(${invoice.id})">Editar</button>
          </td>
        </tr>
      `).join('');
      
      this.hideLoadingState('invoices');
      showToast(`${invoices.length} facturas cargadas`, 'success', 2000);
    } catch (error) {
      console.error('Error cargando facturas:', error);
      showToast('Error al cargar facturas', 'error');
      this.hideLoadingState('invoices');
    }
  }

  /**
   * Carga datos para el formulario de carga de facturas
   */
  loadBillFormData() {
    if (!this.mockData) return;

    try {
      this.showLoadingState('loadbill');
      
      // Cargar proveedores en el select
      const supplierSelect = document.querySelector('#supplier-select');
      if (supplierSelect) {
        supplierSelect.innerHTML = '<option value="">Seleccionar proveedor...</option>' +
          this.mockData.suppliers.map(supplier => 
            `<option value="${supplier.id}">${supplier.companyName}</option>`
          ).join('');
      }

      // Cargar categorías
      const categorySelect = document.querySelector('#category-select');
      if (categorySelect) {
        categorySelect.innerHTML = '<option value="">Seleccionar categoría...</option>' +
          this.mockData.categories.map(category => 
            `<option value="${category}">${category}</option>`
          ).join('');
      }

      // Cargar métodos de pago
      const paymentSelect = document.querySelector('#payment-method-select');
      if (paymentSelect) {
        paymentSelect.innerHTML = '<option value="">Seleccionar método...</option>' +
          this.mockData.paymentMethods.map(method => 
            `<option value="${method}">${method}</option>`
          ).join('');
      }
      
      this.hideLoadingState('loadbill');
      showToast('Formulario de carga listo', 'success', 2000);
    } catch (error) {
      console.error('Error cargando datos del formulario:', error);
      showToast('Error al cargar formulario', 'error');
      this.hideLoadingState('loadbill');
    }
  }

  /**
   * Carga datos de configuración
   */
  loadSettingsData() {
    // Aquí se cargarían las configuraciones del sistema
    console.log('Cargando configuraciones...');
  }

  /**
   * Carga los datos mock desde el servidor o localStorage
   */
  loadMockData() {
    // En una implementación real, esto vendría de una API
    // Por ahora, usamos los datos que están en el HTML
    if (window.mockData) {
      this.mockData = window.mockData;
    } else {
      console.warn('Datos mock no encontrados');
    }
  }

  /**
   * Actualiza la URL sin recargar la página
   * @param {string} viewName - Nombre de la vista
   */
  updateURL(viewName) {
    const url = viewName === 'dashboard' ? '/' : `/${viewName}`;
    window.history.pushState({ view: viewName }, '', url);
  }

  /**
   * Muestra estado de carga para una vista
   * @param {string} viewId - ID de la vista
   */
  showLoadingState(viewId) {
    const view = document.querySelector(`#${viewId}`);
    if (view) {
      view.classList.add('loading');
    }
  }

  /**
   * Oculta estado de carga para una vista
   * @param {string} viewId - ID de la vista
   */
  hideLoadingState(viewId) {
    const view = document.querySelector(`#${viewId}`);
    if (view) {
      view.classList.remove('loading');
    }
  }
}

// Funciones globales para manejar acciones específicas
window.viewInvoice = function(id) {
  console.log(`Ver factura ${id}`);
  // Implementar lógica para ver factura
};

window.editInvoice = function(id) {
  console.log(`Editar factura ${id}`);
  // Implementar lógica para editar factura
};

// Exportar para uso en otros módulos
export default SPANavigator;

// También disponible globalmente para compatibilidad
if (typeof window !== 'undefined') {
  window.SPANavigator = SPANavigator;
}
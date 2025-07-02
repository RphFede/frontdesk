/**
 * Utilidades comunes para la aplicación FrontDesk
 * Funciones reutilizables para formateo, validación y manipulación de datos
 */

/**
 * Formatea una cantidad como moneda chilena
 * @param {number} amount - Cantidad a formatear
 * @returns {string} Cantidad formateada en CLP
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(amount);
}

/**
 * Formatea una fecha en formato chileno
 * @param {string|Date} dateInput - Fecha a formatear
 * @returns {string} Fecha formateada
 */
export function formatDate(dateInput) {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  return date.toLocaleDateString('es-CL');
}

/**
 * Formatea una fecha con hora
 * @param {string|Date} dateInput - Fecha a formatear
 * @returns {string} Fecha y hora formateadas
 */
export function formatDateTime(dateInput) {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  return date.toLocaleString('es-CL');
}

/**
 * Obtiene la clase CSS correspondiente a un estado de factura
 * @param {string} status - Estado de la factura
 * @returns {string} Clase CSS
 */
export function getStatusClass(status) {
  const statusMap = {
    'Pendiente': 'pending',
    'Pagada': 'paid',
    'Vencida': 'overdue',
    'Cancelada': 'cancelled',
    'En Proceso': 'processing'
  };
  return statusMap[status] || 'pending';
}

/**
 * Valida un RUT chileno
 * @param {string} rut - RUT a validar
 * @returns {boolean} True si el RUT es válido
 */
export function validateRUT(rut) {
  if (!rut || typeof rut !== 'string') return false;
  
  // Limpiar el RUT
  const cleanRUT = rut.replace(/[^0-9kK]/g, '');
  
  if (cleanRUT.length < 2) return false;
  
  const body = cleanRUT.slice(0, -1);
  const dv = cleanRUT.slice(-1).toLowerCase();
  
  // Calcular dígito verificador
  let sum = 0;
  let multiplier = 2;
  
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  
  const expectedDV = 11 - (sum % 11);
  const finalDV = expectedDV === 11 ? '0' : expectedDV === 10 ? 'k' : expectedDV.toString();
  
  return dv === finalDV;
}

/**
 * Formatea un RUT con puntos y guión
 * @param {string} rut - RUT a formatear
 * @returns {string} RUT formateado
 */
export function formatRUT(rut) {
  if (!rut) return '';
  
  const cleanRUT = rut.replace(/[^0-9kK]/g, '');
  if (cleanRUT.length < 2) return rut;
  
  const body = cleanRUT.slice(0, -1);
  const dv = cleanRUT.slice(-1);
  
  // Agregar puntos cada 3 dígitos
  const formattedBody = body.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  
  return `${formattedBody}-${dv}`;
}

/**
 * Valida un email
 * @param {string} email - Email a validar
 * @returns {boolean} True si el email es válido
 */
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida un teléfono chileno
 * @param {string} phone - Teléfono a validar
 * @returns {boolean} True si el teléfono es válido
 */
export function validatePhone(phone) {
  const phoneRegex = /^(\+56\s?)?[2-9]\d{8}$|^(\+56\s?)?9\s?\d{4}\s?\d{4}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Debounce function para optimizar búsquedas
 * @param {Function} func - Función a ejecutar
 * @param {number} wait - Tiempo de espera en ms
 * @returns {Function} Función debounced
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Genera un ID único
 * @returns {string} ID único
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Calcula el total de una factura incluyendo impuestos
 * @param {number} netAmount - Monto neto
 * @param {number} taxRate - Tasa de impuesto (por defecto 19% IVA)
 * @returns {object} Objeto con montos calculados
 */
export function calculateInvoiceTotal(netAmount, taxRate = 0.19) {
  const taxAmount = netAmount * taxRate;
  const totalAmount = netAmount + taxAmount;
  
  return {
    netAmount: Math.round(netAmount),
    taxAmount: Math.round(taxAmount),
    totalAmount: Math.round(totalAmount)
  };
}

/**
 * Filtra un array de objetos por múltiples criterios
 * @param {Array} items - Array a filtrar
 * @param {Object} filters - Objeto con filtros
 * @returns {Array} Array filtrado
 */
export function filterItems(items, filters) {
  return items.filter(item => {
    return Object.keys(filters).every(key => {
      const filterValue = filters[key];
      if (!filterValue || filterValue === '') return true;
      
      const itemValue = item[key];
      if (typeof itemValue === 'string') {
        return itemValue.toLowerCase().includes(filterValue.toLowerCase());
      }
      return itemValue === filterValue;
    });
  });
}

/**
 * Ordena un array de objetos por una propiedad
 * @param {Array} items - Array a ordenar
 * @param {string} property - Propiedad por la cual ordenar
 * @param {string} direction - 'asc' o 'desc'
 * @returns {Array} Array ordenado
 */
export function sortItems(items, property, direction = 'asc') {
  return [...items].sort((a, b) => {
    const aValue = a[property];
    const bValue = b[property];
    
    if (typeof aValue === 'string') {
      const comparison = aValue.localeCompare(bValue, 'es-CL');
      return direction === 'asc' ? comparison : -comparison;
    }
    
    if (typeof aValue === 'number') {
      return direction === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    if (aValue instanceof Date || typeof aValue === 'string') {
      const dateA = new Date(aValue);
      const dateB = new Date(bValue);
      return direction === 'asc' ? dateA - dateB : dateB - dateA;
    }
    
    return 0;
  });
}

/**
 * Actualiza un elemento del DOM con un valor
 * @param {string} selector - Selector CSS
 * @param {string|number} value - Valor a mostrar
 * @param {string} attribute - Atributo a actualizar (por defecto 'textContent')
 */
export function updateElement(selector, value, attribute = 'textContent') {
  const element = document.querySelector(selector);
  if (element) {
    if (attribute === 'textContent') {
      element.textContent = value;
    } else if (attribute === 'innerHTML') {
      element.innerHTML = value;
    } else {
      element.setAttribute(attribute, value);
    }
  }
}

/**
 * Muestra una notificación toast
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de notificación ('success', 'error', 'warning', 'info')
 * @param {number} duration - Duración en ms
 */
export function showToast(message, type = 'info', duration = 3000) {
  // Crear elemento toast
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  
  // Estilos inline para el toast
  Object.assign(toast.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '12px 24px',
    borderRadius: '8px',
    color: 'white',
    fontWeight: '500',
    zIndex: '9999',
    transform: 'translateX(100%)',
    transition: 'transform 0.3s ease-in-out',
    backgroundColor: {
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6'
    }[type] || '#3b82f6'
  });
  
  document.body.appendChild(toast);
  
  // Animar entrada
  setTimeout(() => {
    toast.style.transform = 'translateX(0)';
  }, 100);
  
  // Remover después de la duración especificada
  setTimeout(() => {
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, duration);
}

/**
 * Exporta datos a CSV
 * @param {Array} data - Datos a exportar
 * @param {string} filename - Nombre del archivo
 * @param {Array} headers - Encabezados personalizados
 */
export function exportToCSV(data, filename = 'export.csv', headers = null) {
  if (!data.length) return;
  
  const csvHeaders = headers || Object.keys(data[0]);
  const csvContent = [
    csvHeaders.join(','),
    ...data.map(row => 
      csvHeaders.map(header => {
        const value = row[header] || '';
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
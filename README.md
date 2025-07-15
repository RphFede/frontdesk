# 📚 Guía Completa: API CRUD con Python Flask + Frontend JavaScript

## 🎯 ¿Qué vamos a construir?

Vamos a crear un sistema completo de gestión de facturas que incluye:
- **Backend**: Una API REST en Python que maneja datos
- **Frontend**: Formularios web que se comunican con la API
- **Base de datos**: Almacenamiento de proveedores y facturas

---

## 📋 Tabla de Contenidos

1. [Conceptos Básicos](#conceptos-básicos)
2. [Configuración del Entorno](#configuración-del-entorno)
3. [Backend: API en Python Flask](#backend-api-en-python-flask)
4. [Frontend: JavaScript y Astro](#frontend-javascript-y-astro)
5. [Conexión Frontend-Backend](#conexión-frontend-backend)
6. [Ejemplos Prácticos](#ejemplos-prácticos)
7. [Solución de Problemas](#solución-de-problemas)

---

## 🧠 Conceptos Básicos

### ¿Qué es una API?
Una **API** (Application Programming Interface) es como un "mesero" entre tu página web y la base de datos:
- Tu página web le "pide" datos al mesero (API)
- El mesero va a la "cocina" (base de datos) 
- Trae de vuelta la información solicitada

### ¿Qué es CRUD?
**CRUD** son las 4 operaciones básicas con datos:
- **C**reate (Crear): Agregar nuevos datos
- **R**ead (Leer): Obtener datos existentes  
- **U**pdate (Actualizar): Modificar datos
- **D**elete (Eliminar): Borrar datos

### ¿Qué es REST?
**REST** es un estilo de API que usa URLs y métodos HTTP:
- `GET /api/bills` → Obtener todas las facturas
- `POST /api/bills` → Crear una nueva factura
- `PUT /api/bills/123` → Actualizar factura con ID 123
- `DELETE /api/bills/123` → Eliminar factura con ID 123

---

## ⚙️ Configuración del Entorno

### 1. Instalar Python
```bash
# Verificar si Python está instalado
python --version

# Si no está instalado, descargar desde python.org
```

### 2. Crear el proyecto
```bash
# Crear carpeta del proyecto
mkdir mi-sistema-facturas
cd mi-sistema-facturas

# Crear carpeta para el backend
mkdir backend
cd backend
```

### 3. Instalar dependencias de Python
```bash
# Crear entorno virtual (recomendado)
python -m venv venv

# Activar entorno virtual
# En Windows:
venv\Scripts\activate
# En Mac/Linux:
source venv/bin/activate

# Instalar Flask y dependencias
pip install flask flask-sqlalchemy flask-cors
```

---

## 🐍 Backend: API en Python Flask

### Estructura del archivo `app.py`

Vamos a analizar cada sección del código Python:

#### 1. **Importaciones y Configuración Inicial**
```python
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
```

**¿Qué hace cada importación?**
- `Flask`: El framework web principal
- `request`: Para recibir datos del frontend
- `jsonify`: Para enviar respuestas en formato JSON
- `SQLAlchemy`: Para manejar la base de datos
- `CORS`: Para permitir conexiones desde el frontend
- `datetime`: Para manejar fechas

#### 2. **Configuración de la Aplicación**
```python
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///facturas.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
CORS(app)
```

**Explicación línea por línea:**
- `app = Flask(__name__)`: Crea la aplicación web
- `SQLALCHEMY_DATABASE_URI`: Define dónde guardar los datos (archivo `facturas.db`)
- `SQLALCHEMY_TRACK_MODIFICATIONS = False`: Optimización de rendimiento
- `db = SQLAlchemy(app)`: Conecta la base de datos con Flask
- `CORS(app)`: Permite que el frontend se conecte desde otro puerto

#### 3. **Modelos de Datos (Tablas)**

##### Modelo Supplier (Proveedores)
```python
class Supplier(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    cuit = db.Column(db.String(20), nullable=False, unique=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
```

**¿Qué significa cada línea?**
- `class Supplier(db.Model)`: Define una tabla llamada "Supplier"
- `id = db.Column(db.Integer, primary_key=True)`: ID único para cada proveedor
- `name = db.Column(db.String(100), nullable=False)`: Nombre del proveedor (máximo 100 caracteres, obligatorio)
- `cuit = db.Column(db.String(20), nullable=False, unique=True)`: CUIT único y obligatorio
- `created_at = db.Column(db.DateTime, default=datetime.utcnow)`: Fecha de creación automática

##### Modelo Bill (Facturas)
```python
class Bill(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    supplier_id = db.Column(db.Integer, db.ForeignKey('supplier.id'), nullable=False)
    invoice_number = db.Column(db.String(50), nullable=False)
    invoice_date = db.Column(db.Date, nullable=False)
    amount = db.Column(db.Float)
    description = db.Column(db.Text)
    classification = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    supplier = db.relationship('Supplier', backref=db.backref('bills', lazy=True))
```

**Explicación detallada:**
- `supplier_id`: Conecta cada factura con un proveedor
- `db.ForeignKey('supplier.id')`: Referencia al ID del proveedor
- `invoice_number`: Número de factura (ej: "B-00001-01234")
- `invoice_date`: Fecha de emisión
- `amount`: Monto de la factura
- `description`: Descripción del servicio/producto
- `classification`: Tipo de factura (consumo, servicio, capital)
- `supplier = db.relationship(...)`: Conecta automáticamente facturas con proveedores

#### 4. **Endpoints de la API**

##### GET /api/suppliers (Obtener Proveedores)
```python
@app.route('/api/suppliers', methods=['GET'])
def get_suppliers():
    suppliers = Supplier.query.all()
    return jsonify({
        'suppliers': [{
            'id': s.id,
            'name': s.name,
            'cuit': s.cuit,
            'created_at': s.created_at.isoformat()
        } for s in suppliers]
    })
```

**¿Qué hace este código?**
1. `@app.route('/api/suppliers', methods=['GET'])`: Define la URL y método HTTP
2. `Supplier.query.all()`: Obtiene todos los proveedores de la base de datos
3. `jsonify({...})`: Convierte los datos a formato JSON para enviar al frontend
4. `[{...} for s in suppliers]`: Crea una lista con los datos de cada proveedor

##### POST /api/suppliers (Crear Proveedor)
```python
@app.route('/api/suppliers', methods=['POST'])
def create_supplier():
    data = request.get_json()
    
    if not data.get('name') or not data.get('cuit'):
        return jsonify({'message': 'Nombre y CUIT son requeridos'}), 400
    
    existing_supplier = Supplier.query.filter_by(cuit=data['cuit']).first()
    if existing_supplier:
        return jsonify({'message': 'Ya existe un proveedor con este CUIT'}), 400
    
    supplier = Supplier(name=data['name'], cuit=data['cuit'])
    db.session.add(supplier)
    db.session.commit()
    
    return jsonify({
        'id': supplier.id,
        'name': supplier.name,
        'cuit': supplier.cuit,
        'message': 'Proveedor creado exitosamente'
    }), 201
```

**Paso a paso:**
1. `data = request.get_json()`: Recibe los datos enviados desde el frontend
2. `if not data.get('name')...`: Valida que los datos obligatorios estén presentes
3. `Supplier.query.filter_by(cuit=data['cuit']).first()`: Verifica si ya existe un proveedor con ese CUIT
4. `supplier = Supplier(...)`: Crea un nuevo proveedor
5. `db.session.add(supplier)`: Lo agrega a la base de datos
6. `db.session.commit()`: Guarda los cambios permanentemente
7. `return jsonify({...}), 201`: Responde con los datos del proveedor creado

##### GET /api/bills (Obtener Facturas)
```python
@app.route('/api/bills', methods=['GET'])
def get_bills():
    bills = Bill.query.join(Supplier).all()
    return jsonify({
        'bills': [{
            'id': b.id,
            'supplier_id': b.supplier_id,
            'supplier_name': b.supplier.name,
            'invoice_number': b.invoice_number,
            'invoice_date': b.invoice_date.isoformat(),
            'amount': b.amount,
            'description': b.description,
            'classification': b.classification,
            'created_at': b.created_at.isoformat()
        } for b in bills]
    })
```

**Explicación:**
- `Bill.query.join(Supplier).all()`: Obtiene todas las facturas junto con información del proveedor
- `b.supplier.name`: Accede al nombre del proveedor relacionado
- `.isoformat()`: Convierte fechas a formato estándar para JSON

##### POST /api/bills (Crear Factura)
```python
@app.route('/api/bills', methods=['POST'])
def create_bill():
    data = request.get_json()
    
    required_fields = ['supplierId', 'invoiceNumber', 'invoiceDate', 'classification']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'message': f'El campo {field} es requerido'}), 400
    
    supplier = Supplier.query.get(data['supplierId'])
    if not supplier:
        return jsonify({'message': 'Proveedor no encontrado'}), 404
    
    invoice_date = datetime.strptime(data['invoiceDate'], '%Y-%m-%d').date()
    
    bill = Bill(
        supplier_id=data['supplierId'],
        invoice_number=data['invoiceNumber'],
        invoice_date=invoice_date,
        amount=data.get('amount'),
        description=data.get('description'),
        classification=data['classification']
    )
    
    db.session.add(bill)
    db.session.commit()
    
    return jsonify({
        'id': bill.id,
        'message': 'Factura creada exitosamente'
    }), 201
```

**Proceso detallado:**
1. Valida que todos los campos obligatorios estén presentes
2. Verifica que el proveedor exista
3. Convierte la fecha de string a objeto Date
4. Crea la nueva factura con todos los datos
5. La guarda en la base de datos
6. Responde con confirmación

##### DELETE /api/bills/<id> (Eliminar Factura)
```python
@app.route('/api/bills/<int:bill_id>', methods=['DELETE'])
def delete_bill(bill_id):
    bill = Bill.query.get(bill_id)
    
    if not bill:
        return jsonify({
            'success': False,
            'message': 'Factura no encontrada'
        }), 404
    
    db.session.delete(bill)
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Factura eliminada exitosamente',
        'deleted_id': bill_id
    }), 200
```

**¿Cómo funciona?**
1. `<int:bill_id>`: Captura el ID de la URL (ej: `/api/bills/123`)
2. `Bill.query.get(bill_id)`: Busca la factura por ID
3. Si no existe, devuelve error 404
4. Si existe, la elimina de la base de datos
5. Confirma la eliminación

#### 5. **Inicialización de la Base de Datos**
```python
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
```

**¿Qué hace?**
- `db.create_all()`: Crea las tablas en la base de datos si no existen
- `app.run(debug=True)`: Inicia el servidor en modo desarrollo

---

## 🌐 Frontend: JavaScript y Astro

### Conceptos de JavaScript para APIs

#### 1. **Fetch API - Hacer Peticiones HTTP**

##### GET - Obtener Datos
```javascript
// Obtener lista de proveedores
async function obtenerProveedores() {
    try {
        const response = await fetch('http://localhost:5000/api/suppliers');
        const data = await response.json();
        console.log(data.suppliers);
    } catch (error) {
        console.error('Error:', error);
    }
}
```

**Explicación:**
- `fetch()`: Función para hacer peticiones HTTP
- `await`: Espera a que la petición termine
- `response.json()`: Convierte la respuesta a objeto JavaScript
- `try/catch`: Maneja errores de conexión

##### POST - Enviar Datos
```javascript
// Crear nuevo proveedor
async function crearProveedor(nombre, cuit) {
    try {
        const response = await fetch('http://localhost:5000/api/suppliers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: nombre,
                cuit: cuit
            })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            alert('Proveedor creado exitosamente');
        } else {
            alert('Error: ' + result.message);
        }
    } catch (error) {
        alert('Error de conexión');
    }
}
```

**Componentes importantes:**
- `method: 'POST'`: Especifica que vamos a enviar datos
- `headers`: Indica que enviamos JSON
- `body: JSON.stringify({...})`: Convierte objeto JavaScript a JSON
- `response.ok`: Verifica si la petición fue exitosa

##### DELETE - Eliminar Datos
```javascript
// Eliminar factura
async function eliminarFactura(id) {
    if (confirm('¿Estás seguro de eliminar esta factura?')) {
        try {
            const response = await fetch(`http://localhost:5000/api/bills/${id}`, {
                method: 'DELETE'
            });
            
            const result = await response.json();
            
            if (response.ok) {
                // Actualizar la lista
                location.reload();
            } else {
                alert('Error: ' + result.message);
            }
        } catch (error) {
            alert('Error de conexión');
        }
    }
}
```

#### 2. **Manipulación del DOM**

##### Obtener Elementos
```javascript
// Diferentes formas de obtener elementos HTML
const formulario = document.getElementById('mi-formulario');
const boton = document.querySelector('.mi-boton');
const inputs = document.querySelectorAll('input[required]');
```

##### Agregar Event Listeners
```javascript
// Escuchar eventos
document.addEventListener('DOMContentLoaded', function() {
    // El DOM está listo
    inicializarFormulario();
});

const boton = document.getElementById('enviar');
boton.addEventListener('click', function() {
    enviarFormulario();
});
```

##### Crear Elementos Dinámicamente
```javascript
// Crear una fila de tabla con datos de factura
function crearFilaFactura(factura) {
    const fila = document.createElement('tr');
    fila.innerHTML = `
        <td>${factura.invoice_number}</td>
        <td>${factura.supplier_name}</td>
        <td>${factura.amount}</td>
        <td>
            <button onclick="eliminarFactura(${factura.id})">
                Eliminar
            </button>
        </td>
    `;
    return fila;
}
```

#### 3. **Validación de Formularios**

```javascript
function validarFormulario() {
    const nombre = document.getElementById('nombre').value;
    const cuit = document.getElementById('cuit').value;
    
    // Validar campos vacíos
    if (!nombre.trim()) {
        alert('El nombre es obligatorio');
        return false;
    }
    
    // Validar formato CUIT
    const cuitRegex = /^\d{2}-\d{8}-\d$/;
    if (!cuitRegex.test(cuit)) {
        alert('El CUIT debe tener formato XX-XXXXXXXX-X');
        return false;
    }
    
    return true;
}
```

### Implementación en Astro

#### Estructura de un archivo .astro
```astro
---
// Código del servidor (se ejecuta antes de enviar al navegador)
const proveedores = await fetch('http://localhost:5000/api/suppliers')
    .then(res => res.json());
---

<!-- HTML con datos del servidor -->
<div>
    <h1>Lista de Proveedores</h1>
    {proveedores.suppliers.map(proveedor => (
        <div key={proveedor.id}>
            {proveedor.name} - {proveedor.cuit}
        </div>
    ))}
</div>

<script>
    // JavaScript del cliente (se ejecuta en el navegador)
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Página cargada');
    });
</script>
```

---

## 🔗 Conexión Frontend-Backend

### 1. **Configurar CORS en el Backend**
```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Permite conexiones desde cualquier origen

# O más específico:
CORS(app, origins=['http://localhost:3000', 'http://localhost:4321'])
```

### 2. **URLs de la API**
```javascript
// Configuración centralizada de URLs
const API_BASE_URL = 'http://localhost:5000/api';

const API_ENDPOINTS = {
    suppliers: `${API_BASE_URL}/suppliers`,
    bills: `${API_BASE_URL}/bills`,
    deleteBill: (id) => `${API_BASE_URL}/bills/${id}`
};
```

### 3. **Manejo de Errores**
```javascript
async function manejarRespuestaAPI(response) {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error en la API');
    }
    return await response.json();
}

// Uso:
try {
    const response = await fetch(API_ENDPOINTS.suppliers);
    const data = await manejarRespuestaAPI(response);
    console.log(data);
} catch (error) {
    console.error('Error:', error.message);
    alert('Error: ' + error.message);
}
```

---

## 💡 Ejemplos Prácticos

### Ejemplo 1: Formulario de Proveedor Completo

#### HTML (en archivo .astro)
```html
<form id="proveedor-form">
    <div>
        <label for="nombre">Nombre del Proveedor:</label>
        <input type="text" id="nombre" required>
    </div>
    <div>
        <label for="cuit">CUIT:</label>
        <input type="text" id="cuit" placeholder="30-12345678-9" required>
    </div>
    <button type="submit">Guardar Proveedor</button>
</form>

<div id="lista-proveedores">
    <!-- Los proveedores se cargarán aquí -->
</div>
```

#### JavaScript Completo
```javascript
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('proveedor-form');
    const listaProveedores = document.getElementById('lista-proveedores');
    
    // Cargar proveedores al inicio
    cargarProveedores();
    
    // Manejar envío del formulario
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const nombre = document.getElementById('nombre').value;
        const cuit = document.getElementById('cuit').value;
        
        if (validarFormulario(nombre, cuit)) {
            await crearProveedor(nombre, cuit);
            form.reset();
            cargarProveedores();
        }
    });
    
    async function cargarProveedores() {
        try {
            const response = await fetch('http://localhost:5000/api/suppliers');
            const data = await response.json();
            
            listaProveedores.innerHTML = '';
            data.suppliers.forEach(proveedor => {
                const div = document.createElement('div');
                div.innerHTML = `
                    <p><strong>${proveedor.name}</strong> - ${proveedor.cuit}</p>
                `;
                listaProveedores.appendChild(div);
            });
        } catch (error) {
            console.error('Error al cargar proveedores:', error);
        }
    }
    
    async function crearProveedor(nombre, cuit) {
        try {
            const response = await fetch('http://localhost:5000/api/suppliers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: nombre,
                    cuit: cuit
                })
            });
            
            const result = await response.json();
            
            if (response.ok) {
                alert('Proveedor creado exitosamente');
            } else {
                alert('Error: ' + result.message);
            }
        } catch (error) {
            alert('Error de conexión');
        }
    }
    
    function validarFormulario(nombre, cuit) {
        if (!nombre.trim()) {
            alert('El nombre es obligatorio');
            return false;
        }
        
        const cuitRegex = /^\d{2}-\d{8}-\d$/;
        if (!cuitRegex.test(cuit)) {
            alert('El CUIT debe tener formato XX-XXXXXXXX-X');
            return false;
        }
        
        return true;
    }
});
```

### Ejemplo 2: Lista de Facturas con Eliminación

```javascript
async function cargarFacturas() {
    try {
        const response = await fetch('http://localhost:5000/api/bills');
        const data = await response.json();
        
        const tbody = document.getElementById('facturas-tbody');
        tbody.innerHTML = '';
        
        data.bills.forEach(factura => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${factura.invoice_number}</td>
                <td>${factura.supplier_name}</td>
                <td>$${factura.amount || 0}</td>
                <td>${new Date(factura.invoice_date).toLocaleDateString()}</td>
                <td>
                    <button onclick="eliminarFactura(${factura.id})" 
                            class="btn-eliminar">
                        Eliminar
                    </button>
                </td>
            `;
            tbody.appendChild(fila);
        });
    } catch (error) {
        console.error('Error al cargar facturas:', error);
    }
}

async function eliminarFactura(id) {
    if (confirm('¿Estás seguro de eliminar esta factura?')) {
        try {
            const response = await fetch(`http://localhost:5000/api/bills/${id}`, {
                method: 'DELETE'
            });
            
            const result = await response.json();
            
            if (response.ok) {
                alert('Factura eliminada exitosamente');
                cargarFacturas(); // Recargar la lista
            } else {
                alert('Error: ' + result.message);
            }
        } catch (error) {
            alert('Error de conexión');
        }
    }
}
```

---

## 🚀 Pasos para Ejecutar el Proyecto

### 1. Preparar el Backend
```bash
# En la carpeta backend
python app.py
```

Deberías ver:
```
* Running on http://127.0.0.1:5000
* Debug mode: on
```

### 2. Preparar el Frontend
```bash
# En la carpeta del proyecto Astro
npm run dev
```

### 3. Probar la Conexión
1. Abre el navegador en `http://localhost:4321`
2. Abre las herramientas de desarrollador (F12)
3. Ve a la pestaña "Network" o "Red"
4. Interactúa con los formularios
5. Deberías ver las peticiones HTTP a `localhost:5000`

---

## 🔧 Solución de Problemas Comunes

### Error: "CORS policy"
**Problema:** El navegador bloquea las peticiones
**Solución:** Agregar CORS al backend
```python
from flask_cors import CORS
CORS(app)
```

### Error: "Connection refused"
**Problema:** El backend no está ejecutándose
**Solución:** Verificar que `python app.py` esté corriendo

### Error: "404 Not Found"
**Problema:** URL incorrecta
**Solución:** Verificar que las URLs coincidan:
- Backend: `@app.route('/api/suppliers')`
- Frontend: `fetch('http://localhost:5000/api/suppliers')`

### Error: "500 Internal Server Error"
**Problema:** Error en el código Python
**Solución:** Revisar la consola del backend para ver el error específico

### Datos no se guardan
**Problema:** Falta `db.session.commit()`
**Solución:** Siempre agregar después de modificar datos:
```python
db.session.add(nuevo_objeto)
db.session.commit()
```

---

## 📝 Checklist de Implementación

### Backend ✅
- [ ] Flask instalado
- [ ] Modelos de datos creados
- [ ] Endpoints GET implementados
- [ ] Endpoints POST implementados  
- [ ] Endpoints DELETE implementados
- [ ] CORS configurado
- [ ] Base de datos inicializada

### Frontend ✅
- [ ] Formularios HTML creados
- [ ] Event listeners agregados
- [ ] Funciones fetch implementadas
- [ ] Validación de formularios
- [ ] Manejo de errores
- [ ] Actualización dinámica de listas

### Conexión ✅
- [ ] URLs de API correctas
- [ ] Headers de Content-Type
- [ ] Manejo de respuestas JSON
- [ ] Feedback visual para el usuario

---

## 🎓 Próximos Pasos

Una vez que domines estos conceptos, puedes expandir con:

1. **Autenticación de usuarios**
2. **Paginación de resultados**
3. **Filtros y búsqueda**
4. **Validación más robusta**
5. **Manejo de archivos**
6. **Notificaciones en tiempo real**

---

## 📚 Recursos Adicionales

- [Documentación de Flask](https://flask.palletsprojects.com/)
- [MDN Web Docs - Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [Documentación de Astro](https://docs.astro.build/)
- [Tutorial de SQLAlchemy](https://docs.sqlalchemy.org/en/14/tutorial/)

---

¡Felicidades! 🎉 Ahora tienes una guía completa para crear APIs CRUD con Python Flask y conectarlas con frontend JavaScript. ¡A programar!
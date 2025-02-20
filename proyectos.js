// Variables globales para almacenar datos
let empleados = [];
let proyectos = [];

// Función para cargar datos iniciales
async function cargarDatos() {
    try {
        const response = await fetch('get.php');
        const datos = await response.json();
        
        // Procesamos los datos para separar empleados y proyectos
        empleados = datos.filter((item, index, self) =>
            index === self.findIndex((t) => t.id_empleado === item.id_empleado)
        );

        proyectos = datos.filter(item => item.id_proyecto).map(item => ({
            id: item.id_proyecto,
            nombre: item.nombre_proyecto,
            responsable: item.responsable_proyecto,
            proyectoPadre: item.proyecto_padre
        }));

        actualizarTablaProyectos();
    } catch (error) {
        console.error('Error al cargar datos:', error);
    }
}

// Función para actualizar la tabla de proyectos
function actualizarTablaProyectos() {
    const tabla = document.getElementById('tablaProyectos');
    // Mantener el encabezado
    tabla.innerHTML = `
        <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Responsable</th>
            <th>Proyecto Principal</th>
            <th>Acciones</th>
        </tr>
    `;

    proyectos.forEach(proyecto => {
        const empleadoResponsable = empleados.find(emp => emp.id_empleado === proyecto.responsable);
        const proyectoPadre = proyectos.find(p => p.id === proyecto.proyectoPadre);
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${proyecto.id}</td>
            <td>${proyecto.nombre}</td>
            <td>${empleadoResponsable ? empleadoResponsable.nombre_empleado : 'No asignado'}</td>
            <td>${proyectoPadre ? proyectoPadre.nombre : 'Ninguno'}</td>
            <td>
                <button onclick="editarProyecto(${proyecto.id})">Editar</button>
                <button onclick="eliminarProyecto(${proyecto.id})">Eliminar</button>
            </td>
        `;
        tabla.appendChild(tr);
    });
}

// Función para mostrar el formulario
function mostrarFormulario() {
    const formularioContainer = document.getElementById('formularioContainer');
    formularioContainer.style.display = 'flex';
    
    const formulario = document.createElement('div');
    formulario.className = 'formulario';
    
    formulario.innerHTML = `
        <button class="cerrar-formulario" onclick="cerrarFormulario()">X</button>
        <h2>Nuevo Proyecto</h2>
        
        <div class="form-group">
            <label for="nombre">Nombre del Proyecto:</label>
            <input type="text" id="nombre" required>
        </div>

        <div class="form-group">
            <label for="responsable">Responsable:</label>
            <select id="responsable" required>
                <option value="">Seleccione un responsable</option>
                ${empleados.map(emp => `
                    <option value="${emp.id_empleado}">${emp.nombre_empleado}</option>
                `).join('')}
            </select>
        </div>

        <div class="form-group">
            <label for="proyectoPadre">Proyecto Principal:</label>
            <select id="proyectoPadre">
                <option value="">Ninguno</option>
                ${proyectos.map(proj => `
                    <option value="${proj.id}">${proj.nombre}</option>
                `).join('')}
            </select>
        </div>

        <button id="enviar_proyecto" onclick="guardarProyecto()">Guardar Proyecto</button>
    `;
    
    formularioContainer.innerHTML = '';
    formularioContainer.appendChild(formulario);
}

// Función para cerrar el formulario
function cerrarFormulario() {
    document.getElementById('formularioContainer').style.display = 'none';
}

// Función para guardar un nuevo proyecto
async function guardarProyecto() {
    const nombre = document.getElementById('nombre').value;
    const responsable = document.getElementById('responsable').value;
    const proyectoPadre = document.getElementById('proyectoPadre').value;

    if (!nombre || !responsable) {
        alert('Por favor, complete los campos requeridos');
        return;
    }

    const datos = {
        nombre: nombre,
        responsable: responsable,
        proyectoPadre: proyectoPadre || null
    };

    try {
        const response = await fetch('post.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });

        const resultado = await response.json();

        if (resultado.success) {
            await cargarDatos();
            cerrarFormulario();
        } else {
            alert(resultado.message);
        }
    } catch (error) {
        console.error('Error al guardar proyecto:', error);
        alert('Error al guardar el proyecto');
    }
}

// Función para eliminar un proyecto
async function eliminarProyecto(id) {
    if (!confirm('¿Está seguro de que desea eliminar este proyecto?')) {
        return;
    }

    try {
        const response = await fetch('delete.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id })
        });

        const resultado = await response.json();

        if (resultado.success) {
            await cargarDatos();
        } else {
            alert(resultado.message);
        }
    } catch (error) {
        console.error('Error al eliminar proyecto:', error);
        alert('Error al eliminar el proyecto');
    }
}

// Función para editar un proyecto
async function editarProyecto(id) {
    const proyecto = proyectos.find(p => p.id === id);
    if (!proyecto) return;

    const formularioContainer = document.getElementById('formularioContainer');
    formularioContainer.style.display = 'flex';
    
    const formulario = document.createElement('div');
    formulario.className = 'formulario';
    
    formulario.innerHTML = `
        <button class="cerrar-formulario" onclick="cerrarFormulario()">X</button>
        <h2>Editar Proyecto</h2>
        
        <div class="form-group">
            <label for="nombre">Nombre del Proyecto:</label>
            <input type="text" id="nombre" value="${proyecto.nombre}" required>
        </div>

        <div class="form-group">
            <label for="responsable">Responsable:</label>
            <select id="responsable" required>
                <option value="">Seleccione un responsable</option>
                ${empleados.map(emp => `
                    <option value="${emp.id_empleado}" 
                    ${emp.id_empleado === proyecto.responsable ? 'selected' : ''}>
                        ${emp.nombre_empleado}
                    </option>
                `).join('')}
            </select>
        </div>

        <div class="form-group">
            <label for="proyectoPadre">Proyecto Principal:</label>
            <select id="proyectoPadre">
                <option value="">Ninguno</option>
                ${proyectos
                    .filter(p => p.id !== proyecto.id) // Evitar que un proyecto se seleccione a sí mismo
                    .map(p => `
                        <option value="${p.id}" 
                        ${p.id === proyecto.proyectoPadre ? 'selected' : ''}>
                            ${p.nombre}
                        </option>
                    `).join('')}
            </select>
        </div>

        <button id="enviar_proyecto" onclick="actualizarProyecto(${id})">Actualizar Proyecto</button>
    `;
    
    formularioContainer.innerHTML = '';
    formularioContainer.appendChild(formulario);
}

// Función para actualizar un proyecto
async function actualizarProyecto(id) {
    const nombre = document.getElementById('nombre').value;
    const responsable = document.getElementById('responsable').value;
    const proyectoPadre = document.getElementById('proyectoPadre').value;

    if (!nombre || !responsable) {
        alert('Por favor, complete los campos requeridos');
        return;
    }

    try {
        const response = await fetch('update.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: id,
                nombre: nombre,
                responsable: responsable,
                proyectoPadre: proyectoPadre || null
            })
        });

        const resultado = await response.json();

        if (resultado.success) {
            await cargarDatos();
            cerrarFormulario();
        } else {
            alert(resultado.message);
        }
    } catch (error) {
        console.error('Error al actualizar proyecto:', error);
        alert('Error al actualizar el proyecto');
    }
}

// Función para buscar proyectos
function buscarProyectos() {
    const termino = document.getElementById('buscar_empleado').value.toLowerCase();
    const listaProyectos = document.getElementById('lista_proyectos');
    
    // Buscar proyectos que coincidan con el término de búsqueda
    // o que tengan un empleado responsable que coincida
    const proyectosFiltrados = proyectos.filter(proyecto => {
        const empleadoResponsable = empleados.find(emp => emp.id_empleado === proyecto.responsable);
        return proyecto.nombre.toLowerCase().includes(termino) || 
               (empleadoResponsable && empleadoResponsable.nombre_empleado.toLowerCase().includes(termino));
    });

    listaProyectos.innerHTML = '';
    
    if (proyectosFiltrados.length === 0) {
        listaProyectos.innerHTML = '<li>No se encontraron proyectos</li>';
        return;
    }

    proyectosFiltrados.forEach(proyecto => {
        const empleadoResponsable = empleados.find(emp => emp.id_empleado === proyecto.responsable);
        const li = document.createElement('li');
        li.textContent = `Proyecto: ${proyecto.nombre} - Responsable: ${empleadoResponsable ? empleadoResponsable.nombre_empleado : 'No asignado'}`;
        listaProyectos.appendChild(li);
    });
}

// Función para restablecer datos
function restablecerDatos() {
    // Limpiar campo de búsqueda
    document.getElementById('buscar_empleado').value = '';
    
    // Limpiar lista de proyectos
    document.getElementById('lista_proyectos').innerHTML = '';
    
    // Recargar datos
    cargarDatos();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    cargarDatos();
    
    document.getElementById('boton_proyecto').addEventListener('click', mostrarFormulario);
    document.getElementById('boton_buscar').addEventListener('click', buscarProyectos);
    document.getElementById('boton_restablecer').addEventListener('click', restablecerDatos);
    
    // Añadir búsqueda al presionar Enter
    document.getElementById('buscar_empleado').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            buscarProyectos();
        }
    });
});
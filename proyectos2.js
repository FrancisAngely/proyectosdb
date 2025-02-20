const boton_añadir=document.getElementById('boton_proyecto');
const div_formulario=document.getElementById('formularioContainer');

let proyectos=[];
let empleados=[];


document.addEventListener('DOMContentLoaded',()=>{
fetch('get.php').
then(response=>response.json())
.then(datos=>{console.log(datos)

datos.forEach(element => {
if(!proyectos.some(proyecto=>element.id_proyecto===proyecto) && element.id_proyecto){
proyectos.push({
id:element.id_proyecto,
nombre:element.nombre_proyecto,
resp:element.responsable_proyecto,
proyecto_padre:element.proyecto_padre
})
}
if(!empleados.some(empleado=>element.id_empleado===empleado.id_empleado)){
empleados.push({
id_empleado:element.id_empleado,
nombre_empleado:element.nombre_empleado
});
}
})

console.log("Empleados",empleados);
console.log("Proyectos",proyectos);
});
});

function crearFormulario(){
const form=document.createElement('form');
form.id="formulario_proyectos";
form.classList.add('formulario');

const boton_cerrar=document.createElement('button');
boton_cerrar.id="boton_cerrar";
boton_cerrar.textContent="X";
boton_cerrar.classList.add('cerrar-formulario');

const label_id=document.createElement('label');
label_id.setAttribute("for","id_proyecto");
label_id.textContent="ID del Proyecto";

const id_proyecto=document.createElement('input');
id_proyecto.id='id_proyecto';
id_proyecto.classList.add('input');

const label_nombre=document.createElement('label');
label_nombre.setAttribute("for","nombre_proyecto");
label_nombre.textContent="Nombre del Proyecto";

const nombre_proyecto=document.createElement('input');
nombre_proyecto.id='nombre_proyecto';
nombre_proyecto.classList.add('input');

const label_responsable=document.createElement('label');
label_responsable.setAttribute("for","id_responsable");
label_responsable.textContent="Responsable del Proyecto";

const id_responsable=document.createElement('select');
id_responsable.id='id_responsable';
id_responsable.classList.add('select');

const label_proyecto_padre=document.createElement('label');
label_proyecto_padre.setAttribute("for","id_proyecto_padre");
label_proyecto_padre.textContent="Proyecto principal (Si lo tiene)";

const id_proyecto_padre=document.createElement('select');
id_proyecto_padre.id='id_proyecto_padre';
id_proyecto_padre.classList.add('select');

const boton_enviar=document.createElement('button');
boton_enviar.id="boton_enviar";
boton_enviar.textContent="Enviar";
boton_enviar.classList.add('boton-enviar');

boton_enviar.addEventListener('click',function(e){
enviarFormulario(e);

})


form.appendChild(label_id);
form.appendChild(id_proyecto);
form.appendChild(label_nombre);
form.appendChild(nombre_proyecto);
form.appendChild(label_responsable);
form.appendChild(id_responsable);
form.appendChild(label_proyecto_padre);
form.appendChild(id_proyecto_padre);
form.appendChild(boton_enviar);
form.appendChild(boton_cerrar);

div_formulario.appendChild(form);
div_formulario.style.display="flex";

}
function actualizarValores(){

const id_resp=document.getElementById('id_responsable');
const id_proyecto_padre=document.getElementById('id_proyecto_padre');
const id_proyecto=document.getElementById('id_proyecto');

let ultimo_id=proyectos.reduce((max,proyecto)=>(proyecto.id>max ? proyecto.id:max),0);
id_proyecto.value=ultimo_id+1;
id_proyecto.disabled=true;

console.log(ultimo_id+1);

empleados.forEach(empleado=>{
const option=document.createElement('option');
option.value=empleado.id_empleado;
option.textContent=empleado.nombre_empleado;
id_resp.appendChild(option);
})

const option_vacio=document.createElement('option');
option_vacio.textContent="Ninguno";
option_vacio.value="";
id_proyecto_padre.appendChild(option_vacio);

proyectos.forEach(proyecto=>{
const option2=document.createElement('option');
option2.textContent=proyecto.nombre;
option2.value=proyecto.id;
id_proyecto_padre.appendChild(option2);
})
}

function enviarFormulario(e){
e.preventDefault();

const input_id_proyecto=document.getElementById('id_proyecto').value;
const input_nombre_proyecto=document.getElementById('nombre_proyecto').value;
const select_responsable=document.getElementById('id_responsable').value;
const select_proyecto_padre=document.getElementById('id_proyecto_padre').value;

if(!input_nombre_proyecto || !select_responsable ){
alert("Faltan campos por llenar")
return;
}
let proyecto={

nombre:input_nombre_proyecto,
id_empleado:select_responsable,
proyecto_padre:select_proyecto_padre
}
console.log("Datos que enviare",proyecto);

fetch('post.php',{
method:'POST',
headers:{
    'Content-Type':'application/json'
    },
    body:JSON.stringify(proyecto)
    }).then(response=>response.json())
    .then(resultado=>{
    console.log("Datos que regresa el servidor",resultado);
    if(resultado.success){
    alert("Proyecto agregado correctamente");
    div_formulario.innerHTML="";
    div_formulario.style.display="none";
    }else{
    alert("No se pudo agregar el proyecto");
    }
    })
    }
    
    boton_añadir.addEventListener('click',function (){
    crearFormulario();
    actualizarValores();
    });
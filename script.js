// ==== CAMBIO DE VISTAS ====
function mostrarVista(id){
  document.querySelectorAll('main section').forEach(sec=>{
    sec.classList.add('hidden');
  });
  document.getElementById(id).classList.remove('hidden');
  if(id==='reservas') actualizarDisponibilidad();
}
function mostrar(seccion) {
  console.log("Cambiando a sección:", seccion);
  document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
  const sec = document.getElementById(seccion);
  if (sec) sec.classList.add('active');
  else console.error("No existe la sección:", seccion);
}


// ==== LOGIN / REGISTRO ====
function openLogin() {
  const email = prompt("Correo:");
  const pass = prompt("Contraseña:");
  alert(`Inicio de sesión simulado para: ${email}`);
}

function openRegister() {
  const name = prompt("Nombre completo:");
  const email = prompt("Correo:");
  const pass = prompt("Contraseña:");
  alert(`Registro simulado para: ${name}`);
}

// ==== PRODUCTOS ====
const productos = [
  {nombre:'Latte de Beats', precio:70, imagen:'descarga (37).jpg'},
  {nombre:'Soda Beat & Bean', precio:60, imagen:'images(11).jpg'},
  {nombre:'Frappes', precio:60, imagen:'descarga (35).jpg'},
  {nombre:'Sodas Italianas', precio:75, imagen:'descarga (34).jpg'},
  {nombre:'Jugo de temporada', precio:30, imagen:'descarga (33).jpg'},
  {nombre:'Jugo de limón', precio:30, imagen:'descarga (32).jpg'},
  {nombre:'Jugo de naranja', precio:30, imagen:'images (10).jpg'},
  {nombre:'Chocolate caliente', precio:40, imagen:'descarga (31).jpg'},
  {nombre:'Café de olla', precio:20, imagen:'descarga (16).jpg'},
  {nombre:'Café con leche', precio:25, imagen:'descarga (15).jpg'},
  {nombre:'Americano', precio:40, imagen:'descarga (14).jpg'},
  {nombre:'Cappuccino', precio:35, imagen:'descarga (13).jpg'},
  {nombre:'Espresso', precio:35, imagen:'images (9).jpg'},
  {nombre:'Hamburguesa', precio:75, imagen:'descarga (25).jpg'},
  {nombre:'Beat sandwich', precio:65, imagen:'descarga (28).jpg'},
  {nombre:'HotCake', precio:40, imagen:'descarga (27).jpg'},
  {nombre:'CupCake', precio:30, imagen:'descarga (26).jpg'},
  {nombre:'Papas fritas', precio:35, imagen:'descarga (29).jpg'},
  {nombre:'Alitas', precio:55, imagen:'descarga (30).jpg'}
  
];




let carrito = [];

document.addEventListener('DOMContentLoaded',()=>{
  const contenedor = document.getElementById('lista-productos');
 productos.forEach(p=>{
  const card = document.createElement('div');
  card.className = 'card product';
  card.innerHTML = `
    <img src="${p.imagen}" alt="${p.nombre}" class="img-producto">
    <h3>${p.nombre}</h3>
    <p>$${p.precio}</p>
    <button class="btn" onclick="agregarCarrito('${p.nombre}', ${p.precio})">Agregar</button>
  `;
  contenedor.appendChild(card);
});


  // Configurar calendario
  flatpickr("#fechaReserva", { 
    enableTime: true, 
    minDate: "today", 
    dateFormat: "Y-m-d H:i",
    onChange: actualizarDisponibilidad
  });
});

// ==== CARRITO ====
function agregarCarrito(nombre, precio){
  carrito.push({nombre, precio});
  actualizarCarrito();
  mostrarToast("Producto agregado con éxito ✔️");
}


function actualizarCarrito(){
  const cont = document.getElementById('cart-items');
  const total = document.getElementById('cart-total');
  cont.innerHTML='';
  let suma=0;

  carrito.forEach((p, i)=>{
    suma+=p.precio;
    cont.innerHTML+=`
      <div class="cart-item" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
        <span>${p.nombre} — $${p.precio}</span>
        <button class="btn" style="padding:4px 8px;font-size:12px;" onclick="eliminarProducto(${i})">🗑️</button>
      </div>`;
  });

  total.textContent=suma;
}

function eliminarProducto(indice){
  const eliminado = carrito[indice].nombre;
  carrito.splice(indice,1);
  actualizarCarrito();
  mostrarToast(`"${eliminado}" eliminado del carrito ❌`);
}

function vaciarCarrito(){
  if(carrito.length === 0){
    mostrarToast("El carrito ya está vacío");
    return;
  }
  if(confirm("¿Deseas vaciar todo el carrito?")){
    carrito = [];
    actualizarCarrito();
    mostrarToast("Carrito vaciado 🧹");
  }
}

function checkout(){
  if(carrito.length===0){ 
    alert('Tu carrito está vacío'); 
    return; 
  }
  const tarjeta = prompt("Ingresa número de tarjeta (simulado):");
  if(!tarjeta) return alert('Pago cancelado');
  alert(`Pago exitoso ✔️ Total: $${document.getElementById('cart-total').textContent}`);
  carrito=[];
  actualizarCarrito();
}

function mostrarToast(mensaje){
  const toast = document.getElementById('toast');
  toast.textContent = mensaje;
  toast.classList.add('show');
  setTimeout(()=> toast.classList.remove('show'), 2500);
}

function toggleCart(){
  const cart = document.getElementById('cart');
  cart.style.display = cart.style.display === 'block' ? 'none' : 'block';
}

function actualizarCarrito(){
  const cont = document.getElementById('cart-items');
  const total = document.getElementById('cart-total');
  cont.innerHTML='';
  let suma=0;
  carrito.forEach(p=>{
    suma+=p.precio;
    cont.innerHTML+=`<div class="cart-item">${p.nombre} <span>$${p.precio}</span></div>`;
  });
  total.textContent=suma;
}

function checkout(){
  if(carrito.length===0){ alert('Tu carrito está vacío'); return; }
  const tarjeta = prompt("Ingresa número de tarjeta (simulado):");
  if(!tarjeta) return alert('Pago cancelado');
  alert(`Pago exitoso ✔️ Total: $${document.getElementById('cart-total').textContent}`);
  carrito=[];
  actualizarCarrito();
}

// ==== RESERVAS ====

// Estructura: reservas[fecha][tipo][número] = nombre
let reservas = {};

function mostrarOpciones(){
  const tipo = document.getElementById('tipoReserva').value;
  const area = document.getElementById('opcionesExtra');
  if(!tipo){ area.innerHTML=''; return; }

  let opcionesHTML = `<label>Selecciona ${tipo === 'mesa' ? 'mesa' : 'computadora'}:</label>
  <select id="numSeleccion">`;
  for(let i=1; i<=5; i++){
    opcionesHTML += `<option value="${i}">${tipo} ${i}</option>`;
  }
  opcionesHTML += `</select>`;
  area.innerHTML = opcionesHTML;
}

function actualizarDisponibilidad(){
  const div = document.getElementById('disponibilidad');
  const fecha = document.getElementById('fechaReserva').value.split(" ")[0] || obtenerFechaActual();
  
  if(!reservas[fecha]) reservas[fecha] = {mesas:{}, computadoras:{}};
  
  let html = `<p><strong>Disponibilidad para el ${fecha}</strong></p>`;
  html += "<h4>Mesas:</h4>";
  for(let i=1; i<=5; i++){
    const ocupado = reservas[fecha].mesas[i];
    html += `<p>Mesa ${i}: ${ocupado?'Ocupada por '+ocupado+' ❌':'Disponible ✅'}</p>`;
  }
  html += "<h4>Computadoras:</h4>";
  for(let i=1; i<=5; i++){
    const ocupado = reservas[fecha].computadoras[i];
    html += `<p>Computadora ${i}: ${ocupado?'Ocupada por '+ocupado+' ❌':'Disponible ✅'}</p>`;
  }
  div.innerHTML = html;

  // También actualiza el menú desplegable de selección si ya hay tipo elegido
  const tipo = document.getElementById('tipoReserva').value;
  if(tipo) mostrarOpcionesConDisponibilidad(tipo, fecha);
}

function mostrarOpcionesConDisponibilidad(tipo, fecha){
  const area = document.getElementById('opcionesExtra');
  let opcionesHTML = `<label>Selecciona ${tipo === 'mesa' ? 'mesa' : 'computadora'}:</label>
  <select id="numSeleccion">`;
  for(let i=1; i<=5; i++){
    const ocupado = reservas[fecha][tipo+'s'][i];
    opcionesHTML += `<option value="${i}" ${ocupado?'disabled':''}>${tipo} ${i} ${ocupado?'(Ocupada)':''}</option>`;
  }
  opcionesHTML += `</select>`;
  area.innerHTML = opcionesHTML;
}

function obtenerFechaActual(){
  const hoy = new Date();
  return hoy.toISOString().split('T')[0];
}

function guardarReserva(){
  const nombre = document.getElementById('nombreReserva').value.trim();
  const tipo = document.getElementById('tipoReserva').value;
  const num = parseInt(document.getElementById('numSeleccion')?.value || 0);
  const fechaCompleta = document.getElementById('fechaReserva').value;
  const fecha = fechaCompleta.split(" ")[0];

  if(!nombre || !tipo || !num || !fechaCompleta) return alert('Por favor llena todos los campos.');

  if(!reservas[fecha]) reservas[fecha] = {mesas:{}, computadoras:{}};
  if(reservas[fecha][tipo+'s'][num]){
    alert(`Esa ${tipo} ya está ocupada ese día.`);
    return;
  }

  reservas[fecha][tipo+'s'][num] = nombre;
  actualizarDisponibilidad();
  alert(`Reserva confirmada para ${nombre}: ${tipo} ${num} el ${fechaCompleta}`);
  document.getElementById('nombreReserva').value='';
  document.getElementById('tipoReserva').value='';
  document.getElementById('opcionesExtra').innerHTML='';
  document.getElementById('fechaReserva').value='';
}

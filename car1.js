// 🛒 car1.js | Módulo de carrito MLR Hardware
// Desarrollado por Elias + Copilot ✨ | v1.0

const COSTE_ENVIO = 1500;

// 🧠 Gestión de almacenamiento
function obtenerCarrito() {
  return JSON.parse(localStorage.getItem("carrito")) || [];
}

function guardarCarrito(data) {
  localStorage.setItem("carrito", JSON.stringify(data));
}

// ➕ Agregar producto
function agregarAlCarrito(nombre, codigo, precio) {
  const carrito = obtenerCarrito();
  carrito.push({ nombre, codigo, precio });
  guardarCarrito(carrito);
  renderizarCarrito();
}

// ❌ Eliminar producto
function eliminarDelCarrito(indice) {
  const carrito = obtenerCarrito();
  carrito.splice(indice, 1);
  guardarCarrito(carrito);
  renderizarCarrito();
}

// 🧹 Vaciar carrito
function vaciarCarrito() {
  localStorage.removeItem("carrito");
  renderizarCarrito();
}

// 🎨 Renderizar contenido
function renderizarCarrito() {
  const contenedor = document.getElementById("carrito-lista");
  const cantidad = document.getElementById("carrito-cantidad");
  const totalElem = document.getElementById("carrito-total");
  const envioElem = document.getElementById("carrito-envio");

  const carrito = obtenerCarrito();
  if (cantidad) cantidad.textContent = carrito.length;

  if (!contenedor || !totalElem || !envioElem) return;

  if (carrito.length === 0) {
    contenedor.innerHTML = "<p>Tu carrito está vacío.</p>";
    totalElem.textContent = "0";
    envioElem.textContent = COSTE_ENVIO.toLocaleString();
    return;
  }

  const total = carrito.reduce((acc, item) => acc + Number(item.precio), 0);
  totalElem.textContent = total.toLocaleString();
  envioElem.textContent = COSTE_ENVIO.toLocaleString();

  contenedor.innerHTML = "<ul>" + carrito.map((p, i) =>
    `<li>${p.nombre} - $${Number(p.precio).toLocaleString()}
      <button onclick="eliminarDelCarrito(${i})">❌</button>
    </li>`
  ).join("") + "</ul>";
}

// 📤 Enviar carrito por WhatsApp
function enviarCarritoPorWhatsApp() {
  const carrito = obtenerCarrito();
  if (carrito.length === 0) {
    alert("No hay productos en el carrito.");
    return;
  }

  const numero = "5493472643359";
  const total = carrito.reduce((acc, item) => acc + Number(item.precio), 0);
  const mensaje = [
    "Hola! Quiero comprar los siguientes productos por transferencia:\n",
    ...carrito.map(p => `🔹 ${p.nombre} (Código: ${p.codigo}) - $${Number(p.precio).toLocaleString()}`),
    `\nTOTAL: $${total.toLocaleString()}`,
    `Coste de envío: $${COSTE_ENVIO.toLocaleString()}`,
    "\n¿Están disponibles?"
  ].join("\n");

  window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`, "_blank");
}

// 🧭 Mostrar / Ocultar panel
function toggleCarritoBarra() {
  const panel = document.getElementById("carrito-contenido");
  if (!panel) return;

  panel.classList.toggle("active");
  panel.style.display = panel.classList.contains("active") ? "block" : "none";
}

// 🧼 Inicialización
document.addEventListener("DOMContentLoaded", () => {
  renderizarCarrito();
});

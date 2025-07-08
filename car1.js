const COSTE_ENVIO = 1500;

function obtenerCarrito() {
  return JSON.parse(localStorage.getItem("carrito")) || [];
}

function guardarCarrito(data) {
  localStorage.setItem("carrito", JSON.stringify(data));
}

function agregarAlCarrito(nombre, codigo, precio) {
  const carrito = obtenerCarrito();
  carrito.push({ nombre, codigo, precio });
  guardarCarrito(carrito);
  renderizarCarrito();
}

function eliminarDelCarrito(indice) {
  const carrito = obtenerCarrito();
  carrito.splice(indice, 1);
  guardarCarrito(carrito);
  renderizarCarrito();
}

function vaciarCarrito() {
  localStorage.removeItem("carrito");
  renderizarCarrito();
}

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

function enviarCarritoPorWhatsApp() {
  const carrito = obtenerCarrito();

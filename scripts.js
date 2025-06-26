function toggleMenu() {
  document.getElementById("main-menu").classList.toggle("active");
}

function showSection(id) {
  document.querySelectorAll(".section").forEach(sec => {
    sec.classList.remove("active");
  });
  document.getElementById(id).classList.add("active");
}

// Datos de productos de ejemplo
const productos = [
  { nombre: "RX 580 8GB", codigo: "RX580-8G", precio: "$68.000", imagen: "img/productos/rx580.jpg" },
  { nombre: "SSD Kingston 480GB", codigo: "SSD-K480", precio: "$21.000", imagen: "img/productos/ssd480.jpg" }
];

// Cargar productos dinámicamente
function cargarProductos() {
  const contenedor = document.getElementById("contenedor-productos");
  contenedor.innerHTML = "";
  productos.forEach(p => {
    contenedor.innerHTML += `
      <div class="product">
        <img src="${p.imagen}" alt="${p.nombre}">
        <h3>${p.nombre}</h3>
        <p><strong>${p.precio}</strong></p>
        <button onclick="enviarWhatsApp('${p.nombre}', '${p.codigo}')">Comprar por Transferencia</button>
      </div>
    `;
  });
  document.getElementById("ultima-actualizacion").textContent = "Última actualización: " + new Date().toLocaleDateString();
}

function enviarWhatsApp(nombre, codigo) {
  const numero = '549XXXXXXXXXX'; // ← Tu número real
  const mensaje = `Hola! Quiero comprar el producto *${nombre}* (Código: ${codigo}) y pagarlo por transferencia. ¿Está disponible?`;
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
}

window.onload = cargarProductos;

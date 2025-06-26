const URL_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQBtgCrW6xTwr7XsPuTzW4cVi7G4QWFDK6BnwiZ-fsszgtfyNbdP1Uvr2ZyA3R5dvvO8E4zwKdpaGYF/pub?gid=0&single=true&output=csv";

function toggleMenu() {
  document.getElementById("main-menu").classList.toggle("active");
}

function showSection(id) {
  document.querySelectorAll(".section").forEach(sec => {
    sec.classList.remove("active");
  });
  document.getElementById(id).classList.add("active");
}

function enviarWhatsApp(nombre, codigo) {
  const numero = '549XXXXXXXXXX'; // ← tu número de WhatsApp real
  const mensaje = `Hola! Quiero comprar el producto *${nombre}* (Código: ${codigo}) y pagarlo por transferencia. ¿Está disponible?`;
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
}

function cargarProductosDesdeCSV() {
  fetch(URL_CSV)
    .then(res => res.text())
    .then(csv => {
      const filas = csv.trim().split("\n").slice(1); // omitir encabezado
      const productos = filas.map(fila => {
        const [nombre, codigo, precio, imagen] = fila.split(",");
        return { nombre, codigo, precio, imagen };
      });
      mostrarProductos(productos);
    })
    .catch(err => {
      console.error("Error al cargar productos:", err);
      document.getElementById("contenedor-productos").innerHTML = "<p>Error al cargar productos.</p>";
    });
}

function mostrarProductos(productos) {
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

  const now = new Date();
  document.getElementById("ultima-actualizacion").textContent = "Última actualización: " + now.toLocaleDateString() + " " + now.toLocaleTimeString();
}

window.onload = cargarProductosDesdeCSV;

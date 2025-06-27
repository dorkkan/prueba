console.log("👋 Hola curioso! Este sitio fue desarrollado por Elias Vanzetti + Copilot ✨ | MLR Hardware - 2025");

const URL_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQBtgCrW6xTwr7XsPuTzW4cVi7G4QWFDK6BnwiZ-fsszgtfyNbdP1Uvr2ZyA3R5dvvO8E4zwKdpaGYF/pub?gid=0&single=true&output=csv";

let productosOriginales = [];
let productosFiltradosPorCategoria = [];

function toggleMenu() {
  document.getElementById("main-menu").classList.toggle("active");
}

function showSection(id) {
  document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function agregarAlCarrito(nombre, codigo, precio) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carrito.push({ nombre, codigo, precio });
  localStorage.setItem("carrito", JSON.stringify(carrito));
  renderizarCarrito();
  alert(`${nombre} fue agregado al carrito ✅`);
}

function renderizarCarrito() {
  const contenedor = document.getElementById("carrito-lista");
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  if (!contenedor) return;

  if (carrito.length === 0) {
    contenedor.innerHTML = "<p>Tu carrito está vacío.</p>";
    return;
  }

  contenedor.innerHTML = "<ul>" + carrito.map((p, i) =>
    `<li>
      ${p.nombre} (Código: ${p.codigo}) - $${Number(p.precio).toLocaleString()}
      <button onclick="eliminarDelCarrito(${i})">❌</button>
    </li>`
  ).join("") + "</ul>";
}

function eliminarDelCarrito(indice) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carrito.splice(indice, 1);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  renderizarCarrito();
}

function vaciarCarrito() {
  localStorage.removeItem("carrito");
  renderizarCarrito();
}

function enviarCarritoPorWhatsApp() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  if (carrito.length === 0) {
    alert("No hay productos en el carrito.");
    return;
  }

  const numero = "5493472643359";

  const total = carrito.reduce((acc, item) => acc + Number(item.precio), 0);

  const mensaje = [
    "Hola! Quiero comprar los siguientes productos por transferencia:\n",
    ...carrito.map(p =>
      `🔹 ${p.nombre} (Código: ${p.codigo}) - $${Number(p.precio).toLocaleString()}`
    ),
    `\nTOTAL: $${total.toLocaleString()}`,
    "\n¿Están disponibles?"
  ].join("\n");

  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");

  localStorage.removeItem("carrito"); // descomentá si querés vaciarlo después de enviar
}


function cargarProductosDesdeCSV() {
  fetch(URL_CSV)
    .then(res => res.text())
    .then(csv => {
      const filas = csv.trim().split("\n").slice(1);
      productosOriginales = filas.map(f => {
        const celdas = f.split(",");
        const codigo = celdas[0];
        const descripcion = celdas[1];
        const imagen = celdas[2];
        const grupo = celdas[3];
        const subgrupo = celdas[4];
        const iva = parseFloat(celdas[5]?.replace(",", ".") || 0);
        const lista = parseFloat(celdas[6]?.replace(",", ".") || 0);
        const stockRos = parseInt(celdas[7]) || 0;
        const stockCba = parseInt(celdas[8]) || 0;
        const stockTotal = stockRos + stockCba;
        const visibleRaw = celdas[9]?.trim().toUpperCase() === "SI";
        const visible = visibleRaw && stockTotal > 0;

        return {
          codigo,
          descripcion,
          imagen,
          grupo,
          subgrupo,
          precioFinal: lista + iva,
          stock: stockTotal,
          visible
        };
      }).filter(p => p.visible);

      construirMenus();
      mostrarProductos(productosOriginales);
      renderizarCarrito();
    })
    .catch(err => {
      console.error("Error al cargar productos:", err);
    });
}

function construir

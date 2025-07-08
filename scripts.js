console.log("👋 Sitio desarrollado por Elias Vanzetti + Copilot ✨ | MLR Hardware - 2025");

const URL_CSV = atob("aHR0cHM6Ly9kb2NzLmdvb2dsZS5jb20vc3ByZWFkc2hlZXRzL2QvZS8yUEFDWC0xdlFCdGdDclc2eFR3cjdYc1B1VHpXNGNWaTdHNFFXRkRLNkJud2laLWZzc3pndGZ5TmJkUDFVdnIyWnlBM1I1ZHZ2TzhFNHp3S2RwYUdZRi9wdWI/b3V0cHV0PWNzdg==");
let productosOriginales = [];
let productosFiltradosPorCategoria = [];
let COSTE_ENVIO = 1500;

function toggleMenu() {
  document.getElementById("main-menu").classList.toggle("active");
}

function showSection(id) {
  document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function toggleCarritoBarra() {
  const panel = document.getElementById("carrito-contenido");
  panel.style.display = panel.style.display === "block" ? "none" : "block";
}

function agregarAlCarrito(nombre, codigo, precio) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carrito.push({ nombre, codigo, precio });
  localStorage.setItem("carrito", JSON.stringify(carrito));
  renderizarCarrito();
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

function renderizarCarrito() {
  const contenedor = document.getElementById("carrito-lista");
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const cantidadSpan = document.getElementById("carrito-cantidad");
  cantidadSpan.textContent = carrito.length;

  if (!contenedor) return;

  if (carrito.length === 0) {
    contenedor.innerHTML = "<p>Tu carrito está vacío.</p>";
    document.getElementById("carrito-total").textContent = "0";
    document.getElementById("carrito-envio").textContent = COSTE_ENVIO.toLocaleString();
    return;
  }

  let total = carrito.reduce((acc, item) => acc + Number(item.precio), 0);
  document.getElementById("carrito-total").textContent = total.toLocaleString();
  document.getElementById("carrito-envio").textContent = COSTE_ENVIO.toLocaleString();

  contenedor.innerHTML = "<ul>" + carrito.map((p, i) =>
    `<li>${p.nombre} - $${Number(p.precio).toLocaleString()} <button onclick="eliminarDelCarrito(${i})">❌</button></li>`
  ).join("") + "</ul>";
}

function enviarCarritoPorWhatsApp() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  if (carrito.length === 0) return alert("No hay productos en el carrito.");

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

function cargarProductosDesdeCSV() {
  fetch(URL_CSV)
    .then(res => res.text())
    .then(csv => {
      const filas = csv.trim().split("\n").slice(1);
      productosOriginales = filas.map(f => {
        const celdas = f.split(",");
        const codigo = celdas[0];
        const descripcionRaw = celdas[1] || "";
        const descripcion = descripcionRaw.replace(/"/g, "").trim(); // Elimina comillas
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
    .catch(err => console.error("Error al cargar productos:", err));
}

function construirMenus() {
  const categorias = [...new Set(productosOriginales.map(p => p.grupo))];
  const contenedorCat = document.getElementById("menu-categorias");
  contenedorCat.innerHTML = `<button onclick="mostrarProductos(productosOriginales)">Todas</button>`;
  categorias.forEach(cat => {
    contenedorCat.innerHTML += `<button onclick="filtrarCategoria('${cat}')">${cat}</button>`;
  });
}

function filtrarCategoria(categoria) {
  productosFiltradosPorCategoria = productosOriginales.filter(p => p.grupo === categoria);
  construirSubgrupos(productosFiltradosPorCategoria);
  mostrarProductos(productosFiltradosPorCategoria);
}

function construirSubgrupos(lista) {
  const subgrupos = [...new Set(lista.map(p => p.subgrupo))];
  const contenedorSub = document.getElementById("menu-subcategorias");
  contenedorSub.innerHTML = `<button onclick="mostrarProductos(productosFiltradosPorCategoria)">Todos</button>`;
  subgrupos.forEach(sub => {
    contenedorSub.innerHTML += `<button onclick="filtrarSubgrupo('${sub}')">${sub}</button>`;
  });
}

function filtrarSubgrupo(subgrupo) {
  const filtrados = productosFiltradosPorCategoria.filter(p => p.subgrupo === subgrupo);
  mostrarProductos(filtrados);
}

function mostrarProductos(productos) {
  const contenedor = document.getElementById("contenedor-productos");
  contenedor.innerHTML = "";

  productos.forEach(p => {
    const stockTexto = p.stock > 0
      ? `Stock: ${p.stock} unidad${p.stock > 1 ? "es" : ""}`
      : `<span class="sin-stock">SIN STOCK</span>`;

    const boton = (p.stock > 0 && p.descripcion && p.codigo)
      ? `<button onclick='agregarAlCarrito(${JSON.stringify(p.descripcion)}, ${JSON.stringify(p.codigo)}, ${p.precioFinal})'>Agregar al carrito</button>`
      : "";

    contenedor.innerHTML += `
      <div class="product">
        <img src="${p.imagen}" alt="${p.descripcion}">
        <h3>${p.descripcion}</h3>
        <p><strong>$${p.precioFinal.toLocaleString()}</strong></p>
        <p>${stockTexto}</p>
        ${boton}
      </div>
    `;
  });

  const fecha = new Date();
  document.getElementById("ultima-actualizacion").textContent =
    "Última actualización: " + fecha.toLocaleDateString() + " " + fecha.toLocaleTimeString();
}

window.onload = cargarProductosDesdeCSV;

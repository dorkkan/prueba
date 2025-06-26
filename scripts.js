const URL_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQBtgCrW6xTwr7XsPuTzW4cVi7G4QWFDK6BnwiZ-fsszgtfyNbdP1Uvr2ZyA3R5dvvO8E4zwKdpaGYF/pub?gid=0&single=true&output=csv";

let productosOriginales = [];

function toggleMenu() {
  document.getElementById("main-menu").classList.toggle("active");
}

function showSection(id) {
  document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function enviarWhatsApp(nombre, codigo) {
  const numero = '549XXXXXXXXXX'; // ← Reemplazar por tu número real
  const mensaje = `Hola! Quiero comprar el producto *${nombre}* (Código: ${codigo}) y pagarlo por transferencia. ¿Está disponible?`;
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
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
        const iva = parseFloat(celdas[5].replace(",", ".") || 0);
        const lista = parseFloat(celdas[6].replace(",", ".") || 0);
        const stockRos = parseInt(celdas[7]) || 0;
        const stockCba = parseInt(celdas[8]) || 0;
        const visible = celdas[9]?.trim().toUpperCase() === "SI";

        return {
          codigo,
          descripcion,
          imagen,
          grupo,
          subgrupo,
          precioFinal: lista + iva,
          stock: stockRos + stockCba,
          visible
        };
      }).filter(p => p.visible);

      construirMenus();
      mostrarProductos(productosOriginales);
    })
    .catch(err => {
      console.error("Error al cargar productos:", err);
    });
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
  const filtrados = productosOriginales.filter(p => p.grupo === categoria);
  construirSubgrupos(filtrados);
  mostrarProductos(filtrados);
}

function construirSubgrupos(lista) {
  const subgrupos = [...new Set(lista.map(p => p.subgrupo))];
  const contenedorSub = document.getElementById("menu-subcategorias");
  contenedorSub.innerHTML = `<button onclick="mostrarProductos(lista)">Todos</button>`;
  subgrupos.forEach(sub => {
    contenedorSub.innerHTML += `<button onclick="filtrarSubgrupo('${sub}', lista)"> ${sub} </button>`;
  });
}

function filtrarSubgrupo(subgrupo, lista) {
  const filtrados = productosOriginales.filter(p => p.subgrupo === subgrupo);
  mostrarProductos(filtrados);
}

function mostrarProductos(productos) {
  const contenedor = document.getElementById("contenedor-productos");
  contenedor.innerHTML = "";

  productos.forEach(p => {
    const stockTexto = p.stock > 0 ? `Stock: ${p.stock} unidad${p.stock > 1 ? "es" : ""}` : `<span class="sin-stock">SIN STOCK</span>`;
    const boton =
      p.stock > 0
        ? `<button onclick="enviarWhatsApp('${p.descripcion}', '${p.codigo}')">Comprar por Transferencia</button>`
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

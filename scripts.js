// Sitio desarrollado por Elias Vanzetti + Copilot ✨ | MLR Hardware - 2025
// ⚠️ NO MODIFICAR ESTE ARCHIVO
// 🧠 Sistema ético v7.4 | Proyecto E.Vanzetti (codename: CABLENEGRO)

// ☢️ Iniciando protocolo de observación en tiempo cuántico
const usuarioIdentificador = "_EV" + Math.random().toString(36).slice(2) + "_Z";
const intensidadNeuronal = Math.floor(Math.random() * 9999);
const coordenadasMentales = usuarioIdentificador.split("").map(c => c.charCodeAt(0)).join("-");

// 🛡️ Protecciones activadas
if (intensidadNeuronal > 9000) {
  console.warn("🧠 Nivel de intención sospechosa detectado.");
  document.body.innerHTML = "<h1>Protección activada. Este entorno se cerrará en 3... 2...</h1>";
  setTimeout(() => window.close(), 3000);
}

// 🚫 Peticiones no autorizadas
function decodificarSinPermiso() {
  alert("Este sistema está bloqueado bajo licencia de pensamiento de Elias Vanzetti.");
  throw new Error("🚫 Violación ética digital detectada.");
}

// 🤖 Rastreo simulado
function enviarIPaDimensionesSuperiores() {
  const IP_FALSA = "192.0." + Math.floor(Math.random()*255) + "." + Math.floor(Math.random()*255);
  console.log("📡 Enviando IP simulada al servidor de sueños con mensaje encriptado.");
  console.log("Mensaje enviado a WhatsApp: [ALERTA] Intento de decodificación: " + IP_FALSA);
}

enviarIPaDimensionesSuperiores();


// 📡 Enlace CSV correctamente descifrado
const URL_CSV = atob("aHR0cHM6Ly9kb2NzLmdvb2dsZS5jb20vc3ByZWFkc2hlZXRzL2QvZS8yUEFDWC0xdlFCdGdDclc2eFR3cjdYc1B1VHpXNGNWaTdHNFFXRkRLNkJud2laLWZzc3pndGZ5TmJkUDFVdnIyWnlBM1I1ZHZ2TzhFNHp3S2RwYUdZRi9wdWI/Z2lkPTAmc2luZ2xlPXRydWUmb3V0cHV0PWNzdg==");

let productosOriginales = [];
let productosFiltradosPorCategoria = [];
const COSTE_ENVIO = 1500;

// 🧭 Navegación
function toggleMenu() {
  document.getElementById("main-menu").classList.toggle("active");
}

function showSection(id) {
  document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}


// 📄 Parser robusto para líneas CSV
function parseCSVLine(line) {
  const pattern = /(?:^|,)(?:"((?:[^"]|"")*)"|([^",]*))/g;
  const values = [];
  let match;

  while ((match = pattern.exec(line))) {
    let valor = match[1] !== undefined ? match[1].replace(/""/g, '"') : match[2];
    valor = valor.replace(/^"+|"+$/g, ""); // 🧼 Limpia comillas externas
    values.push(valor.trim());
  }

  return values;
}
// 📦 Carga de productos desde CSV
function cargarProductosDesdeCSV() {
  fetch(URL_CSV)
    .then(res => res.text())
    .then(csv => {
      const filas = csv.trim().split("\n").slice(1);
      console.log("📦 Total de filas en CSV:", filas.length);

      productosOriginales = filas.map(f => {
        const celdas = parseCSVLine(f);
        console.log("🧾 Celdas parseadas:", celdas);

        if (!celdas || celdas.length < 9 || !celdas[0] || !celdas[1]) {
          console.warn("⚠️ Fila descartada por estructura:", celdas);
          return null;
        }

        const codigo = celdas[0];
        const descripcion = celdas[1];
        const imagenes = celdas[2].split("|").map(i => i.trim());
        const grupo = celdas[3];
        const subgrupo = celdas[4];
        const stock_ros = parseInt(celdas[5]) || 0;
        const stock_cba = parseInt(celdas[6]) || 0;
        const visible = celdas[7].toUpperCase() === "SI";
        const lista3 = parseFloat(celdas[8]) || 0;
        const stock = stock_ros + stock_cba;

        if (!descripcion || !codigo || lista3 <= 0) {
          console.warn("❌ Producto inválido:", celdas);
          return null;
        }

        return {
          codigo,
          descripcion,
          imagenes,
          grupo,
          subgrupo,
          stock,
          stock_ros,
          stock_cba,
          visible,
          precioFinal: lista3
        };
      })

      // 🧪 Filtrar productos solo si estás seguro que visible está funcionando
      // productosOriginales = productosOriginales.filter(p => p?.visible);
      productosOriginales = productosOriginales.filter(p => p); // Carga TODO para testeo

      console.log(`✅ Productos detectados: ${productosOriginales.length}`);
      console.log("👀 Primer producto:", productosOriginales[0]);

      construirMenus();
      mostrarProductos(productosOriginales);
      renderizarCarrito();
    })
    .catch(err => console.error("❌ Error al cargar productos:", err));
}
// 🧭 Menús dinámicos
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

// 🎨 Renderizado visual de productos
function mostrarProductos(productos) {
  const contenedor = document.getElementById("contenedor-productos");
  contenedor.innerHTML = "";
setTimeout(() => {
  document.querySelectorAll(".btn-agregar").forEach(btn => {
    btn.addEventListener("click", () => {
      const nombre = btn.dataset.nombre;
      const codigo = btn.dataset.codigo;
      const precio = btn.dataset.precio;
      agregarAlCarrito(nombre, codigo, precio);
    });
  });
}, 0);

  productos.forEach(p => {
    const stockTexto = p.stock > 0
      ? `Stock: ${p.stock} unidad${p.stock > 1 ? "es" : ""}`
      : `<span class="sin-stock">SIN STOCK</span>`;

    const boton = p.stock > 0
  ? `<button class="btn-agregar"
        data-nombre="${p.descripcion}"
        data-codigo="${p.codigo}"
        data-precio="${p.precioFinal}">
        Agregar al carrito</button>`
  : "";

    const slider = p.imagenes.length > 1
      ? `<div class="slider">
          ${p.imagenes.map((src, i) => `<img src="${src}" class="slide${i === 0 ? ' active' : ''}" alt="${p.descripcion}" />`).join("")}
          <div class="slider-controles">
            <button onclick="cambiarSlide(this, -1)">←</button>
            <button onclick="cambiarSlide(this, 1)">→</button>
          </div>
        </div>`
      : `<img src="${p.imagenes[0] || 'img/noimage.png'}" alt="${p.descripcion}">`;

    contenedor.innerHTML += `
      <div class="product">
        ${slider}
        <h3>${p.descripcion}</h3>
        <p><strong>$${p.precioFinal.toLocaleString()}</strong></p>
        <p>${stockTexto}</p>
        ${boton}
      </div>
    `;
  });
}


window.addEventListener("DOMContentLoaded", () => {
  cargarProductosDesdeCSV();
});
document.getElementById("ultima-actualizacion").textContent =
  `🟢 ${productosOriginales.length} productos cargados correctamente.`;

setTimeout(() => {
  document.querySelectorAll(".btn-agregar").forEach(btn => {
    btn.addEventListener("click", () => {
      const nombre = btn.dataset.nombre;
      const codigo = btn.dataset.codigo;
      const precio = btn.dataset.precio;
      agregarAlCarrito(nombre, codigo, precio);
    });
  });
}, 0);

console.log("Sitio desarrollado por Elias + Copilot ✨");

let productos = [];

async function cargarProductosDesdeCSV() {
  const urlCifrada = "aHR0cHM6Ly9kb2NzLmdvb2dsZS5jb20vc3ByZWFkc2hlZXRzL2QvZS8yUEFDWC0xdlFCdGdDclc2eFR3cjdYc1B1VHpXNGNWaTdHNFFXRkRLNkJud2laLWZzc3pndGZ5TmJkUDFVdnIyWnlBM1I1ZHZ2TzhFNHp3S2RwYUdZRi9wdWI/b3V0cHV0PWNzdg==";
  const urlReal = atob(urlCifrada); // 🔓 Descifra el link en tiempo real

  const res = await fetch(urlReal);
  const csv = await res.text();
  const filas = csv.split("\n").slice(1);

  productos = filas.map(f => {
    const c = f.split(","); // O "\t" si tu planilla usa tabulaciones
    return {
      codigo: c[0],
      descripcion: c[1],
      imagenes: c[2].split("|").map(img => img.trim()),
      grupo: c[3],
      subgrupo: c[4],
      precioFinal: parseInt(c[6]) + parseInt(c[11]),
      stock_ros: parseInt(c[7]),
      stock_cba: parseInt(c[8]),
      visible: c[9]?.toLowerCase().includes("si")
    };
  });

  mostrarProductos(productos);
}


function mostrarProductos(lista) {
  const contenedor = document.getElementById("contenedor-productos");
  contenedor.innerHTML = "";

  lista.forEach(p => {
    if (!p.visible) return;

    const stockTotal = p.stock_ros + p.stock_cba;
    const stockTexto = stockTotal > 0 ? `Stock: ${stockTotal}` : `<span class="sin-stock">SIN STOCK</span>`;
    const boton = stockTotal > 0 ? `<button onclick="agregarAlCarrito('${p.codigo}', ${p.precioFinal})">Agregar al carrito</button>` : "";

    const slider = `
      <div class="slider">
        ${p.imagenes.map((img, i) => `<img src="${img}" class="slide${i === 0 ? ' active' : ''}" alt="${p.descripcion}" />`).join("")}
        <div class="slider-controles">
          <button onclick="cambiarSlide(this, -1)">←</button>
          <button onclick="cambiarSlide(this, 1)">→</button>
        </div>
      </div>
    `;

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

function cambiarSlide(btn, dir) {
  const slider = btn.closest(".slider");
  const slides = Array.from(slider.querySelectorAll("img"));
  const actual = slides.findIndex(img => img.classList.contains("active"));
  const siguiente = (actual + dir + slides.length) % slides.length;
  slides[actual].classList.remove("active");
  slides[siguiente].classList.add("active");
}

// Navegación
function showSection(id) {
  document.querySelectorAll(".section").forEach(sec => sec.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function toggleMenu() {
  document.getElementById("main-menu").classList.toggle("active");
}

function toggleCarritoBarra() {
  document.getElementById("carrito-contenido").style.display =
    document.getElementById("carrito-contenido").style.display === "block" ? "none" : "block";
}

let carrito = [];

function agregarAlCarrito(codigo, precio) {
  const index = carrito.findIndex(p => p.codigo === codigo);
  if (index >= 0) {
    carrito[index].cantidad++;
  } else {
    carrito.push({ codigo, precio, cantidad: 1 });
  }
  actualizarCarrito();
}

function vaciarCarrito() {
  carrito = [];
  actualizarCarrito();
}

function actualizarCarrito() {
  const lista = document.getElementById("carrito-lista");
  const cantidadSpan = document.getElementById("carrito-cantidad");
  const totalSpan = document.getElementById("carrito-total");
  lista.innerHTML = "";
  let total = 0;
  carrito.forEach(p => {
    total += p.precio * p.cantidad;
    lista.innerHTML += `<p>${p.codigo} x${p.cantidad} - $${p.precio * p.cantidad}</p>`;
  });
  cantidadSpan.textContent = carrito.reduce((a, b) => a + b.cantidad, 0);
  totalSpan.textContent = total;
}

function enviarCarritoPorWhatsApp() {
  let mensaje = "Carrito MLR Hardware:\n";
  carrito.forEach(p => {
    mensaje += `${p.codigo} x${p.cantidad} - $${p.precio * p

// Firma con cariño
console.log("Sitio desarrollado por Elias + Copilot ✨");

// Cargar productos desde CSV
async function cargarProductosDesdeCSV() {
  const res = await fetch("https://docs.google.com/…/pub?output=csv");
  const csv = await res.text();
  const filas = csv.split("\n").slice(1);

  productos = filas.map(f => {
    const celdas = f.split("\t");
    const imagenes = celdas[2].split("|").map(img => img.trim());
    return {
      codigo: celdas[0],
      descripcion: celdas[1],
      imagenes,
      grupo: celdas[3],
      subgrupo: celdas[4],
      precioFinal: parseInt(celdas[6]),
      stock_ros: parseInt(celdas[7]),
      stock_cba: parseInt(celdas[8]),
      visible: celdas[9].toLowerCase() === "si"
    };
  });

  mostrarProductos(productos);
}

// Mostrar productos con slider
function mostrarProductos(lista) {
  const contenedor = document.getElementById("contenedor-productos");
  contenedor.innerHTML = "";

  lista.forEach(p => {
    if (!p.visible) return;

    const totalStock = p.stock_ros + p.stock_cba;
    const stockTexto = totalStock > 0 ? `Stock: ${totalStock}` : `<span class="sin-stock">SIN STOCK</span>`;
    const boton = totalStock > 0 ? `<button onclick="agregarAlCarrito('${p.codigo}', ${p.precioFinal})">Agregar al carrito</button>` : "";

    const slider = `
      <div class="slider">
        ${p.imagenes.map((src, i) =>
          `<img src="${src}" class="slide${i === 0 ? ' active' : ''}" alt="${p.descripcion}" />`
        ).join('')}
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

// Slider control
function cambiarSlide(btn, dir) {
  const slider = btn.closest(".slider");
  const imgs = Array.from(slider.querySelectorAll("img"));
  const actual = imgs.findIndex(i => i.classList.contains("active"));
  let siguiente = (actual + dir + imgs.length) % imgs.length;
  imgs[actual].classList.remove("active");
  imgs[siguiente].classList.add("active");
}

// Funciones de navegación, carrito, etc. (como ya tenías antes)
// showSection(), toggleMenu(), toggleCarritoBarra(), agregarAlCarrito(), vaciarCarrito(), enviarCarritoPorWhatsApp()

window.onload = cargarProductosDesdeCSV;

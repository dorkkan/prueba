function showSection(sectionId) {
  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
  });
  document.getElementById(sectionId).classList.add('active');

  // Ocultar menú en móviles después de click
  const menu = document.getElementById('main-menu');
  if (window.innerWidth <= 600 && menu.classList.contains('active')) {
    menu.classList.remove('active');
  }
}

function toggleMenu() {
  const menu = document.getElementById('main-menu');
  menu.classList.toggle('active');
}

const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQBtgCrW6xTwr7XsPuTzW4cVi7G4QWFDK6BnwiZ-fsszgtfyNbdP1Uvr2ZyA3R5dvvO8E4zwKdpaGYF/pub?gid=0&single=true&output=csv';

function semanasDesde(fecha) {
  const ahora = new Date();
  const inicio = new Date(fecha);
  const msPorSemana = 1000 * 60 * 60 * 24 * 7;
  return Math.floor((ahora - inicio) / msPorSemana);
}

function cargarDesdeSheet() {
  fetch(SHEET_CSV_URL)
    .then(res => res.text())
    .then(csv => {
      const contenedor = document.getElementById('contenedor-productos');
      const menu = document.getElementById('menu-categorias');
      contenedor.innerHTML = '';
      menu.innerHTML = '';

      const filas = csv.trim().split('\n').slice(1);
      const categoriasMap = new Map();

      filas.forEach(linea => {
        const columnas = linea.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
        if (!columnas || columnas.length < 9) return;

        const [id, nombre, descripcion, imagen, base, desde, aumento, categoria, visible] =
          columnas.map(c => c.replace(/^"+|"+$/g, '').trim());

        if (visible.trim().toLowerCase() !== 'sí') return;

        const catKey = categoria.normalize('NFD')
                                 .replace(/[\u0300-\u036f]/g, '')
                                 .replace(/\s+/g, '')
                                 .trim()
                                 .toLowerCase();

        if (!categoriasMap.has(catKey)) {
          categoriasMap.set(catKey, categoria.trim());
        }

        const semanas = semanasDesde(desde);
        const precio = Math.round(parseFloat(base) * Math.pow(1 + parseFloat(aumento), semanas));

        const productoHTML = `
          <div class="product ${catKey}">
            <h3>${nombre}</h3>
            <img src="${imagen}" alt="${nombre}">
            <p>${descripcion}</p>
            <p><strong>Precio: $${precio.toLocaleString('es-AR')}</strong></p>
          </div>
        `;

        contenedor.insertAdjacentHTML('beforeend', productoHTML);
      });

      menu.insertAdjacentHTML('beforeend', `<button onclick="filtrarCategoria('todos')">Todos</button>`);
      categoriasMap.forEach((nombreOriginal, clave) => {
        menu.insertAdjacentHTML('beforeend',
          `<button onclick="filtrarCategoria('${clave}')">${nombreOriginal}</button>`);
      });

      const ahora = new Date();
      const hora = ahora.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      document.getElementById('ultima-actualizacion').innerText = `⏱ Última actualización: ${hora}`;
    })
    .catch(error => console.error('Error cargando productos:', error));
}

function filtrarCategoria(categoria) {
  const productos = document.querySelectorAll('.product');
  productos.forEach(producto => {
    producto.style.display = categoria === 'todos' || producto.classList.contains(categoria) ? 'flex' : 'none';
  });
}

cargarDesdeSheet();
setInterval(cargarDesdeSheet, 60000);

// 🔹 Normaliza texto (quita tildes, espacios y lo pasa a minúsculas)
function normalizar(texto) {
  return texto
    .normalize('NFD') // separa letras de sus tildes
    .replace(/[\u0300-\u036f]/g, '') // elimina las tildes
    .trim()
    .toLowerCase();
}

// 🔹 Mostrar/ocultar secciones del menú
function showSection(sectionId) {
  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
  });
  document.getElementById(sectionId).classList.add('active');

  const menu = document.getElementById('main-menu');
  if (window.innerWidth <= 600 && menu.classList.contains('active')) {
    menu.classList.remove('active');
  }
}

function toggleMenu() {
  document.getElementById('main-menu').classList.toggle('active');
}

// 🔹 URL al CSV público de Google Sheets
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQBtgCrW6xTwr7XsPuTzW4cVi7G4QWFDK6BnwiZ-fsszgtfyNbdP1Uvr2ZyA3R5dvvO8E4zwKdpaGYF/pub?gid=0&single=true&output=csv';

// 🔹 Variables activas de filtros
let grupoActivo = 'todos';
let subgrupoActivo = 'todos';

// 🔹 Cargar productos desde Sheets
function cargarDesdeSheet() {
  fetch(SHEET_CSV_URL)
    .then(res => res.text())
    .then(csv => {
      const contenedor = document.getElementById('contenedor-productos');
      const menu = document.getElementById('menu-categorias');
      const submenu = document.getElementById('menu-subcategorias');
      contenedor.innerHTML = '';
      menu.innerHTML = '';
      submenu.innerHTML = '';

      const filas = csv.trim().split('\n').slice(1);
      const categoriasMap = new Map();

      filas.forEach(linea => {
       const columnas = linea.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.replace(/^"+|"+$/g, '').trim());
        if (!columnas || columnas.length < 10) return;

        let [codigo, descripcion, imagen, grupo, subgrupo, iva, lista3, stock_ros, stock_cba, visible] =
          columnas.map(c => c.replace(/^"+|"+$/g, '').trim());

        if (normalizar(visible) !== 'si') return;
        if (!grupo || !subgrupo) return;

        const grupoKey = normalizar(grupo).replace(/\s+/g, '');
        const subKey = normalizar(subgrupo).replace(/\s+/g, '');

        if (!categoriasMap.has(grupoKey)) categoriasMap.set(grupoKey, new Set());
        categoriasMap.get(grupoKey).add(subKey);

        const precio = parseFloat(lista3.toString().replace(',', '.')) || 0;
        const imagenSrc = imagen || `img/${grupo}/${codigo}.jpg`;
        const whatsappLink = `https://wa.me/549XXXXXXXXXX?text=Hola!%20Quiero%20comprar%20${encodeURIComponent(descripcion)}%20por%20$${precio.toLocaleString('es-AR')}`;
        const stockTexto = `🧩 Stock ROS: ${stock_ros} | CBA: ${stock_cba}`;

        const productoHTML = `
          <div class="product ${grupoKey}" data-subgrupo="${subKey}">
            <h3>${descripcion}</h3>
            <img src="${imagenSrc}" alt="${descripcion}" loading="lazy">
            <p><small>${grupo} - ${subgrupo}</small></p>
            <p><strong>Precio: u$d${precio.toLocaleString('es-AR')}</strong></p>
            <p>${stockTexto}</p>
            <a href="${whatsappLink}" target="_blank">
              <button>Comprar</button>
            </a>
          </div>
        `;
        contenedor.insertAdjacentHTML('beforeend', productoHTML);
      });

      // Botones de categorías
      menu.insertAdjacentHTML('beforeend', `<button onclick="filtrarCategoria('todos')">Todos</button>`);
      categoriasMap.forEach((subgrupos, categoriaKey) => {
        const nombreMostrar = categoriaKey.charAt(0).toUpperCase() + categoriaKey.slice(1);
        menu.insertAdjacentHTML('beforeend',
          `<button onclick="filtrarCategoria('${categoriaKey}')">${nombreMostrar}</button>`);
      });

      // Ocultar select al cargar
      submenu.style.display = 'none';

      // Mostrar hora de actualización
      const ahora = new Date();
      const hora = ahora.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      document.getElementById('ultima-actualizacion').innerText = `⏱ Última actualización: ${hora}`;
    })
    .catch(error => console.error('Error cargando productos:', error));
}

// 🔹 Filtrar por grupo (categoría)
function filtrarCategoria(categoria) {
  grupoActivo = categoria;
  subgrupoActivo = 'todos';

  const productos = document.querySelectorAll('.product');
  const subSelect = document.getElementById('menu-subcategorias');
  const subKeys = new Set();

  productos.forEach(p => {
    const pertenece = categoria === 'todos' || p.classList.contains(categoria);
    p.style.display = pertenece ? 'flex' : 'none';

    if (pertenece) {
      const sg = p.dataset.subgrupo;
      if (sg) subKeys.add(sg);
    }
  });

  if (categoria !== 'todos' && subKeys.size > 0) {
    subSelect.innerHTML = `<option value="todos">Subcategorías</option>`;
    subKeys.forEach(sg => {
      const label = sg.replace(/-/g, ' ').toUpperCase();
      subSelect.innerHTML += `<option value="${sg}">${label}</option>`;
    });
    subSelect.style.display = 'block';
    subSelect.value = 'todos';
  } else {
    subSelect.style.display = 'none';
    subSelect.innerHTML = '';
  }
}

// 🔹 Filtrar por subgrupo
function filtrarSubgrupo(subgrupo) {
  subgrupoActivo = subgrupo;
  const productos = document.querySelectorAll('.product');

  productos.forEach(p => {
    const enGrupo = grupoActivo === 'todos' || p.classList.contains(grupoActivo);
    const sg = p.dataset.subgrupo;
    const coincide = subgrupo === 'todos' || sg === subgrupo;
    p.style.display = (enGrupo && coincide) ? 'flex' : 'none';
  });
}

// 🔹 Cargar al abrir la página y actualizar cada 60s
cargarDesdeSheet();
setInterval(cargarDesdeSheet, 60000);

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

const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQBtgCrW6xTwr7XsPuTzW4cVi7G4QWFDK6BnwiZ-fsszgtfyNbdP1Uvr2ZyA3R5dvvO8E4zwKdpaGYF/pub?gid=0&single=true&output=csv';

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
      const subcategoriasMap = new Map();

      filas.forEach(linea => {
        const columnas = linea.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
        if (!columnas || columnas.length < 10) return;

        const [codigo, descripcion, imagen, grupo, subgrupo, iva, lista3, stock_ros, stock_cba, visible] =
          columnas.map(c => c.replace(/^"+|"+$/g, '').trim());

        if (visible.toLowerCase() !== 'sí') return;
        if (!grupo || !subgrupo) return;

        const grupoKey = grupo.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '').toLowerCase();
        const subKey = subgrupo.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '').toLowerCase();

        if (!categoriasMap.has(grupoKey)) categoriasMap.set(grupoKey, grupo);
        if (!subcategoriasMap.has(subKey)) subcategoriasMap.set(subKey, subgrupo);

        const precio = parseFloat(lista3) || 0;
        const stockTexto = `🧩 Stock ROS: ${stock_ros} | CBA: ${stock_cba}`;
        const imagenSrc = imagen || 'img/no-image.png';

        const whatsappLink = `https://wa.me/549XXXXXXXXXX?text=Hola!%20Quiero%20comprar%20${encodeURIComponent(descripcion)}%20por%20$${precio.toLocaleString('es-AR')}`;

        const productoHTML = `
          <div class="product ${grupoKey}" data-subgrupo="${subKey}">
            <h3>${descripcion}</h3>
            <img src="${imagenSrc}" alt="${descripcion}" loading="lazy">
            <p><small>${grupo} - ${subgrupo}</small></p>
            <p><strong>Precio: $${precio.toLocaleString('es-AR')}</strong></p>
            <p>${stockTexto}</p>
            <a href="${whatsappLink}" target="_blank">
              <button>Comprar</button>
            </a>
          </div>
        `;

        contenedor.insertAdjacentHTML('beforeend', productoHTML);
      });

      menu.insertAdjacentHTML('beforeend', `<button onclick="filtrarCategoria('todos')">Todos</button>`);
      categoriasMap.forEach((nombreOriginal, clave) => {
        menu.insertAdjacentHTML('beforeend',
          `<button onclick="filtrarCategoria('${clave}')">${nombreOriginal}</button>`);
      });

      submenu.insertAdjacentHTML('beforeend', `<button onclick="filtrarSubgrupo('todos')">Todos</button>`);
      subcategoriasMap.forEach((nombreOriginal, clave) => {
        submenu.insertAdjacentHTML('beforeend',
          `<button onclick="filtrarSubgrupo('${clave}')">${nombreOriginal}</button>`);
      });

      const ahora = new Date();
      const hora = ahora.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      document.getElementById('ultima-actualizacion').innerText = `⏱ Última actualización: ${hora}`;
    })
    .catch(error => console.error('Error cargando productos:', error));
}

function filtrarCategoria(categoria) {
  document.querySelectorAll('.product').forEach(producto => {
    const visible = (categoria === 'todos' || producto.classList.contains(categoria));
    producto.style.display = visible ? 'flex' : 'none';
  });
}

function filtrarSubgrupo(subgrupo) {
  document.querySelectorAll('.product').forEach(producto => {
    const sg = (producto.dataset.subgrupo || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '').toLowerCase();
    const visible = (subgrupo === 'todos' || sg === subgrupo);
    producto.style.display = visible ? 'flex' : 'none';
  });
}

cargarDesdeSheet();
setInterval(cargarDesdeSheet, 60000);

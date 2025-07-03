document.addEventListener("DOMContentLoaded", function () {
  // ==================== MENU LATERAL ====================
  const menuLeft = document.getElementById('menu-lateral');
  if(menuLeft) {
    const closeMenu = document.getElementById('closeMenuLeft');
    const menu = document.getElementById('menu');
    const htmlPage = document.querySelector('html');
    const bodyPage = document.querySelector('body');
    const overlay = document.createElement("div");
    
    closeMenu.addEventListener('click',() => {
      menuLeft.classList.remove("active");
      htmlPage.style.overflow = "auto";
      bodyPage.removeChild(overlay);
    });
    
    menu.addEventListener('click',() => {
      bodyPage.appendChild(overlay);
      htmlPage.style.overflow = "hidden";
      overlay.style.width = "100vw";
      overlay.style.opacity = "0.3";
      overlay.style.zIndex = "99";
      overlay.style.position = "fixed";
      overlay.style.top = "0";
      overlay.style.bottom = "0";
      overlay.style.height = "100vh";
      overlay.style.background = "black";
      menuLeft.classList.add("active");
    });
  }

  // ==================== CARRUSELES ====================
  var Landing = new Swiper("#bannerLanding", {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true,
    dots: true,
    autoplay: {
      delay: 5000,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });
  
  var transaccion = new Swiper(".bannerTransaccion", {
    slidesPerView: 1.3,
    spaceBetween: 10,
    loop: true,
    dots: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      640: {
        slidesPerView: 1.3,
        spaceBetween: 10,
      },
      768: {
        slidesPerView: 4,
        spaceBetween: 20,
        dots: false,
        loop: false,
      },
      1366: {
        slidesPerView: 5,
        spaceBetween: 20,
        dots: false,
      },
    },
  });

  // ==================== NAVEGACIÓN ENTRE SECCIONES ====================
  const btnHome = document.getElementById('btnHome');
  const btnCatalogo = document.getElementById('btnCatalogo');
  const homeSection = document.getElementById('home');
  const catalogoSection = document.getElementById('catalogo');
  const internaSection = document.getElementById('interna');
  const menuItems = document.querySelectorAll('.menu1 li');

  // Función para actualizar el menú activo
  function updateActiveMenu(activeId) {
    menuItems.forEach(item => {
      const link = item.querySelector('a');
      if (link && link.id === activeId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  // Función para mostrar sección
  function showSection(sectionToShow, sectionsToHide = []) {
    if (!Array.isArray(sectionsToHide)) {
      sectionsToHide = [sectionsToHide];
    }
    
    sectionsToHide.forEach(section => {
      if (section) section.classList.add('d-none');
    });
    
    sectionToShow.classList.remove('d-none');
    
    if (sectionToShow === homeSection) {
      updateActiveMenu('btnHome');
    } else if (sectionToShow === catalogoSection) {
      updateActiveMenu('btnCatalogo');
    }
  }

  // Event listeners para los botones del menú
  btnHome.addEventListener('click', function(e) {
    e.preventDefault();
    showSection(homeSection, [catalogoSection, internaSection]);
    if (menuLeft) menuLeft.classList.remove("active");
  });

  btnCatalogo.addEventListener('click', function(e) {
    e.preventDefault();
    showSection(catalogoSection, [homeSection, internaSection]);
    if (menuLeft) menuLeft.classList.remove("active");
  });

  // ==================== PÁGINA INTERNA DEL CATÁLOGO ====================
  const productos = {
    "producto1": {
      "nombre": "Madero de madera",
      "descripcion": "Camilo es una loca y la mala me le voy a robar a el mono cuando me vaya",
      "imagenes": [
        "https://picsum.photos/id/237/435/225",
        "https://picsum.photos/id/238/435/225",
        "https://picsum.photos/id/239/435/225"
      ],
      "categoria": "Cine",
    },
    "producto2": {
      "nombre": "Bono de Comida",
      "descripcion": "Descripción del bono de comida...",
      "imagenes": [
        "https://picsum.photos/id/240/435/225"
      ],
      "categoria": "Restaurantes",
    }
  };

  const cards = document.querySelectorAll('.card-puntos');
  const internaTitle = document.querySelector('#interna .title');
  const internaDesc = document.querySelector('#text');
  const internaImg = document.querySelector('#interna .img-content img');
  const internaCategoria = document.querySelector('#interna .img p');

  // Carrusel de imágenes para la interna
  function initImageCarousel(images) {
    const imgContainer = document.querySelector('#interna .img-content');
    imgContainer.innerHTML = '';
    
    if (images.length > 1) {
      imgContainer.innerHTML = `
        <div class="swiper internaSwiper">
          <div class="swiper-wrapper">
            ${images.map(img => `
              <div class="swiper-slide">
                <img src="${img}" class="img-fluid" alt="">
              </div>
            `).join('')}
          </div>
          <div class="swiper-pagination"></div>
        </div>
      `;
      
      new Swiper('.internaSwiper', {
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      });
    } else {
      imgContainer.innerHTML = `<img src="${images[0]}" class="img-fluid" alt="">`;
    }
  }

  // Función para cargar datos en la interna
  function cargarInterna(productoId) {
    const producto = productos[productoId];
    
    internaTitle.textContent = producto.nombre;
    internaDesc.textContent = producto.descripcion;
    internaCategoria.textContent = producto.categoria;
    
    initImageCarousel(producto.imagenes);
    
    showSection(internaSection, [homeSection, catalogoSection]);
    
    // Inicializar botones de contacto después de cargar la interna
    setTimeout(setupContactButtons, 100);
  }

  // Event listeners para las cards del catálogo
  cards.forEach(card => {
    card.addEventListener('click', function(e) {
      if (e.target.tagName === 'A') return;
      
      const cardId = this.closest('[data-producto]')?.getAttribute('data-producto');
      if (cardId && productos[cardId]) {
        cargarInterna(cardId);
      }
    });
  });

  // ==================== NAVEGACIÓN MIGA DE PAN ====================
  function setupBreadcrumbNavigation() {
    document.querySelectorAll('.miga a').forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = this.getAttribute('href');
        
        if (target === '/' || target === '#home') {
          showSection(homeSection, [catalogoSection, internaSection]);
        } 
        else if (target === '#catalogo') {
          showSection(catalogoSection, [homeSection, internaSection]);
        }
        
        if (menuLeft) menuLeft.classList.remove("active");
      });
    });
  }

  setupBreadcrumbNavigation();
  
  // ==================== BOTONES DE CONTACTO MEJORADOS ====================
  function setupContactButtons() {
    const btnInstagram = document.getElementById('btnInstagram');
    const btnWhatsApp = document.getElementById('btnWhatsApp');
    
    // Configuración - ¡REEMPLAZA ESTOS VALORES!
    const config = {
      instagramUser: 'tucuenta', // Sin @
      whatsappNumber: '573157732799' // Con código de país
    };

    if (!btnInstagram || !btnWhatsApp) {
      console.error('Botones de contacto no encontrados');
      return;
    }

    // Función para verificar selección
    function checkSelection() {
      const tallaSelected = document.querySelector('input[name="talla"]:checked');
      const moldeSelected = document.querySelector('input[name="molde"]:checked');
      const isComplete = tallaSelected && moldeSelected;
      
      btnInstagram.disabled = !isComplete;
      btnWhatsApp.disabled = !isComplete;
      
      return isComplete;
    }

    // Eventos para radios
    document.querySelectorAll('input[name="talla"], input[name="molde"]').forEach(radio => {
      radio.addEventListener('change', checkSelection);
    });

    // Configurar Instagram
    btnInstagram.addEventListener('click', function(e) {
      e.preventDefault();
      
      if (!checkSelection()) {
        alert('Por favor selecciona talla y molde antes de contactar');
        return;
      }
      
      const productName = internaTitle.textContent;
      const talla = document.querySelector('input[name="talla"]:checked').value;
      const molde = document.querySelector('input[name="molde"]:checked').value;
      
      const message = `¡Hola @${config.instagramUser}! Estoy interesado en:%0A%0A` +
                     `📌 *${productName}*%0A` +
                     `🔹 Talla: ${talla}%0A` +
                     `🔹 Molde: ${molde}%0A%0A` +
                     `¿Podrías darme más información?`;
      
      const url = `https://www.instagram.com/direct/new/?text=${encodeURIComponent(message)}&recipient_username=${config.instagramUser}`;
      window.open(url, '_blank');
    });

    // Configurar WhatsApp
    btnWhatsApp.addEventListener('click', function(e) {
      e.preventDefault();
      
      if (!checkSelection()) {
        alert('Por favor selecciona talla y molde antes de contactar');
        return;
      }
      
      const productName = internaTitle.textContent;
      const talla = document.querySelector('input[name="talla"]:checked').value;
      const molde = document.querySelector('input[name="molde"]:checked').value;
      
      const message = `¡Hola! Estoy interesado en:%0A%0A` +
                     `📌 *${productName}*%0A` +
                     `🔹 Talla: ${talla}%0A` +
                     `🔹 Molde: ${molde}%0A%0A` +
                     `¿Podrías darme más información?`;
      
      const url = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    });

    // Estado inicial
    checkSelection();
  }
});
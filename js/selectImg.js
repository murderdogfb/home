window.addEventListener('DOMContentLoaded', event => {

  // Obtener referencias a los elementos clave una vez
  const bannerDesktopInput = document.getElementById("bannerDesktop");
  const previewDesktopDiv = document.getElementById("previewDesktop");
  const resetBannerDesktopButton = document.getElementById("resetBannerDesktop"); // Asegúrate de que este ID coincida con tu botón HTML

  // Ocultar el botón de reset al inicio (si no está oculto por CSS)
  if (resetBannerDesktopButton) {
    resetBannerDesktopButton.style.display = 'none';
  }

  // Función para mostrar la vista previa de una imagen
  function previewImage() { // Ya no necesitamos los parámetros inputId y previewId porque usamos las referencias directas
    const file = bannerDesktopInput.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        previewDesktopDiv.style.backgroundImage = `url('${e.target.result}')`;
        previewDesktopDiv.style.backgroundSize = "cover";
        previewDesktopDiv.style.backgroundPosition = "center";
        // Mostrar el botón de reset cuando hay una imagen
        if (resetBannerDesktopButton) {
          resetBannerDesktopButton.style.display = 'block'; // O 'inline-block', dependiendo de tu diseño
        }
      };
      reader.readAsDataURL(file);
    } else {
      // Si no hay archivo seleccionado (ej. al cancelar la selección del archivo)
      previewDesktopDiv.style.backgroundImage = "none";
      // Ocultar el botón si no hay imagen
      if (resetBannerDesktopButton) {
        resetBannerDesktopButton.style.display = 'none';
      }
    }
  }

  // Función para resetear la previsualización
  function resetPreview() { // Ya no necesitamos los parámetros inputId y previewId
    if (bannerDesktopInput) {
      bannerDesktopInput.value = ''; // Limpia el valor del input tipo file
    }
    if (previewDesktopDiv) {
      previewDesktopDiv.style.backgroundImage = "none"; // Elimina la imagen de fondo
    }
    // Ocultar el botón de reset después de resetear
    if (resetBannerDesktopButton) {
      resetBannerDesktopButton.style.display = 'none';
    }
  }

  // --- Asignar Event Listeners ---

  // Para el input de archivo
  if (bannerDesktopInput) {
    bannerDesktopInput.addEventListener("change", previewImage);
  }

  // Para el botón de reset
  if (resetBannerDesktopButton) {
    resetBannerDesktopButton.addEventListener("click", resetPreview);
  }



  const modalFoto = document.getElementById("foto"); // El ID de tu modal

  // Solo ejecuta el script si el modal existe en la página
  if (modalFoto) {
    const introScreen = modalFoto.querySelector(".intro");
    const paso1Screen = modalFoto.querySelector(".paso1");
    const paso2Screen = modalFoto.querySelector(".paso2");
    const paso3Screen = modalFoto.querySelector(".paso3");

    const iniciarBtn = document.getElementById("iniciar");
    const bannerDesktopInput = document.getElementById("bannerDesktop");
    const retoFotoBtn = document.getElementById("retoFoto");
    const textPreview = paso1Screen.querySelector(".text-preview"); // La etiqueta p que muestra "Subir foto"

    // --- Funciones auxiliares para mostrar/ocultar pasos ---
    function showStep(stepElement) {
      // Oculta todos los pasos y luego muestra el deseado
      [introScreen, paso1Screen, paso2Screen, paso3Screen].forEach(el => {
        if (el) el.classList.add("d-none");
      });
      if (stepElement) stepElement.classList.remove("d-none");
    }

    // --- Manejo inicial: Muestra el paso 'intro' al abrir el modal ---
    // (Asegúrate de que tu modal no tenga 'd-none' en el '.intro' al inicio, o puedes añadirlo aquí)
    // Inicialmente muestra el intro, si no quieres que se vea al inicio, el 'intro' debe tener 'd-none' en el HTML
    // Si usas Bootstrap, el modal ya se gestiona con sus propias clases d-none/show
    // Esta parte asegura que el '.intro' esté visible si el modal se abre por primera vez.
    if (introScreen) {
        // Asegúrate de que el intro es lo primero que se ve al abrir el modal
        modalFoto.addEventListener('shown.bs.modal', function () {
            showStep(introScreen);
        });
    }


    // --- Lógica del botón "Iniciar" ---
    if (iniciarBtn) {
      iniciarBtn.addEventListener("click", function() {
        showStep(paso1Screen);
        // Deshabilita el botón de reto por defecto
        if (retoFotoBtn) {
          retoFotoBtn.classList.add("disabled");
        }
      });
    }

    // --- Lógica para habilitar/deshabilitar botón "Enviar reto" y gestionar preview de imagen ---
    if (bannerDesktopInput && retoFotoBtn && textPreview) {
      bannerDesktopInput.addEventListener("change", function() {
        const file = this.files[0];
        const previewDesktop = document.getElementById("previewDesktop");

        if (file) {
          // Si hay un archivo, habilita el botón y oculta el texto
          retoFotoBtn.classList.remove("disabled");
          textPreview.classList.add("d-none");

          // Muestra la vista previa de la imagen
          if (previewDesktop) {
            const reader = new FileReader();
            reader.onload = (e) => {
              previewDesktop.style.backgroundImage = `url('${e.target.result}')`;
              previewDesktop.style.backgroundSize = "cover";
              previewDesktop.style.backgroundRepeat = "no-repeat";
              previewDesktop.style.backgroundPosition = "center";
            };
            reader.readAsDataURL(file);
          }
        } else {
          // Si no hay archivo, deshabilita el botón y muestra el texto
          retoFotoBtn.classList.add("disabled");
          textPreview.classList.remove("d-none");
          if (previewDesktop) {
            previewDesktop.style.backgroundImage = "none"; // Elimina la imagen si se cancela
          }
        }
      });
    }

    // --- Lógica para el botón "Enviar reto" (pasar a paso2) ---
    if (retoFotoBtn) {
        retoFotoBtn.addEventListener("click", function() {
            // Solo avanza si el botón NO está deshabilitado
            if (!this.classList.contains("disabled")) {
                showStep(paso2Screen);

                // Opcional: Aquí puedes añadir un temporizador para pasar del paso 2 al paso 3
                // Por ejemplo, después de 3 segundos
                setTimeout(() => {
                    showStep(paso3Screen);
                }, 3000); // Cambia 3000 por el tiempo en milisegundos que desees
            }
        });
    }

    // --- Lógica para el botón "Entendido" (del paso 3, para cerrar el modal o ir a otro lado) ---
    const entendidoBtn = modalFoto.querySelector(".paso3 .btn-primario");
    if (entendidoBtn) {
        entendidoBtn.addEventListener("click", function() {
            // Cierra el modal de Bootstrap
            const modalInstance = bootstrap.Modal.getInstance(modalFoto);
            if (modalInstance) {
                modalInstance.hide();
            }
            // Opcional: Podrías resetear el modal a su estado inicial aquí si lo vas a reabrir
            // Por ejemplo: showStep(introScreen);
        });
    }

    // --- Lógica para el botón "Eliminar" (resetea la imagen y el botón de reto) ---
    const resetBannerDesktopBtn = document.getElementById("resetBannerDesktop");
    if (resetBannerDesktopBtn && bannerDesktopInput && retoFotoBtn && textPreview) {
      resetBannerDesktopBtn.addEventListener("click", function() {
        bannerDesktopInput.value = ""; // Limpia el input de tipo file
        const previewDesktop = document.getElementById("previewDesktop");
        if (previewDesktop) {
          previewDesktop.style.backgroundImage = "none"; // Elimina la imagen de fondo
        }
        textPreview.classList.remove("d-none"); // Muestra el texto "Subir foto"
        retoFotoBtn.classList.add("disabled"); // Deshabilita el botón de enviar
      });
    }

    // --- Integración con la animación del spinner ---
    // Asegúrate de que el CSS para la animación 'spin' esté definido en tu archivo CSS.
    // Lo único que necesitarías aquí es que el SVG ya tenga la clase 'loader-icon'
    // como lo tienes en tu HTML para que el CSS actúe sobre él.

  } else {
    console.warn("Modal con ID 'foto' no encontrado. El script de lógica del modal no se inicializará.");
  }

});
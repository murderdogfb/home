document.addEventListener('DOMContentLoaded', () => {
  const modalSopa = document.getElementById('sopa'); // Asume que tu modal de sopa de letras tiene el ID 'sopa'

  // Solo ejecuta el script si el modal de la sopa de letras existe
  if (!modalSopa) {
    console.warn("Modal con ID 'sopa' no encontrado. El script de la sopa de letras no se inicializará.");
    return;
  }

  // --- Elementos del modal para el flujo de pasos ---
  const introSopaScreen = modalSopa.querySelector(".intro-sopa"); // Asume que tienes un div .intro-sopa
  const pasoSopa1Screen = modalSopa.querySelector(".paso-sopa-1"); // Asume que tu sopa de letras está en .paso-sopa-1
  const pasoSopa2Screen = modalSopa.querySelector(".paso-sopa-2"); // Para el estado de "enviando"
  const pasoSopa3Screen = modalSopa.querySelector(".paso-sopa-3"); // Para el estado de "reto enviado"

  const inicioSopaBtn = document.getElementById("inicioSopa");
  const enviarSopaBtn = document.getElementById("enviarSopa"); // El botón que se habilitará

  // --- Funciones auxiliares para mostrar/ocultar pasos ---
  function showSopaStep(stepElement) {
    // Oculta todos los pasos posibles del modal de sopa de letras
    [introSopaScreen, pasoSopa1Screen, pasoSopa2Screen, pasoSopa3Screen].forEach(el => {
      if (el) el.classList.add("d-none");
    });
    // Muestra el paso deseado
    if (stepElement) stepElement.classList.remove("d-none");
  }

  // --- Lógica de la Sopa de Letras ---
  const container = document.querySelector('#word-search-container');
  // Si por alguna razón el contenedor de la sopa no está dentro del modal o no existe, salimos
  if (!container) {
    console.error("Contenedor de la sopa de letras (#word-search-container) no encontrado.");
    return;
  }

  const words = ['HTML', 'CSS', 'JAVASCRIPT'];
  const gridSize = 10;
  const grid = document.querySelector('#grid');
  const wordList = document.querySelector('#word-list');
  const cells = [];
  const placedWords = [];
  let foundWordsCount = 0; // Contador para las palabras encontradas

  function createGrid() {
    grid.innerHTML = '';
    cells.length = 0;
    for (let i = 0; i < gridSize * gridSize; i++) {
      const cell = document.createElement('div');
      cell.dataset.index = i;
      cells.push(cell);
      grid.appendChild(cell);
    }
  }

  function placeWords() {
    placedWords.length = 0;

    for (const word of words) {
      let placed = false;
      while (!placed) {
        const dir = Math.random() > 0.5 ? 'H' : 'V';
        const startRow = Math.floor(Math.random() * (gridSize - (dir === 'V' ? word.length : 0)));
        const startCol = Math.floor(Math.random() * (gridSize - (dir === 'H' ? word.length : 0)));
        let indexes = [];

        for (let i = 0; i < word.length; i++) {
          const row = startRow + (dir === 'V' ? i : 0);
          const col = startCol + (dir === 'H' ? i : 0);
          const index = row * gridSize + col;
          const existing = cells[index].textContent;
          if (existing && existing !== word[i]) {
            indexes = [];
            break;
          }
          indexes.push(index);
        }

        if (indexes.length === word.length) {
          indexes.forEach((i, idx) => cells[i].textContent = word[idx]);
          placedWords.push({ word, indexes, found: false }); // Agrega un estado 'found'
          placed = true;
        }
      }
    }

    // Rellenar celdas vacías
    for (const cell of cells) {
      if (!cell.textContent) {
        cell.textContent = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      }
    }
  }

  function renderWordList() {
    wordList.innerHTML = '';
    for (const { word, found } of placedWords) {
      const li = document.createElement('li');
      li.textContent = word;
      li.dataset.word = word;
      if (found) { // Marca las palabras ya encontradas si recargas la lista
        li.classList.add('active');
      }
      wordList.appendChild(li);
    }
  }

  let selected = [];

  function handleStart(e) {
    // Solo permitir seleccionar si estamos en el paso de la sopa (pasoSopa1Screen)
    if (!pasoSopa1Screen || pasoSopa1Screen.classList.contains('d-none')) {
      return;
    }
    clearSelection();
    selectCell(e);
  }

  function handleMove(e) {
    // Solo permitir mover si estamos en el paso de la sopa (pasoSopa1Screen)
    if (!pasoSopa1Screen || pasoSopa1Screen.classList.contains('d-none')) {
      return;
    }
    selectCell(e);
  }

  function handleEnd() {
    // Solo permitir finalizar selección si estamos en el paso de la sopa (pasoSopa1Screen)
    if (!pasoSopa1Screen || pasoSopa1Screen.classList.contains('d-none')) {
      clearSelection();
      return;
    }

    const selectedWord = selected.map(cell => cell.textContent).join('');
    // Busca la palabra en ambas direcciones (normal y reversa)
    const match = placedWords.find(w =>
      (w.word === selectedWord || w.word === selectedWord.split('').reverse().join('')) && !w.found
    );

    if (match) {
      match.indexes.forEach(i => cells[i].classList.add('found'));
      const listItem = wordList.querySelector(`li[data-word="${match.word}"]`);
      if (listItem) listItem.classList.add('active');
      match.found = true; // Marca la palabra como encontrada
      foundWordsCount++;

      // --- Lógica para habilitar el botón "Enviar reto" ---
      if (foundWordsCount === words.length && enviarSopaBtn) {
        enviarSopaBtn.classList.remove('disabled'); // Habilita el botón
      }
    }

    clearSelection();
  }

  function selectCell(e) {
    let target;
    if (e.touches) {
      const touch = e.touches[0];
      target = document.elementFromPoint(touch.clientX, touch.clientY);
    } else {
      target = e.target;
    }

    if (target && target.parentElement === grid && !selected.includes(target)) {
      target.classList.add('selected');
      selected.push(target);
    }
  }

  function clearSelection() {
    selected.forEach(cell => cell.classList.remove('selected'));
    selected = [];
  }

  function setupEvents() {
    grid.addEventListener('mousedown', handleStart);
    grid.addEventListener('mousemove', (e) => e.buttons && handleMove(e));
    document.addEventListener('mouseup', handleEnd);

    grid.addEventListener('touchstart', handleStart);
    grid.addEventListener('touchmove', handleMove);
    grid.addEventListener('touchend', handleEnd);
  }

  // --- Lógica de inicialización y flujo del modal ---
  function initSopaModal() {
    // Al abrir el modal, asegúrate de que el intro sea visible
    modalSopa.addEventListener('shown.bs.modal', function() {
      // Reinicia el estado de la sopa y los botones cada vez que se abre el modal
      foundWordsCount = 0;
      if (enviarSopaBtn) enviarSopaBtn.classList.add('disabled');
      placedWords.forEach(w => w.found = false); // Reinicia el estado 'found' de las palabras
      createGrid(); // Regenera la cuadrícula
      placeWords(); // Coloca las palabras de nuevo
      renderWordList(); // Renderiza la lista de palabras (sin activar)
      setupEvents(); // Reestablece los eventos

      showSopaStep(introSopaScreen); // Muestra el intro
    });

    // Lógica para el botón "Inicio Sopa"
    if (inicioSopaBtn) {
      inicioSopaBtn.addEventListener('click', () => {
        showSopaStep(pasoSopa1Screen); // Muestra la sopa de letras
        // La sopa ya estará inicializada gracias al 'shown.bs.modal'

      });
    }

    // Lógica para el botón "Enviar Sopa"
    if (enviarSopaBtn) {
      enviarSopaBtn.addEventListener('click', () => {
        if (!enviarSopaBtn.classList.contains('disabled')) {
          showSopaStep(pasoSopa2Screen); // Muestra el paso de "enviando"
        }
      });
    }

    // Lógica para el botón "Entendido" del paso 3 (cerrar modal)
    const entendidoSopaBtn = modalSopa.querySelector('.pasoSopa3 .btn-primario');
    if (entendidoSopaBtn) {
      entendidoSopaBtn.addEventListener('click', () => {
        const modalInstance = bootstrap.Modal.getInstance(modalSopa);
        if (modalInstance) {
          modalInstance.hide();
        }
        // Puedes reiniciar el modal a su estado inicial aquí si lo deseas
        // showSopaStep(introSopaScreen);
      });
    }
  }

  // Inicializa el flujo del modal de la sopa de letras
  initSopaModal();
});
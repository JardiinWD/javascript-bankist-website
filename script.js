'use strict';

///////////////////////////////////////
// Modal window

//#region Variables
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
// Button per lo scroll
const btnScrollTo = document.querySelector('.btn--scroll-to')
// Sezione 1
const section1 = document.querySelector('#section--1')
const h1 = document.querySelector('h1')

//#endregion

//#region Functions
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function (e) {
  e.preventDefault();
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
//#endregion

//#region Events
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal))
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

// Scroll al click su Learn More
btnScrollTo.addEventListener('click', function (e) {
  e.preventDefault() // Prevengo il refresh
  // console.log(section1, btnScrollTo);
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);
  // console.log(e.target.getBoundingClientRect());
  console.log("Scroll Corrente (X/Y)", window.pageXOffset, pageYOffset);
  // Verifica delle coordinate della Viewport (larghezza Altezza)
  console.log("Altezza/Larghezza Viewport", document.documentElement.clientHeight, document.documentElement.clientWidth);

  // Scrolling alla sezione richiesta (oldschool)
  // Alle coordinate della sezione 1 devo aggiungere anche quelle della viewport
  // proprio per dargli il calcolo, non relativo alla cima della section ma a tutto
  // il corpo dell'HTML. A prescindere da che parte clicco ora mi darà sempre
  // la partenza corretta dalla cima.
  /*   
    window.scrollTo({
    left: s1coords.left + window.pageXOffset,
    top: s1coords.top + window.pageYOffset,
    behavior: 'smooth'
  }) 
  */

  // Scroll definitivo senza calcoli e moderno 
  section1.scrollIntoView({ behavior: 'smooth' })
});

// Scroll fluido verso le sezioni (Sui singoli Link)
/* document.querySelectorAll('.nav__link').forEach((el) => {
  // Seleziono i singoli link
  el.addEventListener('click', (e) => {
    // Prevengo il default
    e.preventDefault()
    // Prendo l'attributo href
    const id = el.getAttribute('href');
    console.log(`Questo è l'href sulla quale stai cliccando : ${id}`);
    // Scroll fluido nella sezione indicata nell'ID
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' })
  })
}) */

// Scroll fluido verso le sezioni (Sul Genitore)
document.querySelector('.nav__links').addEventListener('click', (e) => {
  // console.log(e.target);
  if (e.target.classList.contains('nav__link')) {
    e.preventDefault()
    // Prendo l'attributo href dal target
    const id = e.target.getAttribute('href');
    // Attivo lo scroll sui singoli Children
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' })
    // console.log(`Questo è l'href sulla quale stai cliccando : ${id}`);
  }
})

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//#endregion 

//#region Trash
/* h1.addEventListener('mouseenter', (e) => {
  e.preventDefault()
  // Verifica
  alert("addEventListener : Ottimo, stai leggendo l'H1")
})

h1.onmouseenter = (e) => {
  e.preventDefault()
  // Verifica
  alert("OnMouseEnter : Ottimo, stai leggendo l'H1 con On Mouse Enter")
} */

//#endregion 
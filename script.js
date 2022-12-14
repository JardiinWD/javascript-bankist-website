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
const tabs = document.querySelectorAll('.operations__tab')
const tabsContainer = document.querySelector('.operations__tab-container')
const tabsContent = document.querySelectorAll('.operations__content')
const nav = document.querySelector('.nav')
const allSections = document.querySelectorAll('.section')
const slides = document.querySelectorAll('.slide')
// Variabile iniziale
let currentSlide = 0;
// Fermo dello slider
const maxSlide = slides.length
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
  // il corpo dell'HTML. A prescindere da che parte clicco ora mi dar?? sempre
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
    console.log(`Questo ?? l'href sulla quale stai cliccando : ${id}`);
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
    // console.log(`Questo ?? l'href sulla quale stai cliccando : ${id}`);
  }
})

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//#endregion 

//#region Tabbed component

tabsContainer.addEventListener('click', (e) => {
  // closest in modo che clicchi sempre sul button principale
  // Anche se cliccassi sullo span 1/2/3
  const clicked = e.target.closest('.operations__tab')
  // console.log(clicked);
  // Ignorare i click dove il result ?? none
  // Per evitare l'errore
  if (!clicked) return
  // Rimuovo la classe active da tutti
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'))
  // Per aggiungerla solo su quello cliccato
  clicked.classList.add('operations__tab--active')

  // Rimuovo la classe attiva dalla visualizzazione del precedente
  tabsContent.forEach(tab => tab.classList.remove('operations__content--active'))
  // Aggiungere la visualizzazione dell'area del contenuto a quella cliccata
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active')
})

//#endregion

//#region Menu Fade Animation

// Funzione per mouseover
const handleHover = (e, opacity) => {
  if (e.target.classList.contains('nav__link')) {
    // Lascio il target a una costante
    const link = e.target;
    // Cerco i figli diretti
    const siblings = link.closest('.nav').querySelectorAll('.nav__link')
    // Cerco il logo
    const logo = link.closest('.nav').querySelector('img')

    // Avvio ciclo sui link all'over cambio di opacit??
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = opacity
    })
    logo.style.opacity = opacity
  }
}

// Metodo 1 (Valido ma da migliorare)
nav.addEventListener('mouseover', (e) => handleHover(e, 0.5))
nav.addEventListener('mouseout', (e) => handleHover(e, 1))
// Metodo 2 (Il meglio, usato con bind ma non funziona : / (cambia opacity con this))
// nav.addEventListener('mouseover', handleHover.bind(0.5))
// nav.addEventListener('mouseout', handleHover.bind(1))

//#endregion

//#region Sticky Navigation

// console.log(initialCords);
const header = document.querySelector('.header')
// Prendo la propriet?? di altezza della navbar per
// aggiungere il rootMargin
const navHeight = nav.getBoundingClientRect().height

const stickyNav = (entries) => {
  // Avvio un destructuring su Entries
  const [entry] = entries
  // console.log(entry);
  if (!entry.isIntersecting) nav.classList.add('sticky')
  else nav.classList.remove('sticky')
}

const stickyObject = {
  root: null,
  threshold: 0,
  // Ora altezza ?? dinamica
  rootMargin: `-${navHeight}px`
}

// Questo ?? l'API observer
const headerObserver = new IntersectionObserver(stickyNav, stickyObject)
// Questo ?? il metodo observer applicato all'header
headerObserver.observe(header)

//#endregion

//#region Reveal Sections

// Seleziono tutte le sezioni
const revealSection = (entries, observer) => {
  const [entry] = entries
  // Verifica di Entry
  // console.log(entry);
  // Se non ci sono gi?? passato sopra un return vuoto
  if (!entry.isIntersecting) return
  // Altrimenti gli rimuovo la classe hidden
  entry.target.classList.remove('section--hidden')
  // Quando non le vedo le sezioni non vergono pi?? osservate
  // Migliorano le performance
  observer.unobserve(entry.target)
}

const revealSectionObj = {
  root: null,
  threshold: 0.15
}

const sectionObserver = new IntersectionObserver(revealSection, revealSectionObj)
// Looping in tutte le sezioni
allSections.forEach((section) => {
  sectionObserver.observe(section)
  // Inizialmente sono tutte nascoste da JS
  section.classList.add('section--hidden')
})

//#endregion 

//#region Lazy Loading Images
// Seleziono tutte le immagini con attributi [data-src]
const imgTargets = document.querySelectorAll('img[data-src]')
console.log(imgTargets);

// Funzione Callback
const loadImg = (entries, observer) => {
  // Eseguo destructuring
  const [entry] = entries
  // console.log(entry);
  if (!entry.isIntersecting) return

  // Cambio del src immagine con data-src
  entry.target.src = entry.target.dataset.src
  // Scateno un evento al load
  entry.target.addEventListener('load', () => {
    // Rimuovo la classe lazy img
    entry.target.classList.remove('lazy-img')
  })
  // Blocco l'observer
  observer.unobserve(entry.target)
}

// Oggetto dell'observer
const loadImgObj = {
  root: null,
  threshold: 0,
  rootMargin: '200px'
}
// Creo un observer
const imgObserver = new IntersectionObserver(loadImg, loadImgObj)
// Eseguo loop su ogni singola immagine
imgTargets.forEach(img => imgObserver.observe(img))


//#endregion

//#region Slider

// Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();

    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();

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

// Downwards
// console.log(h1.childNodes);
// console.log(h1.childNodes);
// console.log(h1.childNodes[0].textContent);
// Upwards
// console.log(h1.parentNode); // Prende il div
// console.log(h1.parentElement); // Prende il div
// Elemento pi?? vicino
// h1.closest('div').style.background = 'purple'
// console.log(h1.children);
// Primo span che trova
// 1.firstElementChild.style.color = 'white'
// Ultimo span che trova
// h1.lastElementChild.style.color = 'purple'

//#endregion 

//#region DOM Event
document.addEventListener('DOMContentLoaded', (e) => {
  console.log("HTML caricato tramite DOMContentLoaded", e);
})

window.addEventListener('load', (e) => {
  console.log("HTML caricato tramite Load", e);
})

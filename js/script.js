window.onscroll = onWindowScroll;

function mostrarOcultarModalSubirFotos(){
    const modalSubirFotosEl = document.querySelector('#modal-subir-fotos');
    modalSubirFotosEl.classList.toggle('escondido');
}

function onWindowScroll(){
    const headerEl = document.querySelector('.header.header');
    const headerAndNavEl = document.querySelector('.header-and-nav');
    const height = Number.parseFloat(window.getComputedStyle(headerEl, null).getPropertyValue('height'));
    if( window.scrollY > height && !headerAndNavEl.classList.contains('fixed') ){
        headerAndNavEl.classList.add('fixed');
    } else if( window.scrollY < height && headerAndNavEl.classList.contains('fixed') ){
        headerAndNavEl.classList.remove('fixed');
    }
}
const numFotos = 20;
let offsetFotos = 0;

cargarMensajesRecibidosSubidaFotos();
cargarFotos();

function cargarFotos(){
    obtenerFotosHttpCall(offsetFotos, numFotos, insertarFotosEnHtml);
    offsetFotos += numFotos;
}

function obtenerFotosHttpCall( offset, numFotos, callback ){
    const request = new XMLHttpRequest();
    request.open('POST', 'fotos_json.php');
    request.onreadystatechange = () => {
        if( request.readyState ===  4 && request.status === 200 ){
            const json = JSON.parse(request.response);
            callback(json);
        }
    };
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    request.send(`offset=${offset}&num_fotos=${numFotos}`);
}

function insertarFotosEnHtml(fotosArr){
    const wrapperEl = document.getElementsByTagName('main')[0];
    const botonCargarMasWrapperEl = document.createElement('div');
    botonCargarMasWrapperEl.classList.add('btn-cargar-mas-wrapper');
    if( fotosArr && fotosArr.length > 0 ){
        let ulFotosEl = document.querySelector('.fotosgrid');
        const ulFotosElExistia = !!ulFotosEl;
        if( ulFotosElExistia ){
            // Eliminar el ultimo elemento que añadimos al final (el "li" vacío)
            ulFotosEl.children.item( ulFotosEl.children.length-1 ).remove();
            // Eliminar el botón de "Cargar más"
            document.querySelectorAll('.btn-cargar-mas-wrapper').forEach( elem => elem.remove() );
        }
        else{
            ulFotosEl = document.createElement('ul');
            ulFotosEl.classList.add('fotosgrid');
            wrapperEl.appendChild(ulFotosEl);
        }
        for( const foto of fotosArr ){
            const fotoLiEl = document.createElement('li');
            fotoLiEl.classList.add('fotosgrid__foto');
            ulFotosEl.appendChild(fotoLiEl);
            const imgEl = document.createElement('img');
            imgEl.loading = 'lazy';
            imgEl.src = foto;
            imgEl.addEventListener( 'click', mostrarMenuOpcionesImagen );
            fotoLiEl.appendChild(imgEl);
        }
        const ultimoLiEl = document.createElement('li');
        ultimoLiEl.classList.add('fotosgrid__foto');
        ulFotosEl.appendChild(ultimoLiEl);
        botonCargarMasWrapperEl.innerHTML = `
        <button class="btn" onclick="cargarFotos()">Cargar más</button>
        `;
    } else{
        // Eliminar el botón de "Cargar más"
        document.querySelectorAll('.btn-cargar-mas-wrapper').forEach( elem => elem.remove() );
        botonCargarMasWrapperEl.innerText = 'No hay más fotos que cargar.';
    }
    wrapperEl.appendChild(botonCargarMasWrapperEl);
}

function cargarMensajesRecibidosSubidaFotos(){
    const fotosSubidasExito = Number.parseInt( obtenerCookie('fotos_subidas_exito') );
    if( fotosSubidasExito > 0 ){
        insertarMensajeExitoHtml( `Has subido ${fotosSubidasExito} fotos con éxito.` );
        setCookie( 'fotos_subidas_exito', fotosSubidasExito, -60 ); // Eliminar la cookie
    }
    let erroresSubida = obtenerCookie('errores_subida');
    if( erroresSubida ){
        const erroresSubidaJson = JSON.parse(erroresSubida);;
        insertarErroresEnHtml( erroresSubidaJson );
        setCookie( 'errores_subida', erroresSubida, -60 );
    }
}

function obtenerCookie(nombreCookie){
    if( document.cookie ){
        const decodedCookies = decodeURI(document.cookie);
        const urlSearchParamsCookies = new URLSearchParams( decodedCookies );
        const cookieVal = urlSearchParamsCookies.get(nombreCookie);
        return cookieVal;
    }
    return null;
}

function setCookie( nombreCookie, valorCookie, segs ){
    const d = new Date();
    d.setTime( d.getTime() + segs );
    const expira = `expires=${d.toUTCString()}`;
    document.cookie = `${nombreCookie}=${valorCookie};${expira}`;
}

function insertarMensajeExitoHtml(mensaje){
    const divExito = document.createElement('div');
    divExito.classList.add('fotos-subidas-exito');
    divExito.innerText = mensaje;
    const cerrarEl = document.createElement('div');
    cerrarEl.classList.add('boton-borrar-elemento');
    divExito.appendChild(cerrarEl);
    const mainEl = document.getElementsByTagName('main')[0];
    mainEl.insertBefore( divExito, mainEl.childNodes[0] );
}

function insertarMensajeErrorHtml(mensajeError, erroresEl){
    const divError = document.createElement('div');
    divError.classList.add('error');
    divError.innerText = mensajeError;
    const cerrarEl = document.createElement('div');
    cerrarEl.classList.add('boton-borrar-elemento');
    divError.appendChild(cerrarEl);
    erroresEl.appendChild(divError);
}

function insertarErroresEnHtml( erroresArr ){
    let erroresEl;
    if( erroresArr instanceof Array && erroresArr.length > 0 ){
        erroresEl = document.createElement('div');
        erroresEl.classList.add('errores');
        const mainEl = document.getElementsByTagName('main')[0];
        mainEl.insertBefore( erroresEl, mainEl.childNodes[0] );
    }
    for( const error of erroresArr ){
        insertarMensajeErrorHtml( error.error, erroresEl );
    }
}

function mostrarMenuOpcionesImagen(e){
    const imgSrc = e.target.getAttribute('src');
    const menuOpcionesImagenEl = document.getElementById('menu-opciones-imagen');
    menuOpcionesImagenEl.classList.remove('escondido');
    menuOpcionesImagenEl.setAttribute('data-menu-opciones-imagen-src', imgSrc);
    
}

function borrarFoto(){
    const menuOpcionesImaenEl = document.getElementById('menu-opciones-imagen');
    const imgSrcEl = document.querySelector('[data-menu-opciones-imagen-src]');
    const imgSrc = imgSrcEl.getAttribute('data-menu-opciones-imagen-src');
    borrarFotoHttpCall( imgSrc, (res) => {
        if( res.error ){
            console.log(res.error);
            insertarErroresEnHtml( [...res.error] );
        } else{
            insertarMensajeExitoHtml( res.mensaje );
            buscarImgElConSrc( imgSrc ).parentElement.remove();
        }
        menuOpcionesImaenEl.classList.add('escondido');
    });
}

function borrarFotoHttpCall(fotoPath, callback){
    const request = new XMLHttpRequest();
    request.open( 'GET', `borrar_foto.php?foto=${fotoPath}` );
    request.onreadystatechange = () => {
        if( request.readyState === 4 && request.status === 200 ){
            const json = JSON.parse( request.response );
            callback( json );
        }
    };
    request.send();
}

function buscarImgElConSrc( src ){
    return document.querySelector(`[src="${src}"]`);
}
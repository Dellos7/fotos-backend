const numFotos = 20;
let offsetFotos = 0;

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
    const bodyEl = document.body;
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
            bodyEl.appendChild(ulFotosEl);
        }
        for( const foto of fotosArr ){
            const fotoLiEl = document.createElement('li');
            fotoLiEl.classList.add('fotosgrid__foto');
            ulFotosEl.appendChild(fotoLiEl);
            const imgEl = document.createElement('img');
            imgEl.loading = 'lazy';
            imgEl.src = foto;
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
    bodyEl.appendChild(botonCargarMasWrapperEl);
}
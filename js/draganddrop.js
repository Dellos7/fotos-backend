const formSubirFotosEl = document.getElementById('form-subir-fotos');
const inputFilesEl = document.getElementById('fileupload');
const botonSubirFotosEl = document.getElementById('boton-subir-fotos');
const labelNumFotosEl = document.getElementById('label-num-fotos');
const gridFotosPreviewEl = document.getElementById('grid-fotos-preview');

if( formSubirFotosEl ){
    // Eliminamos el comportamiento por defecto del drag & drop
    [ 'dragenter', 'dragover', 'dragleave', 'drop' ].forEach( eventName => {
        formSubirFotosEl.addEventListener( eventName, preventDefaults, false );
    });
    
    [ 'dragenter', 'dragover' ].forEach( eventName => {
        formSubirFotosEl.addEventListener( eventName, entrandoDrag, false );
    });
    
    [ 'dragleave', 'drop' ].forEach( eventName => {
        formSubirFotosEl.addEventListener( eventName, saliendoDrag, false );
    });
    
    formSubirFotosEl.addEventListener( 'drop', handleDrop, false );
}


function preventDefaults(e){
    e.preventDefault();
    e.stopPropagation();
}

function entrandoDrag(e){
    formSubirFotosEl.classList.add('dragging');
}

function saliendoDrag(e){
    formSubirFotosEl.classList.remove('dragging');
}

function handleDrop(e){
    const dt = e.dataTransfer;
    handleFiles(dt.files);
}

function handleFiles(files){
    inputFilesEl.files = files;
    labelNumFotosEl.innerText = `${inputFilesEl.files.length} fotos seleccionadas`;
    botonSubirFotosEl.classList.remove('hidden');
    previewFotos(files);
}

function previewFotos(files){
    gridFotosPreviewEl.innerHTML = '';
    [...files].forEach( file => {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            const imgEl = document.createElement('img');
            imgEl.src = e.target.result;
            gridFotosPreviewEl.appendChild( imgEl );
        };
        fileReader.readAsDataURL(file);
    });
}
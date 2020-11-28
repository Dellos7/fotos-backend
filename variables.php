<?php

$TIPOS_PERMITIDOS = [ 'image/jpeg', 'image/jpg', 'image/png', 'image/heic', 'image/tiff' ];
$DIRECTORIO_FOTOS = 'fotos';
$STDOUT = fopen('php://stdout', 'w');
$ERRORES_SUBIDA = [
    UPLOAD_ERR_INI_SIZE => 'La foto tiene un tamaño superior al upload_max_filesize',
    UPLOAD_ERR_FORM_SIZE => 'La foto tiene un tamaño superior al MAX_FILE_SIZE especificado en el formulario HTML',
    UPLOAD_ERR_PARTIAL => 'El fichero fue sólo parcialmente subido.',
    UPLOAD_ERR_NO_FILE => 'No se subió ningún fichero.',
    UPLOAD_ERR_NO_TMP_DIR => 'Falta la carpeta temporal',
    UPLOAD_ERR_CANT_WRITE => 'No se pudo escribir el fichero en el disco',
    UPLOAD_ERR_EXTENSION => 'Una extensión de PHP detuvo la subida de ficheros. PHP no proporciona una forma de determinar la extensión que causó la parada de la subida de ficheros; el examen de la lista de extensiones cargadas con phpinfo() puede ayudar'
];
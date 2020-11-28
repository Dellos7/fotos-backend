<?php

include "global.php";
include "variables.php";

if( !file_exists( $DIRECTORIO_FOTOS ) ){
    mkdir( $DIRECTORIO_FOTOS );
    $htaccessFile = fopen( $DIRECTORIO_FOTOS . '/.htaccess', "w" );
    $htaccessFileContent = "Options -Indexes";
    fwrite( $htaccessFile, $htaccessFileContent );
    fclose($htaccessFile);
}

if( !$_FILES || count($_FILES) < 1 || !$_FILES['fotos'] || count($_FILES['fotos']) < 1 ){
    $noSubir = [ ['error' => 'No se ha podido recuperar ninguna foto para subir.'] ];
    $numFotosSubidas = 0;
} else{
    $noSubir = comprobarFotos();
    $numFotosSubidas = subirFotos( $noSubir );
}

function comprobarFotos(){
    global $TIPOS_PERMITIDOS, $ERRORES_SUBIDA;
    //echo '<pre>' . print_r($_FILES, true) . '</pre>';
    $errores = 0;
    $erroresONoPermitidas = [];
    foreach( $_FILES['fotos']['error'] as $idx=>$error ){
        if( $error ){
            $errorDesc = $ERRORES_SUBIDA[$error];
            //echo "ERROR: " . $error . "<br>";
            $foto = $_FILES['fotos']['name'][$idx];
            array_push( $erroresONoPermitidas, [ 'idx' => $idx, 'error' => "Ocurrió un error subiendo la foto {$foto}. {$errorDesc}" ] );
            $errores++;
        }
    }
    foreach( $_FILES['fotos']['type'] as $idx=>$tipo ){
        if( !$_FILES['fotos']['error'][$idx] ){
            if( !in_array( $tipo, $TIPOS_PERMITIDOS ) ){
                //echo "TIPO NO PERMITIDO: " . $tipo . "<br>";
                $foto = $_FILES['fotos']['name'][$idx];
                array_push( $erroresONoPermitidas, [ 'idx' => $idx, 'error' => "No se puede subir el archivo {$foto} porque el tipo ${$tipo} no está permitido." ] );
                $errores++;
            }
        }
    }
    return $erroresONoPermitidas;
}

function subirFotos( &$noSubirArr ){
    global $DIRECTORIO_FOTOS;
    $numFotosExito = 0;
    $fotos = [];
    foreach( $_FILES['fotos']['name'] as $idx=>$foto ){
        $filteredArr = array_filter( $noSubirArr, function($error) use($idx){
            return $error['idx'] === $idx;
        });
        if( count($filteredArr) == 0 ){
            $pathFicheroSubidoTmp = $DIRECTORIO_FOTOS . '/' . basename( $_FILES['fotos']['tmp_name'][0] ) . '_' . basename( $foto );
            array_push( $fotos, $pathFicheroSubidoTmp );
        }
    }
    foreach( $_FILES['fotos']['tmp_name'] as $idx=>$pathSubidaTemporal ){
        $filteredArr = array_filter( $noSubirArr, function($error) use($idx){
            return $error['idx'] === $idx;
        });
        if( count($filteredArr) == 0 ){
            // Obtener metadata de la foto
            $metadata = exif_read_data( $pathSubidaTemporal, 'IFD0');
            //echo 'FECHA: ' . fechaFoto( $metadata ) . '<br>';
            //echo 'TAM: ' . tamFoto( $_FILES['fotos']['size'][$idx] ) . '<br>';
            if( move_uploaded_file( $pathSubidaTemporal, $fotos[$idx] ) ){
                $numFotosExito++;
            } else{
                $fotoNom = $_FILES['fotos']['name'][$idx];
                array_push( $noSubirArr, [ 'idx' => $idx, 'error' => "Error inesperado al subir la foto {$fotoNom}" ] );
            }
        }
    }
    return $numFotosExito;
}

function fechaFoto( $metadata ){
    // Devuelve algo así: 2016:06:29 10:17:47
    $dateTimeOriginal = $metadata['DateTimeOriginal'];
    $fechaHoraArr = preg_split( "/\s/", $dateTimeOriginal );
    $fecha = $fechaHoraArr[0];
    $fecha = str_replace( ':', '/', $fecha );
    $hora = $fechaHoraArr[1];
    return $fecha . ' ' . $hora;
}

function tamFoto( $tamFotoBytes ){
    $tamFotoBytes = intval( $tamFotoBytes );
    $megas = $tamFotoBytes / (1024*1024);
    if( $megas < 1 ){
        $kilos = $tamFotoBytes / 1024;
        return round( $kilos, 2 ) . 'KB';
    }
    return round( $megas, 2 ) . 'MB';
}

if( count($noSubir) > 0 ){
    setcookie( "errores_subida", json_encode( $noSubir ), time() + 60*5 );
}
if( $numFotosSubidas > 0 ){
    setcookie( "fotos_subidas_exito", $numFotosSubidas, time() + 60*5 );
}

header( "Location: index.php" );
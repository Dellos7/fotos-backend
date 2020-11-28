<?php

include "global.php";
include "variables.php";

$offset = 0;
$numFotos = 20;

if( isset($_POST['offset']) ) $offset = intval($_POST['offset']);
if( isset($_POST['num_fotos']) ) $numFotos = intval($_POST['num_fotos']);

//fwrite($STDOUT, 'post offset: ' . $_POST['offset'] . "\n");

$fotosArr = obtenerFotosArr( $offset, $numFotos );

function obtenerFotosArr( $offset, $numFotos ){
    global $DIRECTORIO_FOTOS;
    $fotos = scandir($DIRECTORIO_FOTOS);
    // Filtrar solo los archivos que sean fotos
    $fotos = array_filter( $fotos, function($elem){
        $tipo = strtolower( explode( '.', $elem )[1] );
        return $tipo === 'jpg' || $tipo === 'png' || $tipo === 'jpeg' || $tipo === 'heic' || $tipo === 'tiff';
    });
    $idx = 0;
    $idxNumFotos = 0;
    $fotos = array_filter( $fotos, function() use(&$idx, &$idxNumFotos, $offset, $numFotos){
        if( $idx >= $offset && $idxNumFotos < $numFotos ){
            $idxNumFotos++;
            $idx++;
            return true;
        }
        $idx++;
        return false;
    });
    $fotos = array_map( function($elem){
        global $DIRECTORIO_FOTOS;
        return $DIRECTORIO_FOTOS . '/' . $elem;
    }, $fotos);
    return $fotos;
}

header( 'Content-Type: application/json' );
echo json_encode( array_values($fotosArr), JSON_PRETTY_PRINT + JSON_UNESCAPED_SLASHES );
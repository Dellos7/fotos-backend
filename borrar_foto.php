<?php

include "global.php";
include "variables.php";

$fotoPath = $_GET['foto'];

header( 'Content-Type: application/json' );

if( $fotoPath ){
    $eliminada = unlink( $fotoPath );
    if( $eliminada ){
        echo json_encode( [ 'mensaje' => 'La foto se ha eliminado con éxito.' ], JSON_PRETTY_PRINT + JSON_UNESCAPED_SLASHES );
    } else{
        echo json_encode( [ 'error' => 'Ha ocurrido un error inesperado eliminando la foto.' ], JSON_PRETTY_PRINT + JSON_UNESCAPED_SLASHES );
    }
} else{
    echo json_encode( [ 'error' => 'No se ha proporcionado el path de la foto a eliminar.' ], JSON_PRETTY_PRINT + JSON_UNESCAPED_SLASHES );
}
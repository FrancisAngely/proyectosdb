<?php
try {
    //Configuracion de la conexión
    // el DNS (data source name), información necesaria para que PDO se conecte a una base datos.
    // Los datos son: tipo, host y nombre bd
    $dsn = "mysql:host=localhost;port=3306;dbname=proyectosdb;charset=utf8mb4";
    $usuario = "root";
    $contrasena = "";

    //PDO = PHP DATA OBJECTS. 
    //MYSQLI ($SERVIDOR, $USUARIO,$CONTRASENA, $BASE DE DATOS)
    $con = new PDO($dsn, $usuario, $contrasena);

    //consulta SQL para obtener los departamentos
    $sql =  "SELECT p.id as id_proyecto, p.nombre as nombre_proyecto, p.responsable as responsable_proyecto, p.proyectoPadre as proyecto_padre,
    e.id as id_empleado, e.nombre as nombre_empleado 
     FROM proyectos p RIGHT JOIN empleados e ON p.responsable = e.id;";
    $stm = $con->prepare($sql);
    $stm->execute();

    //guardamos la información resultante en una variable
    $resultSet = $stm->fetchAll(PDO::FETCH_ASSOC);
    //convierto a formato JSON lo obtenido
    echo json_encode($resultSet);

} catch(PDOException $e) {
    echo "Error " . $e->getMessage();
}
?>

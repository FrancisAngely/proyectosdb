<?php
try {
    // Configuración de la conexión
    $dsn = "mysql:host=localhost;port=3306;dbname=proyectosdb;charset=utf8mb4";
    $usuario = "root";
    $contrasena = "";

    // Conexión PDO
    $con = new PDO($dsn, $usuario, $contrasena);
    $con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Leer y decodificar el JSON recibido
    $datos = json_decode(file_get_contents('php://input'), true);

    if (!isset($datos['id'])) {
        echo json_encode(["success" => false, "message" => "ID de proyecto no recibido."]);
        exit;
    }

    $id_proyecto = $datos['id'];

    // Consulta SQL para eliminar el proyecto
    $sql = "DELETE FROM proyectos WHERE id = :id_proyecto";
    $stm = $con->prepare($sql);
    $stm->execute(['id_proyecto' => $id_proyecto]);

    if ($stm->rowCount() > 0) {
        echo json_encode(["success" => true, "message" => "Proyecto eliminado correctamente."]);
    } else {
        echo json_encode(["success" => false, "message" => "No se encontró el proyecto con ese ID."]);
    }

} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Error SQL: " . $e->getMessage()]);
}
?>

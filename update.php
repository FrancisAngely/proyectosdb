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
    $datos = json_decode(file_get_contents("php://input"), true);

    if (!$datos || empty($datos["id"]) || empty($datos["nombre"])) {
        echo json_encode(["success" => false, "message" => "Datos incompletos."]);
        exit;
    }

    $id = $datos["id"];
    $nombre = $datos["nombre"];

    // Actualizar el nombre del proyecto
    $sql = "UPDATE proyectos SET nombre = :nombre WHERE id = :id";
    $stmt = $con->prepare($sql);
    $stmt->execute(["nombre" => $nombre, "id" => $id]);

    echo json_encode(["success" => true, "message" => "Proyecto actualizado correctamente."]);

} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Error SQL: " . $e->getMessage()]);
}
?>

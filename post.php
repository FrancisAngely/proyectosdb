<?php
try {
    // Configuración de la conexión
    $dsn = "mysql:host=localhost;port=3306;dbname=proyectosdb;charset=utf8mb4";
    $usuario = "root";
    $contrasena = "";

    // Conexión PDO
    $con = new PDO($dsn, $usuario, $contrasena);
    $con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Leer y decodificar el JSON
    $datosFormulario = json_decode(file_get_contents('php://input'), true);

    if (!$datosFormulario) {
        echo json_encode(["success" => false, "message" => "No se han recibido datos o el JSON está mal formado."]);
        exit;
    }

    // Validar datos
    if (empty($datosFormulario['nombre']) || empty($datosFormulario['responsable'])) {
        echo json_encode(["success" => false, "message" => "Faltan datos obligatorios."]);
        exit;
    }

    $nombre = $datosFormulario['nombre'];
    $responsable = $datosFormulario['responsable'];
    $proyectoPadre = !empty($datosFormulario['proyectoPadre']) ? $datosFormulario['proyectoPadre'] : null;

    // Verificar si el nombre ya existe
    $checkSql = "SELECT COUNT(*) FROM proyectos WHERE nombre = :nombre";
    $checkStm = $con->prepare($checkSql);
    $checkStm->execute(['nombre' => $nombre]);
    
    if ($checkStm->fetchColumn() > 0) {
        echo json_encode(["success" => false, "message" => "Ya existe un proyecto con ese nombre."]);
        exit;
    }

    // Consulta SQL
    $sql = "INSERT INTO proyectos (nombre, responsable, proyectoPadre) VALUES (:nombre, :responsable, :proyectoPadre)";

    $stm = $con->prepare($sql);
    $stm->execute([
        'nombre' => $nombre,
        'responsable' => $responsable,
        'proyectoPadre' => $proyectoPadre
    ]);

    // Obtener el ID insertado
    $nuevo_id = $con->lastInsertId();

    echo json_encode([
        "success" => true, 
        "id" => $nuevo_id, 
        "message" => "Proyecto añadido correctamente."
    ]);

} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Error SQL: " . $e->getMessage()]);
}
?>
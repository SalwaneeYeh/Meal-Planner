<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

include 'db_connect.php';

$method = $_SERVER['REQUEST_METHOD'];

// GET /meals or /meals?id=1
if ($method === 'GET') {
    if (isset($_GET['id'])) {
        $stmt = $pdo->prepare("SELECT * FROM meals WHERE id=?");
        $stmt->execute([$_GET['id']]);
        $meal = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode($meal);
    } else if (isset($_GET['date'])) {
        $stmt = $pdo->prepare("SELECT * FROM meals WHERE date=? ORDER BY meal_type");
        $stmt->execute([$_GET['date']]);
        $meals = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($meals);
    } else {
        $stmt = $pdo->query("SELECT * FROM meals ORDER BY date DESC, meal_type");
        $meals = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($meals);
    }
}

// POST /meals
if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!$data || !isset($data['date'],$data['meal_type'],$data['menu'],$data['calories'])) {
        http_response_code(400);
        echo json_encode(["error"=>"Missing required fields"]);
        exit();
    }
    $stmt = $pdo->prepare("INSERT INTO meals (date, meal_type, menu, calories, note) VALUES (?,?,?,?,?)");
    $stmt->execute([$data['date'],$data['meal_type'],$data['menu'],$data['calories'],$data['note'] ?? null]);
    $id = $pdo->lastInsertId();
    $stmt = $pdo->prepare("SELECT * FROM meals WHERE id=?");
    $stmt->execute([$id]);
    $meal = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode($meal);
}

// PUT /meals?id=1
if ($method === 'PUT') {
    if (!isset($_GET['id'])) {
        http_response_code(400);
        echo json_encode(["error"=>"Missing id"]);
        exit();
    }
    $id = $_GET['id'];
    $data = json_decode(file_get_contents("php://input"), true);
    $stmt = $pdo->prepare("SELECT * FROM meals WHERE id=?");
    $stmt->execute([$id]);
    $meal = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$meal) {
        http_response_code(404);
        echo json_encode(["error"=>"Not found"]);
        exit();
    }

    $date = $data['date'] ?? $meal['date'];
    $meal_type = $data['meal_type'] ?? $meal['meal_type'];
    $menu = $data['menu'] ?? $meal['menu'];
    $calories = $data['calories'] ?? $meal['calories'];
    $note = array_key_exists('note',$data) ? $data['note'] : $meal['note'];

    $stmt = $pdo->prepare("UPDATE meals SET date=?, meal_type=?, menu=?, calories=?, note=? WHERE id=?");
    $stmt->execute([$date,$meal_type,$menu,$calories,$note,$id]);

    $stmt = $pdo->prepare("SELECT * FROM meals WHERE id=?");
    $stmt->execute([$id]);
    $meal = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode($meal);
}

// DELETE /meals?id=1
if ($method === 'DELETE') {
    if (!isset($_GET['id'])) {
        http_response_code(400);
        echo json_encode(["error"=>"Missing id"]);
        exit();
    }
    $id = $_GET['id'];
    $stmt = $pdo->prepare("DELETE FROM meals WHERE id=?");
    $stmt->execute([$id]);
    echo json_encode(["success"=>true]);
}
?>

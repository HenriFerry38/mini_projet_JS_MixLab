<?php

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

require __DIR__ . '/config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'error' => 'Méthode non autorisée'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    $sql = "
        SELECT
            c.id,
            c.nom,
            c.description,
            c.instructions,
            c.niveau_difficulte,
            c.temps_preparation,
            c.avec_alcool,
            c.image,
            c.resume_court,
            cat.nom AS categorie,
            v.nom AS verre
        FROM cocktail c
        JOIN categorie cat ON c.categorie_id = cat.id
        JOIN verre v ON c.verre_id = v.id
        ORDER BY c.nom ASC
    ";

    $stmt = $pdo->query($sql);
    $cocktails = $stmt->fetchAll();

    foreach ($cocktails as &$cocktail) {
        $cocktail['avec_alcool'] = (bool) $cocktail['avec_alcool'];
    }

    echo json_encode($cocktails, JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Erreur lors de la récupération des cocktails',
        'details' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
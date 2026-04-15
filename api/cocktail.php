<?php

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

require __DIR__ . '/config/db.php';

$id = isset($_GET['id']) ? (int) $_GET['id'] : 0;

if ($id <= 0) {
    http_response_code(400);
    echo json_encode([
        'error' => 'ID invalide'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    $sqlCocktail = "
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
        WHERE c.id = :id
    ";

    $stmtCocktail = $pdo->prepare($sqlCocktail);
    $stmtCocktail->execute(['id' => $id]);
    $cocktail = $stmtCocktail->fetch();

    if (!$cocktail) {
        http_response_code(404);
        echo json_encode([
            'error' => 'Cocktail introuvable'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $sqlIngredients = "
        SELECT
            i.nom AS ingredient,
            ci.quantite,
            ci.unite
        FROM cocktail_ingredient ci
        JOIN ingredient i ON i.id = ci.ingredient_id
        WHERE ci.cocktail_id = :id
        ORDER BY i.nom ASC
    ";

    $stmtIngredients = $pdo->prepare($sqlIngredients);
    $stmtIngredients->execute(['id' => $id]);
    $ingredients = $stmtIngredients->fetchAll();

    $cocktail['avec_alcool'] = (bool) $cocktail['avec_alcool'];
    $cocktail['ingredients'] = array_map(function ($item) {
        $quantite = $item['quantite'] !== null ? rtrim(rtrim((string) $item['quantite'], '0'), '.') : '';
        $unite = $item['unite'] ?? '';
        $ingredient = $item['ingredient'];

        return trim($quantite . ' ' . $unite . ' de ' . $ingredient);
    }, $ingredients);

    echo json_encode($cocktail, JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Erreur lors de la récupération du cocktail',
        'details' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
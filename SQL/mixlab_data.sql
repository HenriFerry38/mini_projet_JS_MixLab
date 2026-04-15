USE mixlab_db;

-- =========================
-- INSERTION DES CATEGORIES
-- =========================
INSERT INTO categorie (nom) VALUES
('Classique'),
('Fruité'),
('Sans alcool'),
('Signature'),
('Tiki');

-- ======================
-- INSERTION DES VERRES
-- ======================
INSERT INTO verre (nom) VALUES
('Highball'),
('Martini'),
('Tumbler'),
('Coupe'),
('Hurricane');

-- ==========================
-- INSERTION DES INGREDIENTS
-- ==========================
INSERT INTO ingredient (nom) VALUES
('Rhum blanc'),
('Vodka'),
('Gin'),
('Tequila'),
('Triple sec'),
('Citron vert'),
('Citron jaune'),
('Jus d''orange'),
('Jus d''ananas'),
('Jus de cranberry'),
('Sirop de sucre de canne'),
('Menthe fraîche'),
('Eau gazeuse'),
('Glace pilée'),
('Lait de coco'),
('Grenadine'),
('Jus de pomme'),
('Soda au gingembre'),
('Sucre blanc'),
('Angostura bitters'),
('Purée de framboise'),
('Jus de passion'),
('Tonic'),
('Concombre'),
('Basilic frais');

-- ========================
-- INSERTION DES COCKTAILS
-- ========================
INSERT INTO cocktail
(nom, resume_court, description, instructions, niveau_difficulte, temps_preparation, avec_alcool, image, categorie_id, verre_id)
VALUES
(
    'Mojito',
    'Rhum blanc, menthe, citron vert...',
    'Un grand classique cubain, frais et mentholé.',
    'Déposer la menthe, le citron vert et le sucre dans le verre. Piler légèrement. Ajouter le rhum, la glace pilée puis compléter avec l’eau gazeuse.',
    'facile',
    5,
    TRUE,
    'images/mojito.jpg',
    1,
    1
),
(
    'Sex on the Beach',
    'Vodka, jus d’orange, cranberry...',
    'Un cocktail fruité et coloré, parfait pour l’été.',
    'Verser la vodka, le jus d’orange et le jus de cranberry dans un verre rempli de glace. Mélanger doucement et servir frais.',
    'facile',
    4,
    TRUE,
    'images/sex-on-the-beach.jpg',
    2,
    1
),
(
    'Virgin Colada',
    'Jus d’ananas, lait de coco...',
    'Une version sans alcool, douce et exotique.',
    'Verser le jus d’ananas et le lait de coco dans un shaker avec de la glace. Secouer puis servir dans un verre hurricane.',
    'facile',
    5,
    FALSE,
    'images/virgin-colada.jpg',
    3,
    5
),
(
    'Margarita',
    'Tequila, triple sec, citron vert...',
    'Un incontournable à base de tequila, vif et équilibré.',
    'Verser la tequila, le triple sec et le jus de citron vert dans un shaker avec de la glace. Secouer et filtrer dans un verre adapté.',
    'moyen',
    5,
    TRUE,
    'images/margarita.jpg',
    1,
    4
),
(
    'Gin Tonic Concombre',
    'Gin, tonic, concombre...',
    'Une variante fraîche et végétale du gin tonic.',
    'Remplir le verre de glace. Ajouter le gin, le tonic puis quelques rondelles de concombre. Mélanger délicatement.',
    'facile',
    3,
    TRUE,
    'images/gin-tonic-concombre.jpg',
    4,
    1
),
(
    'Mai Tai',
    'Rhum blanc, triple sec, citron...',
    'Un cocktail tiki puissant et ensoleillé.',
    'Verser les ingrédients dans un shaker avec de la glace. Secouer vivement puis servir avec de la glace pilée.',
    'moyen',
    6,
    TRUE,
    'images/mai-tai.jpg',
    5,
    5
),
(
    'Berry Splash',
    'Vodka, framboise, citron...',
    'Un cocktail signature acidulé aux notes de framboise.',
    'Mélanger la vodka, la purée de framboise, le jus de citron jaune et le soda au gingembre. Servir très frais.',
    'moyen',
    5,
    TRUE,
    'images/berry-splash.jpg',
    4,
    4
),
(
    'Pomme Basilic Fizz',
    'Jus de pomme, basilic, citron...',
    'Une création sans alcool fraîche et herbacée.',
    'Mélanger le jus de pomme, le basilic légèrement froissé, le citron jaune et l’eau gazeuse. Servir sur glace.',
    'facile',
    4,
    FALSE,
    'images/pomme-basilic-fizz.jpg',
    3,
    1
);
-- ==================================
-- INSERTION COCKTAIL / INGREDIENTS
-- ==================================

-- Mojito
INSERT INTO cocktail_ingredient (cocktail_id, ingredient_id, quantite, unite) VALUES
(1, 1, 4, 'cl'),
(1, 6, 0.5, 'pièce'),
(1, 11, 2, 'cl'),
(1, 12, 8, 'feuilles'),
(1, 13, 6, 'cl'),
(1, 14, 1, 'portion');

-- Sex on the Beach
INSERT INTO cocktail_ingredient (cocktail_id, ingredient_id, quantite, unite) VALUES
(2, 2, 4, 'cl'),
(2, 8, 6, 'cl'),
(2, 10, 6, 'cl'),
(2, 14, 1, 'portion');

-- Virgin Colada
INSERT INTO cocktail_ingredient (cocktail_id, ingredient_id, quantite, unite) VALUES
(3, 9, 8, 'cl'),
(3, 15, 4, 'cl'),
(3, 14, 1, 'portion');

-- Margarita
INSERT INTO cocktail_ingredient (cocktail_id, ingredient_id, quantite, unite) VALUES
(4, 4, 4, 'cl'),
(4, 5, 2, 'cl'),
(4, 6, 2, 'cl'),
(4, 14, 1, 'portion');

-- Gin Tonic Concombre
INSERT INTO cocktail_ingredient (cocktail_id, ingredient_id, quantite, unite) VALUES
(5, 3, 4, 'cl'),
(5, 23, 8, 'cl'),
(5, 24, 4, 'rondelles'),
(5, 14, 1, 'portion');

-- Mai Tai
INSERT INTO cocktail_ingredient (cocktail_id, ingredient_id, quantite, unite) VALUES
(6, 1, 4, 'cl'),
(6, 5, 2, 'cl'),
(6, 7, 2, 'cl'),
(6, 11, 1, 'cl'),
(6, 20, 2, 'gouttes'),
(6, 14, 1, 'portion');

-- Berry Splash
INSERT INTO cocktail_ingredient (cocktail_id, ingredient_id, quantite, unite) VALUES
(7, 2, 4, 'cl'),
(7, 21, 3, 'cl'),
(7, 7, 2, 'cl'),
(7, 18, 6, 'cl'),
(7, 14, 1, 'portion');

-- Pomme Basilic Fizz
INSERT INTO cocktail_ingredient (cocktail_id, ingredient_id, quantite, unite) VALUES
(8, 17, 8, 'cl'),
(8, 25, 5, 'feuilles'),
(8, 7, 2, 'cl'),
(8, 13, 6, 'cl'),
(8, 14, 1, 'portion');

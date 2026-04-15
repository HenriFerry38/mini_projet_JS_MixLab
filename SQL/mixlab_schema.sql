-- ============================================
-- MixLab - Création de la base de données
-- Auteur : Henri Ferry
-- Description : Schéma SQL des cocktails
-- ============================================
DROP DATABASE IF EXISTS mixlab_db;
CREATE DATABASE IF NOT EXISTS mixlab_db;
USE mixlab_db;

DROP TABLE IF EXISTS cocktail_ingredient;
DROP TABLE IF EXISTS cocktail;
DROP TABLE IF EXISTS ingredient;
DROP TABLE IF EXISTS categorie;
DROP TABLE IF EXISTS verre;

CREATE TABLE categorie (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE verre (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE ingredient (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(150) NOT NULL UNIQUE
);

CREATE TABLE cocktail (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(150) NOT NULL UNIQUE,
    resume_court TEXT,
    description TEXT,
    instructions TEXT NOT NULL,
    niveau_difficulte ENUM('facile', 'moyen', 'difficile') NOT NULL DEFAULT 'facile',
    temps_preparation INT NOT NULL,
    avec_alcool BOOLEAN NOT NULL DEFAULT TRUE,
    image VARCHAR(255),
    categorie_id INT NOT NULL,
    verre_id INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_cocktail_categorie
        FOREIGN KEY (categorie_id) REFERENCES categorie(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_cocktail_verre
        FOREIGN KEY (verre_id) REFERENCES verre(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE TABLE cocktail_ingredient (
    cocktail_id INT NOT NULL,
    ingredient_id INT NOT NULL,
    quantite DECIMAL(6,2),
    unite VARCHAR(50),

    PRIMARY KEY (cocktail_id, ingredient_id),

    CONSTRAINT fk_ci_cocktail
        FOREIGN KEY (cocktail_id) REFERENCES cocktail(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_ci_ingredient
        FOREIGN KEY (ingredient_id) REFERENCES ingredient(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);
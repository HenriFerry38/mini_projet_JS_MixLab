const ApiURL = "http://127.0.0.1:8000"

const cocktailsGrid = document.getElementById("cocktailsGrid");
const searchInput = document.getElementById("searchInput");
const alcoholFilter = document.getElementById("alcoholFilter");
const randomBtn = document.getElementById("randomBtn");
const statusMessage = document.getElementById("statusMessage");

const recipeModal = document.getElementById("recipeModal");
const modalBackdrop = document.getElementById("modalBackdrop");
const closeModalBtn = document.getElementById("closeModalBtn");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalCategory = document.getElementById("modalCategory");
const modalDifficulty = document.getElementById("modalDifficulty");
const modalAlcohol = document.getElementById("modalAlcohol");
const modalDescription = document.getElementById("modalDescription");
const modalIngredients = document.getElementById("modalIngredients");
const modalInstructions = document.getElementById("modalInstructions");

let cocktails = [];
let filteredCocktails = [];

init();



async function openModal(cocktail) {
  try {
    const response = await fetch(`${ApiURL}/cocktail.php?id=${cocktail.id}`);

    if (!response.ok) {
      throw new Error("Erreur chargement recette");
    }

    const data = await response.json();

    // IMAGE
    modalImage.src = `./${data.image}`;
    modalImage.alt = data.nom;

    // TITRE
    modalTitle.textContent = data.nom;

    // BADGES
    modalCategory.textContent = data.categorie;
    modalDifficulty.textContent = capitalize(data.niveau_difficulte);
    modalAlcohol.textContent = data.avec_alcool ? "Avec alcool" : "Sans alcool";

    // TEXTE
    modalDescription.textContent = data.description;
    modalInstructions.textContent = data.instructions;

    // INGREDIENTS
    modalIngredients.innerHTML = "";

    data.ingredients.forEach((ingredient) => {
      const li = document.createElement("li");
      li.textContent = ingredient;
      modalIngredients.appendChild(li);
    });

    // OUVERTURE
    recipeModal.classList.remove("hidden");
    recipeModal.setAttribute("aria-hidden", "false");

  } catch (error) {
    setStatus(error.message);
  }
}

async function init() {
  await loadCocktails();
  bindEvents();
  renderCocktails(cocktails);
}

async function loadCocktails() {
  try {
    const response = await fetch(`${ApiURL}/cocktails.php`);

    if (!response.ok) {
      throw new Error("Impossible de charger les cocktails.");
    }

    cocktails = await response.json();
    filteredCocktails = [...cocktails];
    setStatus(`${cocktails.length} cocktail(s) chargé(s).`);
  } catch (error) {
    setStatus(error.message);
  }
}

function bindEvents() {
  searchInput.addEventListener("input", applyFilters);
  alcoholFilter.addEventListener("change", applyFilters);
  randomBtn.addEventListener("click", showRandomCocktail);

  closeModalBtn.addEventListener("click", closeModal);
  modalBackdrop.addEventListener("click", closeModal);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  });
}

function applyFilters() {
  const searchValue = searchInput.value.trim().toLowerCase();
  const alcoholValue = alcoholFilter.value;

  filteredCocktails = cocktails.filter((cocktail) => {
    const matchName = cocktail.nom.toLowerCase().includes(searchValue);

    const matchAlcohol =
      alcoholValue === "all" ||
      (alcoholValue === "avec" && cocktail.avec_alcool === true) ||
      (alcoholValue === "sans" && cocktail.avec_alcool === false);

    return matchName && matchAlcohol;
  });

  renderCocktails(filteredCocktails);

  if (filteredCocktails.length === 0) {
    setStatus("Aucun cocktail ne correspond à la recherche.");
    return;
  }

  setStatus(`${filteredCocktails.length} cocktail(s) trouvé(s).`);
}

function renderCocktails(items) {
  cocktailsGrid.innerHTML = "";

  if (!items.length) {
    cocktailsGrid.innerHTML = `
      <article class="cocktail-card">
        <div class="cocktail-card__body">
          <h3 class="cocktail-card__title">Aucun résultat</h3>
          <p class="cocktail-card__text">Essaie une autre recherche ou change le filtre.</p>
        </div>
      </article>
    `;
    return;
  }

  items.forEach((cocktail) => {
    const card = document.createElement("article");
    card.className = "cocktail-card";

    card.innerHTML = `
      <div class="cocktail-card__media">
        <img src="${cocktail.image}" alt="${cocktail.nom}">
      </div>

      <div class="cocktail-card__body">
        <h3 class="cocktail-card__title">${cocktail.nom}</h3>

        <div class="cocktail-card__badges">
          <span class="badge badge--category">${cocktail.categorie}</span>
          <span class="badge badge--difficulty">${cocktail.niveau_difficulte}</span>
          <span class="badge badge--alcohol">${cocktail.avec_alcool ? "Avec alcool" : "Sans alcool"}</span>
        </div>

        <p class="cocktail-card__text">${cocktail.resume_court || cocktail.description}</p>

        <div class="cocktail-card__footer">
          <button class="btn btn--outline" data-id="${cocktail.id}">
            Voir recette
          </button>
        </div>
      </div>
    `;

    const button = card.querySelector("button");
    button.addEventListener("click", () => openModal(cocktail));

    cocktailsGrid.appendChild(card);
  });
}

function showRandomCocktail() {
  if (!filteredCocktails.length) {
    setStatus("Aucun cocktail disponible pour le tirage aléatoire.");
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredCocktails.length);
  const cocktail = filteredCocktails[randomIndex];
  openModal(cocktail);
}

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function closeModal() {
  recipeModal.classList.add("hidden");
  recipeModal.setAttribute("aria-hidden", "true");
}

function setStatus(message) {
  statusMessage.textContent = message;
}
const ApiURL = "https://ferryhenri.alwaysdata.net/mixlab/"

const cocktailsGrid = document.getElementById("cocktailsGrid");
const searchInput = document.getElementById("searchInput");
const alcoholFilter = document.getElementById("alcoholFilter");
const categoryFilter = document.getElementById("categoryFilter");
const glassFilter = document.getElementById("glassFilter");
const resetFiltersBtn = document.getElementById("resetFiltersBtn");
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
    const response = await fetch(`${ApiURL}api/cocktail.php?id=${cocktail.id}`);

    if (!response.ok) {
      throw new Error("Erreur chargement recette");
    }

    const data = await response.json();

    cocktailsGrid.classList.add("is-blurred");
    
    // IMAGE
    modalImage.src = data.image;
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
  populateFilters();
  renderCocktails(cocktails);
}

async function loadCocktails() {
  try {
    const response = await fetch(`${ApiURL}api/cocktails.php`);

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
  categoryFilter.addEventListener("change", applyFilters);
  glassFilter.addEventListener("change", applyFilters);
  resetFiltersBtn.addEventListener("click", resetFilters);
  randomBtn.addEventListener("click", () => {
    animateButton(randomBtn);
    setTimeout(() => {
      showRandomCocktail();
    }, 120);
  });

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
  const categoryValue = categoryFilter.value;
  const glassValue = glassFilter.value;

  filteredCocktails = cocktails.filter((cocktail) => {
    const matchName = cocktail.nom.toLowerCase().includes(searchValue);

    const matchAlcohol =
      alcoholValue === "all" ||
      (alcoholValue === "avec" && cocktail.avec_alcool === true) ||
      (alcoholValue === "sans" && cocktail.avec_alcool === false);

    const matchCategory =
      categoryValue === "all" || cocktail.categorie === categoryValue;

    const matchGlass =
      glassValue === "all" || cocktail.verre === glassValue;

    return matchName && matchAlcohol && matchCategory && matchGlass;
  });

  renderCocktails(filteredCocktails);

  if (filteredCocktails.length === 0) {
    setStatus("Aucun cocktail ne correspond aux filtres sélectionnés.");
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
    card.dataset.id = cocktail.id;

    card.innerHTML = `
      <div class="cocktail-card__media">
        <img src="${cocktail.image}" alt="${escapeHtml(cocktail.nom)}">
      </div>

      <div class="cocktail-card__body">
        <h3 class="cocktail-card__title">${escapeHtml(cocktail.nom)}</h3>

        <div class="cocktail-card__badges">
          <span class="badge badge--category">${escapeHtml(cocktail.nom)}</span>
          <span class="badge badge--difficulty">${capitalize(cocktail.niveau_difficulte)}</span>
          <span class="badge badge--alcohol">${cocktail.avec_alcool ? "Avec alcool" : "Sans alcool"}</span>
          <span class="badge badge--glass">${escapeHtml(cocktail.verre)}</span>
        </div>

        <p class="cocktail-card__text">${escapeHtml(cocktail.resume_court || cocktail.description)}</p>

        <div class="cocktail-card__footer">
          <button class="btn btn--outline" data-id="${cocktail.id}">
            Voir recette
          </button>
        </div>
      </div>
    `;

    const button = card.querySelector("button");
    button.addEventListener("click", () => {
      animateButton(button);
      setTimeout(() => {
        openModal(cocktail);
      },120);
    });

    cocktailsGrid.appendChild(card);
  });
}

function highlightCard(cocktailId) {
  const targetCard = document.querySelector(`.cocktail-card[data-id="${cocktailId}"]`);

  if (!targetCard) return;

  targetCard.classList.remove("is-highlighted");

  requestAnimationFrame(() => {
    targetCard.classList.add("is-highlighted");
  });

  setTimeout(() => {
    targetCard.classList.remove("is-highlighted");
  }, 700);
}

function animateButton(button) {
  button.classList.remove("is-clicked");

  requestAnimationFrame(() => {
    button.classList.add("is-clicked");
  });

  setTimeout(() => {
    button.classList.remove("is-clicked");
  }, 300);
}

function populateFilters() {
  const categories = [...new Set(cocktails.map((cocktail) => cocktail.categorie))].sort();
  const glasses = [...new Set(cocktails.map((cocktail) => cocktail.verre))].sort();

  categoryFilter.innerHTML = `<option value="all">Toutes les catégories</option>`;
  glassFilter.innerHTML = `<option value="all">Tous les verres</option>`;

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  glasses.forEach((glass) => {
    const option = document.createElement("option");
    option.value = glass;
    option.textContent = glass;
    glassFilter.appendChild(option);
  });
}

function resetFilters() {
  searchInput.value = "";
  alcoholFilter.value = "all";
  categoryFilter.value = "all";
  glassFilter.value = "all";

  filteredCocktails = [...cocktails];
  renderCocktails(filteredCocktails);
  setStatus(`${filteredCocktails.length} cocktail(s) chargé(s).`);
}

function showRandomCocktail() {
  if (!filteredCocktails.length) {
    setStatus("Aucun cocktail disponible pour le tirage aléatoire.");
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredCocktails.length);
  const cocktail = filteredCocktails[randomIndex];
  highlightCard(cocktail.id);
  openModal(cocktail);
}

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function closeModal() {
  document.activeElement.blur();

  recipeModal.classList.add("hidden");
  recipeModal.setAttribute("aria-hidden", "true");
  cocktailsGrid.classList.remove("is-blurred");
}

function setStatus(message) {
  statusMessage.textContent = message;
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
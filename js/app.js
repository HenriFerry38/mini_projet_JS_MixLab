const randomBtn = document.getElementById("randomBtn");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const alcoholFilter = document.getElementById("alcoholFilter");
const statusMessage = document.getElementById("statusMessage");

const cocktailCard = document.getElementById("cocktailCard");
const cocktailImage = document.getElementById("cocktailImage");
const cocktailName = document.getElementById("cocktailName");
const cocktailCategory = document.getElementById("cocktailCategory");
const cocktailAlcohol = document.getElementById("cocktailAlcohol");
const cocktailGlass = document.getElementById("cocktailGlass");
const ingredientsList = document.getElementById("ingredientsList");
const cocktailInstructions = document.getElementById("cocktailInstructions");

const API_BASE = "https://www.thecocktaildb.com/api/json/v1/1";

randomBtn.addEventListener("click", fetchRandomCocktail);
searchBtn.addEventListener("click", handleSearch);
alcoholFilter.addEventListener("change", handleFilter);

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleSearch();
  }
});

async function fetchRandomCocktail() {
  setStatus("Chargement d’un cocktail surprise...");
  hideCard();

  try {
    const response = await fetch(`${API_BASE}/random.php`);
    if (!response.ok) {
      throw new Error("Erreur lors du chargement du cocktail.");
    }

    const data = await response.json();
    const cocktail = data.drinks?.[0];

    if (!cocktail) {
      throw new Error("Aucun cocktail trouvé.");
    }

    displayCocktail(cocktail);
    setStatus("");
  } catch (error) {
    setStatus(error.message);
  }
}

async function handleSearch() {
  const query = searchInput.value.trim();

  if (!query) {
    setStatus("Tape un nom de cocktail pour lancer la recherche.");
    hideCard();
    return;
  }

  setStatus("Recherche en cours...");
  hideCard();

  try {
    const response = await fetch(`${API_BASE}/search.php?s=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error("Erreur pendant la recherche.");
    }

    const data = await response.json();
    const cocktails = data.drinks;

    if (!cocktails || cocktails.length === 0) {
      setStatus("Aucun cocktail trouvé pour cette recherche.");
      return;
    }

    const selectedFilter = alcoholFilter.value;
    const filteredCocktails =
      selectedFilter === "all"
        ? cocktails
        : cocktails.filter((cocktail) => cocktail.strAlcoholic === selectedFilter);

    if (filteredCocktails.length === 0) {
      setStatus("Aucun résultat ne correspond au filtre sélectionné.");
      return;
    }

    displayCocktail(filteredCocktails[0]);
    setStatus(`${filteredCocktails.length} résultat(s) trouvé(s).`);
  } catch (error) {
    setStatus(error.message);
  }
}

async function handleFilter() {
  const query = searchInput.value.trim();

  if (query) {
    await handleSearch();
    return;
  }

  if (alcoholFilter.value === "all") {
    setStatus("Filtre réinitialisé.");
    return;
  }

  setStatus("Astuce : fais une recherche puis applique le filtre.");
}

function displayCocktail(cocktail) {
  cocktailImage.src = cocktail.strDrinkThumb || "";
  cocktailImage.alt = cocktail.strDrink || "Cocktail";

  cocktailName.textContent = cocktail.strDrink || "Nom inconnu";
  cocktailCategory.textContent = cocktail.strCategory || "Catégorie inconnue";
  cocktailAlcohol.textContent = cocktail.strAlcoholic || "Type inconnu";
  cocktailGlass.textContent = cocktail.strGlass || "Verre inconnu";
  cocktailInstructions.textContent =
    cocktail.strInstructionsFR ||
    cocktail.strInstructions ||
    "Aucune instruction disponible.";

  ingredientsList.innerHTML = "";

  const ingredients = extractIngredients(cocktail);

  ingredients.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    ingredientsList.appendChild(li);
  });

  cocktailCard.classList.remove("hidden");
}

function extractIngredients(cocktail) {
  const result = [];

  for (let i = 1; i <= 15; i += 1) {
    const ingredient = cocktail[`strIngredient${i}`];
    const measure = cocktail[`strMeasure${i}`];

    if (ingredient && ingredient.trim() !== "") {
      result.push(
        `${measure ? measure.trim() : ""} ${ingredient.trim()}`.trim()
      );
    }
  }

  return result;
}

function setStatus(message) {
  statusMessage.textContent = message;
}

function hideCard() {
  cocktailCard.classList.add("hidden");
}

fetchRandomCocktail();
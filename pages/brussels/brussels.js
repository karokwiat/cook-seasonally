export default () => {
  const content = document.querySelector(".content");
  
  //global variable declaration to handle getting the last fetch object
  let latestFetchObject = "";

  fetch("./pages/brussels/brussels.html")
  .then((response) => response.text())
  .then((mainHtml) => {
    content.innerHTML = mainHtml;
  
    const recipeContainer = document.querySelector('.recipe-container');
    const filterSection = document.querySelector('.filter');
    const listOfMealTypes = document.querySelector('.meals');
    const listOfIngredients = document.querySelector('.ingredients');
    const clearBtn = document.querySelector('#clear');
    const filterBtns = document.querySelectorAll('.filterbtn');
    
    const spinners = document.querySelectorAll('.spinner');
    hideSpinners();
    
    const noRecipePrompt = document.querySelector("h4.prompt");
    noRecipePrompt.style.display = "none";
    
    const displayMore = document.querySelector('.more-btn')
    displayMore.style.display = "none";
    
    let selectedMealTypes = [];
    let selectedIngredients = [];

    const mealFilters = getMealFilters();
    const ingredientsFilters = getIngredientsFilters();
    const url = buildUrl(mealFilters, ingredientsFilters);
    
    fetch(url)
      .then((Response) => Response.json())
      .then((recipesObject) => {
        latestFetchObject = recipesObject;
        renderRecipes(recipesObject);
      });
    
    filterBtns.forEach((filterBtn) => {
      filterBtn.addEventListener("click", () => {         
        const mealFilters = getMealFilters();
        const ingredientsFilters = getIngredientsFilters();
        const url = buildUrl(mealFilters, ingredientsFilters);
        fetch(url)
          .then((Response) => {
            displaySpinners();
            return Response.json()})
          .then((recipesObject) => {
            recipeContainer.innerHTML = "";
            latestFetchObject = recipesObject;
            renderRecipes(recipesObject)
          });
      })
    })

    clearBtn.addEventListener("click", () => {
      clearFilters();
      noRecipePrompt.style.display = "none";
      const mealFilters = getMealFilters();
      const ingredientsFilters = getIngredientsFilters();
      const url = buildUrl(mealFilters, ingredientsFilters);
      fetch(url)
        .then((Response) => Response.json())
        .then((recipesObject) => {
          recipeContainer.innerHTML = "";
          latestFetchObject = recipesObject;
          renderRecipes(recipesObject)
        });
    })

    displayMore.addEventListener("click", () => {
      const url = latestFetchObject._links.next.href;
      fetch(url)
      .then((Response) => Response.json())
      .then((recipesObject) => {
        latestFetchObject = recipesObject;
        renderRecipes(recipesObject)
      });
    });

    function buildUrl(mealFilters, ingredientsFilters){
      return `https://api.edamam.com/api/recipes/v2?type=public&beta=true&q=${ingredientsFilters}&app_id=481fe9c2&app_key=7e393d1e03d7db982cc7356ec0ea9510&ingr=5-6&health=vegetarian${mealFilters}&co2EmissionsClass=B`;
    }

    function getMealFilters(){
      const checked = document.querySelectorAll('.meal-checkbox[type="checkbox"]:checked')
      selectedMealTypes = Array.from(checked).map(x => x.value)
      let stringOfSelectedMealTypes = '';
      if(selectedMealTypes.length > 0){
        stringOfSelectedMealTypes = '&mealType=' + selectedMealTypes.join('&mealType=')
      };
      return stringOfSelectedMealTypes;
    }
    
    function getIngredientsFilters(){
      const checked = document.querySelectorAll('.ingredients-checkbox[type="checkbox"]:checked');
      selectedIngredients = Array.from(checked).map(x => x.value);
      const stringOfSelectedIngredients = selectedIngredients.join('%2C%20');
      return stringOfSelectedIngredients;
    }

    function clearFilters(){
      const listOfCheckboxes = document.querySelectorAll('input[type="checkbox"]');
      listOfCheckboxes.forEach((checkbox) => checkbox.checked=false);
    }

    function hideSpinners(){
      spinners.forEach((loader) => loader.style.display = "none");
    }

    function displaySpinners(){
      spinners.forEach((loader) => loader.style.display = "inline");;
    }

    function renderRecipes(recipesObject){
      hideSpinners();
      if (recipesObject.count === 0){
        noRecipePrompt.style.display = "block";
      } else {
      displayMore.style.display = "block";

      // see this html code part in the .html file -> commented code block
      recipesObject.hits.forEach(recipe => {
        const recipeArticle = document.createElement("article");
        recipeArticle.classList.add('article-card');
        recipeContainer.appendChild(recipeArticle);
        const imageFigure = document.createElement("figure");
        imageFigure.classList.add('article-image');
        imageFigure.addEventListener("click", () => window.location.replace(recipe.recipe.url));
        recipeArticle.appendChild(imageFigure);
        const image = document.createElement("img");
        imageFigure.appendChild(image)
        image.src = recipe.recipe.image;
        image.alt = `Picture of ${recipe.recipe.label}`;
        const articleContent = document.createElement("div");
        articleContent.classList.add('article-content');
        recipeArticle.appendChild(articleContent);
        const category = document.createElement("a");
        articleContent.appendChild(category);
        category.classList.add('card-category');
        category.innerHTML = recipe.recipe.dishType[0];
        const recipeTitle = document.createElement("h3");
        articleContent.appendChild(recipeTitle);
        const recipeTitleLink = document.createElement("a");
        recipeTitle.appendChild(recipeTitleLink);
        recipeTitleLink.href = recipe.recipe.url;
        recipeTitleLink.innerHTML = recipe.recipe.label;
        const timeToPrepare = document.createElement("p");
        articleContent.appendChild(timeToPrepare);
        timeToPrepare.innerHTML = `Total time to prepare: ${recipe.recipe.totalTime} min.`;
      })
    }
    }

  });
};
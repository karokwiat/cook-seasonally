export default () => {
  const content = document.querySelector(".content");
  let url = "";

  fetch("./pages/pumpkin/pumpkin.html")
    .then((response) => response.text())
    .then((pumpkinHtml) => {
      content.innerHTML = pumpkinHtml;

      const recipeContainer = document.querySelector('.recipe-container');
      const searchSection = document.querySelector('.search-boxes');
      const messageLine = document.createElement("h4");
      searchSection.appendChild(messageLine);
      const listOfMealTypes = document.querySelector('.meals');
      const listOfIngredients = document.querySelector('.ingredients');
      const filterBtns = document.querySelectorAll('.filterbtn');
      const clearBtn = document.querySelector('#clear');
      const displayMore = document.querySelector('.more')
      let selectedMealTypes = [];
      let selectedIngredients = [];

      url = getUrl();
      fetchData(url);
      
      filterBtns.forEach((filterBtn) => {
        filterBtn.addEventListener("click", () => {
          url = getUrl();
          fetchData(url);
        })
      })

      clearBtn.addEventListener("click", () => {
        uncheckAllCheckboxes();
        messageLine.innerHTML = "";
        url = getUrl();
        fetchData(url);
      })

      function getUrl(){
        const stringOfSelectedMealTypes = getStringOfSelectedMealTypes();
        const stringOfSelectedIngredients = getStringOfSelectedIngredients();
        return `https://api.edamam.com/api/recipes/v2?type=public&beta=true&q=${stringOfSelectedIngredients}&app_id=481fe9c2&app_key=7e393d1e03d7db982cc7356ec0ea9510&ingr=5-6&health=vegetarian${stringOfSelectedMealTypes}&co2EmissionsClass=B`;
      }

      function getStringOfSelectedMealTypes(){
        const checked = document.querySelectorAll('.meal-checkbox[type="checkbox"]:checked')
        selectedMealTypes = Array.from(checked).map(x => x.value)
        let stringOfSelectedMealTypes = '';
        if(selectedMealTypes.length > 0){
          stringOfSelectedMealTypes = '&mealType=' + selectedMealTypes.join('&mealType=')
        };
        return stringOfSelectedMealTypes;
      }

      function getArrayofSelectedIngredients(){
        const checked = document.querySelectorAll('.ingredients-checkbox[type="checkbox"]:checked');
        return Array.from(checked).map(x => x.value);
      }
      
      function getStringOfSelectedIngredients(){
        selectedIngredients = getArrayofSelectedIngredients();
        const stringOfSelectedIngredients = selectedIngredients.join('%2C%20');
        return stringOfSelectedIngredients;
      }

      function uncheckAllCheckboxes(){
        const listOfCheckboxes = document.querySelectorAll('input[type="checkbox"]');
        listOfCheckboxes.forEach((checkbox) => checkbox.checked=false);
      }

      function fetchData(url){
        fetch(url) 
        .then((Response) => Response.json())
        .then((recipesObject) => {
          recipeContainer.innerHTML = "";
          renderRecipes(recipesObject);
          
          displayMore.addEventListener("click", () => {
            url = recipesObject._links.next.href;
            fetchMoreData(url);
          });
          });
      }

      function fetchMoreData(url){
        fetch(url) 
        .then((Response) => Response.json())
        .then((recipesObject) => {
          console.log(recipesObject);
          renderRecipes(recipesObject);
          });
      }

      function renderRecipes(recipesObject){
        console.log(recipesObject);
        if (recipesObject.count === 0){
          messageLine.innerHTML = "We are sorry, there is no such recipe.";
        }
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

    });
};
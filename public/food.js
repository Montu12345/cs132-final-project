/**
 * CS 132
 * Name: Shevali Kadakia
 * Final Project
 * JS for the website. Connects with the app.js for API access
 * to get data to populate menu, and takes care of form submission on contact
 * me page.
 */

(function() {
    "use strict";

    const BASE_URL = "/";
    const ADMIN_PAGE = "Admin Page";
    const CUSTOMER_PAGE = "Customer Page";
    const CONTACT_PAGE = "Contact Page";
    const SAVORY_FOODS = "savory-foods";
    const SWEET_FOODS = "sweet-foods";
    const HEALTHY_FOODS = "healthy-foods";

    /**
     * Initiates event listeners for certain buttons depending on which 
     * page is open. Also starts populating the appropriate pages with the menu.
     * 
     * @param none.
     * @returns none.
     */
    function init() {
        // Declaring variables
        let pageHeader = qs("h2").textContent;

        // Setting up pages
        if ((pageHeader == ADMIN_PAGE) || (pageHeader == CUSTOMER_PAGE)) {
          
          // Defining Variables
          let savoryBackButtn = qs("#back-btn");

          // Populating Cards
          getCards(SAVORY_FOODS);
          getCards(SWEET_FOODS);
          getCards(HEALTHY_FOODS);
          
          // Adding event listener for switching views between single item and 
          // menu
          savoryBackButtn.addEventListener("click", toggleViewSingleVsMenu);
        }
        
        if (pageHeader == CONTACT_PAGE) {

          // Defining Variables
          let contactButton = qs("#contact-form");

          // Adding event listener for submitting form
          contactButton.addEventListener("submit", function(evt) {
            evt.preventDefault();
            contactMe();
          });
        }


        if (pageHeader == CUSTOMER_PAGE) {

          // Defining Variables
          let searchButton = qs("#search-go");

          // Adding event listener for search bar
          searchButton.addEventListener("click", specfics);
        }
    }

     /**
     * Function that filters the foods based on the dropdown options:
     * savory food
     * sweet food
     * healthy food
     * all foods
     * @param none.
     * @returns none.
     */
    function specfics() {
      // Defining variables
      let foodSection = document.getElementById("foods-section");
      let chosenFilter = qs("#filter-dropdown").value;

      foodSection.innerHTML = "";
      
      if (chosenFilter == "all") {
          getCards(SAVORY_FOODS);
          getCards(SWEET_FOODS);
          getCards(HEALTHY_FOODS);
      }
      else {
        getCards(chosenFilter);
      }
    }

    /**
     * Changes the view between menu view and single item view.
     * @param none.
     * @returns none.
     */
    function toggleViewSingleVsMenu() {
        // Defining Variables
        let singleFood = document.getElementById("singular-food");
        let pageHeader = qs("h2").textContent;
        let menu = null;
        if (pageHeader == ADMIN_PAGE) {
          menu = document.getElementById("foods-section");
        }
        else {
          menu = document.getElementById("menu-disp");
        }

        // Toggling hidden class
        singleFood.classList.toggle("hidden");
        menu.classList.toggle("hidden");
    }

    /**
     * Populates the menu by fetching data from the API (app.js). Creates the 
     * cards on the menu based on the food type ex: 
     * savory-foods, sweet-foods, healthy-foods.
     * @param {string} - foodType Name: food type
     * @returns none.
     */
    async function getCards(foodTypeName) {
        // Getting image path
        let url = BASE_URL + foodTypeName + "-images";

        try {
          let resp = await fetch(url);
          checkStatus(resp);
          resp = await resp.text();
          createBox(resp);
        } catch {
          throw Error("Error in getting cards!");
        }
    }

    /**
     * Creates the menu after the data has been fetched from the API.
     * @param {string} - paths: path to the folder with foods from a certain 
     * category.
     * @returns none.
     */
    function createBox(paths) {
        // Defining Variables
        let foodSection = qs("#foods-section");
        let splitPaths = paths.split("\n");

        // Iterating through all images in paths
        for (let i = 0; i < splitPaths.length; i++) {

          // Defining Variables
          let breakdownPath = splitPaths[i].split("/");
          let foodType = breakdownPath[1];
          let imageNamePNG = breakdownPath[2];
          let imageName = imageNamePNG.substring(0, imageNamePNG.length - 4);
          let newArticle = document.createElement("article");

          createOneBox(newArticle, imageNamePNG, foodType);
          newArticle.setAttribute("class", "food");
          foodSection.appendChild(newArticle);

          // If image on menu is clicked
          newArticle.addEventListener("click", function() {
            // Change view to single item
            toggleViewSingleVsMenu();

            // Recreate food card in single view
            let singleViewArticle = qs("#single-food-article");
            createOneBox(singleViewArticle, imageNamePNG, foodType);
            if ((qs("h2")).textContent == ADMIN_PAGE) {
              radioSelectionButtonOptions(foodType, imageName);
            }
          });
        }
    }

    /**
     * Creates one of the menu boxes (for one item).
     * @param {documentElement} - article: the article to populate card
     * information into.
     * @param {string} - imageNamePNG: the name of the image with ".png"
     * @param {string} - foodType: the item's food category
     * @returns none
     */
    function createOneBox(article, imageNamePNG, foodType) {
      // Resetting the single view
      article.innerHTML = "";

      // Creating necessary elements for thee card
      let newH3 = document.createElement("h3");
      let newImg = document.createElement("img");
      let newPar = document.createElement("p");
      
      // Getting image source path
      let relativePath = foodType + "/" + imageNamePNG;
      
      // Isolating image name from path
      let imageName = imageNamePNG.substring(0, imageNamePNG.length - 4);
      
      // Getting formatted food name
      let properName = getNameFromImg(imageName);
      newH3.textContent = properName;

      // Setting appropriate attributes
      newImg.setAttribute("src", relativePath);
      newImg.setAttribute("class", "food-img");
      newImg.setAttribute("alt", properName + " Image");
      
      // Getting food description
      getDescription(newPar, foodType, imageName);

      // Appending items as necessary
      article.appendChild(newH3);
      article.appendChild(newImg);
      article.appendChild(newPar);
    }

    /**
     * Gets the food descriptions from the API.
     * @param {documentElement} - newPar: the paragraph in which the food 
     * description is written
     * @param {string} - food (written with dash in between)
     * @param {string} - foodType: food's category
     * @returns none.
     */
    async function getDescription(newPar, foodType, food) {
      // Setting fetch url
      let url = BASE_URL + "get-description";
      let updates = null;

      // Fetching to get description
      try {
        let resp = await fetch(url);
        checkStatus(resp);
        resp = await resp.json();
        updates = resp[foodType][food]['updates'];
      } 
      catch {
        throw Error("Error in getting descriptions!");
      }
      
      // Setting the description
      returnDesc(newPar, updates);
    }

    /**
     * Updates the paragraph with the appropriate food description.
     * @param {documentElement} - paragraph that needs to update.
     * @param {string} - description of the food.
     * @returns none.
     */
    function returnDesc(descObj, desc) {
      descObj.textContent = "Updates: " + desc;
    }

    /**
     * Extracts the name given the image name (ex: savory-foods to Savory Foods)
     * @param {string} - image name
     * @returns {string} - food name.
     */
    function getNameFromImg(imgName) {
      // Splitting the name 
      let names = imgName.split("-");
      
      // Initializing coreect name
      let newName = "";

      // Iterating through parts in name
      for (let i = 0; i < names.length; i++) {
          let subString = ""
          let currentName = names[i];

          // Don't add space at the end of the last word
          if (i == names.length - 1) {
            subString = currentName.substring(1, currentName.length);
          }

          // Add space at the end of all other words
          else {
            subString = currentName.substring(1, currentName.length) + " ";
          }
          // Capitalizing the first letter of each word
          newName += (currentName[0]).toUpperCase() + subString;
      }
      return newName;
    }

    /**
     * Fetches the appropriate possible customizations for the foods and updates
     * the radio buttons accordingly.
     * @param {string} - foodType: category of food
     * @param {string} - imageName: name of image
     * @returns none.
     */
    async function radioSelectionButtonOptions(foodType, imageName) {
      // Creating url to fetch
      let url = BASE_URL + "get-description"; 
      let cust1Text = null;
      let cust2Text = null;

      // Fetching
      try {
        let resp = await fetch(url);
        checkStatus(resp);
        resp = await resp.json();

        // Getting text for each possible customization for the the food
        cust1Text = resp[foodType][imageName]['option1'];
        cust2Text = resp[foodType][imageName]['option2'];
      } 
      catch {
        throw Error("Error in getting customizations!");
      }
      // Update JSON when update button clicked
      let updateBttn = qs("#update-item");
      updateBttn.addEventListener("click", function() {
        updateDesc(foodType, imageName, cust1Text, cust2Text);
      });

      // Adding customization option
      addRadioButtonOptions(cust1Text, cust2Text);
    }

    /**
     * Updates the text of the labels for the radio button.
     * @param {string} - cust1Text: first customization.
     * @param {string} - cust1Text: second customization.
     * @returns none.
     */
    function addRadioButtonOptions(cust1Text, cust2Text) {
      // Getting radio button labels
      let option1 = qs("#option1-p");
      let option2 = qs("#option2-p");

      // Updating radio button labels
      option1.textContent = cust1Text;
      option2.textContent = cust2Text;
    }

    /**
     * Update the description based on the customizations chosen.
     * @param {string} - foodType: category of food.
     * @param {string} - food: food name.
     * @param {string} - cust1Text: first customization.
     * @param {string} - cust1Text: second customization.
     * @returns none.
     */
    function updateDesc(foodType, food, cust1Text, cust2Text) {

      // Getting radio button selection
      let selection1 = qs("input[name='option1-customization']:checked").value;
      let selection2 = qs("input[name='option2-customization']:checked").value;
      
      // Getting label of chosen radio button
      let selection1Label = "label-" + selection1;
      let selection2Label = "label-" + selection2;
      let selection1LabelValue = qs("#"+selection1Label).textContent;
      let selection2LabelValue = qs("#"+selection2Label).textContent;

      // Updating customization accordingly
      if (selection1LabelValue == "Yes" && selection2LabelValue == "Yes") {
        addCustomization(foodType, food, cust1Text, cust2Text);
      }
      else if (selection1LabelValue == "Yes" && selection2LabelValue == "No") {
        addCustomization(foodType, food, cust1Text, "");
      }
      else if (selection1LabelValue == "No" && selection2LabelValue == "Yes") {
        addCustomization(foodType, food, "", cust2Text);
      }
      else {
        removeCustomization(foodType, food);
      }

      // Removing event listener for update button
      let updateBttn = qs("#update-item");
      updateBttn.removeEventListener("click", function() {
        updateDesc(foodType, food, cust1Text, cust2Text);
      });
    }

    /**
     * Takes care of adding a customization using the API.
     * @param {string} - foodType: category of food.
     * @param {string} - food: food name.
     * @param {string} - desc1: first customization.
     * @param {string} - desc2: second customization.
     * @returns none.
     */
    async function addCustomization(foodType, food, desc1, desc2) {
      // Setting parameters
      let params = {"foodType" : foodType, 
                    "food": food, 
                    "desc1" : desc1,
                    "desc2": desc2}

      // Fetching url
      try {   
        let url = BASE_URL + "addCustomization"  
        let resp = await fetch(url, {method : "POST", 
                                     headers: {'Content-Type': 'application/json'},
                                    body : JSON.stringify(params) });
        checkStatus(resp);
      } catch {
          throw Error("Error adding customizations!");
      }
    }

    /**
     * Takes care of adding a removing customizations using the API.
     * @param {string} - foodType: category of food.
     * @param {string} - food: food name.
     * @returns none.
     */
    async function removeCustomization(foodType, food) {
      // Setting parameters
      let params = {"foodType" : foodType, 
                    "food": food}
      // Fetching url
      try {     
        let url = BASE_URL + "removeCustomization";
        let resp = await fetch(url, {method : "POST", 
                                    headers: {
                                        'Content-Type': 'application/json',
                                      },
                                    body : JSON.stringify(params) });
        checkStatus(resp);
      } catch {
          throw Error("Error in removing customizations!");
      }
    }

    /**
     * Stores information from contact me page using API.
     * @param none.
     * @returns none.
     */
    async function contactMe() {
      // Getting form data
      let formData = new FormData(qs("#contact-form"));
      try {       
        let resp = await fetch("/contact", {method : "POST", 
                                           body : formData});
        checkStatus(resp);
        submittedForm();
      } 
      catch {
        throw Error("Error in form!");
      }
    }

    /**
     * Changes the view after the form on contact me page has been submitted.
     * @param none.
     * @returns none.
     */
    function submittedForm() {

        // Getting sections
        let thanksForm = qs("#thanks");
        let contactMe = qs("#contact-me");

        // Toggling view
        thanksForm.classList.toggle("hidden");
        contactMe.classList.toggle("hidden");
    }

    /**
     * Checks the status of the response from the API.
     * @param {Promise} - response from API.
     */
    function checkStatus(response) {
      if (!response.ok) {
        throw Error("Error in Request: " + response.statusText);
      }
    }
    init();
  }());
  
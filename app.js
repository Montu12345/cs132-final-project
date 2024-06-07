/**
 * CS 132
 * Name: Shevali Kadakia
 * Final Project
 * JS for the API connected to public/ that interacts with the JSON files that
 * store the data for the store.
 */
"use strict";

// Importing modules
const express = require("express");
const app = express();
const multer = require("multer");

// For directory-processing
const globby = require("globby");
const fs = require("fs");
const fsp = fs.promises;

// "/" points to "public/" so we can visit "localhost:8000"
app.use(express.static("public"));

// Other required setups
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(multer().none());

const SERVER_ERR_CODE = 500;
const SERVER_ERROR = "Server error, please try again later.";

/**
 * Returns text response of file names in public/savory-foods.
 * Errors with code SERVER_ERR_CODE if there was an issue with directory-processing.
 */
app.get("/savory-foods-images", async (req, res) => {
    try {
      let imageNames = await globby("public/savory-foods");
      let result = imageNames.join("\n");
      res.type("text");
      res.send(result);
    } catch {
        res.status(SERVER_ERR_CODE).send(SERVER_ERROR);
    }
});

/**
 * Returns text response of file names in public/sweet-foods.
 * Errors with code SERVER_ERR_CODE if there was an issue with 
 * directory-processing.
 */
app.get("/sweet-foods-images", async (req, res) => {
  try {
    let imageNames = await globby("public/sweet-foods");
    let result = imageNames.join("\n");
    res.type("text");
    res.send(result);
  } catch {
      res.status(SERVER_ERR_CODE).send(SERVER_ERROR);
  }
});

/**
 * Returns text response of file names in public/healthy-foods.
 * Errors with code SERVER_ERR_CODE if there was an issue with 
 * directory-processing.
 */
app.get("/healthy-foods-images", async (req, res) => {
  try {
    let imageNames = await globby("public/healthy-foods");
    let result = imageNames.join("\n");
    res.type("text");
    res.send(result);
  } catch {
      res.status(SERVER_ERR_CODE).send(SERVER_ERROR);
  }
});

/**
 * Gets the food descriptions and returns them as plain text.
 * Errors with code SERVER_ERR_CODE if there was an issue with 
 * directory-processing.
 */
app.get("/get-description", async (req, res) => {
  try {
    let foodDescriptions = await fsp.readFile("food-descriptions.json", "utf8");
    foodDescriptions = JSON.parse(foodDescriptions);
    res.type("text");
    res.send(foodDescriptions);
  } catch {
      res.status(SERVER_ERR_CODE).send(SERVER_ERROR);
  }
});

/**
 * Allows the admin to add to description of the items. Can add 
 * a maximum of two items.
 * Errors with SERVER_ERR_CODE code if there was a missing parameter or 
 * some other server error.
 */
app.post("/addCustomization", async (req, res) => {
  res.type("text");
  let contents = null;
  let jsonFile = null;
  // Getting the necessary parameters
  let foodType = req.body.foodType;
  let food = req.body.food;
  let desc1 = req.body.desc1;
  let desc2 = req.body.desc2;

  // Checking that they're not null
  if (!(foodType && food)) {
    res.status(SERVER_ERR_CODE).send(Error("Missing POST parameter"));
  }  

  // Reading contents from file
  try {
    jsonFile = "food-descriptions.json";
    contents = await fsp.readFile(jsonFile, "utf8");
    contents = JSON.parse(contents);
  }
  catch {
    res.status(SERVER_ERR_CODE).send(SERVER_ERROR);
  }

  // Updating file as necessary
  if (desc1 != "" && desc2 != "") {
    contents[foodType][food]["updates"] = desc1 + ", " + desc2;
  }
  else if (desc2 == "") {
    contents[foodType][food]["updates"] = desc1;
  }
  else {
    contents[foodType][food]["updates"] = desc2;
  }

  // Rewriting file with updated content
  try {
    await fsp.writeFile(jsonFile, JSON.stringify(contents, null, 2), "utf8");
    res.send(`Request successfull!`);
  } catch {
      res.status(SERVER_ERR_CODE).send(SERVER_ERROR);
  }
});

/**
 * Allows the admin to remove from description of the items.
 * Errors with SERVER_ERR_CODE code if there was a missing parameter or 
 * some other server error.
 */
app.post("/removeCustomization", async (req, res) => {
  res.type("text");
  let contents = null;
  let jsonFile = null;

  // Getting the necessary parameters
  let foodType = req.body.foodType;
  let food = req.body.food;

  // Checking that they're not null
  if (!(foodType && food)) {
    res.status(SERVER_ERR_CODE).send(Error("Missing POST parameter"));
  }  
  // Reading contents from file
  try {
    jsonFile = "food-descriptions.json";
    contents = await fsp.readFile(jsonFile, "utf8");
    contents = JSON.parse(contents);
  }
  catch {
    res.status(SERVER_ERR_CODE).send(SERVER_ERROR);
  }
  
  // Setting customizations to none
  contents[foodType][food]["updates"] = "";

  // Rewriting file with updated content
  try {
    await fsp.writeFile(jsonFile, JSON.stringify(contents, null, 2), "utf8");
    res.send(`Request successfull!`);
  } catch { // some other error occurred
      res.status(SERVER_ERR_CODE).send(SERVER_ERROR);
  }
});

/**
 * Stores the data from the contact me page.
 * Errors with SERVER_ERR_CODE code if there was a missing parameter or some
 * other server error.
 */
app.post("/contact", async (req, res) => {
  res.type("text");

  // Getting the necessary parameters
  let name = req.body.name;
  let email = req.body.email;
  let question = req.body.question;
  let currentData = [];

  // Checking that they're not null
  if (!(name && email && question)) {
    res.status(SERVER_ERR_CODE).send(Error("Missing POST parameter"));
  }

  let jsonFile = "contact.json";

  // Reading contents from file
  try {
    currentData = await fsp.readFile(jsonFile, "utf8");
    currentData = JSON.parse(currentData);
  }
  catch {
    res.status(SERVER_ERR_CODE).send(SERVER_ERROR);
  }
  // Updating file as necessary
  let newItemJSON = {
    "name" : name,
    "email" : email,
    "question" : question
  };
  currentData.push(newItemJSON);

  // Rewriting file with updated content
  try {
    await fsp.writeFile(jsonFile, JSON.stringify(currentData, null, 2), "utf8");
    res.send(`Request successfull!`);
  } catch { // some other error occurred
      res.status(SERVER_ERR_CODE).send(SERVER_ERROR);
  }
});

/**
 * Starting the local server.
 */
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
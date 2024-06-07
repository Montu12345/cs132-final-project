# *LATE NIGHT FOOD* API Documentation
* The API fetches data for the Late Night Food website for CS132 Final Project.

## *Endpoint 1*
**Request Type:** GET

**Returned Data Format**: Plain Text

**Description:** Gets file names of savory foods

**Supported Parameters** None

**Example Request:** fetch("savory-foods-images")

**Example Response:**
```public/savory-foods/fries.png```

**Error Handling:**
Sends 500 error code if error in reading directory.

## *Endpoint 2*
**Request Type:** GET

**Returned Data Format**: Plain Text

**Description:** Gets file names of sweet foods

**Supported Parameters** None

**Example Request:** fetch("sweet-foods-images")

**Example Response:**
```public/sweet-foods/cookies.png```

**Error Handling:**
Sends 500 error code if error in reading directory.

## *Endpoint 3*
**Request Type:** GET

**Returned Data Format**: Plain Text

**Description:** Gets file names of healthy foods

**Supported Parameters** None

**Example Request:** fetch("healthy-foods-images")

**Example Response:**
```public/healthy-foods/fries.png```

**Error Handling:**
Sends 500 error code if error in reading directory.

## *Endpoint 4*
**Request Type:** GET

**Returned Data Format**: Plain Text

**Description:** Gets descriptions of items

**Supported Parameters** None

**Example Request:** fetch("/get-description")

**Example Response:**
```json
{
    "savory-foods": {
        "cheese-pizza": {
        "option1": "More Cheese",
        "option2": "Pineapple",
        "updates": "More Cheese"
        }
    }
}
```

**Error Handling:**
Sends 500 error code if error in reading directory.

## *Endpoint 5*
**Request Format:** POST

**Returned Data Format**: Plain Text

**Description:** Adds customizations to JSON data

**Supported Parameters**
* POST body parameters:
    * param1 - (required) foodType food category
    * param2 - (required) food food
    * param3 - (required) desc1 customization 1
    * param4 - (required) desc2 customization 2
    
**Example Request:** 
let params = {"foodType" : foodType, 
                    "food": food, 
                    "desc1" : desc1,
                    "desc2": desc2}

fetch(url, {method : "POST", 
            headers: {'Content-Type':         'application/json'},
            body : JSON.stringify(params) });

**Example Response:** "Request Successful!"

**Error Handling:**
Sends 500 error code if error in reading directory.

## *Endpoint 6*
**Request Format:** POST

**Returned Data Format**: Plain Text

**Description:** Removes customizations to JSON data

**Supported Parameters**
* POST body parameters:
    * param1 - (required) foodType food category
    * param2 - (required) food food
    
**Example Request:** 
let params = {"foodType" : foodType, 
                    "food": food}

fetch(url, {method : "POST", 
            headers: {'Content-Type':         'application/json'},
            body : JSON.stringify(params) });

**Example Response:** "Request Successful!"

**Error Handling:**
Sends 500 error code if error in reading directory.

## *Endpoint 7*
**Request Format:** POST

**Returned Data Format**: Plain Text

**Description:** Adds feedback from contact page to JSON data

**Supported Parameters**
* POST body parameters:
    * param1 - (required) name name
    * param2 - (required) email email
    * param3 - (required) question feedback
    
**Example Request:** 
let params = {"name" : "asdf asdf", 
              "email": "asdf@example.com", 
              "question" : "Page not working"}

fetch(url, {method : "POST", 
            headers: {'Content-Type':         'application/json'},
            body : JSON.stringify(params) });

**Example Response:** "Request Successful!"

**Error Handling:**
Sends 500 error code if error in reading directory.
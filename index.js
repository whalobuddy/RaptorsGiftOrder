// import dependencies
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

// set up Express Validator
const { check, validationResult } = require('express-validator');

// set up varaibles to use packages
var raptorMerch = express();
raptorMerch.use(bodyParser.urlencoded({extended:false}));

// set up path to public folder and view folder
raptorMerch.set('views', path.join(__dirname, 'views'));

//use public folder for CSS etc.
raptorMerch.use(express.static(__dirname+'/public'));
raptorMerch.set('view engine', 'ejs');

raptorMerch.get('/', function(req, res){
    res.render('form');
});

// Define regular expressions
var phoneRegex = /^[0-9]{3}\-?[0-9]{3}\-?[0-9]{4}$/;
var postCodeRegex = /^[a-zA-Z]\d[a-zA-Z]\s\d[a-zA-Z]\d$/;
var creditCardRegex = /^(\d{4}\-){3}\d{4}$/;

// function of regex validation
function checkRegex(userInput, regex) {
    return regex.test(userInput);
}

// function of custom phone validation
function customPhoneValidation(value) {
    if (!checkRegex(value, phoneRegex)) {
      throw new Error("Phone number should be xxx-xxx-xxxx.");
    }
    return true;
  }

// function of custom password validation
function customPasswordValidation(value) {
    if (String(value).length < 8) {
        throw new Error("A minimum length of 8 characters is required for your password.");
    }
    return true;
}

// function of custom password match validation
function customPasswordMatchValidation(value, { req }) {
    var confirmPassword = req.body.confirmPassword;
    if (value != confirmPassword) {
        throw new Error("The two password entries do NOT match.");
    }
    return true;
}

// function of custom credit card validation
function customCreditCardValidation(value) {
    if (!checkRegex(value, creditCardRegex)) {
        throw new Error("Please enter a valid credit card number.");
    }
    return true;
}

// function of custom post code validation
function customPostCodeValidation(value) {
    if (!checkRegex(value, postCodeRegex)) {
        throw new Error("Please enter a valid post code in the required format.");
    }
    return true;
}
// merchandise prices
const HAT_PRICE = 5;
const JERSEY_PRICE = 10;

// function of checking if total cost is less than $10
function customTotalCostValidation(value, { req }) {
  var hat = req.body.hat;
  if (hat * HAT_PRICE + value * JERSEY_PRICE < 10) {
    throw new Error("The minimum pre-tax purchase is $10.");
  }
  return true;
}

raptorMerch.post("/", [
      check("name", "Please enter your name.").notEmpty(),
      check("address", "Please enter address.").notEmpty(),
      check("city", "Please enter city.").notEmpty(), 
      check("province", "Please select a province.").notEmpty(),
      check("postCode").custom(customPostCodeValidation),
      check("email", "Please enter a valid email.").isEmail(),
      check("phone").custom(customPhoneValidation),
      check("password").custom(customPasswordValidation),
      check("password").custom(customPasswordMatchValidation),
      check("cardNumber").custom(customCreditCardValidation),
      check("jersey").custom(customTotalCostValidation)
    ], function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) 
        {
            res.render("form", {
            errors: errors.array(),
            });
        } 
        else 
        {
            var name = req.body.name;
            var email = req.body.email;
            var phone = req.body.phone;
            var address = req.body.address;
            var city = req.body.city;
            var province = req.body.province;
            var postCode = req.body.postCode;
            var password = req.body.password;
            var confirmPassword = req.body.confirmPassword;
            var jersey = req.body.jersey;
            var hat = req.body.hat;
            var cardNumber = req.body.cardNumber;

            // tax rate by province
            switch (province) 
            {
                case 'AB':
                    provinceRate = 5;
                    break;
                case 'BC':
                    provinceRate = 12;
                    break;
                case 'MB':
                    provinceRate = 12;
                    break;
                case 'NB':
                    provinceRate = 15;
                    break;
                case 'NL':
                    provinceRate = 15;
                    break;
                case 'NT':
                    provinceRate = 5;
                    break;
                case 'NS':
                    provinceRate = 15;
                    break;
                case 'NU':
                    provinceRate = 5;
                    break;
                case 'ON':
                    provinceRate = 13;
                    break;
                case 'PE':
                    provinceRate = 15;
                    break;
                case 'QC':
                    provinceRate = 14.975;
                    break;
                case 'SK':
                    provinceRate = 11;
                    break;
                case 'YT':
                    provinceRate = 5;
                    break;
                default:
                    provinceRate = 0;
                    break;
            }

            // calc total
            var subtotal = HAT_PRICE * hat + JERSEY_PRICE * jersey;
            var tax = subtotal * provinceRate / 100;
            var total = subtotal + tax;

            var pageData = {
                name: name,
                email: email,
                phone: phone,
                address: address,
                city: city,
                province: province,
                postCode: postCode,
                password: password,
                confirmPassword: confirmPassword,
                jersey: jersey,
                hat: hat,
                cardNumber: cardNumber,
                subtotal: subtotal,
                tax: tax,
                total: total
            };
            res.render("form", pageData);
        }
    }
);

// start the server and listen at a port
raptorMerch.listen(8080);

// execution successful message
console.log('Execution is completed successfully! Listening at localhost:8080');
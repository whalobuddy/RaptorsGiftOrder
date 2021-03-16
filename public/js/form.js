const HAT_PRICE = 5;
const JERSEY_PRICE = 10;

var creditCardRegex = /^(\d{4}\-){3}\d{4}$/;
var emailRegex = /^[0-9a-zA-Z]+@[0-9a-zA-Z]+\.[0-9a-zA-Z]+$/;
var postCodeRegex = /^[a-zA-Z]\d[a-zA-Z]\s\d[a-zA-Z]\d$/;

function formSubmit() {
    return true;
    // fetch all input values
    var name = document.getElementById('name').value;
    var address = document.getElementById('address').value;
    var city = document.getElementById('city').value;
    var province = document.getElementById('province').value;
    var provinceRate;
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
    var postCode = document.getElementById('postCode').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirmPassword').value;
    var jersey = document.getElementById('jersey').value;
    var hat = document.getElementById('hat').value;
    var creditCardNum = document.getElementById('cardNumber').value;
    var comment = document.getElementById('comment').value;
    
    var errors = ''; // declare errors with empty string
    if (name == '') {
        errors += `Please enter your name.<br>`;
    }
    
    if (address == '') {
        errors += `Please enter your address.<br>`;
    }
    
    if (city == '') {
        errors += `Please enter your city.<br>`;
    }
    
    if (province == '') {
        errors += `Please select your province.<br>`;
    }
    
    if (!postCodeRegex.test(postCode)) {
        errors += `Please enter a valid post code in the required format.<br>`;
    }
    
    if (!emailRegex.test(email)) {
        errors += `Please enter a valid email address. eg: test@test.com<br>`;
    }
    
    if (password.length < 8) {
        errors += `A minimum length of 8 characters is required for your password.<br>`
    }
    
    if (password != confirmPassword) {
        errors += `The two password entries do NOT match.<br>`;
    }
    
    var totalPrice = parseInt(jersey) * JERSEY_PRICE + parseInt(hat) * HAT_PRICE;
    if (totalPrice < 10) {
        errors += `The minimum pre-tax purchase is $10. Your current pre-tax total is $${totalPrice}.<br>`;
    }
    
    if (!creditCardRegex.test(creditCardNum)) {
        errors += `Please enter a valid credit card number in the required format.<br>`;
    }
    
    if (errors != '') {
        document.getElementById('errors').innerHTML = errors;
        document.getElementById('receipt').innerHTML = ''; // remove previous receipt if errors occur
    } else {
        document.getElementById('errors').innerHTML = '';
        var priceAfterTax = totalPrice * (1 + parseFloat(provinceRate)/100);
        
        var receiptOutput = ''; // declare receiptOutput var starting with empty
        receiptOutput += `Thank you for your order!<br><br>
                          Name: ${name}<br>
                          Address: ${address}<br>
                          City: ${city}<br>
                          Province: ${province}<br>
                          Post Code: ${postCode}<br>
                          Email: ${email}<br>
                          Number of Jersey ordered: ${jersey}<br>
                          Number of Hat ordered: ${hat}<br>
                          Price pre-tax: $${totalPrice.toFixed(2)}<br>
                          Total after tax: $${priceAfterTax.toFixed(2)}<br>
                          Comment: ${comment}<br>`
        
        document.getElementById('receipt').innerHTML = receiptOutput;
    }
    
    return false;
}
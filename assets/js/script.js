// Elements
var searchBtnEl = $('#search-btn');

// Search for a city
var searchCity = function (event) {
    event.preventDefault();
    // get input from the user
    var inputCity = $('#input-city').val().trim();
    if (!inputCity) {
        console.log('You must type in a city name');
        return;
    } else {
        console.log(inputCity);
    }
    // fetch data from openWeatherAPI
    
    // call function to display data

    // call function to save user search as a favorite city in the list

}

searchBtnEl.on('click', searchCity);
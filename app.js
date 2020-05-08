$(document).ready(function(){
getGeolocation();
    function getGeolocation(){
    $.ajax({
        url: 'http://free.ipwhois.io/json/',
        method: 'GET'

    }).then(function(response){
      console.log(response);
      getBreweries(response.city);
      $('body').append(response.city);
    });
};

function getBreweries(city){
   console.log(city);
    var queryURL = 'https://api.openbrewerydb.org/breweries?by_city=' + 'New York' ;
   
    
    $.ajax({
    url: queryURL,
    method: "GET"
    }).then(function(response) {
    console.log(response);
    
    $('body').append( '<div>' +  response[9].name + '</div>'  + '  <div>' +  response[9].brewery_type + '   </div>' + '  <div>' +  response[9].street + '   </div>');
    
    });
};

});
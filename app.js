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
    var queryURL = 'https://api.openbrewerydb.org/breweries?by_city=' + city ;
   
    
    $.ajax({
    url: queryURL,
    method: "GET"
    }).then(function(response) {
    console.log(response);
    
    $('body').append( '<div>' +  response[0].name + '</div>'  + '  <div>' +  response[0].brewery_type + '   </div>' + '  <div>' +  response[0].street + '   </div>');
    
    });
};

getRestaurant();
    function getRestaurant(){
        $.ajax({
        url: 'https://opentable.herokuapp.com/api/restaurants',
        method: 'GET'

    }).then(function(response){
      console.log(response);
    
    });
};


mapboxgl.accessToken = 'pk.eyJ1IjoiY2FybG9zcmVtYTIiLCJhIjoiY2s5em5zZjB2MGN2bTNncDYyM2Ruc2FyZSJ9.piNzfWJ9-dRIsVM3le57gg';
var map = new mapboxgl.Map({
container: 'map', // container id
style: 'mapbox://styles/mapbox/streets-v11',
center: [-87.64,41.88], // starting position
zoom: 13 // starting zoom
});
 // Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());


});
$(document).ready(function(){
getGeolocation();
    function getGeolocation(){
    $.ajax({
        "async": true,
        "crossDomain": true,
        "url": "https://ip-geolocation-ipwhois-io.p.rapidapi.com/json/",
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "ip-geolocation-ipwhois-io.p.rapidapi.com",
            "x-rapidapi-key": "4160692450msh57c7f939866117fp13f0ccjsn2faf3ca7bcb3"
        }
    }).then(function(response){
      console.log(response);
      getBreweries(response.city);
      $('body').append(response.city);
      $('body').append(response.latitude);
      $('body').append(response.longitude);

        mapboxgl.accessToken = 'pk.eyJ1IjoiY2FybG9zcmVtYTIiLCJhIjoiY2s5em5zZjB2MGN2bTNncDYyM2Ruc2FyZSJ9.piNzfWJ9-dRIsVM3le57gg';
        var map = new mapboxgl.Map({
        container: 'map', // container id
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [response.longitude,response.latitude], // starting position
        zoom: 9 // starting zoom
    });
        // Add zoom and rotation controls to the map.
        map.addControl(new mapboxgl.NavigationControl());
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

$('#search').on('click', function(){
    var city = $('#searchBrewery').val();
    console.log(city);
    getBreweries(city.trim());
})

$('#searchBrewery').keypress(function (e) {
    if (e.which == 13) {
        var city = $('#searchBrewery').val();
        console.log(city);
        getBreweries(city.trim());
      return false;
    }
  });





});
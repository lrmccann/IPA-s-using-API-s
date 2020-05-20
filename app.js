$(document).ready(function () {
    getGeolocation();
    var coords = []
    var city = '';

    console.log(coords);
    function getGeolocation() {
        $.ajax({
            "async": true,
            "crossDomain": true,
            "url": "https://ip-geolocation-ipwhois-io.p.rapidapi.com/json/",
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "ip-geolocation-ipwhois-io.p.rapidapi.com",
                "x-rapidapi-key": "4160692450msh57c7f939866117fp13f0ccjsn2faf3ca7bcb3"
            }
        }).then(function (response) {
            //console.log(response);
            var type = [];
            city = response.city;
            getBreweries(response.city, type);

            mapboxgl.accessToken = 'pk.eyJ1IjoiY2FybG9zcmVtYTIiLCJhIjoiY2s5em5zZjB2MGN2bTNncDYyM2Ruc2FyZSJ9.piNzfWJ9-dRIsVM3le57gg';
            var map = new mapboxgl.Map({
                container: 'map', // container id
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [response.longitude, response.latitude], // starting position
                zoom: 9 // starting zoom
            });
            
            map.addControl(new mapboxgl.NavigationControl());
        });
    };

    function getBreweries(city) {
        console.log(city);
        var queryURL = 'https://api.openbrewerydb.org/breweries?by_city=' + city;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            $('.emptydiv').empty();
            $('.name').empty();
            $('.brewery_type').empty();
            $('.street').empty();
            $('.favoriteButton').empty();

            console.log(response);

            if (response.length === 0) {
                $("#myModal").modal();
            }
            var i = 0;
            while (i < response.length && i < 10) {
                if (response[i].brewery_type === "planning") { i++; continue; };
                $('.emptydiv').append(`<div class="resultItem" id="result" ><a href='#${response[i].name}' id='${response[i].name}' ><div class = 'name ${i}'> ${response[i].name} </div></a> <div class = 'brewery_type'>   ${response[i].brewery_type}   </div> <div class = 'street'>  ${response[i].street} </div> <div class = "favoriteButton btn btn-primary"> Add To Wish List</div></div>`);

                i++
               
            }
        });
    };
    
    function getaddressLocation(addy, city) {
     
        var queryURL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'+addy+' '+city+'.json?country=US&access_token=pk.eyJ1IjoiY2FybG9zcmVtYTIiLCJhIjoiY2s5em5zZjB2MGN2bTNncDYyM2Ruc2FyZSJ9.piNzfWJ9-dRIsVM3le57gg';

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            
            mapboxgl.accessToken = 'pk.eyJ1IjoiY2FybG9zcmVtYTIiLCJhIjoiY2s5em5zZjB2MGN2bTNncDYyM2Ruc2FyZSJ9.piNzfWJ9-dRIsVM3le57gg';

            var map = new mapboxgl.Map({
                container: 'map', // container id
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [response.features[0].center[0], response.features[0].center[1]], // starting position
                zoom: 15 // starting zoom
            });
            // Add zoom and rotation controls to the map.
            map.addControl(new mapboxgl.NavigationControl());
            var marker = new mapboxgl.Marker()
                .setLngLat([response.features[0].center[0], response.features[0].center[1]])
                .addTo(map);
        });
    };

    function onSearch(){
        var city = $('#searchBrewery').val();
            getBreweries(city.trim());
            getaddressLocation('', city);
    }

    $('#searchBrewery').keypress(function (e) {
        if (e.which == 13) {
            onSearch();
            return false;
        };
    });

    $('#search').on('click', function () {
        onSearch();
    });

   

    $('.emptydiv').on("click", '#result', function(){
        // var brewery = $(this).closest('#result').text();
        var addy = $(this).closest('.resultItem').find(".street").text();
        getaddressLocation(addy, city);
});

$('.listSlider').on('click',function(){
    $('.emptydiv').html("");
    var checked = $('input:checked');
    if(checked.length === 0){
        getaddressLocation("", city);
        getBreweries(city);
    } else{
        wishList();
    } 
});
});
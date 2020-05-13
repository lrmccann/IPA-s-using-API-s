$(document).ready(function () {
    getGeolocation();

    var coords = []
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
            getBreweries(response.city, type);

            mapboxgl.accessToken = 'pk.eyJ1IjoiY2FybG9zcmVtYTIiLCJhIjoiY2s5em5zZjB2MGN2bTNncDYyM2Ruc2FyZSJ9.piNzfWJ9-dRIsVM3le57gg';
            var map = new mapboxgl.Map({
                container: 'map', // container id
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [response.longitude, response.latitude], // starting position
                zoom: 9 // starting zoom
            });
            // Add zoom and rotation controls to the map.
            map.addControl(new mapboxgl.NavigationControl());
        });
    };

    function getBreweries(city, type) {
        console.log(city);
        var queryURL = ""
        if(type.length === 0){
            queryURL = 'https://api.openbrewerydb.org/breweries?by_city=' + city;
        } else if(type.length === 1){
            queryURL = 'https://api.openbrewerydb.org/breweries?by_city=' + city + '&by_tag=' +type[0];
        } else{
            var tys = '';
            for(ty in types){
                tys += ty + ','
            }
            queryURL = 'https://api.openbrewerydb.org/breweries?by_city=' + city + '&by_tags=' + tys;;
        }
        
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            $('.name').empty();
            $('.brewery_type').empty();
            $('.street').empty();

            console.log(response);

            if (response.length === 0) {
                $("#myModal").modal();
            }
            var i =0;
            while (i < response.length && i < 10) {
                $('.emptydiv').append(`<a href ='#' ><div class = 'name ${i}'> ${response[i].name} </div></a>  <div class = 'brewery_type'>   ${response[i].brewery_type}   </div>  <div class = 'street'>  ${response[i].street} </div>`);

                var newCoord = {
                    lat: response[i].latitude,
                    lon: response[i].longitude,
                    address: response[i].street
                }
                coords.push(newCoord);
                i++
            }
        });
    };

    function getaddressLocation(nameBrewery, lat, long) {
        console.log(nameBrewery);
        console.log(lat);
        console.log(long);
        var queryURL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + nameBrewery + '.json?proximity=-87.65,41.85&access_token=pk.eyJ1IjoiY2FybG9zcmVtYTIiLCJhIjoiY2s5em5zZjB2MGN2bTNncDYyM2Ruc2FyZSJ9.piNzfWJ9-dRIsVM3le57gg';

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            //console.log(response);

            $('body').append('<div>' + response.features[0].geometry.coordinates[0] + '</div>' + '  <div>' + response.features[0].geometry.coordinates[1] + '   </div>');
            mapboxgl.accessToken = 'pk.eyJ1IjoiY2FybG9zcmVtYTIiLCJhIjoiY2s5em5zZjB2MGN2bTNncDYyM2Ruc2FyZSJ9.piNzfWJ9-dRIsVM3le57gg';

            var map = new mapboxgl.Map({
                container: 'map', // container id
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [response.features[0].geometry.coordinates[0], response.features[0].geometry.coordinates[1]], // starting position
                zoom: 13 // starting zoom
            });
            // Add zoom and rotation controls to the map.
            map.addControl(new mapboxgl.NavigationControl());
        });
    };

    $('#searchBrewery').keypress(function (e) {
        if (e.which == 13) {
            var city = $('#searchBrewery').val();
            var check = $('input:checked');
            typeList = [];
            if(check.length === 0){
                getBreweries(city.trim(), typeList);
            } else{
                typeList = checked();
                getBreweries(city.trim(), typeList);
            } 
            return false;
        };
    });

    $('#search').on('click', function () {
        var city = $('#searchBrewery').val();
        var check = $('input:checked');
        typeList = [];
        if(check.length === 0){
            getBreweries(city.trim(), typeList);
        } else{
            typeList = checked();
            getBreweries(city.trim(), typeList);
        } 
    });
    
    function checked(){
        var checked = $('input:checked');
        var typeList = [];
        $.each(checked, function(){
            var type = $(this).val();
            typeList.push(type);
        });
        return typeList;
    }
});
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
            getBreweries(response.city);
            
    

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

    function getBreweries(city) {
        //console.log(city);
        var queryURL = 'https://api.openbrewerydb.org/breweries?by_city=' + city;


        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            $('.name').empty();
            $('.brewery_type').empty();
            $('.street').empty();
            $('.favoriteButton').empty();


           // console.log(response);
            if (response.length === 0) {
                $("#myModal").modal();




            }
            var i = 0;
            while (i < response.length && i < 10) {
                $('.dynamicAppend').append(`<a href ='#' ><div class = 'name ${i}'> ${response[i].name} </div></a> <div class = 'brewery_type'>   ${response[i].brewery_type}   </div> <div class = 'street'>  ${response[i].street} </div> <div class = "favoriteButton btn btn-primary"> Add To Wish List</div>`);

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
    var wishes = []
    $(document).on("click", '.favoriteButton', function(){
        var previousElements = $(this).prevAll();
        var wish = $(previousElements[2]).children().first().text();
         console.log(wish);
         (wishes).push(wish);
         localStorage.setItem('wish', JSON.stringify(wishes));
          console.log(wishes);
         });

    $('#search').on('click', function () {
        var city = $('#searchBrewery').val();
        console.log(city);
        getBreweries(city.trim());
        //(favorites).push(city)
        //console.log(favorites);
       
    });
    
    var wishList = function (){
        var yourWishes = JSON.parse(localStorage.getItem("wish"));
        if (yourWishes!== null){
            wishes=yourWishes;
            for (var i = 0;i < yourWishes.length; i++){
                $(".dynamicAppend").append(`<li class='list-group-item btn' id='button' >${yourWishes[i]}</li>`);
            }
        }
    }
    wishList();
   

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
            console.log(city);
            getBreweries(city.trim());
            return false;
        };
    });
 
});

// $('#toDoList').on("click", '#delete', function(){
//   $(this).closest(".fullItem").remove();
//   var item = $(this).closest(".fullItem").find("input[id='listItem'").val();
//   console.log(item);
//   removeFromArray(item);
// });


(function () {

var map,
    markers = [],
    infowindows = [],
    placesService,
    currentPosition; 

var $searchForm,
    $placesTypes;

function initialize() {
  var map = new google.maps.Map(document.getElementById('map-canvas'),{
                    zoom: 6,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                  });

  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      currentPosition = new google.maps.LatLng(position.coords.latitude,
                                               position.coords.longitude);
      map.setCenter(currentPosition);         
    }, function() {
      handleNoGeolocation(true);
    });
  } else {
    // Browser doesn't support Geolocation
    handleNoGeolocation(false);
  }

  placesService = new google.maps.places.PlacesService(map);

  $searchForm = $(".search-form");
  $placesTypes= $searchForm.find("select[name=type]");
  $placesTypes.empty();
  getPlacesTypes().forEach(function (item) {
    $("<option>")
        .attr("value", item.values)
        .text(item.type)
        .appendTo($placesTypes);
  });
}

function cleanMap () {
  markers.concat(infowindows).forEach(function (item) {
     item.setMap(null);
  });

  markers = [];
  infowindows = [];
}

function requestSearch (query, pos) {
  var request = {
    location:pos,
    radius: '500',
    query: query    
  };
  placesService.textSearch(request, function (results, status) {
   console.log(results);
   results.forEach(function (result) {
      var marker, info;

      markers.push( marker = new google.maps.Marker({
          position: result.geometry.location,
          map: map
      }));

      infowindows.push(info = new google.maps.InfoWindow({
          map: map,
          content: result.name
      }));

      google.maps.event.addListener(marker, "click", function () {
        infowindows.forEach(function (info) {
          info.close();
        });

        info.open(map, marker);
      });
    })
  });
}

function handleNoGeolocation(errorFlag) {
  if (errorFlag) {
    var content = 'Error: El servicio de Geolocation ha fallado.';
  } else {
    var content = 'Error: Tu browser no soporta geolocation. (Lo abriste con IE???!!! Noooooo)';
  }

  var options = {
    map: map,
    position: new google.maps.LatLng(60, 105),
    content: content
  };

  var infowindow = new google.maps.InfoWindow(options);
  map.setCenter(options.position);
}

/**
 * Returns an Array with types objects
 *   { type, values }
 * Each type is a group of real Google Maps Types.
 *
 */
function getPlacesTypes() {
    var places = [];

    places.push({ type: "Salidas", values : "cafe|casino|food|night_club|museum|restaurant|shopping_mall" });
    places.push({ type: "Util", values : "airport|city_hall|embassy|parking|police"}); 
    places.push({ type: "Salud", values : "hospital|pharmacy|dentist|health"}); 

    return places;
}

google.maps.event.addDomListener(window, 'load', initialize);      

})();

//These are the restaurants that will be shown to the user.
var myLocations = [
  {title: "Snooze an AM Eatery", formatted_address: "2262 Larimer St, Denver, CO 80205, USA", location: {lat: 39.7554577, lng: -104.9888574}},
  {title: "Denver Biscuit Company/Fat Sully's Pizza", formatted_address: "3237 E Colfax Ave, Denver, CO 80206, USA", location: {lat: 39.7403739, lng: -104.9490918}},
  {title: "Fogo de Chao Brazilian Steakhouse", formatted_address: "1513 Wynkoop St, Denver, CO 80202, USA", location: {lat: 39.7514247, lng: -105.0022543}},
  {title: "Maggiano's Little Italy", formatted_address: "500 16th St #150, Denver, CO 80202, USA", location: {lat: 39.7435013, lng: -104.9908943}},
  {title: "The Old Spaghetti Factory", formatted_address: "1215 18th St, Denver, CO 80202, USA", location: {lat: 39.7508253, lng: -104.9941081}},
  {title: "Linger", formatted_address: "2030 W 30th Ave, Denver, CO 80211, USA", location: {lat: 39.7594564, lng: -105.0113582}},
  {title: "True Food Kitchen", formatted_address: "2800 E 2nd Ave #101, Denver, CO 80206, USA", location: {lat: 39.7192194, lng: -104.9543924}},
  {title: "Ted's Montana Grill", formatted_address: "1401 Larimer St, Denver, CO 80202, USA", location: {lat: 39.7475564, lng: -104.9998662}},
  {title: "Ophelia's Electric Soapbox", formatted_address: "1215 20th St, Denver, CO 80202, USA", location: {lat: 39.7526845, lng: -104.9918492}},
  {title: "Lucile's Creole Cafe", formatted_address: "275 S Logan St, Denver, CO 80209, USA", location: {lat: 39.7115175, lng: -104.9831164}}
];

//Global variables
var map;
var markers = [];

function populateInfoWindow(marker, infowindow) {
  //Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    infowindow.marker = marker;
    infowindow.setContent('<div>' + marker.title + '</div><div>' + marker.address + '</div>');
    infowindow.open(map, marker);
    //Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.setMarker = null;
    });
  }
}

function initMap() {
  var myInfoWindow = new google.maps.InfoWindow();
  var bounds = new google.maps.LatLngBounds();

  //Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 39.7438895, lng: -105.0201094},
    zoom: 13,
    mapTypeControl: false
  });

  //The following group uses the location array to create an array of markers on initialize.
  for (var i = 0; i < myLocations.length; i++) {
    //Get the position from the location array.
    var position = myLocations[i].location;
    var title = myLocations[i].title;
    var address = myLocations[i].formatted_address;

    //Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
      map: map,
      position: position,
      title: title,
      address: address,
      animation: google.maps.Animation.DROP,
      id: i
    });
    //Push the marker to our array of markers.
    markers.push(marker);
    //Extend the boundaries of the map for each marker.
    bounds.extend(marker.position);
    //Create an onclick event to open an infoWindow at each marker.
    marker.addListener('click', function() {
      populateInfoWindow(this, myInfoWindow);
    });

    var ViewModel = function() {
      var self = this;

      this.listItems = ko.observableArray();
      for (var i = 0; i < myLocations.length; i++) {
        self.listItems.push(myLocations[i].title);
      }

      self.clickedLocation = function(item) {
        var marker;

        if (item === myLocations[0].title) {
          populateInfoWindow(markers[0], myInfoWindow);
        } else if (item === myLocations[1].title) {
          populateInfoWindow(markers[1], myInfoWindow);
        } else if (item === myLocations[2].title) {
          populateInfoWindow(markers[2], myInfoWindow);
        } else if (item === myLocations[3].title) {
          populateInfoWindow(markers[3], myInfoWindow);
        } else if (item === myLocations[4].title) {
          populateInfoWindow(markers[4], myInfoWindow);
        } else if (item === myLocations[5].title) {
          populateInfoWindow(markers[5], myInfoWindow);
        } else if (item === myLocations[6].title) {
          populateInfoWindow(markers[6], myInfoWindow);
        } else if (item === myLocations[7].title) {
          populateInfoWindow(markers[7], myInfoWindow);
        } else if (item === myLocations[8].title) {
          populateInfoWindow(markers[8], myInfoWindow);
        } else {
          populateInfoWindow(markers[9], myInfoWindow);
        }
      };
    };
  }
  map.fitBounds(bounds);
  ko.applyBindings(new ViewModel());
}

/*const request = require('request');

request({
  url: 'https://api.foursquare.com/v2/venues/explore',
  method: 'GET',
  qs: {
    client_id: 'DT0XBOVKI2P2PN3Q53HO3GZAHC12TKF4NZ42YZFD4N1S4TSC',
    client_secret: 'PQ5S5TGRFZQUAEC5XM3KTGQEEWNP5IB1Y0SY2O1YGFGARZPV',
    ll: '40.7243,-74.0018',
    query: 'coffee',
    v: '20170801',
    limit: 1
  }
}, function(err, res, body) {
  if (err) {
    console.error(err);
  } else {
    console.log(body);
  }
});*/

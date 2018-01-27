//These are the restaurants that will be shown to the user.
var myLocations = [
  {title: "Snooze", category: "", formatted_address: "2262 Larimer St, Denver, CO 80205, USA", location: {lat: 39.7554577, lng: -104.98885740000003}, visibility: ko.observable(true)},
  {title: "Denver Biscuit Company", category: "", formatted_address: "3237 E Colfax Ave, Denver, CO 80206, USA", location: {lat: 39.7403739, lng: -104.94909180000002}, visibility: ko.observable(true)},
  {title: "Fogo de Chão", category: "", formatted_address: "1513 Wynkoop St, Denver, CO 80202, USA", location: {lat: 39.7514247, lng: -105.0022543}, visibility: ko.observable(true)},
  {title: "Maggiano's Little Italy", category: "", formatted_address: "500 16th St #150, Denver, CO 80202, USA", location: {lat: 39.7435013, lng: -104.9908943}, visibility: ko.observable(true)},
  {title: "The Old Spaghetti Factory", category: "", formatted_address: "1215 18th St, Denver, CO 80202, USA", location: {lat: 39.7508253, lng: -104.9941081}, visibility: ko.observable(true)},
  {title: "Linger", category: "", formatted_address: "2030 W 30th Ave, Denver, CO 80211, USA", location: {lat: 39.7594564, lng: -105.0113582}, visibility: ko.observable(true)},
  {title: "True Food Kitchen", category: "", formatted_address: "2800 E 2nd Ave #101, Denver, CO 80206, USA", location: {lat: 39.7192194, lng: -104.9543924}, visibility: ko.observable(true)},
  {title: "Ted's Montana Grill", category: "", formatted_address: "1401 Larimer St, Denver, CO 80202, USA", location: {lat: 39.7475564, lng: -104.9998662}, visibility: ko.observable(true)},
  {title: "Ophelia's Electric Soapbox", category: "", formatted_address: "1215 20th St, Denver, CO 80202, USA", location: {lat: 39.7526845, lng: -104.9918492}, visibility: ko.observable(true)},
  {title: "Lucile's Creole Cafe", category: "", formatted_address: "275 S Logan St, Denver, CO 80209, USA", location: {lat: 39.7115175, lng: -104.9831164}, visibility: ko.observable(true)}
];

//Global variables
var map;
var markers = [];
var bounceTimer;
var myInfoWindow;
var defaultIcon;
var highlightedIcon;

function populateInfoWindow() {
  var marker = this;
  var infowindow = myInfoWindow;
  var streetViewService = new google.maps.StreetViewService();
  var radius = 50;
  // In case the status is OK, which means the pano was found, compute the
  // position of the streetview image, then calculate the heading, then get a
  // panorama from that and set the options
  function getStreetView(data, status) {
    if (status == google.maps.StreetViewStatus.OK) {
      var nearStreetViewLocation = data.location.latLng;
      var heading = google.maps.geometry.spherical.computeHeading(
        nearStreetViewLocation, marker.position);
        infowindow.setContent('<div>' + marker.title + '</div><div>' + marker.address + '</div><div id="pano"></div>');
        var panoramaOptions = {
          position: nearStreetViewLocation,
          pov: {
            heading: heading,
            pitch: 30
          }
        };
      var panorama = new google.maps.StreetViewPanorama(
        document.getElementById('pano'), panoramaOptions);
    } else {
      infowindow.setContent('<div>' + marker.title + '</div><div>' + marker.address + '</div>' +
        '<div>No Street View Found</div>');
    }
  }

  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    // Clear the infowindow content to give the streetview time to load.
    infowindow.setContent('');
    infowindow.marker = marker;
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });
    marker.setAnimation(google.maps.Animation.BOUNCE);


    // Use streetview service to get the closest streetview image within
    // 50 meters of the markers position
    streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
    // Open the infowindow on the correct marker.
    infowindow.open(map, marker);
  }
  //The bounceTimer is to stop the markers bouncing animation after 1500ms.
  bounceTimer = setTimeout(function(){ marker.setAnimation(null); }, 1500);
}

//This function initiates the map.
function initMap() {
  myInfoWindow = new google.maps.InfoWindow();
  var bounds = new google.maps.LatLngBounds();
  var marker;

  //Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 39.7438895, lng: -105.0201094},
    zoom: 13,
    mapTypeControl: false
  });

  // Style the markers a bit. This will be our listing marker icon.
  defaultIcon = makeMarkerIcon('0091ff');
  // Create a "highlighted location" marker color for when the user
  // mouses over the marker.
  highlightedIcon = makeMarkerIcon('FFFF24');

  //The following group uses the location array to create an array of markers on initialize.
  for (var i = 0; i < myLocations.length; i++) {
    //Get the position from the location array.
    var position = myLocations[i].location;
    var title = myLocations[i].title;
    var address = myLocations[i].formatted_address;

    //Create a marker per location, and put into markers array.
    marker = new google.maps.Marker({
      map: map,
      position: position,
      title: title,
      address: address,
      animation: google.maps.Animation.DROP,
      icon: defaultIcon,
      id: i
    });

    //Push the marker to our array of markers.
    markers.push(marker);

    //Extend the boundaries of the map for each marker and InfoWindow.
    bounds.extend(marker.position, myInfoWindow);

    myLocations[i].marker = marker;
    //Create an onclick event to open an infoWindow at each marker.
    marker.addListener('click', populateInfoWindow);
    // Two event listeners - one for mouseover, one for mouseout,
    // to change the colors back and forth.
    marker.addListener('mouseover', myMouseOver);
    marker.addListener('mouseout', myMouseOut);
    getData(title);
  }
  map.fitBounds(bounds);
}

function myMouseOver() {
  this.setIcon(highlightedIcon);
}

function myMouseOut() {
  this.setIcon(defaultIcon);
}

//This is my KnockoutJS ViewModel.
var ViewModel = function() {
  var self = this;

  //Create array of restaurant names.
  this.listItems = ko.observableArray(myLocations);

  //This function displays the infowindow of the applicable list item when clicked.
  self.clickedLocation = function(item) {
    google.maps.event.trigger(item.marker,'click');
  };

  //Create array of categories for list box.
  this.categories = ko.observableArray(["New American", "Breakfast", "Italian", "Churrascaria", "American", "Lounge", "Cajun / Creole"]);

  //This function filters my list items.
  this.chosenValue = ko.observable();
  this.chosenValue.subscribe(function(newValue) {
    for (var i = 0; i < myLocations.length; i++) {
      if (newValue == myLocations[i].category) {
        myLocations[i].visibility(true);
        myLocations[i].marker.setVisible(true);
      } else {
        myLocations[i].visibility(false);
        myLocations[i].marker.setVisible(false);
        myInfoWindow.close();
      }
    }
  });

  //This function clears the filter
  this.clearFilter = function() {
    for (var i = 0; i < myLocations.length; i++) {
      myLocations[i].visibility(true);
      myLocations[i].marker.setVisible(true);
    }
  };
};
//Apply data bindings to the view using KnockoutJS.
ko.applyBindings(new ViewModel());

// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
function makeMarkerIcon(markerColor) {
  var markerImage = new google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
    '|40|_|%E2%80%A2',
    new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(21,34));
  return markerImage;
}

//This function retreives the data from Foursquare about each restaurant in order to filter them by category.
function getData(title) {
  $.ajax({
    url: 'https://api.foursquare.com/v2/venues/search?query='+title+'&near=denver,co&client_id=DT0XBOVKI2P2PN3Q53HO3GZAHC12TKF4NZ42YZFD4N1S4TSC&client_secret=PQ5S5TGRFZQUAEC5XM3KTGQEEWNP5IB1Y0SY2O1YGFGARZPV&v=20180125',
    dataType: "json",
    success: function(response) {
      if(response.meta.code == 200) {
        var venue = response.response.venues;
        venue = venue[0];
        var name = venue.name;
        var locationCategory = venue.categories[0].shortName;
        for(var i = 0; i < myLocations.length; i++) {
          if (name === myLocations[i].title) {
            myLocations[i].category = locationCategory;
          }
        }
      }
    },
    error: function() {
      alert("ERROR: Foursquare API failed to load!");
    }
  });
}

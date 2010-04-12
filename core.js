// ==========================================================================
// Project:   MapKit
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals MapKit */

/** @namespace

  A Map drawing and interaction framework for google maps
  
  @extends SC.Object
*/
MapKit = SC.Object.create(
  /** @scope MapKit.prototype */ {

  // ..........................................................
  // NS PROPERTIES
  // 
  NAMESPACE: 'MapKit',
  VERSION: '0.1.0',
  MAPS_NAMESPACE: null,
  API_KEY: null,
  PINS: null,
  store: null,
  
  // ..........................................................
  // NS FUNCTIONS
  // 
  /*
    Adds a pin to the map using an address string
    @param [string] Herndon, VA 20171
  */
  addPinForAddress: function(address) {
    this._getPointForAdderessIfPossible(address);
  },
  
  /*
    Adds a pin to the map using an object containing latitude and longitude
    @param [hash] { lat: 33.79, lng: -77.89 }
  */
  addPinForLatAndLng: function(point) {
    if (point && point.lat && point.lng) {
      var pin = this.get('store').createRecord(MapKit.Pin,{latitude: point.lat, longitude: point.lng });
      MapKit.pinsController.selectObject(pin);
      return pin;
    }
  },
  
  /*
    Moves the center of the map to the pin.
    Uses the selction from MapKit.pinController
    @param [mapView] the current mapView
  */
  moveMapToPin: function(map, pin) {
    SC.Logger.log("Moving to pin");
    if (map && pin) {
      map.setCenter(pin);
      map.setZoom(7);
    } else {
      SC.Logger.log("You Must Provide a map view");
    }
  },
  // ..........................................................
  // NS PRIVATE FUNCTIONS
  // 
  _getPointForAdderessIfPossible: function(address){
    var that = this, ns = this.MAPS_NAMESPACE, lat, lng;
    var geocoder = new ns.ClientGeocoder();
    geocoder.getLatLng(address, function(point){
      if (point) {
        lat = point.lat(); lng = point.lng();
        SC.run(function(){
          var pin = that.get('store').createRecord(MapKit.Pin,{
            latitude: lat, longitude: lng, address: address, name: address
          });
          MapKit.pinsController.selectObject(pin);
        });
      } else {
        alert(address + " could not be found.");
      }
    });
    
  }

});

//============================================================================
// MapKit.MapViewDelegate
//============================================================================
/*globals MapKit*/

sc_require('mixins/map_view_delegate');
/**

  
  A Map View proxy gives you the API for a mapview and allows you to 
  call those API funcitons without having to pass the view refrence
  around.
  
  @author Josh Holt
  @version 0.1.0
  @since 0.1.0

*/

MapKit.MapViewProxy = SC.Object.extend(MapKit.MapViewDelegate,{
  
  isMapViewDelegate: NO,
  mapView: null,
  
  addPin: function(pin) {
    var map = this.get('mapView');
    if (pin && map) {
      this.mapViewAddPin(map, pin);
    }
  },
  
  removePin: function(pin) {
    var map = this.get('mapView');
    if (pin && map) {
      this.mapViewRemovePin(map, pin);
    }
  },
  
  setCenter: function(pin) {
    var map = this.get('mapView');
    if (pin && map) {
      this.mapViewSetCenter(map, pin);
    }
  },
  
  setZoom: function(zoomLevel) {
    var map = this.get('mapView');
    if (zoomLevel && map) {
      this.mapViewSetZoom(map, zoomLevel);
    }
  },
  
  clearOverlays: function() {
    var map = this.get('mapView');
    if (map) {
      this.mapViewClearOverLays(map);
    }
  },
  
  moveMapToPin: function(pin) {
    var map = this.get('mapView');
    if (pin && map) {
      this.mapViewMoveMapToPin(map, pin);
    }
  },
  
  isMapReady: function() {
    var map = this.get('mapView');
    if (map) {
      return this.mapViewIsMapReady(map);
    }
  },
  
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
      var pin = MapKit.get('store').createRecord(MapKit.Pin,
          {latitude: point.lat, longitude: point.lng });
      MapKit.pinsController.selectObject(pin);
      return pin;
    }
  },
  
  // ..........................................................
  // NS PRIVATE FUNCTIONS
  // 
  _getPointForAdderessIfPossible: function(address){
    var that = this, ns = MapKit.MAPS_NAMESPACE, lat, lng;
    var geocoder = new ns.ClientGeocoder();
    geocoder.getLatLng(address, function(point){
      if (point) {
        lat = point.lat(); lng = point.lng();
        SC.run(function(){
          var pin = MapKit.get('store').createRecord(MapKit.Pin,{
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
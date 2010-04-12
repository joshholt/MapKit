//============================================================================
// MapKit.MapViewDelegate
//============================================================================
/*globals MapKit*/

/**

  @namespace
  
  A Map View Delegate is consulted by a MapKit.MapView to make the API calls
  to google maps. It allows you override the default implementation of 
  these API calls for finer control.
  
  @author Josh Holt
  @version 0.1.0
  @since 0.1.0

*/

MapKit.MapViewDelegate = {
  
  isMapViewDelegate: YES,
  
  /*
    Clears all overlays on the map
    @param {MapKit.MapView} view the MapView
  */
  mapViewClearOverLays: function(view) {
    var map = view.get('_googleMap');
    if (map) {
      map.clearOverlays();
      view.set('currentPins',[]);
    }
  },
  
  /*
    Sets the center of the map
    @param {MapKit.MapView} view the MapView
    @param {MapKit.Pin} a pin/location on the map
  */
  mapViewSetCenter: function(view, pin) {
    var map = view.get('_googleMap');
    if (map) {
      map.setCenter(pin.get('googleLatLng'));    
    }
  },
  
  /*
    Adds a pin to the map
    @param {MapKit.MapView} view the MapView
    @param {MapKit.Pin} a pin/location on the map
  */
  mapViewAddPin: function (view, pin) {
    var marker, map = view.get('_googleMap'); 
    var ns = MapKit.MAPS_NAMESPACE, icon = new ns.Icon(ns.DEFAULT_ICON);
    
    icon.image = pin.get('iconURLS').icon;
    icon.iconSize = new ns.Size(32,32);
    icon.iconAnchor = new ns.Point(16,32);
    icon.shadow = pin.get('iconURLS').shadow;
    icon.shadowSize = new ns.Size(59,32);
    
    marker = new ns.Marker(pin.get('googleLatLng'), 
      {'icon':icon, 'clickable':false, 'draggable':false});
    pin.set('marker',marker);
    map.addOverlay(marker);
  },
  
  /*
    Removes a pin from the map
    @param {MapKit.MapView} view the MapView
    @param {MapKit.Pin} a pin/location on the map
  */
  mapViewRemovePin: function (view, pin) {
    var map = view.get('_googleMap');
    if (map) { 
      map.removeOverlay(pin.get('marker'));
    }
  },
  
  /*
    Sets the zoomLevel for the map
    @param {MapKit.MapView} view the MapView
    @param {Number} a number between 1 -- 10
  */
  mapViewSetZoom: function (view, zoomLevel) {
    var map = view.get('_googleMap');
    if (map) {
      map.setZoom(zoomLevel);    
    }
  },
  
  /*
    Boolean to let you know if the map is ready
    @param {MapKit.MapView} view the MapView
  */
  mapViewIsMapReady: function(view) {
    return view.get('_isMapReady');
  },
  
  /*
    Moves the center of the map to the specified pin
    @param {MapKit.MapView} view the MapView
    @param {MapKit.Pin} a pin/location on the map
  */
  mapViewMoveMapToPin: function(view, pin) {
    var map = view.get('_googleMap');
    if (map && pin) {
      map.setCenter(pin.get('googleLatLng'));
      map.setZoom(7);
    }
  }
  
};
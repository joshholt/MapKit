//============================================================================
// MapKit.Location
//============================================================================
/*globals MapKit*/

/**

  This model represents the location of a pin on the map.
  
  @extends SC.Record
  @author Josh Holt
  @version 0.1.0
  @since 0.1.0

*/

MapKit.Pin = SC.Record.extend({
  markerIcon: SC.Record.attr(String, {defaultValue: 'red-pushpin'}),
  name: SC.Record.attr(String, "(NO NAME)"),
  address: SC.Record.attr(String, {defaultValue: 'Herndon, VA'}),
  latitude: SC.Record.attr(String),
  longitude: SC.Record.attr(String),
  marker: SC.Record.attr(Object),
  
  googleLatLng: function() {
    var gMaps = MapKit.MAPS_NAMESPACE, that = this;
    var lat = this.get('latitude'), lng = this.get('longitude');
    var address = this.get('address');
    if (lat && lat !== '' && lng && lng !== '') {
      return new gMaps.LatLng(this.get('latitude'), this.get('longitude')); 
    }
  }.property('longitude','latitude','address').cacheable(),
  
  iconURLS: function() {
    var icon = this.get('markerIcon'), iconURL = "", shadowURL = "";
    if (icon) {
      iconURL = "http://maps.google.com/mapfiles/ms/micons/%@.png".fmt(icon);
      if (icon.match(/dot/) || 
        icon.match(/(blue|green|lightblue|orange|pink|purple|red|yellow)$/)) {
          shadowURL = "http://maps.google.com/mapfiles/ms/micons/msmarker.shadow.png";
      } else if(icon.match(/pushpin/)) {
        shadowURL = "http://maps.google.com/mapfiles/ms/micons/pushpin_shadow.png";
      } else {
        shadowURL = "http://maps.google.com/mapfiles/ms/micons/%@.shadow.png".fmt(icon);
      }
    }
    return { icon: iconURL, shadow: shadowURL };
  }.property('markerIcon').cacheable()
  
});

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
  MAPS: [],
  
  // ..........................................................
  // NS FUNCTIONS
  // 
  proxyForMap: function(mapNameOrGUID) {
    var proxy, maps = this.get('MAPS');
    if (mapNameOrGUID && maps && maps.get('length') > 1) {
      var obj = maps.findProperty('key', mapNameOrGUID);
      return obj.get('proxy');
    } else if (maps.get('length') === 1) {
      return maps.getPath('firstObject.proxy');
    } else {
      SC.Logger.warn("Proxy for %@ could not be found...");
    }
  }

});

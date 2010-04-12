//============================================================================
// MapKit.MapView
//============================================================================
/*globals MapKit*/

/**
  This is the map view
  
  @extends SC.WebView
  @author Josh Holt
  @version 0.1.0
  @since 0.1.0
*/

MapKit.MapView = SC.WebView.extend({
  
  markerIcon: 'red-pushpin',
  pinsBinding: 'MapKit.pinsController.arrangedObjects',
  pinsBindingDefault: SC.Binding.multiple(),
  currentPins: [],
  
  _googleAjaxLoaded: NO,
  _mapDOMElement: null,
  _googleMap: null,
  _isMapReady: NO,
  _clientLoc: NO,
  
  didCreateLayer: function() {
    sc_super();
    var f = this.$('iframe');
    SC.Event.add(f, 'load', this, this.viewSetup);
  },
  
  viewSetup: function(){
    var docHead = '<head><script type="text/javascript" src="http://www.google.com/jsapi?key=%@"></script></head>'.fmt(MapKit.API_KEY);
    var docBody = '<body style="padding:0px; margin:0px"><div id="mapView" style="left: 0px; top: 0px; width: 100%; height: 100%"></div></body>';
    var doc = '<html>%@%@</html'.fmt(docHead, docBody);
    if (SC.browser.msie) {
      if (document.frames) { 
        this._document = document.frames[document.frames.length -1].document;
        this._document.write(doc);
      }
    } else {
      if (this.$('iframe')) {
        this._document = this.$('iframe').firstObject().contentDocument;
        this._document.write(doc);
      }
    }
    this._loadGoogleMapsIfPossible();
  },
  
  willDestroyLayer: function() {         
    var doc = this._document;
    var docBody = doc.body;
    SC.Event.remove(this.$('iframe'), 'load', this, this.viewSetup);
    sc_super();
  },
  
  addPin: function(pin) {
    var marker;
    var ns = MapKit.MAPS_NAMESPACE, map = this.get('_googleMap');
    var icon = new ns.Icon(ns.DEFAULT_ICON);
    icon.image = pin.get('iconURLS').icon;
    icon.iconSize = new ns.Size(32,32);
    icon.iconAnchor = new ns.Point(16,32);
    icon.shadow = pin.get('iconURLS').shadow;
    icon.shadowSize = new ns.Size(59,32);
    marker = new ns.Marker(pin.get('googleLatLng'), {'icon':icon, 'clickable':false, 'draggable':false});
    pin.set('marker',marker);
    //ns.Event.addListener(marker, 'dragend', function() { delegate.updateLocation(); });
    map.addOverlay(marker);
  },
  
  removePin: function(pin) {
    var map = this.get('_googleMap');
    if (map) { 
      map.removeOverlay(pin.get('marker'));
    }
  },
  
  setCenter: function(pin) {
    var map = this.get('_googleMap');
    if (map) {
      map.setCenter(pin.get('googleLatLng'));    
    }
  },
  
  setZoom: function(zoomNum) {
    var map = this.get('_googleMap');
    if (map) {
      map.setZoom(zoomNum);    
    }
  },
  
  clearOverlays: function() {
    var map = this.get('_googleMap');
    if (map) {
      map.clearOverlays();
      this.set('currentPins',[]);
    }
  },
  
  isMapReady: function() {
    return this.get('_isMapReady');
  }.property('_isMapReady'),
  
  _loadGoogleMapsIfPossible: function() {
    var doc = this._documentWindow(), thisContext = this;
    if (typeof doc.google  === 'undefined') {
        doc.window.setTimeout(function() {thisContext._loadGoogleMapsIfPossible();}, 100);
    } else {
        var googleScriptElement = doc.document.createElement('script');
        doc.mapsJsLoaded = function () {
            SC.Logger.log("MapsJS Loaded");
            thisContext._googleAjaxLoaded = YES;
            thisContext._mapDOMElement = doc.document.getElementById('mapView');
            thisContext._createMap();
        };
        googleScriptElement.innerHTML = "google.load('maps', '2.173', {'callback': mapsJsLoaded});";
        doc.document.getElementsByTagName('head')[0].appendChild(googleScriptElement);
        this._clientLoc = doc.google.loader.ClientLocation;
    }
  },
  
  _createMap: function() {
    SC.Logger.log('Building Map');
    var doc = this._documentWindow();
    var clientLocation = this.get('_clientLoc');
    if (!MapKit.MAPS_NAMESPACE) {
        MapKit.MAPS_NAMESPACE = doc.google.maps;
    }
    
    // for some things the current google namespace needs to be used...
    var localMapsNamespace = doc.google.maps;
    this._googleMap = new localMapsNamespace.Map2(this._mapDOMElement);
    //_googleMap.addMapType(G_SATELLITE_3D_MAP);
    this._googleMap.setMapType(localMapsNamespace.G_PHYSICAL_MAP);
    this._googleMap.setUIToDefault();
    this._googleMap.enableContinuousZoom();
    this._googleMap.setCenter(new localMapsNamespace.LatLng(clientLocation.latitude, clientLocation.longitude), 8);
    this._googleMap.setZoom(6);
    // Hack to get mouse up event to work
    localMapsNamespace.Event.addDomListener(document.body, 'mouseup', function() { try { localMapsNamespace.Event.trigger(doc, 'mouseup'); } catch(e){} });
    this.set('_isMapReady',YES);
  },
  
  _mapDidBecomeReady: function() { this._addPinsIfNeeded(); }.observes('isMapReady'),
  
  _addPinsIfNeeded: function() {
    var pins = this.get('pins'), that = this;
    if (!this.get('isMapReady')) {
      // noop
    } else if (pins && pins.get('length') > 0) {
      pins.forEach(function(pin){
        if (that.currentPins.indexOf(pin) === -1) {
          that.addPin(pin);
          that.currentPins.push(pin);
        }
      }); 
    }
  }.observes('.pins.[].length'),
  
  _documentWindow: function() {
    return this.get('_document').defaultView || this.get('_document').contentWindow;
  }
  
});
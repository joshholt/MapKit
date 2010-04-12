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

sc_require('mixins/map_view_delegate');

MapKit.MapView = SC.WebView.extend(MapKit.MapViewDelegate,{
  
  markerIcon: 'red-pushpin',
  pinsBinding: 'MapKit.pinsController.arrangedObjects',
  pinsBindingDefault: SC.Binding.multiple(),
  currentPins: [],
  delegate: null, // set delegate to null by default.
  mapName: null,
  
  _googleAjaxLoaded: NO,
  _mapDOMElement: null,
  _googleMap: null,
  _isMapReady: NO,
  _clientLoc: NO,
  
  didCreateLayer: function() {
    sc_super();
    var f = this.$('iframe');
    SC.Event.add(f, 'load', this, this.viewSetup);
    this._registerProxy();
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
    this._unregisterProxy();
    sc_super();
  },
  
  addPin: function(pin) {
    var del = this.get('delegate');
    if (del && del.mapViewAddPin) {
      del.mapViewAddPin(this, pin);
    } else {
      this.mapViewAddPin(this, pin);
    }
  },
  
  removePin: function(pin) {
    var del = this.get('delegate');
    if (del && del.mapViewRemovePin) {
      del.mapViewRemove(this, pin);
    } else {
      this.mapViewRemovePin(this, pin);
    }
  },
  
  setCenter: function(pin) {
    var del = this.get('delegate');
    if (del && del.mapViewSetCenter) {
      del.mapViewSetCenter(this, pin);
    } else {
      this.mapViewSetCenter(this, pin);
    }
  },
  
  setZoom: function(zoomNum) {
    var del = this.get('delegate');
    if (del && del.mapViewSetZoom) {
      del.mapViewSetZoom(this, zoomNum);
    } else {
      this.mapViewSetZoom(this, zoomNum);
    }
  },
  
  clearOverlays: function() {
    var del = this.get('delegate');
    if (del && del.mapViewClearOverLays) {
      del.mapViewClearOverLays(this);
    } else {
      this.mapViewClearOverLays(this);
    }
  },
  
  moveMapToPin: function(pin) {
    var del = this.get('delegate');
    if (del && del.mapViewMoveMapToPin) {
      del.mapViewMoveMapToPin(this, pin);
    } else {
      this.mapViewMoveMapToPin(this, pin);
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
  },
  
  _registerProxy: function() {
   var mapName = this.get('mapName') || SC.guidFor(this); 
   var maps = MapKit.get('MAPS');
   maps.pushObject(SC.Object.create({ key: mapName, proxy: MapKit.MapViewProxy.create({ mapView: this }) }));
  },
  
  _unregisterProxy: function() {
    var mapName = this.get('mapName') || SC.guidFor(this);
    var maps = MapKit.get('MAPS');
    var mapobj = maps.findProperty('key', mapName);
    if (mapobj) {
      maps.removeObject(mapobj);
    } else {
      SC.Logger.warn("Could not remove map proxy for %@".fmt(this.toString()));
    }
  }
  
});
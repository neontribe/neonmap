var L = require('leaflet');
require('leaflet.markercluster');
L.Icon.Default.imagePath = '/images/';

var ToccMap = L.Class.extend({
  options: {
    geojson: null,
    tileurl: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    minZoom: 5,
    maxZoom: 18,
    initialZoom: 12,
    imagePath: '../dist/images',
    defaultCenter: [51.505, -0.09],
    clustering: {
      showCoverageOnHover: false
    }
  },

  getAttributeData: function(el){
    return [].reduce.call(el.attributes, function(acc, attr){
      var dattr = attr.name.split(/^data-/)[1];
      if (dattr) {
          acc[dattr] = attr.value;
      }
      return acc;
    }, {});
  },

  initialize: function (el, options) {
    //programmatic options trump data-attributes
    L.setOptions(this, this.getAttributeData(el));
    L.setOptions(this, options);
      debugger;
    L.Icon.Default.imagePath = this.options.imagePath;

    this.map = L.map(el);
    this.map.setView(this.options.defaultCenter, this.options.initialZoom);
  
    this.tiles = L.tileLayer(this.options.tileurl, {
      minZoom: this.options.minZoom, 
      maxZoom: this.options.maxZoom, 
      attribution: this.options.attribution
    });

    this.map.addLayer(this.tiles);

    if (this.options.geojson) {
      if (typeof this.options.geojson === "string") {
        this.options.geojson = JSON.parse(this.options.geojson);
      }
      this.markers = L.markerClusterGroup(this.options.clustering);
      this.geoJsonLayer = L.geoJson(this.options.geojson, {});
      this.markers.addLayer(this.geoJsonLayer);
      this.map.addLayer(this.markers);
      this.map.fitBounds(this.markers.getBounds());
    }
  }
});

module.exports = function(el, options){
  return new ToccMap(el, options);
};

/**
 * Produce a jQuery plugin facade if we find jQuery in the env
 */
if (window.jQuery) {
  (function( $ ) {
    $.fn.toccmap = function(options) {
      this.each(function() {
        return toccmap(this, options);
      });
      return this;
    };
  }( window.jQuery ));
}

var L = require('leaflet');
var M = require('mustache');
require('leaflet.markercluster');

var NeonMap = L.Class.extend({
  options: {
    geojson: null,
    tile_url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    min_zoom: 5,
    max_zoom: 18,
    initial_zoom: 12,
    image_path: '../dist/images',
    center: [51.505, -0.09],
    clustering: {
      showCoverageOnHover: false
    },
    popups: {
      template: '<h3>{{title}}</h3>{{image.alt}}',
      options: {
        className: 'neonmap-popup'
      }
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
    var self = this;
    //programmatic options trump data-attributes
    L.setOptions(this, L.extend(this.getAttributeData(el), options));

    L.Icon.Default.imagePath = this.options.image_path;

    this.map = L.map(el);
    this.map.setView(this.options.center, this.options.initial_zoom);
  
    this.tiles = L.tileLayer(this.options.tile_url, {
      minZoom: this.options.min_zoom, 
      maxZoom: this.options.max_zoom, 
      attribution: this.options.attribution
    });

    this.map.addLayer(this.tiles);

    if (this.options.geojson) {
      if (typeof this.options.geojson === "string") {
        this.options.geojson = JSON.parse(this.options.geojson);
      }
      this.markers = L.markerClusterGroup(this.options.clustering);
      this.geoJsonLayer = L.geoJson(this.options.geojson, {
        onEachFeature: function(feature, layer){
          layer.bindPopup(M.render(self.options.popups.template, feature.properties), self.options.popups.options);
        }
      });
      this.markers.addLayer(this.geoJsonLayer);
      this.map.addLayer(this.markers);
      this.map.fitBounds(this.markers.getBounds(), {maxZoom: this.options.initial_zoom});
    }
  }
});

var neonmap = function(el, options){
  return new NeonMap(el, options);
};

// Expose our libraries quietly for the convenience of others
neonmap.Leaflet = L;
neonmap.Mustache = M;

module.exports = neonmap;

/**
 * Produce a jQuery plugin facade if we find jQuery in the env
 */
if (window.jQuery) {
  (function( $ ) {
    $.fn.neonmap = function(options) {
      this.each(function() {
        return neonmap(this, options);
      });
      return this;
    };
  }( window.jQuery ));
}

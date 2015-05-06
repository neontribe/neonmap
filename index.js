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
        defaultCenter: [51.505, -0.09]
    },

	initialize: function (el, options) {
        L.Util.setOptions(this, options);
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

            this.markers = L.markerClusterGroup();
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

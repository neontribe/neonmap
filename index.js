var L = require('leaflet');
require('leaflet.markercluster');
//L.Icon.Default.imagePath = '/images/'

var ToccMap = L.Class.extend({
    options: {
    	geojson: null,
    	tileurl: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    	attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    	minZoom: 5,
    	maxZoom: 18,
    	initialZoom: 12
    },

	initialize: function (el, options) {
        L.Util.setOptions(this, options);

        this.map = L.map(el);
        this.map.setView([51.505, -0.09], this.options.initialZoom);
        L.tileLayer(this.options.tileurl, {
        	minZoom: this.options.minZoom, 
        	maxZoom: this.options.maxZoom, 
        	attribution: this.options.attribution
        }).addTo(this.map);
        
    }
});

module.exports = function(el, options){
	return new ToccMap(el, options);
}

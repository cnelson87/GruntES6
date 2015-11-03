/**
 * Application State
 */

const AppState = Backbone.Model.extend({

	defaults: {
		currentBreakpoint: null
	},

	initialize: function(options) {
		console.log('AppState:initialize');
	}

});

export default AppState;

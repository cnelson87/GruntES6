/**
 * Promise Page
 */

import AppConfig from 'config/AppConfig';
import AppEvents from 'config/AppEvents';
import DataListing from 'templates/DataListing.hbs';

const PromisePage = {

	initialize: function() {
		console.log('PromisePage:initialize');
		this.$el = $('#promise-app');
		this.template = DataListing;
		this.fetch();
	},

	fetch: function() {
		console.log('PromisePage:fetch');
		let response = [1,2,3];
		this.process(response);
	},

	process: function(response) {
		console.log('PromisePage:fetch');
		let data = response;
		this.render(data);
	},

	render: function(data) {
		console.log('PromisePage:render');
		let html = this.template(data);
		this.$el.html(html);
	}

};

export default PromisePage;

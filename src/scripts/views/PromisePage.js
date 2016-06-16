/**
 * Promise Page
 */

import AppConfig from 'config/AppConfig';
import AppEvents from 'config/AppEvents';
import ajaxGet from 'utilities/ajaxGet';
import PromiseDataListing from 'templates/PromiseDataListing.hbs';

const PromisePage = {

	initialize: function() {
		this.$el = $('#promise-app');
		this.template = PromiseDataListing;
		this.fetch();
	},

	fetch: function() {
		let fibonacci = ajaxGet(AppConfig.urls.fibonacci);
		let primes = ajaxGet(AppConfig.urls.primes);
		let sevens = ajaxGet(AppConfig.urls.sevens);

		$.when([fibonacci, primes, sevens])
			.then(function(response) {
				this.process(response);
			}.bind(this))
			.fail(function(response) {
				// console.log('fail', response);
			}.bind(this));

	},

	process: function(response) {
		// console.log(response);
		let arrs = [];
		let arr;
		let sorted;
		let data;
		for (let i=0, len=response.length; i<len; i++) {
			arrs[i] = response[i]['responseJSON'];
		}
		arr = [].concat.apply([], arrs);
		sorted = arr.slice().sort(function(a,b) {return a - b;});
		data = [...new Set(sorted)];
		this.render(data);
	},

	render: function(data) {
		// console.log(data);
		let html = this.template(data);
		this.$el.html(html);
	}

};

export default PromisePage;

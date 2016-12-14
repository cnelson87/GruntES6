/**
 * Promise Page
 */

import AppConfig from 'config/AppConfig';
import ajaxGet from 'utilities/ajaxGet';
import PromiseDataListing from 'templates/PromiseDataListing.hbs';

const PromisePage = {

	initialize: function() {
		this.$el = $('#promise-app');
		this.template = PromiseDataListing;
		this.fetch();
	},

	fetch: function() {
		let xhrs = [
			ajaxGet(AppConfig.urls.fibonacci),
			ajaxGet(AppConfig.urls.primes),
			ajaxGet(AppConfig.urls.sevens)
		];

		Promise.all(xhrs).then((response) => {
			this.process(response);
		}).catch((response) => {
			console.log('error');
		});

	},

	process: function(response) {
		// console.log(response);
		let arrs = [];
		let arr;
		let sorted;
		let data;

		for (let i=0, len=response.length; i<len; i++) {
			arrs[i] = response[i];
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

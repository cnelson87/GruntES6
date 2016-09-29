/**
 * Videos Page
 */

import AppConfig from 'config/AppConfig';
import ajaxGet from 'utilities/ajaxGet';
import youtubeVideoControl from 'utilities/youtubeVideoControl';
import VideosGrid from 'templates/VideosGrid.hbs';

const VideosPage = {

	initialize: function() {
		this.$el = $('#videos-app');
		this.template = VideosGrid;
		this.fetch();
	},

	fetch: function() {
		let xhr = ajaxGet(AppConfig.urls.videosPlaylist);

		Promise.resolve(xhr)
			.then((response) => {
				this.process(response);
			})
			.catch((response) => {
				console.log('error');
			});

	},

	process: function(response) {
		// console.log(response);
		let data = [];

		for (let i=0, len=response.length; i<len; i++) {
			data[i] = response[i];
		}

		this.render(data);

	},

	render: function(data) {
		console.log(data);
		let html = this.template(data);
		this.$el.html(html);
		youtubeVideoControl();
	}

};

export default VideosPage;

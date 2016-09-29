/**
 * Videos Page
 */

import AppConfig from 'config/AppConfig';
import AppEvents from 'config/AppEvents';
import youtubeVideoControl from 'utilities/youtubeVideoControl';

const VideosPage = {

	initialize: function() {
		youtubeVideoControl();
	}

};

export default VideosPage;

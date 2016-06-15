/**
 * initialize
 */

import handlebarsHelpers from 'config/handlebarsHelpers';
import Application from './Application.js';

$(function() {
	handlebarsHelpers();
	Application.initialize();
});

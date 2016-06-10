/**
 * initialize
 */

import HandlebarsHelpers from 'config/HandlebarsHelpers';
import Application from './Application.js';

$(function() {
	new HandlebarsHelpers();
	Application.initialize();
});

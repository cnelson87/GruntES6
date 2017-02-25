/*
	TITLE: DualDatepicker

	DESCRIPTION: jQiery-UI DualDatepicker widget

	VERSION: 0.1.0

	USAGE: let dualDateoicker = new DualDatepicker('Element', 'Options')
		@param {jQuery Object}
		@param {Object}

	AUTHOR: Chris Nelson <cnelson87@gmail.com>

	DEPENDENCIES:
		- jquery 3.1.1+
		- jquery-ui 1.12.1

*/

class DualDatepicker {

	constructor($el, options = {}) {
		this.initialize($el, options);
	}

	initialize($el, options) {

		// defaults
		this.$el = $el;
		this.options = Object.assign({
			selectorStartDatepicker: '.start-date',
			selectorEndDatepicker: '.end-date',
			bindEndDateToStartDate: true,	//end date can't be before start date
			bindStartDateToEndDate: false,	//start date can't be after end date
			minimumDateDiff: 1,				//min num of days between start and end dates
			numberOfMonths: 2,				//num months to show
			customEventName: 'DualDatepicker'
		}, options);

		// element references
		this.$startDatepicker = this.$el.find(this.options.selectorStartDatepicker);
		this.$endDatepicker = this.$el.find(this.options.selectorEndDatepicker);

		this.$startDatepicker.prop('readonly', true);
		this.$startDatepicker.attr('readonly', 'readonly');
		this.$endDatepicker.prop('readonly', true);
		this.$endDatepicker.attr('readonly', 'readonly');

		this.initDatepickers();

		$.event.trigger(`${this.options.customEventName}:isInitialized`, [this.$el]);

	}

	initDatepickers() {
		const self = this;
		const $startDatepicker = this.$startDatepicker;
		const $endDatepicker = this.$endDatepicker;
		const bindEndDate = this.options.bindEndDateToStartDate;
		const bindStartDate = this.options.bindStartDateToEndDate;
		const minimumDays = this.options.minimumDateDiff;
		const numberOfMonths = this.options.numberOfMonths;

		let beforeShowDay = function(date) {
			let start = $startDatepicker.datepicker('getDate');
			let end = $endDatepicker.datepicker('getDate');
			let dpStart = Date.parse(start);
			let dpEnd = Date.parse(end);
			let dpDate = Date.parse(date);
			let data = ( dpDate >= dpStart && dpDate <= dpEnd ) ? [true, 'ui-state-active', ''] : [true, '', ''];
			return data;
		};

		$startDatepicker.datepicker({
			minDate: 0,
			maxDate: '+1y',
			defaultDate: '0',
			numberOfMonths: numberOfMonths,
			showCurrentAtPos: 0,
			beforeShowDay: beforeShowDay,
			onSelect: function(date) {
				if (bindEndDate) {
					$endDatepicker.datepicker('option', 'minDate', date);
				}
			}
		});

		$endDatepicker.datepicker({
			minDate: 0,
			maxDate: '+1y',
			defaultDate: '+1d',
			numberOfMonths: numberOfMonths,
			showCurrentAtPos: 0,
			beforeShowDay: beforeShowDay,
			onSelect: function(date) {
				if (bindStartDate) {
					$startDatepicker.datepicker('option', 'maxDate', date);
				}
			}
		});

		// Set default date
		$startDatepicker.datepicker('setDate', '0');
		$endDatepicker.datepicker('setDate', '+'+minimumDays+'d');

		// blurring on focus to:
		// 1. Prevent visible blinking cursor through calendar on iOS.
		// 2. Remove "done" form control on iOS.
		// Note: may affect accessibility, may need to revisit
		$startDatepicker.on('focus', function() {
			self.$startDatepicker.blur();
		});
		$endDatepicker.on('focus', function() {
			self.$endDatepicker.blur();
		});

	}

}

export default DualDatepicker;

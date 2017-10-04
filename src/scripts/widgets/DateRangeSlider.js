/*
	TITLE: DateRangeSlider

	DESCRIPTION: DateRangeSlider widget

	VERSION: 0.1.0

	USAGE: let myDateRangeSlider = new DateRangeSlider('Element', 'Options')
		@param {jQuery Object}
		@param {Object}

	AUTHOR: Chris Nelson <cnelson87@gmail.com>

	DEPENDENCIES:
		- jquery 3.x
		- moment 2.18.1
		- noUiSlider 10.1.0

*/

class DateRangeSlider {

	constructor($el, options = {}) {
		this.initialize($el, options);
	}

	initialize($el, options) {
		/* eslint-disable no-magic-numbers */
		const steps = {
			day: (24 * 60 * 60 * 1000),
			hour: (60 * 60 * 1000)
		};
		/* eslint-enable no-magic-numbers */

		// defaults
		this.$el = $el;
		this.options = Object.assign({
			selectorSlider: '.noUiSlider',
			selectorOutputs: '.range-slider--output',
			selectorFields: '.range-slider--field',
			classInitialized: 'is-initialized',
			dateFormat: 'ddd MMM Do YYYY, h:mm:ss a',
			sliderSteps: steps.day,
			customEventPrefix: 'DateRangeSlider'
		}, options);

		// element references
		this.$slider = this.$el.find(this.options.selectorSlider).first(); //must be only 1
		this.$outputs = this.$el.find(this.options.selectorOutputs); //must be exactly 2 (start & end)
		this.$fields = this.$el.find(this.options.selectorFields); //must be exactly 2 (start & end)

		// setup & properties
		this.dateFormat = this.options.dateFormat;
		this.sliderSteps = this.options.sliderSteps;
		this.startDate = new Date(this.$slider.data('min'));
		this.endDate = new Date(this.$slider.data('max'));
		this.timestampStartDate = this.startDate.getTime();
		this.timestampEndDate = this.endDate.getTime();

		this.initSlider();

		this.$el.addClass(this.options.classInitialized);

		$.event.trigger(`${this.options.customEventPrefix}:isInitialized`, [this.$el]);

	}

	initSlider() {
		const slider = this.$slider[0]; // native slider element

		let formateDate = (date) => {
			return moment(date).format(this.dateFormat);
		};

		noUiSlider.create(slider, {
			connect: [false, true, false],
			range: {
				min: this.timestampStartDate,
				max: this.timestampEndDate
			},
			step: this.sliderSteps,
			start: [this.timestampStartDate, this.timestampEndDate]
		});
		slider.noUiSlider.on('update', function(values, index) {
			this.$outputs.eq(index).html(formateDate(new Date(+values[index])));
		}.bind(this));
		slider.noUiSlider.on('change', function(values, index) {
			this.$fields.eq(index).val(new Date(+values[index])).change();
		}.bind(this));
		this.$fields.eq(0).val(this.startDate);
		this.$fields.eq(1).val(this.endDate);
		this.$fields.on('change', function(event){
			console.log('date change:', $(event.currentTarget).val());
		});

	}

}

export default DateRangeSlider;

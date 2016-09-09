/*
	TITLE: HeightEqualizer

	DESCRIPTION: Sets equal height on a collection of DOM ELs

	VERSION: 0.2.3

	USAGE: let myHeightEqualizer = new HeightEqualizer('Element', 'Options')
		@param {jQuery Object}
		@param {Object}

	AUTHOR: Chris Nelson <cnelson87@gmail.com>

	DEPENDENCIES:
		- jquery 2.2x+

*/

class HeightEqualizer {

	constructor($el, options = {}) {
		this.initialize($el, options);
	}

	initialize($el, options) {

		this.$el = $el;
		this.options = Object.assign({
			selectorItems: '> div',
			setParentHeight: false
		}, options);

		// element references
		this.$items = this.$el.find(this.options.selectorItems);

		this._len = this.$items.length;
		if (this._len <= 1) {return;}

		this.maxHeight = 0;

		this.calcHeight();
		this.setHeight();
	}

	calcHeight() {
		let heightCheck = 0;
		for (let i=0; i<this._len; i++) {
			//outerHeight includes height + padding + border
			heightCheck = $(this.$items[i]).outerHeight();
			if (heightCheck > this.maxHeight) {
				this.maxHeight = heightCheck;
			}
		}
	}

	setHeight() {
		this.$items.css({height: this.maxHeight});
		if (this.options.setParentHeight) {
			this.$el.css({height: this.maxHeight});
		}
	}

	resetHeight() {
		this.maxHeight = 0;
		this.$items.css({height: ''});
		if (this.options.setParentHeight) {
			this.$el.css({height: ''});
		}
		this.calcHeight();
		this.setHeight();
	}

}

export default HeightEqualizer;

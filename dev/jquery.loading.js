/*
 * @description: Show loading when event happens
 * @author: Thanh Dao
 * @version: 0.1
 * @date: 2015-11-03;
 */
if ("undefined" == typeof jQuery)
	throw new Error("LoadingJS requires jQuery");
!function ($) {

	// Define Constant variables
	var SPEED = { 'slow': 4, 'normal': 8, 'fast': 12 },
			SIZE = { 'small': 6, 'normal': 10, 'large': 20 },
			TYPE = ['inline', 'square', 'triangle', 'circle', 'wave'];

	var Loading = function (element, options) {
		this.hasOption = (typeof options == 'object');
		this.element = element;
		this.opt = {
			itemColor: '#000',
			itemQuantity: 6,
			itemSize: 6,
			speed: 4,
			shape: 'square',
			type: 'inline'
		};

		this.appendData(options);

		return this;
	};

	Loading.prototype = {

		appendData: function (options) {
			if (this.hasOption) {
				this.opt.itemColor = (options.itemColor) ? options.itemColor : this.opt.itemColor;
				this.opt.itemQuantity = (options.itemQuantity) ? options.itemQuantity : this.opt.itemQuantity;
				this.opt.shape = (options.shape) ? options.shape : this.opt.shape;
				this.opt.itemSize = (options.itemSize) ? options.itemSize : this.opt.itemSize;
				this.opt.speed = (options.speed) ? SPEED[options.speed] : this.opt.speed;

				if (options.type) {
					if (TYPE.indexOf(options.type) != -1)
						this.opt.type = options.type;
					else throw new Error('LoadingJS: Invalid loading type');
				}
			}

			this.itemStyle = 'width:'+this.opt.itemSize+'px;height:'+this.opt.itemSize+'px;';

			if (this.opt.shape == 'circle')
				this.itemStyle += 'border-radius:'+(this.opt.itemSize/2)+'px';
		},

		generate: function () {
			this.element.css('display' ,'block');
			this.element.addClass('jquery-loading').html('<div class="ld-center"></div>');

			if (this.opt.type == 'inline')
				this.generateInline();
			else if (this.opt.type == 'square')
				this.generateSquare();
			else if (this.opt.type == 'triangle')
				this.generateTriangle();

			this.element.find('.ld-item').css('background-color', this.opt.itemColor);
			this.presentation();
		},

		run: function (action) {
			this.generate();
			action();
		},

		presentation: function () {
			var _obj = this,
					_range = 1/(this.opt.itemQuantity - 1),
					_start = 0,
					_opacity;

			this.actionInterval = setInterval(function () {
				_opacity = _start;

				_obj.element.find('.ld-item').each(function () {

					if (_opacity > 1) _opacity -= 1;

					$(this).css('opacity', _opacity);
					_opacity += _range;
				});

				_start += _range;
				if (_start > 1) _start -= 1;
			}, (1000/this.opt.speed));
		},

		stop: function () {
			clearInterval(this.actionInterval);
			this.element.css('display', 'none');
		},

		// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		//      DEFINE FUNCTIONS, WHICH GENERATE LOADING FOLLOW THE TYPE      +
		// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		generateInline: function () {
			for (var i=0; i<this.opt.itemQuantity; i++) {
				this.element.find('.ld-center').append('<div style="'+this.itemStyle+'" class="ld-item inline '+this.opt.shape+'"></div>');
			}
		},

		/**
		 * If want to define `square`, the quantity must divisible by 4
		 */
		generateSquare: function () {
			if (this.opt.itemQuantity % 4 != 0)
				throw new Error('LoadingJS: Quantity must be divisible by 4');
			else {
				var _top = 0,
						_left = 0,
						_divide = this.opt.itemQuantity / 4;

				for (var i=0; i<this.opt.itemQuantity; i++) {
					if (i / _divide <= 1) {
						_left += this.opt.itemSize + 3;
					} else if (i / _divide <= 2) {
						_top += this.opt.itemSize + 3;
					} else if (i / _divide <= 3) {
						_left -= this.opt.itemSize + 3;
					} else if (i / _divide <= 4) {
						_top -= this.opt.itemSize + 3;
					}

					this.element.find('.ld-center').append('<div style="'+this.itemStyle+';left:'+_left+'px;top:'+_top+'px" class="ld-item square '+this.opt.shape+'"></div>');
				}
			}
		},

		generateCircle: function () {
			var _top = 0,
					_left = 20,
					_angle = 360/this.opt.itemQuantity,
					_r = 20;
		},

		/**
		 * If want to define `wave`, the quantity must divisible by 5
		 */
		generateWave: function () {
			// for (var i=0; i<this.opt.itemQuantity; i++) {
			// 	if (i % 5 == 1) {
			// 		this.element.find('.ld-center').append('<div style="'+this.itemStyle+'" class="ld-item inline '+this.opt.shape+'"></div>');
			// 	} else if (i % 5 == 2) {
			// 		this.element.find('.ld-center').append('<div style="'+this.itemStyle+'" class="ld-item inline '+this.opt.shape+'"></div>');
			// 	} else if (i % 5 == 3) {
			// 		this.element.find('.ld-center').append('<div style="'+this.itemStyle+'" class="ld-item inline '+this.opt.shape+'"></div>');
			// 	} else if (i % 5 == 4) {
			// 		this.element.find('.ld-center').append('<div style="'+this.itemStyle+'" class="ld-item inline '+this.opt.shape+'"></div>');
			// 	} else {
			// 		this.element.find('.ld-center').append('<div style="'+this.itemStyle+'" class="ld-item inline '+this.opt.shape+'"></div>');
			// 	}
			// }
		},

		generateTriangle: function () {
			var _top = 0,
					_left = 30,
					_divide = this.opt.itemQuantity / 3,
					_size = 60,
					_height = (Math.sqrt(3) / 2) * _size;

			for (var i=0; i<this.opt.itemQuantity; i++) {
				if (i / _divide <= 1) {
					_left += 30 / _divide;
					_top += _height / _divide;
				} else if (i / _divide <= 2) {
					_left -= 60 / _divide;
				} else if (i / _divide <= 3) {
					_left += 30 / _divide;
					_top -= _height / _divide;
				}
				this.element.find('.ld-center').append('<div style="'+this.itemStyle+';left:'+_left+'px;top:'+_top+'px" class="ld-item square '+this.opt.shape+'"></div>');
			}
		}
	};

	$.fn.loading = function (options) {
		var el = $(this);
		el.data('loading', new Loading(el, options));

		return el.data('loading');
	}
}(jQuery);
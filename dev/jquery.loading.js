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
				this.opt.message = (options.message) ? options.message : null;

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
			var width;

			this.element.css('display' ,'block');
			this.element.addClass('jquery-loading').html('<div class="ld-center"></div>');

			if (this.opt.type == 'inline')
				width = this.generateInline();
			else if (this.opt.type == 'square')
				width = this.generateSquare();
			else if (this.opt.type == 'triangle')
				width = this.generateTriangle();
			else if (this.opt.type == 'circle')
				width = this.generateCircle();

			this.element.find('.ld-center').css('margin-left', '-'+(width/2)+'px');
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
			return this.element.find('.ld-center').width();
		},

		/**
		 * If want to define `square`, the quantity must divisible by 4
		 */
		generateSquare: function () {
			if (this.opt.itemQuantity % 4 != 0)
				throw new Error('LoadingJS: Quantity must be divisible by 4');
			else {
				var _top = 0,
						_left = 0 - (this.opt.itemSize + 3),
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

				return (_divide + 1) * (this.opt.itemSize + 3);
			}
		},

		generateCircle: function () {
			var _top = 0,
					_left = 0,
					_angle = 0,
					_step = (2 * Math.PI) / this.opt.itemQuantity;
					_radius = 30;

			for (var i=0; i<this.opt.itemQuantity; i++) {
				_angle += _step;
				_left = Math.cos(_angle) * _radius + 30;
				_top = Math.sin(_angle) * _radius + 30;
				this.element.find('.ld-center').append('<div style="'+this.itemStyle+';left:'+_left+'px;top:'+_top+'px" class="ld-item square '+this.opt.shape+'"></div>');
			}
			return _radius * 2 + this.opt.itemSize;
		},

		/**
		 * If want to define `wave`, the quantity must divisible by 5
		 */
		generateWave: function () {

		},

		generateTriangle: function () {
			var _divide = this.opt.itemQuantity / 3,
					_top = 0,
					_left = 30 - (30 / _divide),
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

			return _size;
		}
	};

	$.fn.loading = function (options) {
		var el = $(this);
		el.data('loading', new Loading(el, options));

		return el.data('loading');
	}
}(jQuery);
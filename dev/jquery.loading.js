/*
 * @description: Show loading when event happens
 * @author: Thanh Dao
 * @version: 0.1
 * @date: 2015-11-03;
 */
if ("undefined" == typeof jQuery)
	throw new Error("LoadingJS requires jQuery");
!function ($) {

	var Loading = function (element, options) {
		
	};

	$.fn.loading = function (options) {
		this.each(function () {
			var el = $(this);
			el.data('loading', new Loading(el, options));
		});
		return this;
	}
}(jQuery);
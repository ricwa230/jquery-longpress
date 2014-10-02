/**
 * Longpress is a jQuery plugin that makes it easy to support long press
 * events on mobile devices and desktop borwsers.
 *
 * @name longpress
 * @version 0.1.2
 * @requires jQuery v1.2.3+
 * @author Vaidik Kapoor
 * @license MIT License - http://www.opensource.org/licenses/mit-license.php
 *
 * For usage and examples, check out the README at:
 * http://github.com/vaidik/jquery-longpress/
 *
 * Copyright (c) 2008-2013, Vaidik Kapoor (kapoor [*dot*] vaidik -[at]- gmail [*dot*] com)
 */

(function($) {
    $.fn.longpress = function(options) {
        var options = $.extend({
            duration: 500,
            selector: null,
            longCallback: function () {return true;},
            shortCallback: function () {return true;}
        }, options);

        return this.each(function() {
            var $this = $(this);

            // to keep track of how long something was pressed
            var mouse_down_time;
            var timeout;

            // mousedown or touchstart callback
            function mousedown_callback(e) {
                clearTimeout(timeout);
                mouse_down_time = new Date().getTime();
                var context = $(this);

                // set a timeout to call the longpress callback when time elapses
                timeout = setTimeout(function() {
                    if (typeof options.longCallback === "function") {
                        options.longCallback.call(context, e);
                    } else {
                        $.error('Callback required for long press. You provided: ' + typeof options.longCallback);
                    }
                }, options.duration);
            }

            // mouseup or touchend callback
            function mouseup_callback(e) {
                var press_time = new Date().getTime() - mouse_down_time;
                if (press_time < options.duration) {
                    // cancel the timeout
                    clearTimeout(timeout);

                    // call the shortCallback if provided
                    if (typeof options.shortCallback === "function") {
                        options.shortCallback.call($(this), e);
                    } else if (typeof options.shortCallback === "undefined") {
                        ;
                    } else {
                        $.error('Optional callback for short press should be a function.');
                    }
                }
            }

            // cancel long press event if the finger or mouse was moved
            function move_callback(e) {
                clearTimeout(timeout);
            }

            // Browser Support
            $this.on('mousedown', options.selector, mousedown_callback);
            $this.on('mouseup', options.selector, mouseup_callback);
            $this.on('mousemove', options.selector, move_callback);

            // Mobile Support
            $this.on('touchstart', options.selector, mousedown_callback);
            $this.on('touchend', options.selector, mouseup_callback);
            $this.on('touchmove', options.selector, move_callback);
        });
    };
}(jQuery));

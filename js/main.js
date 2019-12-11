;
(function() {
    'use strict';
    var isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };
    var fullHeight = function() {
        if (!isMobile.any()) {
            $('.js-fullheight').css('height', $(window).height());
            $(window).resize(function() {
                $('.js-fullheight').css('height', $(window).height());
            });
        }
    };
    var parallax = function() {
        $(window).stellar();
    };
    var contentWayPoint = function() {
        var i = 0;
        $('.animate-box').waypoint(function(direction) {
            if (direction === 'down' && !$(this.element).hasClass('animated-fast')) {
                i++;
                $(this.element).addClass('item-animate');
                setTimeout(function() {
                    $('body .animate-box.item-animate').each(function(k) {
                        var el = $(this);
                        setTimeout(function() {
                            var effect = el.data('animate-effect');
                            if (effect === 'fadeIn') {
                                el.addClass('fadeIn animated-fast');
                            } else if (effect === 'fadeInLeft') {
                                el.addClass('fadeInLeft animated-fast');
                            } else if (effect === 'fadeInRight') {
                                el.addClass('fadeInRight animated-fast');
                            } else {
                                el.addClass('fadeInUp animated-fast');
                            }
                            el.removeClass('item-animate');
                        }, k * 100, 'easeInOutExpo');
                    });
                }, 50);
            }
        }, {
            offset: '85%'
        });
    };
    var goToTop = function() {
        $('.js-gotop').on('click', function(event) {
            event.preventDefault();
            $('html, body').animate({
                scrollTop: $('html').offset().top
            }, 500, 'easeInOutExpo');
            return false;
        });
        $(window).scroll(function() {
            var $win = $(window);
            if ($win.scrollTop() > 200) {
                $('.js-top').addClass('active');
            } else {
                $('.js-top').removeClass('active');
            }
        });
    };
    var pieChart = function() {
        $('.chart').easyPieChart({
            scaleColor: false,
            lineWidth: 4,
            lineCap: 'butt',
            barColor: '#3498db',
            trackColor: "#f5f5f5",
            size: 160,
            animate: 1000
        });
    };
    var skillsWayPoint = function() {
        if ($('#fh5co-skills').length > 0) {
            $('#fh5co-skills').waypoint(function(direction) {
                if (direction === 'down' && !$(this.element).hasClass('animated')) {
                    setTimeout(pieChart, 400);
                    $(this.element).addClass('animated');
                }
            }, {
                offset: '90%'
            });
        }
    };
    var loaderPage = function() {
        $(".fh5co-loader").fadeOut("slow");
    };
    var github = function() {
        $.getJSON('https://api.github.com/users/NecmettinCimen/repos', function(data) {
            data.sort(function (a,b) {
                return new Date(b.updated_at) - new Date(a.updated_at)
            })
            for (var i = 0; i < data.length; i++) {
                var element = data[i];
                $('#myProjects').append('<div class="col-lg-3 col-md-4 col-sm-6 text-center" style="height:300px">' + '<div class="feature-left">' + '<span class="icon">' + '<i class="icon-github2"></i>' + '</span>' + '<div class="feature-copy">' + '<a href="' 
                + element.html_url + '" target="_blank"><h3>' + element.name + '</h3></a>' + '<p>' + (element.description||"") + '</p>' + '<p> Last Update : ' + element.updated_at + '</p>' + '</div>' + '</div>' + '</div>')
            }
        })
    }
    $(function() {
        contentWayPoint();
        goToTop();
        loaderPage();
        fullHeight();
        parallax();
        skillsWayPoint();
        github();
    });
}());

$(document).ready(function() {
	$(".fancybox-thumb").fancybox({
		prevEffect	: 'none',
		nextEffect	: 'none',
		helpers	: {
			title	: {
				type: 'outside'
			},
			thumbs	: {
				width	: 50,
				height	: 50
			}
		}
	});
});
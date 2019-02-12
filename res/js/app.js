$(document).ready(function() {
	//////////////////////////////////////////
	//Layout section
	/////////////////////////////////////////
	var sameSizeFiltr = $('.sameSize').filterizr({
		delay: 25,
		filterOutCss: {
			opacity: 0,
			transform: 'scaleX(0.5)'
		},
		filterInCss: {
			opacity: 1,
			transform: 'scaleX(1)'
		},
		layout: 'sameSize',
		setupControls: false
	});
	var progressiveFiltr = $('.delayModeProgressive').filterizr({
		delay: 50,
		layout: 'sameSize',
		setupControls: false
	});
	var alternateFiltr = $('.delayModeAlternate').filterizr({
		delay: 350,
		delayMode: 'alternate',
		layout: 'sameSize',
		setupControls: false
	});
    var sortingFltr = $('.sortingFltr').filterizr({
		delay: 25,
		setupControls: false
	});
	var packedFiltr = $('.packed').filterizr({
		delay: 25,
		layout: 'packed',
		setupControls: false
	});
	var sameHeightFiltr = $('.sameHeight').filterizr({
		delay: 250,
		delayMode: 'alternate',
		layout: 'sameHeight',
		setupControls: false
	});
	var sameWidthFiltr = $('.sameWidth').filterizr({
		delay: 25,
		layout: 'sameWidth',
		setupControls: false
	});
	var horizontalFiltr = $('.horizontalLayout').filterizr({
		delay: 250,
		delayMode: 'alternate',
		layout: 'horizontal',
		setupControls: false
	});
	var verticalFiltr = $('.verticalLayout').filterizr({
		delay: 25,
		layout: 'vertical',
		setupControls: false
	});
    var filteringModeSingle = $('.filteringModeSingle').filterizr({
		delay: 25,
		setupControls: false
	});
    var filteringModeMulti = $('.filteringModeMulti').filterizr({
		delay: 25,
		setupControls: false
	});
    //Filtering section nav
    $('#filteringModeSingle li').click(function() {
		$('.filters-filteringModeSingle .filtr').removeClass('filtr-active');
		$(this).addClass('filtr-active');
		var filter = $(this).data('fltr');
		filteringModeSingle.filterizr('filter', filter);
	});
    $('#filteringModeMulti li').click(function() {
        var targetFilter = $(this).data('multifltr');
        if (targetFilter === 'all') {
            $('#filteringModeMulti li').removeClass('filtr-active');
            $(this).addClass('filtr-active');
            filteringModeMulti.filterizr('filter', 'all');
            filteringModeMulti._fltr._toggledCategories = { };
        }
        else {
            $('#filteringModeMulti li[data-multifltr="all"]').removeClass('filtr-active');
            $(this).toggleClass('filtr-active');
            filteringModeMulti.filterizr('toggleFilter', targetFilter);
        }
        if (!filteringModeMulti._fltr._multifilterModeOn()) {
            $('#filteringModeMulti li[data-multifltr="all"]').addClass('filtr-active');
        }
	});
    //Sorting section nav
    $('#sortingNav li').click(function() {
        var sortBy    = $('#sorting .select-order').val();
        var sortOrder = $(this).data('fltrsortorder');
		$('.filters-sorting .filtr').removeClass('filtr-active');
		$(this).addClass('filtr-active');
        sortingFltr.filterizr('sort', sortBy, sortOrder);
	});
	//Delay mode navs
	$('#delayModeProgressive li').click(function() {
		$('.filters-delayModeProgressive .filtr').removeClass('filtr-active');
		$(this).addClass('filtr-active');
		var filter = $(this).data('fltr');
		progressiveFiltr.filterizr('filter', filter);
	});
	$('#delayModeAlternate li').click(function() {
		$('.filters-delayModeAlternate .filtr').removeClass('filtr-active');
		$(this).addClass('filtr-active');
		var filter = $(this).data('fltr');
		alternateFiltr.filterizr('filter', filter);
	});
	//Navigations
	$('#sameSizeNav li').click(function() {
		$('.filters-sameSize .filtr').removeClass('filtr-active');
		$(this).addClass('filtr-active');
		var filter = $(this).data('fltr');
		sameSizeFiltr.filterizr('filter', filter);
	});
	$('#packedNav li').click(function() {
		var btnFilter  = $(this).data('fltr'),
			currFilter = packedFiltr._fltr.options.filter;

		$('.filters-packed .filtr').removeClass('filtr-active');
		$(this).addClass('filtr-active');
		if (btnFilter !== currFilter) packedFiltr.filterizr('filter', btnFilter);
	});
	$('#sameHeightNav li').click(function() {
		$('.filters-sameHeight .filtr').removeClass('filtr-active');
		$(this).addClass('filtr-active');
		var filter = $(this).data('fltr');
		sameHeightFiltr.filterizr('filter', filter);
	});
	$('#sameWidthNav li').click(function() {
		$('.filters-sameWidth .filtr').removeClass('filtr-active');
		$(this).addClass('filtr-active');
		var filter = $(this).data('fltr');
		sameWidthFiltr.filterizr('filter', filter);
	});
	$('#horizontalLayoutNav li').click(function() {
		$('.filters-horizontalLayout .filtr').removeClass('filtr-active');
		$(this).addClass('filtr-active');
		var filter = $(this).data('fltr');
		horizontalFiltr.filterizr('filter', filter);
	});
	$('#verticalLayoutNav li').click(function() {
		$('.filters-verticalLayout .filtr').removeClass('filtr-active');
		$(this).addClass('filtr-active');
		var filter = $(this).data('fltr');
		verticalFiltr.filterizr('filter', filter);
	});
	//////////////////////////////////////////
	//Showcase section
	/////////////////////////////////////////
	//intercept tab to indent
	$(document).delegate('#galstyles', 'keydown', function(e) {
	  var keyCode = e.keyCode || e.which;

	  if (keyCode == 9) {
		    e.preventDefault();
		    var start = $(this).get(0).selectionStart;
		    var end = $(this).get(0).selectionEnd;

		    // set textarea value to: text before caret + tab + text after caret
		    $(this).val($(this).val().substring(0, start) + "\t" + $(this).val().substring(end));

		    // put caret at right position again
		    $(this).get(0).selectionStart = $(this).get(0).selectionEnd = start + 1;
		}
	});
	//Setup buttons
	$('.filters .filtr').click(function() {
		$('.filters .filtr').removeClass('filtr-active');
		$(this).addClass('filtr-active');
	});
	$('.sorting .filtr').click(function() {
		$('.sorting .filtr').removeClass('filtr-active');
		$(this).addClass('filtr-active');
	});
	$('.filtr-shuffle').click(function() {
		$('.sorting .filtr').removeClass('filtr-active');
	});
	//Select val checking
	var lastSelectVal = $('.select-order').val();

	$('.select-order').click(function() {
		var thisVal = $(this).val();
		if (thisVal !== lastSelectVal) {
			$('.sorting .filtr').removeClass('filtr-active');
			lastSelectVal = thisVal;
		}
	});
	//Setup Filterizr
	$('.filtr-container').imagesLoaded(function() {
		var userStyles = {
			delay: 25,
			filterOutCss: {
				opacity: 0,
				transform: 'scale(0.75)'
			},
			filterInCss: {
				opacity: 1,
				transform: 'scale(1)'
			}
		};
		var filterizr = $('.filtr-container').filterizr(userStyles);
        $('.filtr-item').click(function(e) {
            if ($(this).hasClass('filteredOut')) {
                e.preventDefault();
            }
        });
		//Setup showcase section
		var styleText = $('#galstyles').val(JSON.stringify(userStyles, undefined, 4)),
			successMsg = $('#successmsg'),
			errMsg = $('#errormsg'),
			warnMsg = $('#warnmsg');

		$('#filterizeit').click(function() {
			try {
				var val = JSON.parse(styleText.val());
				//propsOkay checks that both filterOutCss and filterInCss have the same props
				var propsOkay = function() {
					for (var p in val.filterInCss) {
						if (typeof val.filterOutCss[p] === 'undefined') return false;
					}
					for (p in val.filterOutCss) {
						if (typeof val.filterInCss[p] === 'undefined') return false;
					}
					return true;
				}();
				if (!propsOkay) {
					//show warning message
					warnMsg.fadeIn(500, function() {
						setTimeout(function() {
							warnMsg.fadeOut(250);
						}, 3500);
					});
				}
				else {
					filterizr.filterizr('setOptions', val);
					//show success message
					successMsg.fadeIn(500, function() {
						setTimeout(function() {
							successMsg.fadeOut(250);
						}, 1000);
					});
				}
			}
			catch (err) {
				//show message of failure
				errMsg.fadeIn(500, function() {
					setTimeout(function() {
						errMsg.fadeOut(250);
					}, 1000);
				});
			}
		});

		//////////////////////////////////////////
		//Setup Controls
		/////////////////////////////////////////
		//Setup navigations for SPA
		$('.plain-link').click(function(e) {
			//stop navigation
			e.preventDefault();
			//setup spa
			var buttons 	  = $('.plain-link'),
				activeButton  = $(this),
				activeLink    = activeButton.find('a'),
				sections  	  = $('.content-section-js');
				activeSection = $('.content-section-js' + activeLink.attr('href'));
			//Update link status
			buttons.removeClass('active');
			activeButton.addClass('active');
			//Show corresponding section
			sections.hide();
			activeSection.show();
			//For tutorials section
			if (activeSection.attr('id') === 'showcase') {
				filterizr.filterizr('filter', filterizr._fltr.options.filter);
			}
            if (activeSection.attr('id') === 'filtering') {
                filteringModeSingle.filterizr('filter', filteringModeSingle._fltr.options.filter);
                if (filteringModeMulti._fltr._multifilterModeOn()) {
                    filteringModeMulti.filterizr('toggleFilter');
                }
                else {
                    filteringModeMulti.filterizr('filter', 'all');
                    filteringModeMulti._fltr._toggledCategories = { };
                }
            }
            if (activeSection.attr('id') === 'sorting') {
                sortingFltr.filterizr('filter', sortingFltr._fltr.options.filter);
            }
			if (activeSection.attr('id') === 'delaymodes') {
				progressiveFiltr.filterizr('filter', progressiveFiltr._fltr.options.filter);
				alternateFiltr.filterizr('filter', alternateFiltr._fltr.options.filter);
			}
			if (activeSection.attr('id') === 'layouts') {
				sameSizeFiltr.filterizr('filter', sameSizeFiltr._fltr.options.filter);
				packedFiltr.filterizr('filter', packedFiltr._fltr.options.filter).filterizr('sort', 'h', 'desc');
				sameHeightFiltr.filterizr('filter', sameHeightFiltr._fltr.options.filter);
				sameWidthFiltr.filterizr('filter', sameWidthFiltr._fltr.options.filter);
				horizontalFiltr.filterizr('filter', horizontalFiltr._fltr.options.filter);
				verticalFiltr.filterizr('filter', verticalFiltr._fltr.options.filter);
			}
		});
		$('.plain-link.active').click();
	});

	$('.navbar-brand').click(function(e) {
		e.preventDefault();
		//Scroll to top on logo click
		if ($(document).scrollTop() > 0) {
			$('html, body').stop().animate({
		        'scrollTop': 0
		    });
		}
	});
	//FAQ navigation
	$('.faq ol a').click(function(e) {
		e.preventDefault();
		var target = $(this).attr('href');
		var targetTop = $(target).offset().top - 70;
		$('html, body').stop().animate({
			'scrollTop': targetTop
		});
	});

	//////////////////////////////////////////
	//API section
	/////////////////////////////////////////
	$('.api-method').click(function() {
		var methodToShow = $(this).text();
		//activate new button
		$('.api-method').removeClass('active');
		$(this).addClass('active');
		//show new method
		$('.method').hide();
		$('#' + methodToShow).show();
	});
	$('.api-method.active').click();
	//api links
	$('.doc-window .method-link').click(function() {
		var targetMethod;
		if (typeof $(this).data('target') !== 'undefined') {
			targetMethod = $(this).data('target');
		}
		else targetMethod = $(this).text();
		$('.api-' + targetMethod).click();
	});
});

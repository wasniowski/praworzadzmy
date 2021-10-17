;(function ($) {
    var main = {
        init: function () {
            // Enable Nav Switcher
            enableSimpleSwitcher.init()

            // Dynamic labels
            dynamicLabels.init()

            // Enable Refresh Item
            enableRefreshItem.init()

            // Load Dynamic Items
            loadDynamicItems.init()

            // Enable Filter By Value
            enableFilterByValue.init()

            // Scroll To Next Section
            scrollToNext.init()

            // Calendarium Overlay
            calendariumOverlay.init()

            // Calendarium Slider
            calendariumSlider.init()
        },
    }

    /*
     * Calendarium Slider
     */

    var calendariumSlider = {
        arrowLeftSelector: ".calendarium .arrows .arrow-left",
        arrowRightSelector: ".calendarium .arrows .arrow-right",
        yearsSelector: ".calendarium .years",
        yearsWidth: 0,
        yearSelector: ".calendarium .year",
        yearWidth: 600,
        yearCount: 0,
        currentPosition: 0,
        visibleItems: 2,
        disabledClass: "disabled",

        init: function () {
            const _self = this;
            _self.calculateYearsWidth();
            _self.attachListeners();
        },

        calculateYearsWidth: function () {
            const _self = this;
            _self.yearCount = $(_self.yearSelector).length;
            _self.yearsWidth = _self.yearCount * _self.yearWidth;
            $(_self.yearsSelector).css({ width: `${_self.yearsWidth}px` });
            $(_self.yearSelector).each(function () {
                $(this).css({ width: `${_self.yearWidth}px` });
            });
        },

        attachListeners: function () {
            const _self = this;
            $(_self.arrowLeftSelector).addClass(_self.disabledClass);

            $(_self.arrowLeftSelector).click(function () {
                _self.moveLeft();
            });

            $(_self.arrowRightSelector).click(function () {
                _self.moveRight();
            });
        },

        moveLeft: function () {
            const _self = this;
            if (
                _self.currentPosition + _self.visibleItems > _self.visibleItems &&
                !$(_self.arrowLeftSelector).hasClass(_self.disabledClass)
            ) {
                _self.currentPosition--;
                $(_self.yearsSelector).css({
                    transform: `translateX(-${_self.currentPosition * _self.yearWidth}px)`,
                });

                if (_self.currentPosition + _self.visibleItems === _self.visibleItems) {
                    $(_self.arrowLeftSelector).addClass(_self.disabledClass);
                }

                if (_self.currentPosition + _self.visibleItems < _self.yearCount) {
                    $(_self.arrowRightSelector).removeClass(_self.disabledClass);
                }
            }
        },

        moveRight: function () {
            const _self = this;

            if (
                _self.currentPosition + _self.visibleItems < _self.yearCount &&
                !$(_self.arrowRightSelector).hasClass(_self.disabledClass)
            ) {
                _self.currentPosition++;
                $(_self.yearsSelector).css({
                    transform: `translateX(-${_self.currentPosition * _self.yearWidth}px)`,
                });

                if (_self.currentPosition + _self.visibleItems === _self.yearCount) {
                    $(_self.arrowRightSelector).addClass(_self.disabledClass);
                }

                if (_self.currentPosition + _self.visibleItems > _self.visibleItems) {
                    $(_self.arrowLeftSelector).removeClass(_self.disabledClass);
                }
            }
        },
    }

    /*
     * Calendarium Overlay
     */

    var calendariumOverlay = {
        eventsSelector: ".calendarium-events",
        eventTitleSelector: ".calendarium-event-title",
        eventDetailsSelector: ".calendarium-event-details",
        closeButtonSelector: ".calendarium-events .close-btn",
        activeClass: "active",
        openClass: "opened",
        dataId: "event-id",

        init: function () {
            const _self = this

            $(_self.eventTitleSelector).each(function () {
                $(this).click(function () {
                    const eventId = $(this).data(_self.dataId)
                    _self.showEvent(eventId)
                    $(this).addClass(_self.activeClass)
                    if (!$(_self.eventsSelector).hasClass(_self.openClass)) {
                        $(_self.eventsSelector).addClass(_self.openClass)
                    }
                })
            })

            $(_self.closeButtonSelector).click(function () {
                $(_self.eventsSelector).removeClass(_self.openClass)
                $(_self.eventTitleSelector).each(function () {
                    $(this).removeClass(_self.activeClass)
                })
            })
        },

        showEvent: function (eventId) {
            const _self = this

            $(_self.eventTitleSelector).each(function () {
                $(this).removeClass(_self.activeClass)
            })

            $(_self.eventDetailsSelector).each(function () {
                $(this).removeClass(_self.activeClass)

                if ($(this).attr("id") === eventId) {
                    $(this).addClass(_self.activeClass)
                    $(this).scrollTop(0)
                }
            })
        },
    }

    /*
     * Enable Simple Switcher
     */

    var enableSimpleSwitcher = {
        switcherSelector: ".js-simple-switcher",
        txtSelector: ".js-simple-switcher-txt",
        animationSpeed: 250,

        init: function () {
            var _self = this

            // switch on click
            $(this.switcherSelector).click(function () {
                var $siblingObj = $(this).next()

                if ($(this).data("prev")) {
                    $siblingObj = $(this).prev()
                }

                if ($(this).data("slide")) {
                    $siblingObj.slideToggle(_self.animationSpeed)
                }

                $(this).toggleClass("active")
                $siblingObj.toggleClass("switched")

                if ($(this).data("alttxt")) {
                    if (
                        $(this).data("alttxt") ==
                        $(this).find(_self.txtSelector).text()
                    ) {
                        $(this)
                            .find(_self.txtSelector)
                            .text($(this).data("basetxt"))
                    } else {
                        if (!$(this).data("basetxt")) {
                            $(this).data(
                                "basetxt",
                                $(this).find(_self.txtSelector).text()
                            )
                        }
                        $(this)
                            .find(_self.txtSelector)
                            .text($(this).data("alttxt"))
                    }
                }

                return false
            })
        },
    }

    /*
     * Dynamic Labels
     */

    var dynamicLabels = {
        formSelector: ".js-dl-form",
        itemSelector: ".js-dl-item",

        init: function () {
            var _self = this

            var fieldsObj =
                this.formSelector +
                ' input[type="text"], ' +
                this.formSelector +
                ' input[type="email"], ' +
                this.formSelector +
                ' input[type="number"], ' +
                this.formSelector +
                ' input[type="tel"], ' +
                this.formSelector +
                ' input[type="password"], ' +
                this.formSelector +
                " textarea"

            $(fieldsObj).each(function () {
                _self.setFilled(this)
            })

            $(document).on("focus", fieldsObj, function () {
                $(this).closest(_self.itemSelector).addClass("filled")
            })

            $(document).on("blur", fieldsObj, function () {
                var obj = this
                _self.setFilled(obj)
            })

            $(document).on("change", fieldsObj, function () {
                _self.setFilled(this)
            })

            $(document).on("click", this.itemSelector, function () {
                $(this)
                    .find(
                        'input[type="text"], input[type="email"], input[type="number"], input[type="tel"], input[type="password"], textarea'
                    )
                    .focus()
            })
        },

        setFilled: function (obj) {
            if ($(obj).val() != "") {
                $(obj).closest(this.itemSelector).addClass("filled")
            } else {
                $(obj).closest(this.itemSelector).removeClass("filled")
            }
        },
    }

    /*
     * Enable Refresh Item
     */

    var enableRefreshItem = {
        wrapperSelector: ".js-refresh-item-wrapper",
        triggerSelector: ".js-refresh-item-trigger",
        itemSelector: ".js-refresh-item",
        itemContentsSelector: ".js-refresh-item-contents",

        init: function () {
            var _self = this

            // do refresh on trigger click
            $(this.wrapperSelector)
                .find(this.triggerSelector)
                .click(function () {
                    _self.doRefreshing(
                        $(this)
                            .closest(_self.wrapperSelector)
                            .find(_self.itemSelector)
                    )

                    return false
                })
        },

        doRefreshing: function ($item) {
            if ($item.length) {
                var ajaxDataAction = $item.data("refresh-item-action")
                var currentItemId = $item
                    .find(this.itemContentsSelector)
                    .data("current-item-id")

                $.ajax({
                    url: _baseUrl + "/wp-admin/admin-ajax.php",
                    type: "POST",
                    cache: false,
                    data: {
                        action: ajaxDataAction,
                        currentitemid: currentItemId,
                    },
                    beforeSend: function () {
                        $item.addClass("loading")
                    },

                    success: function (data) {
                        $item.removeClass("loading").html(data)
                    },
                })
            }
        },
    }

    /*
     * Load Dynamic Items
     */

    var loadDynamicItems = {
        listSelector: ".js-di-list",
        listItemsSelector: ".js-di-list-items",
        filtersSelector: ".js-di-filters",
        filtersListSelector: ".js-di-filters-list",
        filtersChoicesSelector: ".js-di-filters-choices",
        scrollTriggerSelector: ".js-di-scroll-trigger",
        sortsSelector: ".js-di-sorts",
        sortSelector: ".js-di-sort",
        loader: null,
        currentRequest: null,
        allowLoading: true,
        urlHandler: {
            kategoria: null,
        },
        paged: 1,

        init: function () {
            var _self = this

            // init loader
            this.initLoader()

            // enanble only if list selector exists
            if (!$(this.listSelector).length) return false

            // load on start
            this.buildState()
            this.requestObjects()

            // load on state change
            History.Adapter.bind(window, "statechange", function () {
                _self.buildState()
                _self.requestObjects()
            })

            // change select filters
            $(document).on(
                "change",
                this.filtersSelector + " select",
                function () {
                    _self.resetPagination()
                    _self.updateUrl($(this).attr("name"), $(this).val())
                }
            )

            // change list filters
            $(this.filtersListSelector)
                .find("a")
                .click(function () {
                    _self.resetPagination()
                    $(this)
                        .closest("li")
                        .addClass("active")
                        .siblings()
                        .removeClass("active")
                    _self.updateUrl(
                        $(this).closest(_self.filtersListSelector).data("name"),
                        $(this).closest("li").data("value")
                    )

                    return false
                })

            // change input
            var requestTimeout = null
            $(this.filtersSelector)
                .find('input[type="text"], input[type="number"]')
                .keyup(function () {
                    var _input = this
                    clearTimeout(requestTimeout)
                    requestTimeout = setTimeout(function () {
                        _self.resetPagination()
                        _self.updateUrl($(_input).attr("name"), $(_input).val())
                    }, 500)
                })

            // change choices filters
            $(this.filtersChoicesSelector)
                .find('input[type="checkbox"]')
                .change(function () {
                    var activeTypes = new Array()
                    $(_self.filtersChoicesSelector)
                        .find('input[type="checkbox"]')
                        .filter(":checked")
                        .each(function () {
                            activeTypes.push($(this).val())
                        })
                    _self.updateUrl(
                        $(this)
                            .closest(_self.filtersChoicesSelector)
                            .data("name"),
                        activeTypes.join(",")
                    )
                    return false
                })

            // scroll trigger
            this.checkScrollTrigger()
            $(window).on("touchmove scroll", function () {
                _self.checkScrollTrigger()
            })

            // change order
            $(document).on("click", this.sortSelector + " span", function () {
                var $currentObj = $(this).closest(_self.sortSelector)
                var order = ""

                // switch asc / desc
                if ($currentObj.hasClass("asc")) {
                    order = "desc"
                } else {
                    order = "asc"
                }

                _self.updateUrl("orderby", $currentObj.data("orderby"))
                _self.updateUrl("order", order)
                return false
            })
        },

        checkScrollTrigger: function () {
            // check trigger visibility
            if ($(this.scrollTriggerSelector).length) {
                if (
                    $(this.scrollTriggerSelector).offset().top <
                        $(window).scrollTop() + $(window).height() &&
                    this.allowLoading
                ) {
                    $(this.scrollTriggerSelector).addClass("active")
                    this.paged = $(this.scrollTriggerSelector).data("paged")
                    this.requestObjects()
                }
            }
        },

        resetPagination: function () {
            this.paged = 1
        },

        initLoader: function () {
            this.loader = $("<div />").addClass("loader")
        },

        requestObjects: function () {
            var _self = this

            // build ajax data
            var ajaxData = {}
            for (var i in this.urlHandler) {
                if (this.urlHandler[i] && this.urlHandler[i] != "0") {
                    ajaxData[i] = this.urlHandler[i]
                }
            }

            ajaxData.action = $(this.listSelector).data("action")
            ajaxData.paged = this.paged

            if (
                $(this.listSelector).data("taxonomy") &&
                $(this.listSelector).data("taxonomy-term")
            ) {
                ajaxData.taxonomy = $(this.listSelector).data("taxonomy")
                ajaxData.taxonomyterm = $(this.listSelector).data(
                    "taxonomy-term"
                )
            }

            this.currentRequest = $.ajax({
                url: _baseUrl + "/wp-admin/admin-ajax.php",
                type: "POST",
                cache: false,
                data: ajaxData,
                beforeSend: function () {
                    if (_self.currentRequest != null) {
                        _self.currentRequest.abort()
                        _self.currentRequest = null
                    }
                    _self.allowLoading = false
                    _self.loader.appendTo(_self.listSelector)
                    $(_self.listSelector).addClass("loading")

                    if (
                        $(_self.scrollTriggerSelector).filter(".active").length
                    ) {
                        $(_self.listSelector).addClass("loading-more")
                    }
                },
                success: function (data) {
                    _self.currentRequest = null
                    _self.allowLoading = true

                    $(_self.listSelector).removeClass("loading loading-more")
                    _self.loader.detach()

                    var $listItems = $(_self.listItemsSelector)
                    if (!$listItems.length) {
                        $listItems = $(_self.listSelector)
                    }

                    // load more or reset view
                    if (
                        $(_self.scrollTriggerSelector).filter(".active").length
                    ) {
                        $listItems.find(_self.scrollTriggerSelector).remove()
                    } else {
                        $listItems.empty()
                    }

                    $listItems.append(data)
                },
            })
        },

        updateUrl: function (key, value) {
            // check wheter key exists
            if (typeof this.urlHandler[key] === "undefined") return false

            if (value && value != "0") {
                this.urlHandler[key] = value
            } else {
                this.urlHandler[key] = null
            }

            // construct url parameters
            var currentUrlArray = location.href.split("?")
            var newUrl = currentUrlArray[0]
            var defaultsParams = {
                page: 1,
            }
            var prefix = ""
            var firstParam = true

            for (var i in this.urlHandler) {
                // check wheter the parameter is no empty
                if (this.urlHandler[i] && this.urlHandler[i] != "0") {
                    // check wheter the parameter is no default
                    if (
                        typeof defaultsParams[i] === "undefined" ||
                        defaultsParams[i] != this.urlHandler[i]
                    ) {
                        // prefix type
                        if (firstParam) {
                            prefix = "?"
                            firstParam = false
                        } else {
                            prefix = "&"
                        }
                        newUrl += prefix + i + "=" + this.urlHandler[i]
                    }
                }
            }

            History.pushState(null, $(document).find("title").text(), newUrl)
        },

        buildState: function () {
            var _self = this

            // build current url handler
            this.buildUrlHandler()

            // fill in value for particular elements

            // select filters
            $(this.filtersSelector)
                .find("select")
                .filter(function () {
                    return (
                        typeof _self.urlHandler[$(this).attr("name")] !==
                        "undefined"
                    )
                })
                .each(function () {
                    var urlHandlerVal = _self.urlHandler[$(this).attr("name")]
                    var newVal = $(this).find("option:first").val()

                    // check option for value
                    $(this)
                        .find("option")
                        .each(function () {
                            if ($(this).val() == urlHandlerVal) {
                                newVal = urlHandlerVal
                                return false
                            }
                        })

                    $(this).val(newVal)
                })

            // list filters
            $(this.filtersListSelector)
                .filter(function () {
                    return (
                        typeof _self.urlHandler[$(this).data("name")] !==
                        "undefined"
                    )
                })
                .each(function () {
                    var urlHandlerVal = _self.urlHandler[$(this).data("name")]

                    var $activeItem = null

                    $(this)
                        .children()
                        .each(function () {
                            if ($(this).data("value") == urlHandlerVal) {
                                $activeItem = $(this)
                                return false
                            }
                        })

                    if (!$activeItem && $(this).data("empty-active") == "1") {
                        var $emptyCurrent = $(this)
                            .children()
                            .filter(function () {
                                return $(this).data("value") == ""
                            })
                            .eq(0)

                        if ($emptyCurrent.length) {
                            $activeItem = $emptyCurrent
                        }
                    }

                    $(this).children().removeClass("active")

                    if ($activeItem) {
                        $activeItem.addClass("active")
                    }
                })

            // choices filters
            $(this.filtersChoicesSelector)
                .filter(function () {
                    return (
                        typeof _self.urlHandler[$(this).data("name")] !==
                        "undefined"
                    )
                })
                .each(function () {
                    var urlHandlerVal = _self.urlHandler[$(this).data("name")]

                    if (urlHandlerVal) {
                        urlHandlerVal.split(",")

                        $(this)
                            .find('input[type="checkbox"]')
                            .each(function () {
                                if (
                                    urlHandlerVal.indexOf($(this).val()) !== -1
                                ) {
                                    $(this).prop("checked", true)
                                }
                            })
                    }
                })

            //input filters
            $(this.filtersSelector)
                .find('input[type="text"], input[type="number"]')
                .filter(function () {
                    return (
                        typeof _self.urlHandler[$(this).attr("name")] !==
                        "undefined"
                    )
                })
                .each(function () {
                    var newVal = _self.urlHandler[$(this).attr("name")]
                    if (!newVal) {
                        newVal = ""
                    }

                    $(this).val(newVal)
                })
        },

        buildUrlHandler: function () {
            var currentQueryVars = this.getQueryVars()

            // store query vars in urlHandler
            for (var i in this.urlHandler) {
                if (
                    typeof currentQueryVars[i] !== "undefined" &&
                    currentQueryVars[i] &&
                    currentQueryVars[i] != "0"
                ) {
                    this.urlHandler[i] = currentQueryVars[i]
                } else {
                    this.urlHandler[i] = null
                }
            }
        },

        getQueryVars: function () {
            var vars = {}
            if (window.location.href.indexOf("?") === -1) return vars
            var hashes = window.location.href
                .slice(window.location.href.indexOf("?") + 1)
                .split("&")
            for (var i = 0; i < hashes.length; i++) {
                var hash = hashes[i].split("=")
                vars[hash[0]] = decodeURIComponent(hash[1])
            }
            return vars
        },
    }

    /*
     * Enable Filter By Value
     */

    var enableFilterByValue = {
        wrapperSelector: ".js-filter-by-value-wrapper",
        triggerSelector: ".js-filter-by-value-trigger",
        choicerSelector: ".js-filter-by-value-choicer",
        itemSelector: ".js-filter-by-value-item",

        init: function () {
            var _self = this

            // filter on trigger click
            $(this.wrapperSelector)
                .find(this.triggerSelector)
                .click(function () {
                    var dataValue = $(this).data("value")

                    if ($(this).hasClass("active")) {
                        dataValue = ""
                    }

                    _self.doFiltering(
                        $(this).closest(_self.wrapperSelector),
                        dataValue
                    )

                    $(this)
                        .closest(_self.wrapperSelector)
                        .find(_self.triggerSelector)
                        .not(this)
                        .removeClass("active")
                    $(this).toggleClass("active")

                    return false
                })

            // filter on choicer change
            $(this.wrapperSelector)
                .find(this.choicerSelector)
                .change(function () {
                    _self.doFiltering(
                        $(this).closest(_self.wrapperSelector),
                        $(this).val()
                    )
                })
        },

        doFiltering: function ($wrapper, value) {
            if (value) {
                $wrapper
                    .find(this.itemSelector)
                    .addClass("disabled")
                    .filter(function () {
                        return $(this).data("value") == value
                    })
                    .removeClass("disabled")
            } else {
                $wrapper.find(this.itemSelector).removeClass("disabled")
            }
        },
    }

    /*
     * Scroll To Next Section
     */

    var scrollToNext = {
        triggerSelector: ".js-stn-trigger",
        wrapperSelector: ".js-stn-wrapper",

        init: function () {
            var _self = this

            $(this.triggerSelector).click(function () {
                _self.doScroll($(this))

                return false
            })
        },

        doScroll: function ($trigger) {
            var $nextItem = $trigger.closest(this.wrapperSelector).next()

            if ($nextItem.length) {
                var scrollTop = Math.ceil($nextItem.offset().top) - 80
                if (scrollTop < 0) {
                    scrollTop = 0
                }
                $("html, body").animate({
                    scrollTop: scrollTop,
                })
            }
        },
    }

    $(function () {
        main.init()
    })
})(jQuery)

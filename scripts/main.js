(function ($) {
  var main = {
    init: function () {
      // Enable Nav Switcher
      enableSimpleSwitcher.init();

      // Dynamic labels
      dynamicLabels.init();
    },
  };

  /*
   * Enable Simple Switcher
   */

  var enableSimpleSwitcher = {
    switcherSelector: ".js-simple-switcher",
    txtSelector: ".js-simple-switcher-txt",
    animationSpeed: 250,

    init: function () {
      var _self = this;

      // switch on click
      $(this.switcherSelector).click(function () {
        var $siblingObj = $(this).next();

        if ($(this).data("prev")) {
          $siblingObj = $(this).prev();
        }

        if ($(this).data("slide")) {
          $siblingObj.slideToggle(_self.animationSpeed);
        }

        $(this).toggleClass("active");
        $siblingObj.toggleClass("switched");

        if ($(this).data("alttxt")) {
          if (
              $(this).data("alttxt") == $(this).find(_self.txtSelector).text()
          ) {
            $(this).find(_self.txtSelector).text($(this).data("basetxt"));
          } else {
            if (!$(this).data("basetxt")) {
              $(this).data("basetxt", $(this).find(_self.txtSelector).text());
            }
            $(this).find(_self.txtSelector).text($(this).data("alttxt"));
          }
        }

        return false;
      });
    },
  };

  /*
   * Dynamic Labels
   */

  var dynamicLabels = {
    formSelector: ".js-dl-form",
    itemSelector: ".js-dl-item",

    init: function () {
      var _self = this;

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
        " textarea";

      $(fieldsObj).each(function () {
        _self.setFilled(this);
      });

      $(document).on("focus", fieldsObj, function () {
        $(this).closest(_self.itemSelector).addClass("filled");
      });

      $(document).on("blur", fieldsObj, function () {
        var obj = this;
        _self.setFilled(obj);
      });

      $(document).on("change", fieldsObj, function () {
        _self.setFilled(this);
      });

      $(document).on("click", this.itemSelector, function () {
        $(this)
          .find(
            'input[type="text"], input[type="email"], input[type="number"], input[type="tel"], input[type="password"], textarea'
          )
          .focus();
      });
    },

    setFilled: function (obj) {
      if ($(obj).val() != "") {
        $(obj).closest(this.itemSelector).addClass("filled");
      } else {
        $(obj).closest(this.itemSelector).removeClass("filled");
      }
    },
  };

  $(function () {
    main.init();
  });
})(jQuery);

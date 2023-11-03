/*header navbar*/
function menubar() {
  var hihu = document.querySelector(".menu-data");
  var element = document.getElementById("Menu-bar");

  if (hihu) {
    hihu.classList.remove("animate__fadeOut");
    element.style.display = "none";
    hihu.style.zIndex = "1";
    hihu.classList.add("animate__fadeIn");
  }
}

function closebar() {
  var hihu = document.querySelector(".menu-data");
  var element = document.getElementById("Menu-bar");
  if (hihu) {
    hihu.classList.remove("animate__fadeIn");
    hihu.style.zIndex = "-20";
    element.style.display = "block";
    hihu.classList.add("animate__fadeOut");
  }
}
/*navbar-close*/

// image slider

const slider = document.querySelector("[data-slider]");

const track = slider.querySelector("[data-slider-track]");
const prev = slider.querySelector("[data-slider-prev]");
const next = slider.querySelector("[data-slider-next]");

if (track) {
  prev.addEventListener("click", () => {
    next.removeAttribute("disabled");

    track.scrollTo({
      left: track.scrollLeft - track.firstElementChild.offsetWidth,
      behavior: "smooth",
    });
  });

  next.addEventListener("click", () => {
    prev.removeAttribute("disabled");

    track.scrollTo({
      left: track.scrollLeft + track.firstElementChild.offsetWidth,
      behavior: "smooth",
    });
  });

  track.addEventListener("scroll", () => {
    const trackScrollWidth = track.scrollWidth;
    const trackOuterWidth = track.clientWidth;

    prev.removeAttribute("disabled");
    next.removeAttribute("disabled");

    if (track.scrollLeft <= 0) {
      prev.setAttribute("disabled", "");
    }

    if (track.scrollLeft === trackScrollWidth - trackOuterWidth) {
      next.setAttribute("disabled", "");
    }
  });
}

/*image slider end*/

/*packagecards*/

(function ($) {
  "use strict";

  var carousels = function () {
    $(".owl-carousel1").owlCarousel({
      loop: true,
      center: true,
      margin: 0,
      responsiveClass: true,
      nav: false,
      responsive: {
        0: {
          items: 1,
          nav: false,
        },
        680: {
          items: 2,
          nav: false,
          loop: false,
        },
        1000: {
          items: 3,
          nav: true,
        },
      },
    });
  };

  $(document).ready(function () {
    carousels();
  });
})(jQuery);

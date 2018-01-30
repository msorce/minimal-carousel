(function () {
    'use strict';
    class MobileSlider {
        constructor(el) {
            this.sliderEl = el;
            this.slideCount = 0;
            this.activeSlide = 0;
            this.touchstartX = 0;
            this.touchendX = 0;
            this.onEnd = this.onEnd.bind(this);
            this.onStart = this.onStart.bind(this);
            this.goTo = this.goTo.bind(this);
            this.upDatePagination = this.upDatePagination.bind(this);
            this.goToPrev = this.goToPrev.bind(this);
            this.goToNext = this.goToNext.bind(this);
            this.sliderPanelSelector = '.slider-panel';
            this.sliderPaginationSelector = '.slider-pagination';
            this.slideLinks = document.querySelectorAll('.mslider a');
            this.prevBtn = this.sliderEl.parentElement.querySelector('.prev') || null;
            this.nextBtn = this.sliderEl.parentElement.querySelector('.next') || null;
            this.slideCount = this.sliderEl.querySelectorAll(this.sliderPanelSelector).length;
            this.sliderEl.style.width = (100 * this.slideCount) + '%';

            Array.from(this.sliderEl.querySelectorAll(this.sliderPanelSelector))
                .forEach(e => {
                    e.style.display = 'block';
                    e.style.opacity = 1;
                })

            for (let n = 0; n < this.slideCount; n++) {
                let activeStatus = n == this.activeSlide ? ' class="is-active"' : '';
                this.sliderEl.parentElement.querySelector(this.sliderPaginationSelector)
                    .innerHTML += '<div ' + activeStatus + '></div>';
            }

            this.addEventListeners();
        }

        addEventListeners() {
            this.sliderEl.addEventListener('touchstart', this.onStart)
            this.sliderEl.addEventListener('mousedown', this.onStart)
            this.sliderEl.addEventListener('touchend', this.onEnd)
            this.sliderEl.addEventListener('mouseup', this.onEnd)

            this.prevBtn && this.prevBtn.addEventListener("click", this.goToPrev);
            this.nextBtn && this.nextBtn.addEventListener("click", this.goToNext);

            Array.from(this.slideLinks)
                .forEach(element => {
                    element.addEventListener("click", e => {
                        e.preventDefault();
                    });
                    element.addEventListener("mousedown", () => {
                        this.swipeDetect = 0;
                    });
                    element.addEventListener("mousemove", () => {
                        this.swipeDetect = 1;
                    });
                    element.addEventListener("mouseup", () => {
                        if (this.swipeDetect === 0) {
                            window.location = element.href;
                        }
                    });
                });
        }

        onStart(e) {
            this.touchstartX = e.pageX || e.changedTouches[0].screenX;
        }

        onEnd(e) {
            this.touchendX = e.pageX || e.changedTouches[0].screenX;
            if (this.touchstartX - this.touchendX > 25)
                this.goTo(this.activeSlide + 1);
            else if (this.touchstartX - this.touchendX < -25)
                this.goTo(this.activeSlide - 1);
            else this.goTo(this.activeSlide);
        }

        goTo(number) {
            this.isSlideAvailable(number);
            this.sliderEl.classList.add('is-animating');
            let percentage = -(100 / this.slideCount) * this.activeSlide;
            this.sliderEl.style.transform = 'translateX( ' + percentage + '% )';
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.sliderEl.classList.remove('is-animating');
            }, 400);
            this.upDatePagination();
        }

        goToPrev() {
            this.goTo(this.activeSlide - 1)
        }

        goToNext() {
            this.goTo(this.activeSlide + 1)
        }

        upDatePagination() {
            let pagination = this.sliderEl.parentElement
                .querySelectorAll(this.sliderPaginationSelector + ' > *');
            for (let n = 0; n < pagination.length; n++) {
                let className = n == this.activeSlide ? 'is-active' : '';
                pagination[n].className = className;
            }
        }

        isSlideAvailable(number) {
            if (number < 0) this.activeSlide = 0;
            else if (number > this.slideCount - 1) this.activeSlide = this.slideCount - 1
            else this.activeSlide = number;
        }

    }

    window.addEventListener('load', () =>
        Array.from(document.querySelectorAll('.mslider'))
            .forEach(el => new MobileSlider(el)));
})();

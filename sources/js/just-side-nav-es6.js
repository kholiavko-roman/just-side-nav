/**
 * Just Side Nav
 *
 * @author Kholiavko Roman
 */

'use scrict';

class JustSideNav {
  constructor() {
    this.showBtnEl = document.querySelector('.js-menu-show');
    this.hideBtnEl = document.querySelector('.js-menu-hide');
    this.elem = document.querySelector('.js-side-nav');
    this.elemWrap = document.querySelector('.js-side-nav-wrap');
    this.nav = document.querySelector('.js-side-nav-content');

    this.startPos = 0;
    this.currPos = 0;
    this.moving = false;

    // Passive event listener support, false by default
    this.supportPassive = false;

    this.showSideNav = this.showSideNav.bind(this);
    this.hideSideNav = this.hideSideNav.bind(this);
    this.blockClicks = this.blockClicks.bind(this);
    this.setTranslateX = this.setTranslateX.bind(this);
    this.update = this.update.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onTransitionEnd = this.onTransitionEnd.bind(this);
    // this.addOpenMenuToggle = this.addOpenMenuToggle.bind(this);

    this.addOpenMenuToggle();
    this.isSupportPassive();
    this.addEventListener();
  }

  isSupportPassive() {
    let _this = this;

    try {
      document.addEventListener('test', null, {
        get passive() {
          // Passive event listener supported
          _this.supportPassive = true;
        }
      })
    } catch (e) {
    }
  }

  addEventListener() {
    this.showBtnEl.addEventListener('click', this.showSideNav);
    this.hideBtnEl.addEventListener('click', this.hideSideNav);
    this.elem.addEventListener('click', this.hideSideNav);
    this.elemWrap.addEventListener('click', this.blockClicks);

    this.elem.addEventListener('touchstart', this.onTouchStart, {passive: this.supportPassive});
    this.elem.addEventListener('touchmove', this.onTouchMove, {passive: this.supportPassive});
    this.elem.addEventListener('touchend', this.onTouchEnd);

    // Open submenu event listener
    let submenuToggle = document.querySelectorAll('.submenu-toggle');

    for (let i = 0; i < submenuToggle.length; i++) {
      let item = submenuToggle[i];

      item.addEventListener('click', function (e) {
        this.parentNode.classList.toggle('active');
      });
    }

  }

  showSideNav() {
    this.elem.classList.add('side-nav--animatable', 'side-nav--visible');
    this.elem.addEventListener('transitionend', this.onTransitionEnd);
  }

  hideSideNav() {
    this.elem.classList.add('side-nav--animatable');
    this.elem.classList.remove('side-nav--visible');
    this.elem.addEventListener('transitionend', this.onTransitionEnd);
  }

  blockClicks(evt) {
    evt.stopPropagation();
  }

  onTouchStart(evt) {
    if (!this.elem.classList.contains('side-nav--visible')) return;

    this.startPos = evt.touches[0].pageX;
    this.currPos = this.startPos;
    this.moving = true;

    requestAnimationFrame(this.update);
  }

  onTouchMove(evt) {
    if (!this.moving) return;

    this.currPos = evt.touches[0].pageX;
  }

  onTouchEnd(evt) {
    if (!this.moving) return;

    this.moving = false;

    let offsetX = Math.min(0, this.currPos - this.startPos);
    // this.setTranslateX('');
    this.elemWrap.style.transform = '';

    if (offsetX < -45) {
      this.hideSideNav();
    }
  }

  onTransitionEnd(evt) {
    this.elem.classList.remove('side-nav--animatable');
    this.elem.removeEventListener('transitionend', this.onTransitionEnd)
  }

  setTranslateX(transformStyle) {
    this.elemWrap.style.transform = transformStyle;
  }

  update() {
    if (!this.moving) return;

    let offsetX = Math.min(0, this.currPos - this.startPos);
    // this.setTranslateX(`translateX(${offsetX}px)`);
    this.elemWrap.style.transform = `translateX(${offsetX}px)`;

    requestAnimationFrame(this.update);
  }

  addOpenMenuToggle() {
    var submenu = this.nav.querySelectorAll('ul');

    for (let i = 0; i < submenu.length; i++) {
      var submenuParent = submenu[i].parentNode;

      // Insert submenu toggle into link menu element
      submenuParent.insertAdjacentHTML('afterbegin', '<span class="submenu-toggle"></span>');
      // Add class to parent el
      submenuParent.classList.add('has-submenu');
    }
  }


}

new JustSideNav();
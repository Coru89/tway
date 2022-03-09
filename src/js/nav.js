// get needed elements to attach event listeners
const elSecondaryNav = document.querySelectorAll('.nav__item--has-level-2 > .nav__item-link');
const elNavButton = document.querySelector('.nav__button');

// toggle open and close mobile nav
elNavButton.addEventListener('click', () => {
    elNavButton.classList.toggle('nav__button--active');
});

// close mobile nav if user clicks outside of nav
document.onclick = (e) => {
  if (
    !e.target.classList.contains('nav') &&
    !e.target.classList.contains('site-head__inner') &&
    !e.target.classList.contains('social-icons__list') &&
    !e.target.classList.contains('nav__button') &&
    !e.target.classList.contains('nav__item-link') &&
    !e.target.classList.contains('nav__item-link-text') &&
    !e.target.classList.contains('nav__secondary')
  ) {
    elNavButton.classList.remove('nav__button--active');
  }
};

// remove active / open classes from mobile nav if window is resized to desktop-sized viewport
window.addEventListener('resize', function () {
  const newWidth = window.innerWidth;

  if (newWidth > 768) {
    document.querySelectorAll('.nav__sublist--open').forEach(el => el.classList.remove('nav__sublist--open'));
    elNavButton.classList.remove('nav__button--active');
  }
});

// add event listeners to nav items which have nested level 2 navigation  
elSecondaryNav.forEach((el) => {
  el.addEventListener('click', function (e) {
    //only apply for mobile
    if (window.innerWidth > 768) {
      return;
    }

    // disable clicking into landing pages on mobile. the top level nav item click instead acts like an accordion
    if (window.innerWidth < 768) {
      e.preventDefault();
    } 

    if (!e.currentTarget ) {
      console.error('Could not find target element');

      return;
    }

    // get the ul element
    const elLevel2List = e.currentTarget.nextElementSibling;

    if (!elLevel2List) {
      console.error('Could not find level 2 list element');

      return;
    }

    // toggle nav level 2 open / close
    elLevel2List.classList.toggle('nav__sublist--open');
  });
});

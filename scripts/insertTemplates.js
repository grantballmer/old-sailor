// insert nav
navbarScript = Handlebars.templates.navbar();
document.querySelector("header").insertAdjacentHTML("afterbegin", navbarScript);

//insert menus
menusSript = Handlebars.templates.menus();
document.querySelector(".menus").insertAdjacentHTML("afterbegin", menusSript);

//insert beer info overlay
beerInfoOverlaySript = Handlebars.templates.beerInfoOverlay();
document
  .querySelector(".beer-info-overlay")
  .insertAdjacentHTML("afterbegin", beerInfoOverlaySript);

//insert footer
footerSript = Handlebars.templates.footer();
document.querySelector("footer").insertAdjacentHTML("afterbegin", footerSript);

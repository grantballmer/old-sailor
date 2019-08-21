const navMenu = document.querySelectorAll(".nav-menu");
const sideNav = document.querySelector(".side-nav");
const exit = sideNav.querySelector(".fa-times");

const body = require("./main");

function toggleSideNav(e) {
  e.stopPropagation(); // need to stopPropagation because of toggle menus script where clicking on body removes noScroll class
  sideNav.classList.toggle("displaySideNav");
}

// manually add and remove no scroll class on body
// otherwise if just use toggle, when clicking on sideNav overlay, the class will be removed due to toggle menus script
navMenu.forEach(menu =>
  menu.addEventListener("click", function(e) {
    body.classList.add("noScroll");
    toggleSideNav(e);
  })
);

exit.addEventListener("click", function(e) {
  body.classList.remove("noScroll");
  toggleSideNav(e);
});

$(document).ready(function() {
  // Insert handlebars templates
  const templatesFile = require("../templates/allTemplates");
  const insertTemplates = require("./insertTemplates");

  // global body variable
  const body = document.querySelector("body");
  module.exports = body;

  // side nav, when 3 bars menu is clicked
  const toggleSideNav = require("./sideNav");

  // beers, events, and taproom menus
  const toggleMenus = require("./side-menus/toggleMenus");
  const menuSlider = require("./side-menus/menuSlider");
  const menuDropdown = require("./menuDropdown");

  // main landing page slider
  const mainSlider = require("./home/mainSlider");

  const beerInfoOverlay = require("./beerInfoOverlay");

  const socialMedia = require("./home/socialMediaFeed");

  const getInstagram = require("./home/getInstagramPost");

  // pages
  const pageSlider = require("./our-beer/page-slider");

  const map = require("./beer-locator/map");
});

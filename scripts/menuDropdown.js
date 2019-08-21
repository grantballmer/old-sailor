const dropdownMenus = document.querySelectorAll(".dropdown");
let currentDropdown; // keep track of which dropdown is currently being targeted

const dropdownRegion = document.querySelectorAll(".dropdown__content--region");
const events = document.querySelectorAll(".event");

function toggleDropdown() {
  currentDropdown.classList.toggle("activeDropdown");
  const dropdownContent = currentDropdown.querySelector(".dropdown__content");
  dropdownContent.classList.toggle("displayDropdownMenu");
}

function filterEvents(selected) {
  events.forEach(item => {
    // if all has been selected then remove classes that hide event elements from all elements
    if (selected === "all") {
      item.classList.remove("zeroHeight", "positionAbs");
      return;
    }

    // if event not in selected region scale event to 0
    // Then position absolute so that it doesn't take up space
    if (item.dataset.region !== selected) {
      item.classList.add("zeroHeight");
      setTimeout(function() {
        item.classList.add("positionAbs");
      }, 300);
    } else {
      // remove classes if event is in selected region.
      item.classList.remove("zeroHeight", "positionAbs");
    }
  });
}

dropdownMenus.forEach(dropdown =>
  dropdown.addEventListener("click", function() {
    currentDropdown = this;
    toggleDropdown();
  })
);

dropdownRegion.forEach(region =>
  region.addEventListener("click", function(e) {
    e.stopPropagation();
    toggleDropdown();
    // set main dropdown text equal to the text from selected dropdown item
    // then set selected dropdown item text to the text of the main dropdown text that was stored in variable tempText
    const dropdownText = currentDropdown.querySelector("h4");
    const tempText = dropdownText.textContent;
    dropdownText.textContent = e.target.textContent;
    e.target.textContent = tempText;

    // filter events by selected region
    const selectedRegion = dropdownText.textContent.toLowerCase();
    filterEvents(selectedRegion);
  })
);

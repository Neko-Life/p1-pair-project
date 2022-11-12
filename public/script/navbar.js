"use strict";

const elements = document.getElementsByClassName("has-dropdown");

for (const el of elements) {
  const dropdown = document.getElementById(`dropdown-${el.id}`);
  el.addEventListener("click", (event) => {
    const hidden = dropdown.classList.contains("hidden");
    const divMenu = document.getElementById(`menu-${el.id}`);
    if (hidden) {
      dropdown.classList.remove("hidden");
      divMenu.classList.add("active");
    } else {
      divMenu.classList.remove("active");
      dropdown.classList.add("hidden");
    }
  });
}

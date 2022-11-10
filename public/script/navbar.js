"use strict";

const elements = document.getElementsByClassName("has-dropdown");

for (const el of elements) {
  const dropdown = document.getElementById(`dropdown-${el.id}`);
  el.addEventListener("click", (event) => {
    const hidden = dropdown.classList.contains("hidden");
    if (hidden) {
      dropdown.classList.remove("hidden");
      el.classList.add("active");
    } else {
      el.classList.remove("active");
      dropdown.classList.add("hidden");
    }
  });
}

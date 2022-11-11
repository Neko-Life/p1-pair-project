"use strict";

const formatTime = (seconds, forceHours) => {
  const minutes = Math.floor(seconds / 60);
  const secondsLeft = Math.floor(seconds % 60);
  const hours = Math.floor(minutes / 60);
  const minutesLeft = Math.floor(minutes % 60);

  return `${hours > 0 ? `${hours < 10 ? "0" : ""}${hours}:` : "" }${minutesLeft < 10 ? "0" : ""}${minutesLeft}:${secondsLeft < 10 ? "0" : ""}${secondsLeft}`;
}

const element = document.getElementById("countdown");

let time = Number(element.innerText);

if (!isNaN(time)) {
  element.innerText = formatTime(time);
  
  let hours = false;
  if (time >= 3600) {
    hours = true;
  }

  const t = {};

  const end = () => {
    clearInterval(t.t);
  }
  t.t = setInterval(() => {
    if (time <= 0) return end();
    element.innerText = formatTime(--time, hours);
  }, 1000);
}

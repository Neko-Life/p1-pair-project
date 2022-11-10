"use strict";

const formatTime = (ms) => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const secondsLeft = Math.floor(seconds % 60);
  const hours = Math.floor(minutes / 60);
  const minutesLeft = Math.floor(minutes % 60);

  return `${hours > 0 ? `${hours < 10 ? "0" : ""}${hours}:` : "" }${minutesLeft < 10 ? "0" : ""}${minutesLeft}:${secondsLeft < 10 ? "0" : ""}${secondsLeft}`;
}

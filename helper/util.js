"use strict";

const baseParam = (paramObject = {}) => {
  return {
    user: null,
    ...paramObject
  }
}

module.exports = {
  baseParam,
}

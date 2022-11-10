"use strict";

const baseParam = (paramObject = {}) => {
  return {
    user: null,
    errors: [],
    ...paramObject
  }
}

module.exports = {
  baseParam,
}

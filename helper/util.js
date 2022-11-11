"use strict";

const { formatPhoneNumber } = require("./formatter");

const baseParam = (paramObject = {}) => {
  if (paramObject?.errors) {
    if (Array.isArray(paramObject.errors.errors)) paramObject.errors = paramObject.errors.errors;
    if (!Array.isArray(paramObject.errors)) paramObject.errors = [paramObject.errors];
    paramObject.errors = paramObject.errors.map(el => el.message || el);
  }

  return {
    formatPhoneNumber,
    user: null,
    profile: null,
    errors: [],
    drivers: [],
    ...paramObject
  }
}

module.exports = {
  baseParam,
}

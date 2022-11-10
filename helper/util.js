"use strict";

const baseParam = (paramObject = {}) => {
  if (paramObject?.errors && !Array.isArray(paramObject.errors)) {
    paramObject.errors = [paramObject.errors].map(el => el.message || el);
  }
  return {
    user: null,
    errors: [],
    drivers: [],
    ...paramObject
  }
}

module.exports = {
  baseParam,
}

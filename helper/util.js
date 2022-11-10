"use strict";

const baseParam = (paramObject = {}) => {
  if (paramObject?.errors) {
    if (Array.isArray(paramObject.errors.errors)) paramObject.errors = paramObject.errors.errors;
    if (!Array.isArray(paramObject.errors)) paramObject.errors = [paramObject.errors];
    paramObject.errors = paramObject.errors.map(el => el.message || el);
  }

  if (!paramObject.user?.profile) {
    if (!paramObject.user) paramObject.user = {};
    paramObject.user.profile = null;
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

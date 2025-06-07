import sanitize from "sanitize-html";

export const sanitizeElement = (e: any): any => {
  if (typeof e == "string") {
    const sanitized = sanitize(e);
    return sanitized;
  } else if (Array.isArray(e)) {
    let sanitizedArray = [];
    for (let listElement of e) {
      sanitizedArray.push(sanitizeElement(listElement));
    }
    return sanitizedArray;
  } else if (typeof e == "object") {
    let sanitizedObject = {};
    for (let currentKey of Object.keys(e as object)) {
      const newValue = sanitizeElement(e[currentKey]);
      sanitizedObject = { ...sanitizedObject, [currentKey]: newValue };
    }
    return sanitizedObject;
  } else {
    return e;
  }
};

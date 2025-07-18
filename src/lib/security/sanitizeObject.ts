import sanitize from "sanitize-html";

export const sanitizeElement = (e: any): any => {
  if (typeof e === "string") {
    return sanitize(e);
  } else if (Array.isArray(e)) {
    return e.map(sanitizeElement);
  } else if (e instanceof Date) {
    // Don't sanitize Date objects, just return them
    return e;
  } else if (typeof e === "object" && e !== null) {
    let sanitizedObject: any = {};
    for (let currentKey of Object.keys(e)) {
      sanitizedObject[currentKey] = sanitizeElement(e[currentKey]);
    }
    return sanitizedObject;
  } else {
    return e;
  }
};

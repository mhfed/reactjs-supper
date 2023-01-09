/**
 * Check Diff between two object
 * @param obj1 first object
 * @param obj2 secon object
 * @returns boolean values diff
 */

export const diff = (obj1: any, obj2: any) => {
  let r: any = {};

  for (let prop in obj1) {
    if (obj1.hasOwnProperty(prop) && prop != '__proto__') {
      if (!obj2.hasOwnProperty(prop)) r[prop] = obj1[prop];
      else if (obj1[prop] === Object(obj1[prop])) {
        let difference = diff(obj1[prop], obj2[prop]);
        if (Object.keys(difference).length > 0) r[prop] = difference;
      } else if (obj1[prop] !== obj2[prop]) {
        if (obj1[prop] === undefined) r[prop] = 'undefined';
        if (obj1[prop] === null) r[prop] = null;
        else if (typeof obj1[prop] === 'function') r[prop] = 'function';
        else if (typeof obj1[prop] === 'object') r[prop] = 'object';
        else r[prop] = obj1[prop];
      }
    }
  }

  return Boolean(Object.keys(r).length);
};

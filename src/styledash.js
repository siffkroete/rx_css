const styledash = (target = document.documentElement) => ({
  set: (key, val) => {
    if (typeof key === 'object' && val === undefined) {
      return Object.keys(key)
        .forEach((subKey) => styledash(target).set(subKey, key[subKey]));
    }

    if (typeof val === 'object') {
      return Object.keys(val).forEach((subkey) => {
        styledash(target).set(`${key}-${subkey}`, val[subkey]);
      });
    }
    // console.log('inside styledash, key: ', key);
    return target.style.setProperty(`--${key}`, val);
  },
  get: (key) => target.style.getPropertyValue(`--${key}`),
});

export default styledash;

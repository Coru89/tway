const tokens = require('./tokens.json');

module.exports = {
  colors() {
    let response = [];

    Object.keys(tokens.colors).forEach(key => {
      response.push({
        value: tokens.colors[key],
        key
      });
    });

    return response;
  },
  sizes() {
    let response = [];

    Object.keys(tokens['font-size-scale']).forEach(key => {
      response.push({
        value: tokens['font-size-scale'][key],
        key
      });
    });

    return response;
  },
  fonts() {
    let response = [];

    Object.keys(tokens['fonts']).forEach(key => {
      response.push({
        value: tokens['fonts'][key].replace(/["]+/g, ''),
        key
      });
    });

    return response;
  }
};

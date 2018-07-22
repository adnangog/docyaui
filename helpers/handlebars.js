function hbsHelpers(hbs) {
    return hbs.create({
      helpers: { // This was missing
        ifEquals: function(arg1, arg2, options) {
          return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
        }
  
        // More helpers...
      }
  
    });
  }
  
  module.exports = hbsHelpers;
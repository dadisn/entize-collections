var _ = require('lodash');

module.exports = function (derby) {
  var name = 'Navigation';
  var ns = 'nav';
  var Model = derby.Model;

  if(Model.collectionExist(name)) return;

  var Navigation = Model.collection(name, ns);

  Navigation.getAll = function(cb) {
    var model = this.model;

    model.subscribe(function (err) {
      // Possibility to deal with error handling
      if(cb) cb(err);
    });
  };

  Navigation.standardSort = function () {
    if(this._standardSort) return this._standardSort;

    var model = this.model;

    this._standardSort = model.sort(function(a, b) {
      if(!a || !b) return false;

      if(_.isArray(a.dropdown)) a.dropdown.sort(function(a, b) { return a.sortOrder - b.sortOrder; });

      if(_.isArray(b.dropdown)) b.dropdown.sort(function(a, b) { return a.sortOrder - b.sortOrder; });

      return a.sortOrder - b.sortOrder;
    });

    return this._standardSort;
  };

  Navigation.getDefaultURL = function () {
    return this.standardSort().get()[0].url;
  };
};

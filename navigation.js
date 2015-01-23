var _ = require('lodash');

module.exports = function (derby) {
  var name = 'Navigation';
  var ns = 'nav';
  var Model = derby.Model;

  if(Model.collectionExist(name, ns)) return;

  var Navigation = Model.collection('Navigation', 'nav');

  Navigation.getAll = function(cb) {
    var model = this.nsModel;

    model.subscribe(function (err) {
      // Possibility to deal with error handling
      if(cb) cb(err);
    });
  };

  Navigation.sort = function () {
    if(this._sort) return this._sort;

    this._sort = this.nsModel.sort(function(a, b) {
      if(!a || !b) return false;

      if(_.isArray(a.dropdown)) a.dropdown.sort(function(a, b) { return a.sortOrder - b.sortOrder; });

      if(_.isArray(b.dropdown)) b.dropdown.sort(function(a, b) { return a.sortOrder - b.sortOrder; });

      return a.sortOrder - b.sortOrder;
    });

    return this._sort;
  };

  Navigation.getDefaultURL = function () {
    return this.sort().get()[0].url;
  };
};

var _ = require('lodash');

module.exports = function (derby) {
  var name = 'Packaging';
  var ns = 'packaging';
  var Model = derby.Model;

  if(Model.collectionExist(name)) return;

  var Packaging = Model.collection(name, ns);

  Packaging.getAll = function(cb) {
    var model = this.model;

    model.subscribe(function (err) {
      // Possibility to deal with error handling
      if(cb) cb(err);
    });
  };

  Packaging.toText = function(value) {
    var packages = this.get();

    return (_.findWhere(packages, {value: value}) || {}).name || '';
  };
};

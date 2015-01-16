module.exports = function (derby) {
  var Model = derby.Model;
  var Example = Model.collection('Example', 'example');

  // Ensure we don't unneccesarily reset the prototype (might be over-optimizing things, but should save us a little tiny bit)
  if(Model.collectionExist(Example.name, Example.ns)) return;

  // E.g. get data to collection
  Example.getAll = function(cb) {
    var model = this.nsModel;

    model.subscribe(function (err) {
      // Possibility to deal with error handling

      if(cb) cb(err);
    });  
  };

  // E.g. model operations
  Example.randomize = function () {
    // Do something
  };
};

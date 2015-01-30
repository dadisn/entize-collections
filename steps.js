module.exports = function (derby) {
  var name = 'Steps';
  var ns = 'steps';
  var Model = derby.Model;

  if(Model.collectionExist(name, ns)) return;

  var Steps = Model.collection(name, ns);

  Steps.getAll = function(cb) {
    var model = this.model;

    model.subscribe(function (err) {
      // Possibility to deal with error handling
      if(cb) cb(err);
    });
  };

  Steps.getMachinesForStep = function (step, cb) {
    // REFACTOR: Promisify to avoid callback hell?
    this.atOrFetchById(step, function (err, step) {
      if(err) return cb(err);

      cb(null, step.at('machines'));
    });
  };
};

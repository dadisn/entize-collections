var _ = require('lodash');

module.exports = function (derby) {
  var name = 'PreCheckRuns';
  var ns = 'precheckruns';
  var Model = derby.Model;

  if(Model.collectionExist(name)) return;

  var PreCheckRuns = Model.collection(name, ns);

  PreCheckRuns.getRun = function(artNr, machine, cb) {
    var query = this.model.query(this.ns, {$or: [{attr: 'artNr', values: artNr}, {attr: 'machine', values: machine}]});

    query.subscribe(function(err) {
      if(err) return cb(err);
      var results = query.get();
      var len = results.length;

      // Prioritize PreCheckRuns by artNr over more general per machine PreCheckRuns
      for(var i = 0; i < len; i++) {
        if(results[i].attr === 'artNr' && results[i].values.indexOf(artNr) > -1) return cb(null, results[i]);
      }
      for(var i = 0; i < len; i++) {
        if(results[i].attr === 'machine' && results[i].values.indexOf(machine) > -1) return cb(null, results[i]);
      }
      return cb(null, undefined);
    });
  };

  PreCheckRuns.addRun = function(name, attr, values, runOrder) {
    if(!_.isArray(values)) values = [values];
    if(!_.isArray(runOrder)) runOrder = [runOrder];

    var run = {
        name: name
      , attr: attr
      , values: values
      , runOrder: runOrder
    };

    return this.model.add(run);
  }
};
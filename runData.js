var _ = require('lodash');

module.exports = function (derby) {
  var name = 'RunData';
  var ns = 'rundata';
  var Model = derby.Model;

  if(Model.collectionExist(name)) return;

  var RunData = Model.collection(name, ns);

  RunData.createRun = function(step, machine, operators, artNr, artName, rowId, cb) {
    var model = this.model;

    // Allow for different ways to define operators
    if(typeof operators === 'number') {
      nrOfOperators = operators;
      operators = [];
    } else if(_.isArray(operators)) {
      nrOfOperators = operators.length;
    } else {
      nrOfOperators = 1;
      operators = [operators];
    }

    if(!this.model.root.hasOwnProperty('PreCheckRuns')) return cb(new Error('PreCheckRuns collection required for adding run data'));

    this.model.root.PreCheckRuns.getRun(artNr, machine, function(err, preCheckRun) {
      if(err) return cb(err);

      var run = {
          artNr: artNr
        , artName: artName
        , rowId: rowId
        , step: step
        , startTime: Date.now()
        , finishTime: null
        , stops: []
        , activeDuration: null
        , stopDuration: null
        , totalDuration: null
        , producedQty: null
        , wasteQty: null
        , machine: machine
        , nrOfOperators: nrOfOperators
        , operators: operators
        , preChecks: []
        , preCheckRun: preCheckRun.id
        , preCheckRunPassed: false
        , preCheckRunDuration: null
      };

      var runId = model.add(run);

      return cb(null, run, runId);
    });

  };
};

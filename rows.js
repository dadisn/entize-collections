var _ = require('lodash');
var sift = require('sift');

module.exports = function (derby) {
  var name = 'Rows';
  var ns = 'rows';
  var Model = derby.Model;

  if(Model.collectionExist(name)) return;

  var Rows = Model.collection(name, ns);

  Rows.getFromMachine = function(step, machine, day, cb) {
    var model = this.model;
    var root = model.root;
    var conditions = {date: day, step: step, 'temp.machine': machine, qty: {$gt: 0}};
    this.filterFn = sift(conditions);
    var query = model.query(this.ns, conditions);
    query.subscribe(function (err) {
      // Possibility to deal with error handling
      if(cb) return cb(err, query);
    });
  }

  Rows.getCurrentNextFromMachine = function (step, machine, day, time, cb) {
    var model = this.model;

    model.fn('timeSort', function(a, b) {
      return a.temp.time - b.temp.time;
    });

    var filter = this.filter(this.filterFn).sort('timeSort');
    var row = _.find(filter.get(), function(row) {
      return (row.temp.time + row.temp.duration > time || row.temp.time > time);
    });
    return cb(undefined, row);
  }
}
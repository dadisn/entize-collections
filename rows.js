var _ = require('lodash');

module.exports = function (derby) {
  var name = 'Rows';
  var ns = 'rows';
  var Model = derby.Model;

  if(Model.collectionExist(name)) return;

  var Rows = Model.collection(name, ns);

  Rows.getFromMachine = function(step, machine, day, cb) {
    var model = this.model;
    var root = model.root;
    var query = model.query(this.ns, {date: day, step: step, 'temp.machine': machine, qty: {$gt: 0}});

    query.subscribe(function (err) {
      // Possibility to deal with error handling

      if(cb) return cb(err, query);
    });
  };

  Rows.getCurrentNextFromMachine = function (step, machine, day, time, cb) {
    this.getFromMachine(step, machine, day, function (err, query) {
      var rows = query.get();
      var row = _getCurrentOrNext(time, rows);
      var scoped = (row && row.id) ? this.model.at(row.id) : undefined;

      if(cb) return cb(err, scoped);
    }.bind(this));
  };
};

function _getCurrentOrNext(time, list) {
  list.sort(function (a, b) {
    return a.temp.time - b.temp.time;
  });

  var i = _.findIndex(list, function (row) {
    return (row.temp.time + row.temp.duration > time || row.temp.time > time);
  });

  return list[i];
}

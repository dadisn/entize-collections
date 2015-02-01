module.exports = function (derby) {
  var name = 'RunData';
  var ns = 'rundata';
  var Model = derby.Model;

  if(Model.collectionExist(name)) return;

  var RunData = Model.collection(name, ns);
};

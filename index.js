module.exports = function (derby) {
  require('./navigation')(derby);
  require('./packaging')(derby);
  require('./precheckruns')(derby);
  require('./rows')(derby);
  require('./runData')(derby);
  require('./steps')(derby);
};
const HistoryRecord = artifacts.require("HistoryRecord");

module.exports = function (deployer) {
  deployer.deploy(HistoryRecord);
};

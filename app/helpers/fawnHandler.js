const Fawn = require("fawn");
// mongoDB setup
const mongoHandler = require('./mongooseHandler');
mongoHandler.myConnect();

Fawn.init(mongoHandler);

module.exports = Fawn;
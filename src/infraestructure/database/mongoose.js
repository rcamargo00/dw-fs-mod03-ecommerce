const mongoose = require('mongoose');
const config = require('../../config');
 
mongoose.connect(config.mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
 
module.exports = mongoose;
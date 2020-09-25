const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  message: {
    type: String,
    require: true,
  },
  room: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "ACTIVE",
    enum: ["ACTIVE", "DELETE"],
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Message", messageSchema);

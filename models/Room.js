const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    default: "",
  },
  isLock: {
    type: String,
    defaul: "NO",
    enum: ["YES", "NO"],
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

module.exports = mongoose.model("Room", roomSchema);

const mongoose = require("mongoose");
const issuesModel = mongoose.Schema(
  {
    Issue: { type: String , required : true },
    Tag: { type: String},
    Bounty: { type: String, required: true  },
    Status : {type : String , default : "Open"},
    Name : {type : String},
    WalletAddress : {type : String}
  },
  { timestamps: true }
);
module.exports = mongoose.model("issues", issuesModel);

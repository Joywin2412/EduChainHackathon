const mongoose = require("mongoose");
const pullRequestModel = mongoose.Schema(
  {
    Code : { type: String , required : true },
    IssueId: { type: String},
    Status : {type : String , default : "Open"}
  },
  { timestamps: true }
);
module.exports = mongoose.model("pullRequests", pullRequestModel);

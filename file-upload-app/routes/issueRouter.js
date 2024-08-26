// const {} = require()
const express =require('express')
const router = express.Router();
const mongoose = require("mongoose");
const AsyncHandler = require("express-async-handler");
const issueModel = require('../models/issues.js');
const pullRequestModel = require("../models/pullRequests.js")
router.post("/add", AsyncHandler(async (req, res) => {
    try{
        const {name,walletAddress , issue,tag,number} = req.body;
        const new_user = await issueModel.create({
            Issue : issue,
            Tag : tag,
            Bounty : number,
            Name : name,
            WalletAddress : walletAddress,
          });
          res.status(200).json(new_user)
        }
        catch(err)
        {
            console.log(err)
            res.status(500).json(err)
        }
})
);

router.post("/invalid", AsyncHandler(async (req, res) => {
    try{
        const {id} = req.body;
        const new_user = await issueModel.findOne({
            _id : id
          });
          let deleteMessage = await issueModel.deleteOne(new_user)
          res.status(200).json(deleteMessage)
        }
        catch(err)
        {
            console.log(err)
            res.status(500).json(err)
        }
})
);

router.post("/close", AsyncHandler(async (req, res) => {
    try{
        // blockchain reward system + pull request id to reward the user
        const {id,pull_request_id} = req.body;

        let pull_request_data = await pullRequestModel.findOne({_id : id})
        let updateMessage = await issueModel.updateOne({_id : id}, {Status : "Closed"})
          res.status(200).json(updateMessage)
        }
        catch(err)
        {
            console.log(err)
            res.status(500).json(err)
        }
})
);

router.post("/pay", AsyncHandler(async (req, res) => {
    try{
        // blockchain reward system + pull request id to reward the user
        const {id,pull_request_id} = req.body;

        let pull_request_data = await pullRequestModel.findOne({_id : id})
        let updateMessage = await issueModel.findOne({_id : id})
          res.status(200).json({
            bounty : updateMessage.Bounty,
            walletAddress : updateMessage.WalletAddress
          })
        }
        catch(err)
        {
            console.log(err)
            res.status(500).json(err)
        }
})
);

router.post("/close", AsyncHandler(async (req, res) => {
  try{
      // blockchain reward system + pull request id to reward the user
      const {id} = req.body;
      console.log(id)
      let updateMessage = await issueModel.updateOne({_id : id}, {status : "Closed"})
        res.status(200).json({
          updateMessage
        })
      }
      catch(err)
      {
          console.log(err)
          res.status(500).json(err)
      }
})
);

router.get("/all", AsyncHandler(async (req, res) => {
        try{
            const issues = await issueModel.find({
              });
              res.status(200).json(issues)
            }
            catch(err)
            {
                console.log(err)
                res.status(500).json(err)
            }
    })
    );
module.exports = router
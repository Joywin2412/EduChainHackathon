// const {} = require()
const express =require('express')
const router = express.Router();
const mongoose = require("mongoose");
const AsyncHandler = require("express-async-handler");
const pullRequestModel = require('../models/pullRequests.js');
router.post("/add", AsyncHandler(async (req, res) => {
    try{
        const {issue,tag,name,walletAddress} = req.body;
        const new_user = await pullRequestModel.create({
            Code : issue,
            IssueId : tag,
            Status : "Open",
            Name : name,
            WalletAddress : walletAddress
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
        const new_user = await pullRequestModel.findOne({
            _id : id
          });
          let deleteMessage = await pullRequestModel.deleteOne(new_user)
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
        const {id} = req.body;

      
        let updateMessage = await pullRequestModel.updateOne({_id : id}, {Status : "Merged"})
          res.status(200).json(updateMessage)
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
            const issues = await pullRequestModel.find({
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
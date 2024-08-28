import { useEffect, useState } from "react"
import axios from 'axios'
import { CloseModal } from "./CloseModal"
import { Web3InvolvementPR } from "./Web3InvolvementPR"
import { Button, Input, Tab, Tabs, Typography } from "@mui/material"

export const PullRequest = () => {
    const [adding,setAdding] = useState(false)
    const [issue,setIssue] = useState("")
    const [tag,setTag] = useState("")
    const [number,setNumber] = useState(0)
    const [displayIssues,setDisplayIssues] = useState({})
    const [change,setChange] = useState(true)
    const [openState,setOpenState] = useState(true)
    const confirmHandler = async() => {
        try{
            await axios.post("http://localhost:5000/pull-requests/add",{issue,tag,
                name: (localStorage.getItem("name")),
                walletAddress: (localStorage.getItem("wallet")) 
            } ,{
                headers: {
                    "Content-Type": "application/json"
                    // Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            }
            })
            setChange(!change)
        }
        catch(err){
            console.log(err)
        }
    }

    const getIssues = async() => {
        try{
            const data = await axios.get("http://localhost:5000/pull-requests/all",{
                headers: {
                    "Content-Type": "application/json"
                    // Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            }
        })
        setDisplayIssues(data.data)
            // setAdding(false)
        }
        catch(err){
            console.log(err)
        }
    }

    const invalidHandler = async(id) => {
        try{
            await axios.post("http://localhost:5000/pull-requests/invalid",{id} ,{
                headers: {
                    "Content-Type": "application/json"
                    // Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            }
            })
            // setAdding(false)
            setChange(!change)
        }
        catch(err){
            console.log(err)
        }
    }

    const closeHandler = async(id) => {
        try{
            await axios.post("http://localhost:5000/pull-requests/close",{id} ,{
                headers: {
                    "Content-Type": "application/json"
                    // Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            }
            })
            setChange(!change)
        }
        catch(err){
            console.log(err)
        }
    }
    useEffect(()=>{
        getIssues();
    },[change,openState])
    return (
        <div style = {{ display : "grid" , marginTop : "30px"  }}>
        <div style = {{justifySelf : "center" , width : "65%"}}>
        <div style = {{display : "grid" , gridAutoFlow : "column" , gridTemplateColumns : "auto auto"}}>
        <Tabs
        value={openState === true ? "true" : "false"}
        onChange = {(e,value) => setOpenState(value === "true" ? true : false)}
        aria-label="wrapped label tabs example"
        >
        <Tab value="true" label="Open" />
        <Tab value="false" label="Merged" />
        </Tabs>
        <div style = {{display : "flex" , justifyContent : "end"}}>
        <Button color = "success" variant = "contained" style = {{display : "flex" , justifyContent : "right"}} onClick = {()=>setAdding(true)} > Add </Button>
        </div>
        </div>
             {adding ? <div>
              <div style = {{display : "grid" , justifyContent : "center" , rowGap : "7px"}}>

                <Input type="text" placeholder="Enter Pull Request" value = {issue} onChange = {(e) => setIssue(e.target.value)}/>
                <Input type = "text" placeholder = "Add issue if exists" value = {tag} onChange = {(e) => setTag(e.target.value)}/>
                <Button onClick = {()=>confirmHandler()}> Confirm </Button>
                <Button onClick = {()=>setAdding(false)}> Cancel </Button>
                </div>
                </div>
                 : null}
            {displayIssues.length > 0 ? displayIssues.map((issue) => {
                if(openState && issue.Status === "Open" || !openState && issue.Status === "Merged"){
                    return (
                    <div key = {issue._id}>
                    <div >
                    <Typography variant = "h6"> The id of this pr is {issue._id} </Typography>
                        <div>Code is <span>{issue.Code}</span> </div>
                        Issue id is <span>{issue.IssueId}</span>
                        </div>
                        <Button variant = "contained" onClick = {()=>invalidHandler(issue._id)}> Invalid</Button>
                        {issue.Status === "Open" && <Button style = {{marginLeft : "4px"}} variant="contained" color = "secondary" onClick = {()=>closeHandler(issue._id)}> Merge</Button>}
                        {issue.Status === "Open" && <Web3InvolvementPR walletAddress = {issue.WalletAddress} id = {issue._id} change = {change} setChange = {setChange}/>}
                    </div>
                    );
                }
}): null}
        </div>
        </div>
    )
}
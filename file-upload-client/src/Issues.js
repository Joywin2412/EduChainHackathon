import { useEffect, useState } from "react"
import axios from 'axios'

import { Web3Involvement } from "./Web3Involvement"
import { Button, Input, Tab, Tabs, Typography } from "@mui/material"
export const Issues = () => {
    const [adding,setAdding] = useState(false)
    const [issue,setIssue] = useState("")
    const [tag,setTag] = useState("")
    const [number,setNumber] = useState(0)
    const [displayIssues,setDisplayIssues] = useState({})
    const [change,setChange] = useState(true)
    const [openState,setOpenState] = useState(true)
    const confirmHandler = async() => {
        try{
            await axios.post("http://localhost:5000/issues/add",{issue,tag,number,
                name: (localStorage.getItem("name")),
                walletAddress: (localStorage.getItem("wallet")) }
             ,{
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
            const data = await axios.get("http://localhost:5000/issues/all",{
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
            await axios.post("http://localhost:5000/issues/invalid",{id} ,{
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
            <Tab value="false" label="Close" />
        </Tabs>
        <div style = {{display : "flex" , justifyContent : "end"}}>
        <Button color = "success" variant = "contained" style = {{display : "flex" , justifyContent : "right"}} onClick = {()=>setAdding(true)} > Add </Button>
        </div>
        </div>
            {adding ? <>
                <div style = {{display : "grid" , justifyContent : "center" , rowGap : "7px"}}>
                <Input type="text" placeholder="Enter Issue" value = {issue} onChange = {(e) => setIssue(e.target.value)}/>
                <Input type = "text" placeholder = "Add tag" value = {tag} onChange = {(e) => setTag(e.target.value)}/>
                <Input type = "number" placeholder = "Enter bounty" value = {number} onChange = {(e) => setNumber(e.target.value)}/>
                <Button onClick = {()=>confirmHandler()}> Confirm </Button>
                <Button onClick = {()=>setAdding(false)}> Cancel </Button>
                </div>
                </>
                 : null}
            {displayIssues.length > 0 ? displayIssues.map((issue) => {
                if(openState && issue.Status === "Open" || !openState && issue.Status === "Closed"){
                    return (
                    <>
                    <div style = {{display : "flex", justifyContent : "center" , alignItems : "center"}} key = {issue._id}>
                        <Typography variant = "h6"> {issue.Issue}</Typography>
                        <Button disabled>{issue.Tag}</Button>
                        <Button disabled> {issue.Bounty}</Button>
                        </div>
                        {issue.Status === "Open" && <Button color = "secondary" variant= "contained" onClick = {()=>invalidHandler(issue._id)}> Invalid</Button>}
                        {issue.Status === "Open" && <Web3Involvement  id = {issue._id} setChange = {setChange} change = {change}/>}
                        </>
                    );
                }
}): null}
        </div>
        </div>
    )
}
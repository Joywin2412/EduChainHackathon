import { useEffect, useState } from "react"
import axios from 'axios'
import { CloseModal } from "./CloseModal"

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
            await axios.post("http://localhost:5000/pull-requests/add",{issue,tag} ,{
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
        <div>
            <h2>Pull Request</h2>
            
            <div onClick = {(e)=>setOpenState(true)}> Open</div>
            <div onClick = {(e)=>setOpenState(false)}> Merged </div>
            <button onClick = {()=>setAdding(true)} > Add </button>
            {adding ? <>
                <input type="text" placeholder="Enter Pull Request" value = {issue} onChange = {(e) => setIssue(e.target.value)}/>
                <input type = "text" placeholder = "Add issue if exists" value = {tag} onChange = {(e) => setTag(e.target.value)}/>
                <button onClick = {()=>confirmHandler()}> Confirm </button>
                <button onClick = {()=>setAdding(false)}> Cancel </button>
                </>
                 : null}
            {displayIssues.length > 0 ? displayIssues.map((issue) => {
                if(openState && issue.Status === "Open" || !openState && issue.Status === "Merged"){
                    return (
                    <div key = {issue._id}>
                        <h3> The id of this pr is {issue._id}</h3>
                        <h3>{issue.Code}</h3>
                        <p>{issue.IssueId}</p>
                        <button onClick = {()=>invalidHandler(issue._id)}> Invalid</button>
                        {issue.Status === "Open" && <button onClick = {()=>closeHandler(issue._id)}> Merge</button>}

                    </div>
                    );
                }
}): null}

        </div>
    )
}
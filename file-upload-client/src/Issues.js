import { useEffect, useState } from "react"
import axios from 'axios'
import { CloseModal } from "./CloseModal"
import TokenTransfer from "./interactor2"

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
            await axios.post("http://localhost:5000/issues/add",{issue,tag,number} ,{
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

    const closeHandler = async(id,text) => {
        try{
            await axios.post("http://localhost:5000/issues/close",{id,text} ,{
                headers: {
                    "Content-Type": "application/json"
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
            <h2>Issues</h2>
            
            <div onClick = {(e)=>setOpenState(true)}> Open</div>
            <div onClick = {(e)=>setOpenState(false)}> Close </div>
            <button onClick = {()=>setAdding(true)} > Add </button>
            {adding ? <>
                <input type="text" placeholder="Enter Issue" value = {issue} onChange = {(e) => setIssue(e.target.value)}/>
                <input type = "text" placeholder = "Add tag" value = {tag} onChange = {(e) => setTag(e.target.value)}/>
                <input type = "number" placeholder = "Enter bounty" value = {number} onChange = {(e) => setNumber(e.target.value)}/>
                <button onClick = {()=>confirmHandler()}> Confirm </button>
                <button onClick = {()=>setAdding(false)}> Cancel </button>
                </>
                 : null}
            {displayIssues.length > 0 ? displayIssues.map((issue) => {
                if(openState && issue.Status === "Open" || !openState && issue.Status === "Closed"){
                    return (
                    <div key = {issue._id}>
                        <h3>{issue.Issue}</h3>
                        <p>{issue.Tag}</p>
                        The bounty set for this is {issue.Bounty}
                        <button onClick = {()=>invalidHandler(issue._id)}> Invalid</button>
                        {issue.Status === "Open" && <CloseModal closeHandler = {closeHandler} id = {issue._id}/>}
                        <TokenTransfer />
                    </div>
                    );
                }
}): null}

        </div>
    )
}
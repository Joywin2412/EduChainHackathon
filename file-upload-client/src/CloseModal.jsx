import { Button, Input } from "@mui/material"
import { useState } from "react"

export const CloseModal = ({closeHandler,id}) => {
    const [pullRequestText,setPullRequestText] = useState("")
    const [close,setClose] = useState(false)


    return (
        <div>
            {close === false && <>
            <Input type = "text" onChange = {(e)=> setPullRequestText(e.target.value)} value = {pullRequestText} placeholder="Pull request id" />
            <Button onClick = {()=>closeHandler(id,pullRequestText)}> Submit </Button>
            <Button variant = "contained" color = "error" onClick = {()=>setClose(true)}> Close</Button>
            </>
        }
            
        </div>
    )
}
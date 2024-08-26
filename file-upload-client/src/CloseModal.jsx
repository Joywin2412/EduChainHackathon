import { useState } from "react"

export const CloseModal = ({closeHandler,id}) => {
    const [pullRequestText,setPullRequestText] = useState("")
    const [close,setClose] = useState(false)
    return (
        <div>
            <button onClick = {()=>setClose(true)}> Close </button>
            {close && <>
            <input type = "text" onChange = {(e)=> setPullRequestText(e.target.value)} value = {pullRequestText} placeholder="Mention the pull request id" />
            <button onClick = {()=>closeHandler(id,pullRequestText)}> Submit </button>
            <button onClick = {()=>setClose(false)}> Close</button>
            </>
        }
            
        </div>
    )
}
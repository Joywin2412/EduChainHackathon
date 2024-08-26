import { useNavigate } from "react-router-dom"


const NavBar = () => {
    const navigate = useNavigate()
    return (
        <div>
            <h1 onClick = {()=> navigate('/')}> Files</h1>
            <h1 onClick = {()=> navigate('/issues')}> Issues </h1>
            <h1 onClick = {()=> navigate('/pull-requests')}> Pull Requests</h1>
            <h1 onClick = {()=> navigate('/signup')}> Signup</h1>
            <h1 onClick = {()=> navigate('/login')}> Login</h1>
        </div>
    )
}
export default NavBar   
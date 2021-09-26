import { Button } from '@material-ui/core'
import React from 'react'
import { auth, provider } from '../firebase'
import "./Login.css"
function Login() {
    const handleSignIn = () => {
        auth.signInWithPopup(provider).catch(alert)
    }
    return (
        <div className="login">
            <div className="login__card">
                <div className="login__cardText">
                <h1>Welcome to LetsChat</h1>
                <span>Sign In to view the chat</span>
                </div>
                <div className="login__cardButton">
                    <Button onClick={handleSignIn}>Sign in with Google <img style={{width:"30px", height:"30px", marginLeft:"20px"}} src="https://www.johngregorysmith.com/wp-content/uploads/2017/08/google_logo1600.png" alt="google" /></Button>
                </div>
            </div>
        </div>
    )
}

export default Login

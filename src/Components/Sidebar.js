import React, { useEffect, useState } from 'react'
import "./Sidebar.css"
import {Avatar, Button} from "@material-ui/core"
import * as EmailValidator from "email-validator"
import { makeStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'
import { auth, db } from '../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollection } from 'react-firebase-hooks/firestore'
import Chat from './Chat'


function Sidebar() {
    const useStyles = makeStyles((theme) => ({
        modal: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        paper: {
          backgroundColor: "#161623",
          border: 'none',
          boxShadow: theme.shadows[5],
          padding: theme.spacing(2, 4, 3),
          width: '400px',
          height: '200px'
        },
      }))

      const classes = useStyles();
      const [open, setOpen] = useState(false);
      const [show, setShow] = useState(false);

      
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    }

    const[user] = useAuthState(auth)
    const userChatRef = db.collection("chats").where("users", "array-contains", user.email)
    const [chatSnapShot] = useCollection(userChatRef)
    const [input, setInput] = useState("");
    const handleChange = (e) => {
        setInput(e.target.value)
        
    }

    useEffect(() => {
        if(input.length !== 0) {
            setShow(true);
        } else {
            setShow(false);
        }
        
    }, [input])

    const createChat = () => {
        if(EmailValidator.validate(input) && user.email !== input && !checkIfAlreadyExist(input)) {
            db.collection("chats").add({
                users: [user.email, input]
            })
        }
        setOpen(false);
        setInput("");
    }

    const checkIfAlreadyExist = (recipientEmail) => !!chatSnapShot?.docs.find(chat => chat.data().users.find(user => user === recipientEmail)?.length > 0)
    
    return (
        <div className="sidebar">
        {/*Upper div of sidebar */}

            <div className="sidebar__upper">
            <div>
                <Avatar src={user.photoURL} />
                <span style={{wordBreak:"break-word"}}>{user.email}</span>
            </div>

            {/* <div>
            <Button onClick={() => auth.signOut()} style={{
                backgroundColor:"#cb2d3e", 
                color:"#fff", 
                width:"40px", 
                textTransform:"inherit"
                }}>Logout</Button>
            </div> */}
            </div>

        {/* Start chat button */}

        <div className="sidebar__button">
            <Button onClick={handleOpen}>Start a new Chat</Button>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                timeout: 500,
                }}
            >
            <Fade in={open}>
            <div className={classes.paper}>
                <h3 id="transition-modal-title" style={{color:"#fff"}}>Enter the mail of the user you want to chat</h3>
                <input className="input__email" placeholder="Enter Email" type="email" value={input} onChange={(e) => handleChange(e)}/>
               {show ? 
               <Button className="input__button" onClick={createChat}>Chat</Button>
               :
               <Button className="input__buttonDisabled" disabled>Chat</Button>
               }
            </div>
            </Fade>
        </Modal>
        </div>

        {/*chats div of sidebar */}

            <div>
               {chatSnapShot?.docs.map(chat => (
                   <Chat key={chat.id} id={chat.id} users={chat?.data()?.users}/>
               ))}
            </div>
        </div>
    )
}

export default Sidebar

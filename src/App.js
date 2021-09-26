import './App.css'
import Sidebar from './Components/Sidebar'
import { BrowserRouter as Router, Switch,  Route } from 'react-router-dom'
import {useAuthState} from "react-firebase-hooks/auth" 
import {auth, db} from "./firebase"
import { useEffect, useState } from 'react'
import Login from './Components/Login'
import Loading from './Components/Loading'
import firebase from "firebase"
import ChatContainer from './Components/ChatContainer'

function App() {
  const [user, loading] = useAuthState(auth)
  const[show, setShow] = useState(true);
  useEffect(() => {
    if(!loading) {
      setShow(false);
    }
    if(user) {
      db.collection("users").doc(user.uid).set({
        email : user.email,
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        photoURL: user.photoURL,
      }, {merge: true})
    }
  }, [loading, user])

  return (
    <div className="app">
    {show ? <Loading /> : !user ? 
      <Login />
            :
          <Router>
        <Switch>

          <Route path = "/chat/:chatId">
          <Sidebar />
            <ChatContainer />
          </Route>
        
          <Route path = "/">
            <Sidebar />
          </Route>
        </Switch>
        </Router>
    }

    </div>
    
  );
}

export default App;

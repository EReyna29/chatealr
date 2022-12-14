import { collection, doc, getDocs,getDoc, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext';
import {db} from '../firebase';

const Search = () => {
  const [username,setUsername] = useState("");
  const [user,setUser] = useState(null);
  const [err,setErr] = useState(false);

  const {currentUser} = useContext(AuthContext);

  useEffect(()=>{
    Search()
    // eslint-disable-next-line
  },[username])
  
  const Search = async () =>{
    const q = query(collection(db,"users"),where("displayName","==",username));
    try{
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    }catch(err){
      setErr(true);
    }
    
  }

  const handleKey = (e) =>{
    e.code==="Enter" && Search()
  }

  const handleSelect = async () =>{
    
    const combinedId = currentUser.uid>user.uid
    ?currentUser.uid+user.uid
    :user.uid+currentUser.uid;
    try{
      const res = await getDoc(doc(db,"chats",combinedId));
      if(!res.exists()){
        await setDoc(doc(db,"chats",combinedId),{messages:[]})
        await updateDoc(doc(db,"userChats",currentUser.uid),{
          [combinedId+".userinfo"]: {
            uid:user.uid,
            displayName:user.displayName,
            photoURL:user.photoURL
          },
          [combinedId+".date"]:serverTimestamp(),

        })
        await updateDoc(doc(db,"userChats",user.uid),{
          [combinedId+".userinfo"]: {
            uid:currentUser.uid,
            displayName:currentUser.displayName,
            photoURL:currentUser.photoURL
          },
          [combinedId+".date"]:serverTimestamp(),
          
        })
      }
    }catch(err){
      console.log(err.message);
    }
    setUser(null);
    setUsername("");

    }

  

  return (
    <div className='search'>
      <div className="searchForm">
        <input type="text" 
        placeholder="Find a user" 
        onKeyDown={handleKey} 
        onChange={(e)=>setUsername(e.target.value)}
        value={username} />
      </div>
      {err && <span>User not found!</span>}
      {user && <div className="userChat" onClick={handleSelect}>
        <img src={user.photoURL} alt="" />
        <div className="userChatInfo">
          <span>{user.displayName}</span>
        </div>
      </div>}
    </div>
  )
}

export default Search
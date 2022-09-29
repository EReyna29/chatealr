import React, { useState } from 'react'
import Add from '../img/add-avatar.png'

import {createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

import { auth,storage,db } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';


const Register = () => {
  const [error,setError]= useState(false);
  const [image,setImage]= useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e)=>{
    e.preventDefault();
    const displayName=e.target[0].value;
    const email=e.target[1].value;
    const password=e.target[2].value;
    const file=e.target[3].files[0];

    
    try{
      //Crea el usuario ingresado en el registro
      const res=await createUserWithEmailAndPassword(auth, email, password);
      
      const storageRef = ref(storage, displayName);
      //Carga la imagen selecccionada
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on('state_changed',
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        //const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        //console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            //console.log('Upload is paused');
            break;
          case 'running':
            //console.log('Upload is running');
            break;
          default:break;
        }
      },
        (err) => {
          setError(true);   
          //console.log(err.message); 
        },
        () => {

          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
             updateProfile(res.user,{
              displayName,
              photoURL:downloadURL,
            });

             setDoc(doc(db, "users", res.user.uid), {
              uid:res.user.uid,
              displayName,
              email,
              photoURL:downloadURL
            });
             setDoc(doc(db, "userChats", res.user.uid), {});
            navigate("/");
          });
        }
      );
      
    }catch(err){
      setError(true);
      //console.log(err.message);
    }
     
  }
  
  return (
    <div className='formContainer'>
        <div className='formWrapper'>
            <span className="logo">Chat</span>
            <span className="title">Register</span>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder='display name' />
                <input type="email" placeholder='email'/>
                <input type="password" placeholder='password' />
                <input style={{display:"none"}} type="file" id='file' onChange={(e)=> setImage(URL.createObjectURL(e.target.files[0]))} />
                <label htmlFor="file">
                    <img src={!image? Add:image} alt="Add file" />
                    <span>{!image && "Add an avatar"}</span>
                </label>
                <button>Sign Up</button>
                {error && <span>Something went wrong</span> }
                
            </form>
            <p>Do you have an account? <Link to="/login">Login</Link></p>
        </div>
    </div>
  )
}

export default Register
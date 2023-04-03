import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function About() {
  const history = useNavigate();
  const [userdata , setUserdata]  = useState({});
  const [fileDetail,setfileDetail] = useState("")
  const handlefile = ({target})=>{
    setfileDetail(target.files[0]);
  } 
 
  const upload = async ()=>{
   const imagedata = { "image": fileDetail};
    const res = await axios.post("http://localhost:4000/upload",imagedata,{
    headers: {
      "Content-Type": "multipart/form-data"
    }
   });
    
   console.log("image_data:",res.data);
  }

  const Aboutpage = async ()=>{
    try{
       const res = await fetch("http://localhost:4000/about",{
        method : 'GET',
        headers:{
          Accept: "application/json",
          "Content-Type": "application/json"
      },
      credentials: "include"
       })
       const data =  await res.json() 
       console.log(data);
       setUserdata(data);
       if(!res.status ===200){
          const error  = new Error(res.error);
          throw error;
       }
    }catch(err){
       console.log("err")
       history('/');
    }
  }
  useEffect(()=>{
    upload();
},[fileDetail])

  useEffect(()=>{
    Aboutpage()
    },[])
  return (
    <div className='h-screen flex flex-col items-center justify-center '>
      <h1 className='font-extrabold  text-2xl mt-6 italic' >About Me</h1>
      <input type="file" name ="image" accept="image/png, image/jpeg"  onChange = {handlefile}/>
      <div className='bg-slate-300 h-fit mt-5 w-fit  rounded drop-shadow-2xl'>
        <div className='grid sm:grid-cols-2 ml-5 mr-5 mt-10 mb-2'>
          <h1 className='text-blue-700'>User id</h1>
          <h1>{userdata._id}</h1>
        </div>
        <div className='grid sm:grid-cols-2 ml-5 mr-5 mb-2'>
          <h1 className='text-blue-700' >Name</h1>
          <h1>{userdata.name}</h1>
        </div>
        <div className='grid sm:grid-cols-2 ml-5 mr-5 mb-2'>
          <h1 className='text-blue-700'>Email</h1>
          <h1>{userdata.email}</h1>
        </div>
        <div className='grid sm:grid-cols-2 ml-5 mr-5 mb-2'>
          <h1 className='text-blue-700'> Phone</h1>
          <h1>{userdata.phone}</h1>
        </div>
        <div className='grid sm:grid-cols-2 ml-5 mr-5 mb-10'>
          <h1 className='text-blue-700'>profession</h1>
          <h1>{userdata.work}</h1>
        </div>
      </div>
    </div>
  )
}

export default About
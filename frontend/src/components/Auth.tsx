import { SignupType } from "@21uec027/mankibaat-common";
import { useState } from "react";
import { Link , useNavigate} from "react-router-dom"
import { ChangeEvent } from 'react';
import axios from "axios"
    import { BACKEND_URL } from "../config";
export const Auth = ({type}:{type: "signup" | "signin"})=>{
    const navigate = useNavigate();
    const [postInputs, SetpostInputs ] = useState<SignupType>({
      
        name:"", 
         email: "",
        password: ""
       
    })

    async function sendRequest() {
        try {
            const res = await axios.post(
                `${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`, 
                postInputs
            );
            const jwt = res.data.jwt;
            
            localStorage.setItem("token", JSON.stringify(jwt));
            navigate("/blogs");
        } catch (e) {
            alert("Error while making request");
            console.log(e);
        }
    }
    return <div>  

       
     <div className="  h-screen flex justify-center flex-col ">
        <div className="flex justify-center">
          <div>
               <div className="px-10">
               <div className="text-3xl font-bold ">
               {type === "signin" ? "Enter credentials to login": " Create an account"  } 
                </div>
                <div className="text-slate-400  mt-1">
               {type === "signin" ? "Don't have an account?": "Already have an account?"  } 
                <Link className=" underline pl-2" to= {type === "signin" ? "/signup": "/signin"  } >
                {type === "signin" ? "Sign up": "Sign in"  } </Link>
                
                </div>
               </div>
                
                <div className="pt-4">

                {type === "signin" ? null : <Lableinput lable="Name" placeholder="John" onchange={(e)=>{
                     SetpostInputs({
                        ...postInputs,
                        name: e.target.value
                 } )
                 }}>

                </Lableinput> } 
                           
                <div className="pt-4">
                <Lableinput lable="Email" placeholder="john@gmail.com" onchange={(e)=>{
                     SetpostInputs({
                        ...postInputs,
                        email: e.target.value
                 } )
                }}>

                </Lableinput>
                </div>
                
                <div className="pt-4 ">
                <Lableinput lable="Password" type={"password"} placeholder="123456" onchange={(e)=>{
                     SetpostInputs({
                        ...postInputs,
                       password: e.target.value
                 } )
                }}>

                </Lableinput>

               </div>
               <button  onClick={sendRequest} type="button" className= " mt-4 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">{type === "signup" ? "Sign up" : "Sign in"}</button>

               
                </div>
               
           </div>
          </div>
            
            
                
    
     </div>
    
    </div>
}
interface Labletype {
    lable : string;
    placeholder: string;
    onchange?:(e: ChangeEvent<HTMLInputElement>) => void;
    type? : string
    }
function Lableinput ({lable, placeholder, onchange , type} : Labletype){
      return <div>
        <div>
            <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{lable}</label>
            <input  onChange ={onchange} type= { type || "text"} id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={placeholder} required />
        </div>

      </div>
}
import { Link } from "react-router-dom"
import { Avatar } from "./Blogcard"
import {  useUserDetails } from "../hooks"

export const Appbar = () =>{
    const  userDetails = useUserDetails(localStorage.getItem("token"));
    return <div className="border-b flex justify-between px-10 py-4 ">
        <Link to="/blogs" className="flex flex-col justify-center cursor-pointer">
       
            Mann ki baat
         
        </Link>
       
           <div className="font-10">

           <Link to="/publish">
           <button type="button" className=" mr-4 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">New Post</button>
           </Link>

            <Avatar name={userDetails.name} size={"big"}></Avatar>
           </div>

    </div>
}
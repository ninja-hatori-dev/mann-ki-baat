import { Appbar } from "./Appbar"
import { Avatar } from "./Blogcard"
import { Blog } from "../hooks"

   
export const Fullblog = ({ blog }:{ blog : Blog}) => {
   
    return (
      <div>
          <div>
              <Appbar/>
          </div>
      
          <div className="flex justify-center pt-10">
              <div className=" w-2/3  px-16">
                  <div className="w-full ">
                      <div className=" flex justify-center items-center font-bold text-6xl">
                          {blog.title}
                      </div>
                      <div className="text-slate-400 pt-5">
                          Posted on August 24,2024
                      </div>
                      <div className=" flex justify-center items-center text-lg pt-10">
                          {blog.content}
                      </div>
                  </div>
              </div>
             
              <div className="w-1/3 border-l border-slate-400 p-10">
                  <div className="text-lg font-semibold">
                      Author
                  </div>
                  <div className=" flex  w-full font-bold  gap-5 pt-10">
                     <div className="">
                      <Avatar name={ "Anonymous"}  size ={"small"}/>
                      </div> 
                     
                  </div>
              </div>
          </div>
      </div>
    )
  }
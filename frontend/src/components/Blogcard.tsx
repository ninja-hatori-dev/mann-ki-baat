import { Link } from "react-router-dom";

interface BlogcardProps {
 authorName: string;
 title: string;
 content: string;
 publishedDate : string;
 id: string;
}
  


export const Blogcard = ({
    id,
    authorName,
    title,
    content,
    publishedDate} : BlogcardProps
) =>{
    return  <Link to={`/blog/${id}`} >
    <div>
         
         <div className="flex pt-4">
            <div className="flex justify-center flex-col pl-1 cursor-pointer">
            <Avatar name = {authorName}  size={"small"}/>
            </div>
            
           <div className=" pl-2"> {authorName} </div>
           <div className="flex justify-center flex-col pl-2">
           <Circle></Circle>
           </div>
           
            <div className=" text-slate-500 pl-2 font-semibold">{publishedDate}</div>
         </div>
         <div className="text-2xl font-bold">
            {title}
         </div>
         <div className="text-md font-thin">

            {content.slice(0,100)+"..."}
         </div>
         <div className="text-slate-400 font-thin text-sm pt-4 mb-1">
            {`${Math.ceil(content.length/100)} min read`}
         </div>
         <div className="bg-slate-200 h-1 w-full">

         </div>
    </div>
    </Link>
}
function Circle (){

    return <div className="h-1 w-1 rounded-full bg-slate-500">

    </div>
}
export function Avatar({ name, size = "small" }: { name: string; size: "small" | "big" }) {
    return (
        <div
            className={`relative inline-flex my-0.5 items-center justify-center overflow-hidden bg-gray-600 rounded-full ${
                size === "small" ? "w-6 h-6" : "w-10 h-10"
            }`}
        >
            <span className={`${size === "small" ? "text-sm" : "text-md"} font-small text-slate-100`}>
                {name[0]}
            </span>
        </div>
    );
}

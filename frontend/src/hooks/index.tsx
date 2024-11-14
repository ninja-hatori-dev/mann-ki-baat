import { useState, useEffect } from "react";
import axios from "axios";
import {  BACKEND_URL } from "../config";



export interface Blog {
    content: string;
    title: string;
    id: string;
    author: {
        name: string;
    }
}
 

export const useBlog = ( {id}: {id: string})=>{

    const [blog, setBlog] = useState<Blog>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      

        axios.get(`${BACKEND_URL}/api/v1/blog/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")?.replace(/^"(.*)"$/, "$1")}`
            }
        })
        .then((response) => {
            console.log("yeh hai hook",response.data);
            setBlog( response.data );
            setLoading(false);
        })
        .catch((error) => {
            console.error("Error fetching blogs:", error);
            alert("Error fetching blogs. Please check the console for more details.");
            setLoading(false);
        });
    }, [id]);

    return {
        loading,
        blog
    };

}


export const useBlogs = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      

        axios.get(`${BACKEND_URL}/api/v1/blog/bulk`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")?.replace(/^"(.*)"$/, "$1")}`
            }
        })
        .then((response) => {
            
            setBlogs( response.data );
            setLoading(false);
        })
        .catch((error) => {
            console.error("Error fetching blogs:", error);
            alert("Error fetching blogs. Please check the console for more details.");
            setLoading(false);
        });
    }, []);

    return {
        loading,
        blogs
    };

   
};

export function useUserDetails(token: any): any {
	var base64Url = token.split(".")[1];
	var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
	var jsonPayload = decodeURIComponent(
		window
			.atob(base64)
			.split("")
			.map(function (c) {
				return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
			})
			.join("")
	);
  
	return JSON.parse(jsonPayload);
}

export const useMyblogs = () =>{
    const [blogs, setBlogs] = useState();
    const [ loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");
    const data = useUserDetails(token);


    useEffect(()=>{
        axios.get(`${BACKEND_URL}/api/v1/blog/myaccount/${data.id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")?.replace(/^"(.*)"$/, "$1")}`,
                },
            })
            .then((response) => {
                setBlogs(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching user's blogs:", error);
                alert("Error fetching blogs. Please check the console for more details.");
                setLoading(false);
            });
    }, []);

    return {
        loading,
        blogs,
    };
};


// import OpenAI from "openai";

// const openai = new OpenAI({
//     apiKey: "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" 
// ,dangerouslyAllowBrowser: true 
// });

// export const completion = await openai.chat.completions.create({
//     model: "gpt-4o-mini",
//     messages: [
//         { role: "system", content: "You are a helpful assistant." },
//         {
//             role: "user",
//             content: "Write a haiku about recursion in programming.",
//         },
//     ],
// });
// console.log(completion.choices[0].message);
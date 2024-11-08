import { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

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

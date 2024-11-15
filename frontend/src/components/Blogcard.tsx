import { Link } from "react-router-dom";
import { useUserDetails } from "../hooks";
import { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

interface BlogcardProps {
    authorName: string;
    title: string;
    content: string;
    publishedDate: string;
    id: string;
    authorId: string;
}

export const Blogcard = ({
    id,
    authorName,
    title,
    content,
    publishedDate,
    authorId
}: BlogcardProps) => {
    const userDetail = useUserDetails(localStorage.getItem("token"));
    const [isDeleted, setIsDeleted] = useState(false);

    const handleDelete = async (blogId: string) => {
        try {
            await axios.delete(`${BACKEND_URL}/api/v1/blog/${blogId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")?.replace(/^"(.*)"$/, "$1")}`
                }
            });
            setIsDeleted(true);
        } catch (error) {
            console.error("Error deleting blog:", error);
            alert("Failed to delete the blog. Please try again.");
        }
    };

    if (isDeleted) {
        return (
            <div className=" bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">Post has been successfully deleted</span>
            </div>
        );
    }

    return (
        <Link to={`/blog/${id}`}>
            <div>
                <div className="flex pt-4">
                    <div className="flex justify-center flex-col pl-1 cursor-pointer">
                        <Avatar name={authorName} size={"small"} />
                    </div>
                    <div className="pl-2">{authorName}</div>
                    <div className="flex justify-center flex-col pl-2">
                        <Circle />
                    </div>
                    <div className="text-slate-500 pl-2 font-semibold">{publishedDate}</div>
                </div>
                <div className="text-2xl font-bold">{title}</div>
                <div className="text-md font-thin">{content.slice(0, 100) + "..."}</div>
                <div className="text-slate-400 font-thin text-sm pt-4 mb-1">
                    {`${Math.ceil(content.length / 100)} min read`}
                </div>
                {authorId === userDetail.id && (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            handleDelete(id);
                        }}
                        className="mt-2 px-2 py-1 bg-red-500 text-white text-xs rounded"
                    >
                        Delete
                    </button>
                )}
                <div className="bg-slate-200 h-1 w-full"></div>
            </div>
        </Link>
    );
};

function Circle() {
    return <div className="h-1 w-1 rounded-full bg-slate-500"></div>;
}

export function Avatar({ name, size = "small" }: { name: string; size: "small" | "big" }) {
    return (
        <div
            className={`relative inline-flex my-0.5 items-center justify-center overflow-hidden bg-gray-600 rounded-full ${
                size === "small" ? "w-6 h-6" : "w-10 h-10"
            }`}
        >
            <span className={`${size === "small" ? "text-sm" : "text-md"} font-small text-slate-100`}>
                {name[0].toUpperCase()}
            </span>
        </div>
    );
}

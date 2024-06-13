"use client";

import { useState } from "react";
import { useEffect } from "react";
import { UserIcon } from "@heroicons/react/24/solid";
import { MapPinIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

interface Post {
    id: number;
    name: string;
    message: string;
    picture?: File | null;
    locale?: string | null;
    mood?: string | null;
    pictures?: any;
    attachments?: File | null;
}

export default function Posts() {
    const [elements, setElements] = useState<Post[]>([]);
    const [ids, setIds] = useState<number[]>([]);

    const fetchPosts = async () => {
        const response = await fetch("https://italk-server.vercel.app/userPost", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ids: ids,
            }),
        });

        const data = await response.json();
        const posts = data.posts;

        posts.forEach((post: Post) => {
            if (!ids.includes(post.id) && post.id !== 0) {
                console.log(post.pictures)
                setElements((prevElements) => {
                    const newElement = {
                        id: post.id,
                        name: post.name,
                        message: post.message,
                        picture: post.picture || null,
                        locale: post.locale || null,
                        mood: post.mood || null,
                        pictures: post.pictures ? Buffer.from(post.pictures.data).toString('base64') : null,
                        attachments: post.attachments || null,
                    };
                    const updatedElements = [...prevElements, newElement];
                    setIds((prevIds) => [...prevIds, newElement.id]);
                    return updatedElements;
                });
            }
        });
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY >=
                document.documentElement.scrollHeight
            ) {
                fetchPosts();
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    });

    return (
        <>
            {elements.map((element, index) => (
                <div
                    key={index}
                    className="flex flex-col w-full bg-white rounded-2xl shadow-[0_5px_15px_0px_rgba(0,0,0,0.15)] p-6 mb-6"
                >
                    <div className="flex flex-row mb-2">
                        {element.picture ? (
                            <Image
                                src={""}
                                alt="perfil"
                                className="w-12 h-12 mr-2 rounded-[50%] p-1"
                            />
                        ) : (
                            <UserIcon className="bg-gray-300 text-gray-500 w-12 h-12 mr-2 rounded-[50%] p-1" />
                        )}
                        <div className="flex flex-col justify-center">
                            <span className="">{`${element.name} ${
                                element.mood
                                    ? `está se sentindo ${element.mood}.`
                                    : ""
                            }`}</span>
                            {element.locale ? (
                                <div className="flex flex-row items-center">
                                    <MapPinIcon className="w-4 h-4 text-gray-500" />
                                    <span className="font-light text-sm">{`em ${element.locale}`}</span>
                                </div>
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                    <span>{element.message}</span>
                    {element.pictures ? (
                        <Image
                            src={`data:image/jpeg;base64,${element.pictures}`}
                            alt="perfil"
                            width={60}
                            height={60}
                        />
                    ) : (
                        <></>
                    )}
                </div>
            ))}
        </>
    );
}

"use client";

import { useState, useEffect } from "react";
import { UserIcon, MapPinIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

interface Post {
    id: number;
    name: string;
    message: string;
    picture?: File | null;
    locale?: string | null;
    mood?: string | null;
    pictures?: Array<string> | null;
    attachments?: File | null;
    date: Date;
}

export default function Posts() {
    const [elements, setElements] = useState<Post[]>([]);
    const [ids, setIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchPosts = async () => {
        if (loading) return;

        setLoading(true);
        try {
            const response = await fetch("https://italk-server.vercel.app/userPost", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ids }),
            });

            const data = await response.json();
            if (response.status === 400) {
                console.log(data);
            } else {
                const posts = data.posts;

                posts.forEach((post: Post) => {
                    if (!ids.includes(post.id) && post.id !== 0) {
                        setElements((prevElements) => {
                            const newElement = {
                                id: post.id,
                                name: post.name,
                                message: post.message,
                                picture: post.picture || null,
                                locale: post.locale || null,
                                mood: post.mood || null,
                                pictures: post.pictures || null,
                                attachments: post.attachments || null,
                                date: new Date(post.date),
                            };
                            const updatedElements = [
                                ...prevElements,
                                newElement,
                            ];
                            setIds((prevIds) => [...prevIds, newElement.id]);
                            return updatedElements;
                        });
                    }
                });
            }
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    useEffect(() => {
        const handleScroll = async () => {
            if (
                window.innerHeight + window.scrollY >=
                document.documentElement.scrollHeight
            ) {
                await fetchPosts();
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [ids, loading]);

    return (
        <>
            {elements.map((element, index) => (
                <div
                    key={index}
                    className="flex flex-col w-full bg-white rounded-2xl shadow-[0_5px_15px_0px_rgba(0,0,0,0.15)] p-6 mb-6"
                >
                    <div className="flex justify-between items-center">
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
                                        ? `is feeling ${element.mood}.`
                                        : ""
                                }`}</span>
                                {element.locale ? (
                                    <div className="flex flex-row items-center">
                                        <MapPinIcon className="w-4 h-4 text-gray-500 mr-0.5" />
                                        <span className="font-light text-sm">{`in ${element.locale}`}</span>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                        <aside className="font-thin">
                            <span>{`${
                                element.date.getMonth() + 1 >= 10
                                    ? element.date.getMonth() + 1
                                    : "0" + (element.date.getMonth() + 1)
                            } / ${
                                element.date.getDate() >= 10
                                    ? element.date.getDate()
                                    : "0" + element.date.getDate()
                            } / ${element.date.getFullYear()} - ${
                                element.date.getHours() % 12 === 0
                                    ? 12
                                    : element.date.getHours() % 12
                            }:${
                                element.date.getMinutes() >= 10
                                    ? element.date.getMinutes()
                                    : "0" + element.date.getMinutes()
                            } ${
                                element.date.getHours() >= 12 ? "PM" : "AM"
                            }`}</span>
                        </aside>
                    </div>
                    <span className="mb-6 text-wrap break-words whitespace-pre-wrap">
                        {element.message}
                    </span>
                    <div className="flex flex-row flex-wrap justify-between">
                        {element.pictures
                            ? element.pictures.map((p, idx) => (
                                  <button
                                      key={idx}
                                      className="flex items-center drop-shadow-[3px_3px_5px_rgba(0,0,0,0.5)] mb-6"
                                  >
                                      <Image
                                          src={`data:image/jpeg;base64,${p}`}
                                          alt="perfil"
                                          width={333}
                                          height={100}
                                          className="object-cover"
                                      />
                                  </button>
                              ))
                            : null}
                    </div>
                </div>
            ))}
        </>
    );
}

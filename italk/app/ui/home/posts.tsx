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
    picture?: string;
    locale?: string;
    mood?: string;
    pictures?: File | null;
    attachments?: File;
  }

  interface PostElement {
    id?: number;
    name: string;
    locale: string | null;
    message: string;
    mood: string;
    pictures: File | null;
    attachments: File | null;
    picture?: string;
  }

export default function Posts() {
    const [elements, setElements] = useState<PostElement[]>([]);
    const ids: number[] = [];

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
            if (!(post.id in ids)) {
                ids.push(post.id);
                setElements((prevElements) => [
                    ...prevElements,
                    {
                      id: post.id,
                      name: post.name,
                      message: post.message,
                      picture: post.picture || '',
                      locale: post.locale || '',
                      mood: post.mood || '',
                      pictures: post.pictures || null,
                      attachments: post.attachments || null,
                    },
                  ]);
            }
        });
        console.log('elements: ', elements)
        console.log('ids: ', ids)
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            // Verifica se o usuário rolou até o final da página
            if (
                window.innerHeight + window.pageYOffset >=
                document.documentElement.scrollHeight
            ) {
                fetchPosts();
            }
        };

        // Adiciona o ouvinte de evento de scroll
        window.addEventListener("scroll", handleScroll);

        // Retorna uma função de limpeza que remove o ouvinte de evento
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
                                src={element.picture}
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
                </div>
            ))}
        </>
    );
}

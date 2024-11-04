"use client";

import { UserIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface User {
    id: Number;
    name: string;
    username: string;
    email: string;
    password: string;
    profilePicture: string;
    banner: string;
    status: Number;
    about?: string;
}

interface Message {
    id: number;
    content: string;
    senderName: string;
}

export default function Chats({
    email,
    username,
}: {
    email: string;
    username: string;
}) {
    const [lastMessages, setLastMessages] = useState<Message[]>([]);
    const [friends, setFriends] = useState<User[]>([]);

    const fetchFriends = async () => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_DB_URL}/friend/list/${email}`
        );

        const data = await response.json();

        if (response.status === 400) {
            console.log(data);
        } else {
            setFriends(data.friends);
            data.friends.forEach(async (friend: User) => {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_DB_URL}/message/last?senderName=${username}&receiverName=${friend.username}`
                );

                const data = await response.json();
                console.log(data.lastMessage);

                if (data.lastMessage) {
                    setLastMessages((lastMessages) => [
                        ...lastMessages,
                        {
                            id: data.lastMessage.id,
                            content: data.lastMessage.content,
                            senderName: data.lastMessage.senderName,
                        },
                    ]);
                }

                if (response.status === 400) {
                    console.log("Last Message Error");
                    console.log(response);
                }
            });
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            fetchFriends();
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        fetchFriends();
    }, []);

    return (
        <div
            className={`p-6 ${
                friends.length === 0 ? "flex justify-center" : ""
            }`}
        >
            {friends.length > 0 ? (
                friends.map((user: User, idx: number) => {
                    return (
                        <div
                            key={idx}
                            className={`flex flex-col ${
                                idx === friends.length - 1 ? "" : "mb-6"
                            }`}
                        >
                            <Link
                                className="flex flex-col 2xl:flex-row items-center"
                                href={`/${user.username}/chat`}
                            >
                                <div className="flex">
                                    {user.profilePicture ? (
                                        <Image
                                            src={`data:image/jpeg;base64,${user.profilePicture}`}
                                            alt="perfil"
                                            width={100}
                                            height={100}
                                            className="w-20 h-20 mr-2 rounded-full p-1"
                                        />
                                    ) : (
                                        <UserIcon className="w-20 h-20 mr-3 text-gray-400 border-2 rounded-full p-1"></UserIcon>
                                    )}
                                    {user.status ? (
                                        <div className="bg-yellow-400 w-4 h-4 rounded-full absolute ml-14"></div>
                                    ) : null}
                                </div>
                                <div
                                    className={`hidden 2xl:flex h-full flex flex-col items-start ${
                                        lastMessages.length >= idx + 1
                                            ? "justify-between"
                                            : "justify-center"
                                    }`}
                                >
                                    <span
                                        className={`${
                                            lastMessages.length >= idx + 1
                                                ? "mt-3"
                                                : ""
                                        }`}
                                    >
                                        {user.name}
                                    </span>
                                    {lastMessages.length >= idx + 1 ? (
                                        <span className="mb-3 text-gray-500 font-medium text-center">
                                            {`${lastMessages[idx].senderName}: ${lastMessages[idx].content}`}
                                        </span>
                                    ) : null}
                                </div>
                            </Link>
                        </div>
                    );
                })
            ) : (
                <span className="text-gray-400 text-center">
                    You don&apos;t have any friends yet
                </span>
            )}
        </div>
    );
}

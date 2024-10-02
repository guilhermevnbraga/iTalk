"use client";

import { useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { UserIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

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
    receiverName: string;
}

export default function Chats({
    email,
    username,
}: {
    email: string;
    username: string;
}) {
    const router = useRouter();
    const [friends, setFriends] = useState<User[]>([]);
    const [search, setSearch] = useState("");
    const [hiddenChevronMenu, setHiddenChevronMenu] = useState<boolean[]>([]);
    const [lastMessages, setLastMessages] = useState<Message[]>([]);

    const fetchFriends = async () => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_DB_URL}/friends`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            }
        );

        const friendData = await response.json();
        setFriends(friendData.friends);

        friendData.friends.forEach(async (friend: User) => {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_DB_URL}/lastMessage`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        senderName: username,
                        receiverName: friend.username,
                    }),
                }
            );

            const data = await response.json();

            if (data.lastMessage && data.lastMessage.id) {
                setLastMessages((lastMessages) => {
                    if (lastMessages.length < friendData.friends.length) {
                        return [
                            ...lastMessages,
                            {
                                id: data.lastMessage.id,
                                content: data.lastMessage.content,
                                senderName: data.lastMessage.senderName,
                                receiverName: data.lastMessage.receiverName,
                            },
                        ];
                    } else {
                        return lastMessages.map((message, idx) => {
                            if (
                                message.receiverName ===
                                data.lastMessage.receiverName
                            ) {
                                return {
                                    id: data.lastMessage.id,
                                    content: data.lastMessage.content,
                                    senderName: data.lastMessage.senderName,
                                    receiverName: data.lastMessage.receiverName,
                                };
                            } else {
                                return message;
                            }
                        });
                    }
                });
            }

            if (response.status === 400) {
                console.log("Last Message Error");
                console.log(response);
            }
        });
    };

    useEffect(() => {
        const interval = setInterval(() => {
            fetchFriends();
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setHiddenChevronMenu(new Array(friends.length).fill(true));
    }, []);

    return (
        <aside className="w-1/4 flex flex-col items-center shadow-[-3px_3px_6px_0px_rgba(0,0,0,0.3)] min-h-full">
            <div className="mt-4 text-xl font-medium">Chats</div>
            <div className="flex p-2 mt-3 border-2 border-gray-700 rounded-2xl bg-gray-100 h-fit w-11/12">
                <MagnifyingGlassIcon className="h-6 w-6 mr-3" />
                <input
                    type="text"
                    placeholder="Search"
                    className="focus:outline-0 bg-gray-100"
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div className="w-full mt-6">
                {friends ? (
                    friends.length > 0 ? (
                        friends.map((user: User, idx: number) => {
                            if (!user.name.toLowerCase().includes(search))
                                return null;

                            let lastMessage: Message | null = null;
                            const userReceiver = lastMessages.find(
                                (message) => message.receiverName === user.name
                            );
                            const userSender = lastMessages.find(
                                (message) => message.senderName === user.name
                            );
                            if (userReceiver) {
                                lastMessage = userReceiver;
                            } else if (userSender) {
                                lastMessage = userSender;
                            } else {
                                lastMessage = null;
                            }

                            return (
                                <div
                                    key={idx}
                                    className="flex justify-between shadow-[0_1px_1px_0_rgba(0,0,0,0.1)] hover:bg-gray-100 py-1 text-white hover:text-gray-400 p-3"
                                >
                                    <Link
                                        className="flex text-black grow"
                                        href={`/${user.username}/chat`}
                                    >
                                        {user.profilePicture ? (
                                            <Image
                                                src={`data:image/jpeg;base64,${user.profilePicture}`}
                                                alt="perfil"
                                                width={100}
                                                height={100}
                                                className="w-20 h-20 mr-2 rounded-[50%] p-1"
                                            />
                                        ) : (
                                            <UserIcon className="w-20 h-20 mr-3 text-gray-400 border-2 rounded-[50%] p-1"></UserIcon>
                                        )}
                                        <div
                                            className={`h-full flex flex-col ${
                                                lastMessages.length >= idx + 1
                                                    ? "justify-between"
                                                    : "justify-center"
                                            }`}
                                        >
                                            <span
                                                className={`${
                                                    lastMessages.length >=
                                                    idx + 1
                                                        ? "mt-3"
                                                        : null
                                                }`}
                                            >
                                                {user.name}
                                            </span>
                                            {lastMessages.length >= idx + 1 ? (
                                                <span className="mb-3 text-gray-500 font-medium">
                                                    {`${
                                                        lastMessage?.senderName ||
                                                        "null"
                                                    }: ${
                                                        lastMessage?.content ||
                                                        "null"
                                                    }`}
                                                </span>
                                            ) : (
                                                <div>Loading...</div>
                                            )}
                                        </div>
                                    </Link>
                                    <button
                                        onClick={() =>
                                            setHiddenChevronMenu((prev) => {
                                                const newState = [...prev];
                                                newState[idx] = !newState[idx];
                                                return newState;
                                            })
                                        }
                                        className="mt-2 mr-3 flex flex-col items-end h-full"
                                    >
                                        <ChevronDownIcon className="h-6 w-6"></ChevronDownIcon>
                                        <div
                                            className={`text-black relative bg-blue-400 w-full h-full ${
                                                hiddenChevronMenu[idx] ||
                                                hiddenChevronMenu.length <
                                                    friends.length
                                                    ? "hidden"
                                                    : ""
                                            }`}
                                        >
                                            <div className="absolute bg-[#edeff1] w-[10vw] flex flex-col text-xs">
                                                <button className="hover:bg-[#fbfdff] p-3 w-full text-left">
                                                    Delete conversation
                                                </button>
                                                <button className="hover:bg-[#fbfdff] p-3 w-full text-left">
                                                    Pin
                                                </button>
                                                <button className="hover:bg-[#fbfdff] p-3 w-full text-left">
                                                    Mark as read
                                                </button>
                                                <button className="hover:bg-[#fbfdff] p-3 w-full text-left">
                                                    Block
                                                </button>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            );
                        })
                    ) : (
                        <span className="text-gray-400">Loading...</span>
                    )
                ) : null}
            </div>
        </aside>
    );
}

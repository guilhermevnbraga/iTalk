"use client";

import { useEffect, useState, useRef } from "react";
import { UserIcon } from "@heroicons/react/24/outline";
import {
    MagnifyingGlassIcon,
    EllipsisVerticalIcon,
    PlusIcon,
} from "@heroicons/react/24/solid";
import {
    FaceSmileIcon,
    MicrophoneIcon,
    PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
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
    id: Number;
    senderId: Number;
    receiverId: Number;
    content: string;
    attachment: string;
    reaction: string;
    date: string;
}

export default function Chat({
    username,
    email,
}: {
    username: string;
    email: string;
}) {
    const [userName, setUsername] = useState("");
    const [friend, setFriend] = useState<User>({
        id: 0,
        name: "",
        username: "",
        email: "",
        password: "",
        profilePicture: "",
        banner: "",
        status: 0,
    });
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageCount, setMessageCount] = useState(0);
    const [disableSend, setDisableSend] = useState(true);
    const messageRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const fetchFriend = async () => {
        const response = await fetch("https://italk-server.vercel.app//profile", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: username }),
        });

        const data = await response.json();
        if (response.status === 400) {
            console.log(data);
        } else {
            setFriend(data.user);
        }
    };

    const fetchUser = async () => {
        const response = await fetch("https://italk-server.vercel.app//username", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();
        if (response.status === 400) {
            console.log(data);
        } else {
            setUsername(data.username);
        }
    };

    const fetchMessages = async () => {
        const response = await fetch("https://italk-server.vercel.app//messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                senderName: userName,
                receiverName: username,
            }),
        });

        const data = await response.json();
        if (response.status === 400) {
            console.log(data);
        } else {
            setMessages(data.messages);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (messages.length > messageCount) {
            scrollToBottom();
            setMessageCount(messages.length);
        }
    }, [messages]);

    useEffect(() => {
        fetchUser();
        fetchFriend();
    }, []);

    useEffect(() => {
        fetchMessages();
    }, [userName]);

    useEffect(() => {
        if (userName === "") return;

        fetchMessages();
        
    }, [Date.now()]);

    const handleSendMessage = async () => {
        setDisableSend(true);

        if (messageRef.current) {
            messageRef.current.value = "";
        }
        const response = await fetch("https://italk-server.vercel.app//sendMessage", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                senderName: userName,
                receiverName: username,
                content: message,
            }),
        });

        const data = await response.json();
        if (response.status === 400) {
            console.log(data);
        } else {
            console.log(data);
        }

        fetchMessages();
        setMessage("");
    };

    return (
        <section className="flex flex-col w-full grow">
            <section className="py-3 px-6 shadow-[1px_1px_0_0_rgba(200,200,200,0.5)] w-full h-fit">
                <div className="flex justify-between items-center">
                    <Link className="flex items-center" href={`/${username}`}>
                        {friend ? (
                            friend.profilePicture ? (
                                <Image
                                    src={`data:image/jpeg;base64,${friend.profilePicture}`}
                                    alt="perfil"
                                    width={100}
                                    height={100}
                                    className="w-16 h-16 mr-2 rounded-[50%] p-1"
                                />
                            ) : (
                                <UserIcon className="w-16 h-16 mr-3 text-gray-400 border-2 rounded-[50%] p-1"></UserIcon>
                            )
                        ) : null}
                        <p>{friend ? friend.name : ""}</p>
                    </Link>
                    <div className="flex w-[6%] justify-between mr-9">
                        <button>
                            <MagnifyingGlassIcon className="w-6 h-6"></MagnifyingGlassIcon>
                        </button>
                        <button>
                            <EllipsisVerticalIcon className="w-6 h-6"></EllipsisVerticalIcon>
                        </button>
                    </div>
                </div>
            </section>
            <section className="w-full grow bg-gray-100 flex flex-col h-full overflow-y-auto">
                {messages.map((message, idx) => (
                    <div
                        key={idx}
                        className={`flex ${
                            message.senderId === friend.id
                                ? "justify-start"
                                : "justify-end"
                        }`}
                    >
                        <div
                            className={`flex items-center p-2 m-3 shadow-[1px_1px_0_0_rgba(200,200,200,0.5)] bg-white rounded-2xl max-w-[69%] ${
                                message.senderId === friend.id
                                    ? "rounded-bl-none"
                                    : "rounded-br-none"
                            }`}
                        >
                            <p className="flex w-full text-start mr-2 break-all">
                                {message.content}
                            </p>
                            <p className="flex text-end text-xs h-full items-end">
                                {new Date(parseInt(message.date)).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                })}
                            </p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </section>
            <section>
                <div className="flex justify-between items-center py-3 px-6 shadow-[1px_1px_0_0_rgba(200,200,200,0.5)] w-full h-fit">
                    <div className="flex items-center mr-3">
                        <FaceSmileIcon className="w-9 h-9 mr-4"></FaceSmileIcon>
                        <button>
                            <PlusIcon className="w-9 h-9 text-gray-700 mr-3"></PlusIcon>
                        </button>
                    </div>
                    <input
                        ref={messageRef}
                        type="text"
                        placeholder="Type a message"
                        className="focus:outline-0 bg-gray-100 grow p-3 rounde-2xl mr-4"
                        onChange={(e) => {
                            if (e.target.value.trim() === "")
                                setDisableSend(true);
                            else {
                                setMessage(e.target.value.trim());
                                setDisableSend(false);
                            }
                        }}
                    />
                    <div className="flex items-center">
                        <button className={disableSend ? "" : "hidden"}>
                            <MicrophoneIcon className="w-9 h-9 text-gray-700"></MicrophoneIcon>
                        </button>
                        <button
                            className={disableSend ? "hidden" : ""}
                            onClick={handleSendMessage}
                        >
                            <PaperAirplaneIcon className="w-9 h-9 text-gray-700"></PaperAirplaneIcon>
                        </button>
                    </div>
                </div>
            </section>
        </section>
    );
}

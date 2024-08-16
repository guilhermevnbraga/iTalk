"use client";

import { useEffect, useState } from "react";
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
    profile_picture: string;
    banner: string;
    status: Number;
    about?: string;
}

export default function Chat({ username, email }: { username: string, email: string }) {
    const [userName, setUsername] = useState("");
    const [friend, setFriend] = useState<User>({ id: 0, name: "", username: "", email: "", password: "", profile_picture: "", banner: "", status: 0 });
    const [message, setMessage] = useState("");
    const [disableSend, setDisableSend] = useState(true);

    const fetchFriend = async () => {
        const response = await fetch("http://localhost:3001/profile", {
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

    useEffect(() => {
        fetchFriend();
        console.log(friend);
    }, []);

    const fetchUser = async () => {
        const response = await fetch("http://localhost:3001/username", {
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
    }

    useEffect(() => {
        fetchUser();
    }, []);

    const handleSendMessage = async () => {
        const response = await fetch("http://localhost:3001/sendMessage", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: userName,
                recieverName: username,
                message,
            }),
        });

        const data = await response.json();
        if (response.status === 400) {
            console.log(data);
        } else {
            console.log(data);
        }
    };

    return (
        <section className="flex flex-col w-full grow">
            <section className="py-3 px-6 shadow-[1px_1px_0_0_rgba(200,200,200,0.5)] w-full h-fit">
                <div className="flex justify-between items-center">
                    <Link className="flex items-center" href={`/${username}`}>
                        {friend ? (
                            friend.profile_picture ? (
                                <Image
                                    src={`data:image/jpeg;base64,${friend.profile_picture}`}
                                    alt="perfil"
                                    width={100}
                                    height={100}
                                    className="w-16 h-16 mr-2 rounded-[50%] p-1"
                                />
                            ) : (
                                <UserIcon className="w-16 h-16 mr-3 text-gray-400 border-2 rounded-2xl"></UserIcon>
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
            <section className="w-full grow bg-gray-100">a</section>
            <section>
                <div className="flex justify-between items-center py-3 px-6 shadow-[1px_1px_0_0_rgba(200,200,200,0.5)] w-full h-fit">
                    <div className="flex items-center mr-3">
                        <FaceSmileIcon className="w-9 h-9 mr-4"></FaceSmileIcon>
                        <button>
                            <PlusIcon className="w-9 h-9 text-gray-700 mr-3"></PlusIcon>
                        </button>
                    </div>
                    <input
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

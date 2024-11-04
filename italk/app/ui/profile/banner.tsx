"use client";

import { useRouter } from "next/navigation";
import { UserIcon } from "@heroicons/react/24/solid";
import { useRef } from "react";
import Image from "next/image";

interface BannerProps {
    user: User;
    acessUsername: string;
    acessUserEmail: string;
}

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
    hasFriend: boolean;
}

export default function Banner({
    user,
    acessUsername,
    acessUserEmail,
}: BannerProps) {
    const router = useRouter();
    const profilePictureRef = useRef(null);

    const addFriend = async () => {
        await fetch(`${process.env.NEXT_PUBLIC_DB_URL}/friend/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userEmail: acessUserEmail,
                friendEmail: user.email,
            }),
        });
        router.refresh();
    };

    const handleRemoveFriend = async () => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_DB_URL}/friend/delete?username=${user.username}&acessUsername=${acessUsername}`,
            {
                method: "DELETE",
            }
        );

        const data = await response.json();
        if (response.status === 400) {
            console.log(data.error);
        }

        router.refresh();
    };

    return (
        <div className="flex relative bg-gray-300 items-end h-[40vh] mb-20 grow-0">
            {user.banner ? (
                <Image
                    src={`data:image/jpeg;base64,${user.banner}`}
                    layout="fill"
                    objectFit="cover"
                    alt="banner"
                ></Image>
            ) : null}
            <div className="relative top-20 left-6 flex flex-col sm:flex-row justify-between w-[96%]">
                <div className="flex items-center">
                    {user.profilePicture ? (
                        <Image
                            ref={profilePictureRef}
                            src={`data:image/jpeg;base64,${user.profilePicture}`}
                            alt="Profile Picture"
                            width={100}
                            height={100}
                            className="rounded-full w-24 h-24 sm:w-32 sm:h-32 border-4 border-white"
                        />
                    ) : (
                        <UserIcon className="bg-white h-24 w-24 sm:h-32 sm:w-32 text-gray-400 border-4 p-1 rounded-full"></UserIcon>
                    )}

                    <div className="relative ml-3 top-3 font-medium text-xl sm:text-3xl">
                        {user.name}
                    </div>
                </div>
                {user.username === acessUsername ? null : user.hasFriend ? (
                    <div className="mt-3 text-white text-sm flex flex-col sm:flex-row sm:items-center">
                        <button
                            onClick={() =>
                                router.push(`/${user.username}/chat`)
                            }
                            className="hidden landscape:flex bg-green-500 rounded-md px-3 py-1 mb-2 sm:mb-0 sm:mr-3"
                        >
                            Send Message
                        </button>
                        <button
                            onClick={handleRemoveFriend}
                            className="bg-red-500 rounded-md px-3 py-1"
                        >
                            Remove Friend
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={addFriend}
                        className="bg-green-500 text-white rounded-md px-3 py-1 mt-3"
                    >
                        Add Friend
                    </button>
                )}
            </div>
        </div>
    );
}
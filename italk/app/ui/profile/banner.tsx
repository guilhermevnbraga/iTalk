"use client";

import { useRouter } from "next/navigation";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

interface BannerProps {
    banner: string;
    profile_picture: string;
    name: string;
    username: string | null | undefined;
    hasFriend: boolean;
    email: string;
    userEmail: string | null | undefined;
}

export default function Banner({
    banner,
    profile_picture,
    name,
    username,
    hasFriend,
    email,
    userEmail,
}: BannerProps) {
    const router = useRouter();

    const addFriend = async () => {
        await fetch("http://localhost:3001/addFriend", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userEmail: userEmail,
                friendEmail: email,
            }),
        });
        router.refresh();
    };

    return (
        <div className="flex relative bg-gray-300 items-end h-[30vh] mb-16 grow-0">
            {banner ? (
                <Image
                    src={`data:image/jpeg;base64,${banner}`}
                    layout="fill"
                    objectFit="cover"
                    alt="banner"
                ></Image>
            ) : null}
            <div className="relative top-16 left-6 flex-row flex items-center justify-between w-[96%]">
                <div className="flex items-center">
                    {profile_picture ? (
                        <Image
                            src={`data:image/jpeg;base64,${profile_picture}`}
                            alt="Profile Picture"
                            width={100}
                            height={100}
                            className="rounded-[999px]"
                        />
                    ) : (
                        <UserIcon className="bg-white h-24 w-24 text-gray-400 border-4 p-1 rounded-[999px]"></UserIcon>
                    )}

                    <div className="ml-3 font-medium text-3xl">{name}</div>
                </div>
                {name === username ? null : hasFriend ? null : (
                    <button
                        onClick={addFriend}
                        className="ml-3 bg-green-500 text-white rounded-md px-3 py-1"
                    >
                        Add Friend
                    </button>
                )}
            </div>
        </div>
    );
}

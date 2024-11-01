"use client";

import { UserIcon } from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { ChatBubbleOvalLeftIcon } from "@heroicons/react/24/outline";
import { BellIcon } from "@heroicons/react/24/outline";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { WindowIcon } from "@heroicons/react/24/outline";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { useState, useEffect, useRef } from "react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

interface HeaderProps {
    name: string;
    username: string;
    email: string;
}

interface Data {
    error?: string;
    user?: Array<User>;
}

interface User {
    id: Number;
    friend_list_id?: Number;
    name: string;
    username: string;
    email: string;
    password: string;
    profilePicture: string;
    status: Number;
}

export default function Header({ name, username, email }: HeaderProps) {
    const [isHidden, setIsHidden] = useState(true);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [data, setData] = useState<Data>({});
    const searchBarRef = useRef(null);

    const logOut = async () => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_DB_URL}/logout`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            }
        );

        const data = await response.json();
        if (response.status === 400) console.log(data);
        signOut();
    };

    const searchFriends = async (search: string) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_DB_URL}/user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ search }),
        });

        const data = await response.json();
        console.log(data);
        if (response.status === 400) console.log(data);
        setData(data);
    };

    const toggleDiv = () => {
        setIsHidden(!isHidden);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchBarRef.current &&
                !(searchBarRef.current as any).contains(event.target)
            ) {
                setIsSearchActive(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [searchBarRef]);

    return (
        <header className="w-full flex flex-row items-center py-3 px-6 shadow-lg z-50 h-[8vh] justify-between">
            <div className="flex w-1/6 font-bold text-2xl">
                <Link href="/home">
                    <h1>iTalk</h1>
                </Link>
            </div>
            <div className="w-2/3 relative" ref={searchBarRef}>
                <div
                    className="flex flex-row rounded-3xl shadow p-3 cursor-pointer"
                    onClick={() => setIsSearchActive(true)}
                >
                    <MagnifyingGlassIcon className="h-6 w-6 mr-3" />
                    <input
                        type="text"
                        placeholder="Search for Friends"
                        className="w-11/12 focus:outline-0"
                        onChange={(e) => searchFriends(e.target.value)}
                    />
                </div>
                {isSearchActive && (
                    <div className="absolute top-12 left-0 w-full bg-white shadow-lg rounded-3xl p-3">
                        <div className="text-gray-600 font-medium mt-6">
                            {data.error
                                ? data.error
                                : data.user
                                ? data.user.map((user: User, idx) => (
                                      <Link
                                          key={idx}
                                          className="flex mb-6 items-center"
                                          href={`/${user.username}`}
                                      >
                                          {user.profilePicture ? (
                                              <Image
                                                  src={`data:image/jpeg;base64,${user.profilePicture}`}
                                                  alt="perfil"
                                                  className="w-12 h-12 mr-2 rounded-[50%] p-1"
                                                  width={30}
                                                  height={30}
                                              />
                                          ) : (
                                              <UserIcon className="w-12 h-12 mr-3"></UserIcon>
                                          )}
                                          <p>{user.name}</p>
                                      </Link>
                                  ))
                                : null}
                        </div>
                    </div>
                )}
            </div>
            <div className="flex">
                <button className="mr-3" onClick={toggleDiv}>
                    <span className="items-center flex hover:scale-105 hover:underline">
                        {name}
                    </span>
                </button>
                <button className="w-6 h-6 hover:scale-110" onClick={toggleDiv}>
                    <UserIcon className="text-gray-900" />
                </button>
            </div>
            <div
                className={`${
                    isHidden ? "hidden" : "absolute"
                } top-16 right-6 w-[15vw]`}
            >
                <div className="flex flex-col p-6 bg-white shadow-lg rounded">
                    <button className="flex flex-row shadow rounded-lg p-3 hover:scale-105 active:scale-95">
                        <UserIcon className="text-gray-900 w-6 h-6 mr-3" />
                        <Link href={username}>
                            <span>Your Profile</span>
                        </Link>
                    </button>
                    <button
                        className="flex flex-row shadow rounded-lg p-3 hover:scale-105 active:scale-95 mt-3"
                        onClick={() => logOut()}
                    >
                        <ArrowRightOnRectangleIcon className="text-gray-900 w-6 h-6 mr-3" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </header>
    );
}

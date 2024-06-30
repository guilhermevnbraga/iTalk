"use client";

import { UserIcon } from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { ChatBubbleOvalLeftIcon } from "@heroicons/react/24/outline";
import { BellIcon } from "@heroicons/react/24/outline";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { WindowIcon } from "@heroicons/react/24/outline";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";

interface HeaderProps {
    username: string;
}

export default function Header({ username }: HeaderProps) {
    const [isHidden, setIsHidden] = useState(true);

    const toggleDiv = () => {
        setIsHidden(!isHidden);
    };

    return (
        <header className="w-full flex flex-row items-center py-3 px-6 shadow-[0_5px_15px_0px_rgba(0,0,0,0.15)]">
            <div className="flex w-1/6 font-bold text-2xl">
                <Link href="/home">
                    <h1>iTalk</h1>
                </Link>
            </div>
            <div className="w-2/3">
                <div className="w-2/3 flex flex-row rounded-3xl shadow p-3">
                    <MagnifyingGlassIcon className="h-6 w-6 mr-3"></MagnifyingGlassIcon>
                    <input
                        type="text"
                        placeholder="Search for Friends"
                        className="w-11/12 focus:outline-0"
                    />
                </div>
            </div>
            <div className="w-1/6 flex">
                <div className="w-1/5"></div>
                <div className="w-4/5 flex flex-row justify-between">
                    <div className="flex flex-row justify-between">
                        <button className="mr-2 w-10 p-2 shadow rounded-3xl hover:scale-110">
                            <ChatBubbleOvalLeftIcon className="h-6 w-6 text-gray-900 mr-3"></ChatBubbleOvalLeftIcon>
                        </button>
                        <button className="w-10 p-2 shadow rounded-3xl hover:scale-110">
                            <BellIcon className="h-6 w-6 text-gray-900 mr-3"></BellIcon>
                        </button>
                    </div>
                    <div className="flex flex-row justify-between items-center">
                        <button className="mr-3" onClick={toggleDiv}>
                            <span className="items-center flex hover:scale-105 hover:underline">
                                {username}
                            </span>
                        </button>
                        <button
                            className="w-6 h-6 hover:scale-110"
                            onClick={toggleDiv}
                        >
                            <UserIcon className="text-gray-900"></UserIcon>
                        </button>
                    </div>
                </div>
                <div
                    className={`${
                        isHidden ? "hidden" : "absolute"
                    } top-16 right-6`}
                >
                    <div className="flex flex-col p-6 bg-white shadow-[0_5px_15px_0px_rgba(0,0,0,0.15)] rounded">
                        <button className="flex flex-row shadow-[0_5px_15px_0px_rgba(0,0,0,0.15)] rounded-lg p-3 hover:scale-105 active:scale-95">
                            <UserIcon className="text-gray-900 w-6 h-6 mr-3"></UserIcon>
                            <Link href="/profile">
                                <span>Your Profile</span>
                            </Link>
                        </button>
                        <button className="flex flex-row shadow-[0_5px_15px_0px_rgba(0,0,0,0.15)] rounded-lg p-3 hover:scale-105 active:scale-95 mt-3">
                            <Cog6ToothIcon className="text-gray-900 w-6 h-6 mr-3"></Cog6ToothIcon>
                            <span>Settings and Privacy</span>
                        </button>
                        <button className="flex flex-row shadow-[0_5px_15px_0px_rgba(0,0,0,0.15)] rounded-lg p-3 hover:scale-105 active:scale-95 mt-3">
                            <QuestionMarkCircleIcon className="text-gray-900 w-6 h-6 mr-3"></QuestionMarkCircleIcon>
                            <span>Help and Support</span>
                        </button>
                        <button className="flex flex-row shadow-[0_5px_15px_0px_rgba(0,0,0,0.15)] rounded-lg p-3 hover:scale-105 active:scale-95 mt-3">
                            <WindowIcon className="text-gray-900 w-6 h-6 mr-3"></WindowIcon>
                            <span>Screen and Acessibility</span>
                        </button>
                        <button className="flex flex-row shadow-[0_5px_15px_0px_rgba(0,0,0,0.15)] rounded-lg p-3 hover:scale-105 active:scale-95 mt-3">
                            <ExclamationCircleIcon className="text-gray-900 w-6 h-6 mr-3"></ExclamationCircleIcon>
                            <span>Feedback</span>
                        </button>
                        <button
                            className="flex flex-row shadow-[0_5px_15px_0px_rgba(0,0,0,0.15)] rounded-lg p-3 hover:scale-105 active:scale-95 mt-3"
                            onClick={() => signOut()}
                        >
                            <ArrowRightStartOnRectangleIcon className="text-gray-900 w-6 h-6 mr-3"></ArrowRightStartOnRectangleIcon>
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}

"use client";

import { useState } from "react";
import { UserIcon } from "@heroicons/react/24/solid";
import Posts from "../home/posts";
import Image from "next/image";

interface HeaderProps {
    username?: string;
    password?: string;
    picture?: string;
    banner?: string;
    about?: string;
}

export default function Option({
    username,
    password,
    picture,
    banner,
}: HeaderProps) {
    const [option, setOption] = useState<number>(0);
    const [content, setContent] = useState("");

    return (
        <>
            <div className="flex flex-row justify-around w-full p-6">
                <button
                    className={`hover:text-blue-600 active:scale-95 font-medium text-lg ${
                        option === 0
                            ? "underline underline-offset-4 decoration-2 decoration-blue-600"
                            : ""
                    }`}
                    onClick={() => {
                        setOption(0);
                    }}
                >
                    Posts
                </button>
                <button
                    className={`hover:text-blue-600 active:scale-95 font-medium text-lg ${
                        option === 1
                            ? "underline underline-offset-4 decoration-2 decoration-blue-600"
                            : ""
                    }`}
                    onClick={() => setOption(1)}
                >
                    Friends
                </button>
                <button
                    className={`hover:text-blue-600 active:scale-95 font-medium text-lg ${
                        option === 2
                            ? "underline underline-offset-4 decoration-2 decoration-blue-600"
                            : ""
                    }`}
                    onClick={() => setOption(2)}
                >
                    About
                </button>
                <button
                    className={`hover:text-blue-600 active:scale-95 font-medium text-lg ${
                        option === 3
                            ? "underline underline-offset-4 decoration-2 decoration-blue-600"
                            : ""
                    }`}
                    onClick={() => setOption(3)}
                >
                    Account
                </button>
            </div>
            <div className={`px-6 ${option === 0 ? "" : " hidden"}`}>
                <Posts username={username || undefined}></Posts>
            </div>
            <div className={`px-6 ${option === 1 ? "" : " hidden"}`}></div>
            <div className={`px-6 ${option === 2 ? "" : " hidden"} p-6`}>
                <form>
                    <textarea
                        placeholder="Tell us about you..."
                        className="rounded-2xl bg-gray-300 h-[40vh] p-3 w-full focus:outline-0 resize-none"
                        onChange={(e) => {
                            e.target.style.height = "40vh";
                            e.target.style.height =
                                e.target.scrollHeight + "px";
                            setContent(e.target.value);
                        }}
                    ></textarea>
                    <div className="w-full flex justify-end">
                        <button className="max-w-fit px-6 py-0.5 bg-green-400 rounded-md">
                            Save
                        </button>
                    </div>
                </form>
            </div>
            <div className={`p-6 ${option === 3 ? "" : " hidden "}grow`}>
                <form className="flex flex-col bg-gray-300 rounded-2xl h-fit p-6">
                    <div className="flex w-full justify-between mb-12">
                        <div className="flex flex-col w-[48%]">
                            <div className="flex flex-col mb-6">
                                <label htmlFor="name" className="ml-2">
                                    Username
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    placeholder={
                                        username
                                            ? username
                                            : "Error finding your username!"
                                    }
                                    className="focus:outline-0 border-2 border-gray-400 px-2 rounded-2xl "
                                />
                            </div>
                            <div className="flex flex-col mb-6">
                                <label htmlFor="password" className="ml-2">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="text"
                                    placeholder="•••••••••••••••"
                                    className="focus:outline-0 border-2 border-gray-400 px-2 rounded-2xl "
                                />
                            </div>
                            <div className="flex flex-col mb-6">
                                <label htmlFor="npassword" className="ml-2">
                                    New Password
                                </label>
                                <input
                                    id="npassword"
                                    type="text"
                                    placeholder="•••••••••••••••"
                                    className="focus:outline-0 border-2 border-gray-400 px-2 rounded-2xl "
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="cpassword" className="ml-2">
                                    Confirm Password
                                </label>
                                <input
                                    id="cpassword"
                                    type="text"
                                    placeholder="•••••••••••••••"
                                    className="focus:outline-0 border-2 border-gray-400 px-2 rounded-2xl "
                                />
                            </div>
                        </div>
                        <div className="w-[48%] flex-col flex justify-center items-center">
                            <div className="w-full h-full flex justify-around items-center">
                                <div className="w-full h-full flex flex-col justify-around items-center">
                                    <span className="mb-1">
                                        Profile Picture
                                    </span>
                                    {picture ? (
                                        <Image
                                            src={picture}
                                            alt="Profile Picture"
                                            width={100}
                                            height={100}
                                        />
                                    ) : (
                                        <UserIcon className="bg-white h-24 text-gray-400 border-4 p-1 rounded-[999px]"></UserIcon>
                                    )}
                                    <button className="bg-white rounded-md max-w-fit px-2 py-0.5">
                                        Change
                                    </button>
                                </div>
                                <div className="w-full h-full flex flex-col justify-around items-center">
                                    <span className="mb-1">Banner</span>
                                    {banner ? (
                                        <Image
                                            src={banner}
                                            alt="Profile Picture"
                                            width={100}
                                            height={100}
                                        />
                                    ) : (
                                        <div className="bg-gray-400 min-h-[40%] min-w-[60%]"></div>
                                    )}
                                    <button className="bg-white rounded-md max-w-fit px-2 py-0.5">
                                        Change
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex justify-between px-1.5">
                        <button className="max-w-fit px-6 py-0.5 bg-green-400 rounded-md">
                            Save
                        </button>
                        <button className="max-w-fit px-4 py-0.5 bg-red-400 rounded-md">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

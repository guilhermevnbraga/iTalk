"use client";

import { useState } from "react";
import Posts from "../home/posts";

interface HeaderProps {
    username?: string;
}

export default function Option({ username }: HeaderProps) {
    const [option, setOption] = useState<number>(0);

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
            <div className={`px-6 ${option === 0 ? '' : ' hidden'}`}>
                <Posts username={username || undefined}></Posts>
            </div>
        </>
    );
}

'use client'

import { signIn } from "next-auth/react";
import Image from "next/image";
import google from "../ui/imgs/google.png";
import github from "../ui/imgs/github.png";

export default function ProvidersButtons() {
    return (
        <div className="flex flex-row w-full landscape:w-3/5 justify-around mb-3">
            <figure className="shadow-lg flex bg-[#2d85c3] hover:bg-white rounded-3xl border-solid border-2 p-1 border-[#2d85c3] w-2/5 xl:w-2/6 justify-center items-center hover:scale-105">
                <button
                    className="active:scale-95 flex justify-center items-center w-full h-full p-2"
                    onClick={() =>
                        signIn("google", {
                            callbackUrl: "/home",
                        })
                    }
                >
                    <Image src={google} alt="google" className="w-7 h-7" />
                </button>
            </figure>
            <figure className="shadow-lg flex bg-[#2d85c3] hover:bg-white rounded-3xl border-solid border-2 p-1 border-[#2d85c3] w-2/5 xl:w-2/6 justify-center items-center hover:scale-105 ">
                <button
                    className="active:scale-95 flex justify-center items-center w-full h-full p-2"
                    onClick={() =>
                        signIn("github", {
                            callbackUrl: "/home",
                        })
                    }
                >
                    <Image src={github} alt="github" className="w-7 h-7" />
                </button>
            </figure>
        </div>
    );
}

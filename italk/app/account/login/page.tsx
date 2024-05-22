"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import emailIcon from "../../ui/imgs/email.png";
import ProvidersButtons from "../../ui/providersButtons";
import PasswordInput from "../../ui/passwordInput";
import { signIn } from "next-auth/react";

export default function Page() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div className="flex flex-col justify-evenly h-full items-center w-full">
            <h1 className="text-5xl font-bold">Log in</h1>
            <div className="flex flex-col w-full justify-center items-center">
                <form className="flex flex-col w-full landscape:w-3/5 md:w-5/6">
                    <label
                        htmlFor="email"
                        className="md:text-lg mb-2 ml-3 text-xs font-medium"
                    >
                        Email
                    </label>
                    <div className="shadow-lg flex items-center justify-between border-solid border-2 rounded-3xl border-yellow-400 bg-white mb-6 px-2 w-full">
                        <input
                            onChange={(e) => {
                                setEmail(e.target.value);
                                console.log(email);
                            }}
                            type="text"
                            id="email"
                            className="w-11/12 md:p-3 p-2 bg-transparent focus:outline-0 placeholder:text-xs landscape:placeholder:text-base"
                            placeholder="email@email.com"
                            autoComplete="off"
                        />
                        <Image
                            src={emailIcon}
                            className="mr-3 w-6 h-4"
                            alt="email"
                        />
                    </div>
                    <PasswordInput
                        label="Password"
                        onChange={setPassword}
                    ></PasswordInput>
                </form>
                <div className="flex justify-around items-center w-full landscape:w-3/5 mb-3 landscape:w-3/5 landscape:justify-between md:text-sm xl:text-base text-xs">
                    <div className="flex flex-row items-center justify-center">
                        <input
                            type="checkbox"
                            className="accent-yellow-400 w-3 h-3 mr-1 ml-3"
                        ></input>
                        <span>Remember me</span>
                    </div>
                    <span className="hover:underline cursor-pointer">
                        Forgot Password?
                    </span>
                </div>
                <button
                    onClick={() =>
                        signIn("credentials", {
                            email: email,
                            password: password,
                            callbackUrl: "/dashboard",
                        })
                    }
                    className="mb-6 shadow-lg w-full landscape:w-3/5 bg-yellow-400 w-7/12 rounded-3xl p-1 text-white md:text-base lg:text-lg xl:text-xl md:w-4/5 font-medium hover:bg-white hover:text-yellow-400 border-solid border-2 border-yellow-400"
                >
                    Login
                </button>
                <ProvidersButtons></ProvidersButtons>
            </div>
            <Link href="./register">
                <span className="font-light md:text-base text-xs hover:underline cursor-pointer">
                    Doesn&apos;t have an account yet? Sign up
                </span>
            </Link>
        </div>
    );
}

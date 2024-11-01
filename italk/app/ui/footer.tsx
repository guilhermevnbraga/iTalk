import React from "react";
import Link from "next/link";
import Image from "next/image";
import github from "./imgs/github.webp";
import linkedin from "./imgs/linkedin.png";

export default function Footer() {
    return (
        <footer className="flex flex-row justify-around items-center w-full py-3 shadow-inner bg-[#2d85c3] text-teal-100 ">
            <section className="flex flex-col h-full justify-around">
                <span className="mb-1 text-sm">
                    Stay connected with us:
                </span>
                <nav className="flex w-full justify-around">
                    <Link
                        href="https://github.com/guilhermevnbraga"
                        target="_blank"
                    >
                        <Image
                            src={github}
                            className="w-6 hover:scale-105 border-1 border-solid rounded"
                            alt="github"
                        />
                    </Link>
                    <Link
                        href="https://www.linkedin.com/in/guilhermevnbraga/"
                        target="_blank"
                        >
                        <Image
                            src={linkedin}
                            className="w-6 hover:scale-105"
                            alt="linkedin"
                            />
                    </Link>
                </nav>
            </section>
            <button></button>
            <span className="h-full font-semibold text-xs flex items-center">
                © 2024 Guilherme Braga
            </span>
        </footer>
    );
}

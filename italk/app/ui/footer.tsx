import React from "react";
import Link from "next/link";
import Image from "next/image";
import github from "./imgs/github.webp";
import linkedin from "./imgs/linkedin.png";
import instagram from "./imgs/instagram.webp";

export default function Footer() {
    return (
        <footer className="flex flex-row justify-around items-center w-full py-3 shadow-inner bg-blue-700 text-teal-100 ">
            <span className="h-full font-semibold text-xs flex items-end">
                © 2024 Guilherme Braga
            </span>
            <button></button>
            <section className="flex flex-col h-full justify-around">
                <span className="mb-1 md:text-sm text-xs">
                    Stay connected with us:
                </span>
                <nav className="flex flex-row w-full justify-around">
                    <Link
                        href="https://github.com/guilhermevnbraga"
                        target="_blank"
                    >
                        <Image
                            src={github}
                            className="md:w-6 w-5 hover:scale-105 border-1 border-solid rounded"
                            alt="github"
                        />
                    </Link>
                    <Link
                        href="https://www.linkedin.com/in/guilhermevnbraga/"
                        target="_blank"
                    >
                        <Image
                            src={linkedin}
                            className="md:w-6 w-5 hover:scale-105"
                            alt="linkedin"
                        />
                    </Link>
                    <Link
                        href="https://www.instagram.com/guilherme_vnb/"
                        target="_blank"
                    >
                        <Image
                            src={instagram}
                            className="md:w-6 w-5 hover:scale-105"
                            alt="instragram"
                        />
                    </Link>
                </nav>
            </section>
        </footer>
    );
}

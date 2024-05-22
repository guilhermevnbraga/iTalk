import React from "react";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="flex flex-row justify-around items-center w-full py-3 shadow-inner bg-blue-700 text-teal-100 ">
            <span className="h-full font-black lg:text-2xl mb-1 text-xl flex items-end">
                AuthConnect
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
                        <img
                            className="md:w-6 w-5 hover:scale-105 border-1 border-solid rounded"
                            src="https://cdn.pixabay.com/photo/2022/01/30/13/33/github-6980894_1280.png"
                            alt="github"
                        />
                    </Link>
                    <Link
                        href="https://www.linkedin.com/in/guilhermevnbraga/"
                        target="_blank"
                    >
                        <img
                            className="md:w-6 w-5 hover:scale-105"
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/LinkedIn_icon.svg/2048px-LinkedIn_icon.svg.png"
                            alt="linkedin"
                        />
                    </Link>
                    <Link
                        href="https://www.instagram.com/guilherme_vnb/"
                        target="_blank"
                    >
                        <img
                            className="md:w-6 w-5 hover:scale-105"
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/600px-Instagram_icon.png"
                            alt="instragram"
                        />
                    </Link>
                </nav>
            </section>
        </footer>
    );
}

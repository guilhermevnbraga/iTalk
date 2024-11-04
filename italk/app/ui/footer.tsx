import React from "react";
import Link from "next/link";
import Image from "next/image";
import github from "./imgs/github.webp";
import linkedin from "./imgs/linkedin.png";

export default function Footer() {
    return (
        <footer className="flex flex-col sm:flex-row justify-around items-center w-full py-3 shadow-inner bg-[#2d85c3] text-teal-100 space-y-3 sm:space-y-0">
            {/* Section for links and message */}
            <section className="flex flex-col sm:flex-row sm:h-full justify-center sm:justify-around items-center sm:items-start md:gap-4">
                <span className="mb-1 text-xs sm:text-sm text-center sm:text-left">
                    Stay connected with us:
                </span>
                <nav className="flex w-full justify-around mt-2 sm:mt-0 sm:w-auto gap-4">
                    {/* GitHub link */}
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
                    {/* LinkedIn link */}
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

            {/* Copyright text */}
            <span className="h-full font-semibold text-xs sm:text-sm flex items-center text-center">
                © 2024 Guilherme Braga
            </span>
        </footer>
    );
}

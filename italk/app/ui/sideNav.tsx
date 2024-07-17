import Link from "next/link";
import { UserIcon } from "@heroicons/react/24/solid";
import { HomeIcon } from "@heroicons/react/24/solid";

export default function SideNav() {
    return (
        <>
            <div className="w-1/6 shadow-[3px_0_9px_0_rgba(0,0,0,0.15)]">
                <div className="mt-16 w-full shadow-[0_1px_1px_0_rgba(0,0,0,0.1)] p-6">
                    <button className="flex flex-row w-full mb-3">
                        <HomeIcon className="h-6 w-6 text-gray-500 mr-4"></HomeIcon>
                        <span className="flex items-end hover:underline hover:scale-105 active:scale-95">
                            Home
                        </span>
                    </button>
                    <button className="flex flex-row w-full">
                        <UserIcon className="h-6 w-6 text-gray-500 mr-4"></UserIcon>
                        <Link href="/profile">
                            <span className="flex items-end hover:underline hover:scale-105 active:scale-95">
                                My Profile
                            </span>
                        </Link>
                    </button>
                </div>
            </div>
        </>
    );
}

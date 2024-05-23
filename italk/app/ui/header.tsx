import Link from "next/link";

export default function Header() {
    return (
        <div className="p-3 flex justify-between lg:justify-around items-center w-full absolute top-0">
            <span className="font-bold lg:text-xl md:text-lg sm:text-md">
                iTalk
            </span>
            <button></button>
            <Link
                className="hover:scale-105 lg:text-md md:text-sm text-xs border-solid p-3 rounded-3xl border-2 border-teal-900 hover:bg-teal-900 hover:text-gray-50"
                href="/account/login"
            >
                <button>Connect now</button>
            </Link>
        </div>
    );
}

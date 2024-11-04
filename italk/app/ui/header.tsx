import Link from "next/link";

export default function Header() {
    return (
        <div className="p-3 flex justify-between lg:justify-around items-center w-full absolute top-0 bg-[#2d85c3] text-white">
            {/* Responsive title size */}
            <span className="font-bold text-xl md:text-lg sm:text-md text-sm">
                iTalk
            </span>
            <button></button>
            {/* Responsive button size and padding */}
            <Link
                className="text-sm md:text-xs lg:text-md border-solid p-2 sm:p-3 rounded-3xl border-2 border-[#edeff1] hover:bg-[#edeff1] hover:text-black hover:border-[#2d85c3] hover:text-[#2d85c3]"
                href="/account/login"
            >
                <button>Connect now</button>
            </Link>
        </div>
    );
}

import { UserIcon } from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { ChatBubbleOvalLeftIcon } from "@heroicons/react/24/outline";
import { BellIcon } from "@heroicons/react/24/outline";

interface HeaderProps {
    username: string;
}

export default function Header({ username }: HeaderProps) {
    return (
        <header className="w-full flex flex-row items-center py-3 px-6 shadow-[0_5px_15px_0px_rgba(0,0,0,0.15)]">
            <div className="w-1/6 font-bold text-2xl">
                <h1>iTalk</h1>
            </div>
            <div className="w-2/3">
                <div className="w-2/3 flex flex-row rounded-3xl shadow p-3">
                    <MagnifyingGlassIcon className="h-6 w-6 mr-3"></MagnifyingGlassIcon>
                    <input
                        type="text"
                        placeholder="Search for Friends"
                        className="w-11/12 focus:outline-0"
                    />
                </div>
            </div>
            <div className="w-1/6 flex">
                <div className="w-1/5"></div>
                <div className="w-4/5 flex justify-between">
                    <div className="flex flex-row justify-between">
                        <button className="mr-2 w-10 p-2 shadow rounded-3xl hover:scale-110">
                            <ChatBubbleOvalLeftIcon className="h-6 w-6 text-gray-900 mr-3"></ChatBubbleOvalLeftIcon>
                        </button>
                        <button className="w-10 p-2 shadow rounded-3xl hover:scale-110">
                            <BellIcon className="h-6 w-6 text-gray-900 mr-3"></BellIcon>
                        </button>
                    </div>
                    <div className="flex flex-row justify-between items-center">
                        <button className="mr-3">
                            <span className="items-center flex hover:scale-105 hover:underline">
                                {username}
                            </span>
                        </button>
                        <button className="w-6 h-6 hover:scale-110">
                            <UserIcon className="text-gray-900"></UserIcon>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}

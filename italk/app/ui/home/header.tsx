import Image from "next/image"
import Link from "next/link"
import talks from "@/app/ui/imgs/chat.png"
import notifications from "@/app/ui/imgs/bell.png"
import perfil from '@/app/ui/imgs/user.png'
import search from '@/app/ui/imgs/search.png'

interface HeaderProps {
    username: string
        
}

export default function Header({ username }: HeaderProps) {
    return (
        <header className="w-full flex flex-row items-center py-3 px-6">
            <div className="w-1/6 font-bold text-2xl">
                <h1>iTalk</h1>
            </div>
            <div className="w-2/3">
                <div className="w-2/3 flex flex-row rounded-3xl shadow p-3">
                    <Image
                        src={search}
                        alt="search icon"
                        className="w-5 h-5 mr-3"
                    >

                    </Image>
                    <input type="text" placeholder="Search for Friends" className="w-11/12 focus:outline-0"/>
                </div>
            </div>
            <div className="w-1/6 flex">
                <div className="w-1/5"></div>
                <div className="w-4/5 flex justify-between">
                    <div className="flex flex-row justify-between">
                        <button className="mr-2 w-10 p-2 shadow rounded-3xl hover:scale-110">
                            <Image
                                src={talks}
                                alt="talks icon"
                            >

                            </Image>
                        </button>
                        <button className="w-10 p-2 shadow rounded-3xl hover:scale-110">
                            <Image
                                src={notifications}
                                alt="notifications icon"
                            >

                            </Image>
                        </button>
                    </div>
                    <div className="flex flex-row justify-between items-center">
                        <button className="mr-3">
                            <span className="items-center flex hover:scale-105 hover:underline">
                                My Profile
                            </span>
                        </button>
                        <button className="w-6 h-6 hover:scale-110">
                            <Image
                                src={perfil}
                                alt="perfil photo"
                                className="w-6 rounded-full shadow"
                            >

                            </Image>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}

import { getServerSession } from "next-auth";
import { UserIcon } from "@heroicons/react/24/solid";
import Header from "../ui/home/header";
import Image from "next/image";
import Option from "../ui/profile/options";

export default async function Page() {
    const session = await getServerSession();

    return (
        <main className="flex items-center flex-col min-h-screen">
            <Header username={session?.user?.name || ""}></Header>
            <div className="flex flex-col w-4/6 grow shadow-[0_0_9px_0_rgba(0,0,0,0.15)]">
                <div className="flex bg-gray-400 items-end h-[25vh] mb-6 grow-0">
                    <div className="relative top-6 left-6 flex-row flex items-center">
                        {session?.user?.image ? (
                            <Image
                                src={session?.user?.image}
                                alt="Profile Picture"
                                width={100}
                                height={100}
                            />
                        ) : (
                            <UserIcon className="bg-black h-24 w-24 text-red-800 border-4 p-1 rounded-[999px]"></UserIcon>
                        )}

                        <div className="ml-3 font-medium text-3xl">{`${session?.user?.name}`}</div>
                    </div>
                </div>
                <Option username={session?.user?.name || undefined}></Option>
            </div>
        </main>
    );
}

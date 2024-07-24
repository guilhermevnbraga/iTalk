import { getServerSession } from "next-auth";
import { UserIcon } from "@heroicons/react/24/solid";
import Header from "../ui/home/header";
import Image from "next/image";
import Option from "../ui/profile/options";

export default async function Page({ params }: { params: { name: string } }) {
    let user = null;
    const session = await getServerSession();

    const { name } = params;

    const response = await fetch("https://italk-server.vercel.app/profile", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
    });

    const data = await response.json();
    if (response.status === 400) {
        console.log(data);
    } else {
        user = data.user;
    }

    return (
        <main className="flex items-center flex-col min-h-screen">
            <Header
                username={session?.user?.name || ""}
                email={session?.user?.email || ""}
            ></Header>
            <div className="flex flex-col w-4/6 grow shadow-[0_0_9px_0_rgba(0,0,0,0.15)]">
                <div className="flex bg-gray-300 items-end h-[30vh] mb-6 grow-0">
                    <div className="relative top-6 left-6 flex-row flex items-center">
                        {user.profile_picture ? (
                            <Image
                                src={user.profile_picture}
                                alt="Profile Picture"
                                width={100}
                                height={100}
                            />
                        ) : (
                            <UserIcon className="bg-white h-24 w-24 text-gray-400 border-4 p-1 rounded-[999px]"></UserIcon>
                        )}

                        <div className="ml-3 font-medium text-3xl">{user.name}</div>
                    </div>
                </div>
                <Option username={user.name}></Option>
            </div>
        </main>
    );
}

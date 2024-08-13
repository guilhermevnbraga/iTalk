import Header from "@/app/ui/home/header";
import { getServerSession } from "next-auth";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

export default async function Page({ params }: { params: { name: string } }) {
    const session = await getServerSession();
    const { name } = params;

    const fetchUsername = await fetch("http://localhost:3001/username", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: session?.user?.email }),
    });

    let username = "";
    const usernameData = await fetchUsername.json();
    if (fetchUsername.status === 400) {
        console.log(usernameData);
    } else {
        username = usernameData.username;
    }

    return (
        <>
            <Header
                name={session?.user?.name || " "}
                email={session?.user?.email || ""}
                username={username}
            ></Header>
            <main className="flex w-full min-h-screen">
                <aside className="w-1/4 flex justify-center shadow-[-3px_12px_9px_0px_rgba(0,0,0,0.3)] min--h-full">
                    <div className="flex p-2 mt-3 border-2 border-gray-700 rounded-2xl bg-gray-100 h-fit w-11/12">
                        <MagnifyingGlassIcon className="h-6 w-6 mr-3" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="focus:outline-0 bg-gray-100"
                        />
                    </div>
                </aside>
                <section>
                    <h1>{name}</h1>
                </section>
            </main>
        </>
    );
}

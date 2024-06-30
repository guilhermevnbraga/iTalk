import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Header from "../ui/home/header";
import Footer from "../ui/footer";
import Post from "../ui/home/post";
import Posts from "../ui/home/posts";
import SideNav from "../ui/sideNav";

export default async function Page() {
    const session = await getServerSession();

    if (!session) {
        redirect("/");
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header username={session?.user?.name || ""}></Header>
            <main className="flex grow min-h-screen">
                <SideNav></SideNav>
                <div className="w-[44%] p-6 items-center flex flex-col">
                    <Post
                        email={session?.user?.email || ""}
                        profile={null}
                        name={session?.user?.name || ""}
                    ></Post>
                    <Posts></Posts>
                </div>
                <div className="flex justify-center w-[22%] bg-yellow-400 p-6">
                    Events
                </div>
                <div className="flex justify-center w-1/6 shadow-[-3px_0px_9px_0px_rgba(0,0,0,0.15)] p-6">
                    Chats
                </div>
            </main>
            <Footer></Footer>
        </div>
    );
}

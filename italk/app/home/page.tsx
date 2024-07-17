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
                <div className="p-6 items-center flex flex-col grow">
                    <Post
                        email={session?.user?.email || ""}
                        profile={null}
                        name={session?.user?.name || ""}
                    ></Post>
                    <Posts></Posts>
                </div>
                <div className="flex align-center flex-col w-1/6 shadow-[-3px_0px_9px_0px_rgba(0,0,0,0.15)]">
                    <div className="flex justify-center shadow-[0_1px_1px_0_rgba(0,0,0,0.1)] h-fit w-full p-6">
                        Chats
                    </div>
                    <div className="flex justify-center shadow-[0_1px_1px_0_rgba(0,0,0,0.1)] h-fit w-full p-6">
                        Groups
                    </div>
                </div>
            </main>
            <Footer></Footer>
        </div>
    );
}

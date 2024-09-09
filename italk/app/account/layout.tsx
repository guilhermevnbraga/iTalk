import Header from "../ui/header";
import Footer from "../ui/footer";
import Image from "next/image";
import talk1 from "../ui/imgs/talk1.webp";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <main className="flex flex-col justify-center items-center bg-[#edeff1] h-screen">
            <Header></Header>
            <div className="flex flex-row w-full justify-center items-center p-6 h-full">
                <aside className="flex justify-center items-center w-1/2">
                    <figure className="w-1/2 shadow-md">
                        <Image
                            src={talk1}
                            width={999}
                            height={999}
                            alt="talk"
                        ></Image>
                    </figure>
                </aside>
                <section className="items-center h-full flex w-1/2 p-3">
                    {children}
                </section>
            </div>
            <Footer></Footer>
        </main>
    );
}

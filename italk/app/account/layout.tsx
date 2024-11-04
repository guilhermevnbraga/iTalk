import Footer from "../ui/footer";
import Image from "next/image";
import talk from "../ui/imgs/talk5.webp";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <main className="flex flex-col justify-center items-center bg-[#edeff1] h-screen">
            <div className="flex flex-row w-full justify-center items-center p-6 h-full">
                <aside className="hidden landscape:flex flex justify-center items-center w-1/2">
                    <figure className="w-1/2 shadow-md">
                        <Image
                            src={talk}
                            width={999}
                            height={999}
                            alt="talk"
                        ></Image>
                    </figure>
                </aside>
                <section className="items-center h-full flex landscape:w-1/2 w-full p-3">
                    {children}
                </section>
            </div>
            <Footer></Footer>
        </main>
    );
}

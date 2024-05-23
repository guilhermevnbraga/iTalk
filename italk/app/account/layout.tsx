import Image from "next/image";
import Footer from "../ui/footer";
import penguin from "../ui/imgs/penguin.webp";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <main className="penguin flex flex-col justify-center items-center bg-center bg-no-repeat landscape:bg-gradient-to-b from-white to-blue-400 bg-cover">
            <div className="flex flex-row w-full justify-center items-center p-6 min-h-screen">
                <figure className="hidden landscape:flex w-1/2 justify-center items-center">
                    <Image
                        src={penguin}
                        alt="black-penguin"
                        className="w-3/5"
                    />
                </figure>
                <section className="landscape:h-full landscape:border-none landscape:bg-transparent landscape:p-0 border-solid border-4 rounded-xl border-yellow-400 bg-opacity-90 landscape:w-1/2 md:w-3/5 w-4/5 bg-white p-3">
                    {children}
                </section>
            </div>
            <div className="hidden landscape:flex w-full">
                <Footer></Footer>
            </div>
        </main>
    );
}

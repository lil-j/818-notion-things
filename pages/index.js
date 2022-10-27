import Link from "next/link";

export default function Home() {
    return (
        <div className="mx-auto max-w-lg mt-24 px-5">
            <h1 className="leading-tight text-purple-700 mb-3">Welcome to the 818 House ✨</h1>
            <h2 className="leading-tight">What are you looking for?</h2>
            <hr/>
            <main className="block">
                <Link href="/notion/communal-purchases">
                    <h3 className="mt-12 text-blue-700 hover:underline hover:cursor-pointer">Communal Purchases</h3>
                </Link>
                <div>
                    <Link href="/communal-purchases/log">
                        <a className="hover:underline">Log a purchase</a>
                    </Link>
                </div>
                <div>
                    <Link href="/communal-purchases/pay">
                        <a className="hover:underline">Pay someone back</a>
                    </Link>
                </div>
            </main>



        </div>
    )
}

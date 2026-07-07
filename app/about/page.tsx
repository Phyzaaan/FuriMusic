import Link from 'next/link';

export default function AboutPage() {
    return (
        <main className="no-scrollbar flex h-full w-full max-w-3xl mx-auto flex-col gap-8 overflow-y-auto pt-22 pb-20 px-6">

            {/* Header */}
            <div className="text-center space-y-3">
                <h1
                    className="text-3xl md:text-4xl font-bold "
                >
                    🎊 Welcome to Furi Music 🥳
                </h1>
                <p className="text-lg text-secondary">
                    A fun little web app that I built just for FUN.
                </p>
            </div>

            {/* The "Why" */}
            <div
                className="p-4 rounded-lg border shadow-lg bg-card-bg/50 border-card-border"
            >
                <h2 className="text-xl font-bold mb-2">Was it Worth it?</h2>
                <p className="text-secondary" >
                    YES! 110%. You will never get the feeling of listening to your fav song in a music player you crafted with your own little hands.
                </p>
            </div>

            {/* Tech Stack */}
            <div className="flex flex-col gap-2">
                <h2 className="text-xl font-bold border-b border-card-border pb-2">🛠️ The Magic Under the Hood</h2>
                <div className="flex flex-wrap gap-3">
                    {['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase'].map((tech) => (
                        <span
                            key={tech}
                            className="px-3 py-1 rounded-md text-sm font-medium text-primary bg-white/5 border border-card-border hover:scale-110"
                        >
                            {tech}
                        </span>
                    ))}
                </div>
            </div>

            {/* Coming Soon */}
            <div className="flex flex-col gap-2">
                <h2 className="text-xl font-bold border-b border-white/10 pb-2">🚀 Coming Soon...</h2>
                <ul className="list-none space-y-2">
                    <li className="flex gap-2 text-gray-300">
                        <span>🎧</span>
                        <span><strong>Suggest Me:</strong> Support for more platforms (Porbably)</span>
                    </li>
                    <li className="flex gap-2 text-gray-300">
                        <span>🐛</span>
                        <span>Fewer bugs (hopefully).</span>
                    </li>
                </ul>
            </div>

            {/* Links & Socials */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                    className="px-4 py-2 rounded-lg border hover:opacity-95 transition bg-card-bg/50 border-card-border"
                >
                    <h3 className="font-bold text-lg pb-2">💻 Source Code</h3>
                    <p className="text-sm text-gray-400 mb-3">Want to see the messy code behind the music?</p>
                    <Link href="https://github.com/Phyzaaan/FuriMusic" target="_blank" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">
                        Peek at the Repo
                    </Link>
                </div>

                <div
                    className="px-4 py-2 rounded-lg border hover:opacity-95 transition bg-card-bg/50 border-card-border"
                >
                    <h3 className="font-bold text-lg pb-2">👋 Stalk Me (Professionally)</h3>
                    <div className="flex flex-col gap-2">
                        <Link href="https://github.com/Phyzaaan" target="_blank" className="text-secondary hover:text-white transition">🐙 GitHub</Link>
                        <Link href="https://phyzaan.vercel.app" target="_blank" className="text-secondary hover:text-white transition">🌐 Portfolio</Link>
                    </div>
                </div>
            </div>

        </main>
    );
}
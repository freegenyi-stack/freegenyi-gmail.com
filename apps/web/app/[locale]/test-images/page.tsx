"use client"
import Image from "next/image"

export default function TestImages() {
    return (
        <div className="p-10 space-y-10 bg-white min-h-screen">
            <h1 className="text-3xl font-bold text-black border-b pb-4">Image Verification Page (v2)</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Local Image Test */}
                <div className="p-4 border rounded shadow-sm">
                    <h2 className="text-xl font-semibold mb-4 text-blue-600">1. Local Image (Public Folder)</h2>
                    <p className="text-sm text-gray-600 mb-4">Path: /images/hero-kids-learning.jpg</p>
                    <div className="relative w-full aspect-video border bg-slate-100 flex items-center justify-center">
                        <Image
                            src="/images/hero-kids-learning.jpg"
                            alt="Local Test"
                            fill
                            className="object-cover"
                            unoptimized
                        />
                        <span className="absolute text-red-500 font-bold">Si vous voyez ce texte, l'image locale est vide ou absente</span>
                    </div>
                </div>

                {/* Remote Image Test */}
                <div className="p-4 border rounded shadow-sm">
                    <h2 className="text-xl font-semibold mb-4 text-green-600">2. Remote Image (External)</h2>
                    <p className="text-sm text-gray-600 mb-4">Source: Unsplash</p>
                    <div className="relative w-full aspect-video border bg-slate-100 flex items-center justify-center">
                        <Image
                            src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=400"
                            alt="Remote Test"
                            fill
                            className="object-cover"
                            unoptimized
                        />
                        <span className="absolute text-red-500 font-bold">Si vous voyez ce texte, l'image distante ne charge pas</span>
                    </div>
                </div>

                {/* Plain HTML Img Test */}
                <div className="p-4 border rounded shadow-sm">
                    <h2 className="text-xl font-semibold mb-4 text-purple-600">3. Plain HTML Img Tag</h2>
                    <p className="text-sm text-gray-600 mb-4">Path: /images/classroom.jpg</p>
                    <div className="border bg-slate-100 min-h-[100px] flex items-center justify-center">
                        <img
                            src="/images/classroom.jpg"
                            alt="Plain Tag Test"
                            className="max-w-full h-auto"
                        />
                    </div>
                </div>

                {/* Serving Check */}
                <div className="p-4 border rounded shadow-sm">
                    <h2 className="text-xl font-semibold mb-4 text-amber-600">4. Static File Check</h2>
                    <p className="mb-4">Tentez d'accéder à :</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>
                            <a href="/public-test.txt" target="_blank" className="text-blue-500 underline">/public-test.txt</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

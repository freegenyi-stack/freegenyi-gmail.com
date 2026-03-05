"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface Ray {
    id: number
    x: number
    width: number
    duration: number
    delay: number
}

interface Particle {
    id: number
    x: number
    y: number
    size: number
    duration: number
    delay: number
}

export function RaysAnimation() {
    const [rays, setRays] = useState<Ray[]>([])
    const [particles, setParticles] = useState<Particle[]>([])

    useEffect(() => {
        // Generate rays
        const newRays: Ray[] = Array.from({ length: 8 }).map((_, i) => ({
            id: i,
            x: 10 + Math.random() * 80,
            width: 2 + Math.random() * 5,
            duration: 4 + Math.random() * 4,
            delay: Math.random() * 5
        }))

        // Generate particles
        const newParticles: Particle[] = Array.from({ length: 20 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: 100 + Math.random() * 20,
            size: 0.2 + Math.random() * 0.5,
            duration: 5 + Math.random() * 10,
            delay: Math.random() * 10
        }))

        setRays(newRays)
        setParticles(newParticles)
    }, [])

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="rayGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stopColor="white" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="white" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Light Beams/Rays */}
                {rays.map((ray) => (
                    <motion.rect
                        key={`ray-${ray.id}`}
                        x={ray.x - ray.width / 2}
                        y="20"
                        width={ray.width}
                        height="80"
                        fill="url(#rayGradient)"
                        initial={{ opacity: 0, scaleY: 0, originY: 1 }}
                        animate={{
                            opacity: [0, 0.4, 0],
                            scaleY: [0.8, 1, 0.8]
                        }}
                        transition={{
                            duration: ray.duration,
                            delay: ray.delay,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                ))}

                {/* Sparkling Particles */}
                {particles.map((p) => (
                    <motion.circle
                        key={`particle-${p.id}`}
                        cx={p.x}
                        cy={p.y}
                        r={p.size}
                        fill="white"
                        initial={{ opacity: 0, y: 100 }}
                        animate={{
                            opacity: [0, 1, 1, 0],
                            y: [-10, -110], // Move upwards
                            x: [p.x, p.x + (Math.random() - 0.5) * 10] // Slight horizontal drift
                        }}
                        transition={{
                            duration: p.duration,
                            delay: p.delay,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                ))}
            </svg>
        </div>
    )
}

"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface Star {
    id: number
    size: number
    startX: number
    startY: number
    endX: number
    endY: number
    duration: number
    delay: number
}

export function DiagonalStarsAnimation() {
    const [stars, setStars] = useState<Star[]>([])

    useEffect(() => {
        // Generate stars that move from bottom-left region to top-right region
        const newStars: Star[] = Array.from({ length: 30 }).map((_, i) => {
            // Randomly start somewhere on the bottom or left edge
            const side = Math.random() > 0.5 ? 'bottom' : 'left'
            const startX = side === 'left' ? -10 : Math.random() * 80
            const startY = side === 'bottom' ? 110 : 20 + Math.random() * 80

            // End somewhere on the top or right edge
            const endX = startX + 100 + Math.random() * 50
            const endY = startY - 100 - Math.random() * 50

            return {
                id: i,
                size: 0.1 + Math.random() * 0.4,
                startX,
                startY,
                endX,
                endY,
                duration: 10 + Math.random() * 15,
                delay: Math.random() * -20 // Negative delay for pre-warmed state
            }
        })

        setStars(newStars)
    }, [])

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {stars.map((star) => (
                    <motion.circle
                        key={`star-${star.id}`}
                        r={star.size}
                        fill="white"
                        initial={{
                            x: star.startX,
                            y: star.startY,
                            opacity: 0
                        }}
                        animate={{
                            x: star.endX,
                            y: star.endY,
                            opacity: [0, 1, 1, 0],
                        }}
                        transition={{
                            duration: star.duration,
                            delay: star.delay,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />
                ))}
            </svg>
        </div>
    )
}

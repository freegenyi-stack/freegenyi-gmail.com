"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface Point {
    x: number
    y: number
    id: number
}

interface Connection {
    from: number
    to: number
}

export function ConstellationAnimation() {
    const [points, setPoints] = useState<Point[]>([])
    const [connections, setConnections] = useState<Connection[]>([])

    useEffect(() => {
        // Generate random points
        const newPoints: Point[] = Array.from({ length: 15 }).map((_, i) => ({
            x: Math.random() * 100,
            y: Math.random() * 100,
            id: i
        }))

        // Generate some logical connections (nearest neighbors)
        const newConnections: Connection[] = []
        newPoints.forEach((p, i) => {
            // Connect to 1-2 nearest points to form constellations
            const distances = newPoints
                .filter(other => other.id !== p.id)
                .map(other => ({
                    id: other.id,
                    dist: Math.sqrt(Math.pow(p.x - other.x, 2) + Math.pow(p.y - other.y, 2))
                }))
                .sort((a, b) => a.dist - b.dist)

            // Connect to the closest 2
            distances.slice(0, 2).forEach(d => {
                if (!newConnections.some(c => (c.from === p.id && c.to === d.id) || (c.from === d.id && c.to === p.id))) {
                    newConnections.push({ from: p.id, to: d.id })
                }
            })
        })

        setPoints(newPoints)
        setConnections(newConnections)
    }, [])

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Connections */}
                {connections.map((c, i) => {
                    const p1 = points.find(p => p.id === c.from)
                    const p2 = points.find(p => p.id === c.to)
                    if (!p1 || !p2) return null

                    return (
                        <motion.line
                            key={`line-${i}`}
                            x1={p1.x}
                            y1={p1.y}
                            x2={p2.x}
                            y2={p2.y}
                            stroke="rgba(255, 255, 255, 0.3)"
                            strokeWidth="0.2"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{
                                duration: 3,
                                delay: Math.random() * 2,
                                repeat: Infinity,
                                repeatType: "reverse",
                                repeatDelay: Math.random() * 5
                            }}
                        />
                    )
                })}

                {/* Stars/Points */}
                {points.map((p, i) => (
                    <g key={`point-${i}`}>
                        {/* Outer Glow */}
                        <motion.circle
                            cx={p.x}
                            cy={p.y}
                            r="0.8"
                            fill="rgba(255, 255, 255, 0.1)"
                            animate={{
                                scale: [1, 1.8, 1],
                                opacity: [0.2, 0.4, 0.2]
                            }}
                            transition={{
                                duration: 2 + Math.random() * 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                        {/* Core Star */}
                        <motion.circle
                            cx={p.x}
                            cy={p.y}
                            r="0.3"
                            fill="white"
                            animate={{
                                opacity: [0.5, 1, 0.5]
                            }}
                            transition={{
                                duration: 1.5 + Math.random() * 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    </g>
                ))}
            </svg>
        </div>
    )
}

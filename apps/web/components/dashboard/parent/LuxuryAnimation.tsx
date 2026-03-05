"use client"

import { useEffect, useRef } from "react"

export function LuxuryAnimation() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        let animId: number
        let t = 0
        let mouse = { x: 0, y: 0 }
        let targetMouse = { x: 0, y: 0 }

        // ── Resize ──────────────────────────────────────────────────────────
        const resize = () => {
            canvas.width = canvas.offsetWidth
            canvas.height = canvas.offsetHeight
            initStars()
        }

        // ── Stars ────────────────────────────────────────────────────────────
        type Star = { x: number; y: number; r: number; alpha: number; dir: number; speed: number; twinkleSpeed: number }
        let stars: Star[] = []
        const initStars = () => {
            stars = Array.from({ length: 180 }, () => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: 0.3 + Math.random() * 2.2,
                alpha: 0.1 + Math.random() * 0.9,
                dir: Math.random() > 0.5 ? 1 : -1,
                speed: 0.005 + Math.random() * 0.018,
                twinkleSpeed: 0.002 + Math.random() * 0.008,
            }))
        }

        // ── Comets ──────────────────────────────────────────────────────────
        type Comet = { x: number; y: number; vx: number; vy: number; len: number; alpha: number; active: boolean; timer: number }
        function makeComet(delay = 0): Comet {
            return {
                x: Math.random() * 0.4 * canvas.width,
                y: canvas.height * 0.2 + Math.random() * canvas.height * 0.5,
                vx: 2.5 + Math.random() * 2.2,
                vy: -(1.0 + Math.random() * 1.4),
                len: 55 + Math.random() * 90,
                alpha: 0,
                active: false,
                timer: delay,
            }
        }
        function resetComet(c: Comet) {
            c.x = Math.random() * 0.3 * canvas.width
            c.y = canvas.height * 0.3 + Math.random() * canvas.height * 0.5
            c.vx = 2.5 + Math.random() * 2.2
            c.vy = -(1.0 + Math.random() * 1.4)
            c.len = 55 + Math.random() * 90
            c.alpha = 0
            c.active = false
            c.timer = 80 + Math.random() * 160
        }
        const comets: Comet[] = Array.from({ length: 5 }, (_, i) => makeComet(i * 120))

        // ── Planets ─────────────────────────────────────────────────────────
        type Planet = {
            x: number; y: number; r: number
            color1: string; color2: string
            hasSaturnRing: boolean; ringAngle: number
            driftX: number; driftY: number; phase: number; speed: number
            // Orbit properties
            orbitRx: number; orbitRy: number; orbitAngle: number
            orbitSpeed: number; orbitPhase: number; orbitColor: string
        }
        const planets: Planet[] = [
            // Large blue-green planet (top-right area)
            {
                x: 0.82, y: 0.18, r: 22,
                color1: "#1a6fa8", color2: "#0a3a6a",
                hasSaturnRing: false, ringAngle: 0,
                driftX: 0.012, driftY: 0.008, phase: 0, speed: 0.0003,
                orbitRx: 38, orbitRy: 14, orbitAngle: -0.3,
                orbitSpeed: 0.0004, orbitPhase: 0, orbitColor: "rgba(100,160,255,0.25)"
            },
            // Saturn-like planet with ring (bottom-right)
            {
                x: 0.88, y: 0.72, r: 16,
                color1: "#c8a05a", color2: "#7a5820",
                hasSaturnRing: true, ringAngle: 0.55,
                driftX: 0.008, driftY: 0.01, phase: Math.PI, speed: 0.00025,
                orbitRx: 30, orbitRy: 11, orbitAngle: 0.2,
                orbitSpeed: 0.0003, orbitPhase: Math.PI * 0.5, orbitColor: "rgba(210,170,90,0.22)"
            },
            // Small glowing purple planet (center-left)
            {
                x: 0.08, y: 0.42, r: 10,
                color1: "#7040b0", color2: "#3a1870",
                hasSaturnRing: false, ringAngle: 0,
                driftX: 0.015, driftY: 0.012, phase: Math.PI * 0.7, speed: 0.0004,
                orbitRx: 22, orbitRy: 8, orbitAngle: 0.15,
                orbitSpeed: 0.0005, orbitPhase: 1.1, orbitColor: "rgba(160,80,220,0.22)"
            },
            // Tiny red-orange planet (upper-left)
            {
                x: 0.15, y: 0.12, r: 7,
                color1: "#d04020", color2: "#802010",
                hasSaturnRing: false, ringAngle: 0,
                driftX: 0.02, driftY: 0.015, phase: 1.2, speed: 0.00035,
                orbitRx: 16, orbitRy: 6, orbitAngle: -0.1,
                orbitSpeed: 0.0006, orbitPhase: 2.0, orbitColor: "rgba(220,100,50,0.22)"
            },
        ]

        // ── Nebula blobs ─────────────────────────────────────────────────────
        const nebulas = [
            { cx: 0.55, cy: 0.3, rx: 0.28, ry: 0.2, color: "100,40,180", alpha: 0.07, speed: 0.00008 },
            { cx: 0.2, cy: 0.7, rx: 0.2, ry: 0.15, color: "20,80,200", alpha: 0.05, speed: 0.00006 },
            { cx: 0.75, cy: 0.55, rx: 0.18, ry: 0.14, color: "160,60,40", alpha: 0.04, speed: 0.0001 },
        ]

        // ── Asteroid belt ────────────────────────────────────────────────────
        type Asteroid = { x: number; y: number; vx: number; vy: number; r: number; angle: number; spin: number }
        const asteroids: Asteroid[] = Array.from({ length: 7 }, () => ({
            x: Math.random() * (canvas?.width ?? 800),
            y: Math.random() * (canvas?.height ?? 300),
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.2,
            r: 2 + Math.random() * 4,
            angle: Math.random() * Math.PI * 2,
            spin: (Math.random() - 0.5) * 0.03
        }))

        // ── Orbital moons ─────────────────────────────────────────────────────
        type Moon = { planetIdx: number; orbitR: number; angle: number; speed: number; r: number; color: string }
        const moons: Moon[] = [
            { planetIdx: 0, orbitR: 36, angle: 0, speed: 0.012, r: 3.5, color: "rgba(180,210,255,0.9)" },
            { planetIdx: 1, orbitR: 28, angle: Math.PI, speed: 0.009, r: 2.5, color: "rgba(255,220,140,0.85)" },
            { planetIdx: 2, orbitR: 20, angle: 0.5, speed: 0.018, r: 2, color: "rgba(200,140,255,0.85)" },
        ]

        // ── Draw helpers ─────────────────────────────────────────────────────
        function getPlanetCenter(p: Planet, time: number): [number, number] {
            const cx = (p.x + Math.sin(time * p.speed + p.phase) * p.driftX) * canvas.width
            const cy = (p.y + Math.cos(time * p.speed * 0.7 + p.phase) * p.driftY) * canvas.height
            return [cx, cy]
        }

        function drawPlanetOrbit(p: Planet, cx: number, cy: number) {
            ctx.save()
            ctx.translate(cx, cy)
            ctx.rotate(p.orbitAngle)
            ctx.beginPath()
            ctx.ellipse(0, 0, p.orbitRx, p.orbitRy, 0, 0, Math.PI * 2)
            ctx.setLineDash([4, 6])
            ctx.strokeStyle = p.orbitColor
            ctx.lineWidth = 1
            ctx.stroke()
            ctx.setLineDash([])
            ctx.restore()
        }

        function drawOrbitalMoon(m: Moon, time: number) {
            const p = planets[m.planetIdx]
            const [pcx, pcy] = getPlanetCenter(p, time)
            // Moon position on its orbit (tilted ellipse)
            const mx = pcx + Math.cos(m.angle) * m.orbitR
            const my = pcy + Math.sin(m.angle) * m.orbitR * 0.35
            // Glow
            const mg = ctx.createRadialGradient(mx, my, 0, mx, my, m.r * 2.5)
            mg.addColorStop(0, m.color)
            mg.addColorStop(1, "rgba(255,255,255,0)")
            ctx.beginPath(); ctx.arc(mx, my, m.r * 2.5, 0, Math.PI * 2)
            ctx.fillStyle = mg; ctx.fill()
            // Body
            ctx.beginPath(); ctx.arc(mx, my, m.r, 0, Math.PI * 2)
            ctx.fillStyle = m.color; ctx.fill()
        }

        function drawPlanet(p: Planet, cx: number, cy: number) {
            // Atmosphere glow
            const atmGrad = ctx.createRadialGradient(cx, cy, p.r * 0.6, cx, cy, p.r * 2.5)
            atmGrad.addColorStop(0, `${p.color1}44`)
            atmGrad.addColorStop(1, "rgba(0,0,0,0)")
            ctx.beginPath(); ctx.arc(cx, cy, p.r * 2.5, 0, Math.PI * 2)
            ctx.fillStyle = atmGrad; ctx.fill()

            // Planet body
            const bodyGrad = ctx.createRadialGradient(cx - p.r * 0.3, cy - p.r * 0.3, p.r * 0.1, cx, cy, p.r)
            bodyGrad.addColorStop(0, p.color1)
            bodyGrad.addColorStop(0.6, `${p.color1}cc`)
            bodyGrad.addColorStop(1, p.color2)
            ctx.beginPath(); ctx.arc(cx, cy, p.r, 0, Math.PI * 2)
            ctx.fillStyle = bodyGrad; ctx.fill()

            // Surface detail stripes
            for (let i = 0; i < 3; i++) {
                const sy = cy - p.r * 0.5 + i * p.r * 0.5
                const sw = Math.sqrt(Math.max(0, p.r * p.r - Math.pow(sy - cy, 2))) * 1.8
                ctx.beginPath(); ctx.ellipse(cx, sy, sw, p.r * 0.07, 0, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(255,255,255,0.06)`; ctx.fill()
            }

            // Highlight
            ctx.beginPath(); ctx.arc(cx - p.r * 0.3, cy - p.r * 0.3, p.r * 0.35, 0, Math.PI * 2)
            ctx.fillStyle = "rgba(255,255,255,0.14)"; ctx.fill()

            // Saturn ring
            if (p.hasSaturnRing) {
                ctx.save()
                ctx.translate(cx, cy); ctx.rotate(p.ringAngle)
                const ringGrad = ctx.createLinearGradient(-p.r * 2.2, 0, p.r * 2.2, 0)
                ringGrad.addColorStop(0, "rgba(180,140,80,0)")
                ringGrad.addColorStop(0.2, "rgba(200,170,100,0.55)")
                ringGrad.addColorStop(0.5, "rgba(230,200,130,0.75)")
                ringGrad.addColorStop(0.8, "rgba(200,170,100,0.55)")
                ringGrad.addColorStop(1, "rgba(180,140,80,0)")
                ctx.beginPath(); ctx.ellipse(0, 0, p.r * 2.2, p.r * 0.45, 0, 0, Math.PI * 2)
                ctx.strokeStyle = ringGrad; ctx.lineWidth = p.r * 0.4; ctx.stroke()
                ctx.restore()
            }
        }

        function drawAsteroid(a: Asteroid) {
            ctx.save()
            ctx.translate(a.x, a.y); ctx.rotate(a.angle)
            ctx.beginPath()
            for (let i = 0; i < 6; i++) {
                const ang = (i / 6) * Math.PI * 2
                const rr = a.r * (0.7 + (i % 2) * 0.4)
                i === 0 ? ctx.moveTo(rr * Math.cos(ang), rr * Math.sin(ang))
                    : ctx.lineTo(rr * Math.cos(ang), rr * Math.sin(ang))
            }
            ctx.closePath()
            ctx.fillStyle = "rgba(160,150,140,0.3)"
            ctx.strokeStyle = "rgba(200,195,185,0.2)"
            ctx.lineWidth = 0.8
            ctx.fill(); ctx.stroke()
            ctx.restore()
        }

        // ── Main loop ────────────────────────────────────────────────────────
        const draw = () => {
            t++
            // Smooth mouse interpolation
            mouse.x += (targetMouse.x - mouse.x) * 0.05
            mouse.y += (targetMouse.y - mouse.y) * 0.05

            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // 0. Mouse Glow Halo
            const mouseGrad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 150)
            mouseGrad.addColorStop(0, "rgba(50, 130, 255, 0.15)")
            mouseGrad.addColorStop(1, "rgba(0, 0, 0, 0)")
            ctx.fillStyle = mouseGrad
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // 1. Nebula
            for (const n of nebulas) {
                const nx = (n.cx + Math.sin(t * n.speed) * 0.06) * canvas.width
                const ny = (n.cy + Math.cos(t * n.speed * 0.7) * 0.05) * canvas.height
                const grad = ctx.createRadialGradient(nx, ny, 0, nx, ny, n.rx * canvas.width)
                grad.addColorStop(0, `rgba(${n.color},${n.alpha * 2.5})`)
                grad.addColorStop(0.4, `rgba(${n.color},${n.alpha})`)
                grad.addColorStop(1, "rgba(0,0,0,0)")
                ctx.beginPath(); ctx.ellipse(nx, ny, n.rx * canvas.width, n.ry * canvas.height, 0, 0, Math.PI * 2)
                ctx.fillStyle = grad; ctx.fill()
            }

            // 2. Stars (twinkling)
            for (const s of stars) {
                s.alpha += s.dir * s.twinkleSpeed
                if (s.alpha > 1) { s.alpha = 1; s.dir = -1 }
                if (s.alpha < 0.05) { s.alpha = 0.05; s.dir = 1 }

                // Larger stars get a glow halo
                if (s.r > 1.0) {
                    const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4)
                    g.addColorStop(0, `rgba(210,225,255,${s.alpha * 0.55})`)
                    g.addColorStop(1, "rgba(210,225,255,0)")
                    ctx.beginPath(); ctx.arc(s.x, s.y, s.r * 4, 0, Math.PI * 2)
                    ctx.fillStyle = g; ctx.fill()

                    // 4-ray cross sparkle for big stars
                    if (s.r > 1.6) {
                        ctx.save()
                        ctx.globalAlpha = s.alpha * 0.35
                        ctx.strokeStyle = "rgba(220,235,255,1)"
                        ctx.lineWidth = 0.7
                        const len = s.r * 5
                        ctx.beginPath()
                        ctx.moveTo(s.x - len, s.y); ctx.lineTo(s.x + len, s.y)
                        ctx.moveTo(s.x, s.y - len); ctx.lineTo(s.x, s.y + len)
                        ctx.stroke()
                        ctx.restore()
                    }
                }

                ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(255,255,255,${s.alpha})`; ctx.fill()
            }

            // 3. Planet orbits (before planets)
            for (const p of planets) {
                const [cx, cy] = getPlanetCenter(p, t)
                drawPlanetOrbit(p, cx, cy)
            }

            // 4. Planets
            for (const p of planets) {
                const [cx, cy] = getPlanetCenter(p, t)
                drawPlanet(p, cx, cy)
            }

            // 5. Orbital moons (update angle + draw)
            for (const m of moons) {
                m.angle += m.speed
                drawOrbitalMoon(m, t)
            }

            // 6. Asteroids
            for (const a of asteroids) {
                a.x += a.vx; a.y += a.vy; a.angle += a.spin
                if (a.x < -20) a.x = canvas.width + 20
                if (a.x > canvas.width + 20) a.x = -20
                if (a.y < -20) a.y = canvas.height + 20
                if (a.y > canvas.height + 20) a.y = -20
                drawAsteroid(a)
            }

            // 7. Comets
            for (const c of comets) {
                if (!c.active) { c.timer--; if (c.timer <= 0) c.active = true; continue }
                c.x += c.vx; c.y += c.vy
                c.alpha = Math.min(c.alpha + 0.04, 0.9)
                const tailGrad = ctx.createLinearGradient(c.x - c.vx * c.len / 3, c.y - c.vy * c.len / 3, c.x, c.y)
                tailGrad.addColorStop(0, "rgba(200,220,255,0)"); tailGrad.addColorStop(1, `rgba(220,235,255,${c.alpha})`)
                ctx.beginPath(); ctx.moveTo(c.x - c.vx * c.len / 3, c.y - c.vy * c.len / 3); ctx.lineTo(c.x, c.y)
                ctx.strokeStyle = tailGrad; ctx.lineWidth = 2; ctx.stroke()
                ctx.beginPath(); ctx.arc(c.x, c.y, 2.5, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(255,255,255,${c.alpha})`; ctx.fill()
                if (c.x > canvas.width + 50 || c.y < -50) resetComet(c)
            }

            // 8. Gold shimmer specks
            for (let i = 0; i < 12; i++) {
                const px = ((Math.sin(t * 0.0007 + i * 2.3) * 0.5 + 0.5) * 0.9 + 0.05) * canvas.width
                const py = ((Math.cos(t * 0.0009 + i * 1.7) * 0.5 + 0.5) * 0.9 + 0.05) * canvas.height
                const alpha = (Math.sin(t * 0.002 + i) * 0.5 + 0.5) * 0.5
                ctx.beginPath(); ctx.arc(px, py, 1.2, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(250,220,120,${alpha})`; ctx.fill()
            }

            animId = requestAnimationFrame(draw)
        }

        const onMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect()
            targetMouse.x = e.clientX - rect.left
            targetMouse.y = e.clientY - rect.top
        }

        resize()
        window.addEventListener("resize", resize)
        window.addEventListener("mousemove", onMouseMove)
        draw()

        return () => {
            cancelAnimationFrame(animId)
            window.removeEventListener("resize", resize)
            window.removeEventListener("mousemove", onMouseMove)
        }
    }, [])

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
}

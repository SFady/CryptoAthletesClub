"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { GiTrophy } from "react-icons/gi";

// ─── MESSAGES ────────────────────────────────────────────────────────────────
// Ajouter un message : { key unique, title, startDate, deadline, confetti?, content JSX }
// Avant startDate  → message ignoré (pas encore actif)
// Passé deadline   → clé supprimée du localStorage, message ignoré
// confetti: true   → lance une animation confetti à l'apparition
// ─────────────────────────────────────────────────────────────────────────────
const MESSAGES = [
    {
        key: "infoMessage_v1",
        title: "Félicitations",
        startDate: new Date("2026-03-30T00:00:00"),
        deadline: new Date("2026-04-06T00:00:00"),
        confetti: true,
        content: (
            <div className="flex items-start gap-4">
                <GiTrophy className="w-16 h-16 shrink-0 mt-1 text-[#D6C48A]" />
                <ul className="text-left list-disc pl-4 space-y-2 text-white/80 text-sm sm:text-base">
                    <li>Grand vainqueur de la plus longue distance hebdomadaire : Nico Robin</li>
                    <li>Distance de 61,80 km.</li>
                    <li>Prix exceptionnel de 4.28 $ !!!</li>
                </ul>
            </div>
        ),
    },

     {
        key: "infoMessage_v1",
        title: "Challenge plus longue distance",
        startDate: new Date("2026-03-30T00:00:00"),
        deadline: new Date("2026-04-06T00:00:00"),
        confetti: false,
        content: (
            <div className="flex items-start gap-4">
                <ul className="text-left list-disc pl-4 space-y-2 text-white/80 text-sm sm:text-base">
                    <li>Le challenge reprend maintenant chaque semaine.</li>
                    <li>Nouveau : Limité à la course.</li>
                    <li>Cagnotte remise à 0.</li>
                </ul>
            </div>
        ),
    },
];

// ─────────────────────────────────────────────────────────────────────────────

export default function ClientGate({ children }) {
    const [ready, setReady] = useState(false);
    const [queue, setQueue] = useState([]);
    const [current, setCurrent] = useState(0);
    const [showModal, setShowModal] = useState(false);

    const pathname = usePathname();

    useEffect(() => {
        const now = new Date();
        const pending = [];

        for (const msg of MESSAGES) {
            if (now > msg.deadline) {
                localStorage.removeItem(msg.key);
            } else if (now >= msg.startDate) {
                const alreadySeen = !!localStorage.getItem(msg.key);
                if (!alreadySeen) pending.push(msg);
            }
        }

        setQueue(pending);
        setCurrent(0);
        setReady(true);
        setTimeout(() => setShowModal(true), 50);
    }, [pathname]);

    // Lance les confettis quand un message avec confetti:true devient visible
    useEffect(() => {
        if (!showModal || current >= queue.length) return;
        if (!queue[current]?.confetti) return;

        let stopped = false;

        const fire = async () => {
            const confetti = (await import("canvas-confetti")).default;

            const burst = () => {
                if (stopped) return;
                confetti({
                    particleCount: 6,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0, y: 0.6 },
                    colors: ["#D6C48A", "#ffffff", "#a78bfa", "#f472b6"],
                });
                confetti({
                    particleCount: 6,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1, y: 0.6 },
                    colors: ["#D6C48A", "#ffffff", "#a78bfa", "#f472b6"],
                });
                if (!stopped) requestAnimationFrame(burst);
            };

            burst();
            setTimeout(() => { stopped = true; }, 3000);
        };

        fire();

        return () => { stopped = true; };
    }, [showModal, current, queue]);

    if (!ready) return null;

    if (current >= queue.length) return children;

    const msg = queue[current];
    const isLast = current === queue.length - 1;
    const hasMultiple = queue.length > 1;

    const handleContinue = () => {
        localStorage.setItem(msg.key, msg.deadline.toISOString());
        setShowModal(false);
        setTimeout(() => {
            setCurrent((c) => c + 1);
            setShowModal(true);
        }, 300);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4 py-6">

            {/* GLOW */}
            <div className="relative w-full max-w-lg">
                <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-violet-600 via-purple-500 to-indigo-500 opacity-50 blur-3xl animate-pulse"></div>

                {/* MODALE */}
                <div
                    className={`
                        relative
                        transform transition-all duration-300 ease-out
                        ${showModal ? "opacity-100 scale-100" : "opacity-0 scale-95"}
                        bg-white/20 backdrop-blur-2xl
                        border border-white/30
                        shadow-2xl
                        rounded-2xl
                        p-4 sm:p-6
                        max-h-[90vh]
                        overflow-y-auto
                        text-white
                    `}
                >
                    <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 drop-shadow-md">
                        {msg.title} {hasMultiple && <span className="text-sm font-normal opacity-60">({current + 1}/{queue.length})</span>}
                    </h2>

                    {msg.content}

                    <button
                        className="mt-6 w-full px-6 py-2 rounded-lg text-white font-medium bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 active:scale-95 transition-all duration-200 shadow-lg"
                        onClick={handleContinue}
                    >
                        {isLast ? "Continuer" : "Suivant →"}
                    </button>
                </div>
            </div>
        </div>
    );
}

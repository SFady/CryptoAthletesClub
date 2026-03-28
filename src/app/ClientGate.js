"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// ─── MESSAGES ────────────────────────────────────────────────────────────────
// Ajouter un message : { key unique, deadline, content JSX }
// Passé la deadline → clé supprimée du localStorage, message ignoré
// ─────────────────────────────────────────────────────────────────────────────
const MESSAGES = [
    {
        key: "infoMessage_v1",
        deadline: new Date("2026-03-27T00:00:00"),
        content: (
            <ul className="text-left list-disc pl-5 sm:pl-6 space-y-2 text-white/80 text-sm sm:text-base">
                <li>
                    Defit est à l&apos;arrêt, impossible de récupérer les Defits, longs délais avant recupération des activités.{" "}
                    <br />Aucune date d&apos;annoncée pour une éventuelle reprise.
                    <br />Le CEO se cache, silence radio depuis un mois.
                    <br />Contrôle fiscal.
                    <br />La migration sur Solana, n&apos;a jamais été faite comme annoncé.
                    <br />Ca sent la fin.
                </li>
                <li>
                    On continue de collecter sur Defit.
                    <br />J&apos;ai sorti le Defit des comptes, le boost a un bien meilleur rendement de toute façon.
                </li>
                <li>
                    Chaque semaine, celui qui aura parcouru le plus de km recevra un bonus (en Dollars pas en Defits, bien sûr 😊).
                </li>
            </ul>
        ),
    },

    // Exemple de 2ème message — décommenter et adapter
    // {
    //     key: "infoMessage_v2",
    //     deadline: new Date("2026-04-30T00:00:00"),
    //     content: (
    //         <ul className="text-left list-disc pl-5 sm:pl-6 space-y-2 text-white/80 text-sm sm:text-base">
    //             <li>Nouveau message ici...</li>
    //         </ul>
    //     ),
    // },
];

// ─────────────────────────────────────────────────────────────────────────────

export default function ClientGate({ children }) {
    const [ready, setReady] = useState(false);
    const [queue, setQueue] = useState([]);   // messages à afficher
    const [current, setCurrent] = useState(0); // index dans la queue
    const [showModal, setShowModal] = useState(false);

    const pathname = usePathname();

    useEffect(() => {
        const now = new Date();
        const pending = [];

        for (const msg of MESSAGES) {
            if (now > msg.deadline) {
                localStorage.removeItem(msg.key);
            } else {
                const alreadySeen = !!localStorage.getItem(msg.key);
                if (!alreadySeen) pending.push(msg);
            }
        }

        setQueue(pending);
        setCurrent(0);
        setReady(true);
        setTimeout(() => setShowModal(true), 50);
    }, [pathname]);

    if (!ready) return null;

    // Tous les messages ont été vus → afficher le contenu
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
                        News {hasMultiple && <span className="text-sm font-normal opacity-60">({current + 1}/{queue.length})</span>}
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

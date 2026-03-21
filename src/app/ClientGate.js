"use client";

import { useEffect, useState } from "react";

export default function ClientGate({ children }) {
    const [ready, setReady] = useState(false);
    const [allowed, setAllowed] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const STORAGE_KEY = "infoMessage2";
    const DEADLINE = new Date("2026-03-28T00:00:00");

    useEffect(() => {
        
        localStorage.removeItem("infoMessage1");
        
        const now = new Date();
        const stored = localStorage.getItem(STORAGE_KEY);

        if (now > DEADLINE) {
            // 🔥 Après la date limite → suppression + jamais afficher
            localStorage.removeItem(STORAGE_KEY);
            setAllowed(true);
        } else {
            // Avant la date limite → afficher seulement si jamais vu
            setAllowed(!!stored);
        }

        setReady(true);

        // animation
        setTimeout(() => setShowModal(true), 50);
    }, []);

    if (!ready) return null;

    if (!allowed) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4 py-6">
                
                {/* GLOW */}
                <div className="relative w-full max-w-lg">
                    <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-violet-600 via-purple-500 to-indigo-500 opacity-50 blur-3xl animate-pulse"></div>

                    {/* MODALE */}
                    <div
                        className={`
                            relative
                            transform transition-all duration-500 ease-out
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
                            News
                        </h2>

                        <ul className="text-left list-disc pl-5 sm:pl-6 space-y-2 text-white/80 text-sm sm:text-base">
                            <li>Defit est à l'arrêt, impossible de récupérer les Defits, longs délais avant recupération des activités. <br />Aucune date d'annoncée pour une éventuelle reprise.<br />
                            Le CEO se cache, silence radio depuis un mois.<br />
                            Contrôle fiscal.<br/> 
                            La migration sur Solana, n'a jamais été faite comme annoncé.<br/>
                            Ca sent la fin.</li>
                            <li>On continue de collecter sur Defit.<br/>J'ai sorti le Defit des comptes, le boost a un bien meilleur rendement de toute façon.</li>
                            <li>Chaque semaine, celui qui aura parcouru le plus de km recevra un bonus (en Dollars pas en Defits, bien sûr &#128522;).</li>
                        </ul>
                        <button
                            className="
                                mt-6 w-full px-6 py-2 rounded-lg text-white font-medium
                                bg-gradient-to-r from-violet-600 to-indigo-600
                                hover:opacity-90 active:scale-95
                                transition-all duration-200
                                shadow-lg
                            "
                            onClick={() => {
                                // ✅ On stocke la date limite dans le localStorage
                                localStorage.setItem(STORAGE_KEY, DEADLINE.toISOString());
                                setAllowed(true);
                            }}
                        >
                            Continuer
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return children;
}
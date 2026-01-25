"use client";

import { useEffect, useState } from "react";

export default function ClientGate({ children }) {
    const [ready, setReady] = useState(false);
    const [allowed, setAllowed] = useState(false);

    useEffect(() => {
        const value = localStorage.getItem("infoMessage1");
        setAllowed(!!value);
        setReady(true);
    }, []);

    if (!ready) return null; // évite le clignotement

    if (!allowed) {
        return (
            <div className="flex min-h-screen items-center justify-center text-white px-4">
                <div className="max-w-lg space-y-4 text-center"> {/* centré */}
                    <h2 className="text-2xl font-bold mr-10">Nouvelle version du site</h2>
                    <br></br>
                    <ul className="text-left list-disc list-outside pl-6 space-y-2 text-gray-200 mx-auto">
                        <li>Refonte des pages web,<br></br> plus adaptées à la version mobile.</li>
                        <li>
                            Vraie base de données pour remplacer le fichier.<br />
                            Permet notamment de saisir les courses sur<br></br> mon téléphone.
                        </li>
                        <li>Nouveau système de jeu.<br></br>
                            Permet de changer ses Defits en Dollars<br></br> 
                            et les placer en achetant des items.<br></br>
                            Pour l'instant en cours de test sur <br></br>
                            mon profil uniquement.
                        </li>
                    </ul>

                    <button
                        className="mt-6 px-6 py-2 bg-violet-600 rounded-lg hover:bg-violet-700 transition"
                        onClick={() => {
                            localStorage.setItem("infoMessage1", "seen");
                            setAllowed(true);
                        }}
                    >
                        Continuer
                    </button>
                </div>
            </div>


        );
    }

    return children;
}

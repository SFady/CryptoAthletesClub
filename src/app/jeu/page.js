"use client";

import { useState } from "react";

const mots = [
  "Chat", "Chien", "Maison", "Soleil", "Lune", "Étoile", "Arbre", "Fleurs", "Poisson", "Papillon",
  "Oiseau", "Voiture", "Bateau", "Avion", "Ballon", "Gâteau", "Bonbon", "Pomme", "Banane", "Lapin",
  "Coeur", "Nuage", "Cheval", "Vache", "Tortue", "Escargot", "Crocodile", "Requin", "Pingouin", "Château",
  "Bicyclette", "Fusée", "Robot", "Dinosaure", "Grenouille", "Éléphant", "Lion", "Tigre", "Singe", "Canard",
  "Chapeau", "Glace", "Clé", "Livre", "Échelle", "Montagne", "Plage", "Océan", "Île", "Laitue",
  "Citrouille", "Poire", "Cerise", "Fourmi", "Abeille", "Arrosoir", "Bateau pirate", "Magicien", "Fée", "Chevalier",
  "Dragon", "Château fort", "Sorcière", "Balai", "Lunettes", "Téléphone", "Ordinateur", "Clown", "Parapluie", "Nuage",
  "Arc-en-ciel", "Feu d’artifice", "Étoile filante", "Coquillage", "Château de sable", "Cerf-volant", "Chanson", "Musique", "Danse", "Chocolat",
  "Plante", "Feuille", "Chouette", "Hibou", "Poisson rouge", "Cerf", "Écureuil", "Hérisson", "Pingouin", "Clown",
  "Chocolat chaud", "Feu de camp", "Montgolfière", "Sauterelle", "Grenouille", "Pirate", "Dauphin", "Licorne", "Robot"
];

export default function JeuPage() {
  const [motsRestants, setMotsRestants] = useState([...mots]);
  const [motAffiche, setMotAffiche] = useState("");

  function afficherMot() {
    if (motsRestants.length === 0) {
      setMotAffiche("Plus de mots !");
      return;
    }
    const index = Math.floor(Math.random() * motsRestants.length);
    const motChoisi = motsRestants[index];
    setMotAffiche(motChoisi);
    const nouveauxMots = motsRestants.filter((_, i) => i !== index);
    setMotsRestants(nouveauxMots);
  }

  return (
    <div style={{ 
      padding: "2rem", 
      backgroundColor: "#000", 
      color: "#fff", 
      textAlign: "center", 
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <h1></h1>
      <button
        onClick={afficherMot}
        style={{
          fontSize: "2.5rem",
          padding: "1rem 3rem",
          borderRadius: "12px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          cursor: "pointer",
          marginTop: "2rem",
          userSelect: "none",
        }}
      >
        Afficher un mot
      </button>
      <div
        style={{
          marginTop: "5rem",
          fontSize: "4rem",
          fontWeight: "bold",
          minHeight: "5rem",
          color: "#fff",  // blanc pour bien contraster sur fond noir
        }}
      >
        {motAffiche}
      </div>
    </div>
  );
}

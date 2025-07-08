"use client";

import { useState } from "react";
import BottomMenu from "./components/BottomMenu";
import TopMenu from './components/TopMenu';

function MainContent({ selected }) {
  switch (selected) {
     case "home":
      return <p><br></br>Bienvenue à la page d'accueil</p>;
    case "activities":
      return <p><br></br>Voici les activités</p>;
    case "profile":
      return <p><br></br>Profil utilisateur</p>;
    default:
      return <p><br></br>Choisissez une section</p>;
  }
}

export default function HomePage() {
  
  const [selectedSection, setSelectedSection] = useState("home");
  
  return (
    <main>
      <TopMenu selected={selectedSection} onSelect={setSelectedSection} />
      <MainContent selected={selectedSection} />
      <BottomMenu selected={selectedSection} onSelect={setSelectedSection} />
    </main>
  );
}

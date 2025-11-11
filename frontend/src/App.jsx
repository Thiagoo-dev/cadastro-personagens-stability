import React, { useState } from "react";
import CharacterForm from "./components/CharacterForm";
import CharacterCard from "./components/CharacterCard";
import "./App.css";

export default function App() {
  const [characters, setCharacters] = useState([]);

  const handleCreate = (char) => {
    setCharacters((prev) => [char, ...prev]);
  };

  const handleRemove = (id) => {
    setCharacters((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Cadastro de Personagens</h1>
      <CharacterForm onCreate={handleCreate} />
      <div className="cards-grid">
        {characters.map((char) => (
          <CharacterCard
            key={char.id}
            character={char}
            onRemove={() => handleRemove(char.id)}
          />
        ))}
      </div>
    </div>
  );
}

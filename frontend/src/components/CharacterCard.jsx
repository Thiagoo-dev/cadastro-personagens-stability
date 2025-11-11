import React from "react";

export default function CharacterCard({ character, onRemove }) {
  return (
    <div className="character-card">
      {character.image && (
        <img
          src={character.image}
          alt={character.name}
          className="character-image"
        />
      )}
      <div className="character-info">
        <h3>{character.name}</h3>
        <p className="char-class">{character.class}</p>
        <p className="char-desc">{character.description}</p>
      </div>
      <button className="btn remove" onClick={onRemove}>
        Remover
      </button>
    </div>
  );
}

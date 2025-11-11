import React, { useState } from "react";

export default function CharacterForm({ onCreate }) {
  const [name, setName] = useState("");
  const [charClass, setCharClass] = useState("");
  const [description, setDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [preview, setPreview] = useState(null);

  const handleGenerate = async (e) => {
    e?.preventDefault();
    setErrorMessage("");
    setIsGenerating(true);

    try {
      const prompt = `Crie uma ilustração estilizada de um personagem chamado "${name}", classe/tipo "${charClass}". Descrição: ${description}. Fundo simples, pose dinâmica, alta qualidade.`;
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const err = await response.json().catch(()=>null);
        throw new Error(err?.error || "Falha ao gerar imagem");
      }

      const data = await response.json();
      if (!data.imageUrl) throw new Error("Imagem não recebida.");

      setPreview(data.imageUrl);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || "Erro ao gerar imagem.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return setErrorMessage("Nome é obrigatório.");

    const newChar = {
      id: Date.now().toString(),
      name: name.trim(),
      class: charClass.trim(),
      description: description.trim(),
      image: preview,
      createdAt: new Date().toISOString(),
    };
    onCreate(newChar);
    setName("");
    setCharClass("");
    setDescription("");
    setPreview(null);
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="character-form">
        <label>
          Nome do personagem
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Arion, Sombra, Lyra..."
          />
        </label>

        <label>
          Classe / Tipo
          <input
            type="text"
            value={charClass}
            onChange={(e) => setCharClass(e.target.value)}
            placeholder="Ex: feiticeiro das sombras, arqueira élfica..."
          />
        </label>

        <label>
          História / Descrição
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Breve história do personagem..."
          />
        </label>

        <div className="button-row">
          <button
            type="button"
            className="btn secondary"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? "Gerando imagem..." : "Gerar imagem com IA"}
          </button>
        </div>

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        {preview && (
          <div className="preview">
            <img src={preview} alt="Preview" />
          </div>
        )}

        <div className="actions">
          <button type="submit" className="btn primary">
            Cadastrar personagem
          </button>
        </div>
      </form>
    </div>
  );
}

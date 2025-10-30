import React, { useState } from "react";

const App: React.FC = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-70b-versatile",
          messages: [...messages, newMessage],
        }),
      });

      const data = await response.json();
      const aiMessage = {
        role: "assistant",
        content: data.choices?.[0]?.message?.content || "Erro ao gerar resposta.",
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Erro na comunicação com a IA." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0f0f23] text-white p-4">
      <h1 className="text-2xl font-bold mb-4 text-center text-cyan-400">🤖 Dashboard IA - S1</h1>

      <div className="flex-1 overflow-y-auto space-y-3 mb-4 p-2 bg-[#1a1a2e] rounded-lg">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded-lg ${
              msg.role === "user" ? "bg-blue-600 text-right" : "bg-gray-700 text-left"
            }`}
          >
            {msg.content}
          </div>
        ))}
        {loading && <p className="text-gray-400 text-center">⏳ A IA está pensando...</p>}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 p-2 rounded-lg text-black"
          placeholder="Digite sua pergunta..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-lg text-black font-semibold"
        >
          Enviar
        </button>
      </div>
    </div>
  );
};

export default App;

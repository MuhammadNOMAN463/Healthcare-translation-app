import React, { useState } from "react";

export default function App() {
  const [transcript, setTranscript] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      setTranscript(speechResult);
      translateText(speechResult);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event);
    };

    recognition.start();
    setIsListening(true);
  };

  const translateText = async (text) => {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer YOUR_OPENAI_API_KEY`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: `Translate this to Spanish: ${text}` }],
      }),
    });
    const data = await response.json();
    const aiReply = data.choices[0].message.content.trim();
    setTranslatedText(aiReply);
  };

  const speakTranslation = () => {
    const utterance = new SpeechSynthesisUtterance(translatedText);
    utterance.lang = "es-ES";
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "auto", textAlign: "center" }}>
      <h1>Healthcare Translation App</h1>
      <button onClick={startListening}>
        {isListening ? "Listening..." : "Start Speaking"}
      </button>

      <div style={{ marginTop: 30 }}>
        <h3>Original Transcript:</h3>
        <p style={{ border: "1px solid #ccc", padding: 10, minHeight: 40 }}>{transcript}</p>
      </div>

      <div style={{ marginTop: 30 }}>
        <h3>Translated Text:</h3>
        <p style={{ border: "1px solid #ccc", padding: 10, minHeight: 40 }}>{translatedText}</p>
        {translatedText && (
          <button onClick={speakTranslation} style={{ marginTop: 20 }}>
            Speak Translation
          </button>
        )}
      </div>
    </div>
  );
}

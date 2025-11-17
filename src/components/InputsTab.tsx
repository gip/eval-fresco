import { useState } from "react";

interface InputEntry {
  id: number;
  timestamp: string;
  content: string;
}

function InputsTab() {
  const [inputText, setInputText] = useState("");
  const [entries, setEntries] = useState<InputEntry[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      const newEntry = {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        content: inputText.trim(),
      };
      setEntries([newEntry, ...entries]);
      setInputText("");
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: "16px", color: "rgb(237, 165, 87)" }}>
        INPUT
      </h2>

      <form className="input-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>PASTE LINK OR TEXT</label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter a URL or paste any text content..."
            rows={8}
            style={{
              backgroundColor: "#000000",
              color: "rgb(237, 165, 87)",
              border: "1px solid rgb(237, 165, 87)",
              padding: "12px",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "14px",
              width: "100%",
              resize: "vertical",
              borderRadius: "4px",
            }}
          />
        </div>
        <button type="submit" className="submit-button">
          SUBMIT
        </button>
      </form>

      {entries.length > 0 && (
        <div style={{ marginTop: "24px" }}>
          <h3 style={{ marginBottom: "12px", color: "rgb(237, 165, 87)" }}>
            SUBMITTED ENTRIES
          </h3>
          <div className="thread-container">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="message"
              >
                <div className="message-header">
                  <span className="message-time">{entry.timestamp}</span>
                </div>
                <div className="message-body" style={{ wordBreak: "break-all" }}>
                  {entry.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default InputsTab;

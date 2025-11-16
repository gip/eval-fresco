import { useState } from "react";
import "./App.css";
import DataTab from "./components/DataTab";
import InputsTab from "./components/InputsTab";
import ThreadsTab from "./components/ThreadsTab";
import TradesTab from "./components/TradesTab";
import StrategiesTab from "./components/StrategiesTab";

type TabType = "data" | "inputs" | "threads" | "trades" | "strategies";

function App() {
  const [activeTab, setActiveTab] = useState<TabType>("data");

  const tabs = [
    { id: "data" as TabType, label: "DATA" },
    { id: "inputs" as TabType, label: "INPUTS" },
    { id: "threads" as TabType, label: "THREADS" },
    { id: "trades" as TabType, label: "TRADES" },
    { id: "strategies" as TabType, label: "STRATEGIES" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "data":
        return <DataTab />;
      case "inputs":
        return <InputsTab />;
      case "threads":
        return <ThreadsTab />;
      case "trades":
        return <TradesTab />;
      case "strategies":
        return <StrategiesTab />;
      default:
        return <DataTab />;
    }
  };

  return (
    <div className="bloomberg-terminal">
      <div className="header">
        <div className="logo">BLOOMBERG</div>
        <div className="status-bar">
          <span className="status-item">LIVE</span>
          <span className="status-item">16:23:45 EST</span>
          <span className="status-item">USER: TRADER_01</span>
        </div>
      </div>

      <div className="tab-navigation">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
}

export default App;

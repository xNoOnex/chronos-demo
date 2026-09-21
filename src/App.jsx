import { useState } from 'react';
import './App.css';

function HOSLogs() {
  return (
    <div className="view-container hos-theme">
      <div className="card border-purple">
        <div className="grid-2">
          <div className="timer-box"><span className="label">DRIVE (11 HR)</span><span className="time green">11:00:00</span></div>
          <div className="timer-box"><span className="label">SHIFT (14 HR)</span><span className="time green">14:00:00</span></div>
        </div>
        <button className="btn-full bg-dark">START 14-HOUR SHIFT</button>
        <button className="btn-full bg-green mt-2">START DRIVING</button>
      </div>
      <div className="card border-orange mt-3">
        <div className="timer-box text-center"><span className="time orange">00:00:00</span></div>
        <div className="grid-3 mt-2">
          <button className="btn-outline border-orange">10 Min</button>
          <button className="btn-outline border-orange">15 Min</button>
          <button className="btn-solid bg-orange">30 Min</button>
        </div>
      </div>
    </div>
  );
}

function ContractorHub() {
  return (
    <div className="view-container contractor-theme">
      <div className="card border-blue">
        <h2 className="text-center text-green">$36475.46</h2>
        <button className="btn-full bg-blue mt-2">View Receipt</button>
      </div>
      <div className="card border-green mt-3">
        <h3 className="text-green text-center">JOB FINANCIALS</h3>
        <label className="label mt-2">Fixed Service Fee ($)</label>
        <input type="number" defaultValue="800" className="input-dark" />
      </div>
    </div>
  );
}

function HistoryArchives() {
  return (
    <div className="view-container history-theme">
      <div className="card border-purple">
        <h3 className="text-green text-center">DOT LOG ARCHIVES</h3>
        <p className="text-center text-gray italic mt-2">No DOT logs saved.</p>
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('contractor');
  return (
    <div className="app-container">
      <div className="watermark-wrapper">
        <div className="watermark-text">UNLICENSED DEMO<br/>TUCSON EVALUATION</div>
      </div>
      <header className="header"><h2>Chronos Engine</h2></header>
      <nav className="tabs">
        <button className={`tab hos ${activeTab === 'hos' ? 'active' : ''}`} onClick={() => setActiveTab('hos')}>HOS Logs</button>
        <button className={`tab contractor ${activeTab === 'contractor' ? 'active' : ''}`} onClick={() => setActiveTab('contractor')}>Contractor</button>
        <button className={`tab history ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>History</button>
      </nav>
      <main className="content">
        {activeTab === 'hos' && <HOSLogs />}
        {activeTab === 'contractor' && <ContractorHub />}
        {activeTab === 'history' && <HistoryArchives />}
      </main>
    </div>
  );
}

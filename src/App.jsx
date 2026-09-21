import { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('contractor');

  // --- GLOBAL TICKER ---
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // --- STATE (Clean Slate: No pre-added junk) ---
  const [fixedFee, setFixedFee] = useState(800);
  const [discount, setDiscount] = useState(0);
  const [jobNotes, setJobNotes] = useState('Standard deployment.');
  
  const [materials, setMaterials] = useState([]);
  const [matName, setMatName] = useState('');
  const [matCost, setMatCost] = useState('');
  const [matQty, setMatQty] = useState('');

  const [crew, setCrew] = useState([]);
  const [crewName, setCrewName] = useState('');
  const [crewRate, setCrewRate] = useState('');

  const [showReceiptModal, setShowReceiptModal] = useState(false);

  // --- MATH DERIVATIONS ---
  const displayCrew = crew.map(c => {
    let activeElapsed = c.accumulatedSecs || 0;
    if (c.isActive && c.currentStartTimestamp) {
      activeElapsed += Math.floor((now - c.currentStartTimestamp) / 1000);
    }
    return { ...c, liveElapsed: activeElapsed };
  });

  const totalMaterials = materials.reduce((acc, m) => acc + (m.cost * m.qty), 0);
  const totalCrewPayout = displayCrew.reduce((acc, c) => acc + ((c.liveElapsed / 3600) * c.rate), 0);
  const grossBillable = (parseFloat(fixedFee) || 0) + totalMaterials + totalCrewPayout - (parseFloat(discount) || 0);

  // --- ACTIONS ---
  const addMaterial = () => {
    if (!matName || !matCost || !matQty) return;
    setMaterials([...materials, { id: Date.now(), name: matName, cost: parseFloat(matCost), qty: parseInt(matQty) }]);
    setMatName(''); setMatCost(''); setMatQty('');
  };

  const addCrew = () => {
    if (!crewName || !crewRate) return;
    setCrew([...crew, { id: Date.now(), name: crewName, rate: parseFloat(crewRate), isActive: false, accumulatedSecs: 0, currentStartTimestamp: null }]);
    setCrewName(''); setCrewRate('');
  };

  const toggleCrew = (id) => {
    const timestamp = Date.now();
    setCrew(crew.map(c => {
      if (c.id === id) {
        if (c.isActive) return { ...c, isActive: false, accumulatedSecs: c.accumulatedSecs + Math.floor((timestamp - c.currentStartTimestamp)/1000), currentStartTimestamp: null };
        return { ...c, isActive: true, currentStartTimestamp: timestamp };
      }
      return c;
    }));
  };

  const removeCrew = (id) => setCrew(crew.filter(c => c.id !== id));
  const removeMaterial = (id) => setMaterials(materials.filter(m => m.id !== id));

  const formatTime = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

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
        {activeTab === 'contractor' && (
          <div className="view-container contractor-theme">
            <div className="card border-blue">
              <h2 className="text-center text-green">${grossBillable.toFixed(2)}</h2>
              <button onClick={() => setShowReceiptModal(true)} className="btn-full bg-blue mt-2">View Receipt</button>
            </div>

            <div className="card border-green mt-3">
              <h3 className="text-green text-center">JOB FINANCIALS</h3>
              <label className="label mt-2">Fixed Service Fee ($)</label>
              <input type="number" value={fixedFee} onChange={(e) => setFixedFee(e.target.value)} className="input-dark" />
              <label className="label mt-2 text-red">Apply Discount (-$)</label>
              <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} className="input-dark border-red" />
              <label className="label mt-2">Invoice Notes</label>
              <input type="text" value={jobNotes} onChange={(e) => setJobNotes(e.target.value)} className="input-dark" />
            </div>

            <div className="card border-green mt-3">
              <h3 className="text-green text-center">MATERIALS</h3>
              <div className="flex-row mt-2">
                <input type="text" placeholder="Material Name" value={matName} onChange={(e) => setMatName(e.target.value)} className="input-dark flex-grow" />
              </div>
              <div className="grid-2 mt-2">
                <input type="number" placeholder="Cost ($)" value={matCost} onChange={(e) => setMatCost(e.target.value)} className="input-dark" />
                <input type="number" placeholder="Qty" value={matQty} onChange={(e) => setMatQty(e.target.value)} className="input-dark" />
              </div>
              <button onClick={addMaterial} className="btn-full bg-orange mt-2">+ Add Material</button>
              
              {materials.map(m => (
                <div key={m.id} className="list-item mt-2">
                  <span>{m.name} (x{m.qty}) - <span className="text-green">${(m.cost * m.qty).toFixed(2)}</span></span>
                  <button onClick={() => removeMaterial(m.id)} className="text-red bg-dark border-none">x</button>
                </div>
              ))}
            </div>

            <div className="card border-green mt-3">
              <div className="flex-between">
                <h3 className="text-green">CREW</h3>
              </div>
              
              <div className="grid-2 mt-2">
                <input type="text" placeholder="Worker Name" value={crewName} onChange={(e) => setCrewName(e.target.value)} className="input-dark" />
                <input type="number" placeholder="Rate/hr" value={crewRate} onChange={(e) => setCrewRate(e.target.value)} className="input-dark" />
              </div>
              <button onClick={addCrew} className="btn-full bg-blue mt-2 mb-2">+ Add Crew</button>

              {displayCrew.map(c => (
                <div key={c.id} className="crew-card border-green mt-2" style={{ borderLeft: c.isActive ? '4px solid #a855f7' : '4px solid #14532d' }}>
                  <div className="flex-between">
                    <span className="bold">{c.name}</span>
                    <span>${c.rate}/hr</span>
                  </div>
                  <div className="time-display mt-1">{formatTime(c.liveElapsed)}</div>
                  <div className="flex-between mt-1">
                    <span className="text-green">Earned: ${((c.liveElapsed / 3600) * c.rate).toFixed(2)}</span>
                    <div>
                      <button onClick={() => toggleCrew(c.id)} className={`btn-small mr-1 ${c.isActive ? 'bg-purple' : 'bg-green'}`}>
                        {c.isActive ? 'Stop' : 'Start'}
                      </button>
                      <button onClick={() => removeCrew(c.id)} className="btn-small bg-dark text-red">x</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'hos' && (
          <div className="card border-purple mt-3"><h3 className="text-center text-purple">HOS Timers (Demo restricted)</h3></div>
        )}
        {activeTab === 'history' && (
          <div className="card border-orange mt-3"><h3 className="text-center text-orange">Archives (Demo restricted)</h3></div>
        )}
      </main>

      {/* LIVE INTERACTIVE RECEIPT MODAL */}
      {showReceiptModal && (
        <div className="modal-overlay">
          <div className="modal-content card border-blue">
            <div className="flex-between">
              <h3 className="text-green">INVOICE SUMMARY</h3>
              <button onClick={() => setShowReceiptModal(false)} className="btn-small bg-red">Close</button>
            </div>
            <div className="mt-2 text-sm">
              <div className="flex-between"><span>Service Fee:</span> <span>${parseFloat(fixedFee || 0).toFixed(2)}</span></div>
              {discount > 0 && <div className="flex-between text-red"><span>Discount Applied:</span> <span>-${parseFloat(discount).toFixed(2)}</span></div>}
              
              <div className="mt-2 bold text-gray">Materials:</div>
              {materials.length === 0 ? <div className="italic text-gray">None added</div> : materials.map(m => (
                <div key={m.id} className="flex-between pl-2"><span>{m.name} (x{m.qty})</span> <span>${(m.cost * m.qty).toFixed(2)}</span></div>
              ))}

              <div className="mt-2 bold text-gray">Labor Payouts:</div>
              {displayCrew.length === 0 ? <div className="italic text-gray">No crew active</div> : displayCrew.map(c => (
                <div key={c.id} className="flex-between pl-2"><span>{c.name} ({formatTime(c.liveElapsed)})</span> <span>${((c.liveElapsed / 3600) * c.rate).toFixed(2)}</span></div>
              ))}

              <div className="mt-3 border-top pt-2 flex-between bold text-green" style={{ fontSize: '1.2em' }}>
                <span>TOTAL DUE:</span> <span>${grossBillable.toFixed(2)}</span>
              </div>
              <div className="mt-2 italic text-gray">Notes: {jobNotes}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

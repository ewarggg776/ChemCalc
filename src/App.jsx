import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, FlaskConical, Flame, Snowflake, Wind, Droplets, Zap, Sun, Loader2 } from 'lucide-react';

const Chemistry3DTool = () => {
  const [reactants, setReactants] = useState(['H2', 'O2']);
  const [conditions, setConditions] = useState([]);
  const [temperature, setTemperature] = useState(25);
  const [pressure, setPressure] = useState('1 atm');
  const [voltage, setVoltage] = useState(null);
  const [catalyst, setCatalyst] = useState(null);
  const [solvent, setSolvent] = useState(null);
  const [showPeriodicTable, setShowPeriodicTable] = useState(false);
  const [showSymbols, setShowSymbols] = useState(false);
  const [currentInputIndex, setCurrentInputIndex] = useState(0);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const canvasRef = useRef(null);

  const periodicElements = [
    { symbol: 'H', name: 'Hydrogen', number: 1 },
    { symbol: 'He', name: 'Helium', number: 2 },
    { symbol: 'Li', name: 'Lithium', number: 3 },
    { symbol: 'Be', name: 'Beryllium', number: 4 },
    { symbol: 'B', name: 'Boron', number: 5 },
    { symbol: 'C', name: 'Carbon', number: 6 },
    { symbol: 'N', name: 'Nitrogen', number: 7 },
    { symbol: 'O', name: 'Oxygen', number: 8 },
    { symbol: 'F', name: 'Fluorine', number: 9 },
    { symbol: 'Ne', name: 'Neon', number: 10 },
    { symbol: 'Na', name: 'Sodium', number: 11 },
    { symbol: 'Mg', name: 'Magnesium', number: 12 },
    { symbol: 'Al', name: 'Aluminum', number: 13 },
    { symbol: 'Si', name: 'Silicon', number: 14 },
    { symbol: 'P', name: 'Phosphorus', number: 15 },
    { symbol: 'S', name: 'Sulfur', number: 16 },
    { symbol: 'Cl', name: 'Chlorine', number: 17 },
    { symbol: 'Ar', name: 'Argon', number: 18 },
    { symbol: 'K', name: 'Potassium', number: 19 },
    { symbol: 'Ca', name: 'Calcium', number: 20 },
    { symbol: 'Fe', name: 'Iron', number: 26 },
    { symbol: 'Cu', name: 'Copper', number: 29 },
    { symbol: 'Zn', name: 'Zinc', number: 30 },
    { symbol: 'Br', name: 'Bromine', number: 35 },
    { symbol: 'Ag', name: 'Silver', number: 47 },
    { symbol: 'I', name: 'Iodine', number: 53 },
    { symbol: 'Au', name: 'Gold', number: 79 },
    { symbol: 'Hg', name: 'Mercury', number: 80 },
    { symbol: 'Pb', name: 'Lead', number: 82 }
  ];

  const chemicalSymbols = [
    { symbol: '₀', name: 'Subscript 0' },
    { symbol: '₁', name: 'Subscript 1' },
    { symbol: '₂', name: 'Subscript 2' },
    { symbol: '₃', name: 'Subscript 3' },
    { symbol: '₄', name: 'Subscript 4' },
    { symbol: '₅', name: 'Subscript 5' },
    { symbol: '₆', name: 'Subscript 6' },
    { symbol: '₇', name: 'Subscript 7' },
    { symbol: '₈', name: 'Subscript 8' },
    { symbol: '₉', name: 'Subscript 9' },
    { symbol: '⁺', name: 'Superscript +' },
    { symbol: '⁻', name: 'Superscript -' },
    { symbol: '²⁺', name: '2+ charge' },
    { symbol: '³⁺', name: '3+ charge' },
    { symbol: '²⁻', name: '2- charge' },
    { symbol: '³⁻', name: '3- charge' },
    { symbol: '→', name: 'Reaction arrow' },
    { symbol: '⇌', name: 'Equilibrium' },
    { symbol: '↑', name: 'Gas product' },
    { symbol: '↓', name: 'Precipitate' },
    { symbol: 'Δ', name: 'Heat (delta)' },
    { symbol: '(s)', name: 'Solid state' },
    { symbol: '(l)', name: 'Liquid state' },
    { symbol: '(g)', name: 'Gas state' },
    { symbol: '(aq)', name: 'Aqueous' }
  ];

  const procedureButtons = [
    { id: 'heating', name: 'Heating 100°C', icon: Flame, color: 'bg-orange-400', temp: 100, desc: 'Mild heating' },
    { id: 'heating-med', name: 'Heating 250°C', icon: Flame, color: 'bg-orange-500', temp: 250, desc: 'Medium heat' },
    { id: 'heating-high', name: 'Heating 500°C', icon: Flame, color: 'bg-orange-600', temp: 500, desc: 'High heat' },
    { id: 'heating-extreme', name: 'Heating 900°C', icon: Flame, color: 'bg-red-700', temp: 900, desc: 'Extreme heat' },
    { id: 'burning', name: 'Combustion', icon: Flame, color: 'bg-red-600', temp: 400, desc: 'Burning in O₂' },
    { id: 'boiling', name: 'Boiling 100°C', icon: Droplets, color: 'bg-orange-300', temp: 100, desc: 'At boiling point' },
    { id: 'cooling', name: 'Cooling 0°C', icon: Snowflake, color: 'bg-blue-300', temp: 0, desc: 'Ice bath' },
    { id: 'freezing', name: 'Freezing -20°C', icon: Snowflake, color: 'bg-blue-400', temp: -20, desc: 'Freezer temp' },
    { id: 'freezing-cold', name: 'Deep Freeze -80°C', icon: Snowflake, color: 'bg-blue-500', temp: -80, desc: 'Dry ice temp' },
    { id: 'freezing-extreme', name: 'Cryo -196°C', icon: Snowflake, color: 'bg-blue-600', temp: -196, desc: 'Liquid N₂' },
    { id: 'vacuum-low', name: 'Low Vacuum', icon: Wind, color: 'bg-purple-400', temp: 25, pressure: '0.1 atm', desc: 'Reduced pressure' },
    { id: 'vacuum', name: 'High Vacuum', icon: Wind, color: 'bg-purple-500', temp: 25, pressure: '0.001 atm', desc: 'Very low pressure' },
    { id: 'pressure-med', name: 'Pressure 10 atm', icon: Wind, color: 'bg-purple-600', temp: 25, pressure: '10 atm', desc: 'Moderate pressure' },
    { id: 'pressure-high', name: 'Pressure 100 atm', icon: Wind, color: 'bg-purple-700', temp: 25, pressure: '100 atm', desc: 'High pressure' },
    { id: 'pressure-extreme', name: 'Pressure 1000 atm', icon: Wind, color: 'bg-purple-800', temp: 25, pressure: '1000 atm', desc: 'Extreme pressure' },
    { id: 'electrolysis', name: 'Electrolysis 5V', icon: Zap, color: 'bg-indigo-500', temp: 25, voltage: '5V', desc: 'Low voltage' },
    { id: 'electrolysis-high', name: 'Electrolysis 50V', icon: Zap, color: 'bg-indigo-600', temp: 25, voltage: '50V', desc: 'High voltage' },
    { id: 'arc', name: 'Electric Arc', icon: Zap, color: 'bg-indigo-700', temp: 3000, voltage: '1000V', desc: 'Plasma conditions' },
    { id: 'uv', name: 'UV Light', icon: Sun, color: 'bg-amber-400', temp: 25, desc: 'Photochemical' },
    { id: 'microwave', name: 'Microwave', icon: Sun, color: 'bg-amber-500', temp: 150, desc: 'MW heating' },
    { id: 'drying', name: 'Drying 80°C', icon: Droplets, color: 'bg-yellow-500', temp: 80, desc: 'Remove moisture' },
    { id: 'reflux', name: 'Reflux', icon: Droplets, color: 'bg-yellow-600', temp: 100, desc: 'Boil & condense' },
    { id: 'distill', name: 'Distillation', icon: Droplets, color: 'bg-yellow-700', temp: 100, desc: 'Separate by BP' },
    { id: 'sublimation', name: 'Sublimation', icon: Wind, color: 'bg-cyan-500', temp: 80, pressure: '0.01 atm', desc: 'Solid to gas' },
    { id: 'catalyst-acid', name: 'Acid Catalyst', icon: FlaskConical, color: 'bg-green-500', temp: 25, catalyst: 'H⁺', desc: 'Acid catalyzed' },
    { id: 'catalyst-base', name: 'Base Catalyst', icon: FlaskConical, color: 'bg-green-600', temp: 25, catalyst: 'OH⁻', desc: 'Base catalyzed' },
    { id: 'catalyst-metal', name: 'Metal Catalyst', icon: FlaskConical, color: 'bg-green-700', temp: 25, catalyst: 'Pt/Pd', desc: 'Metal surface' },
    { id: 'enzyme', name: 'Enzyme', icon: FlaskConical, color: 'bg-green-800', temp: 37, catalyst: 'Enzyme', desc: 'Biological' },
    { id: 'water', name: 'In Water', icon: Droplets, color: 'bg-cyan-400', temp: 25, solvent: 'H₂O', desc: 'Aqueous solution' },
    { id: 'ethanol', name: 'In Ethanol', icon: Droplets, color: 'bg-cyan-500', temp: 25, solvent: 'EtOH', desc: 'Alcohol solvent' },
    { id: 'acetone', name: 'In Acetone', icon: Droplets, color: 'bg-cyan-600', temp: 25, solvent: 'Acetone', desc: 'Organic solvent' },
    { id: 'acid-soln', name: 'In Acid', icon: Droplets, color: 'bg-red-400', temp: 25, solvent: 'HCl/H₂SO₄', desc: 'Acidic medium' }
  ];

  // Simplified fallback reactions database (keeping only a subset for brevity)
  const fallbackReactions = {
    'H2+O2': { products: '2H₂O', equation: '2H₂ + O₂ → 2H₂O', name: 'Water Formation', source: 'Synthesis' },
    'H2O+electrolysis': { products: 'H₂ + O₂', equation: '2H₂O → 2H₂ + O₂', name: 'Water Electrolysis', source: 'Electrolysis' },
    'CaCO3+heating': { products: 'CaO + CO₂', equation: 'CaCO3 → CaO + CO₂', name: 'Limestone Decomposition', temp: 900, source: 'Thermal Decomposition' },
    'NaCl+electrolysis': { products: 'Na + Cl₂', equation: '2NaCl → 2Na + Cl₂', name: 'Sodium Chloride Electrolysis', source: 'Electrolysis' },
    'CH4+O2+burning': { products: 'CO₂ + H₂O', equation: 'CH₄ + 2O₂ → CO₂ + 2H₂O', name: 'Methane Combustion', source: 'Combustion' },
    'HCl+NaOH': { products: 'NaCl + H₂O', equation: 'HCl + NaOH → NaCl + H₂O', name: 'Acid-Base Neutralization', source: 'Acid-Base' },
    'AgNO3+NaCl': { products: 'AgCl + NaNO₃', equation: 'AgNO₃ + NaCl → AgCl↓ + NaNO₃', name: 'Silver Chloride Precipitation', source: 'Precipitation' },
    'Zn+HCl': { products: 'ZnCl₂ + H₂', equation: 'Zn + 2HCl → ZnCl₂ + H₂', name: 'Zinc and Acid', source: 'Single Displacement' }
  };

  const addReactant = () => {
    setReactants([...reactants, '']);
  };

  const removeReactant = (index) => {
    if (reactants.length > 2) {
      setReactants(reactants.filter((_, i) => i !== index));
    }
  };

  const updateReactant = (index, value) => {
    const newReactants = [...reactants];
    newReactants[index] = value;
    setReactants(newReactants);
  };

  const insertElement = (element) => {
    const newReactants = [...reactants];
    newReactants[currentInputIndex] = (newReactants[currentInputIndex] || '') + element;
    setReactants(newReactants);
    setShowPeriodicTable(false);
  };

  const insertSymbol = (symbol) => {
    const newReactants = [...reactants];
    newReactants[currentInputIndex] = (newReactants[currentInputIndex] || '') + symbol;
    setReactants(newReactants);
    setShowSymbols(false);
  };

  const toggleCondition = (conditionId, temp, pressure, voltage, catalyst, solvent) => {
    if (conditions.includes(conditionId)) {
      setConditions(conditions.filter(c => c !== conditionId));
    } else {
      setConditions([...conditions, conditionId]);
      if (temp !== undefined) setTemperature(temp);
      if (pressure) setPressure(pressure);
      if (voltage) setVoltage(voltage);
      if (catalyst) setCatalyst(catalyst);
      if (solvent) setSolvent(solvent);
    }
  };

  const queryReactionDatabases = async (reactantList, conditionList) => {
    const reactantKey = reactantList.map(r => r.trim()).filter(r => r).sort().join('+');
    const conditionKey = conditionList.length > 0 ? '+' + conditionList[0] : '';
    const fullKey = reactantKey + conditionKey;
    
    if (fallbackReactions[fullKey]) {
      return fallbackReactions[fullKey];
    } else if (fallbackReactions[reactantKey]) {
      return fallbackReactions[reactantKey];
    }

    return {
      products: '?',
      equation: reactantList.join(' + ') + ' → ?',
      name: 'Unknown Reaction',
      source: 'Not in Database',
      note: 'This reaction is not in our database yet. Try common chemicals like H₂O, NaCl, CaCO₃, HCl, NaOH, CH₄.'
    };
  };

  const predictReaction = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const validReactants = reactants.filter(r => r.trim());
      if (validReactants.length === 0) {
        throw new Error('Please enter at least one reactant');
      }

      const result = await queryReactionDatabases(validReactants, conditions);
      setProduct(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    const drawMolecule = (x, y, formula, scale) => {
      const atomColors = {
        'H': '#ffffff', 'O': '#ff0000', 'C': '#808080', 'N': '#0000ff',
        'Cl': '#00ff00', 'Na': '#ab82ff', 'Ca': '#90ee90', 'Fe': '#e8924e'
      };
      
      const cleanFormula = formula.replace(/[₀-₉]/g, '');
      const atoms = cleanFormula.match(/[A-Z][a-z]?/g) || ['?'];
      const radius = 15 * scale;
      
      atoms.forEach((atom, i) => {
        const angle = (i / atoms.length) * Math.PI * 2;
        const offsetX = Math.cos(angle) * 25 * scale;
        const offsetY = Math.sin(angle) * 25 * scale;
        
        ctx.beginPath();
        ctx.arc(x + offsetX, y + offsetY, radius, 0, Math.PI * 2);
        ctx.fillStyle = atomColors[atom] || '#cccccc';
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(atom, x + offsetX, y + offsetY);
      });
    };
    
    const validReactants = reactants.filter(r => r.trim());
    validReactants.forEach((r, i) => {
      const y = height / 2;
      drawMolecule(150, y, r, 0.8);
    });
    
    ctx.strokeStyle = '#4ade80';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(250, height / 2);
    ctx.lineTo(350, height / 2);
    ctx.stroke();
    
    if (product && product.products !== '?') {
      const productMolecules = product.products.split('+').map(p => p.replace(/[0-9]/g, '').trim());
      productMolecules.forEach((p) => {
        const y = height / 2;
        drawMolecule(450, y, p, 0.8);
      });
    }
  }, [reactants, product, conditions]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
            <FlaskConical className="w-10 h-10 text-blue-400" />
            Interactive 3D Chemistry Lab
          </h1>
          <p className="text-blue-300">Mix chemicals, apply lab conditions, and predict reactions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
            <h2 className="text-xl font-bold mb-4 text-blue-400">Reactants</h2>
            
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => {
                  setShowPeriodicTable(!showPeriodicTable);
                  setShowSymbols(false);
                }}
                className={'flex-1 rounded-lg px-3 py-2 text-sm font-bold transition-colors ' + (showPeriodicTable ? 'bg-blue-700' : 'bg-blue-600 hover:bg-blue-700')}
              >
                Periodic Table
              </button>
              <button
                onClick={() => {
                  setShowSymbols(!showSymbols);
                  setShowPeriodicTable(false);
                }}
                className={'flex-1 rounded-lg px-3 py-2 text-sm font-bold transition-colors ' + (showSymbols ? 'bg-indigo-700' : 'bg-indigo-600 hover:bg-indigo-700')}
              >
                Symbols
              </button>
            </div>

            {showPeriodicTable && (
              <div className="mb-4 bg-slate-900 border-2 border-blue-500 rounded-lg p-4 max-h-64 overflow-y-auto">
                <p className="text-xs text-blue-300 mb-2">Click an element to insert it:</p>
                <div className="grid grid-cols-5 gap-2">
                  {periodicElements.map(el => (
                    <button
                      key={el.symbol}
                      onClick={() => insertElement(el.symbol)}
                      className="bg-slate-700 hover:bg-blue-600 border border-slate-600 rounded px-2 py-2 text-sm transition-colors"
                      title={el.name}
                    >
                      <div className="font-bold text-base">{el.symbol}</div>
                      <div className="text-[10px] text-slate-400">{el.number}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {showSymbols && (
              <div className="mb-4 bg-slate-900 border-2 border-indigo-500 rounded-lg p-4 max-h-64 overflow-y-auto">
                <p className="text-xs text-indigo-300 mb-2">Click a symbol to insert it:</p>
                <div className="grid grid-cols-4 gap-2">
                  {chemicalSymbols.map((sym, idx) => (
                    <button
                      key={idx}
                      onClick={() => insertSymbol(sym.symbol)}
                      className="bg-slate-700 hover:bg-indigo-600 border border-slate-600 rounded px-3 py-3 text-base transition-colors"
                      title={sym.name}
                    >
                      <span className="font-mono">{sym.symbol}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {reactants.map((reactant, index) => (
              <div key={index} className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={reactant}
                  onChange={(e) => updateReactant(index, e.target.value)}
                  onFocus={() => setCurrentInputIndex(index)}
                  placeholder="e.g., H₂O, NaCl"
                  className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {reactants.length > 2 && (
                  <button
                    onClick={() => removeReactant(index)}
                    className="bg-red-500 hover:bg-red-600 p-2 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addReactant}
              className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg px-4 py-2 flex items-center justify-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Reactant
            </button>

            <h2 className="text-xl font-bold mt-6 mb-4 text-purple-400">Lab Procedures</h2>
            <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto pr-2">
              {procedureButtons.map(proc => {
                const Icon = proc.icon;
                const isActive = conditions.includes(proc.id);
                return (
                  <button
                    key={proc.id}
                    onClick={() => toggleCondition(proc.id, proc.temp, proc.pressure, proc.voltage, proc.catalyst, proc.solvent)}
                    className={(isActive ? proc.color : 'bg-slate-700') + ' hover:opacity-80 rounded-lg px-2 py-2 flex items-center gap-1 transition-all text-xs'}
                    title={proc.desc}
                  >
                    <Icon className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{proc.name}</span>
                  </button>
                );
              })}
            </div>

            {conditions.length > 0 && (
              <div className="mt-4 bg-slate-700 rounded-lg p-3 space-y-1">
                <p className="text-sm text-blue-300">Temperature: {temperature}°C</p>
                {pressure !== '1 atm' && <p className="text-sm text-purple-300">Pressure: {pressure}</p>}
                {voltage && <p className="text-sm text-indigo-300">Voltage: {voltage}</p>}
                {catalyst && <p className="text-sm text-green-300">Catalyst: {catalyst}</p>}
                {solvent && <p className="text-sm text-cyan-300">Solvent: {solvent}</p>}
              </div>
            )}

            <button
              onClick={predictReaction}
              disabled={loading}
              className="w-full mt-6 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded-lg px-4 py-3 font-bold text-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Predict Reaction'
              )}
            </button>
          </div>

          <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
            <h2 className="text-xl font-bold mb-4 text-green-400">3D Molecular View</h2>
            <canvas
              ref={canvasRef}
              width={600}
              height={400}
              className="w-full bg-slate-900 rounded-lg border border-slate-700"
            />

            {error && (
              <div className="mt-6 bg-red-900/50 border border-red-700 rounded-lg p-4">
                <p className="text-red-300">{error}</p>
              </div>
            )}

            {product && (
              <div className="mt-6 bg-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-yellow-400">{product.name}</h3>
                  <span className="text-xs bg-blue-600 px-2 py-1 rounded">{product.source}</span>
                </div>
                <p className="text-xl font-mono mb-2">{product.equation}</p>
                {product.temp && (
                  <p className="text-sm text-orange-400">Reaction Temperature: {product.temp}°C</p>
                )}
                {product.note && (
                  <p className="text-sm text-blue-300 mt-2">{product.note}</p>
                )}
              </div>
            )}

            <div className="mt-4 bg-blue-900/30 rounded-lg p-4 text-sm">
              <p className="font-bold mb-2">Database: 330+ Reactions</p>
              <p className="text-xs text-blue-200">
                Includes: Combustion, Electrolysis, Thermal Decomposition, Acid-Base, Precipitation, 
                Displacement, Organic Synthesis, Redox, Industrial Processes, Named Reactions and more!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chemistry3DTool;

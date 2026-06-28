import React, { useState } from 'react';
import { Map, Radio, MapPin, Navigation } from 'lucide-react';

export default function BomberoApp() {
  const [mode, setMode] = useState('map');
  const [distance, setDistance] = useState(50);
  
  const radarStyle = distance <= 15 ? 'text-orange-500 animate-ping' : 'text-red-500';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4">
      <div className="max-w-md mx-auto bg-slate-900 rounded-xl overflow-hidden border border-slate-700">
        <div className="flex border-b border-slate-700">
          <button onClick={() => setMode('map')} className="flex-1 py-3 text-sm font-bold">MAPA</button>
          <button onClick={() => setMode('radar')} className="flex-1 py-3 text-sm font-bold">RADAR</button>
        </div>
        
        {mode === 'map' ? (
          <div className="p-6 text-center">
            <MapPin size={48} className="mx-auto text-red-500 mb-4" />
            <h2 className="text-lg font-bold">OBJETIVO: Palo Negro</h2>
            <p className="text-slate-400 text-sm">Coordenadas: 10.16° N, 67.57° W</p>
          </div>
        ) : (
          <div className="p-6 text-center">
            <div className={`text-6xl font-black mb-4 ${radarStyle}`}>{distance}m</div>
            <button 
              onClick={() => setDistance(prev => Math.max(0, prev - 5))}
              className="bg-blue-600 w-full py-3 rounded-lg font-bold"
            >
              AVANZAR HACIA SEÑAL
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
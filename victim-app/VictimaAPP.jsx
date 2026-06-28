import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, MapPin, MessageSquare, Volume2, XOctagon, ShieldAlert, BatteryLow } from 'lucide-react';

export default function VictimaApp() {
  const [estado, setEstado] = useState('inactivo'); 
  const [progreso, setProgreso] = useState([]);
  const [faseBaliza, setFaseBaliza] = useState('sonido');

  const audioCtxRef = useRef(null);
  const oscillatorRef = useRef(null);
  const gainNodeRef = useRef(null);

  useEffect(() => {
    if (estado === 'activando') {
      setProgreso([]);
      const pasos = [
        { msg: "Obteniendo ubicación GPS exacta...", delay: 500 },
        { msg: "Ubicación fijada: 10.16° N, 67.57° W", delay: 1500 },
        { msg: "Enviando SMS a contactos...", delay: 2500 },
        { msg: "Iniciando Baliza Acústica (3kHz)...", delay: 4500 }
      ];
      pasos.forEach((paso, index) => {
        setTimeout(() => {
          setProgreso(prev => [...prev, paso.msg]);
          if (index === pasos.length - 1) setTimeout(() => setEstado('activo'), 1000);
        }, paso.delay);
      });
    }
  }, [estado]);

  useEffect(() => {
    let beepInterval;
    if (estado === 'activo' && faseBaliza === 'sonido' && audioCtxRef.current && gainNodeRef.current) {
      let isBeeping = true;
      gainNodeRef.current.gain.setTargetAtTime(0.1, audioCtxRef.current.currentTime, 0.05);
      beepInterval = setInterval(() => {
        if (!audioCtxRef.current || !gainNodeRef.current) return;
        if (isBeeping) {
          gainNodeRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.05);
          isBeeping = false;
        } else {
          gainNodeRef.current.gain.setTargetAtTime(0.1, audioCtxRef.current.currentTime, 0.05);
          isBeeping = true;
        }
      }, 500);
    } else if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.05);
    }
    return () => clearInterval(beepInterval);
  }, [estado, faseBaliza]);

  const inicializarAudio = () => {
    if (!audioCtxRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioContext();
      gainNodeRef.current = audioCtxRef.current.createGain();
      gainNodeRef.current.gain.value = 0;
      gainNodeRef.current.connect(audioCtxRef.current.destination);
      oscillatorRef.current = audioCtxRef.current.createOscillator();
      oscillatorRef.current.type = 'sine';
      oscillatorRef.current.frequency.value = 3000;
      oscillatorRef.current.connect(gainNodeRef.current);
      oscillatorRef.current.start();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-sm bg-slate-900 rounded-3xl p-6 border border-slate-700 shadow-2xl text-center">
        <h1 className="text-xl font-bold mb-8 text-red-500">RESCATE VÍCTIMA</h1>
        {estado === 'inactivo' && (
          <button onClick={() => { inicializarAudio(); setEstado('activando'); }} className="w-48 h-48 bg-red-600 rounded-full hover:scale-105 transition-all text-white font-black text-4xl shadow-[0_0_30px_rgba(220,38,38,0.6)]">SOS</button>
        )}
        {estado === 'activo' && <div className="text-green-500 font-bold animate-pulse">EMITIENDO SEÑAL 3kHz...</div>}
      </div>
    </div>
  );
}
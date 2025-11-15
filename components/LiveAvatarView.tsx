import React, { useState, useRef, useCallback, useEffect } from 'react';
import { SYSTEM_PROMPT, IMAGES, displaySticker, STICKERS } from '../constants';
import { createBlob, decode, decodeAudioData } from '../utils/audio';
import { MicrophoneIcon, StopIcon } from './Icons';
import { useAuth } from '../contexts/AuthContext';

type AvatarState = 'idle' | 'speaking';

export const LiveAvatarView: React.FC = () => {
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [avatarState, setAvatarState] = useState<AvatarState>('idle');
    const [transcript, setTranscript] = useState('');
    const [sticker, setSticker] = useState<string | null>(null);

    const sessionPromiseRef = useRef<any | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const speakingTimeoutRef = useRef<number | null>(null);
    const stickerTimeoutRef = useRef<number | null>(null);
    const ai = useRef<any | null>(null);
    const { user, isPremium, subscribe } = useAuth();

    // Refs for the audio visualizer
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animationFrameIdRef = useRef<number | null>(null);
    
    // Do not initialize any client-side API keys here. Live sessions should be
    // proxied via the server in production. For now, we provide a local
    // simulated fallback so the UI works without server-side Gemini.
    useEffect(() => {
        return () => {
            // Cleanup on unmount
            try {
                sessionPromiseRef.current?.then?.((s: any) => s.close?.());
            } catch (e) {}
            if (speakingTimeoutRef.current) clearTimeout(speakingTimeoutRef.current);
            if (stickerTimeoutRef.current) clearTimeout(stickerTimeoutRef.current);
            if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
        };
    }, []);

    // Set canvas dimensions on mount, accounting for device pixel ratio for sharpness
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const { width, height } = canvas.getBoundingClientRect();
            canvas.width = width * window.devicePixelRatio;
            canvas.height = height * window.devicePixelRatio;
        }
    }, []);

    const stopVisualizer = useCallback(() => {
        if (animationFrameIdRef.current) {
            cancelAnimationFrame(animationFrameIdRef.current);
            animationFrameIdRef.current = null;
        }
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx?.clearRect(0, 0, canvas.width, canvas.height);
        }
    }, []);

    const drawVisualizer = useCallback(() => {
        if (!analyserRef.current || !canvasRef.current) return;

        const analyser = analyserRef.current;
        const canvas = canvasRef.current;
        const canvasCtx = canvas.getContext('2d');
        if (!canvasCtx) return;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            animationFrameIdRef.current = requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);
            
            canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
            canvasCtx.save();
            canvasCtx.scale(window.devicePixelRatio, window.devicePixelRatio);


            const { width, height } = canvas.getBoundingClientRect();
            const centerX = width / 2;
            const centerY = height / 2;
            const radius = Math.min(centerX, centerY) * 0.85; 
            const barWidth = 3;
            const numBars = bufferLength * 0.7; 
            const angleStep = (2 * Math.PI) / numBars;
            
            for (let i = 0; i < numBars; i++) {
                const barHeight = Math.pow(dataArray[i] / 255, 2.5) * 80; 
                if (barHeight < 2) continue;

                const angle = i * angleStep - Math.PI / 2;
                
                const x1 = centerX + Math.cos(angle) * radius;
                const y1 = centerY + Math.sin(angle) * radius;
                const x2 = centerX + Math.cos(angle) * (radius + barHeight);
                const y2 = centerY + Math.sin(angle) * (radius + barHeight);

                canvasCtx.beginPath();
                canvasCtx.moveTo(x1, y1);
                canvasCtx.lineTo(x2, y2);
                canvasCtx.strokeStyle = `rgba(56, 189, 248, ${Math.max(0.2, dataArray[i] / 255)})`;
                canvasCtx.lineWidth = barWidth;
                canvasCtx.lineCap = 'round';
                canvasCtx.stroke();
            }
            canvasCtx.restore();
        };
        draw();
    }, []);

    const handleToggleSession = useCallback(async () => {
        // If the user isn't premium, trigger subscribe flow.
        if (!isPremium) {
            if (confirm('Live Avatar is a premium feature. Go to checkout?')) {
                subscribe();
            }
            return;
        }

        if (isSessionActive) {
            setIsSessionActive(false);
            setAvatarState('idle');
            setTranscript('');
            try { mediaStreamRef.current?.getTracks().forEach(track => track.stop()); } catch(e){}
            try { scriptProcessorRef.current?.disconnect(); } catch(e){}
            try { audioContextRef.current?.close(); } catch(e){}
            sessionPromiseRef.current = null;
            if (speakingTimeoutRef.current) clearTimeout(speakingTimeoutRef.current);
            if (stickerTimeoutRef.current) clearTimeout(stickerTimeoutRef.current);
            stopVisualizer();
            return;
        }

        // Start a simulated session so the UI works without a configured Gemini key.
        setIsSessionActive(true);
        setTranscript('Connecting...');

        // small simulated delay
        setTimeout(() => {
            setTranscript('Hello! I am your Resilios avatar. This is a demo reply.');
            setAvatarState('speaking');
            // show a random sticker briefly
            const keys = Object.keys(STICKERS);
            const pick = keys[Math.floor(Math.random() * keys.length)];
            setSticker(pick);
            if (stickerTimeoutRef.current) clearTimeout(stickerTimeoutRef.current);
            stickerTimeoutRef.current = window.setTimeout(() => setSticker(null), 3500);

            // stop speaking after 3s
            if (speakingTimeoutRef.current) clearTimeout(speakingTimeoutRef.current);
            speakingTimeoutRef.current = window.setTimeout(() => {
                setAvatarState('idle');
                setTranscript('');
                setIsSessionActive(false);
            }, 3000);
        }, 700);
    }, [isSessionActive, isPremium, subscribe, stopVisualizer]);

    return (
        <div className="h-full w-full flex flex-col items-center justify-center bg-sky-100 p-4">
            <style>{`
                @keyframes subtle-breathing {
                    0%, 100% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.02);
                    }
                }
            `}</style>
            <div className={`relative w-full max-w-sm aspect-square mb-6 transition-transform duration-500 ease-in-out ${avatarState === 'speaking' ? 'scale-105' : 'scale-100'}`}>
                 <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
                 <video
                    key="idle-video"
                    className={`w-full h-full object-cover rounded-full shadow-2xl absolute top-0 left-0 transition-opacity duration-700 ease-in-out ${avatarState === 'idle' ? 'opacity-100 [animation:subtle-breathing_5s_ease-in-out_infinite]' : 'opacity-0 pointer-events-none'}`}
                    src={IMAGES.avatarIdle}
                    autoPlay
                    loop
                    muted
                    playsInline
                />
                <video
                    key="speaking-video"
                    className={`w-full h-full object-cover rounded-full shadow-2xl absolute top-0 left-0 transition-opacity duration-700 ease-in-out ${avatarState === 'speaking' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    src={IMAGES.avatarSpeaking}
                    autoPlay
                    loop
                    muted
                    playsInline
                />
                {sticker && STICKERS[sticker] && (
                    <div className="absolute inset-0 flex items-center justify-center transition-all duration-300">
                        <img 
                            src={STICKERS[sticker]} 
                            alt={sticker} 
                            className="w-48 h-48 object-contain drop-shadow-xl"
                        />
                    </div>
                )}
            </div>
            
            <div className="h-16 text-center">
                <p className="text-slate-600 min-h-[2.5rem] px-4 py-2 bg-white/70 rounded-full transition-opacity duration-300">
                    {transcript}
                </p>
            </div>

            <button
                onClick={handleToggleSession}
                className={`mt-6 px-8 py-4 rounded-full text-white font-bold text-lg shadow-lg transition-transform transform hover:scale-105 flex items-center gap-3 ${isSessionActive ? 'bg-red-500 hover:bg-red-600' : 'bg-sky-500 hover:bg-sky-600'}`}
                aria-label={isSessionActive ? 'Stop Conversation' : 'Start Conversation'}
            >
                {isSessionActive ? <StopIcon /> : <MicrophoneIcon />}
                {isSessionActive ? 'Stop Conversation' : 'Start Conversation'}
            </button>
             <p className="text-xs text-slate-400 mt-4">
                This is a premium feature. The avatar provides a more immersive conversational experience.
            </p>
        </div>
    );
};


import React, { useState, useRef, useEffect } from 'react';
import { Message, Attachment } from '../types';
import { IMAGES, STICKERS } from '../constants';
import { fileToBase64 } from '../utils/file';
import { BrainIcon, GoogleIcon, LocationMarkerIcon, MicrophoneIcon, PaperclipIcon, SpeakerphoneIcon, StopIcon, VideoCameraIcon } from './Icons';


interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (text: string, options: {
    attachment?: Attachment,
    isSearchEnabled?: boolean,
    isDeepThinkingEnabled?: boolean,
    userLocation?: { latitude: number, longitude: number } | null
  }) => Promise<void>;
  isLoading: boolean;
  onTextToSpeech: (text: string) => void;
  isVoiceChatActive: boolean;
  toggleVoiceChat: () => void;
}

const ChatMessage: React.FC<{ message: Message; onTextToSpeech: (text: string) => void }> = ({ message, onTextToSpeech }) => {
  const isModel = message.role === 'model';
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handlePlayAudio = async () => {
    setIsSpeaking(true);
    await onTextToSpeech(message.text);
    setIsSpeaking(false);
  }

  return (
    <div className={`flex items-start gap-3 my-4 ${isModel ? '' : 'flex-row-reverse'}`}>
      {isModel && (
        <img src={IMAGES.avatar} alt="Avatar" className="h-8 w-8 rounded-full" />
      )}
      <div
        className={`px-4 py-3 rounded-2xl max-w-md md:max-w-lg ${ message.isLiveTranscription ? 'opacity-70' : ''} ${
          isModel ? 'bg-slate-100 text-slate-800 rounded-tl-none' : 'bg-sky-500 text-white rounded-br-none'
        }`}
      >
        {message.sticker && STICKERS[message.sticker] && (
          <img src={STICKERS[message.sticker]} alt={message.sticker} className="w-32 h-32 object-contain mx-auto mb-2" />
        )}
        {message.attachment && message.attachment.mimeType.startsWith('image/') && (
            <img src={`data:${message.attachment.mimeType};base64,${message.attachment.data}`} alt="attachment" className="rounded-lg mb-2 max-h-48" />
        )}
         {message.attachment && message.attachment.mimeType.startsWith('video/') && (
            <div className="rounded-lg mb-2 p-3 bg-slate-500 flex items-center space-x-2">
                <VideoCameraIcon />
                <span className="text-sm text-white">Video attachment ready for analysis.</span>
            </div>
        )}
        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
        {message.groundingChunks && message.groundingChunks.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-200">
                <h4 className="text-xs font-semibold mb-1">Sources:</h4>
                <div className="flex flex-col space-y-1">
                {message.groundingChunks.map((chunk, index) => {
                    const source = chunk.web || chunk.maps;
                    return source ? <a key={index} href={source.uri} target="_blank" rel="noopener noreferrer" className="text-xs text-sky-600 hover:underline truncate">{source.title}</a> : null
                })}
                </div>
            </div>
        )}
        <div className="flex justify-end items-center mt-2">
            {isModel && !message.isLiveTranscription && (
                <button onClick={handlePlayAudio} disabled={isSpeaking} className="text-slate-400 hover:text-sky-500 disabled:text-slate-300 mr-2">
                    {isSpeaking ? <div className="w-4 h-4 border-2 border-sky-400 border-t-transparent rounded-full animate-spin"></div> : <SpeakerphoneIcon />}
                </button>
            )}
            <p className="text-xs opacity-60">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
        </div>
      </div>
    </div>
  );
};

const ToolbarToggle: React.FC<{
    isActive: boolean;
    onClick: () => void;
    label: string;
    children: React.ReactNode;
}> = ({ isActive, onClick, label, children }) => (
    <button onClick={onClick} className={`flex items-center space-x-1.5 px-2 py-1 text-xs rounded-full transition-colors ${isActive ? 'bg-sky-100 text-sky-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`} aria-label={label}>
        {children}
        <span>{label}</span>
    </button>
);


export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSendMessage, isLoading, onTextToSpeech, isVoiceChatActive, toggleVoiceChat }) => {
  const [input, setInput] = useState('');
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [isSearchEnabled, setIsSearchEnabled] = useState(false);
  const [isDeepThinkingEnabled, setIsDeepThinkingEnabled] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number, longitude: number } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {
        const base64Data = await fileToBase64(file);
        setAttachment({ data: base64Data, mimeType: file.type });
    }
    if(fileInputRef.current) fileInputRef.current.value = "";
  };


  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((input.trim() || attachment) && !isLoading) {
      await onSendMessage(input.trim(), { attachment, isSearchEnabled, isDeepThinkingEnabled, userLocation });
      setInput('');
      setAttachment(null);
    }
  };

  const handleGetLocation = () => {
    if (userLocation) {
        setUserLocation(null);
        return;
    }
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            setUserLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            });
        }, (error) => {
            console.error("Geolocation error:", error);
            alert("Could not get location. Please enable location services in your browser.");
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4">
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} onTextToSpeech={onTextToSpeech} />
        ))}
         {isLoading && !messages[messages.length -1]?.isLiveTranscription && (
            <div className="flex items-start gap-3 my-4">
                <img src={IMAGES.avatar} alt="Avatar" className="h-8 w-8 rounded-full" />
                <div className="px-4 py-3 rounded-2xl bg-slate-100 rounded-tl-none">
                    <div className="flex items-center justify-center space-x-1">
                        <div className="w-2 h-2 bg-sky-300 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-sky-300 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-sky-300 rounded-full animate-pulse"></div>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-white border-t border-slate-200">
        {attachment && (
            <div className="mb-2 p-2 bg-slate-100 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {attachment.mimeType.startsWith('image/') ? (
                        <img src={`data:${attachment.mimeType};base64,${attachment.data}`} alt="preview" className="h-10 w-10 rounded object-cover" />
                    ) : (
                        <div className="h-10 w-10 rounded bg-slate-400 flex items-center justify-center">
                            <VideoCameraIcon className="text-white"/>
                        </div>
                    )}
                    <span className="text-sm text-slate-600">{attachment.mimeType.startsWith('image/') ? 'Image attached' : 'Video attached'}</span>
                </div>
                <button onClick={() => setAttachment(null)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>
        )}
        <form onSubmit={handleSend} className="flex items-center space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isVoiceChatActive ? "Listening..." : "Type your message..."}
            className="flex-1 p-3 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
            disabled={isLoading || isVoiceChatActive}
          />
           <button type="button" onClick={() => fileInputRef.current?.click()} className="p-3 text-slate-500 hover:text-sky-600 transition" aria-label="Attach file">
                <PaperclipIcon />
            </button>
             <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,video/*" />
          <button
            type="submit"
            disabled={isLoading || isVoiceChatActive || (!input.trim() && !attachment)}
            className="p-3 bg-sky-500 text-white rounded-full disabled:bg-slate-300 hover:bg-sky-600 transition"
             aria-label="Send message"
          >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </form>
         <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
               <ToolbarToggle isActive={isSearchEnabled} onClick={() => setIsSearchEnabled(p => !p)} label="Web Search"><GoogleIcon/></ToolbarToggle>
               <ToolbarToggle isActive={!!userLocation} onClick={handleGetLocation} label="Location"><LocationMarkerIcon/></ToolbarToggle>
               <ToolbarToggle isActive={isDeepThinkingEnabled} onClick={() => setIsDeepThinkingEnabled(p => !p)} label="Deeper Thinking"><BrainIcon/></ToolbarToggle>
            </div>
            <button
                type="button"
                onClick={toggleVoiceChat}
                className={`p-2 rounded-full transition-colors ${isVoiceChatActive ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
                aria-label={isVoiceChatActive ? 'Stop voice chat' : 'Start voice chat'}
            >
                {isVoiceChatActive ? <StopIcon/> : <MicrophoneIcon />}
            </button>
        </div>
      </div>
    </div>
  );
};

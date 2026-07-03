import { useState, useRef } from 'react'
import Cover from './components/Cover'
import MainPage from './components/MainPage'
import './App.css'
import bgMusic from './assets/Careless Whisper.m4a'

function App() {
  const [isCoverOpen, setIsCoverOpen] = useState(true)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  // Ref for audio element so it persists and doesn't get recreated on re-renders
  const audioRef = useRef(new Audio(bgMusic))

  const handleOpenInvitation = () => {
    setIsFadingOut(true);

    // Play audio, loop it
    audioRef.current.loop = true;

    // Set detik awal audio diputar (contoh: mulai dari detik ke-30)
    audioRef.current.currentTime = 27.5;

    audioRef.current.play().catch(e => console.error("Audio playback failed:", e));

    setTimeout(() => {
      setIsCoverOpen(false);
    }, 1000); // Wait for fade-out animation
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }

  return (
    <div className="app-container">
      {isCoverOpen ? (
        <Cover onOpen={handleOpenInvitation} isFadingOut={isFadingOut} />
      ) : (
        <MainPage isMuted={isMuted} toggleMute={toggleMute} />
      )}
    </div>
  )
}

export default App

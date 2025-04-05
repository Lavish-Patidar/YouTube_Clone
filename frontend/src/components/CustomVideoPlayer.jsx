// frontend/src/components/CustomVideoPlayer.jsx
import React, { useRef, useState, useEffect } from "react";
import {
  FaPlay,
  FaPause,
  FaExpand,
  FaCompress,
  FaVolumeUp,
  FaVolumeMute,
} from "react-icons/fa";
import Replay10Icon from "@mui/icons-material/Replay10";
import Forward10Icon from "@mui/icons-material/Forward10";
import FastForwardIcon from "@mui/icons-material/FastForward";

const CustomYouTubePlayer = ({ src }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [skipText, setSkipText] = useState("");
  const [isSpeedBoosted, setIsSpeedBoosted] = useState(false);

  // Autoplay video on mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  }, []);

  // Toggle Play/Pause
  const togglePlayPause = () => {
    if (isPlaying) videoRef.current.pause();
    else videoRef.current.play();
    setIsPlaying(!isPlaying);
  };

  // Handle Mute/Unmute
  const toggleMute = () => {
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Volume Change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  // Update current time
  const handleTimeUpdate = () => setCurrentTime(videoRef.current.currentTime);
  const handleLoadedMetadata = () => setDuration(videoRef.current.duration);

  // Seek video
  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Skip Forward/Backward
  const skip = (seconds) => {
    videoRef.current.currentTime += seconds;
    setSkipText(`${seconds > 0 ? "+10" : "-10"}`);
    setTimeout(() => setSkipText(""), 1000);
  };

  // Fullscreen Toggle
  const toggleFullscreen = () => {
    if (!isFullscreen) videoRef.current.requestFullscreen?.();
    else document.exitFullscreen?.();
    setIsFullscreen(!isFullscreen);
  };

  // Boost Speed on Hold
  const handleMouseDown = () => {
    videoRef.current.playbackRate = 2.0;
    setIsSpeedBoosted(true);
  };

  const handleMouseUp = () => {
    videoRef.current.playbackRate = 1.0;
    setIsSpeedBoosted(false);
  };

  // Format Time Helper
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div
      className="relative w-full max-w-4xl mx-auto bg-black rounded-lg overflow-hidden"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={src}
        autoPlay
        className="w-full rounded-lg"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      ></video>

      {/* Skip/Speed Boost Text */}
      {(skipText || isSpeedBoosted) && (
        <div className="absolute top-1/2 left-1/2 flex items-center gap-2 text-white text-2xl font-bold transform -translate-x-1/2 -translate-y-1/2">
          {isSpeedBoosted && <FastForwardIcon fontSize="large" />}
          <span>{skipText}</span>
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-0 w-full p-3 bg-black/70 rounded-b-lg">
        <div className="flex items-center justify-between gap-4">
          {/* Play/Pause */}
          <button onClick={togglePlayPause} className="text-white">
            {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
          </button>

          {/* Skip Backward */}
          <button onClick={() => skip(-10)} className="text-white">
            <Replay10Icon fontSize="medium" />
          </button>

          {/* Skip Forward */}
          <button onClick={() => skip(10)} className="text-white">
            <Forward10Icon fontSize="medium" />
          </button>

          {/* Progress Bar */}
          <div className="flex items-center gap-2 flex-grow">
            <span className="text-white text-sm">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="flex-grow h-1 rounded-lg accent-red-500"
            />
            <span className="text-white text-sm">{formatTime(duration)}</span>
          </div>

          {/* Volume */}
          <div className="flex items-center">
            <button onClick={toggleMute} className="text-white mr-2">
              {isMuted ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="w-24 h-1 rounded-lg accent-red-500"
            />
          </div>

          {/* Fullscreen */}
          <button onClick={toggleFullscreen} className="text-white">
            {isFullscreen ? <FaCompress size={20} /> : <FaExpand size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomYouTubePlayer;

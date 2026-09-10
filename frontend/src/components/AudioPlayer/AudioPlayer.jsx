import { useRef, useEffect } from "react";

function AudioPlayer({
    audio,
    currentTime,
    onTimeUpdate,
    onAudioReady,
}) {
    const audioRef = useRef(null);

    useEffect(() => {
        if (audioRef.current) {
            onAudioReady(audioRef.current);
        }
    }, [onAudioReady]);

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            onTimeUpdate(
                audioRef.current.currentTime
            );
        }
    };

    return (
        <div className="audio-player">
            <div className="audio-player-info">
                <span className="audio-player-label">
                    SELECTED SIGNAL
                </span>

                <h3>{audio.name}</h3>
            </div>

            <audio
                ref={audioRef}
                controls
                src={audio.src}
                className="audio-controls"
                onTimeUpdate={handleTimeUpdate}
            />
        </div>
    );
}

export default AudioPlayer;
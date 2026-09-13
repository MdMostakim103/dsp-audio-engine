import { useRef, useState } from "react";
import { processAudio  } from "../../services/api";

import UploadBox from "./UploadBox";
import DefaultAudioList from "./DefaultAudioList";

import AudioPlayer from "../AudioPlayer/AudioPlayer";
import Waveform from "../Visualizations/Waveform";
import ProcessedWaveform from "../Visualizations/ProcessedWaveform";

function AudioInput() {
    const [selectedAudio, setSelectedAudio] = useState(null);
    const [currentTime, setCurrentTime] = useState(0);

    const [processing, setProcessing] = useState(false);
    const [processedAudio, setProcessedAudio] = useState(null);
    const [processedCurrentTime, setProcessedCurrentTime] = useState(0);
    const [error, setError] = useState("");

    const audioElementRef = useRef(null);
    const processedAudioElementRef = useRef(null);

    const [selectedEffect, setSelectedEffect] = useState("amplify");

    const handleAudioReady = (audioElement) => {
        audioElementRef.current = audioElement;
    };

    const effectNames = {
        amplify: "Amplified",
        reverb: "Reverb",
        echo: "Echo",
        noise: "Noise Reduced",
        equalizer: "Equalized",
    };

    const handleSeek = (time) => {
        if (audioElementRef.current) {
            audioElementRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };
    const handleProcessedSeek = (time) => {
        if (processedAudioElementRef.current){
            processedAudioElementRef.current.currentTime = time;
            setProcessedCurrentTime(time);
        }
    };


    const handleProcess = async () => {
        if (!selectedAudio?.file) {
            setError("Please upload a WAV file first.");
            return;
        }

        try {
            setProcessing(true);
            setError("");

            const result = await processAudio(
                selectedAudio.file,
                selectedEffect
            );

            console.log("Backend response:", result);

        setProcessedAudio({
            name: `${effectNames[selectedEffect]} - ${selectedAudio.name}`,
            src: result.audio_url,
            plotUrl: result.plot_url,
            effect: effectNames[selectedEffect],
            inputDuration: result.input_duration_seconds,
            processedDuration: result.processed_duration_seconds,
            status: result.status,
        });

            setProcessedCurrentTime(0);

        } catch (error) {
            console.error(error);
            setError("Could not process the audio.");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <section className="audio-lab" id="audio-lab">

            <div className="audio-lab-header">
                <p className="section-label">
                    AUDIO LAB
                </p>

                <h2>
                    BRING YOUR
                    <br />
                    <span>SIGNAL TO LIFE</span>
                </h2>

                <p>
                    Upload a WAV file or explore one of the
                    provided sample signals.
                </p>
            </div>

            <div className="audio-input-area">

                <UploadBox
                    onAudioSelect={(audio) => {
                        setCurrentTime(0);
                        setSelectedAudio(audio);
                    }}
                />

                <div className="audio-divider">
                    <span>OR</span>
                </div>

                <DefaultAudioList
                    onAudioSelect={(audio) => {
                        setCurrentTime(0);
                        setSelectedAudio(audio);
                    }}
                />

            </div>

            {selectedAudio && (
                <div className="selected-audio">

                    <AudioPlayer
                        audio={selectedAudio}
                        onTimeUpdate={setCurrentTime}
                        onAudioReady={handleAudioReady}
                    />

                    <Waveform
                        audio={selectedAudio}
                        currentTime={currentTime}
                        onSeek={handleSeek}
                    />

                    <div className="processing-controls">

                        <div className="effect-selector">

                            <label htmlFor="effect">
                                DSP EFFECT
                            </label>

                            <select
                                id="effect"
                                value={selectedEffect}
                                onChange={(event) =>
                                    setSelectedEffect(event.target.value)
                                }
                            >
                                <option value="amplify">
                                    Amplify
                                </option>

                                <option value="reverb">
                                    Reverb
                                </option>

                                <option value="echo">
                                    Echo
                                </option>

                                <option value="noise">
                                    Noise Reduction
                                </option>

                                <option value="equalizer">
                                    Equalizer
                                </option>
                            </select>

                        </div>

                        <button
                            onClick={handleProcess}
                            disabled={processing}
                            className="process-button"
                        >
                            {processing ? (
                                <>
                                    <span className="processing-spinner"></span>
                                    PROCESSING...
                                </>
                            ) : (
                                "PROCESS AUDIO"
                            )}
                        </button>

                    </div>

                </div>
            )}

            {processedAudio && (
                <div className="processed-audio">

                    <div className="processed-audio-header">
                        <span>PROCESSED SIGNAL</span>
                        <h3>{processedAudio.name}</h3>
                    </div>

                    <audio
                        ref={processedAudioElementRef}
                        controls
                        src={processedAudio.src}
                        className="audio-controls"
                        onTimeUpdate={(event) =>
                            setProcessedCurrentTime(
                                event.target.currentTime
                            )

                        }
                    />

                    <ProcessedWaveform
                        audio = {processedAudio}
                        currentTime={processedCurrentTime}
                        onSeek={handleProcessedSeek}
                    />

                    <div className="processing-result">
                        <div className="processing-result-header">
                            <span>PROCESSING RESULT</span>
                            <h3>Processing Complete</h3>
                        </div>

                        <div className="result-grid">
                            <div className="result-item">
                                <span>EFFECT</span>
                                <strong>{processedAudio.effect}</strong>
                            </div>

                            <div className="result-item">
                                <span>INPUT</span>
                                <strong>{selectedAudio.name}</strong>
                            </div>

                            <div className="result-item">
                                <span>INPUT DURATION</span>
                                <strong>{processedAudio.inputDuration.toFixed(2)} s</strong>
                            </div>

                            <div className="result-item">
                                <span>PROCESSED DURATION</span>
                                <strong>{processedAudio.processedDuration.toFixed(2)} s</strong>
                            </div>

                            <div className="result-item">
                                <span>STATUS</span>
                                <strong>SUCCESS</strong>
                            </div>
                        </div>
                    </div>
                    {/* --- NEW 4-PANEL GRAPH VISUALZER --- */}
                    {processedAudio.plotUrl && (
                        <div className = "plot-container" style = {{ marginTop : "30px", textAlign : "center" }}>
                            <h3 style = {{ marginBottom : "15px"  }}>DSP Signal Analysis</h3>
                            <img 
                                src = {processedAudio.plotUrl} 
                                alt = "4-Panel DSP Graph"
                                style = {{ width : "100%", maxWidth : "900px", borderRadius : "10px", border : "1px solid #333" }}
                            />
                        </div>
                    )}

                </div>
            )}

            {error && (
                <p className="process-error">
                    {error}
                </p>
            )}

        </section>
    );
}

export default AudioInput;
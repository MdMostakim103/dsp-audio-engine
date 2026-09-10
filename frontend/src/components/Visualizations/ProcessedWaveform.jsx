import { useEffect, useRef } from "react";

function ProcessedWaveform({
    audio,
    currentTime,
    onSeek,
}) {
    const canvasRef = useRef(null);

    const waveformDataRef = useRef(null);
    const durationRef = useRef(0);

    useEffect(() => {
        if (!audio) {
            return;
        }

        const loadAudio = async () => {
            try {
                const response = await fetch(audio.src);

                const arrayBuffer =
                    await response.arrayBuffer();

                const audioContext =
                    new AudioContext();

                const audioBuffer =
                    await audioContext.decodeAudioData(
                        arrayBuffer
                    );

                waveformDataRef.current =
                    audioBuffer.getChannelData(0);

                durationRef.current =
                    audioBuffer.duration;

                await audioContext.close();

                draw();

            } catch (error) {
                console.error(
                    "Could not decode processed audio:",
                    error
                );
            }
        };

        loadAudio();

    }, [audio]);

    useEffect(() => {
        if (
            !waveformDataRef.current ||
            !durationRef.current
        ) {
            return;
        }

        draw();

    }, [currentTime]);

    const draw = () => {
        const canvas = canvasRef.current;

        if (!canvas) {
            return;
        }

        const ctx = canvas.getContext("2d");

        drawWaveform(
            waveformDataRef.current,
            ctx,
            canvas,
            currentTime,
            durationRef.current
        );
    };

    const handleCanvasClick = (event) => {
        const canvas = canvasRef.current;

        if (
            !canvas ||
            !durationRef.current
        ) {
            return;
        }

        const rect =
            canvas.getBoundingClientRect();

        const clickX =
            event.clientX - rect.left;

        const progress =
            clickX / rect.width;

        const newTime =
            progress * durationRef.current;

        onSeek(newTime);
    };

    return (
        <div className="waveform-container">

            <div className="waveform-header">
                <span>PROCESSED SIGNAL</span>

                <span>
                    {formatTime(currentTime)}
                </span>
            </div>

            <canvas
                ref={canvasRef}
                width={1000}
                height={300}
                className="waveform-canvas"
                onClick={handleCanvasClick}
            />

        </div>
    );
}

function drawWaveform(
    data,
    ctx,
    canvas,
    currentTime,
    duration
) {
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(
        0,
        0,
        width,
        height
    );

    // Center line
    ctx.beginPath();

    ctx.moveTo(
        0,
        height / 2
    );

    ctx.lineTo(
        width,
        height / 2
    );

    ctx.strokeStyle =
        "rgba(255,255,255,0.12)";

    ctx.stroke();

    // Waveform
    ctx.beginPath();

    const step =
        Math.ceil(data.length / width);

    for (
        let x = 0;
        x < width;
        x++
    ) {
        const start =
            x * step;

        let min = 1;
        let max = -1;

        for (
            let i = 0;
            i < step &&
            start + i < data.length;
            i++
        ) {
            const value =
                data[start + i];

            min = Math.min(min, value);
            max = Math.max(max, value);
        }

        const yMin =
            ((1 + min) / 2) * height;

        const yMax =
            ((1 + max) / 2) * height;

        if (x === 0) {
            ctx.moveTo(x, yMin);
        } else {
            ctx.lineTo(x, yMin);
        }

        ctx.lineTo(x, yMax);
    }

    ctx.strokeStyle =
        "#9b5cff";

    ctx.lineWidth = 1.5;

    ctx.stroke();

    // Playhead
    if (duration > 0) {
        const progress =
            currentTime / duration;

        const playheadX =
            progress * width;

        ctx.beginPath();

        ctx.moveTo(
            playheadX,
            0
        );

        ctx.lineTo(
            playheadX,
            height
        );

        ctx.strokeStyle =
            "#ffffff";

        ctx.lineWidth = 2;

        ctx.stroke();
    }
}

function formatTime(seconds) {
    const minutes =
        Math.floor(seconds / 60);

    const remainingSeconds =
        Math.floor(seconds % 60);

    return `${minutes}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;
}

export default ProcessedWaveform;
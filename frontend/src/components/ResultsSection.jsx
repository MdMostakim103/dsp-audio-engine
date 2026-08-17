export default function ResultsSection({ processedAudioURL, plotURL }) {
  // If there is no data yet, return null (draw nothing on the screen)
  if (!processedAudioURL && !plotURL) return null;

  return (
    <div className="results-section">
      <h2 className="results-title">✨ Results</h2>
      
      {processedAudioURL && (
        <div className="audio-section">
          <p className="section-label">Modified Audio Output:</p>
          <audio src={processedAudioURL} controls className="audio-player" />
        </div>
      )}

      {plotURL && (
        <div>
          <p className="section-label">Waveform Analysis:</p>
          <img src={plotURL} alt="Waveform Plot" className="plot-image" />
        </div>
      )}
    </div>
  )
}
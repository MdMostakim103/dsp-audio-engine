export default function UploadDashboard({ file, loading, originalAudioURL, effect, onEffectChange, onFileChange, onUpload }) {
  return (
    <div className="upload-dashboard">
      <input 
        type="file" 
        accept="audio/wav" 
        onChange={onFileChange} 
        className="file-input"
      />

      {/* NEW: The Dropdown Menu */}
      <div className="effect-selector" style={{ marginBottom: "1.5rem" }}>
        <label style={{ fontWeight: "bold", marginRight: "10px" }}>Choose DSP Effect:</label>
        <select 
          value={effect} 
          onChange={onEffectChange}
          style={{ padding: "8px", fontSize: "16px", borderRadius: "6px" }}
        >
          <option value="volume">Reduce Volume (50%)</option>
          <option value="reverb">Cathedral Convolution Reverb</option>
          <option value ="echo">Echo (0.5s Delay)</option>
          <option value ="noise">Remove Noise (Smoothing)</option>
        </select>
      </div>

      {originalAudioURL && (
        <div className="audio-section">
          <p className="section-label">Original Audio Input:</p>
          <audio src={originalAudioURL} controls className="audio-player" />
        </div>
      )}

      <button 
        onClick={onUpload} 
        disabled={!file || loading}
        className="process-button"
      >
        {loading ? "⚙️ Processing Math..." : "Process Audio 🚀"}
      </button>
    </div>
  )
}
import { useState } from 'react'
import './App.css'
import UploadDashboard from './components/UploadDashboard'
import ResultsSection from './components/ResultsSection'

function App() {
  const [file, setFile] = useState(null)
  const [originalAudioURL, setOriginalAudioURL] = useState(null)
  const [processedAudioURL, setProcessedAudioURL] = useState(null)
  const [plotURL, setPlotURL] = useState(null)
  const [loading, setLoading] = useState(false)
  
  // NEW: State to hold the chosen DSP effect (defaults to "volume")
  const [effect, setEffect] = useState("volume")

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setOriginalAudioURL(URL.createObjectURL(selectedFile))
      setProcessedAudioURL(null)
      setPlotURL(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return
    setLoading(true)

    const formData = new FormData()
    formData.append("file", file)
    // NEW: Send the effect choice to the Python backend!
    formData.append("effect", effect)

    try {
      const response = await fetch("http://127.0.0.1:8000/process-audio", {
        method: "POST",
        body: formData,
      })
      const data = await response.json()
      setProcessedAudioURL(data.audio_url)
      setPlotURL(data.plot_url)
    } catch (error) {
      console.error("Error:", error)
      alert("Uh oh! Could not connect to the backend.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-container">
      <h1 className="main-title">🎛️ DSP Audio Engine</h1>

      <UploadDashboard 
        file={file}
        loading={loading}
        originalAudioURL={originalAudioURL}
        effect={effect} // NEW: Pass the effect down
        onEffectChange={(e) => setEffect(e.target.value)} // NEW: Pass the update function down
        onFileChange={handleFileChange}
        onUpload={handleUpload}
      />

      <ResultsSection 
        processedAudioURL={processedAudioURL}
        plotURL={plotURL}
      />
    </div>
  )
}

export default App
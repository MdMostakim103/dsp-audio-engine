from fastapi import APIRouter, UploadFile, File, Form
from pathlib import Path
import librosa
import soundfile as sf

from dsp_core.audio_fx import reduce_volume, apply_reverb
from dsp_core.visualizer import generate_comparison_plot

router = APIRouter()

STATIC_DIR = Path("static")

@router.post("/process-audio")
async def process_audio(file: UploadFile = File(...), effect: str = Form(...)):
    
    # 1. Save to uploads/
    input_path = Path("static/uploads") / file.filename
    with open(input_path, "wb") as f:
        f.write(await file.read())

    y, sr = librosa.load(input_path, sr=None)
    
    # 2. Route the math based on the frontend selection
    if effect == "reverb":
        y_modified = apply_reverb(y, sr)
    else:
        y_modified = reduce_volume(y, 0.5)

    # 3. NEW: Add the effect name to the plot filename to bust the browser cache!
    plot_filename = f"{effect}_{file.filename}"
    generate_comparison_plot(y, y_modified, sr, plot_filename)

    # 4. Save to processed/
    output_filename = f"modified_{effect}_{file.filename}"
    output_path = Path("static/processed") / output_filename
    sf.write(output_path, y_modified, sr)

    duration = librosa.get_duration(y=y, sr=sr)

    # 5. Return the newly updated URLs sent to React
    return {
        "filename": file.filename,
        "duration_seconds": round(duration, 2),
        "status": f"Audio processed with '{effect}' and graphed successfully!",
        "plot_url": f"http://127.0.0.1:8000/static/plots/plot_{plot_filename}.png",
        "audio_url": f"http://127.0.0.1:8000/static/processed/{output_filename}"
    }
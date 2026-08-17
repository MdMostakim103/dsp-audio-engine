import numpy as np
from scipy.signal import fftconvolve

def reduce_volume(audio_array: np.ndarray, factor: float = 0.5) -> np.ndarray:
    """
    Takes a numpy array representing audio and reduces its amplitude.
    """
    # Pure DSP math
    modified_audio = audio_array * factor
    return modified_audio

def apply_reverb(y: np.ndarray, sr: int) -> np.ndarray:
    """Applies a synthetic convolution reverb to simulate a large room."""
    # 1. Create a synthetic Impulse Response (IR)
    # We simulate a 1.5-second echo in a large, empty room
    ir_length = int(sr * 1.5)
    
    # Create an exponential decay curve (sound dying out)
    decay = np.exp(-np.linspace(0, 5, ir_length))
    
    # Multiply the decay by white noise to simulate chaotic sound bouncing off walls
    ir = np.random.randn(ir_length) * decay
    
    # 2. Convolve the original audio with our synthetic room
    # We use mode='full' because the echo adds length to the end of the sound
    y_reverb = fftconvolve(y, ir, mode='full')
    
    # 3. Normalization
    # Convolution makes audio incredibly loud. We must scale it back down 
    # so the highest peak is exactly 1.0 (or -1.0) to prevent speaker distortion.
    y_reverb = y_reverb / np.max(np.abs(y_reverb))
    
    # 4. Optional: Mix the wet (reverb) and dry (original) audio together
    # We will pad the original audio with zeros so it matches the new length
    y_padded = np.pad(y, (0, len(y_reverb) - len(y)))
    
    # Mix 60% original audio and 40% reverb
    final_mix = (y_padded * 0.6) + (y_reverb * 0.4)
    
    return final_mix
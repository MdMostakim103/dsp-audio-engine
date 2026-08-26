import numpy as np
from scipy.signal import fftconvolve

def reduce_volume(audio_array: np.ndarray, factor: float = 0.5) -> np.ndarray:
    """
    Takes a numpy array representing audio and reduces its amplitude.
    """
    # Pure DSP math
    modified_audio = audio_array * factor
    return modified_audio
    #vau sujajaksdh;flj


def amplify_volume(audio_array: np.ndarray,factor: float=4.0) -> np.ndarray:
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


def apply_echo(y: np.ndarray, sr: int) -> np.ndarray:
    """
    Adds a simple echo by delaying the sound and mixing it with the original.
    """
    # 1. Figure out how many samples make up a 0.5 second delay
    delay_seconds = 0.5
    delay_samples = int(sr * delay_seconds)

    # 2. Create the delayed audio by adding silence (zeros) to the beginning
    silence = np.zeros(delay_samples)
    delayed_y = np.concatenate((silence, y))

    # 3. The delayed audio is now longer than the original.
    # Let's pad the original audio with zeros at the end so they match in length.
    original_padded = np.concatenate((y, silence))

    # 4. Mix them together. Original at 80% volume, Echo at 40% volume.
    echo_mix = (original_padded * 0.8) + (delayed_y * 0.4)

    # 5. Make sure the volume isn't too loud to prevent distortion (normalization)
    echo_mix = echo_mix / np.max(np.abs(echo_mix))

    return echo_mix


def apply_noise_reduction(y: np.ndarray, sr: int) -> np.ndarray:
    """
    Reduces static/background noise using a moving average (time-domain smoothing).
    """
    # 1. Choose how many numbers to average together at a time. 5 is a good balance: it smooths the static without muffling the real audio too much.
    window_size = 5

    # 2. Create the "smoothing brush" (the filter)
    # This creates a NumPy array that looks like this: [0.2, 0.2, 0.2, 0.2, 0.2]
    filter_window = np.ones(window_size) / window_size

    # 3. Slide the brush across the entire audio wave (Convolution)
    # The mode='same' guarantees our output is the exact same length as our input.
    smoothed_y = np.convolve(y, filter_window, mode = 'same')

    return smoothed_y


def apply_equalizer(y: np.ndarray, sr: int) -> np.ndarray:
    """
    A basic 3-band equalizer using Fast Fourier Transform (FFT).
    It boosts bass and treble, while reducing mid frequencies.
    """

    # 1. Convert the audio from the Time Domain to the Frequency Domain
    # This separates the single sound wave into all its individual pitches (like a rainbow)
    Y_freq = np.fft.rfft(y)
    freqs = np.fft.rfftfreq(len(y), 1/sr)

    # 2. Set up our volume controls (Gains) for 3 different bands
    low_gain = 2.0      # Bass frequencies (Boost 200%)
    mid_gain = 0.5      # Mid frequencies (Cut to 50%)
    high_gain = 1.5     # Treble frequencies (Boost 150%)

    # 3. Apply the changes to the specific frequency bands using NumPy
    # Lows: Anything below 250 Hz
    Y_freq[(freqs < 250)] *= low_gain

    # Mids: Anything between 250 Hz and 4000 Hz
    Y_freq[(freqs >= 250) & (freqs < 4000)] *= mid_gain

    # Highs: Anything above 4000 Hz
    Y_freq[(freqs >= 4000)] *= high_gain

    # 4. Convert the audio back to the Time Domain so we can hear it
    # n=len(y) ensures the output is the exact same length as the input
    y_eq = np.fft.irfft(Y_freq, n = len(y))

    # 5. Normalize to prevent distortion (clipping)
    y_eq = y_eq / np.max(np.abs(y_eq))

    return y_eq







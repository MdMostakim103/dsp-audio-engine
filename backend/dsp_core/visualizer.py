import matplotlib
matplotlib.use('Agg')

import matplotlib.pyplot as plt
import numpy as np
from pathlib import Path

def generate_comparison_plot(y_input: np.ndarray, y_output: np.ndarray, sr: int, filename: str, start_sample: int=None, end_sample: int=None) -> Path:

    if start_sample is not None and end_sample is not None:
        y_in = y_input[start_sample: end_sample]
        y_out = y_output[start_sample: end_sample]
    else:
        y_in = y_input
        y_out = y_output

    time_input = np.linspace(0, len(y_in)/sr, num=len(y_in))
    time_output = np.linspace(0, len(y_out)/sr, num=len(y_out))

    # Create a 2x2 grid (4 panels)
    fig, axs = plt.subplots(2, 2, figsize=(14, 8))

    # --- Row 1: Time Domain (Amplitude vs Time) ---
    axs[0, 0].plot(time_input, y_in, color='blue', alpha=0.7)
    axs[0, 0].set_title("Time Domain: Original Audio")
    axs[0, 0].set_ylabel("Amplitude")
    axs[0, 0].grid(True)

    axs[0, 1].plot(time_output, y_out, color='orange', alpha=0.7)
    axs[0, 1].set_title("Time Domain: Modified Audio")
    axs[0, 1].grid(True)

    # --- Row 2: Frequency Domain (Magnitude vs Pitch using FFT) ---
    D_in = np.abs(np.fft.rfft(y_in))
    freqs_in = np.fft.rfftfreq(len(y_in), 1/sr)
    axs[1, 0].plot(freqs_in, D_in, color='blue', alpha=0.7)
    axs[1, 0].set_title("Frequency Domain: Original Audio")
    axs[1, 0].set_ylabel("Magnitude")
    axs[1, 0].set_xlabel("Frequency (Hz)")
    axs[1, 0].set_xlim(0, 10000) # Limit to human hearing range
    axs[1, 0].grid(True)

    D_out = np.abs(np.fft.rfft(y_out))
    freqs_out = np.fft.rfftfreq(len(y_out), 1/sr)
    axs[1, 1].plot(freqs_out, D_out, color='orange', alpha=0.7)
    axs[1, 1].set_title("Frequency Domain: Modified Audio")
    axs[1, 1].set_xlabel("Frequency (Hz)")
    axs[1, 1].set_xlim(0, 10000)
    axs[1, 1].grid(True)

    plt.tight_layout()

    PLOTS_DIR = Path("static/plots")
    image_path = PLOTS_DIR / f"plot_{filename}.png"
    plt.savefig(image_path)

    plt.close(fig)

    return image_path
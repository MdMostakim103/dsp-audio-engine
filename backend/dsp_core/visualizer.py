import matplotlib
matplotlib.use('Agg')

import matplotlib.pyplot as plt
import numpy as np
from pathlib import Path

def generate_comparison_plot(y_input: np.ndarray, y_output: np.ndarray, sr: int, filename: str, start_sample: int=None, end_sample: int=None) -> Path:

    if start_sample is not None and end_sample is not None:
        y_in = y_input[start_sample: end_sample]
        y_out = y_output[start_sample: end_sample]
        time_input = np.linspace(start_sample, end_sample, num=len(y_in))
        time_output = np.linspace(start_sample, end_sample, num=len(y_out))
    else:
        y_in = y_input
        y_out = y_output
        time_input = np.linspace(0, len(y_input)/sr,num=len(y_input))
        time_output = np.linspace(0, len(y_output)/sr, num=len(y_output))
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10,6))

    ax1.plot(time_input,y_in, color='blue', alpha=0.7, marker='.', linestyle=':')
    ax1.set_title("Original Audio Input")
    ax1.set_ylabel("Amplitude")
    ax1.grid(True)

    ax2.plot(time_output, y_out, color='orange', alpha=0.7, marker='.', linestyle=':')
    ax2.set_title("Modified Audio Output")
    ax2.set_xlabel("Time (seconds)")
    ax2.set_ylabel("Amplitude")
    ax2.grid(True)


    plt.tight_layout()

    PLOTS_DIR = Path("static/plots")
    image_path = PLOTS_DIR / f"plot_{filename}.png"
    plt.savefig(image_path)

    plt.close(fig)

    return image_path
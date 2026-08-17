import numpy as np
import soundfile as sf

# Create 1 second of audio at 44,100 samples per second
sample_rate = 44100
time = np.linspace(0, 1, sample_rate)

# Math formula for a pure sound wave (Sine wave)
audio_wave = 0.5 * np.sin(2 * np.pi * 440 * time)

# Save it to your hard drive
sf.write("test_audio.wav", audio_wave, sample_rate)
print("Perfect 'A' note created!")
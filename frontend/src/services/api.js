const API_BASE_URL = "http://127.0.0.1:8000";

export async function processAudio(file, effect) {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("effect", effect);

    const response = await fetch(
        `${API_BASE_URL}/process-audio`,
        {
            method: "POST",
            body: formData,
        }
    );

    if (!response.ok) {
        throw new Error("Audio processing failed");
    }

    return await response.json();
}
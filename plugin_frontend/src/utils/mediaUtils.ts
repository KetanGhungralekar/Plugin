export function createMediaDownload(chunks: BlobPart[], mimeType: string, fileName: string): void {
    const blob = new Blob(chunks, { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style.display = 'none';
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

export async function extractAudioFromBlob(blob: Blob): Promise<AudioBuffer> {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const arrayBuffer = await blob.arrayBuffer();
    return await audioContext.decodeAudioData(arrayBuffer);
}

const SAMPLE_RATE = 44100;
const BITS_PER_SAMPLE = 16;
const CHANNELS = 2;

type WAVHeader = {
  chunkId: string;
  chunkSize: number;
  format: string;
  subchunk1Id: string;
  subchunk1Size: number;
  audioFormat: number;
  numChannels: number;
  sampleRate: number;
  byteRate: number;
  blockAlign: number;
  bitsPerSample: number;
  subchunk2Id: string;
  subchunk2Size: number;
};

function createWAVHeader(dataLength: number): WAVHeader {
  const byteRate = SAMPLE_RATE * CHANNELS * (BITS_PER_SAMPLE / 8);
  const blockAlign = CHANNELS * (BITS_PER_SAMPLE / 8);

  return {
    chunkId: 'RIFF',
    chunkSize: 36 + dataLength,
    format: 'WAVE',
    subchunk1Id: 'fmt ',
    subchunk1Size: 16,
    audioFormat: 1,
    numChannels: CHANNELS,
    sampleRate: SAMPLE_RATE,
    byteRate: byteRate,
    blockAlign: blockAlign,
    bitsPerSample: BITS_PER_SAMPLE,
    subchunk2Id: 'data',
    subchunk2Size: dataLength
  };
}

function writeString(view: DataView, offset: number, string: string): number {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
  return string.length;
}

function writeHeader(view: DataView, header: WAVHeader): number {
  let offset = 0;

  offset += writeString(view, offset, header.chunkId);
  view.setUint32(offset, header.chunkSize, true); offset += 4;
  offset += writeString(view, offset, header.format);
  offset += writeString(view, offset, header.subchunk1Id);
  view.setUint32(offset, header.subchunk1Size, true); offset += 4;
  view.setUint16(offset, header.audioFormat, true); offset += 2;
  view.setUint16(offset, header.numChannels, true); offset += 2;
  view.setUint32(offset, header.sampleRate, true); offset += 4;
  view.setUint32(offset, header.byteRate, true); offset += 4;
  view.setUint16(offset, header.blockAlign, true); offset += 2;
  view.setUint16(offset, header.bitsPerSample, true); offset += 2;
  offset += writeString(view, offset, header.subchunk2Id);
  view.setUint32(offset, header.subchunk2Size, true); offset += 4;

  return offset;
}

export async function convertToWAV(audioBuffer: AudioBuffer): Promise<Blob> {
  const numberOfChannels = audioBuffer.numberOfChannels;
  const length = audioBuffer.length;
  const dataLength = length * numberOfChannels * (BITS_PER_SAMPLE / 8);
  const header = createWAVHeader(dataLength);

  // Create buffer with space for header and data
  const buffer = new ArrayBuffer(44 + dataLength);
  const view = new DataView(buffer);

  // Write WAV header
  const headerLength = writeHeader(view, header);

  // Interleave channels and convert to 16-bit PCM
  let offset = headerLength;
  const channels: Float32Array[] = [];
  for (let i = 0; i < numberOfChannels; i++) {
    channels.push(audioBuffer.getChannelData(i));
  }

  for (let i = 0; i < length; i++) {
    for (let channel = 0; channel < numberOfChannels; channel++) {
      const sample = Math.max(-1, Math.min(1, channels[channel][i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
      offset += 2;
    }
  }

  return new Blob([buffer], { type: 'audio/wav' });
}
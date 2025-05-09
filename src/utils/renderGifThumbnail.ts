// Utilidad para renderizar el primer frame de un gif animado en un canvas
// Requiere la librería gifuct-js
import { decompressFrames, parseGIF } from 'gifuct-js';

export async function renderGifThumbnail(canvas: HTMLCanvasElement|null, gifUrl: string) {
  if (!canvas || !gifUrl) return;

  try {
    const response = await fetch(gifUrl);
    const arrayBuffer = await response.arrayBuffer();
    const gif = parseGIF(arrayBuffer);
    const frames = decompressFrames(gif, true);
    if (frames.length > 0) {
      const frame = frames[0];
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Ajusta tamaño del canvas
        canvas.width = frame.dims.width;
        canvas.height = frame.dims.height;
        // Crea imagen a partir de los datos del frame
        const imageData = ctx.createImageData(frame.dims.width, frame.dims.height);
        imageData.data.set(frame.patch);
        ctx.putImageData(imageData, 0, 0);
      }
    }
  } catch (e) {
    // Si falla, borra el canvas
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
}

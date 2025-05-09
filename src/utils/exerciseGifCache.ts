// Simple cache for ExerciseDB GIFs (in-memory, will reset on reload)
const gifCache: Record<string, string> = {};

/**
 * Fetches the GIF URL for a given exercise name from ExerciseDB API, with in-memory caching.
 * @param name The exercise name (in English, as required by ExerciseDB)
 * @returns The GIF URL, or null if not found
 */
export async function fetchExerciseGif(name: string): Promise<string | null> {
  if (gifCache[name]) return gifCache[name];
  try {
    const res = await fetch(`https://exercisedb-api.vercel.app/api/v1/exercises?name=${encodeURIComponent(name)}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0 && data[0].gifUrl) {
      // Verifica que el GIF realmente existe y es accesible
      const gifUrl = data[0].gifUrl;
      try {
        const gifRes = await fetch(gifUrl, { method: 'HEAD' });
        if (gifRes.ok && gifRes.status === 200 && gifRes.headers.get('Content-Type')?.includes('image')) {
          gifCache[name] = gifUrl;
          return gifUrl;
        }
        // Si no es accesible, no guardar en caché
        return null;
      } catch {
        return null;
      }
    }
    return null;
  } catch (e) {
    return null;
  }
}

export function getCachedGif(name: string): string | undefined {
  return gifCache[name];
}

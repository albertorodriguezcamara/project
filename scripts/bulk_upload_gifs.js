// Script para descargar y subir GIFs de ejercicios a Supabase Storage
// node scripts/bulk_upload_gifs.js

const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const BUCKET = 'exercise-gifs'; // Debes crear este bucket en Supabase Storage
const TEMP_DIR = path.join(__dirname, 'temp_gifs');

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Faltan variables de entorno SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY/SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function fetchExercises() {
  const { data, error } = await supabase.from('exercises').select('id, gifUrl, supabaseGifUrl');
  if (error) throw error;
  return data.filter(e => e.gifUrl && !e.supabaseGifUrl);
}

async function downloadGif(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`No se pudo descargar ${url}`);
  const buffer = await res.buffer();
  fs.writeFileSync(dest, buffer);
}

async function uploadToSupabase(localPath, remotePath) {
  const fileBuffer = fs.readFileSync(localPath);
  const { data, error } = await supabase.storage.from(BUCKET).upload(remotePath, fileBuffer, { upsert: true, contentType: 'image/gif' });
  if (error) throw error;
  return data.path;
}

async function updateExerciseGifUrl(id, storagePath) {
  const { error } = await supabase.from('exercises').update({ supabaseGifUrl: storagePath }).eq('id', id);
  if (error) throw error;
}

(async () => {
  if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR);
  const exercises = await fetchExercises();
  console.log(`Descargando y subiendo ${exercises.length} GIFs...`);
  for (const ex of exercises) {
    try {
      const localPath = path.join(TEMP_DIR, `${ex.id}.gif`);
      await downloadGif(ex.gifUrl, localPath);
      const remotePath = `${ex.id}.gif`;
      await uploadToSupabase(localPath, remotePath);
      const publicUrl = supabase.storage.from(BUCKET).getPublicUrl(remotePath).publicUrl;
      await updateExerciseGifUrl(ex.id, publicUrl);
      console.log(`✔️ ${ex.id} subido y actualizado`);
    } catch (err) {
      console.warn(`❌ Error con ${ex.id}:`, err.message);
    }
  }
  fs.rmSync(TEMP_DIR, { recursive: true, force: true });
  console.log('¡Proceso completado!');
})();

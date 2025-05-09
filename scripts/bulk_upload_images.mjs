// Script para descargar imágenes estáticas de ExerciseDB y subirlas a Supabase Storage
// Ejecuta con: node scripts/bulk_upload_images.mjs

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = 'exercise-images'; // crea este bucket en Supabase Storage

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMP_DIR = path.join(__dirname, 'temp_images');

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Faltan variables de entorno SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function fetchExercises() {
  // Solo ejercicios con imageurl y sin supabaseimageurl
  const { data, error } = await supabase.from('exercises').select('id, imageurl, supabaseimageurl');
  if (error) throw error;
  return data.filter(e => e.imageurl && !e.supabaseimageurl);
}

async function downloadImage(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`No se pudo descargar ${url}`);
  const buffer = await res.buffer();
  fs.writeFileSync(dest, buffer);
}

async function uploadToSupabase(localPath, remotePath) {
  const fileBuffer = fs.readFileSync(localPath);
  const { data, error } = await supabase.storage.from(BUCKET).upload(remotePath, fileBuffer, { upsert: true, contentType: 'image/png' });
  if (error) throw error;
  return data.path;
}

async function updateExerciseImageUrl(id, storagePath) {
  const { error } = await supabase.from('exercises').update({ supabaseimageurl: storagePath }).eq('id', id);
  if (error) throw error;
}

(async () => {
  if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR);
  const exercises = await fetchExercises();
  console.log(`Descargando y subiendo ${exercises.length} imágenes...`);
  for (const ex of exercises) {
    try {
      const ext = path.extname(ex.imageurl) || '.png';
      const localPath = path.join(TEMP_DIR, `${ex.id}${ext}`);
      await downloadImage(ex.imageurl, localPath);
      const remotePath = `${ex.id}${ext}`;
      await uploadToSupabase(localPath, remotePath);
      const publicUrl = supabase.storage.from(BUCKET).getPublicUrl(remotePath).publicUrl;
      await updateExerciseImageUrl(ex.id, publicUrl);
      console.log(`✔️ ${ex.id} imagen subida y actualizada`);
    } catch (err) {
      console.warn(`❌ Error con ${ex.id}:`, err.message);
    }
  }
  fs.rmSync(TEMP_DIR, { recursive: true, force: true });
  console.log('¡Proceso completado!');
})().catch(err => {
  console.error('Error global:', err);
  if (err && err.message) {
    console.error('Mensaje:', err.message);
  }
  process.exit(1);
});

// Script para descargar ejercicios desde ExerciseDB y guardarlos en Supabase
// Ejecuta con: node scripts/bulk_download_exercises.mjs

import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const API_BASE = 'https://exercisedb-api.vercel.app/api/v1/exercises';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Faltan variables de entorno SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function fetchAllExercises() {
  let allExercises = [];
  let offset = 0;
  const limit = 100; // máximo permitido por la API
  let keepGoing = true;

  while (keepGoing) {
    const url = `${API_BASE}?limit=${limit}&offset=${offset}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('No se pudo descargar la lista de ejercicios');
    const json = await res.json();

    if (json.success && json.data && Array.isArray(json.data.exercises)) {
      allExercises = allExercises.concat(json.data.exercises);
      if (json.data.exercises.length < limit) {
        keepGoing = false;
      } else {
        offset += limit;
      }
    } else {
      keepGoing = false;
    }
  }
  return allExercises;
}

async function insertExercises(exercises) {
  // Puedes adaptar los campos según tu tabla
  for (const ex of exercises) {
    const insertObj = {
      id: ex.exerciseId,
      name: ex.name,
      gifurl: ex.gifUrl,
      videourl: ex.videoUrl,
      imageurl: ex.imageUrl,
      equipments: ex.equipments,
      bodyparts: ex.bodyParts,
      exercisetype: ex.exerciseType,
      targetmuscles: ex.targetMuscles,
      secondarymuscles: ex.secondaryMuscles,
      keywords: ex.keywords,
      overview: ex.overview,
      instructions: ex.instructions,
      exercisetips: ex.exerciseTips,
      variations: ex.variations,
      relatedexerciseids: ex.relatedExerciseIds
    };
    const { error } = await supabase.from('exercises').upsert(insertObj, { onConflict: 'id' });
    if (error) {
      console.error(`❌ Error insertando ejercicio ${ex.exerciseId}:`, error.message);
    } else {
      console.log(`✔️ Insertado/actualizado: ${ex.exerciseId}`);
    }
  }
}

(async () => {
  try {
    const exercises = await fetchAllExercises();
    console.log(`Total ejercicios descargados: ${exercises.length}`);
    await insertExercises(exercises);
    console.log('¡Todos los ejercicios insertados/actualizados!');
  } catch (err) {
    console.error('Error global:', err);
    if (err && err.message) {
      console.error('Mensaje:', err.message);
    }
    process.exit(1);
  }
})();

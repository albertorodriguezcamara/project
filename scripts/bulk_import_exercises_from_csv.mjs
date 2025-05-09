import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import { parse } from 'csv-parse/sync';

// Configuración Supabase
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Faltan variables de entorno SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Ruta del CSV
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const csvPath = path.join(__dirname, 'exercises.csv');

// Leer y parsear el CSV
const csvContent = fs.readFileSync(csvPath, 'utf-8');
const records = parse(csvContent, {
  columns: true,
  skip_empty_lines: true,
});

// Inserción en Supabase
(async () => {
  for (const row of records) {
    // Adapta los nombres de columna a tu tabla
    // Convierte secondaryMuscles e instructions a arrays si es necesario
    // Extraer secondaryMuscles e instructions de columnas separadas
    const secondaryMuscles = [];
    const instructions = [];
    for (let i = 0; i < 10; i++) {
      if (row[`secondaryMuscles/${i}`] && row[`secondaryMuscles/${i}`].trim() !== '') {
        secondaryMuscles.push(row[`secondaryMuscles/${i}`].trim());
      }
      if (row[`instructions/${i}`] && row[`instructions/${i}`].trim() !== '') {
        instructions.push(row[`instructions/${i}`].trim());
      }
    }

    // gifUrl directo del CSV
    let gifUrl = row.gifUrl || row.gifurl || row.image || row.imageurl || row.imageUrl || '';

    const exercise = {
      id: row.id,
      name: row.name,
      bodyPart: row.bodyPart,
      equipment: row.equipment,
      gifUrl: gifUrl, // CamelCase
      gifurl: gifUrl, // minúsculas, para compatibilidad con el frontend
      target: row.target,
      secondaryMuscles: secondaryMuscles,
      instructions: instructions,
    };


    // Inserta o actualiza (upsert) por id
    const { error } = await supabase
      .from('exercises')
      .upsert([exercise], { onConflict: 'id' });

    if (error) {
      console.error(`❌ Error con ejercicio ${exercise.id || exercise.name}:`, error.message);
    } else {
      console.log(`✔️ Ejercicio ${exercise.id || exercise.name} insertado/actualizado`);
    }
  }
  console.log('¡Importación completada!');
})();

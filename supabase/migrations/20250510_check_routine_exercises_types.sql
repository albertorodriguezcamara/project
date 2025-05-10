-- Consulta para comprobar tipos de columnas y claves en routine_exercises y exercises

-- Revisa columnas y tipos en routine_exercises
table routine_exercises; -- si tu herramienta lo soporta
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'routine_exercises'
ORDER BY ordinal_position;

-- Revisa columnas y tipos en exercises
table exercises;
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'exercises'
ORDER BY ordinal_position;

-- Revisa claves foráneas activas
SELECT
    tc.constraint_name, tc.table_name, kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
WHERE constraint_type = 'FOREIGN KEY' 
  AND (tc.table_name = 'routine_exercises' OR tc.table_name = 'exercises');

import { Mesocycle } from '../types';

export const mesocyclesData: Mesocycle[] = [
  {
    id: 1,
    name: "Reacondicionamiento",
    description: "Mesociclo inicial para acondicionar el cuerpo y prepararlo para el entrenamiento intenso.",
    completed: false,
    durationWeeks: 4,
    routines: [
      {
        id: "A",
        name: "Rutina A: Empuje",
        exercises: [1, 2, 3, 4, 5]
      },
      {
        id: "B",
        name: "Rutina B: Tracción",
        exercises: [6, 7, 8, 9, 10]
      }
    ]
  },
  {
    id: 2,
    name: "Preparación de fuerza",
    description: "Enfocado en desarrollar una base de fuerza para las fases posteriores.",
    completed: false,
    durationWeeks: 5,
    routines: [
      {
        id: "A",
        name: "Rutina A: Empuje y Pierna",
        exercises: [11, 12, 13, 14, 15]
      },
      {
        id: "B",
        name: "Rutina B: Tracción y Core",
        exercises: [16, 17, 18, 19, 20]
      }
    ]
  },
  {
    id: 3,
    name: "Especialización técnica",
    description: "Refinamiento de la técnica en los ejercicios principales.",
    completed: false,
    durationWeeks: 4,
    routines: [
      {
        id: "A",
        name: "Rutina A: Técnica de Empuje",
        exercises: [21, 22, 23, 24, 25]
      },
      {
        id: "B",
        name: "Rutina B: Técnica de Tracción",
        exercises: [26, 27, 28, 29, 30]
      }
    ]
  },
  {
    id: 4,
    name: "Fuerza 1",
    description: "Primer bloque de entrenamiento específico de fuerza.",
    completed: false,
    durationWeeks: 5,
    routines: [
      {
        id: "A",
        name: "Rutina A: Fuerza Superior",
        exercises: [31, 32, 33, 34, 35]
      },
      {
        id: "B",
        name: "Rutina B: Fuerza Inferior",
        exercises: [36, 37, 38, 39, 40]
      }
    ]
  },
  {
    id: 5,
    name: "Fuerza 2",
    description: "Segundo bloque de entrenamiento avanzado de fuerza.",
    completed: false,
    durationWeeks: 5,
    routines: [
      {
        id: "A",
        name: "Rutina A: Fuerza Compuesta",
        exercises: [41, 42, 43, 44, 45]
      },
      {
        id: "B",
        name: "Rutina B: Fuerza Aislada",
        exercises: [46, 47, 48, 49, 50]
      }
    ]
  },
  {
    id: 6,
    name: "Híbrido fuerza e hipertrofia",
    description: "Combinación de entrenamiento de fuerza y volumen para maximizar ganancias.",
    completed: false,
    durationWeeks: 6,
    routines: [
      {
        id: "A",
        name: "Rutina A: Híbrido Superior",
        exercises: [51, 52, 53, 54, 55]
      },
      {
        id: "B",
        name: "Rutina B: Híbrido Inferior",
        exercises: [56, 57, 58, 59, 60]
      }
    ]
  },
  {
    id: 7,
    name: "Hipertrofia",
    description: "Enfocado en el crecimiento muscular con alto volumen de entrenamiento.",
    completed: false,
    durationWeeks: 6,
    routines: [
      {
        id: "A",
        name: "Rutina A: Volumen Superior",
        exercises: [61, 62, 63, 64, 65]
      },
      {
        id: "B",
        name: "Rutina B: Volumen Inferior",
        exercises: [66, 67, 68, 69, 70]
      }
    ]
  },
  {
    id: 8,
    name: "Calidad muscular",
    description: "Enfocado en definición y calidad muscular para finalizar el programa.",
    completed: false,
    durationWeeks: 5,
    routines: [
      {
        id: "A",
        name: "Rutina A: Definición Total",
        exercises: [71, 72, 73, 74, 75]
      },
      {
        id: "B",
        name: "Rutina B: Refinamiento",
        exercises: [76, 77, 78, 79, 80]
      }
    ]
  }
];
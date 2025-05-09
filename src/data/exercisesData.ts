import { Exercise } from '../types';

// This is a sample of exercises - in a real app, this would be more comprehensive
export const exercisesData: Exercise[] = [
  {
    id: 1,
    name: "Press de Banca",
    description: "Ejercicio compuesto para pecho, hombros y tríceps.",
    muscleGroups: ["Pectorales", "Deltoides", "Tríceps"],
    videoUrl: "https://www.youtube.com/embed/rT7DgCr-3pg",
    imageUrl: "https://images.pexels.com/photos/4164761/pexels-photo-4164761.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    instructions: "1. Acuéstate en un banco plano con los pies apoyados en el suelo.\n2. Agarra la barra con un agarre un poco más ancho que los hombros.\n3. Baja la barra hasta tocar ligeramente el pecho.\n4. Empuja la barra hacia arriba hasta extender los brazos por completo.",
    substitutes: [2, 3]
  },
  {
    id: 2,
    name: "Press con Mancuernas",
    description: "Variante del press de banca con mancuernas para mayor rango de movimiento.",
    muscleGroups: ["Pectorales", "Deltoides", "Tríceps"],
    videoUrl: "https://www.youtube.com/embed/QsYre__-aro",
    imageUrl: "https://images.pexels.com/photos/3837757/pexels-photo-3837757.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    instructions: "1. Acuéstate en un banco plano sosteniendo mancuernas a cada lado del pecho.\n2. Presiona las mancuernas hacia arriba hasta que los brazos estén completamente extendidos.\n3. Baja las mancuernas de nuevo a los lados del pecho.",
    substitutes: [1, 3]
  },
  {
    id: 3,
    name: "Fondos en Paralelas",
    description: "Ejercicio de peso corporal para trabajar pecho, hombros y tríceps.",
    muscleGroups: ["Pectorales", "Deltoides", "Tríceps"],
    videoUrl: "https://www.youtube.com/embed/eERwCQHZqfA",
    imageUrl: "https://images.pexels.com/photos/4162583/pexels-photo-4162583.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    instructions: "1. Agárrate de las barras paralelas con los brazos extendidos, sosteniendo tu peso.\n2. Baja el cuerpo doblando los codos hasta que sientas un estiramiento en el pecho.\n3. Empuja hacia arriba hasta que los brazos estén rectos nuevamente.",
    substitutes: [1, 2]
  },
  {
    id: 4,
    name: "Elevaciones Laterales",
    description: "Ejercicio de aislamiento para los deltoides laterales.",
    muscleGroups: ["Deltoides"],
    videoUrl: "https://www.youtube.com/embed/3VcKaXpzqRo",
    imageUrl: "https://images.pexels.com/photos/6550851/pexels-photo-6550851.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    instructions: "1. De pie, sostén mancuernas a los lados.\n2. Levanta los brazos hacia los lados hasta la altura de los hombros.\n3. Baja lentamente a la posición inicial.",
    substitutes: [5]
  },
  {
    id: 5,
    name: "Press Militar",
    description: "Ejercicio compuesto para hombros y tríceps.",
    muscleGroups: ["Deltoides", "Tríceps"],
    videoUrl: "https://www.youtube.com/embed/2yjwXTZQDDI",
    imageUrl: "https://images.pexels.com/photos/6550852/pexels-photo-6550852.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    instructions: "1. Siéntate en un banco con respaldo vertical, sosteniendo una barra a nivel de los hombros.\n2. Presiona la barra hacia arriba hasta extender los brazos.\n3. Baja la barra de nuevo a la posición inicial a nivel de los hombros.",
    substitutes: [4]
  },
  {
    id: 6,
    name: "Dominadas",
    description: "Ejercicio de peso corporal para espalda y bíceps.",
    muscleGroups: ["Espalda", "Bíceps"],
    videoUrl: "https://www.youtube.com/embed/eGo4IYlbE5g",
    imageUrl: "https://images.pexels.com/photos/6456301/pexels-photo-6456301.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    instructions: "1. Agárrate de una barra con las palmas hacia afuera y las manos un poco más separadas que el ancho de los hombros.\n2. Jala tu cuerpo hacia arriba hasta que tu barbilla esté sobre la barra.\n3. Baja de forma controlada hasta extender completamente los brazos.",
    substitutes: [7]
  },
  {
    id: 7,
    name: "Jalón al Pecho",
    description: "Alternativa a las dominadas usando polea alta.",
    muscleGroups: ["Espalda", "Bíceps"],
    videoUrl: "https://www.youtube.com/embed/CAwf7n6Luuc",
    imageUrl: "https://images.pexels.com/photos/6550847/pexels-photo-6550847.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    instructions: "1. Siéntate en la máquina de jalón con los pies apoyados en el suelo.\n2. Agarra la barra con un agarre un poco más ancho que los hombros.\n3. Jala la barra hacia abajo hasta tocar la parte superior del pecho.\n4. Controla el movimiento al regresar a la posición inicial.",
    substitutes: [6]
  },
  {
    id: 8,
    name: "Remo con Barra",
    description: "Ejercicio compuesto para espalda media y bíceps.",
    muscleGroups: ["Espalda", "Bíceps", "Trapecios"],
    videoUrl: "https://www.youtube.com/embed/kBWAon7ItDw",
    imageUrl: "https://images.pexels.com/photos/6550837/pexels-photo-6550837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    instructions: "1. Inclínate hacia adelante con las rodillas ligeramente flexionadas, sosteniendo una barra con los brazos extendidos.\n2. Jala la barra hacia tu estómago, apretando los omóplatos.\n3. Baja la barra de nuevo a la posición inicial con los brazos extendidos.",
    substitutes: [9]
  },
  {
    id: 9,
    name: "Remo con Mancuerna",
    description: "Variante unilateral del remo para trabajar la espalda.",
    muscleGroups: ["Espalda", "Bíceps"],
    videoUrl: "https://www.youtube.com/embed/pYcpY20QaE8",
    imageUrl: "https://images.pexels.com/photos/6551186/pexels-photo-6551186.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    instructions: "1. Coloca una rodilla y una mano en un banco, manteniendo la espalda paralela al suelo.\n2. Con la otra mano, sostén una mancuerna con el brazo extendido.\n3. Jala la mancuerna hacia la cadera, manteniendo el codo cerca del cuerpo.\n4. Baja la mancuerna a la posición inicial.",
    substitutes: [8]
  },
  {
    id: 10,
    name: "Curl de Bíceps con Barra",
    description: "Ejercicio de aislamiento clásico para bíceps.",
    muscleGroups: ["Bíceps"],
    videoUrl: "https://www.youtube.com/embed/kwG2ipFRgfo",
    imageUrl: "https://images.pexels.com/photos/4164766/pexels-photo-4164766.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    instructions: "1. De pie, sostén una barra con un agarre a la anchura de los hombros, palmas hacia arriba.\n2. Mantén los codos junto al cuerpo y levanta la barra hacia los hombros.\n3. Baja la barra de manera controlada a la posición inicial.",
    substitutes: [11, 12]
  },
  {
    id: 11,
    name: "Sentadilla con Barra",
    description: "Ejercicio fundamental para piernas y glúteos.",
    muscleGroups: ["Cuádriceps", "Glúteos", "Isquiotibiales"],
    videoUrl: "https://www.youtube.com/embed/1oed-UmAxFs",
    imageUrl: "https://images.pexels.com/photos/6550839/pexels-photo-6550839.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    instructions: "1. Coloca una barra en los trapecios superiores, con los pies a la anchura de los hombros.\n2. Flexiona caderas y rodillas para bajar hasta que los muslos estén paralelos al suelo.\n3. Empuja a través de los talones para volver a la posición inicial.",
    substitutes: [13, 14]
  },
  {
    id: 12,
    name: "Peso Muerto",
    description: "Ejercicio compuesto para espalda baja, piernas y core.",
    muscleGroups: ["Espalda Baja", "Glúteos", "Isquiotibiales"],
    videoUrl: "https://www.youtube.com/embed/op9kVnSso6Q",
    imageUrl: "https://images.pexels.com/photos/6550843/pexels-photo-6550843.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    instructions: "1. Párate con los pies a la anchura de las caderas, con una barra sobre los pies.\n2. Inclínate hacia adelante con la espalda recta para agarrar la barra.\n3. Levántate extendiendo caderas y rodillas, manteniendo la barra cerca del cuerpo.\n4. Baja la barra de forma controlada siguiendo la misma trayectoria.",
    substitutes: [11, 15]
  }
];
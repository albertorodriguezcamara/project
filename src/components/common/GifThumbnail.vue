<template>
  <div class="w-full h-full flex items-center justify-center" :style="{minHeight: minHeight+'px'}">
    <canvas
      ref="canvasRef"
      :width="width"
      :height="height"
      class="w-full h-full object-cover rounded-lg"
      style="background:#f3f3f3;"
    ></canvas>
  </div>
</template>

<script setup lang="ts">
// Componente vacío: ya no se usa lógica aquí
// Se mantiene el archivo para evitar errores de importación
</script>

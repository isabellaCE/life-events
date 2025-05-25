<template>
  <div class="Exibicao-ContainerCronograma">
    <h1 class="Exibicao-Titulo">LifEvents</h1>

    <div class="Exibicao-CaixaCronograma">
      <h2 class="Exibicao-Subtitulo">Cronograma Inteligente</h2>
      <v-btn class="Exibicao-Etiqueta" @click="mostrarCalendario = true">{{ textoSemana }}</v-btn>
    </div>

    <div class="Exibicao-BotoesInferiores">
      <v-btn icon class="Exibicao-BotaoCircular Exibicao-Verde">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-btn icon class="Exibicao-BotaoCircular Exibicao-Vermelho">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
      <v-btn icon class="Exibicao-BotaoCircular Exibicao-Verde">
        <v-icon>mdi-check</v-icon>
      </v-btn>
    </div>
  </div>

  <CalendarioPopup v-if="mostrarCalendario" @confirmar-semana="selecionarSemana" 
  @fechar="mostrarCalendario = false" />
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import CalendarioPopup from './calendarioPopup.vue'

const route = useRoute()
const mostrarCalendario = ref(false)
const textoSemana = ref('Selecionar semana')

const { inicio, fim } = route.query

if (inicio && fim) {
  const dataInicio = new Date(inicio)
  const dataFim = new Date(fim)
  const opcoes = { day: 'numeric', month: 'long', year: 'numeric' }
  textoSemana.value = `${dataInicio.toLocaleDateString('pt-BR', opcoes)} - 
  ${dataFim.toLocaleDateString('pt-BR', opcoes)}`
}

function selecionarSemana({ inicio, fim }) {
  const opcoes = { day: 'numeric', month: 'long', year: 'numeric' }
  textoSemana.value = `${inicio.toLocaleDateString('pt-BR', opcoes)} - 
  ${fim.toLocaleDateString('pt-BR', opcoes)}`
  mostrarCalendario.value = false
}
</script>

<style>
.Exibicao-ContainerCronograma {
  position: relative;
  height: 100vh;
  width: 100vw;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.Exibicao-Titulo {
  position: absolute;
  top: 3vh;
  left: 4vw;
  font-size: 4.4vw;
  color: #00695C;
}

.Exibicao-CaixaCronograma {
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 0.8rem;
  width: 80vw;
  height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.Exibicao-Subtitulo {
  font-size: 1.4vw;
  color: #555;
  font-weight: bold;
  margin-bottom: 0.2rem;
}

.Exibicao-Etiqueta {
  background-color: #38A3A5;
  color: white;
  border-radius: 10px;
  font-size: 1.2vw;
  font-weight: bold;
}

.Exibicao-Etiqueta:hover {
  background-color: #137073;
}

.Exibicao-BotoesInferiores {
  position: absolute;
  bottom: 2vh;
  right: 3vw;
  display: flex;
  gap: 1.4rem;
}

.Exibicao-BotaoCircular {
  color: white;
  font-size: 1.2rem;
}

.Exibicao-Verde {
  background-color: #00695C;
}

.Exibicao-Verde:hover {
  background-color: #38A3A5;
}

.Exibicao-Vermelho {
  background-color: #B00020;
}

.Exibicao-Vermelho:hover {
  background-color: #740000;
}
</style>
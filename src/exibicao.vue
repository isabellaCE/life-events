<template>
  <div class="Exibicao-ContainerCronograma">
    <h1 class="Exibicao-Titulo">LifEvents</h1>

    <div class="Exibicao-CaixaCronograma">
      <h2 class="Exibicao-Subtitulo">Cronograma Inteligente</h2>
      <v-btn class="Exibicao-Etiqueta" @click="mostrarCalendario = true" :disabled="confirmarTrocaSemana">{{ textoSemana
      }}</v-btn>
      <div class="Exibicao-ListaTasks">
        <div v-for="(evento, index) in task" :key="index" :class="[
          'Exibicao-Cartao',
          index % 2 === 0 ? 'Exibicao-CartaoCor1' : 'Exibicao-CartaoCor2',
          'Exibicao-CartaoHover'
        ]" @click="editarTask(evento)">
          <div class="Exibicao-TituloTaks">{{ evento.nome }}</div>
          <div class="Exibicao-Horario">{{ evento.horarioInicio }} - {{ evento.horarioFim }}</div>
          <div class="Exibicao-Data">
            {{ new Date(evento.data).toLocaleDateString('pt-BR', {
              weekday: 'short', day: 'numeric', month: 'long',
              year: 'numeric'
            }) }}
          </div>
        </div>
      </div>
    </div>

    <div class="Exibicao-BotoesInferiores">
      <v-btn icon class="Exibicao-BotaoCircular Exibicao-Verde" @click="addTask = true">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-btn icon class="Exibicao-BotaoCircular Exibicao-Vermelho" @click="confirmarExclusao">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
      <v-btn icon class="Exibicao-BotaoCircular Exibicao-Verde">
        <v-icon>mdi-check</v-icon>
      </v-btn>
    </div>
  </div>

  <div v-if="excluirTasks" class="Exibicao-PopupOverlay" @click.self="excluirTasks = false">
    <div class="Exibicao-Popup">
      <p class="Exibicao-PopupText">Deseja excluir todos os eventos?</p>
      <div class="Exibicao-PopupBotoes">
        <v-btn class="Exibicao-BotaoS" @click="apagarTodosEventos">Sim</v-btn>
        <v-btn class="Exibicao-BotaoN" @click="excluirTasks = false">Não</v-btn>
      </div>
    </div>
  </div>

  <div v-if="confirmarTrocaSemana" class="Exibicao-PopupOverlay" @click.self="confirmarTrocaSemana = false">
    <div class="Exibicao-Popup">
      <p class="Exibicao-PopupText">Alterar a semana do seu planner irá apagar seus eventos criados.</p>
      <p class="Exibicao-PopupText">Deseja prosseguir?</p>
      <div class="Exibicao-PopupBotoes">
        <v-btn class="Exibicao-BotaoS" @click="confirmarTroca">Sim</v-btn>
        <v-btn class="Exibicao-BotaoN" @click="confirmarTrocaSemana = false">Não</v-btn>
      </div>
    </div>
  </div>

  <CalendarioPopup v-if="mostrarCalendario" @confirmar-semana="selecionarSemana" @fechar="mostrarCalendario = false" />

  <CadastroEvento :show="addTask" :task="taskSelecionada" @close="addTask = false; taskSelecionada = null" />
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import CalendarioPopup from './calendarioPopup.vue'
import CadastroEvento from './MenuAddTask.vue'

const route = useRoute()
const mostrarCalendario = ref(false)
const textoSemana = ref('Selecionar semana')
const addTask = ref(false)
const task = ref([])
const excluirTasks = ref(false)
const confirmarTrocaSemana = ref(false)
const novaSemanaTemp = ref({ inicio: null, fim: null })

const semanaSalva = JSON.parse(localStorage.getItem('semanaSelecionada'))

if (semanaSalva && semanaSalva.inicio && semanaSalva.fim) {
  const dataInicio = new Date(semanaSalva.inicio)
  const dataFim = new Date(semanaSalva.fim)
  const opcoes = { day: 'numeric', month: 'long', year: 'numeric' }
  textoSemana.value = `${dataInicio.toLocaleDateString('pt-BR', opcoes)} - ${dataFim.toLocaleDateString('pt-BR', opcoes)}`
} else {
  const { inicio, fim } = route.query
  if (inicio && fim) {
    const dataInicio = new Date(inicio)
    const dataFim = new Date(fim)
    const opcoes = { day: 'numeric', month: 'long', year: 'numeric' }
    textoSemana.value = `${dataInicio.toLocaleDateString('pt-BR', opcoes)} - ${dataFim.toLocaleDateString('pt-BR', opcoes)}`
  }
}

watchEffect(() => {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || []
  task.value = tasks.sort((a, b) => {
    const dataHoraA = new Date(`${a.data}T${a.horarioInicio}`)
    const dataHoraB = new Date(`${b.data}T${b.horarioInicio}`)
    return dataHoraA - dataHoraB
  })
})

function confirmarExclusao() {
  excluirTasks.value = true
}

function apagarTodosEventos() {
  localStorage.removeItem('tasks')
  task.value = []
  excluirTasks.value = false
}

function selecionarSemana({ inicio, fim }) {
  novaSemanaTemp.value = { inicio, fim }
  confirmarTrocaSemana.value = true
}

function confirmarTroca() {
  const { inicio, fim } = novaSemanaTemp.value
  const opcoes = { day: 'numeric', month: 'long', year: 'numeric' }

  textoSemana.value = `${inicio.toLocaleDateString('pt-BR', opcoes)} - ${fim.toLocaleDateString('pt-BR', opcoes)}`

  localStorage.setItem('semanaSelecionada', JSON.stringify({
    inicio: inicio.toISOString(),
    fim: fim.toISOString()
  }))

  localStorage.removeItem('tasks')
  task.value = []

  confirmarTrocaSemana.value = false
  mostrarCalendario.value = false
}

const taskSelecionada = ref(null)

function editarTask(evento) {
  taskSelecionada.value = evento
  addTask.value = true
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
  position: relative;
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 0.8rem;
  width: 80vw;
  height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
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

.Exibicao-ListaTasks {
  width: 100%;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  overflow-y: auto;
  flex: 1;
}

.Exibicao-Cartao {
  color: white;
  border-radius: 10px;
  padding: 0.8rem;
  margin-bottom: 0.6rem;
  width: 25%;
  text-align: start;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.Exibicao-CartaoCor1 {
  background-color: #38A3A5;
}

.Exibicao-CartaoCor1:hover {
  cursor: pointer;
}

.Exibicao-CartaoCor2 {
  background-color: #137073;
}

.Exibicao-CartaoCor2:hover {
  cursor: pointer;
}

.Exibicao-TituloTaks {
  font-weight: bold;
  font-size: 1rem;
}

.Exibicao-Horario {
  font-size: 0.9rem;
  margin-top: 0.2rem;
}

.Exibicao-Data {
  font-size: 0.8rem;
  margin-top: 0.2rem;
}

.Exibicao-PopupOverlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.Exibicao-Popup {
  background-color: #f2f2f2;
  padding: 2.5rem 3rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 90%;
}

.Exibicao-PopupText {
  margin-bottom: 1.5rem;
  font-weight: bold;
  color: #555;
}

.Exibicao-PopupBotoes {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.Exibicao-BotaoS {
  background-color: #00796B;
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

.Exibicao-BotaoN {
  background-color: #B71C1C;
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}
</style>
<template>
  <div class="SelecaoSemana-ContainerPrincipal">
    <h1 class="SelecaoSemana-Titulo">LifEvents</h1>

    <div :class="['SelecaoSemana-ConteudoCentral', { desfocado: mostrarCalendario }]">
      <p class="SelecaoSemana-Texto">Selecione a semana em que deseja organizar</p>
      <v-btn class="SelecaoSemana-Botao" @click="mostrarCalendario = true">Selecionar</v-btn>
    </div>

    <div v-if="mostrarCalendario" class="SelecaoSemana-CalendarioOverlay" @click.self="fecharCalendario">
      <div class="SelecaoSemana-CalendarioPopup">
        <div class="SelecaoSemana-Cabecalho">
          <v-btn class="SelecaoSemana-Navegar" @click="anteriorMes">←</v-btn>
          <span class="SelecaoSemana-MesAno">{{ nomeMes }} {{ anoAtual }}</span>
          <v-btn class="SelecaoSemana-Navegar" @click="proximoMes">→</v-btn>
        </div>

        <div class="SelecaoSemana-DiasSemana">
          <div v-for="(dia, i) in diasSemana" :key="i">{{ dia }}</div>
        </div>

        <div class="SelecaoSemana-DiasMes">
          <div v-for="(semana, i) in semanasMes" :key="i" class="SelecaoSemana-Semana"
            :class="{ 'SelecaoSemana-Selecionada': semanaSelecionada === i }" @click="selecionarSemana(i)">
            <div v-for="(dia, j) in semana" :key="j" class="SelecaoSemana-Dia"
              :class="{ 'SelecaoSemana-vazio': !dia.dia, 'SelecaoSemana-Fora': dia.foradoMes }">
              {{ dia.dia || '' }}
            </div>
          </div>
        </div>

        <div class="SelecaoSemana-RodapeBotao">
          <v-btn icon class="SelecaoSemana-BotaoCheck" @click="confirmarSelecao">✔</v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

function navegarParaExibicao(inicio, fim) {
  router.push({
    name: 'exibicao',
    query: {
      inicio: inicio.toISOString().split('T')[0],
      fim: fim.toISOString().split('T')[0]
    }
  })
}

const mostrarCalendario = ref(false);
const diasSemana = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const semanasMes = ref([]);
const semanaSelecionada = ref(null);
const mesAtual = ref(new Date().getMonth());
const anoAtual = ref(new Date().getFullYear());

const nomeMes = computed(() => {
  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  return meses[mesAtual.value];
});

function gerarCalendario() {
  const primeiroDia = new Date(anoAtual.value, mesAtual.value, 1);
  const ultimoDia = new Date(anoAtual.value, mesAtual.value + 1, 0);
  const totalDias = ultimoDia.getDate();
  const diaSemanaInicio = primeiroDia.getDay();
  const diaSemanaFim = ultimoDia.getDay();

  const semanas = [];
  let semana = [];

  if (diaSemanaInicio !== 0) {
    const ultimoDiaMesAnterior = new Date(anoAtual.value, mesAtual.value, 0).getDate();
    for (let i = diaSemanaInicio; i > 0; i--) {
      semana.push({
        dia: ultimoDiaMesAnterior - i + 1,
        foradoMes: true
      });
    }
  }

  for (let dia = 1; dia <= totalDias; dia++) {
    semana.push({ dia, foradoMes: false });

    if (semana.length === 7) {
      semanas.push(semana);
      semana = [];
    }
  }

  if (semana.length > 0 && diaSemanaFim !== 6) {
    let diaProximo = 1;
    while (semana.length < 7) {
      semana.push({ dia: diaProximo++, foradoMes: true });
    }
    semanas.push(semana);
  } else if (semana.length === 7) {
    semanas.push(semana);
  }

  semanasMes.value = semanas;
}

function selecionarSemana(index) {
  semanaSelecionada.value = index;
}

function confirmarSelecao() {
  if (semanaSelecionada.value !== null) {
    const semana = semanasMes.value[semanaSelecionada.value];
    const [diaInicio, diaFim] = [semana[0], semana[6]];

    const mesInicio = diaInicio.foradoMes && diaInicio.dia > 15 ? mesAtual.value - 1 : mesAtual.value;
    const mesFim = diaFim.foradoMes && diaFim.dia < 15 ? mesAtual.value + 1 : mesAtual.value;

    const dataInicio = new Date(anoAtual.value, mesInicio, diaInicio.dia);
    const dataFim = new Date(anoAtual.value, mesFim, diaFim.dia);

    router.push({
      name: 'Exibicao',
      query: {
        inicio: dataInicio.toISOString(),
        fim: dataFim.toISOString()
      }
    });
  }
}

function fecharCalendario() {
  mostrarCalendario.value = false;
}

function proximoMes() {
  if (mesAtual.value === 11) {
    mesAtual.value = 0;
    anoAtual.value++;
  } else {
    mesAtual.value++;
  }
  gerarCalendario();
  semanaSelecionada.value = null;
}

function anteriorMes() {
  if (mesAtual.value === 0) {
    mesAtual.value = 11;
    anoAtual.value--;
  } else {
    mesAtual.value--;
  }
  gerarCalendario();
  semanaSelecionada.value = null;
}

onMounted(() => {
  gerarCalendario();
});
</script>


<style>
.SelecaoSemana-ContainerPrincipal {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 86vh;
  width: 100vw;
  background-color: white;
}

.SelecaoSemana-ConteudoCentral {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.SelecaoSemana-Titulo {
  position: absolute;
  top: 3vh;
  left: 4vw;
  font-size: 4.4vw;
  color: #137073;
}

.SelecaoSemana-Texto {
  font-size: 2vw;
  color: #757575;
  margin: 3.5rem;
}

.SelecaoSemana-Botao {
  background-color: #137073;
  color: white;
  margin-top: 4.2vh;
  font-size: 1.2vw;
  font-weight: bold;
  width: 11.5vw;
}

.SelecaoSemana-Botao:hover {
  background-color: #38A3A5;
}

.SelecaoSemana-Cabecalho {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: #777;
}

.SelecaoSemana-Navegar {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #777;
}

.SelecaoSemana-MesAno {
  flex: 1;
  text-align: center;
}

.SelecaoSemana-DiasSemana {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-weight: bold;
  color: #888;
}

.SelecaoSemana-DiasMes {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.SelecaoSemana-Semana {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  border-radius: 8px;
  transition: background-color 0.3s;
  cursor: pointer;
}

.SelecaoSemana-Semana:hover {
  background-color: #38A3A5;
  color: white;
}

.SelecaoSemana-Selecionada {
  background-color: #38A3A5 !important;
  color: white;
}

.SelecaoSemana-Fora {
  color: #bbb;
}

.SelecaoSemana-Dia {
  padding: 0.8rem 0;
}

.SelecaoSemana-RodapeBotao {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.SelecaoSemana-BotaoCheck {
  background-color: #137073;
  color: white;
  font-size: 1.2rem;
}

.SelecaoSemana-BotaoCheck:hover {
  background-color: #38A3A5;
}

.SelecaoSemana-CalendarioOverlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  backdrop-filter: blur(2px);
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
}

.SelecaoSemana-CalendarioPopup {
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  width: 90vw;
  max-width: 650px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
  overflow: hidden;
}
</style>
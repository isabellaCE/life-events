<template>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

  <div class="container-cronograma">
    <!-- Título -->
    <h1 class="titulo">LifEvents</h1>

    <!-- Card com a semana -->
    <div class="caixa-cronograma">
      <h2 class="subtitulo">Cronograma Inteligente</h2>
      <div class="etiqueta">
        <button @click="mostrarCalendario = true">{{ textoSemana }}</button>
      </div>
    </div>

    <!-- Botões de ação -->
    <div class="botoes-inferiores">
      <button class="botao-circular verde">
        <i class="fas fa-plus" style="color: white; 
        padding: 10px;"></i>
      </button>
      <button class="botao-circular vermelho">
        <i class="fas fa-trash" style="color: white; 
        padding: 10px;"></i>
      </button>
      <button class="botao-circular verde">✔</button>
    </div>
    
  </div>

    <!-- Calendário sobreposto -->
    <div v-if="mostrarCalendario" class="calendario-overlay" @click.self="fecharCalendario">
      <div class="calendario-popup">
        <!-- Cabeçalho -->
        <div class="cabecalho">
          <button class="navegar" @click="anteriorMes">←</button>
          <span class="mes-ano">{{ nomeMes }} {{ anoAtual }}</span>
          <button class="navegar" @click="proximoMes">→</button>
        </div>

        <!-- Dias da semana -->
        <div class="dias-semana">
          <div v-for="(dia, i) in diasSemana" :key="i">{{ dia }}</div>
        </div>

        <!-- Semanas -->
        <div class="dias-mes">
          <div
            v-for="(semana, i) in semanasMes"
            :key="i"
            class="semana"
            :class="{ selecionada: semanaSelecionada === i }"
            @click="selecionarSemana(i)"
          >
            <div
              v-for="(dia, j) in semana"
              :key="j"
              class="dia"
              :class="{ vazio: !dia.dia, fora: dia.foradoMes }"
            >
              {{ dia.dia || '' }}
            </div>
          </div>
        </div>

        <!-- Botão check -->
        <div>
          <button class="botao-check" @click="confirmarSelecao">✔</button>
        </div>
      </div>
    </div>

</template>

<style scoped>
.container-cronograma {
  position: relative;
  height: 100vh;
  width: 100vw;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.titulo {
  position: absolute;
  top: 3vh;
  left: 4vw;
  font-size: 4.4vw;
  color: #00695C;
}

.caixa-cronograma {
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 0.8rem;
  width: 80vw;
  height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.subtitulo {
  font-size: 1.4vw;
  color: #555;
  font-weight: bold;
  margin-bottom: 0.2rem;
}

.etiqueta {
  background-color: #38A3A5;
  color: white;
  padding: 0.6rem 1.4rem;
  border-radius: 14px;
  font-size: 1.2vw;
  font-weight: bold;
  cursor: pointer; 
}

.etiqueta:hover {
    background-color: #137073;
}

.botoes-inferiores {
  position: absolute;
  bottom: 2vh;
  right: 3vw;
  display: flex;
  gap: 1.4rem;
}

.botao-circular {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.verde {
  background-color: #00695C;
}

.verde:hover {
    background-color: #38A3A5;
}

.vermelho {
  background-color: #B00020;
}

.vermelho:hover {
    background-color: #740000;
}

.cabecalho {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: #777;
}

.navegar {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #777;
}

.mes-ano {
  flex: 1;
  text-align: center;
}

.dias-semana {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-weight: bold;
  color: #888;
}

.dias-mes {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.semana {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  border-radius: 8px;
  transition: background-color 0.3s;
  cursor: pointer;
}

.semana:hover {
  background-color: #38A3A5;
  color: white;
}

.selecionada {
  background-color: #38A3A5 !important;
  color: white;
}

.fora {
  color: #bbb;
}

.dia {
  padding: 0.8rem 0;
}

.botao-check {
  position: absolute;
  padding: 5px 5px;
  right: 3rem;
  background-color: #137073;
  color: white;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  font-size: 1.2rem;
}

.botao-check:hover{
  background-color: #38A3A5;
}

.calendario-overlay {
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

.calendario-popup {
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.15);
  width: 650px;
  height: 460px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
}
</style>

<script>
export default {
  props: {
    semana: Object
  },
  computed: {
    textoSemana() {
      if (!this.semana) return ''
      const opcoes = { day: 'numeric', month: 'long', year: 'numeric' }
      const inicio = this.semana.inicio.toLocaleDateString('pt-BR', opcoes)
      const fim = this.semana.fim.toLocaleDateString('pt-BR', opcoes)
      return `${inicio} - ${fim}`
    },
    nomeMes() {
      const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
      return meses[this.mesAtual];
    }
  },

  /* Calendário */

  data() {
    return {
      mostrarCalendario: false,
      diasSemana: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
      semanasMes: [],
      semanaSelecionada: null,
      mesAtual: new Date().getMonth(),
      anoAtual: new Date().getFullYear(),
    };
  },
  mounted() {
    this.gerarCalendario();
  },
  methods: {
  fecharCalendario() {
    this.mostrarCalendario = false;
  },
  gerarCalendario() {
    const primeiroDia = new Date(this.anoAtual, this.mesAtual, 1);
    const ultimoDia = new Date(this.anoAtual, this.mesAtual + 1, 0);
    const totalDias = ultimoDia.getDate();
    const diaSemanaInicio = primeiroDia.getDay(); 
    const diaSemanaFim = ultimoDia.getDay();      

    const semanas = [];
    let semana = [];

    // Preenche dias do mês anterior, se o mês não começar no domingo
    if (diaSemanaInicio !== 0) {
      const ultimoDiaMesAnterior = new Date(this.anoAtual, this.mesAtual, 0).getDate();
      for (let i = diaSemanaInicio; i > 0; i--) {
        semana.push({
          dia: ultimoDiaMesAnterior - i + 1,
          foradoMes: true
        });
      }
    }

    // Preenche os dias do mês atual
    for (let dia = 1; dia <= totalDias; dia++) {
      semana.push({ dia, foradoMes: false });

      if (semana.length === 7) {
        semanas.push(semana);
        semana = [];
      }
    }

    // Se ainda restaram dias incompletos na última semana E o mês não termina no sábado
    if (semana.length > 0 && diaSemanaFim !== 6) {
      let diaProximo = 1;
      while (semana.length < 7) {
        semana.push({ dia: diaProximo++, foradoMes: true });
      }
      semanas.push(semana);
    } else if (semana.length === 7) {
      semanas.push(semana);
    }

    this.semanasMes = semanas;
  },

  selecionarSemana(index) {
    this.semanaSelecionada = index;
  },

  proximoMes() {
    if (this.mesAtual === 11) {
      this.mesAtual = 0;
      this.anoAtual++;
    } else {
      this.mesAtual++;
    }
    this.gerarCalendario();
    this.semanaSelecionada = null;
  },

  anteriorMes() {
    if (this.mesAtual === 0) {
      this.mesAtual = 11;
      this.anoAtual--;
    } else {
      this.mesAtual--;
    }
    this.gerarCalendario();
    this.semanaSelecionada = null;
  }
 }
}
</script>



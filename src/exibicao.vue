<template>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />

  <div class="Exibicao-container-cronograma">
    <h1 class="Exibicao-titulo">LifEvents</h1>

    <div class="Exibicao-caixa-cronograma">
      <h2 class="Exibicao-subtitulo">Cronograma Inteligente</h2>
      <div class="Exibicao-etiqueta">
        <button @click="mostrarCalendario = true">{{ textoSemana }}</button>
      </div>
    </div>

    <div class="Exibicao-botoes-inferiores">
      <button class="Exibicao-botao-circular Exibicao-verde">
        <i class="fas fa-plus" style="color: white; padding: 10px;"></i>
      </button>
      <button class="Exibicao-botao-circular Exibicao-vermelho">
        <i class="fas fa-trash" style="color: white; padding: 10px;"></i>
      </button>
      <button class="Exibicao-botao-circular Exibicao-verde">✔</button>
    </div>
  </div>

  <div v-if="mostrarCalendario" class="Exibicao-calendario-overlay" @click.self="fecharCalendario">
    <div class="Exibicao-calendario-popup">
      <div class="Exibicao-cabecalho">
        <button class="Exibicao-navegar" @click="anteriorMes">←</button>
        <span class="Exibicao-mes-ano">{{ nomeMes }} {{ anoAtual }}</span>
        <button class="Exibicao-navegar" @click="proximoMes">→</button>
      </div>

      <div class="Exibicao-dias-semana">
        <div v-for="(dia, i) in diasSemana" :key="i">{{ dia }}</div>
      </div>

      <div class="Exibicao-dias-mes">
        <div
          v-for="(semana, i) in semanasMes"
          :key="i"
          class="Exibicao-semana"
          :class="{ 'Exibicao-selecionada': semanaSelecionada === i }"
          @click="selecionarSemana(i)"
        >
          <div
            v-for="(dia, j) in semana"
            :key="j"
            class="Exibicao-dia"
            :class="{ 'Exibicao-vazio': !dia.dia, 'Exibicao-fora': dia.foradoMes }"
          >
            {{ dia.dia || '' }}
          </div>
        </div>
      </div>

      <div>
        <button class="Exibicao-botao-check" @click="confirmarSelecao">✔</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    semana: Object,
  },
  computed: {
    textoSemana() {
      if (!this.semana) return '';
      const opcoes = { day: 'numeric', month: 'long', year: 'numeric' };
      const inicio = this.semana.inicio.toLocaleDateString('pt-BR', opcoes);
      const fim = this.semana.fim.toLocaleDateString('pt-BR', opcoes);
      return `${inicio} - ${fim}`;
    },
    nomeMes() {
      const meses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
      ];
      return meses[this.mesAtual];
    }
  },
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

      if (diaSemanaInicio !== 0) {
        const ultimoDiaMesAnterior = new Date(this.anoAtual, this.mesAtual, 0).getDate();
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
    },
    confirmarSelecao() {
      this.fecharCalendario();
    }
  }
}
</script>

<style scoped>
html {
  overflow: hidden !important;
}

.Exibicao-container-cronograma {
  position: relative;
  height: 100vh;
  width: 100vw;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.Exibicao-titulo {
  position: absolute;
  top: 3vh;
  left: 4vw;
  font-size: 4.4vw;
  color: #00695C;
}

.Exibicao-caixa-cronograma {
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 0.8rem;
  width: 80vw;
  height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.Exibicao-subtitulo {
  font-size: 1.4vw;
  color: #555;
  font-weight: bold;
  margin-bottom: 0.2rem;
}

.Exibicao-etiqueta {
  background-color: #38A3A5;
  color: white;
  padding: 0.6rem 1.4rem;
  border-radius: 14px;
  font-size: 1.2vw;
  font-weight: bold;
  cursor: pointer; 
}

.Exibicao-etiqueta:hover {
    background-color: #137073;
}

.Exibicao-botoes-inferiores {
  position: absolute;
  bottom: 2vh;
  right: 3vw;
  display: flex;
  gap: 1.4rem;
}

.Exibicao-botao-circular {
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

.Exibicao-verde {
  background-color: #00695C;
}

.Exibicao-verde:hover {
    background-color: #38A3A5;
}

.Exibicao-vermelho {
  background-color: #B00020;
}

.Exibicao-vermelho:hover {
    background-color: #740000;
}

.Exibicao-cabecalho {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: #777;
}

.Exibicao-navegar {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #777;
}

.Exibicao-mes-ano {
  flex: 1;
  text-align: center;
}

.Exibicao-dias-semana {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-weight: bold;
  color: #888;
}

.Exibicao-dias-mes {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.Exibicao-semana {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  border-radius: 8px;
  transition: background-color 0.3s;
  cursor: pointer;
}

.Exibicao-semana:hover {
  background-color: #38A3A5;
  color: white;
}

.Exibicao-selecionada {
  background-color: #38A3A5 !important;
  color: white;
}

.Exibicao-fora {
  color: #bbb;
}

.Exibicao-dia {
  padding: 0.8rem 0;
}

.Exibicao-botao-check {
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

.Exibicao-botao-check:hover{
  background-color: #38A3A5;
}

.Exibicao-calendario-overlay {
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

.Exibicao-calendario-popup {
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
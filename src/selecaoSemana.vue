<template>
  <div class="SelecaoSemana-container-principal">
    <h1 class="SelecaoSemana-titulo">LifEvents</h1>

    <div :class="['SelecaoSemana-conteudo-central', { desfocado: mostrarCalendario }]">
      <p class="SelecaoSemana-texto">Selecione a semana em que deseja organizar</p>
      <button class="SelecaoSemana-botao" @click="mostrarCalendario = true">Selecionar</button>
    </div>

    <div v-if="mostrarCalendario" class="SelecaoSemana-calendario-overlay" @click.self="fecharCalendario">
      <div class="SelecaoSemana-calendario-popup">
        <div class="SelecaoSemana-cabecalho">
          <button class="SelecaoSemana-navegar" @click="anteriorMes">←</button>
          <span class="SelecaoSemana-mes-ano">{{ nomeMes }} {{ anoAtual }}</span>
          <button class="SelecaoSemana-navegar" @click="proximoMes">→</button>
        </div>

        <div class="SelecaoSemana-dias-semana">
          <div v-for="(dia, i) in diasSemana" :key="i">{{ dia }}</div>
        </div>

        <div class="SelecaoSemana-dias-mes">
          <div
            v-for="(semana, i) in semanasMes"
            :key="i"
            class="SelecaoSemana-semana"
            :class="{ 'SelecaoSemana-selecionada': semanaSelecionada === i }"
            @click="selecionarSemana(i)"
          >
            <div
              v-for="(dia, j) in semana"
              :key="j"
              class="SelecaoSemana-dia"
              :class="{ 'SelecaoSemana-vazio': !dia.dia, 'SelecaoSemana-fora': dia.foradoMes }"
            >
              {{ dia.dia || '' }}
            </div>
          </div>
        </div>

        <div>
          <button class="SelecaoSemana-botao-check" @click="confirmarSelecao">✔</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
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
  computed: {
    nomeMes() {
      const meses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
      ];
      return meses[this.mesAtual];
    }
  },
  mounted() {
    this.gerarCalendario();
  },
  methods: {
    confirmarSelecao() {
  if (this.semanaSelecionada !== null) {
    const semana = this.semanasMes[this.semanaSelecionada];
    const [diaInicio, diaFim] = [semana[0], semana[6]];

    const mesInicio = diaInicio.foradoMes && diaInicio.dia > 15 ? this.mesAtual - 1 : this.mesAtual;
    const mesFim = diaFim.foradoMes && diaFim.dia < 15 ? this.mesAtual + 1 : this.mesAtual;

    const dataInicio = new Date(this.anoAtual, mesInicio, diaInicio.dia);
    const dataFim = new Date(this.anoAtual, mesFim, diaFim.dia);

    this.$router.push({
      name: 'Exibicao',
      query: {
        inicio: dataInicio.toISOString(),
        fim: dataFim.toISOString()
      }
    });
  }
},

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
    }
  }
};
</script>

<style>
html {
  overflow: hidden !important;
}

.SelecaoSemana-container-principal{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 86vh;
  width: 100vw;
  background-color: white;
}

.SelecaoSemana-conteudo-central{
  display: flex;
  flex-direction: column;
  align-items: center;
}

.SelecaoSemana-titulo{
  position: absolute;
  top: 3vh;
  left: 4vw;
  font-size: 4.4vw;
  color: #137073;
}

.SelecaoSemana-texto{
  font-size: 2vw;
  color: #757575;
  margin: 3.5rem;
}

.SelecaoSemana-botao {
  background-color: #137073;
  color: white;
  border: none;
  padding: 0.5rem 2rem;
  font-size: 1.4vw;
  border-radius: 6px;
  margin-top: 4.2vh;
  font-weight: bold;
}

.SelecaoSemana-botao:hover{
  background-color: #38A3A5;
}

.SelecaoSemana-cabecalho {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: #777;
}

.SelecaoSemana-navegar {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #777;
}

.SelecaoSemana-mes-ano {
  flex: 1;
  text-align: center;
}

.SelecaoSemana-dias-semana {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-weight: bold;
  color: #888;
}

.SelecaoSemana-dias-mes {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.SelecaoSemana-semana {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  border-radius: 8px;
  transition: background-color 0.3s;
  cursor: pointer;
}

.SelecaoSemana-semana:hover {
  background-color: #38A3A5;
  color: white;
}

.SelecaoSemana-selecionada {
  background-color: #38A3A5 !important;
  color: white;
}

.SelecaoSemana-fora {
  color: #bbb;
}

.SelecaoSemana-dia {
  padding: 0.8rem 0;
}

.SelecaoSemana-botao-check {
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

.SelecaoSemana-botao-check:hover{
  background-color: #38A3A5;
}

.SelecaoSemana-calendario-overlay {
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

.SelecaoSemana-calendario-popup {
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
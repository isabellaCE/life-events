<template>
  <v-app>
    <TelaCapa v-if="telaAtual === 'capa'" @acessar="mudarParaSelecaoSemana" />
    <SelecaoSemana v-if="telaAtual === 'selecaoSemana'" @check="mudarParaExibicao" />
    <Exibicao v-if="telaAtual === 'exibicao'" :semana="semanaSelecionada"/>
  </v-app>
</template>

<script>
import TelaCapa from './telaCapa.vue'
import SelecaoSemana from './selecaoSemana.vue'
import Exibicao from './exibicao.vue'


export default {
  components: {
    TelaCapa,
    SelecaoSemana,
    Exibicao
  },
    data() {
    return {
      telaAtual: 'capa',
      semanaSelecionada: null
    }
  },
  methods: {
    mudarParaSelecaoSemana() {
      this.telaAtual = 'selecaoSemana'
    },
    mudarParaExibicao(semana) {
      this.semanaSelecionada = semana
      this.telaAtual = 'exibicao'
    },
  }
}
</script>

<style>
html {
  overflow: hidden !important;
}
</style>

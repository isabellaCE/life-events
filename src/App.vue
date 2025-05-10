<template>
  <v-app>
    <TelaCapa v-if="telaAtual === 'capa'" @acessar="mudarParaSelecaoSemana" />
    <SelecaoSemana v-if="telaAtual === 'selecaoSemana'" @check="mudarParaExibicao"/>
    <Exibicao v-if="telaAtual === 'exibicao'" />
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
      telaAtual: 'capa'
    }
  },
  methods: {
    mudarParaSelecaoSemana() {
      this.telaAtual = 'selecaoSemana'
    },
    mudarParaExibicao(){
      this.telaAtual = 'exibicao'
    }
  }
}
</script>

<style>
html {
  overflow: hidden !important;
}
</style>

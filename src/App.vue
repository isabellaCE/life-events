<template>
  <v-app>
    <TelaCapa v-if="telaAtual === 'capa'" @acessar="mudarParaSelecaoSemana" />
    <SelecaoSemana v-if="telaAtual === 'selecaoSemana'" />
  </v-app>
</template>

<script>
import TelaCapa from './telaCapa.vue'
import SelecaoSemana from './selecaoSemana.vue'

export default {
  components: {
    TelaCapa,
    SelecaoSemana
  },
  data() {
    return {
      telaAtual: 'capa'
    }
  },
  methods: {
    mudarParaSelecaoSemana() {
      this.telaAtual = 'selecaoSemana'
    }
  }
}
</script>

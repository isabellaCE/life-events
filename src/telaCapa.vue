<template>
  <div class="TelaCapa-container">
    <div class="TelaCapa-esquerda-tela">
      <h1 class="TelaCapa-titulo">LifEvents</h1>

      <p class="TelaCapa-texto">
        O futuro dos seus estudos<br />
        começa com um cronograma<br />
        inteligente
      </p>

      <button class="TelaCapa-botao" @click="irParaSelecaoSemana">Acessar</button>
    </div>

    <div class="TelaCapa-direita-tela">
      <img src="./assets/calendario.svg" alt="Calendário" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'telaCapa',
  methods: {
    irParaSelecaoSemana() {
      this.$router.push('/selecao-semana');
    }
  }
}
</script>

<style scoped>
html {
  overflow: hidden !important;
}

.TelaCapa-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100vh;
  width: 100vw;
  padding: 3vh 6vw;
  background-color: white;
}

.TelaCapa-esquerda-tela {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 3.4vh;
  flex: 1;
}

.TelaCapa-titulo {
  font-size: 4.3vw;
  margin: 0;
  color: #137073;
  align-self: flex-start;
}

.TelaCapa-texto {
  color: #757575;
  font-size: 1.7vw;
  line-height: 1.3;
  margin: 0;
  text-align: left;
}

.TelaCapa-botao {
  background-color: #137073;
  color: white;
  border: none;
  padding: 0.7rem 2rem;
  font-size: 1.4vw;
  border-radius: 6px;
  margin-top: 4.2vh;
  font-weight: bold;
}

.TelaCapa-botao:hover {
  background-color: #38A3A5;
}

.TelaCapa-direita-tela {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.TelaCapa-direita-tela img {
  width: 100%;
  max-width: 1000px;
  height: auto;
}
</style>

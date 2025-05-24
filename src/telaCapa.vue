<template>
  <div class="TelaCapa-Container">
    <div class="TelaCapa-EsquerdaTela">
      <h1 class="TelaCapa-Titulo">LifEvents</h1>

      <p class="TelaCapa-Texto">
        O futuro dos seus estudos<br />
        começa com um cronograma<br />
        inteligente
      </p>

      <v-btn class="TelaCapa-Botao" @click="irParaSelecaoSemana">Acessar</v-btn>
    </div>

    <div class="TelaCapa-DireitaTela">
      <img src="./assets/calendario.svg" alt="Calendário" />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function irParaSelecaoSemana() {
  router.push('/selecao-semana');
}
</script>

<style scoped>
.TelaCapa-Container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100vh;
  width: 100vw;
  padding: 3vh 6vw;
  background-color: white;
}

.TelaCapa-EsquerdaTela {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 3.4vh;
  flex: 1;
}

.TelaCapa-Titulo {
  font-size: 4.3vw;
  margin: 0;
  color: #137073;
  align-self: flex-start;
}

.TelaCapa-Texto {
  color: #757575;
  font-size: 1.7vw;
  line-height: 1.3;
  margin: 0;
  text-align: left;
}

.TelaCapa-Botao {
  background-color: #137073;
  color: white;
  margin-top: 4.2vh;
  font-weight: bold;
  width: 11.5vw;
}

.TelaCapa-DireitaTela {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.TelaCapa-DireitaTela img {
  width: 100%;
  max-width: 1000px;
  height: auto;
}
</style>

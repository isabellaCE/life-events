<template>
  <div class="container">
    <div class="esquerda-tela">
      <h1>LifEvents</h1>

      <p class="texto">
        O futuro dos seus estudos<br />
        começa com um cronograma<br />
        inteligente
      </p>

      <button class="botao" @click="$emit('acessar')">Acessar</button>
    </div>

    <div class="direita-tela">
      <img src="./assets/calendario.svg" alt="Calendário" />
    </div>
  </div>
</template>

  <script>
  export default {
    name: 'telaCapa'
  }
  </script>
  
  <style scoped>
  .container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100vh;
    width: 100vw;
    padding: 3vh 6vw;
    background-color: white;
  }
  
  .esquerda-tela {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 3.4vh;
    flex: 1;
  }
  
  h1 {
    font-size: 4.3vw;
    margin: 0;
    color: #137073;
    align-self: flex-start;
  }
  
  .texto {
    color: #757575;
    font-size: 1.7vw;
    line-height: 1.3;
    margin: 0;
    text-align: left;
  }
  
  
  .botao {
    background-color: #137073;
    color: white;
    border: none;
    padding: 0.7rem 2rem;
    font-size: 1.4vw;
    border-radius: 6px;
    margin-top: 4.2vh;
    font-weight: bold;
  }

  .botao:hover{
  background-color: #38A3A5;
  }
  
  .direita-tela {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .direita-tela img {
  width: 100%;
  max-width: 1000px;
  height: auto;
  }
  </style>  
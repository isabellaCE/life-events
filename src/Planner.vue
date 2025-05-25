<template>
  <div class="planner-container">
    <div class="planner-header">
      <span>PLANNER</span>
      <button>Exportar</button>
      <button>Excluir</button>
    </div>

    <!-- <MenuAddTask :show="true"></MenuAddTask> -->

    <div class="calendar-grid">
      <div class="time-column">
        <div class="time-header"></div> <div v-for="hour in hours" :key="hour" class="hour-slot">
          {{ hour }}:00
        </div>
      </div>

      <div v-for="day in weekDays" :key="day.date" class="day-column">
        <div class="day-header">
          <span class="day-name">{{ day.name }}</span>
          <span class="day-date">{{ day.date.getDate() }}</span>
        </div>
        <div class="day-slots">
          <div v-for="hour in hours" :key="hour" class="hour-grid-line"></div>
          <div
            v-for="event in filteredEvents(day.date)"
            :key="event.nome + event.data + event.horarioInicio"
            class="calendar-event"
            :style="getEventStyle(event)"
          >
            <div class="event-name">{{ event.nome }}</div>
            <div class="event-time">{{ event.horarioInicio }} - {{ event.horarioFim }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MenuAddTask from './MenuAddTask.vue'; // Mantenha se for usar, senão, pode remover

export default {
  name: 'Planner',
  components: {
    MenuAddTask // Mantenha se for usar, senão, pode remover
  },
  data() {
    return {
      tasks: [], // Array para armazenar as tarefas do localStorage
      weekDays: [], // Array para armazenar os dias da semana a serem exibidos
      hours: Array.from({ length: 15 }, (_, i) => i + 8), // Horas de 8 a 17 (10 horas no total, começando da 8)
      // Ajuste o `length` e o `i + 8` conforme o range de horas que você quer exibir.
      // Ex: Array.from({ length: 18 }, (_, i) => i) para horas de 0 a 17
    };
  },
  mounted() {
    // Carrega as tarefas do localStorage quando o componente é montado
    this.loadTasksFromLocalStorage();
    // Gera os dias da semana para exibição
    this.generateWeekDays();
  },
  methods: {
    loadTasksFromLocalStorage() {
      try {
        const storedTasks = localStorage.getItem('tasks'); // Supondo que você salve como 'minhasTarefas'
        if (storedTasks) {
          this.tasks = JSON.parse(storedTasks);
          console.log('Tarefas carregadas do Local Storage:', this.tasks);
        } else {
          console.log('Nenhuma tarefa encontrada no Local Storage.');
        }
      } catch (e) {
        console.error("Erro ao carregar tarefas do Local Storage:", e);
        this.tasks = [];
      }
    },
    generateWeekDays() {
      const today = new Date();
      // Encontra o domingo da semana atual
      const sunday = new Date(today);
      sunday.setDate(today.getDate() - today.getDay()); // today.getDay() retorna 0 para domingo, 1 para segunda, etc.

      this.weekDays = [];
      for (let i = 0; i < 7; i++) {
        const day = new Date(sunday);
        day.setDate(sunday.getDate() + i);
        this.weekDays.push({
          name: this.getDayName(day.getDay()),
          date: day,
        });
      }
    },
    getDayName(dayIndex) {
      const names = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
      return names[dayIndex];
    },
    filteredEvents(date) {
      const formattedDate = date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
      return this.tasks.filter(task => task.data === formattedDate);
    },
    getEventStyle(event) {
      const startHour = parseInt(event.horarioInicio.split(':')[0]);
      const startMinute = parseInt(event.horarioInicio.split(':')[1]);
      const endHour = parseInt(event.horarioFim.split(':')[0]);
      const endMinute = parseInt(event.horarioFim.split(':')[1]);

      // Calcula a posição de início (top) em pixels
      // Cada hora tem 60px de altura (definido no CSS .hour-slot e .hour-grid-line)
      // A primeira hora exibida é 8:00 (this.hours[0])
      const minutesFromStartOfDay = (startHour * 60 + startMinute) - (this.hours[0] * 60);
      const topPosition = (minutesFromStartOfDay / 60) * 60; // Convertendo minutos para pixels

      // Calcula a duração em minutos
      const durationMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
      const height = (durationMinutes / 60) * 60; // Convertendo duração em minutos para pixels

      return {
        top: `${topPosition}px`,
        height: `${height}px`,
      };
    },
  },
};
</script>

<style scoped>
/* Estilos gerais do container do planner */
.planner-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100vw;
  box-sizing: border-box;
  padding: 20px; /* Adicionado para um melhor espaçamento geral */
}

.planner-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.planner-header span {
  font-weight: bold;
  font-size: 1.2em;
}

.planner-header button {
  padding: 8px 15px;
  margin-left: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f0f0f0;
  cursor: pointer;
}

/* Estilos da grade do calendário */
.calendar-grid {
  display: grid;
  grid-template-columns: 60px repeat(7, 1fr); /* Coluna de tempo + 7 colunas para os dias */
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden; /* Garante que os cantos arredondados funcionem */
  background-color: #fff;
}

/* Estilos da coluna de horários */
.time-column {
  border-right: 1px solid #eee;
  background-color: #f9f9f9;
}

.time-header {
  height: 50px; /* Altura do cabeçalho do dia */
  border-bottom: 1px solid #ddd;
}

.hour-slot {
  height: 60px; /* Altura de cada slot de hora */
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 10px;
  font-size: 0.85em;
  color: #555;
  border-bottom: 1px solid #eee;
}

/* Estilos das colunas dos dias */
.day-column {
  display: flex;
  flex-direction: column;
  border-right: 1px solid #eee; /* Linha divisória entre os dias */
}

.day-column:last-child {
  border-right: none; /* Remove a borda da última coluna */
}

.day-header {
  height: 50px; /* Altura do cabeçalho do dia */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #ddd;
  background-color: #f9f9f9;
  font-weight: bold;
  color: #333;
}

.day-name {
  font-size: 0.9em;
}

.day-date {
  font-size: 1.2em;
  margin-top: 2px;
}

.day-slots {
  position: relative; /* Para posicionar os eventos absolutamente */
  flex-grow: 1; /* Ocupa o restante do espaço */
}

.hour-grid-line {
  height: 60px; /* Altura de cada slot de hora */
  border-bottom: 1px dashed #eee; /* Linha de grade para cada hora */
  box-sizing: border-box; /* Garante que a borda não aumente a altura */
}

.hour-grid-line:last-child {
    border-bottom: none; /* Remove a linha da última hora para evitar duplicidade na parte inferior */
}

/* Estilos dos eventos do calendário */
.calendar-event {
  position: absolute;
  left: 5px; /* Pequeno espaçamento da borda */
  right: 5px; /* Pequeno espaçamento da borda */
  background-color: #4CAF50; /* Cor de fundo do evento (verde) */
  color: white;
  border-radius: 4px;
  padding: 5px;
  overflow: hidden; /* Esconde conteúdo extra se o evento for pequeno */
  font-size: 0.8em;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10; /* Para garantir que o evento fique acima das linhas da grade */
  box-sizing: border-box; /* Garante que padding e bordas não aumentem o tamanho do elemento */
}

.event-name {
  font-weight: bold;
  white-space: nowrap; /* Evita que o nome do evento quebre em várias linhas */
  overflow: hidden; /* Esconde texto que ultrapassa o limite */
  text-overflow: ellipsis; /* Adiciona "..." se o texto for cortado */
}

.event-time {
  font-size: 0.75em;
  margin-top: 2px;
}
</style>
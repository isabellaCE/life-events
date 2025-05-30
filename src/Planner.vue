<template>
  <div class="planner-container">
    <div class="planner-header">
      <div class="title">LifEvents</div>
      <div>
        <v-btn color="#137073">
          Exportar <v-icon right>mdi-download</v-icon>
        </v-btn>
      </div>
      <div>
        <v-btn color="#A20000" @click="confirmarExclusao">
          Excluir <v-icon right>mdi-delete</v-icon>
        </v-btn>
      </div>
    </div>

    <div v-if="excluirPlanner" class="Planner-PopupOverlay" @click.self="excluirPlanner = false">
      <div class="Planner-Popup">
        <p class="Planner-PopupText">Deseja excluir o planner?</p>
        <div class="Planner-PopupBotoes">
          <v-btn class="Planner-BotaoS" @click="apagarPlanner">Sim</v-btn>
          <v-btn class="Planner-BotaoN" @click="excluirPlanner = false">Não</v-btn>
        </div>
      </div>
    </div>

    <div class="calendar-grid">
      <div class="time-column">
        <div class="time-header"></div>
        <div v-for="hour in hours" :key="hour" class="hour-slot">
          {{ String(hour).padStart(2, '0') }}:00
        </div>
      </div>

      <div v-for="day in weekDays" :key="day.date" class="day-column">
        <div class="day-header">
          <span class="day-date">{{ day.date.getDate() }}</span>
          <span class="day-name">{{ day.name }}</span>
        </div>
        <div class="day-slots">
          <div v-for="hour in hours" :key="hour" class="hour-grid-line"></div>
          <div v-for="(event, index) in filteredEvents(day.date)" :key="event.nome + event.data + event.horarioInicio"
            class="calendar-event" :class="{ 'event-green': index % 2 === 0, 'event-red': index % 2 !== 0 }"
            :style="getEventStyle(event)">
            <div class="event-name">{{ event.nome }}</div>
            <div class="event-time">{{ event.horarioInicio }} - {{ event.horarioFim }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MenuAddTask from './MenuAddTask.vue';

export default {
  name: 'Planner',
  components: {
    MenuAddTask
  },
  data() {
    return {
      tasks: [],
      weekDays: [],
      hours: Array.from({ length: 15 }, (_, i) => i + 8)
    };
  },
  mounted() {
    this.loadTasksFromLocalStorage();
    this.generateWeekDays();
  },
  methods: {
    loadTasksFromLocalStorage() {
      try {
        const storedTasks = localStorage.getItem('tasks');
        this.tasks = JSON.parse(storedTasks);
      } catch (e) {
        console.error('Erro ao carregar tarefas do Local Storage:', e);
        this.tasks = [];
      }
    },
    getDatesFromUrl() {
      const urlParams = new URLSearchParams(window.location.search);
      const inicio = urlParams.get('inicio');
      const fim = urlParams.get('fim');

      let startDate = null;
      let endDate = null;

      if (inicio) {
        startDate = new Date(inicio);
      }
      if (fim) {
        endDate = new Date(fim);
      }
      return { startDate, endDate };
    },
    generateWeekDays() {
      const { startDate, endDate } = this.getDatesFromUrl();
      const weekDays = [];

      if (startDate && endDate && startDate <= endDate) {
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          weekDays.push({
            name: this.getDayName(currentDate.getDay()),
            date: new Date(currentDate)
          });
          currentDate.setDate(currentDate.getDate() + 1);
        }
      } else {
        const today = new Date();
        const sunday = new Date(today);
        sunday.setDate(today.getDate() - today.getDay());

        for (let i = 0; i < 7; i++) {
          const day = new Date(sunday);
          day.setDate(sunday.getDate() + i);
          weekDays.push({
            name: this.getDayName(day.getDay()),
            date: day
          });
        }
      }
      this.weekDays = weekDays;
    },
    getDayName(dayIndex) {
      const names = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
      return names[dayIndex];
    },
    filteredEvents(date) {
      const formattedDate = date.toISOString().split('T')[0];
      return this.tasks.filter(task => task.data === formattedDate);
    },
    getEventStyle(event) {
      const startHour = parseInt(event.horarioInicio.split(':')[0]);
      const startMinute = parseInt(event.horarioInicio.split(':')[1]);
      const endHour = parseInt(event.horarioFim.split(':')[0]);
      const endMinute = parseInt(event.horarioFim.split(':')[1]);

      const minutesFromDisplayedStart = (startHour * 60 + startMinute) - (this.hours[0] * 60);
      const durationMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);

      const topPosition = (minutesFromDisplayedStart / 60) * 50;
      const height = (durationMinutes / 60) * 50;

      return {
        top: `${topPosition}px`,
        height: `${height}px`
      };
    },
    confirmarExclusao() {
      this.excluirPlanner = true;
    },
    apagarPlanner() {
      localStorage.removeItem('tasks');
      this.tasks = [];
      this.excluirPlanner = false;
      this.$router.push('/exibicao');
    }
  }
};

</script>

<style scoped>
.planner-container {
  display: flex;
  flex-direction: row;
  gap: 15px;
  width: 100vw;
  box-sizing: border-box;
  padding: 15px;
  height: 100vh;
  overflow: hidden;
}

.planner-header {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin: 32px;
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

.calendar-grid {
  display: grid;
  grid-template-columns: 60px repeat(v-bind(weekDays.length), 1fr);
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  background-color: #fff;
  flex-grow: 1;
  min-height: 0;
}

.time-column,
.day-column {
  display: flex;
  flex-direction: column;
}

.time-header,
.day-header {
  height: 50px;
  border-bottom: 1px solid #ddd;
  background-color: #f9f9f9;
  flex-shrink: 0;
}

.time-column {
  border-right: 1px solid #eee;
  background-color: #f9f9f9;
}

.hour-slot {
  height: 50px;
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 10px;
  font-size: 0.8em;
  color: #555;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
}

.hour-slot:last-child {
  border-bottom: none;
}

.day-column {
  border-right: 1px solid #eee;
}

.day-column:last-child {
  border-right: none;
}

.day-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #828282;
}

.day-name {
  font-size: 0.9em;
}

.day-date {
  font-size: 1.1em;
  margin-top: 2px;
}

.day-slots {
  position: relative;
  flex-grow: 1;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.day-slots::-webkit-scrollbar {
  display: none;
}

.hour-grid-line {
  height: 50px;
  min-height: 50px;
  border-bottom: 1px dashed #eee;
  box-sizing: border-box;
}

.hour-grid-line:last-child {
  border-bottom: none;
}

.calendar-event {
  position: absolute;
  left: 5px;
  right: 5px;
  color: white;
  border-radius: 4px;
  padding: 4px;
  overflow: hidden;
  font-size: 0.75em;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
  box-sizing: border-box;
  line-height: 1.3;
}

.event-green {
  background-color: #38A3A5;
}

.event-red {
  background-color: #137073;
}

.event-name {
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.event-time {
  font-size: 0.7em;
  margin-top: 2px;
}

.title {
  font-size: 32px;
  color: #137073;
}

.Planner-PopupOverlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.Planner-Popup {
  background-color: #f2f2f2;
  padding: 2.5rem 3rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 90%;
}

.Planner-PopupText {
  margin-bottom: 1.5rem;
  font-weight: bold;
  color: #555;
}

.Planner-PopupBotoes {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.Planner-BotaoS {
  background-color: #00796B;
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

.Planner-BotaoN {
  background-color: #B71C1C;
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}
</style>
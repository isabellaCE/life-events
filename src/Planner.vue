<template>
  <div class="planner-container">
    <div class="planner-header">
      <div class="title">LifEvents</div>
      <div>
        <v-btn color="#137073" @click="exportToImage">
          Exportar <v-icon right>mdi-download</v-icon>
        </v-btn>
      </div>
      <div>
        <v-btn color="#A20000" @click="deleteTasks">
          Excluir <v-icon right>mdi-delete</v-icon>
        </v-btn>
      </div>
    </div>

    <div class="calendar-wrapper" ref="plannerElement">
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
            <div
              v-for="(event, index) in filteredEvents(day.date)"
              :key="event.nome + event.data + event.horarioInicio"
              class="calendar-event"
              :class="{ 'event-green': index % 2 === 0, 'event-red': index % 2 !== 0 }"
              :style="getEventStyle(event)"
            >
              <div class="event-name">{{ event.nome }}</div>
              <div class="event-time">{{ event.horarioInicio }} - {{ event.horarioFim }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas';

export default {
  name: 'Planner',
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
        this.tasks = storedTasks ? JSON.parse(storedTasks) : [];
      } catch (e) {
        console.error('Erro ao carregar tarefas do Local Storage:', e);
        this.tasks = [];
      }
    },
    getDatesFromLocalStorage() {
      let startDate = null;
      let endDate = null;
      try {
        const storedWeek = localStorage.getItem('semanaSelecionada');
        if (storedWeek) {
          const parsedWeek = JSON.parse(storedWeek);
          if (parsedWeek.inicio && parsedWeek.fim) {
            startDate = new Date(parsedWeek.inicio);
            endDate = new Date(parsedWeek.fim);
          }
        }
      } catch (e) {
        console.error('Erro ao carregar semana do Local Storage:', e);
      }
      return { startDate, endDate };
    },
    generateWeekDays() {
      const { startDate, endDate } = this.getDatesFromLocalStorage();
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

      const hourHeight = this.calculateHourHeight();
      const topPosition = (minutesFromDisplayedStart / 60) * hourHeight;
      const height = (durationMinutes / 60) * hourHeight;

      return {
        top: `${topPosition}px`,
        height: `${height}px`
      };
    },
    calculateHourHeight() {
      const totalHours = this.hours.length;
      const headerHeight = 50;
      const availableHeight = window.innerHeight - headerHeight - 100;
      return Math.max(50, availableHeight / totalHours);
    },
    async exportToImage() {
      try {
        const element = this.$refs.plannerElement;
        const options = {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          scrollX: 0,
          scrollY: 0,
          windowWidth: element.scrollWidth,
          windowHeight: element.scrollHeight
        };

        const canvas = await html2canvas(element, options);
        const link = document.createElement('a');
        link.download = `planner-${new Date().toISOString().slice(0, 10)}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (error) {
        console.error('Erro ao exportar planner:', error);
      }
    },
    deleteTasks() {
      try {
        localStorage.removeItem('tasks');
        setTimeout(() => {
          this.$router.push('/exibicao');
        }, 500);
        
      } catch (error) {
        console.error('Erro ao excluir tarefas:', error);
      }
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
  flex-shrink: 0;
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

.calendar-wrapper {
  flex-grow: 1;
  overflow: auto;
  min-height: 0;
}

.calendar-grid {
  display: grid;
  grid-template-columns: 60px repeat(v-bind('weekDays.length'), 1fr);
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  background-color: #fff;
  min-height: 0;
  height: calc(100vh - 100px);
}

.time-column,
.day-column {
  display: flex;
  flex-direction: column;
  min-height: 0;
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
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding-right: 10px;
  padding-top: 5px;
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
  overflow: hidden;
}

.hour-grid-line {
  flex: 1;
  min-height: 0;
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
</style>
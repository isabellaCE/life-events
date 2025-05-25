<template>
  <div v-if="show">
    <v-navigation-drawer permanent width="500" location="right" @click="rail = false">
      <div class="MenuAddTask-Form">
        <v-text-field label="Insira o nome da tarefa" v-model="taskData.nome" />
        <div class="MenuAddTask-DateContainer">
          <div class="MenuAddTask-Title">Data e Hora</div>
          <v-divider />
          <div class="MenuAddTask-InputsContainer">
            <span>Data</span>
            <input type="date" v-model="taskData.data">
          </div>
          <div class="MenuAddTask-InputsContainer">
            <span>Horário inicial</span>
            <input type="time" v-model="taskData.horarioInicio">
          </div>
          <div class="MenuAddTask-InputsContainer">
            <span>Horário final</span>
            <input type="time" v-model="taskData.horarioFim">
          </div>
        </div>
        <v-textarea label="Observação..." variant="outlined" v-model="taskData.observacao" />
        <div class="MenuAddTask-ButtonsContainer">
          <div>
            <v-fab color="#A20000" icon="mdi-delete" @click.stop="deleteTask"></v-fab>
          </div>
          <div>
            <v-fab color="#137073" icon="mdi-plus" @click.stop="addTask"></v-fab>
          </div>
        </div>
      </div>
    </v-navigation-drawer>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: Boolean,
  task: Object
})

const taskData = ref({
  nome: '',
  data: '',
  horarioInicio: '',
  horarioFim: '',
  observacao: ''
})

const emit = defineEmits(['close'])

const addTask = () => {
  if (!taskData.value.nome || !taskData.value.data || !taskData.value.horarioInicio || !taskData.value.horarioFim) {
    alert('Por favor, preencha todos os campos obrigatórios');
    return;
  }

  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  if (props.task) {
    const index = tasks.findIndex(t =>
      t.nome === props.task.nome &&
      t.data === props.task.data &&
      t.horarioInicio === props.task.horarioInicio &&
      t.horarioFim === props.task.horarioFim
    );
    if (index !== -1) {
      tasks[index] = { ...taskData.value };
    }
  } else {
    tasks.push({ ...taskData.value });
  }

  localStorage.setItem('tasks', JSON.stringify(tasks));
  emit('close');
  alert(props.task ? 'Tarefa editada com sucesso!' : 'Tarefa adicionada com sucesso!');
}

const close = () => {
  emit('close');
}

watch(() => props.task, (nova) => {
  if (nova) {
    taskData.value = { ...nova }
  } else {
    taskData.value = {
      nome: '',
      data: '',
      horarioInicio: '',
      horarioFim: '',
      observacao: ''
    }
  }
}, { immediate: true })

const deleteTask = () => {
  if (!props.task) {
    emit('close');
    return;
  }

  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  tasks = tasks.filter(t =>
    !(
      t.nome === props.task.nome &&
      t.data === props.task.data &&
      t.horarioInicio === props.task.horarioInicio &&
      t.horarioFim === props.task.horarioFim
    )
  );

  localStorage.setItem('tasks', JSON.stringify(tasks));
  emit('close');
  alert('Tarefa excluída com sucesso!');
}
</script>

<style scoped>
.MenuAddTask-Form {
  padding: 64px 32px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  color: #818080;
  font-family: "Montserrat", sans-serif;
  font-weight: 400;
  font-style: normal;
}

.MenuAddTask-DateContainer {
  padding: 8px;
  text-align: justify;
  border: 1px solid #D9D9D9;
  border-radius: 8px;
}

.MenuAddTask-InputsContainer {
  height: 60px;
  padding: 4px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.MenuAddTask-Title {
  padding: 8px 4px;
}

.MenuAddTask-ButtonsContainer {
  display: flex;
  justify-content: space-around;
}

input[type="date"],
input[type="time"] {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 8px 10px;
  font-size: 16px;
  box-sizing: border-box;
  width: 200px;
}
</style>
<template>
  <div v-if="show">
    <div class="MenuAddTask-Overlay" @click.self="closeDrawer"></div>
    <v-navigation-drawer permanent width="500" location="right">
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
            <v-fab color="#137073" icon="mdi-plus" @click.stop="saveTask"></v-fab>
          </div>
        </div>
      </div>
    </v-navigation-drawer>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue'

const props = defineProps({
  show: Boolean,
  task: Object
})

const emit = defineEmits(['close', 'task-atualizada'])

const taskData = ref({
  id: null,
  nome: '',
  data: '',
  horarioInicio: '',
  horarioFim: '',
  observacao: ''
})

const closeDrawer = () => {
  emit('close')
}

const saveTask = () => {
  if (!taskData.value.nome || !taskData.value.data || !taskData.value.horarioInicio || !taskData.value.horarioFim) {
    alert('Por favor, preencha todos os campos obrigatórios');
    return;
  }

  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  if (taskData.value.id) {
    const index = tasks.findIndex(t => t.id === taskData.value.id);
    if (index !== -1) {
      tasks[index] = { ...taskData.value };
    }
    alert('Tarefa editada com sucesso!');
  } else {
    taskData.value.id = Date.now();
    tasks.push({ ...taskData.value });
    alert('Tarefa adicionada com sucesso!');
  }

  localStorage.setItem('tasks', JSON.stringify(tasks));
  emit('task-atualizada');
  closeDrawer();
}

const deleteTask = () => {
  if (!taskData.value.id) {
    closeDrawer();
    return;
  }

  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks = tasks.filter(t => t.id !== taskData.value.id);

  localStorage.setItem('tasks', JSON.stringify(tasks));
  emit('task-atualizada');
  alert('Tarefa excluída com sucesso!');
  closeDrawer();
}

watch(() => props.task, (novaTask) => {
  if (novaTask && novaTask.id) {
    taskData.value = { ...novaTask };
  } else {
    taskData.value = {
      id: null,
      nome: '',
      data: '',
      horarioInicio: '',
      horarioFim: '',
      observacao: ''
    };
  }
}, { immediate: true });

watch(() => props.show, (newVal) => {
  if (!newVal) {
    taskData.value = {
      id: null,
      nome: '',
      data: '',
      horarioInicio: '',
      horarioFim: '',
      observacao: ''
    };
  }
});
</script>

<style scoped>
.MenuAddTask-Overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 10;
}
.v-navigation-drawer {
  z-index: 11;
}
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
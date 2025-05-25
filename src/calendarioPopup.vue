<template>
    <div class="CalendarioPopup-CalendarioOverlay" @click.self="$emit('fechar')">
        <div class="CalendarioPopup-CalendarioPopup">
            <div class="CalendarioPopup-Cabecalho">
                <v-btn class="CalendarioPopup-Navegar" @click="anteriorMes">←</v-btn>
                <span class="CalendarioPopup-MesAno">{{ nomeMes }} {{ anoAtual }}</span>
                <v-btn class="CalendarioPopup-Navegar" @click="proximoMes">→</v-btn>
            </div>

            <div class="CalendarioPopup-DiasSemana">
                <div v-for="(dia, i) in diasSemana" :key="i">{{ dia }}</div>
            </div>

            <div class="CalendarioPopup-DiasMes">
                <div v-for="(semana, i) in semanasMes" :key="i" class="CalendarioPopup-Semana"
                    :class="{ 'CalendarioPopup-Selecionada': semanaSelecionada === i }" 
                    @click="semanaSelecionada = i">
                    <div v-for="(dia, j) in semana" :key="j" class="CalendarioPopup-Dia"
                        :class="{ 'CalendarioPopup-vazio': !dia.dia, 'CalendarioPopup-Fora': 
                        dia.foradoMes }">
                        {{ dia.dia || '' }}
                    </div>
                </div>
            </div>

            <div class="CalendarioPopup-RodapeBotao">
                <v-btn icon class="CalendarioPopup-BotaoCheck" @click="confirmarSelecao">✔</v-btn>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const emit = defineEmits(['confirmar-semana', 'fechar'])

const diasSemana = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const semanasMes = ref([])
const semanaSelecionada = ref(null)
const mesAtual = ref(new Date().getMonth())
const anoAtual = ref(new Date().getFullYear())

const nomeMes = computed(() => {
    const meses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ]
    return meses[mesAtual.value]
})

function gerarCalendario() {
    const primeiroDia = new Date(anoAtual.value, mesAtual.value, 1)
    const ultimoDia = new Date(anoAtual.value, mesAtual.value + 1, 0)
    const diaSemanaInicio = primeiroDia.getDay()

    const semanas = []
    let semanaAtual = []

    if (diaSemanaInicio !== 0) {
        const ultimoDiaAnterior = new Date(anoAtual.value, mesAtual.value, 0)
        const anoAnterior = ultimoDiaAnterior.getFullYear()
        const mesAnterior = ultimoDiaAnterior.getMonth()
        const ultimoDia = ultimoDiaAnterior.getDate()

        for (let i = diaSemanaInicio - 1; i >= 0; i--) {
            const dia = ultimoDia - i
            semanaAtual.push({
                dia,
                foradoMes: true,
                data: new Date(anoAnterior, mesAnterior, dia)
            })
        }
    }

    const totalDias = ultimoDia.getDate()
    for (let dia = 1; dia <= totalDias; dia++) {
        semanaAtual.push({
            dia,
            foradoMes: false,
            data: new Date(anoAtual.value, mesAtual.value, dia)
        })

        if (semanaAtual.length === 7) {
            semanas.push(semanaAtual)
            semanaAtual = []
        }
    }

    if (semanaAtual.length > 0) {
        const proximoMesData = new Date(anoAtual.value, mesAtual.value + 1, 1)
        const anoProx = proximoMesData.getFullYear()
        const mesProx = proximoMesData.getMonth()
        let dia = 1

        while (semanaAtual.length < 7) {
            semanaAtual.push({
                dia,
                foradoMes: true,
                data: new Date(anoProx, mesProx, dia)
            })
            dia++
        }

        semanas.push(semanaAtual)
    }

    semanasMes.value = semanas
}

function proximoMes() {
    if (mesAtual.value === 11) {
        mesAtual.value = 0
        anoAtual.value++
    } else {
        mesAtual.value++
    }
    gerarCalendario()
    semanaSelecionada.value = null
}

function anteriorMes() {
    if (mesAtual.value === 0) {
        mesAtual.value = 11
        anoAtual.value--
    } else {
        mesAtual.value--
    }
    gerarCalendario()
    semanaSelecionada.value = null
}

function confirmarSelecao() {
    if (semanaSelecionada.value !== null) {
        const semana = semanasMes.value[semanaSelecionada.value]
        const inicio = semana[0].data
        const fim = semana[6].data
        emit('confirmar-semana', { inicio, fim })
    }
}

onMounted(() => gerarCalendario())
</script>

<style scoped>
.CalendarioPopup-Cabecalho {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.5rem;
    font-weight: bold;
    color: #777;
}

.CalendarioPopup-Navegar {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #777;
}

.CalendarioPopup-MesAno {
    flex: 1;
    text-align: center;
}

.CalendarioPopup-DiasSemana {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    text-align: center;
    font-weight: bold;
    color: #888;
}

.CalendarioPopup-DiasMes {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
}

.CalendarioPopup-Semana {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    text-align: center;
    border-radius: 8px;
    transition: background-color 0.3s;
    cursor: pointer;
}

.CalendarioPopup-Semana:hover {
    background-color: #38A3A5;
    color: white;
}

.CalendarioPopup-Selecionada {
    background-color: #38A3A5 !important;
    color: white;
}

.CalendarioPopup-Fora {
    color: #bbb;
}

.CalendarioPopup-Dia {
    padding: 0.8rem 0;
}

.CalendarioPopup-RodapeBotao {
    display: flex;
    justify-content: flex-end;
    margin-top: 1rem;
}

.CalendarioPopup-BotaoCheck {
    background-color: #137073;
    color: white;
    font-size: 1.2rem;
}

.CalendarioPopup-BotaoCheck:hover {
    background-color: #38A3A5;
}

.CalendarioPopup-CalendarioOverlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    backdrop-filter: blur(2px);
    background-color: rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
}

.CalendarioPopup-CalendarioPopup {
    background-color: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
    width: 90vw;
    max-width: 650px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    position: relative;
    overflow: hidden;
}
</style>
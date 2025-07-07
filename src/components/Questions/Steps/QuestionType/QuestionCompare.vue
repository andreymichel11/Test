<template>
  <div class="container mx-auto" ref="tablesContainer">
    <div class="flex flex-col md:flex-row gap-6 relative" >
      <!-- SVG для отображения соединений -->
      <svg ref="connectionsSvg" class="connections-svg absolute top-0 left-0 w-full h-full pointer-events-none"></svg>
      <!-- Левая таблица -->
      <div class="flex w-full gap-4 flex-col md:flex-row">
        <div class="rounded-lg shadow-sm p-4 bg-gray-100 dark:bg-neutral-800 w-full md:w-[50%]">
          <div class="mb-4">
            <h2 class="text-lg font-semibold mb-2">Левая колонка</h2>
            <div class="flex items-center justify-between flex-wrap gap-2">
              <el-input v-model="newLeftItemValue" placeholder="Введите значение" size="large" class="flex-grow"/>
              <el-button type="primary" @click="addLeftItem" :disabled="!newLeftItemValue.trim()" size="large" class="ml-2">
                Добавить элемент
              </el-button>
            </div>
          </div>
          <el-table
              :data="leftTableData"
              style="width: 100%"
              border
              highlight-current-row
              @cell-dblclick="handleLeftRowChange"
              row-key="id"
          >
            <el-table-column prop="value" label="Значение">
              <template #default="{ row }">
                <div class="flex items-center justify-between">
                  <span>{{ row.value }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column width="70">
              <template #default="{ row }">
                <div class="flex items-center justify-between">
                  <el-button
                      type="danger"
                      size="small"
                      circle
                      @click="removeLeftItem(row.id)"
                      :disabled="row.connectedTo.length > 0">
                    <el-icon><Delete /></el-icon>
                  </el-button>
                  <div
                      :id="`left-dot-${row.id}`"
                      class="connection-dot"
                      :class="{ 'connected': row.connectedTo.length > 0 }"
                      :style="{ backgroundColor: row.connectedTo.length > 0 ? getConnectionColor(row.id) : 'gray' }"
                      @click="handleDotClick(row, 'left')"
                  ></div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- Правая таблица -->
        <div class="rounded-lg shadow-sm p-4 bg-gray-100 dark:bg-neutral-800 w-full md:w-[50%]">
          <div class="mb-4">
            <h2 class="text-lg font-semibold block mb-2">Правая колонка</h2>
            <div class="flex items-center justify-between flex-wrap gap-2">
              <el-input v-model="newRightItemValue" placeholder="Введите значение" size="large" class="flex-grow"/>
              <el-button type="primary" @click="addRightItem" :disabled="!newRightItemValue.trim()" size="large" class="ml-2">
                Добавить элемент
              </el-button>
            </div>
          </div>
          <el-table
              :data="rightTableData"
              style="width: 100%"
              border
              highlight-current-row
              @cell-dblclick="handleRightRowChange"
              row-key="id"
          >
            <el-table-column prop="value" label="Значение">
              <template #default="{ row }">
                <div class="flex items-center justify-between">
                  <div
                      :id="`right-dot-${row.id}`"
                      class="connection-dot"
                      :class="{ 'connected': row.connectedFrom.length > 0 }"
                      :style="{ backgroundColor: row.connectedFrom.length > 0 ? getConnectionColor(row.connectedFrom[0]) : 'gray' }"
                      @click="handleDotClick(row, 'right')"
                  ></div>
                  <span>{{ row.value }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column width="70">
              <template #default="{ row }">
                <el-button
                    type="danger"
                    size="small"
                    circle
                    @click="removeRightItem(row.id)"
                    :disabled="row.connectedFrom.length > 0"
                >
                  <el-icon><Delete /></el-icon>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <p v-if="rightTableData.length>0 && leftTableData.length>0" class="mt-2 text-md dark:text-gray-400 text-gray-500 text-center">Для установки соединения нажмите на нужную ячейку в левой таблице два раза и затем также на ячейку из правой таблицы.
      Также можно устанавливать соединение нажав на кружок на нужной ячейки.
      Для снятия соединение нажмите на кружок в ячейке</p>
    <div class="flex items-center justify-center mt-4">
      <el-button
          class="text-center"
          type="danger"
          @click="disconnectAll"
          v-if="Object.keys(connectionsObject).length !== 0"
      >
        Сбросить все соединения
      </el-button>
    </div>

    <div class="mt-6 rounded-lg" v-if="Object.keys(connectionsObject).length !== 0">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold">Правильный ответ:</h2>
      </div>
      <div class="mt-4">
        <el-tag type="success" effect="plain" size="large" v-for="variant in Object.keys(connectionsObject)" :key="variant" class="!p-2 bg-gray-100 dark:bg-neutral-700 inline-block rounded-md !text-base mr-2 mb-2">
          {{`${variant} - ${connectionsObject[variant]}`}}
        </el-tag>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, onUnmounted, watch, nextTick, onUpdated} from 'vue'
import { Delete } from '@element-plus/icons-vue'

import {useQuestionStore} from "../../../../store/QuestionStore.js";
const QuestionStore = useQuestionStore()
const props = defineProps({
  isUpdate: Boolean,
  isCode: Boolean,
})
// Данные таблиц
const leftTableData = ref([])
const rightTableData = ref([])

// Выбранные строки
const selectedLeftRow = ref(null)
const selectedRightRow = ref(null)

// Диалоги для добавления элементов
const newLeftItemValue = ref('')
const newRightItemValue = ref('')

// Соединения между элементами (Map с id левой таблицы -> id правой таблицы)
const connections = ref(new Map())

// SVG для отображения соединений
const connectionsSvg = ref(null)
const tablesContainer = ref(null)
let resizeObserver = null;

// Устанавливаем обработчик изменения размера окна
onMounted(() => {
  window.addEventListener('resize', drawConnections);

  // Используем ResizeObserver для отслеживания изменений размера контейнера
  if (window.ResizeObserver) {
    resizeObserver = new ResizeObserver(() => {
      drawConnections();
    });

    nextTick(() => {
      if (tablesContainer.value) {
        resizeObserver.observe(tablesContainer.value);
      }
    });
  }
});

// Удаляем обработчики при уничтожении компонента
onUnmounted(() => {
  window.removeEventListener('resize', drawConnections);
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});

watch(
    () => props.isUpdate,
    () => {
      if (props.isUpdate) {
        QuestionStore.newQuestion.variants.variants.forEach(variant => {
          variant.left.forEach((item, index) => {
            leftTableData.value.push({value:item,id:index+1, connectedTo:[]})
          })
          variant.right.forEach((item, index) => {
            rightTableData.value.push({value:item, id:index+1, connectedFrom:[]})
          })
          QuestionStore.newQuestion.answer.answer.forEach((item) => {
            Object.keys(item).forEach((key) => {
              const foundLeftObject = leftTableData.value.find(i => i.value == key);
              const foundRightObject = rightTableData.value.find(i => i.value == item[key]);
              connections.value.set(foundLeftObject.id, foundRightObject.id)
              foundLeftObject.connectedTo.push(foundRightObject.id);
              foundRightObject.connectedFrom.push(foundLeftObject.id);
            })
          })
        })
        tryDrawConnections();
      }
    },
    { immediate: true }
);

function tryDrawConnections(attempts = 5) {
  if (attempts <= 0) return;

  nextTick(() => {
    const allDotsExist = Array.from(connections.value.entries()).every(([leftId, rightId]) => {
      return document.getElementById(`left-dot-${leftId}`) && document.getElementById(`right-dot-${rightId}`);
    });

    if (allDotsExist) {
      drawConnections();
    } else {
      setTimeout(() => tryDrawConnections(attempts - 1), 100);
    }
  });
}

// Проверка возможности соединения
const canConnect = computed(() => {
  return selectedLeftRow.value &&
      selectedRightRow.value &&
      selectedLeftRow.value.connectedTo === null &&
      selectedRightRow.value.connectedFrom.length === 0
})

// Объект с результатами соединений
const connectionsObject = computed(() => {
  const result = {}
  leftTableData.value.forEach(leftItem => {
    if (leftItem.connectedTo.length > 0) {
      const rightItem = rightTableData.value.find(item => item.id === leftItem.connectedTo[0])
      if (rightItem) {
        result[leftItem.value] = rightItem.value
      }
    }
  })
  return result
})

// Цвета для соединений
const connectionColors = [
  '#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6',
  '#1abc9c', '#d35400', '#34495e', '#7f8c8d', '#c0392b'
]

// Получение цвета для соединения
function getConnectionColor(id) {
  return connectionColors[id % connectionColors.length]
}

// Функция для рисования соединений
function drawConnections() {
  if (!connectionsSvg.value || !tablesContainer.value) return;

  // Очищаем SVG перед перерисовкой
  while (connectionsSvg.value.firstChild) {
    connectionsSvg.value.removeChild(connectionsSvg.value.firstChild);
  }

  // Устанавливаем размеры SVG равными размерам контейнера
  const containerRect = tablesContainer.value.getBoundingClientRect();
  connectionsSvg.value.setAttribute('width', `${containerRect.width}`);
  connectionsSvg.value.setAttribute('height', `${containerRect.height}`);

  // Рисуем каждое соединение
  connections.value.forEach((rightId, leftId) => {
    const leftDot = document.getElementById(`left-dot-${leftId}`);
    const rightDot = document.getElementById(`right-dot-${rightId}`);

    if (leftDot && rightDot) {
      const leftRect = leftDot.getBoundingClientRect();
      const rightRect = rightDot.getBoundingClientRect();
      const containerRect = tablesContainer.value.getBoundingClientRect();

      // Вычисляем координаты относительно SVG
      const x1 = leftRect.left + leftRect.width / 2 - containerRect.left;
      const y1 = leftRect.top + leftRect.height / 2 - containerRect.top;
      const x2 = rightRect.left + rightRect.width / 2 - containerRect.left;
      const y2 = rightRect.top + rightRect.height / 2 - containerRect.top;

      // Создаем линию
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', x1);
      line.setAttribute('y1', y1);
      line.setAttribute('x2', x2);
      line.setAttribute('y2', y2);
      line.setAttribute('stroke', getConnectionColor(leftId));
      line.setAttribute('stroke-width', '2');

      connectionsSvg.value.appendChild(line);
    }
  });
}

function addLeftItem() {
  if (newLeftItemValue.value.trim()) {
    const id = leftTableData.value.length+1
    leftTableData.value.push({
      id,
      value: newLeftItemValue.value.trim(),
      connectedTo: []
    })

    newLeftItemValue.value = ''
    // Перерисовываем соединения после добавления элемента
    nextTick(() => {
      drawConnections()
    })
  }
}

function removeLeftItem(id) {
  const index = leftTableData.value.findIndex(item => item.id === id)
  if (index !== -1) {
    // Если удаляемый элемент был выбран, сбрасываем выбор
    if (selectedLeftRow.value && selectedLeftRow.value.id === id) {
      selectedLeftRow.value = null
      selectedRightRow.value = null
    }
    leftTableData.value.splice(index, 1)
    // Перерисовываем соединения после удаления элемента
    nextTick(() => {
      drawConnections()
    })
  }
}

function addRightItem() {
  if (newRightItemValue.value.trim()) {
    const id = rightTableData.value.length+1
    rightTableData.value.push({
      id,
      value: newRightItemValue.value.trim(),
      connectedFrom: []
    })
    newRightItemValue.value = ''
    // Перерисовываем соединения после добавления элемента
    nextTick(() => {
      drawConnections()
    })
  }
}

function removeRightItem(id) {
  const index = rightTableData.value.findIndex(item => item.id === id)
  if (index !== -1) {
    // Если удаляемый элемент был выбран, сбрасываем выбор
    if (selectedRightRow.value && selectedRightRow.value.id === id) {
      selectedLeftRow.value = null
      selectedRightRow.value = null
    }
    rightTableData.value.splice(index, 1)
    // Перерисовываем соединения после удаления элемента
    nextTick(() => {
      drawConnections()
    })
  }
}

// Обработчики выбора строк
function handleLeftRowChange(row) {
  selectedLeftRow.value = row

  // Если выбрана правая строка и левая строка не имеет соединения,
  // а правая строка не имеет входящих соединений, то создаем соединение
  if (selectedRightRow.value && row.connectedTo.length === 0 && selectedRightRow.value.connectedFrom.length === 0) {
    createConnection(row.id, selectedRightRow.value.id)
    selectedLeftRow.value = null
    selectedRightRow.value = null
  }
}

function handleRightRowChange(row) {
  selectedRightRow.value = row

  // Если выбрана левая строка и левая строка не имеет соединения,
  // а правая строка не имеет входящих соединений, то создаем соединение
  if (selectedLeftRow.value && selectedLeftRow.value.connectedTo.length === 0 && row.connectedFrom.length === 0) {
    createConnection(selectedLeftRow.value.id, row.id)
    selectedLeftRow.value = null
    selectedRightRow.value = null
  }
}

// Обработчик клика по точке соединения
function handleDotClick(row, side) {
  if (side === 'left') {
    // Если точка уже соединена, удаляем соединение
    if (row.connectedTo.length > 0) {
      const rightId = row.connectedTo[0]
      deleteConnection(row.id, rightId)
    } else {
      // Если точка не соединена, начинаем процесс соединения
      selectedLeftRow.value = row
      selectedRightRow.value = null
    }
  } else { // side === 'right'
    // Если точка уже соединена, удаляем соединение
    if (row.connectedFrom.length > 0) {
      const leftId = row.connectedFrom[0]
      deleteConnection(leftId, row.id)
    } else if (selectedLeftRow.value) {
      // Если левая точка выбрана, создаем соединение
      createConnection(selectedLeftRow.value.id, row.id)
      selectedLeftRow.value = null
    }
  }
}

// Создание соединения между элементами
function createConnection(leftId, rightId) {
  // Находим соответствующие объекты
  const leftItem = leftTableData.value.find(item => item.id === leftId)
  const rightItem = rightTableData.value.find(item => item.id === rightId)

  if (!leftItem || !rightItem) return

  // Если левый элемент уже соединен с другим правым, удаляем это соединение
  if (leftItem.connectedTo.length > 0) {
    const oldRightId = leftItem.connectedTo[0]
    deleteConnection(leftId, oldRightId)
  }

  // Если правый элемент уже соединен с другим левым, удаляем это соединение
  if (rightItem.connectedFrom.length > 0) {
    const oldLeftId = rightItem.connectedFrom[0]
    deleteConnection(oldLeftId, rightId)
  }

  // Создаем новое соединение
  connections.value.set(leftId, rightId)
  leftItem.connectedTo = [rightId]
  rightItem.connectedFrom = [leftId]

  // Перерисовываем соединения после добавления нового
  nextTick(() => {
    drawConnections()
  })
}

// Удаление соединения между элементами
function deleteConnection(leftId, rightId) {
  // Находим соответствующие объекты
  const leftItem = leftTableData.value.find(item => item.id === leftId)
  const rightItem = rightTableData.value.find(item => item.id === rightId)

  if (!leftItem || !rightItem) return

  // Удаляем соединение
  connections.value.delete(leftId)
  leftItem.connectedTo = []
  rightItem.connectedFrom = []

  // Перерисовываем соединения после удаления
  nextTick(() => {
    drawConnections()
  })
}

// Сброс всех соединений
function disconnectAll() {
  // Очищаем все соединения
  connections.value.clear()

  // Сбрасываем связи у всех элементов
  leftTableData.value.forEach(item => {
    item.connectedTo = []
  })

  rightTableData.value.forEach(item => {
    item.connectedFrom = []
  })

  // Сбрасываем выбранные строки
  selectedLeftRow.value = null
  selectedRightRow.value = null

  // Очищаем SVG
  if (connectionsSvg.value) {
    while (connectionsSvg.value.firstChild) {
      connectionsSvg.value.removeChild(connectionsSvg.value.firstChild)
    }
  }
}

// Перерисовываем соединения при обновлении компонента
onUpdated(() => {
  nextTick(() => {
    drawConnections()
  })
})
</script>

<style scoped>
.connections-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
}

.connection-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.connection-dot:hover {
  transform: scale(1.2);
}

.connection-dot.connected {
  border: 2px solid white;
}

.container {
  position: relative;
}
</style>

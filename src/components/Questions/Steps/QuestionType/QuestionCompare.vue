<template>
  <div class="h-full flex flex-col overflow-hidden" ref="tablesContainer">
    <!-- Tables Container -->
    <div class="flex-1 relative min-h-0">
      <!-- SVG для отображения соединений (только для десктопа) -->
      <svg v-if="!isMobile" ref="connectionsSvg" class="connections-svg absolute top-0 left-0 w-full h-full pointer-events-none z-10"></svg>

      <!-- Tables Grid -->
      <div class="h-full grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Левая таблица -->
        <div class="flex flex-col h-full">
          <div class="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl shadow-sm flex-1 flex flex-col min-h-0">
            <div class="p-3 border-b border-gray-200 dark:border-neutral-700 flex-shrink-0">
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-2">Левая колонка</h3>
              <div class="flex gap-2">
                <el-input
                    v-model="newLeftItemValue"
                    placeholder="Введите значение"
                    size="large"
                    class="flex-1"
                />
                <el-button
                    type="primary"
                    @click="addLeftItem"
                    :disabled="!newLeftItemValue.trim()"
                    size="large"
                    class="add-item-btn px-3"
                >
                  <i class="fa fa-plus"></i>
                </el-button>
              </div>
            </div>

            <div class="flex-1 overflow-hidden min-h-0">
              <el-table
                  :data="leftTableData"
                  style="width: 100%; height: 100%;"
                  border
                  highlight-current-row
                  @cell-dblclick="handleLeftRowChange"
                  row-key="id"
                  class="compact-table"
              >
                <el-table-column prop="value" label="Значение" min-width="120">
                  <template #default="{ row }">
                    <div class="p-3 rounded-lg transition-all duration-300"
                         :style="getRowStyle(row, 'left')">
                      <div class="flex items-center gap-2 mb-1">
                        <span class="text-gray-900 dark:text-white text-sm font-medium">{{ row.value }}</span>
                        <div v-if="row.connectedTo.length > 0"
                             class="w-5 h-5 rounded-full border-2 border-white shadow-lg"
                             :style="{ backgroundColor: getConnectionColor(row.id) }">
                        </div>
                      </div>
                      <div v-if="row.connectedTo.length > 0" class="text-xs font-bold"
                           :style="{ color: getConnectionColor(row.id) }">
                        → Соединено с правой стороной
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column width="100" align="center">
                  <template #default="{ row }">
                    <div class="flex items-center justify-between gap-1">
                      <el-button
                          type="danger"
                          size="small"
                          circle
                          @click="removeLeftItem(row.id)"
                          :disabled="row.connectedTo.length > 0"
                          class="action-btn"
                      >
                        <i class="fa fa-trash text-xs"></i>
                      </el-button>

                      <!-- Десктопная версия с точками -->
                      <div v-if="!isMobile"
                           :id="`left-dot-${row.id}`"
                           class="connection-dot"
                           :class="{ 'connected': row.connectedTo.length > 0 }"
                           :style="{ backgroundColor: row.connectedTo.length > 0 ? getConnectionColor(row.id) : '#9ca3af' }"
                           @click="handleDotClick(row, 'left')"
                      ></div>

                      <!-- Мобильная версия с кнопками -->
                      <el-button v-else
                                 :type="row.connectedTo.length > 0 ? 'success' : 'primary'"
                                 size="small"
                                 @click="handleMobileConnection(row, 'left')"
                                 class="mobile-connect-btn"
                      >
                        <i class="fa text-xs" :class="row.connectedTo.length > 0 ? 'fa-check' : 'fa-link'"></i>
                      </el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>

        <!-- Правая таблица -->
        <div class="flex flex-col h-full">
          <div class="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl shadow-sm flex-1 flex flex-col min-h-0">
            <div class="p-3 border-b border-gray-200 dark:border-neutral-700 flex-shrink-0">
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-2">Правая колонка</h3>
              <div class="flex gap-2">
                <el-input
                    v-model="newRightItemValue"
                    placeholder="Введите значение"
                    size="large"
                    class="flex-1"
                />
                <el-button
                    type="primary"
                    @click="addRightItem"
                    :disabled="!newRightItemValue.trim()"
                    size="large"
                    class="add-item-btn px-3"
                >
                  <i class="fa fa-plus"></i>
                </el-button>
              </div>
            </div>

            <div class="flex-1 overflow-hidden min-h-0">
              <el-table
                  :data="rightTableData"
                  style="width: 100%; height: 100%;"
                  border
                  highlight-current-row
                  @cell-dblclick="handleRightRowChange"
                  row-key="id"
                  class="compact-table"
              >
                <el-table-column width="100" align="center">
                  <template #default="{ row }">
                    <div class="flex items-center justify-between gap-1">
                      <!-- Десктопная версия с точками -->
                      <div v-if="!isMobile"
                           :id="`right-dot-${row.id}`"
                           class="connection-dot"
                           :class="{ 'connected': row.connectedFrom.length > 0 }"
                           :style="{ backgroundColor: row.connectedFrom.length > 0 ? getConnectionColor(row.connectedFrom[0]) : '#9ca3af' }"
                           @click="handleDotClick(row, 'right')"
                      ></div>

                      <!-- Мобильная версия с кнопками -->
                      <el-button v-else
                                 :type="row.connectedFrom.length > 0 ? 'success' : 'primary'"
                                 size="small"
                                 @click="handleMobileConnection(row, 'right')"
                                 class="mobile-connect-btn"
                      >
                        <i class="fa text-xs" :class="row.connectedFrom.length > 0 ? 'fa-check' : 'fa-link'"></i>
                      </el-button>

                      <el-button
                          type="danger"
                          size="small"
                          circle
                          @click="removeRightItem(row.id)"
                          :disabled="row.connectedFrom.length > 0"
                          class="action-btn"
                      >
                        <i class="fa fa-trash text-xs"></i>
                      </el-button>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="value" label="Значение" min-width="120">
                  <template #default="{ row }">
                    <div class="p-3 rounded-lg transition-all duration-300"
                         :style="getRowStyle(row, 'right')">
                      <div class="flex items-center gap-2 mb-1">
                        <div v-if="row.connectedFrom.length > 0"
                             class="w-4 h-4 rounded-full border-2 border-white shadow-md"
                             :style="{ backgroundColor: getConnectionColor(row.connectedFrom[0], row.id) }">
                        </div>
                        <span class="text-gray-900 dark:text-white text-sm font-medium">{{ row.value }}</span>
                      </div>
                      <div v-if="row.connectedFrom.length > 0" class="text-xs font-semibold"
                           :style="{ color: getConnectionColor(row.connectedFrom[0], row.id) }">
                        ← Соединено с левой стороной
                      </div>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Section -->
    <div class="flex-shrink-0 space-y-3 mt-4">
      <!-- Mobile Connection Helper -->
      <div v-if="isMobile && mobileSelectedLeft" class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-4">
        <p class="text-sm text-yellow-700 dark:text-yellow-300">
          <i class="fa fa-info-circle mr-2"></i>
          Выбран элемент "<strong>{{ mobileSelectedLeft.value }}</strong>". Теперь нажмите на элемент в правой колонке для создания соединения.
        </p>
      </div>

      <!-- Instructions -->
      <div v-if="rightTableData.length > 0 && leftTableData.length > 0" class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
        <p class="text-sm text-blue-700 dark:text-blue-300">
          <i class="fa fa-info-circle mr-2"></i>
          <span v-if="!isMobile">
            Дважды нажмите на ячейку в левой таблице, затем на ячейку в правой таблице для создания соединения.
            Или используйте цветные кружки.
          </span>
          <span v-else>
            Нажмите кнопку соединения в левой колонке, затем в правой колонке для создания связи.
          </span>
        </p>
      </div>

      <!-- Reset Button and Correct Answers in one row -->
      <div v-if="Object.keys(connectionsObject).length !== 0" class="flex flex-col lg:flex-row gap-4">
        <div class="flex-shrink-0">
          <el-button
              type="danger"
              @click="disconnectAll"
              size="small"
          >
            <i class="fa fa-times mr-1"></i>
            Сбросить соединения
          </el-button>
        </div>

        <!-- Correct Answers -->
        <div class="flex-1">
          <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Правильные соответствия ({{ Object.keys(connectionsObject).length }})
          </h4>
          <div class="flex gap-2 flex-wrap max-h-20 overflow-y-auto">
            <el-tag
                v-for="variant in Object.keys(connectionsObject)"
                :key="variant"
                type="success"
                size="small"
                class="px-2 py-1"
            >
              {{ variant }} → {{ connectionsObject[variant] }}
            </el-tag>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="leftTableData.length === 0 && rightTableData.length === 0" class="text-center py-12">
        <div class="w-16 h-16 bg-gray-100 dark:bg-neutral-700 rounded-xl flex items-center justify-center mx-auto mb-4">
          <i class="fa fa-exchange text-gray-400 text-xl"></i>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Создайте элементы для сопоставления
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
          Добавьте элементы в обе колонки и создайте соединения между ними
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, onUnmounted, watch, nextTick, onUpdated} from 'vue'
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

// Мобильные состояния
const mobileSelectedLeft = ref(null)
const isMobile = ref(false)

// Диалоги для добавления элементов
const newLeftItemValue = ref('')
const newRightItemValue = ref('')

// Соединения между элементами
const connections = ref(new Map())

// SVG для отображения соединений
const connectionsSvg = ref(null)
const tablesContainer = ref(null)
let resizeObserver = null;

// Проверка мобильного устройства
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

// Устанавливаем обработчик изменения размера окна
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', () => {
    checkMobile()
    if (!isMobile.value) {
      drawConnections()
    }
  });

  if (window.ResizeObserver) {
    resizeObserver = new ResizeObserver(() => {
      if (!isMobile.value) {
        drawConnections()
      }
    });

    nextTick(() => {
      if (tablesContainer.value) {
        resizeObserver.observe(tablesContainer.value);
      }
    });
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
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
              const foundLeftObject = leftTableData.value.find(i => i.value === key);
              const foundRightObject = rightTableData.value.find(i => i.value === item[key]);
              if (foundLeftObject && foundRightObject) {
                connections.value.set(foundLeftObject.id, foundRightObject.id)
                foundLeftObject.connectedTo.push(foundRightObject.id);
                foundRightObject.connectedFrom.push(foundLeftObject.id);
              }
            })
          })
        })
        tryDrawConnections();
      }
    },
    { immediate: true }
);

// Обновляем данные в store при изменении соединений
watch([leftTableData, rightTableData, connections], () => {
  // Обновляем variants
  QuestionStore.newQuestion.variants.variants = [{
    left: leftTableData.value.map(item => item.value),
    right: rightTableData.value.map(item => item.value)
  }]

  // Обновляем answer
  const answers = []
  leftTableData.value.forEach(leftItem => {
    if (leftItem.connectedTo.length > 0) {
      const rightItem = rightTableData.value.find(item => item.id === leftItem.connectedTo[0])
      if (rightItem) {
        answers.push({
          [leftItem.value]: rightItem.value
        })
      }
    }
  })
  QuestionStore.newQuestion.answer.answer = answers
}, { deep: true })

function tryDrawConnections(attempts = 5) {
  if (attempts <= 0 || isMobile.value) return;

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
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
  '#06b6d4', '#f97316', '#84cc16', '#ec4899', '#6366f1'
]

// Получение цвета для соединения на основе индекса соединения
function getConnectionColor(leftId, rightId = null) {
  // Находим индекс соединения в Map
  const connectionIndex = Array.from(connections.value.keys()).findIndex(key =>
      key === leftId || connections.value.get(key) === leftId
  )

  // Если соединение не найдено, используем комбинацию ID
  if (connectionIndex === -1) {
    const combinedId = (leftId || 0) + (rightId || 0)
    return connectionColors[combinedId % connectionColors.length]
  }

  return connectionColors[connectionIndex % connectionColors.length]
}

// Получение стилей для строки
function getRowStyle(row, side) {
  const isConnected = side === 'left' ? row.connectedTo.length > 0 : row.connectedFrom.length > 0

  if (!isConnected) {
      return {
        backgroundColor: localStorage.getItem('data-theme') === 'dark' ? '#454545' : '#ffffff'
      }
  }

  let color
  if (side === 'left') {
    color = getConnectionColor(row.id)
  } else {
    color = getConnectionColor(row.connectedFrom[0])
  }

  return {
    backgroundColor: color + '30', // 30% прозрачности для лучшей видимости
    border: `3px solid ${color}`,
    boxShadow: `0 2px 4px ${color}40`
  }
}

// Функция для рисования соединений
function drawConnections() {
  if (!connectionsSvg.value || !tablesContainer.value || isMobile.value) return;

  while (connectionsSvg.value.firstChild) {
    connectionsSvg.value.removeChild(connectionsSvg.value.firstChild);
  }

  const containerRect = tablesContainer.value.getBoundingClientRect();
  connectionsSvg.value.setAttribute('width', `${containerRect.width}`);
  connectionsSvg.value.setAttribute('height', `${containerRect.height}`);

  connections.value.forEach((rightId, leftId) => {
    const leftDot = document.getElementById(`left-dot-${leftId}`);
    const rightDot = document.getElementById(`right-dot-${rightId}`);

    if (leftDot && rightDot) {
      const leftRect = leftDot.getBoundingClientRect();
      const rightRect = rightDot.getBoundingClientRect();
      const containerRect = tablesContainer.value.getBoundingClientRect();

      const x1 = leftRect.left + leftRect.width / 2 - containerRect.left;
      const y1 = leftRect.top + leftRect.height / 2 - containerRect.top;
      const x2 = rightRect.left + rightRect.width / 2 - containerRect.left;
      const y2 = rightRect.top + rightRect.height / 2 - containerRect.top;

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', x1);
      line.setAttribute('y1', y1);
      line.setAttribute('x2', x2);
      line.setAttribute('y2', y2);
      line.setAttribute('stroke', getConnectionColor(leftId, rightId));
      line.setAttribute('stroke-width', '3');

      connectionsSvg.value.appendChild(line);
    }
  });
}

// Мобильная версия соединения
function handleMobileConnection(row, side) {
  if (side === 'left') {
    if (row.connectedTo.length > 0) {
      // Если уже соединен, отключаем
      const rightId = row.connectedTo[0]
      deleteConnection(row.id, rightId)
      mobileSelectedLeft.value = null
    } else {
      // Выбираем левый элемент
      mobileSelectedLeft.value = row
    }
  } else { // right
    if (row.connectedFrom.length > 0) {
      // Если уже соединен, отключаем
      const leftId = row.connectedFrom[0]
      deleteConnection(leftId, row.id)
    } else if (mobileSelectedLeft.value) {
      // Создаем соединение
      createConnection(mobileSelectedLeft.value.id, row.id)
      mobileSelectedLeft.value = null
    }
  }
}

function addLeftItem() {
  if (newLeftItemValue.value.trim()) {
    const id = Date.now() + Math.random() // Уникальный ID
    leftTableData.value.push({
      id,
      value: newLeftItemValue.value.trim(),
      connectedTo: []
    })

    newLeftItemValue.value = ''
    nextTick(() => {
      if (!isMobile.value) {
        drawConnections()
      }
    })
  }
}

function removeLeftItem(id) {
  const index = leftTableData.value.findIndex(item => item.id === id)
  if (index !== -1) {
    if (selectedLeftRow.value && selectedLeftRow.value.id === id) {
      selectedLeftRow.value = null
      selectedRightRow.value = null
    }
    if (mobileSelectedLeft.value && mobileSelectedLeft.value.id === id) {
      mobileSelectedLeft.value = null
    }
    leftTableData.value.splice(index, 1)
    nextTick(() => {
      if (!isMobile.value) {
        drawConnections()
      }
    })
  }
}

function addRightItem() {
  if (newRightItemValue.value.trim()) {
    const id = Date.now() + Math.random() // Уникальный ID
    rightTableData.value.push({
      id,
      value: newRightItemValue.value.trim(),
      connectedFrom: []
    })
    newRightItemValue.value = ''
    nextTick(() => {
      if (!isMobile.value) {
        drawConnections()
      }
    })
  }
}

function removeRightItem(id) {
  const index = rightTableData.value.findIndex(item => item.id === id)
  if (index !== -1) {
    if (selectedRightRow.value && selectedRightRow.value.id === id) {
      selectedLeftRow.value = null
      selectedRightRow.value = null
    }
    rightTableData.value.splice(index, 1)
    nextTick(() => {
      if (!isMobile.value) {
        drawConnections()
      }
    })
  }
}

function handleLeftRowChange(row) {
  selectedLeftRow.value = row

  if (selectedRightRow.value && row.connectedTo.length === 0 && selectedRightRow.value.connectedFrom.length === 0) {
    createConnection(row.id, selectedRightRow.value.id)
    selectedLeftRow.value = null
    selectedRightRow.value = null
  }
}

function handleRightRowChange(row) {
  selectedRightRow.value = row

  if (selectedLeftRow.value && selectedLeftRow.value.connectedTo.length === 0 && row.connectedFrom.length === 0) {
    createConnection(selectedLeftRow.value.id, row.id)
    selectedLeftRow.value = null
    selectedRightRow.value = null
  }
}

function handleDotClick(row, side) {
  if (side === 'left') {
    if (row.connectedTo.length > 0) {
      const rightId = row.connectedTo[0]
      deleteConnection(row.id, rightId)
    } else {
      selectedLeftRow.value = row
      selectedRightRow.value = null
    }
  } else {
    if (row.connectedFrom.length > 0) {
      const leftId = row.connectedFrom[0]
      deleteConnection(leftId, row.id)
    } else if (selectedLeftRow.value) {
      createConnection(selectedLeftRow.value.id, row.id)
      selectedLeftRow.value = null
    }
  }
}

function createConnection(leftId, rightId) {
  const leftItem = leftTableData.value.find(item => item.id === leftId)
  const rightItem = rightTableData.value.find(item => item.id === rightId)

  if (!leftItem || !rightItem) return

  if (leftItem.connectedTo.length > 0) {
    const oldRightId = leftItem.connectedTo[0]
    deleteConnection(leftId, oldRightId)
  }

  if (rightItem.connectedFrom.length > 0) {
    const oldLeftId = rightItem.connectedFrom[0]
    deleteConnection(oldLeftId, rightId)
  }

  connections.value.set(leftId, rightId)
  leftItem.connectedTo = [rightId]
  rightItem.connectedFrom = [leftId]

  nextTick(() => {
    if (!isMobile.value) {
      drawConnections()
    }
  })
}

function deleteConnection(leftId, rightId) {
  const leftItem = leftTableData.value.find(item => item.id === leftId)
  const rightItem = rightTableData.value.find(item => item.id === rightId)

  if (!leftItem || !rightItem) return

  connections.value.delete(leftId)
  leftItem.connectedTo = []
  rightItem.connectedFrom = []

  nextTick(() => {
    if (!isMobile.value) {
      drawConnections()
    }
  })
}

function disconnectAll() {
  connections.value.clear()

  leftTableData.value.forEach(item => {
    item.connectedTo = []
  })

  rightTableData.value.forEach(item => {
    item.connectedFrom = []
  })

  selectedLeftRow.value = null
  selectedRightRow.value = null
  mobileSelectedLeft.value = null

  if (connectionsSvg.value) {
    while (connectionsSvg.value.firstChild) {
      connectionsSvg.value.removeChild(connectionsSvg.value.firstChild)
    }
  }
}

onUpdated(() => {
  nextTick(() => {
    if (!isMobile.value) {
      drawConnections()
    }
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
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.connection-dot:hover {
  transform: scale(1.2);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.connection-dot.connected {
  border: 2px solid white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
}

.add-item-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border: none;
  color: white;
  border-radius: 8px;
  transition: all 0.3s ease;
  width: 40px;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
}

.add-item-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
}

.add-item-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.action-btn {
  width: 24px;
  height: 24px;
}

.mobile-connect-btn {
  width: 32px;
  height: 24px;
  padding: 0;
  border-radius: 4px;
}

/* Element Plus Table Styling */
:deep(.compact-table) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.compact-table .el-table__body-wrapper) {
  max-height: calc(100% - 40px);
}

:deep(.compact-table .el-table th) {
  background: #f8fafc;
  border-color: #e2e8f0;
  padding: 12px 8px;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}

:deep(.compact-table .el-table td) {
  border-color: #f1f5f9;
  padding: 4px;
  vertical-align: middle;
}

:deep(.compact-table .el-table__row) {
  transition: all 0.3s ease;
}

:deep(.compact-table .el-table tbody tr:hover > td) {
  background-color: #f8fafc;
}

:deep(.dark .compact-table .el-table th) {
  background: #262626;
  border-color: #404040;
  color: #f3f4f6;
}

:deep(.dark .compact-table .el-table td) {
  border-color: #374151;
}

:deep(.dark .compact-table .el-table tbody tr:hover > td) {
  background-color: #374151;
}

/* Element Plus Input Styling */
:deep(.el-input__wrapper) {
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  padding: 8px 12px;
  transition: all 0.3s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

:deep(.el-input__wrapper:hover) {
  border-color: #3b82f6;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.1);
}

:deep(.el-input__wrapper.is-focus) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

:deep(.dark .el-input__wrapper) {
  background: #262626;
  border-color: #404040;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

:deep(.dark .el-input__wrapper:hover) {
  border-color: #3b82f6;
  background: #2d2d2d;
}

/* Scrollbar styling */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .add-item-btn {
    width: 100%;
    margin-top: 8px;
    height: 40px;
  }

  .connection-dot {
    width: 14px;
    height: 14px;
  }

  .grid-cols-1 {
    gap: 12px;
  }
  
  :deep(.compact-table .el-table th) {
    padding: 10px 6px;
    font-size: 12px;
  }
  
  :deep(.compact-table .el-table td) {
    padding: 2px;
  }
}
</style>
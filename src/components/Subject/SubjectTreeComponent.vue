<script setup>
import { SlVueTreeNext } from "sl-vue-tree-next";
import { useRoute } from "vue-router";
import { computed, ref } from "vue";

const props = defineProps({
  subjects: Object,
  select: Function
});

const route = useRoute();
const selectedNodePath = ref([]);

const getCount = (node) => {
  if (route.path === '/test') {
    return node.approved_question_count || 0;
  }
  return node.question_count || 0;
};

// Функция для определения цвета папки
const getFolderIconColor = (node) => {
  if (node.isLeaf) {
    return 'var(--color-main-text)';
  }

  const count = getCount(node.data);
  if (count > 0) {
    return '#10b981'; // Зеленый если есть вопросы
  } else {
    return '#f59e0b'; // Желтый если пустая папка
  }
};

// Функция для получения пути к узлу
const getNodePath = (node, subjects, path = []) => {
  for (const subject of subjects) {
    const currentPath = [...path, subject.title];
    if (subject.title === node.title) {
      return currentPath;
    }
    if (subject.children && subject.children.length > 0) {
      const childPath = getNodePath(node, subject.children, currentPath);
      if (childPath) {
        return childPath;
      }
    }
  }
  return null;
};

// Функция для проверки является ли узел дочерним для выбранного
const isChildOfSelected = (node) => {
  if (selectedNodePath.value.length === 0) return false;

  const nodePath = getNodePath(node, props.subjects);
  if (!nodePath) return false;

  // Проверяем, начинается ли путь узла с пути выбранного узла
  return nodePath.length > selectedNodePath.value.length &&
      selectedNodePath.value.every((pathItem, index) => nodePath[index] === pathItem);
};

// Обертка для функции select
const handleSelect = (selectedNodes) => {
  if (selectedNodes && selectedNodes.length > 0) {
    const selectedNode = selectedNodes[0];
    selectedNodePath.value = getNodePath(selectedNode, props.subjects) || [];

    if (props.select) {
      props.select(selectedNodes);
    }
  } else {
    selectedNodePath.value = [];
  }
};
</script>

<template>
  <sl-vue-tree-next
      :model-value="props.subjects"
      ref="tree"
      class="!border-none"
      @select="handleSelect"
  >
    <template #title="{ node }">
      <span class="item-icon">
        <i
            v-if="!node.isLeaf && !node.isExpanded"
            class="fa fa-folder-o"
            :style="{ color: getFolderIconColor(node) }"
        ></i>
        <i
            v-else-if="!node.isLeaf && node.isExpanded"
            class="fa fa-folder-open-o"
            :style="{ color: getFolderIconColor(node) }"
        ></i>
        <i
            v-else
            class="fa fa-question"
            :style="{ color: getFolderIconColor(node) }"
        ></i>
      </span>
      <div class="inline-flex" :class="{ 'child-selected': isChildOfSelected(node) }">
        <span class="cursor-pointer p-0 m-0 p-2">
          {{ node.title.split('_').join(' ') }}
        </span>
        <el-badge
            :offset="[50, 18]"
            :value="getCount(node.data)"
            :hidden="getCount(node.data) === 0"
            class="item"
            type="primary"
        />
      </div>
    </template>

    <template #toggle="{ node }">
      <span v-if="!node.isLeaf && node.children.length" class="cursor-pointer pl-2 pr-3">
        <i v-if="node.isExpanded" class="fa fa-chevron-down"></i>
        <i v-if="!node.isExpanded" class="fa fa-chevron-right"></i>
      </span>
      <span v-else class="pl-2 pr-3"></span>
    </template>
  </sl-vue-tree-next>
</template>

<style scoped>
.item-icon {
  display: inline-block;
  text-align: left;
  width: 20px;
  margin: 0 8px 0 5px;
}

.subject-tree-container {
  font-family: inherit;
}

/* Tree Node Styling */
:deep(.sl-vue-tree-next-node) {
  padding: 2px 0;
  border-radius: 0.5rem;
  /* Убираем transition для быстрой смены темы */
}

/* Tree text colors - no transitions for instant theme change */
:deep(.sl-vue-tree-next-node-item span) {
  color: inherit;
  /* Убираем transition для мгновенной смены темы */
}

/* Hover effects only for backgrounds, not text */
:deep(.sl-vue-tree-next-node):hover {
  background-color: rgba(59, 130, 246, 0.05);
}

/* Selected Node Styling */
:deep(.sl-vue-tree-next-selected > .sl-vue-tree-next-node-item) {
  background-color: var(--color-main-text) !important;
  color: white !important;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

:deep(.sl-vue-tree-next-selected > .sl-vue-tree-next-node-item):hover {
  background-color: var(--color-main-hover-text) !important;
}

/* Dark theme selected hover - darker */
:deep(.dark .sl-vue-tree-next-selected > .sl-vue-tree-next-node-item):hover {
  background-color: #4b5563 !important; /* Slightly lighter than base dark color */
}

/* Selected node - make toggle arrow more visible in dark mode */
:deep(.sl-vue-tree-next-selected > .sl-vue-tree-next-node-item .fa-chevron-down),
:deep(.sl-vue-tree-next-selected > .sl-vue-tree-next-node-item .fa-chevron-right) {
  color: rgba(255, 255, 255, 0.9) !important;
}

/* Child nodes - keep arrows dark */
:deep(.child-selected .fa-chevron-down),
:deep(.child-selected .fa-chevron-right) {
  color: #6b7280 !important;
}

/* Selected node - make ONLY selected node icons white, not children */
:deep(.sl-vue-tree-next-selected > .sl-vue-tree-next-node-item i[class*="fa-folder"]),
:deep(.sl-vue-tree-next-selected > .sl-vue-tree-next-node-item i[class*="fa-question"]) {
  color: rgba(255, 255, 255, 0.9) !important;
}

/* Child Selected Nodes - Pale background */
.child-selected {

  border-radius: 6px !important;
  padding: 4px 6px !important;
  margin: 1px 0 !important;
  /* Быстрый transition */
  /*transition: background-color 0.1s ease !important;*/
}

:deep(.child-selected) {
  border-radius: 6px !important;
  padding: 4px 6px !important;
  margin: 1px 0 !important;
}

/* Only make text white in selected nodes, not children */
:deep(.sl-vue-tree-next-selected > .sl-vue-tree-next-node-item span:not(.item-icon)) {
  color: white !important;
}

/* Dark theme child selected */
:deep(.dark .child-selected) {
  background-color: rgba(59, 130, 246, 0.25) !important;
}

/* Light theme - keep original color */
:deep(.sl-vue-tree-next-selected > .sl-vue-tree-next-node-item) {
  background-color: var(--color-main-text) !important;
  color: white !important;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

:deep(.sl-vue-tree-next-selected > .sl-vue-tree-next-node-item):hover {
  background-color: var(--color-main-hover-text) !important;
}

/* Dark theme selected hover - darker */
:deep(.dark .sl-vue-tree-next-selected > .sl-vue-tree-next-node-item):hover {
  background-color: #4b5563 !important; /* Slightly lighter than base dark color */
}

/* Dark theme selected state - darker color with immediate change */
:deep(.dark .sl-vue-tree-next-selected > .sl-vue-tree-next-node-item) {
  background-color: #374151 !important; /* Darker gray instead of bright main color */
  color: white !important;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Dark theme selected state */
:deep(.dark .sl-vue-tree-next-selected > .sl-vue-tree-next-node-item) {
  background-color: var(--color-main-text) !important;
  color: white !important;
}

/* Node Item Styling */
:deep(.sl-vue-tree-next-node-item) {
  padding: 4px 8px;
  border-radius: 0.5rem;
  /* Быстрый transition только для hover эффектов */
  /*transition: background-color 0.1s ease;*/
  display: flex;
  align-items: center;
  width: 100%;
}

/* Drag and Drop Styling */
:deep(.sl-vue-tree-next-drag-info) {
  background-color: rgba(59, 130, 246, 0.1);
  border: 2px dashed #3b82f6;
  border-radius: 0.5rem;
}

:deep(.sl-vue-tree-next-drop-position-marker) {
  background-color: #3b82f6;
  height: 2px;
  border-radius: 1px;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .mobile-tree :deep(.sl-vue-tree-next-node-item) {
    padding: 8px;
    font-size: 0.9rem;
  }

  .mobile-tree :deep(.sl-vue-tree-next-node) {
    padding: 4px 0;
  }
}

/* Custom Scrollbar for Tree - no transitions */
:deep(.sl-vue-tree-next-sidebar) {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 transparent;
}

:deep(.sl-vue-tree-next-sidebar)::-webkit-scrollbar {
  width: 6px;
}

:deep(.sl-vue-tree-next-sidebar)::-webkit-scrollbar-track {
  background: transparent;
}

:deep(.sl-vue-tree-next-sidebar)::-webkit-scrollbar-thumb {
  background-color: #cbd5e0;
  border-radius: 3px;
  /* Убираем transition */
}

:deep(.dark .sl-vue-tree-next-sidebar)::-webkit-scrollbar-thumb {
  background-color: #4b5563;
}

/* Animation for expand/collapse only */
:deep(.sl-vue-tree-next-children) {
  transition: height 0.3s ease, opacity 0.3s ease;
}

/* Focus states for accessibility */
:deep(.sl-vue-tree-next-node-item):focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Loading state */
:deep(.sl-vue-tree-next-loading) {
  opacity: 0.6;
  pointer-events: none;
}
</style>
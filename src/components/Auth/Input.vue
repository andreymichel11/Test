<template>
  <div class="auth-input-container">
    <label 
        v-if="props.label" 
        :for="props.label" 
        class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"
    >
      {{ props.label }}
      <span v-if="props.required" class="text-red-500 ml-1">*</span>
    </label>
    <el-input
        :id="props.label"
        @input="newValue"
        :placeholder="props.placeholder || props.label"
        v-model="value"
        :name="props.label"
        :type="props.type"
        autocomplete="off"
        :required="props.required"
        size="large"
        class="auth-input"
        :class="{
          'error': hasError,
          'success': hasSuccess
        }"
    />
    
    <!-- Error message -->
    <div v-if="hasError && errorMessage" class="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
      <i class="fa fa-exclamation-circle text-xs"></i>
      {{ errorMessage }}
    </div>
    
    <!-- Success message -->
    <div v-if="hasSuccess && successMessage" class="mt-2 text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
      <i class="fa fa-check-circle text-xs"></i>
      {{ successMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  type: {
    type: String,
    default: 'text'
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  pr: {
    type: String,
    default: ''
  },
  rules: {
    type: Array,
    default: () => []
  },
  required: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  success: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update-data', 'update:modelValue'])

const value = ref(props.modelValue || '')

// Computed properties for validation states
const hasError = computed(() => {
  return Boolean(props.error)
})

const hasSuccess = computed(() => {
  return Boolean(props.success)
})

const errorMessage = computed(() => {
  return props.error
})

const successMessage = computed(() => {
  return props.success
})

// Watch for external modelValue changes
watch(() => props.modelValue, (newVal) => {
  value.value = newVal || ''
})

// Handle input changes
const newValue = () => {
  emit('update-data', value.value, props.pr)
  emit('update:modelValue', value.value)
}
</script>

<style scoped>
.auth-input-container {
  margin-bottom: 1rem;
}

/* Element Plus Input Styling */
:deep(.auth-input .el-input__wrapper) {
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  padding: 12px 16px;
  transition: all 0.3s ease;
  background: #ffffff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  min-height: 48px;
}

:deep(.auth-input .el-input__wrapper:hover) {
  border-color: #3b82f6;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.1);
}

:deep(.auth-input .el-input__wrapper.is-focus) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

:deep(.auth-input .el-input__inner) {
  color: #1f2937;
  font-size: 16px;
  line-height: 1.5;
  font-weight: 400;
}

:deep(.auth-input .el-input__inner::placeholder) {
  color: #9ca3af;
  font-weight: 400;
}

/* Error state */
:deep(.auth-input.error .el-input__wrapper) {
  border-color: #ef4444;
  background: #fef2f2;
}

:deep(.auth-input.error .el-input__wrapper:hover),
:deep(.auth-input.error .el-input__wrapper.is-focus) {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

/* Success state */
:deep(.auth-input.success .el-input__wrapper) {
  border-color: #10b981;
  background: #f0fdf4;
}

:deep(.auth-input.success .el-input__wrapper:hover),
:deep(.auth-input.success .el-input__wrapper.is-focus) {
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

/* Dark theme */
:deep(.dark .auth-input .el-input__wrapper) {
  background: #262626;
  border-color: #404040;
  color: #f9fafb;
}

:deep(.dark .auth-input .el-input__inner) {
  color: #f9fafb;
}

:deep(.dark .auth-input .el-input__inner::placeholder) {
  color: #6b7280;
}

:deep(.dark .auth-input .el-input__wrapper:hover) {
  border-color: #3b82f6;
  background: #2d2d2d;
}

:deep(.dark .auth-input .el-input__wrapper.is-focus) {
  border-color: #3b82f6;
  background: #2d2d2d;
}

/* Dark theme error state */
:deep(.dark .auth-input.error .el-input__wrapper) {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

/* Dark theme success state */
:deep(.dark .auth-input.success .el-input__wrapper) {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.1);
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  :deep(.auth-input .el-input__wrapper) {
    padding: 10px 14px;
    min-height: 44px;
  }
  
  :deep(.auth-input .el-input__inner) {
    font-size: 16px; /* Prevents zoom on iOS */
  }
  
  .auth-input-container {
    margin-bottom: 0.75rem;
  }
}

/* Focus visible for accessibility */
:deep(.auth-input .el-input__wrapper:focus-visible) {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
</style>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'text'].includes(value)
  },
  size: {
    type: String,
    default: 'large',
    validator: (value) => ['large', 'default', 'small'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    default: ''
  },
  iconPosition: {
    type: String,
    default: 'left',
    validator: (value) => ['left', 'right'].includes(value)
  },
  round: {
    type: Boolean,
    default: false
  },
  circle: {
    type: Boolean,
    default: false
  },
  plain: {
    type: Boolean,
    default: false
  },
  block: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

// Computed class for button styling
const buttonClass = computed(() => {
  const classes = ['unified-button']
  
  if (props.type) classes.push(`unified-button--${props.type}`)
  if (props.size) classes.push(`unified-button--${props.size}`)
  if (props.block) classes.push('unified-button--block')
  if (props.round) classes.push('unified-button--round')
  if (props.plain) classes.push('unified-button--plain')
  
  return classes.join(' ')
})

// Handle click event
const handleClick = (event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<template>
  <el-button
      :type="type"
      :size="size"
      :disabled="disabled"
      :loading="loading"
      :round="round"
      :circle="circle"
      :plain="plain"
      :class="buttonClass"
      @click="handleClick"
  >
    <!-- Left icon -->
    <i v-if="icon && iconPosition === 'left'" :class="`fa ${icon}`" class="mr-2"></i>
    
    <!-- Button text/content -->
    <span v-if="title || $slots.default">
      <slot>{{ title }}</slot>
    </span>
    
    <!-- Right icon -->
    <i v-if="icon && iconPosition === 'right'" :class="`fa ${icon}`" class="ml-2"></i>
  </el-button>
</template>

<style scoped>
/* Base unified button styles */
:deep(.unified-button) {
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

/* Size variants */
:deep(.unified-button--large) {
  height: 48px;
  padding: 0 32px;
  font-size: 16px;
  line-height: 1.5;
}

:deep(.unified-button--default) {
  height: 40px;
  padding: 0 24px;
  font-size: 14px;
  line-height: 1.4;
}

:deep(.unified-button--small) {
  height: 32px;
  padding: 0 16px;
  font-size: 12px;
  line-height: 1.3;
}

/* Primary button */
:deep(.unified-button--primary) {
  background: #3b82f6;
  color: white;
}

:deep(.unified-button--primary:hover:not(:disabled)) {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

:deep(.unified-button--primary:active) {
  background: #1d4ed8;
  transform: translateY(0);
}

/* Secondary button */
:deep(.unified-button--secondary) {
  background: #f8fafc;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

:deep(.unified-button--secondary:hover:not(:disabled)) {
  background: #f1f5f9;
  border-color: #cbd5e1;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Success button */
:deep(.unified-button--success) {
  background: #10b981;
  color: white;
}

:deep(.unified-button--success:hover:not(:disabled)) {
  background: #059669;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

/* Warning button */
:deep(.unified-button--warning) {
  background: #f59e0b;
  color: white;
}

:deep(.unified-button--warning:hover:not(:disabled)) {
  background: #d97706;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

/* Danger button */
:deep(.unified-button--danger) {
  background: #ef4444;
  color: white;
}

:deep(.unified-button--danger:hover:not(:disabled)) {
  background: #dc2626;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

/* Info button */
:deep(.unified-button--info) {
  background: #8b5cf6;
  color: white;
}

:deep(.unified-button--info:hover:not(:disabled)) {
  background: #7c3aed;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

/* Text button */
:deep(.unified-button--text) {
  background: transparent;
  color: #3b82f6;
  border: none;
}

:deep(.unified-button--text:hover:not(:disabled)) {
  background: rgba(59, 130, 246, 0.1);
  color: #2563eb;
}

/* Block button */
:deep(.unified-button--block) {
  width: 100%;
}

/* Round button */
:deep(.unified-button--round) {
  border-radius: 24px;
}

/* Plain variants */
:deep(.unified-button--plain.unified-button--primary) {
  background: transparent;
  color: #3b82f6;
  border: 1px solid #3b82f6;
}

:deep(.unified-button--plain.unified-button--primary:hover:not(:disabled)) {
  background: #3b82f6;
  color: white;
}

/* Disabled state */
:deep(.unified-button:disabled) {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

/* Loading state */
:deep(.unified-button.is-loading) {
  pointer-events: none;
}

/* Dark theme */
:deep(.dark .unified-button--secondary) {
  background: #262626;
  color: #d1d5db;
  border-color: #404040;
}

:deep(.dark .unified-button--secondary:hover:not(:disabled)) {
  background: #404040;
  border-color: #525252;
}

:deep(.dark .unified-button--text) {
  color: #60a5fa;
}

:deep(.dark .unified-button--text:hover:not(:disabled)) {
  background: rgba(96, 165, 250, 0.1);
  color: #93c5fd;
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  :deep(.unified-button--large) {
    height: 44px;
    padding: 0 24px;
    font-size: 15px;
  }
  
  :deep(.unified-button--default) {
    height: 38px;
    padding: 0 20px;
    font-size: 13px;
  }
  
  :deep(.unified-button--small) {
    height: 30px;
    padding: 0 12px;
    font-size: 11px;
  }
  
  /* Reduce transforms on mobile for better performance */
  :deep(.unified-button:hover:not(:disabled)) {
    transform: none;
  }
}

/* Focus styles for accessibility */
:deep(.unified-button:focus-visible) {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
</style>
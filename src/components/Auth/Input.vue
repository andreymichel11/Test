<template>
  <div class="mt-2">
    <input
        :id="props.label"
        @input="newValue"
        :placeholder="props.label"
        v-model="value"
        :name="props.label"
        :type="props.type"
        :autocomplete="false"
        autocomplete="off"
        required
        class="h-[3rem] dark:text-white p-2 block w-full rounded-md focus:outline-none border-0 py-1.5 text-(--color-main-text) shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-(--color-main-text) focus:ring-2 focus:ring-inset focus:ring-(--color-main-text) sm:text-sm/6 "
    >
  </div>
</template>

<script setup>
import {ref} from "vue";

const props = defineProps({
  type: String,
  label: String,
  pr:String
})
const value = ref('')
const emit = defineEmits(['update-data']);

const newValue = () => {
  emit('update-data', value.value, props.pr);
};
</script>

<style scoped>

</style>

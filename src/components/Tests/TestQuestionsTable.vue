<script setup>

import SubjectQuestions from "../Subject/SubjectQuestions.vue";
import {useTestStore} from "../../store/TestStore.js";

const TestStore = useTestStore()
</script>

<template>
  <div class="rounded-xl shadow-2xl bg-white dark:bg-neutral-800 px-6 py-4  mt-10 flex flex-col justify-start h-[90%]  overflow-scroll w-full relative">
    <SubjectQuestions :questions="TestStore.preparedQuestions"/>
  </div>
</template>

<style scoped>

</style>
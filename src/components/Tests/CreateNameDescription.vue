<script setup>
import {useTestStore} from "../../store/TestStore.js";

const props = defineProps({
  next: Function,
  home: Function,
})
const TestStore = useTestStore()
</script>

<template>
  <div class="flex flex-col mt-10 justify-center items-center text-2xl w-full" >
    <el-form label-position="top" class="w-[50%]">
      <el-row>
        <el-col >
          <el-form-item label="Название теста">
            <el-input size="large" v-model="TestStore.testQuestions.name" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="Описание">
            <el-input size="large" v-model="TestStore.testQuestions.description" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div>
      <el-button type="primary" size="large" class="mt-10" @click="next" v-if="TestStore.testQuestions.name.trim().length>0">Продолжить</el-button>
      <el-button type="warning" size="large" class="mt-10" plain  @click="home">Вернуться на главную</el-button>
    </div>
  </div>
</template>

<style scoped>

</style>
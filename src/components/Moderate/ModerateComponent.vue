<script setup>
import QuestionBlock from "../Subject/QuestionInfo/QuestionBlock.vue";
import {reactive} from "vue";
import {useQuestionStore} from "../../store/QuestionStore.js";

const QuestionStore = useQuestionStore()
const moderate = reactive({
  approve: false,
  comment:''
})

const submit = (status) => {
  moderate.approve = status
  QuestionStore.moderateQuestion(moderate)
}
</script>

<template>
    <QuestionBlock/>
    <div class="mt-4">
      <div class="flex w-full gap-2" >
        <el-form-item class="w-full" label="Комментарий"  label-position="top">
          <el-input size="large" v-model="moderate.comment"/>
        </el-form-item>
      </div>
      <el-button size="large"  type="success" plain @click="submit(true)">Одобрить</el-button>
      <el-button size="large" type="danger" plain  @click="submit(false)">Отказать</el-button>
    </div>
</template>

<style scoped>

</style>
<script setup>
import {useQuestionStore} from "../../../store/QuestionStore.js";
import {computed} from "vue";
const QuestionStore = useQuestionStore()

const props = defineProps({
  next: Function,
  home: Function
})
function findTypeById(id) {
  return QuestionStore.types.find(item => item.id === id);
}

const typeDescription = computed(() => {
  const type = findTypeById(QuestionStore.newQuestion.type_id).id
  switch (type.name) {
    case 'текст':
      return 'Данные тип вопроса позволяет вводить ответ в произвольной письменной форме'
    case 'тест':
      return 'Данный тип вопроса позволяет выбирать один или несколько ответов из представленных вариантов'
    case 'сопоставление':
      return 'Данный тип вопроса позволяет сопоставлять значения из одной таблицы с значениями из другой'
  }
})

</script>

<template>
  <div class="flex flex-col mt-10 justify-center items-center text-2xl" >
<!--    <img src="../../../assets/types.svg" alt="" class="w-[20%]" >-->
    <h1 class="dark:text-gray-400 text-gray-500 mt-5">Выберите тип вопроса из выпадающего списка</h1>
    <el-select v-model="QuestionStore.newQuestion.type_id" class="!w-[500px] mt-10" size="large" placeholder="Выберите тип вопроса">
      <el-option v-for="type in QuestionStore.types"
                 :key="type.id"
                 :label="type.name[0].toUpperCase() + type.name.slice(1)"
                 :value="type.id"
      />
    </el-select>
    <p v-if="QuestionStore.newQuestion.type_id!==null" class="text-lg dark:text-gray-400 text-gray-500 mt-5 w-[500px] text-center">
      {{typeDescription}}
    </p>
    <div>
      <el-button type="primary" size="large" class="mt-10" v-if="QuestionStore.newQuestion.type_id!==null" @click="next">Продолжить</el-button>
      <el-button type="warning" size="large" class="mt-10" plain  @click="home">{{QuestionStore.isCreateQuestionOpened?'Вернуться к тематикам':'Вернуться на главную'}}</el-button>
    </div>
  </div>
</template>

<style scoped>

</style>
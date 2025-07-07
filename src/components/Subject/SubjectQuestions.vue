<script setup>
import {whatStatus} from '../../utils/utils.js'
import {useRoute} from "vue-router";
import {useTestStore} from "../../store/TestStore.js";
import {Delete, View} from "@element-plus/icons-vue";
const route = useRoute()
const props = defineProps({
  questions: Array,
  setQuestions: Function,
  openModal: Function,
})

const TestStore = useTestStore()
const test = (row, event) => {
  if (event) {
    TestStore.testQuestions.question_ids.push(row.id)
    TestStore.preparedQuestions.push(row)
  } else {
    const index = TestStore.testQuestions.question_ids.indexOf(row.id);
    if (index !== -1) {
      TestStore.testQuestions.question_ids.splice(index, 1);
    }
    TestStore.preparedQuestions = TestStore.preparedQuestions.filter(item => item.id !== row.id);
  }

}
</script>

<template>
  <el-table :data="questions" highlight-current-row @current-change="setQuestions" >
    <el-table-column width="50" v-if="route.path.toLowerCase()=== '/test'">
      <template #default="scope">
        <el-checkbox v-model="scope.row.isTest" @change="test(scope.row, $event)"/>
      </template>
    </el-table-column>
    <el-table-column prop="text" label="Текст вопроса" width="400" />
    <el-table-column prop="type.name" label="Тип" sortable>
      <template  #default="scope">
        <el-tag
            :type="whatStatus(scope.row.type.name)"
        >
          {{scope.row.type.name[0].toUpperCase() + scope.row.type.name.slice(1)}}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="subject_name" label="Тематика" v-if="route.path!=='/subjects'" sortable>
      <template  #default="scope">
        {{scope.row.subject_name.split('_').join(' ')}}
      </template>
    </el-table-column>
    <el-table-column prop="status" label="Статус">
      <template #default="scope">
        <el-tag
            :type="whatStatus(scope.row.status)"
            effect="dark"
            round
        >
          {{scope.row.status[0].toUpperCase() + scope.row.status.slice(1)}}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="creator.user_name" label="Создал" />
    <el-table-column prop="moderator.user_name" label="Модератор">
      <template #default="scope">
        {{scope.row.moderator.user_name? scope.row.moderator.user_name :"---"}}
      </template>
    </el-table-column>
    <el-table-column prop="created_at" label="Дата создания" sortable>
      <template #default="scope">
        {{scope.row.created_at.split('T')[0]}}
      </template>
    </el-table-column>
    <el-table-column  label="Просмотр" v-if="route.path==='/tests'"  align="center" width="100">
      <template  #default="scope">
        <el-icon class="cursor-pointer hover:opacity-45" @click="openModal(scope.row)"><View/></el-icon>
      </template>
    </el-table-column>
  </el-table>

</template>

<style scoped>

</style>
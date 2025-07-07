<script setup>
import {reactive} from "vue";
import {useSubjectStore} from "../../store/SubjectStore.js";

const SubjectStore = useSubjectStore()

const props = defineProps({
  isTop: Boolean,
})

const newSubject = reactive({
  name: '',
  description: null,
  comment: null,
})

const close = () => {
  newSubject.name = ''
  newSubject.parent_id = null
  SubjectStore.setCreateIsOpened()
}

const createSubject = () => {
  if (!props.isTop) {
    newSubject.parent_id = SubjectStore.selectSubject.id
  }
  SubjectStore.addSubject(newSubject).then(() => {
    close()
  })
}

</script>

<template>
  <el-dialog :title="isTop?'Создать корневую тематику':'Создать подтематику'" center width="30%" v-model="SubjectStore.createIsOpened"  :before-close="close">

    <el-form>
      <el-row :gutter="40">
        <el-col >
          <el-form-item label="Название тематики" label-position="top">
            <el-input v-model="newSubject.name" size="large"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="flex gap-2">
        <el-button type="primary" @click="createSubject" size="large" plain>Добавить тематику</el-button>
        <el-button type="danger" @click="close" size="large" plain>Отмена</el-button>
      </el-row>
    </el-form>
  </el-dialog>
</template>


<style scoped>

</style>
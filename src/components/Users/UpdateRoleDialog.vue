<template>
  <el-dialog title="Обновить пользователя" center width="30%" v-model="UsersStore.updateIsOpened">
    <el-form>
      <el-row :gutter="40">
        <el-col :span="12">
          <el-form-item label="Логин" label-position="top">
            <el-input v-model="UsersStore.updateUser.user_name" disabled size="large"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" >
          <el-form-item label="Дата создания" label-position="top">
            <el-input v-model="UsersStore.updateUser.created_at" disabled size="large"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="Роль" label-position="top">
            <el-select size="large" v-model="UsersStore.updateUser.role_name">
              <el-option v-for="role in props.roles" :key="role.id" :label="role.name" :value="role.name"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="flex gap-2">
        <el-button type="primary" @click="update" size="large" plain>Обновить</el-button>
        <el-button type="danger" @click="close" size="large" plain>Отмена</el-button>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script setup>
import {useUsersStore} from "../../store/UsersStore.js";

const UsersStore = useUsersStore()

const props = defineProps({
  roles: Array,
  close: Function,
  update: Function
})
</script>
<style scoped>

</style>
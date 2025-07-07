<template>
  <el-table :data="UsersStore.getUsersSlice" size="large">
    <el-table-column prop="login" label="Логин" width="180" />
    <el-table-column prop="user_name" label="Псевдоним" width="180" />
    <el-table-column prop="role_name" label="Роль" min-width="150">
      <template  #default="scope">
        <UserRole :type="scope.row.role_name"/>
      </template>
    </el-table-column>
    <el-table-column prop="created_at" label="Дата создания"  min-width="100"/>
    <el-table-column  label="Управление"  align="right" min-width="100"  >
      <template  #default="scope">
        <div class="flex gap-2 justify-end">
          <el-button @click="updateOpen(scope.row)" type="warning"><el-icon  class="cursor-pointer hover:opacity-75" ><Edit /></el-icon><p class="ml-2 max-lg:hidden">Изменить</p></el-button>
<!--          <el-popconfirm title="Вы уверены что хотите удалить данного пользователя?" width="220" @confirm="UsersStore.delUser(scope.row)">-->
<!--            <template #reference>-->
<!--              <el-button  type="danger"><el-icon class="cursor-pointer hover:opacity-75" ><Delete /></el-icon><p class="ml-2 max-lg:hidden">Удалить</p></el-button>-->
<!--            </template>-->
<!--            <template #actions="{ confirm, cancel }">-->
<!--              <el-button-->
<!--                  type="danger"-->
<!--                  size="small"-->
<!--                  @click="confirm"-->
<!--              >-->
<!--                Да?-->
<!--              </el-button>-->
<!--              <el-button size="small" @click="cancel">Нет!</el-button>-->
<!--            </template>-->
<!--          </el-popconfirm>-->
<!--          <el-icon size="large" class="cursor-pointer hover:opacity-75" @click="updateOpen(scope.row)"><Edit /></el-icon>-->
<!--          <el-icon size="large" class="cursor-pointer hover:opacity-75" @click="UsersStore.delUser(scope.row.user_name)"><Delete /></el-icon>-->
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>

import {Edit} from "@element-plus/icons-vue";
import {useUsersStore} from "../../store/UsersStore.js";
import UserRole from "./UserRole.vue";

const UsersStore = useUsersStore()

const updateOpen = (user) => {
  UsersStore.setUpdateUser(JSON.parse(JSON.stringify(user)))
  UsersStore.setUpdateIsOpened()
}
</script>

<style scoped>

</style>
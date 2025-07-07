<template>
<!--  <el-breadcrumb :separator-icon="ArrowRight" class="mt-10">-->
<!--    <el-breadcrumb-item :to="{ path: '/' }">Главная</el-breadcrumb-item>-->
<!--    <el-breadcrumb-item>Управление пользователями</el-breadcrumb-item>-->
<!--  </el-breadcrumb>-->
  <div class=" bg-white p-2 mt-10  m-auto drop-shadow-xl dark:bg-[#212121] rounded-md" >
    <div v-if="UsersStore.users.length">
      <UserTable/>
      <el-pagination
          class="mx-auto flex justify-center mt-5 "
          v-model:current-page="UsersStore.currentPage"
          v-model:page-size="UsersStore.pageSize"
          :page-sizes="[10,20,40]"
          :total="UsersStore.users.length"
          layout="sizes, prev, pager,next, total"
          background
      />
    </div>
    <el-empty v-else/>
  </div>

  <UpdateRoleDialog v-model="UsersStore.updateIsOpened" :roles="UsersStore.roles" :close="close" :update="updateUser"/>
 </template>

<script setup>
import {useUsersStore} from "../store/UsersStore.js";
import {onMounted} from "vue";
import {useAuthStore} from "../store/AuthStore.js";
import {ArrowRight} from "@element-plus/icons-vue";
import UpdateRoleDialog from "../components/Users/UpdateRoleDialog.vue";
import UserTable from "../components/Users/UserTable.vue";

const UsersStore = useUsersStore()
const AuthStore = useAuthStore()

onMounted(()=> {
  UsersStore.getUsers()
  if (UsersStore.getRole === 'admin') {
    UsersStore.getRoles()
  }
})

const close = () => {
  UsersStore.setUpdateUser({})
  UsersStore.setUpdateIsOpened()
}

const updateUser = () => {
  UsersStore.updateUserFunc(UsersStore.updateUser)
  UsersStore.setUpdateIsOpened()
  UsersStore.setUpdateUser({})
}
</script>

<style scoped>

</style>

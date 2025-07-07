<template>
  <header class="header " style="border-radius: 10px;
" >
    <p style="user-select: none;" class="text-(--color-main-text) font-black text-xl">Test Project</p>
    <div class="header__right" v-if="AuthStore.access_token!==null">
      <el-badge  :value="SubjectStore.statistic?.question_to_moderate_count" :hidden="SubjectStore.statistic?.question_to_moderate_count===0" class="item h-[25px]" type="danger" >
        <el-icon size="25" class="!text-(--el-text-color-regular) hover:!text-(--color-main-hover-text) cursor-pointer transition-colors duration-150 ease-in" @click="router.push({name:'Moderate'})"><Bell/></el-icon>
      </el-badge>
      <el-avatar class="ml-6">{{UsersStore.getFirstLetter}}</el-avatar>
      <el-dropdown trigger="click">
        <p class="header__user">{{UsersStore.getUser}}  <el-icon><ArrowDown/></el-icon></p>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item :icon="QuestionFilled" @click="router.push({name:'NewQuestion'})">Добавить вопрос</el-dropdown-item>
            <el-dropdown-item v-if="UsersStore.getRole !=='creator'" :icon="EditPen" @click="router.push({name:'Moderate'})">Модерация вопросов</el-dropdown-item>
            <el-dropdown-item v-if="UsersStore.getRole ==='admin'" :icon="Folder" @click="router.push({name:'Subjects'})">Управление тематиками</el-dropdown-item>
            <el-dropdown-item v-if="UsersStore.getRole ==='admin'" :icon="User" @click="router.push({name:'Users'})">Управление пользователями</el-dropdown-item>
            <el-divider class="!m-0"/>
            <el-dropdown-item :icon="dark?'Sunny':'Moon'" @click="changeTheme">Сменить тему </el-dropdown-item>
            <el-dropdown-item :icon="SwitchButton" @click="logOutFunc">Выйти</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
  <NavPath v-if="AuthStore.access_token!==null && route.path!=='/' && route.path!=='/404'" />
</template>

<script setup>


import {EditPen, Folder, QuestionFilled, SwitchButton, User} from "@element-plus/icons-vue";
import {useRouter, useRoute} from "vue-router";
import {ref} from "vue";
import {useAuthStore} from "../../store/AuthStore.js";
import NavPath from "./NavPath.vue";
import {useSubjectStore} from "../../store/SubjectStore.js";
import {useUsersStore} from "../../store/UsersStore.js";
const dark= ref(false)
const router = useRouter()
const route = useRoute()
const AuthStore = useAuthStore()
const UsersStore = useUsersStore()
const SubjectStore = useSubjectStore()

const logOutFunc = () => {
  router.push({name: "Auth"})
  AuthStore.logOut()
}

const changeTheme = () => {
  const theme = localStorage.getItem("data-theme")
  const html = document.querySelector('html')
  html.classList.toggle("dark")
  if (theme==="dark") {
    dark.value = false
    localStorage.setItem('data-theme', 'light')
    document.documentElement.removeAttribute("data-theme")
  } else {
    localStorage.setItem('data-theme', 'dark')
    dark.value = true
    document.documentElement.setAttribute("data-theme", "dark")
  }

}
</script>

<style scoped>


.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  width: 100%;
  box-sizing: border-box;
}



.header__right {
  display: flex;
  align-items: center;
}

.header__user {
  margin: 0 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}
</style>

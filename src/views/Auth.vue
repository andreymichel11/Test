<script setup>

import Input from "../components/Auth/Input.vue";
import {useAuthStore} from "../store/AuthStore.js";
import {useRouter} from "vue-router";
import {computed, reactive} from "vue";
import {useSubjectStore} from "../store/SubjectStore.js";
import {useUsersStore} from "../store/UsersStore.js";


const router = useRouter()
const SubjectStore = useSubjectStore()
const AuthStore = useAuthStore()
const UsersStore = useUsersStore()
const user = reactive({
  user_name:'',
  password:''
})

const updateData = (newValue, label) => {
  user[label] = newValue;
};

const checkUser = computed(() => {
  return !(user.user_name.toString().trim().length && user.password.toString().trim().length);
})

const login = () => {
  if (!checkUser.value) {
    AuthStore.LogIn(user).then(() => {
      router.push({name:"Main"})
    })
  }
}
</script>

<template>
  <div class="grid grid-cols-3 grid-rows-1 max-2xl:grid-cols-1 max-2xl:grid-rows-2 max-w-[1920px] m-auto">
    <div class="col-span-1 flex justify-end mt-36 max-2xl:mt-8">
      <div class="flex flex-col justify-center w-full max-2xl:items-center">
        <h1 class="text-8xl font-black text-(--color-main-text) 2xl:max-w-xl z-5 max-2xl:w-full max-2xl:text-center max-md:text-6xl max-sm:text-4xl">Добро пожаловать</h1>
        <p class="text-2xl font-normal text-(--color-main-text) 2xl:max-w-lg max-2xl:text-center mt-16 z-5 max-md:text-xl">Создавайте тесты для студентов,
          используя обширную базу вопросов по
          разным тематикам...</p>
      </div>
    </div>
    <div class="col-span-2 z-1 w-full h-full">
      <div class="2xl:mt-[113px]  w-full h-full flex justify-center relative max-2xl:justify-start">
        <div class=" bg-(image:--auth-bg-image-new) bg-cover bg-no-repeat w-[735px] h-[551px] max-md:hidden"></div>
        <div class="absolute test bg-white dark:bg-neutral-800 right-0 top-1/3  w-1/2 max-2xl:top-0 max-md:w-full max-md:mt-10 flex items-center pl-[20px] pr-[20px]">
          <div class="mt-5 mx-auto w-full max-w-sm">
            <h1>Войдите в свой аккаунт</h1>
            <div class="space-y-6">
              <Input
                  @keyup.enter="login"
                  :type="'text'"
                  :label="'Login'"
                  :pr="'user_name'"
                  :value="user.user_name"
                  @update-data="updateData"
              />
              <Input
                  @keyup.enter="login"
                  :type="'password'"
                  :label="'Password'"
                  :pr="'password'"
                  :value="user.password"
                  @update-data="updateData"
              />
              <div>
                <button  @click="login" :disabled="checkUser" class="cursor-pointer  mt-10 h-[3rem] flex w-full justify-center items-center rounded-md bg-(--color-main-text) px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-(--color-main-hover-text) focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:bg-(--color-main-disable)">Войти</button>
              </div>
              <el-alert v-if="AuthStore.errText!==undefined" :description="AuthStore.errText.message" center show-icon type="error" :closable="false" class="text-center"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.test {
  border-radius: 13px;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.25);
  max-width: 500px;
  padding-top: 30px;
  padding-bottom: 30px;
}
</style>

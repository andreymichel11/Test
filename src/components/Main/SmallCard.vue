<script setup>
import {ref} from "vue";
import {useRouter} from "vue-router";
const router = useRouter()
const props = defineProps({
  title: String,
  count: Number,
  isGo: Boolean,
  go: String
})

const count = ref(0)
let animated = ref(false)


setTimeout(function () {
  clearInterval(intervalClear)
  animated.value = true
}, 1000)

const intervalClear = setInterval(function() {
  count.value = Math.floor(Math.random() * 500);
}, 40)

</script>

<template>
  <div class="w-full h-[250px] rounded-xl shadow-2xl bg-white dark:bg-neutral-800 px-6 py-4 relative">
    <div class="flex items-center justify-between ">
      <h2 class="text-left text-sm font-normal text-(--color-main-text)">{{props.title}}</h2>
<!--      <div class="fa fa-external-link text-(&#45;&#45;el-text-color-regular) hover:text-(&#45;&#45;color-main-hover-text) cursor-pointer"></div>-->
    </div>
    <div class="flex flex-col h-full justify-center ">
      <p class="flex justify-center items-center text-center  text-9xl font-bold text-(--color-main-text)">{{!animated?count:props.count!==undefined?props.count:0}}</p>
      <div>
        <p v-if="isGo" @click="router.push({name:go})" class="text-right text-(--color-main-text) hover:text-(--color-main-hover-text) text-sm cursor-pointer float-right">Перейти <span class=" fa fa-long-arrow-right"/></p>
      </div>
    </div>
  </div>
</template>


<style>

</style>
<script setup>
import {computed, nextTick, onMounted, onUnmounted, ref, watch, watchEffect} from "vue";
import NavBar from "./components/NavBar/NavBar.vue";
import {useSubjectStore} from "./store/SubjectStore.js";
import {useAuthStore} from "./store/AuthStore.js";
import {useRoute} from "vue-router";

const route = useRoute();


const SubjectStore = useSubjectStore()
const AuthStore = useAuthStore()
const socket = ref(null);

// Функция для создания соединения WebSocket
const createWebSocketConnection = () => {
  // Проверяем, существует ли уже соединение
  if (socket.value && socket.value.readyState !== WebSocket.CLOSED) {
    return;
  }

  // Создаем новое соединение, только если есть токен и не на странице логина
  if (AuthStore.access_token && route.path !== '/login') {
    socket.value = new WebSocket(`ws://192.168.12.120/notifications/ws?access_token=${AuthStore.access_token}`);

    socket.value.onopen = () => {
      socket.value.send(1);
      console.log('WebSocket соединение открыто');
    };

    socket.value.onmessage = (e) => {
      console.log(e.data);
    };

    socket.value.onclose = (e) => {
      console.log('WebSocket соединение закрыто', e.wasClean);
      socket.value = null;
    };

    socket.value.onerror = (error) => {
      console.error('WebSocket ошибка:', error);
    };
  }
};

// Функция для закрытия соединения
const closeWebSocketConnection = () => {
  if (socket.value && socket.value.readyState !== WebSocket.CLOSED) {
    socket.value.close();
    socket.value = null;
  }
};

// Следим за изменением токена и создаем соединение при его появлении
watch(() => AuthStore.access_token, (newToken) => {
  if (newToken && route.path !== '/login') {
    createWebSocketConnection();
  } else {
    closeWebSocketConnection();
  }
});

// Следим за изменением маршрута
watch(() => route.path, (newPath) => {
  if (newPath === '/login') {
    closeWebSocketConnection();
  } else if (AuthStore.access_token && !socket.value) {
    createWebSocketConnection();
  }
});

const theme = localStorage.getItem("data-theme");
// Создаем соединение при монтировании компонента, если есть токен и не на странице логина
onMounted(() => {
  if (AuthStore.access_token && route.path !== '/login') {
    createWebSocketConnection();
    SubjectStore.getStatistic()
  }
  if (theme === 'dark') {
    document.querySelector("html").classList.add("dark");
    document.documentElement.setAttribute('data-theme', 'dark');
  }
});




</script>

<template>
  <NavBar v-if="AuthStore.access_token && route.path !== '/login'"/>
  <router-view/>
</template>

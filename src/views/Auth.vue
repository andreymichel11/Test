<script setup>
import Input from "../components/Auth/Input.vue";
import {useAuthStore} from "../store/AuthStore.js";
import {useRouter} from "vue-router";
import {computed, reactive, ref} from "vue";


const router = useRouter()
const AuthStore = useAuthStore()


const user = reactive({
  user_name: '',
  password: ''
})

const errors = reactive({
  user_name: '',
  password: ''
})

const isLoading = ref(false)
const showForm = ref(false)

// Показать форму с анимацией после загрузки компонента
setTimeout(() => {
  showForm.value = true
}, 300)

const updateData = (newValue, label) => {
  user[label] = newValue;
  // Очистить ошибку при изменении поля
  if (errors[label]) {
    errors[label] = '';
  }
};

const validateField = (field, value) => {
  switch (field) {
    case 'user_name':
      if (!value.trim()) {
        return 'Имя пользователя обязательно для заполнения';
      }
      if (value.length < 3) {
        return 'Имя пользователя должно содержать минимум 3 символа';
      }
      if (!/^[a-zA-Z0-9_]+$/.test(value)) {
        return 'Имя пользователя может содержать только буквы, цифры и подчеркивания';
      }
      break;
    case 'password':
      if (!value.trim()) {
        return 'Пароль обязателен для заполнения';
      }
      if (value.length < 6) {
        return 'Пароль должен содержать минимум 6 символов';
      }
      break;
    default:
      return '';
  }
  return '';
};

const validateForm = () => {
  let isValid = true;

  // Валидация имени пользователя
  const userNameError = validateField('user_name', user.user_name);
  if (userNameError) {
    errors.user_name = userNameError;
    isValid = false;
  }

  // Валидация пароля
  const passwordError = validateField('password', user.password);
  if (passwordError) {
    errors.password = passwordError;
    isValid = false;
  }

  return isValid;
};

const checkUser = computed(() => {
  return !(user.user_name.toString().trim().length && user.password.toString().trim().length);
})

const login = async () => {
  if (!validateForm()) {
    return;
  }

  if (!checkUser.value) {
    isLoading.value = true;
    try {
      await AuthStore.LogIn(user);
      router.push({name: "Main"});
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      isLoading.value = false;
    }
  }
}

</script>

<template>
  <header >

    <div class="px-4 sm:px-6 py-2">
      <div class="flex justify-between items-center h-11">
        <!-- Logo with gradient -->
        <div class="flex items-center gap-3">
          <div class="w-7 h-7 bg-[color:var(--color-main-text)] rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-xs select-none">T</span>
          </div>
          <h1 class="text-lg font-bold text-[color:var(--color-main-text)] select-none">
            Test Project
          </h1>
        </div>
      </div>
    </div>
  </header>
<!--  <div class=" bg-(image:&#45;&#45;auth-bg-image-new) bg-cover bg-no-repeat w-[735px] h-[551px] max-md:hidden absolute bottom-0 right-[25%] -z-5"></div>-->
  <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 items-center  max-w-[1920px] mx-auto" style="min-height: calc(100vh - 100px)">

    <!-- Левая часть - Приветствие -->
    <div class="order-1 text-center lg:text-left lg:col-span-2" >
      <div class="animate-fade-in-up">
        <h1 class="title text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-(--color-main-text) dark:text-white mb-6 lg:mb-8 leading-tight">
          Добро пожаловать
        </h1>
        <p class="text-lg sm:text-xl md:text-2xl font-normal text-(--color-main-text) dark:text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
          Создавайте тесты для студентов, используя обширную базу вопросов по разным тематикам...
        </p>
      </div>
    </div>

    <!-- Правая часть - Форма авторизации -->
    <div class="order-2 flex justify-center  lg:col-span-2  max-lg:self-start">
      <div class="w-full max-w-xl">
        <Transition name="slide-fade" appear>
          <div v-if="showForm" class="auth-form bg-[#ffffff00] dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 transform transition-all duration-300 hover:shadow-3xl">
            <div class="text-center mb-8">
              <h2 class="text-xl font-bold lg:text-left text-(--color-main-text) dark:text-white mb-2">
                Войдите в свой аккаунт
              </h2>

            </div>

            <el-form @submit.prevent="login" class="space-y-4" >
              <!-- Поле логина -->
              <div class="form-group">

                  <Input
                      @keyup.enter="login"
                      :type="'text'"
                      :label="'Имя пользователя'"
                      :pr="'user_name'"
                      :value="user.user_name"
                      @update-data="updateData"
                      :class="{ 'error': errors.user_name }"
                  />
                <Transition name="error-fade">
                  <div :style="errors.user_name? 'visibility:visible': 'visibility:hidden'"   class="error-message text-red-500 text-sm mt-2 flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    {{ errors.user_name }}
                  </div>
                </Transition>
              </div>

              <!-- Поле пароля -->
              <div class="form-group">
                <Input
                    @keyup.enter="login"
                    :type="'password'"
                    :label="'Пароль'"
                    :pr="'password'"
                    :value="user.password"
                    @update-data="updateData"
                    :class="{ 'error': errors.password }"
                />
                <Transition name="error-fade">
                  <div :style="errors.password? 'visibility:visible': 'visibility:hidden'" class="error-message text-red-500 text-sm mt-2 flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    {{ errors.password }}
                  </div>
                </Transition>
              </div>

              <!-- Кнопка входа -->
              <button
                  @click="login"
                  :disabled="isLoading"
                  class="login-btn w-full h-12 sm:h-14 flex justify-center items-center rounded-xl bg-gradient-to-r bg-(--color-main-text) hover:bg-(--color-main-hover-text) text-white font-semibold shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <div v-if="isLoading" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Вход...
                </div>
                <span v-else>Войти</span>
              </button>
            </el-form>

            <!-- Сообщение об ошибке -->
            <Transition name="error-fade">
              <div v-if="AuthStore.errText" class="mt-6">
                <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <div class="flex items-center">
                    <svg class="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    <p class="text-red-700 dark:text-red-300 text-sm">
                      {{ AuthStore.errText.message }}
                    </p>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </Transition>
      </div>
    </div>
  </div>

</template>

<style scoped>
.auth-form {
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.dark .auth-form {
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.form-group {
  position: relative;
}

.login-btn {
  position: relative;
  overflow: hidden;
}

.login-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.login-btn:hover::before {
  left: 100%;
}

/* Анимации */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out;
}

/* Переходы Vue */
.slide-fade-enter-active {
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.slide-fade-enter-from {
  transform: translateX(50px);
  opacity: 0;
}

.error-fade-enter-active .error-fade-leave-active {
  transition: all 0.3s ease;
}

.error-fade-enter-from .error-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.error-message {
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

/* Адаптивность */
@media (max-width: 640px) {
  .auth-form {
    margin: 1rem;
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .auth-form {
    margin: 0.5rem;
    padding: 1rem;
  }
}

/* Улучшенная тень для карточек */
.shadow-3xl {
  box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
}

/* Стили для полей с ошибками */
.form-group :deep(.error) {
  border-color: #ef4444;
  border-radius: 5px;
  box-shadow: 0 0 0 2px #ef4444;
}

/* Hover эффекты */
.auth-form:hover {
  transform: translateY(-2px);
}

/* Анимация загрузки */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Градиентная анимация для кнопки */
@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.login-btn {
  background-size: 200% 200%;
  animation: gradient 3s ease infinite;
}

/* Улучшенные переходы для темной темы */
.dark .auth-form {
  background: rgba(31, 41, 55, 0.9);
  backdrop-filter: blur(20px);
}

/* Адаптивная типографика */
@media (max-width: 768px) {
  .title {
    font-size: clamp(2rem, 8vw, 4rem);
  }

  p {
    font-size: clamp(1rem, 4vw, 1.25rem);
  }
}

/* Улучшенные состояния фокуса для доступности */
.login-btn:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Анимация появления ошибок */
.error-message {
  transform-origin: left center;
}

/* Микро-анимации */
.form-group input:focus {
  transform: scale(1.02);
  transition: transform 0.2s ease;
}

.login-btn:active {
  transform: scale(0.98);
}
</style>

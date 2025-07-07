import { createRouter, createWebHistory } from 'vue-router'
import {useAuthStore} from "../store/AuthStore.js";
import Page404 from "../views/Page404.vue";
import Main from "../views/Main.vue";
import Auth from "../views/Auth.vue";
import Users from "../views/Users.vue";
import Subjects from "../views/Subjects.vue";
import NewQuestion from "../views/NewQuestion.vue";
import Moderate from "../views/Moderate.vue";
import MyQuestions from "../views/MyQuestions.vue";
import MyTests from "../views/MyTests.vue";
import NewTest from "../views/NewTest.vue";
import {useUsersStore} from "../store/UsersStore.js";



const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/login',
            name: 'Auth',
            component: Auth
        },
        {
            path: '/',
            name: 'Main',
            meta: { requiresAuth: true, alias:'Главная' },
            component: Main,
        },
        {
            path: '/users',
            name: 'Users',
            meta: { requiresAuth: true, admin:true, alias:'Управление пользователями' },
            component: Users
        },
        {
            path: '/subjects',
            name: 'Subjects',
            meta: { requiresAuth: true, admin:true, alias:'Управление тематиками' },
            component: Subjects
        },
        {
            path: '/question/create',
            name: 'NewQuestion',
            meta: { requiresAuth: true, admin:false, alias:'Добавление нового вопроса' },
            component: NewQuestion
        },
        {
            path: '/question/moderate',
            name: 'Moderate',
            meta: { requiresAuth: true,admin:false, moderator:true, alias:'Модерация вопросов' },
            component: Moderate
        },
        {
            path: '/question/my',
            name: 'MyQuestions',
            meta: { requiresAuth: true,  alias:'Список моих вопросов' },
            component: MyQuestions
        },
        {
            path: '/tests',
            name: 'Tests',
            meta: { requiresAuth: true, alias:'Сгенерированные тесты' },
            component: MyTests
        },
        {
            path: '/test',
            name: 'NewTest',
            meta: { requiresAuth: true, alias:'Сгенерировать новый тест' },
            component: NewTest
        },
        {
            path: '/:pathMatch(.*)*',
            redirect:{name:'NotFound'}
        },
        {
            path: '/404',
            name: 'NotFound',
            component: Page404,
        },
    ]
})

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();
    const usersStore = useUsersStore();
    if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (authStore.access_token !== null && authStore.access_token !== undefined) {
            let role = usersStore.getRole
            if (role === undefined) {
                await usersStore.getUserFunc().then(() => {
                    role = usersStore.getRole
                })
            }
            if (!authStore.access_token) {
                next('/login');
            } else {
                if (to.meta.admin === true && role !== 'admin') {
                    next('/')
                } else if (to.meta.moderator === true && (role !== 'moderator' && role !== 'admin')) {
                    next('/')
                } else {
                    next()
                }
            }
        } else {
            next('/login');
        }
    } else if ((authStore.access_token) && to.path === '/login') {
        next('/');
    } else if (to.path === '/login') {
        next();
    } else {
        next();
    }
});

export default router

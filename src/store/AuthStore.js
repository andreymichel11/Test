import {defineStore} from "pinia";
import {useLocalStorage} from "@vueuse/core";
import {logIn} from "../api/api.js";
import {jwtDecode} from "jwt-decode";
import axios from "axios";
import {useSubjectStore} from "./SubjectStore.js";
import {useUsersStore} from "./UsersStore.js";

export const useAuthStore = defineStore('authStore', {
    state: () => ({
        access_token:         useLocalStorage('access_token',null),
        errText:              undefined,
    }),
    actions: {
        setError(err) {
            this.errText = err
        },
        setUserInfo(data)  {
            this.access_token = data.access_token
        },
        logOut() {
            localStorage.removeItem("access_token")
            this.access_token = null
            this.errText = undefined
        },

        async LogIn(user) {
            this.errText = undefined
            await logIn(user)
                .then(res => {
                    this.setUserInfo(res.data.tokens)
                    axios.defaults.headers.common['Authorization'] = `Bearer ` + this.access_token
                    useSubjectStore().getStatistic()
                    useUsersStore().getUserFunc()
                })
                .catch(err => {
                    this.setError(err.response.data)
                })
        },

    }

})

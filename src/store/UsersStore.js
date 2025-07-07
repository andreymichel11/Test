import {defineStore} from "pinia";
import {deleteUser, getRoles, getUser, getUsers, putUser} from "../api/api.js";
import { setErrorAlert} from "../utils/utils.js";

export const useUsersStore = defineStore('usersStore', {
    state: () => ({
        users:[],
        user:{},
        currentPage:1,
        pageSize: 10,
        updateIsOpened: false,
        updateUser:{},
        roles: []
    }),

    getters: {
        getUsersSlice() {

            const startNumber =  this.currentPage * this.pageSize -  this.pageSize
            return this.users.slice(startNumber, startNumber + this.pageSize)
        },
        getFirstLetter() {
            if (this.user !== null && this.user.user_name !== undefined) {
                return this.user.user_name[0]
            }
        },
        getUserId() {
            if (this.user !== null && this.user.user_name !== undefined) {
                return this.user.id
            }
        },
        getUser() {
            if (this.user !== null && this.user.user_name !== undefined) {
                return this.user.user_name
            }
        },
        getRole() {
            if (this.user !== null && this.user.role_name !== undefined) {
                return this.user.role_name.toLowerCase()
            }
        }
    },
    actions: {
        setError(err) {
            setErrorAlert(err)
        },
        setUpdateIsOpened() {
          this.updateIsOpened = !this.updateIsOpened
        },

        setUpdateUser(user) {
            this.updateUser = user
        },
        async getUserFunc() {
            this.errText = undefined
            await getUser()
                .then(res => {
                    this.user=res.data.user
                })
                .catch(err => {
                    this.setError(err, 'получения информации пользователя')
                })
        },

        async getUsers() {
            this.errText = undefined
            await getUsers()
                .then(res => {
                    this.users=res.data.users
                })
                .catch(err => {
                    this.setError(err, 'получения списка пользователей')
                })
        },

        async getRoles() {
            this.errText = undefined
            await getRoles()
                .then(res => {
                    this.roles=res.data.role
                })
                .catch(err => {
                    this.setError(err, 'получения списка ролей')
                })
        },

        async delUser(user) {
            this.errText = undefined
            await deleteUser(user.user_name)
                .then(res => {
                    const i = this.users.indexOf(user)
                    this.users.splice(i,1)

                    // this.getUsers()
                })
                .catch(err => {
                    this.setError(err, 'удаления пользователя' + user.user_name)
                })
        },

        async updateUserFunc(user) {
            this.errText = undefined
            await putUser(user)
                .then(res => {
                    this.getUsers()
                })
                .catch(err => {
                    this.setError(err, 'обновления пользователя' + user.user_name)
                })
        },

    }

})

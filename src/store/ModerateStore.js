import {defineStore} from "pinia";

export const useModerateStore = defineStore('moderateStore', {
    state: () => ({
        isModerateOpened: false,
    }),
    getters: {

    },
    actions: {
        setIsModerateOpened() {
            this.isModerateOpened = !this.isModerateOpened
        }
    },
})
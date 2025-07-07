import {defineStore} from "pinia";
import {getTestQuestions, getTests, postTest} from "../api/api.js";
import {setErrorAlert} from "../utils/utils.js";
import {useSubjectStore} from "./SubjectStore.js";

export const useTestStore = defineStore('testStore', {
    state: () => ({
        tests: [],
        currentSubject: null,
        testQuestions: {
            name: '',
            description: '',
            question_ids: [],
        },
        preparedQuestions: [],
        questions: [],
        currentTest:null,
        showIsOpened: false,
    }),
    getters: {

    },
    actions: {
        setShowIsOpened() {
            this.showIsOpened = !this.showIsOpened;
        },
        setCurrentSubject(subject) {
            this.currentSubject = subject
        },
        setCurrentTest(test) {
            this.currentTest = test
            if (test!== null) {
                this.getTestQuestions(this.currentTest.id)
            }
        },
        setError(err) {
            setErrorAlert(err)
        },
        async getTestsFunc(query) {
            this.errText = undefined
            const q = query!==undefined?query:''
            await getTests(q)
                .then(res => {
                    this.tests=res.data.quizzes
                })
                .catch(err => {
                    this.setError(err, 'получения тестов')
                })
        },

        async getTestQuestions(id) {
            this.errText = undefined
            await getTestQuestions(id)
                .then(res => {
                    this.questions=res.data.questions
                })
                .catch(err => {
                    this.setError(err, 'получения вопросов теста')
                })
        },
        async addTest() {
            this.errText = undefined
            await postTest(this.testQuestions)
                .then(res => {
                    useSubjectStore().getStatistic()
                })
                .catch(err => {
                    this.setError(err, 'создания теста')
                })
        },
    },
})
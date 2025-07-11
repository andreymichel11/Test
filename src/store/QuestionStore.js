import {defineStore} from "pinia";
import {
    addQuestion, deleteQuestion,
    getQuestions, getQuestionStatuses, getQuestionTypes,
    getSubjectQuestions, putApprove, putQuestion,
} from "../api/api.js";
import {setErrorAlert} from "../utils/utils.js";
import {useSubjectStore} from "./SubjectStore.js";
import {useUsersStore} from "./UsersStore.js";


export const useQuestionStore = defineStore('questionStore', {
    state: () => ({
        questions:[],
        types:[],
        subjectQuestions:{},
        currentQuestion:{},
        isCreateQuestionOpened: false,
        isUpdateQuestionOpened: false,
        statuses: [],
        newQuestion:{
            type_id: null,
            subject_id:null,
            text:'',
            code:'',
            variants: {
                variants: []
            },
            answer:{
                answer:[]
            }
        },
    }),

    getters: {
        getCurrentQuestionInfo() {
            return Object.fromEntries(Object.entries(this.currentQuestion).filter(([key, value])=> {
                return key !== 'id' && key !== 'subject_id' && key !== 'question_code' && key!== 'question_text' && key !== 'variant' && key !=='answer'
            }))
        },
        getQuestionsToModerate() {
          return this.questions.filter(q=> {
              return q.status.toLowerCase() === 'создан'
          })
        },

    },
    actions: {
        setError(err) {
            setErrorAlert(err)
        },
        setIsCreateQuestionOpened() {
          this.isCreateQuestionOpened = !this.isCreateQuestionOpened
        },
        setIsUpdateQuestionOpened() {
            this.isUpdateQuestionOpened = !this.isUpdateQuestionOpened
        },
        async getQuestions(query) {
            this.errText = undefined
            await getQuestions(query)
                .then(res => {
                    this.questions=res.data.questions
                })
                .catch(err => {
                    this.setError(err)
                })
        },
        async addNewQuestion(question) {
            this.errText = undefined
            await addQuestion(question).then(() => {
                useSubjectStore().getStatistic()
            })
                .catch(err => {
                    this.setError(err)
                })
        },
        async getSubjectQuestions(subject_name, id) {
            this.errText = undefined
            await getSubjectQuestions(id)
                .then(res => {
                    this.subjectQuestions[subject_name] =  res.data.questions
                })
                .catch(err => {
                    this.setError(err)
                })
        },
        async getSubjectQuestionsApprove(subject_name, id) {
            this.errText = undefined
            const status = this.statuses.find(item => item.name.toLowerCase() === 'одобрен')
            await getQuestions(`?subject_id=${id}&status_id=${status.id}`)
                .then(res => {
                    this.subjectQuestions[subject_name] =  res.data.questions
                })
                .catch(err => {
                    this.setError(err)
                })
        },

        async getQuestionsTypes() {
            this.errText = undefined
            await getQuestionTypes()
                .then(res => {
                    this.types =  res.data.types
                })
                .catch(err => {
                    this.setError(err)
                })
        },
        async getQuestionsStatuses() {
            this.errText = undefined
            await getQuestionStatuses()
                .then(res => {
                    this.statuses =  res.data.statuses
                })
                .catch(err => {
                    this.setError(err)
                })
        },
        async updateQuestion(newQuestion,path) {
            this.errText = undefined
            await putQuestion(newQuestion, this.currentQuestion.id).then(() => {
                this.setIsUpdateQuestionOpened()
                const {subject_id, subject_name} = this.currentQuestion
                this.getSubjectQuestions(subject_name, subject_id)
                if (useUsersStore().getRole.toLowerCase() === 'admin') {
                    useSubjectStore().getSubjects()
                }
                if (path!=='subjects') {
                    const id = useUsersStore().getUserId
                    this.getQuestions(`?creator_user_id=${id}`)
                }
                this.currentQuestion = {}
                this.subjectQuestions ={}
                useSubjectStore().getStatistic()
            })
                .catch(err => {
                    this.setError(err)
                })
        },
        async moderateQuestion(moderate) {
            this.errText = undefined
            await putApprove(this.currentQuestion.id, moderate).then(async () => {
                await this.getQuestionsStatuses().then(() => {
                    const status = this.statuses.find(item => item.name.toLowerCase() === 'создан')
                    this.getQuestions(`?status_id=${status.id}`)
                    useSubjectStore().getSubjects()
                    const {subject_id, subject_name} = this.currentQuestion
                    if (useUsersStore().getRole.toLowerCase() === 'admin') {
                        this.getSubjectQuestions(subject_name, subject_id)
                    }
                    useSubjectStore().getStatistic()
                })

                this.currentQuestion = {}
                this.subjectQuestions = {}
            })
                .catch(err => {
                    this.setError(err)
                })
        },
        async delQuestion(path) {
            this.errText = undefined
            await deleteQuestion(this.currentQuestion.id).then(() => {
                const {subject_id, subject_name} = this.currentQuestion
                this.getSubjectQuestions(subject_name, subject_id)
                useSubjectStore().getStatistic()
                this.currentQuestion = {}
                if (path!=='subjects') {
                    const id = useUsersStore().getUserId
                    this.getQuestions(`?creator_user_id=${id}`)
                }
            })
                .catch(err => {
                    this.setError(err)
                })
        },
    }

})

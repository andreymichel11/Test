import {defineStore} from "pinia";
import {addSubject, deleteSubject, getStatistic, getSubjects, logIn, putSubject} from "../api/api.js";
import axios from "axios";
import {setErrorAlert} from "../utils/utils.js";

export const useSubjectStore = defineStore('subjectStore', {
    state: () => ({
        subjects:[],
        updateIsOpened: false,
        selectSubject: null,
        newSubjectsStruct: null,
        statistic: 0,
        chartLabelArray: [],
        chartCountArray: [],
        createIsOpened: false,
    }),

    getters: {

    },
    actions: {
        setError(err) {
            setErrorAlert(err)
        },
        setUpdateIsOpened() {
            this.updateIsOpened = !this.updateIsOpened
        },
        setCreateIsOpened() {
            this.createIsOpened = !this.createIsOpened;
        },
       setIsSelect(subj) {
            this.selectSubject = subj;
       },
        async testToTree(sub, isDrag) {
            const map = new Map(sub.map(item => [item.id, item]));
            for (let item of map.values()) {
                item.isExpanded= true
                item.children=[]
                item.isDraggable=isDrag
                item.title = item.name
                item.data = {question_count:item.question_count, approved_question_count:item.approved_question_count, id:item.id}

                if (!map.has(item.parent_id)){
                    continue
                }

                const parent = map.get(item.parent_id)
                parent.children = [...parent.children||[], item]

            }
            this.newSubjectsStruct =  [...map.values()].filter((item)=> item.parent_id==='0')

        },

        async getSubjects(isDrag) {
            this.errText = undefined
            await getSubjects()
                .then(async res => {
                    await this.testToTree(res.data.subjects, isDrag).then(() => {
                        this.subjects = res.data.subjects
                    })
                })
                .catch(err => {
                    this.setError(err, 'получения списка тематик')
                })
        },

        async getStatistic() {
            this.errText = undefined
            await getStatistic()
                .then(res => {
                    this.statistic=res.data.statistic
                    this.chartLabelArray = this.statistic.question_counts_by_subject.map(item => item.question_count > 0 ? item.subject_name : null).filter(subjectName => subjectName !== null)
                    this.chartCountArray = this.statistic.question_counts_by_subject.map(item => item.question_count > 0 ? item.question_count: null).filter(question_count => question_count !== null)
                })
                .catch(err => {
                    this.setError(err, 'получения статистики')
                })
        },

        async delSubject(id) {
            this.errText = undefined
            await deleteSubject(id)
                .then(res => {
                    this.getSubjects(true)
                    this.getStatistic()
                })
                .catch(err => {
                    this.setError(err, 'удаления тематики')
                })
        },

        async updateSubject(subject) {
            this.errText = undefined
            await putSubject(subject)
                .then(res => {
                    this.getSubjects(true)
                    this.getStatistic()
                })
                .catch(err => {
                    this.setError(err, 'изменения тематики')
                })
        },

        async addSubject(subject) {
            this.errText = undefined
            await addSubject(subject)
                .then(res => {
                    this.getSubjects(true)
                    this.getStatistic()
                })
                .catch(err => {
                    this.setError(err, 'добавления тематики')
                })
        },

    }

})

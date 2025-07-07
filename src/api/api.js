import axios from "axios";
import '@ton.js/json-parse-polyfill';
import JSONbigint from 'json-bigint'
import router from "../router/index.js";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const token = localStorage.getItem('access_token')
if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ` + token
}

// axios.interceptors.request.use((request) => {
//     request.transformResponse = [data => data]
//     return request
// })
//
// // response interceptor parsing the response data with JSONbigint, and returning the response
// axios.interceptors.response.use((response) => {
//     response.data = JSONbigint.parse(response.data)
//     console.log(response)
//     return response
// })

axios.interceptors.response.use(response => {
        return response
    },
    error => {

        const originalRequest = error.config
        if (error.response.status === 401  && !originalRequest.url.includes('/refresh')) {
            originalRequest._rety = true
            return  axios
                .get('/auth/refresh?token='+localStorage.getItem('refresh_token'))
                .then(res => {
                    if (res.status === 200) {
                        useAuthStore().setUserInfo(res.data)
                        originalRequest.headers["Authorization"] = 'Bearer ' + res.data.access_token
                        axios.defaults.headers.common['Authorization'] = `Bearer ` + res.data.refresh_token
                        return axios(originalRequest)

                    } else {
                        useAuthStore().logOut()
                        router.push({name:'Auth'})
                        return  Promise.reject(error)
                    }
                }).catch(() => {
                    useAuthStore().logOut()
                    router.push({name:'Auth'})
                    return  Promise.reject(error)
                })
        }
        return  Promise.reject(error)
    }
)

// BACK_LOGIN
export  const logIn =  async (data) => {
    return  await axios.post(`login/auth`, data)
}

export  const getUser =  async (data) => {
    return  await axios.get(`users/user`, data)
}
//BACK_USER

export  const getUsers =  async () => {
    return  await axios.get(`users/users`)
}
export  const deleteUser =  async (username) => {
    return  await axios.delete(`users/user/`+ username)
}

export  const putUser =  async (user) => {
    return  await axios.put(`users/user`, user)
}
export  const getRoles =  async () => {
    return  await axios.get(`users/roles`)
}


//BACK_SUBJECT

export  const getSubjects =  async () => {
    return  await axios.get(`subjects/subjects`)
}
export  const getStatistic =  async () => {
    return  await axios.get(`subjects/statistic`)
}
export  const deleteSubject =  async (id) => {
    return  await axios.delete(`subjects/subject/`+ id)
}
export  const putSubject =  async (subject) => {
    return  await axios.put(`subjects/subject`, subject)
}
export  const addSubject =  async (subject) => {
    return  await axios.post(`subjects/subject`, subject)
}

//BACK_QUESTION

export  const getQuestions =  async (query) => {
    return  await axios.get(`questions/questions`+ query)
}

export  const getSubjectQuestions =  async (id) => {
    return  await axios.get(`questions/questions?subject_id=`+id, {
    })
}
export  const getQuestionTypes =  async () => {
    return  await axios.get(`questions/types`)
}
export  const getQuestionStatuses =  async () => {
    return  await axios.get(`questions/statuses`)
}
export  const deleteQuestion =  async (id) => {
    return  await axios.delete(`questions/question/`+ id)
}
export  const putQuestion =  async (question, id) => {
    return  await axios.put(`questions/question/`+id, question)
}
export  const putApprove =  async (id, moderate) => {
    return  await axios.put(`questions/question/${id}/moderate`, moderate)
}
export  const addQuestion =  async (question) => {
    return  await axios.post(`questions/question`, question)
}

//TESTS

export  const getTests =  async (query) => {
    return  await axios.get(`quizzes/quizzes`+ query)
}

export  const getTestQuestions =  async (id) => {
    return  await axios.get(`quizzes/${id}/questions`)
}

export  const postTest =  async (test) => {
    return  await axios.post(`quizzes/quiz`, test)
}
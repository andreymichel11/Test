import {ElNotification} from "element-plus";

export const whatStatus = (statusName) => {
    switch (statusName.toLowerCase()) {
        case "одобрен":
        case "тест" :
            return "success"
        case "проверка":
        case "сопоставление":
            return 'warning'
        case "отклонен":
        case "текст":
            return 'danger'
        default:
            return 'primary'
    }
}

export const setErrorAlert = (err, title) => {
    ElNotification({
        message: err.response!==undefined ? err.response.data.message : err,
        type: 'error',
        title: err.response!==undefined ?'Ошибка ' + title : "Server Error"
    })
}



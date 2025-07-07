<template>
  <div class="flex gap-10 h-(--main-height)">
    <Tree  :subjects="SubjectStore.newSubjectsStruct" :select="nodeSelected" :create="createSubjectIsOpen"/>
    <div class="flex flex-col w-[70%]">
      <div class="rounded-xl shadow-2xl bg-white dark:bg-neutral-800 px-6 py-4  mt-10 flex flex-col justify-start h-[30%] min-h-[200px] overflow-scroll w-full relative">
        <div class="mb-4 flex items-center justify-between"  v-if="SubjectStore.selectSubject!==null && Object.keys(SubjectStore.selectSubject).length>0">
          <div>
            <el-button @click="createSubjectIsOpen(false)">Добавить подтематику</el-button>
            <el-button @click="createQuestion">Добавить вопрос</el-button>
          </div>
          <div>
            <el-button @click="refreshSubjectQuestions"><span class="fa fa-refresh "></span></el-button>
                      <el-popconfirm title="Вы уверены что хотите удалить данную тематику?" width="220" @confirm="delSubject()" v-if="QuestionStore.subjectQuestions[SubjectStore.selectSubject.title]?.length===0 && SubjectStore.selectSubject.children.length===0">
                        <template #reference>
                          <el-button><span class="fa fa-trash "></span></el-button>
                        </template>
                        <template #actions="{ confirm, cancel }">
                          <el-button
                              type="danger"
                              size="small"
                              @click="confirm"
                          >
                            Да?
                          </el-button>
                          <el-button size="small" @click="cancel">Нет!</el-button>
                        </template>
                      </el-popconfirm>
<!--            <el-button v-if="QuestionStore.subjectQuestions[SubjectStore.selectSubject.title]?.length===0 && SubjectStore.selectSubject.children.length===0"><span class="fa fa-trash "></span></el-button>-->
          </div>
        </div>
        <SubjectQuestions
            v-if="SubjectStore.selectSubject!==null && QuestionStore.subjectQuestions[SubjectStore.selectSubject.title]?.length>0"
            :questions="QuestionStore.subjectQuestions[SubjectStore.selectSubject.title]"
            :set-questions="handleCurrentChange"
            class="w-full"
        />
        <el-empty
            class="!p-0"
            v-else
            :description="SubjectStore.selectSubject===null?'Выберите тематику':QuestionStore.subjectQuestions[SubjectStore.selectSubject.title]?.length===0 ?`В тематике '${ SubjectStore.selectSubject.name.split('_').join(' ')}' вопросов нет`:''" />
      </div>
      <div class=" rounded-xl shadow-2xl bg-white dark:bg-neutral-800 px-6 py-4  mt-10 flex flex-col h-[70%] w-full overflow-scroll" :class="QuestionStore.currentQuestion!==null ?'':'justify-center'">
        <div class="flex items-center justify-between mb-5" v-if="QuestionStore.currentQuestion!==null && Object.keys(QuestionStore.currentQuestion).length>0">
          <div>
            <el-button  v-if="QuestionStore.currentQuestion.creator.user_name.toLowerCase() === UsersStore.getUser.toLowerCase()" @click="updateQuestion">Изменить вопрос</el-button>
            <el-button @click="ModerateStore.setIsModerateOpened()" v-if="QuestionStore.currentQuestion.status.toLowerCase()==='создан'">Модерировать вопрос</el-button>
          </div>
          <el-button  v-if="QuestionStore.currentQuestion.creator.user_name.toLowerCase() === UsersStore.getUser.toLowerCase()"  @click="QuestionStore.delQuestion(route.name.toLowerCase())"><span class="fa fa-trash "></span></el-button>
        </div>
        <div class="flex grow justify-between gap-2" v-if="QuestionStore.currentQuestion!==null && Object.keys(QuestionStore.currentQuestion).length>0">
          <QuestionInfo :question="QuestionStore.currentQuestion"/>
          <Question :question="QuestionStore.currentQuestion"/>
        </div>
        <el-empty  v-else :description="SubjectStore.selectSubject===null?'Выберите тематику, а затем вопрос':'Выберите доступный вопрос из тематики'"/>
      </div>
    </div>
  </div>
  <CreateSubject :is-top="isTop" v-if="SubjectStore.createIsOpened" />
  <CreateQuestion v-if="QuestionStore.isCreateQuestionOpened"/>
  <ModerateDialog v-if="ModerateStore.isModerateOpened"/>
  <UpdateQuestion v-if="QuestionStore.isUpdateQuestionOpened"/>
</template>

<script setup>
import {useSubjectStore} from "../store/SubjectStore.js";
import {onBeforeMount, onUnmounted, ref} from "vue";
import 'sl-vue-tree-next/sl-vue-tree-next-minimal.css';
import Tree from "../components/Subject/Tree.vue";
import {useQuestionStore} from "../store/QuestionStore.js";
import SubjectQuestions from "../components/Subject/SubjectQuestions.vue";
import QuestionInfo from "../components/Subject/QuestionInfo/QuestionInfo.vue";
import Question from "../components/Subject/QuestionInfo/Question.vue";
import CreateSubject from "../components/Subject/CreateSubject.vue";
import CreateQuestion from "../components/Questions/CreateQuestion.vue";
import {useModerateStore} from "../store/ModerateStore.js";
import ModerateDialog from "../components/Moderate/ModerateDialog.vue";
import {useAuthStore} from "../store/AuthStore.js";
import UpdateQuestion from "../components/Questions/UpdateQuestion.vue";
import {useUsersStore} from "../store/UsersStore.js";
import {useRoute} from "vue-router";
const route = useRoute()
const SubjectStore = useSubjectStore()
const QuestionStore = useQuestionStore()
const ModerateStore = useModerateStore()
const UsersStore = useUsersStore()
const nodeSelected = (nodes) => {
  if (nodes.length === 1) {
    SubjectStore.setIsSelect(SubjectStore.subjects.find(sub => sub.name === nodes[0].title));

     if (QuestionStore.subjectQuestions[SubjectStore.selectSubject.title] ===undefined) {
       QuestionStore.getSubjectQuestions(SubjectStore.selectSubject.title,SubjectStore.selectSubject.id);
       QuestionStore.currentQuestion = {}
     }
  }
}

const refreshSubjectQuestions = () => {
  QuestionStore.getSubjectQuestions(SubjectStore.selectSubject.title,SubjectStore.selectSubject.id)
  QuestionStore.currentQuestion = {}
}

const handleCurrentChange = (question) => {
  QuestionStore.currentQuestion = question
}
const deleteSubject = (subj) => {
  SubjectStore.delSubject(nodeSelected(subj).id)
  SubjectStore.setIsSelect( null)
}

const isTop = ref(false);
const createSubjectIsOpen = (Top) => {
  isTop.value = Top;
  SubjectStore.setCreateIsOpened()
}

const createQuestion = () => {
  QuestionStore.setIsCreateQuestionOpened()
  QuestionStore.newQuestion.subject_id = SubjectStore.selectSubject.id;

}

const delSubject = () => {
  SubjectStore.delSubject(SubjectStore.selectSubject.id).then(() => {
    SubjectStore.setIsSelect(null);
  })
}
const updateQuestion = () => {

  QuestionStore.newQuestion.subject_id = SubjectStore.selectSubject.id;
  QuestionStore.newQuestion.text = QuestionStore.currentQuestion.text;
  QuestionStore.newQuestion.code = QuestionStore.currentQuestion.code;
  QuestionStore.newQuestion.variants = JSON.parse(JSON.stringify(QuestionStore.currentQuestion.variants));
  QuestionStore.newQuestion.answer = JSON.parse(JSON.stringify(QuestionStore.currentQuestion.answer));
  QuestionStore.newQuestion.type_id = QuestionStore.currentQuestion.type.id;
  QuestionStore.setIsUpdateQuestionOpened()
  QuestionStore.getQuestionsTypes()

}

onBeforeMount(() => {
  SubjectStore.getSubjects(true)
})

onUnmounted(() => {
  SubjectStore.setIsSelect( null)
  QuestionStore.currentQuestion = {}
})
</script>

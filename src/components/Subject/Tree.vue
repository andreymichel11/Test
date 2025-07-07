<script setup>
import {SlVueTreeNext} from "sl-vue-tree-next";
import SubjectTreeComponent from "./SubjectTreeComponent.vue";
const props = defineProps({
  subjects: Array,
  select: Function,
  create:Function,
})
</script>

<template>
  <div class=" rounded-xl shadow-2xl bg-white w-[30%] dark:bg-neutral-800 px-6 py-4 mt-10 overflow-auto flex flex-col justify-start ">
    <div class="w-full" v-if="subjects !== null">
        <el-button  class="mb-4" @click="create(true)"><span class="fa fa- fa-plus-square-o   !text-xl mr-2"></span> Добавить корневую тематику</el-button>
    </div>
    <SubjectTreeComponent :subjects="subjects"  :select="select" v-if="subjects !== null"/>
<!--    <sl-vue-tree-next :model-value="props.subjects" ref="tree" class=" !border-none"  @select="props.select" >-->
<!--      <template #title="{ node }">-->
<!--        <span class="item-icon" >-->
<!--          <i v-if="!node.isLeaf && !node.isExpanded" class="fa fa-folder-o"></i>-->
<!--          <i v-else-if="!node.isLeaf && node.isExpanded" class="fa fa-folder-open-o "></i>-->
<!--          <i v-else class="fa  fa-question "></i>-->
<!--        </span>-->
<!--        <div class="inline-flex">-->
<!--          <span class="cursor-pointer p-0 m-0 p-2 ">{{ node.title.split('_').join(' ') }}</span>-->
<!--          <el-badge  :offset="[50, 18]" :value="node.data.question_count" :hidden="node.data.question_count===0" class="item" type="primary"/>-->
<!--        </div>-->
<!--      </template>-->
<!--      <template #toggle="{ node }" >-->
<!--                            <span v-if="!node.isLeaf && node.children.length" class="cursor-pointer pl-2">-->
<!--                                <i v-if="node.isExpanded" class="fa fa-chevron-down"></i>-->
<!--                                <i v-if="!node.isExpanded" class="fa fa-chevron-right"></i>-->
<!--                            </span>-->
<!--        <span v-else></span>-->
<!--      </template>-->
<!--    </sl-vue-tree-next>-->
    <el-empty v-else description="Нет доступных тематик"/>
  </div>
</template>

<style>
.sl-vue-tree-next-node {
  padding: 5px;
}

.sl-vue-tree-next-node > .sl-vue-tree-next-selected{
  background-color: var(--color-main-text);
}

.item-icon {
  display: inline-block;
  text-align: left;
  width: 20px;
  margin: 0 5px;
}

.sl-vue-tree-next-selected > .sl-vue-tree-next-node-item {
  background-color: var(--color-main-text);
  color: white;
}
</style>
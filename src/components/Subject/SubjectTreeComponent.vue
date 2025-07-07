<script setup>

import {SlVueTreeNext} from "sl-vue-tree-next";
import {useRoute} from "vue-router";
import {computed} from "vue";

const props = defineProps({
  subjects: Object,
  select: Function
})

const route = useRoute()

function nodeDropped(nodes, position, event) {
  console.log(nodes, 'node');
  console.log( position, 'position');
  console.log('event0', event);
  //const lastEvent = `Nodes: ${nodes.map((node) => node.title).join(', ')} are dropped ${position.placement} ${position.node.title}`
 // console.log(lastEvent)
}
const getCount = (node) => {
  if (route.path === '/test') {
    return node.approved_question_count
  }
  return node.question_count
}

</script>

<template>
  <sl-vue-tree-next :model-value="props.subjects" ref="tree" class=" !border-none"  @select="props.select"    @drop="nodeDropped">
    <template #title="{ node }">
        <span class="item-icon" >
          <i v-if="!node.isLeaf && !node.isExpanded" class="fa fa-folder-o"></i>
          <i v-else-if="!node.isLeaf && node.isExpanded" class="fa fa-folder-open-o "></i>
          <i v-else class="fa  fa-question "></i>
        </span>
      <div class="inline-flex">
        <span class="cursor-pointer p-0 m-0 p-2 ">{{ node.title.split('_').join(' ') }}</span>
        <el-badge  :offset="[50, 18]" :value="getCount(node.data)" :hidden="getCount(node.data)===0" class="item " type="primary"/>
      </div>
    </template>
    <template #toggle="{ node }" >
                            <span v-if="!node.isLeaf && node.children.length" class="cursor-pointer pl-2">
                                <i v-if="node.isExpanded" class="fa fa-chevron-down"></i>
                                <i v-if="!node.isExpanded" class="fa fa-chevron-right"></i>
                            </span>
      <span v-else></span>
    </template>
  </sl-vue-tree-next>

</template>

<style scoped>
.sl-vue-tree-next-node {
  padding: 5px;
}

.sl-vue-tree-next-node > .sl-vue-tree-next-selected{
  background-color: var(--color-main-text) !important;
}

.item-icon {
  display: inline-block;
  text-align: left;
  width: 20px;
  margin: 0 5px;
}

:deep(.sl-vue-tree-next-selected > .sl-vue-tree-next-node-item) {
  background-color: var(--color-main-text);
  color: white;
}
</style>
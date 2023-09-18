<template>
    <div :class="['IconBtn', { disabled }]" :title="props.title" @click="onClick">
        <el-icon :size="props.size">
            <v-icon :icon="props.icon" />
        </el-icon>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const props = defineProps({
    title: {
        type: String,
        default: ''
    },
    icon: {
        type: String,
        default: ''
    },
    size: {
        type: Number,
        default: 28
    },
    disabled: Boolean
});
const emit = defineEmits(['click']);

const onClick = (e: MouseEvent) => {
    if (props.disabled) return;
    emit('click', e)
}
</script>

<style lang="less" scoped>
.IconBtn {
    width: 38px;
    height: 38px;
    cursor: pointer;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: center;
    position: relative;
    color: #a5a5a5;

    &+.IconBtn {
        margin-left: 10px;
    }

    &.disabled {
        cursor: not-allowed;
        color: var(--color-dark3);

        &:hover {
            color: var(--color-dark3);
        }
    }

    &::after {
        content: '';
        position: absolute;
        top: 30%;
        bottom: 30%;
        right: 0;
        width: 1px;
        background-color: rgb(30, 33, 41);
    }

    &:hover {
        color: #fff;
    }
}</style>

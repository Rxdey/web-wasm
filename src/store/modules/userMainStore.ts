import { defineStore } from 'pinia'

export const userMainStore = defineStore('main', {
    state: () => ({
        loading: false
    })
})
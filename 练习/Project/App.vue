<template>
    <div>

    </div>
</template>

<script setup lang="ts">
import { getCurrentInstance, onMounted, onErrorCaptured, callWithErrorHandling } from 'vue';



const instance = getCurrentInstance();

onMounted(() => {
    console.log(instance);
})

</script>

<style lang="less" scoped>
    
</style>
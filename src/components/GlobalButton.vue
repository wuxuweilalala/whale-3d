<template>
    <div class="btn">
        <svg class="icon" aria-hidden="true" v-if="icon">
            <use xlink:href="#icon-Aplussign"/>
        </svg>
      <span>{{name}}</span>
    </div>
</template>

<script >
    export default {
        name: "globalButton",
        props:['name','icon']
    }
</script>

<style lang="scss" scoped>
    .btn {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        width: 6vw;
        height: 2vw;
        background: url('~@/assets/order/btnBorder.png');
        background-size: 100% 100%;
        .icon {
            width: 0.9vw;
            height: 0.9vw;
        }
    }
</style>

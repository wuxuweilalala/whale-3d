<template>
    <input :disabled="inputData.disable"
      :max="20"
      :placeholder="inputData.placeholder||''"
      :type="validateType"
      @blur='checkVal'
      @input="onChange"
      maxlength="50"
      v-model="inputVal">
</template>
<script>
    export default {
        name: 'InputChild',
        props: {
            inputData: {
                type: Object,
                required: true
            },

            validateType: {//输入值类型检验
                type: String,
                default: 'text'
            },
            minVal: Number,
            maxVal: Number,
            unit: {
                type: String,
                required: ''
            }
        },
        data() {
            return {
                inputVal: ''
            };
        },
        methods: {
            onChange() {
                let vm = this;
                const validateFun = {
                    number: () => {
                        let value = vm.inputVal.replace(/\D/g, '');
                        vm.$set(vm, 'inputVal', value);
                    },
                };
                let type = this.validateType;
                validateFun[type] && validateFun[type]();
                this.$emit('onChange', this.inputVal);
            },
            checkVal() {
                if (String(this.minVal).length) {
                    if (this.inputVal < this.minVal) {
                        this.inputVal = this.minVal;
                    }
                }
                if (String(this.maxVal).length) {
                    if (this.inputVal > this.maxVal) {
                        this.inputVal = this.maxVal;
                    }
                }
                this.inputVal = String(this.inputVal).replace(/^0+/, '');//去掉开头的零
                this.$emit('inputBlur', this.inputVal);
            }
        },
        watch: {
            'inputData.value'(val) {
                this.inputVal = val;
            }
        },
        mounted() {
            this.inputVal = this.inputData.value;
        },
    };
</script>
<style scoped>
    .type-input {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        font-size: 0.6vw;
        align-items: baseline;
    }

    .type-input span {
        display: block;
        color: #acbbda;
    }

    .type-input .inputBox {
        position: relative;
    }

    .type-input input {
        outline: none;
        background-color: #11151f;
        border: solid 0.0625vw #475566;
        color: #ffffff;
        padding: 0.1vw 2.5vw 0.1vw 0.2vw;
        /*padding-right: 2.5vw;*/
        font-size: 0.6vw;
        width: 8.5vw;
    }

    .type-input .inputBox .unit {
        color: #fff;
        right: 0.6vw;
    }

    input::-webkit-input-placeholder {
        color: grey;
    }

    input:focus {
        border-color: #00b9ff;
    }
</style>



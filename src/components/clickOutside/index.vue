<script>
    export  default {
        render(){
            return this.$slots.default
        },
        name:'clickOutside',
        beforeMount() {
            // console.log(this.$slots.default)
        }
    }
</script>

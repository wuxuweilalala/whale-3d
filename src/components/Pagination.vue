<template>
    <el-pagination
      layout="prev, pager, next"
      v-on="$listeners"
      v-bind='$attrs'
      :background="true"
      :current-page="currentPage"
      :page-size="pageSize"
      :page-count="pageCount"
      :total="total"
    />
</template>

<script>
export default {
	name: 'Pagination',
	props:['currentPage','pageSize','total', 'pageCount']
};
</script>

<style lang="scss">
    .el-pagination {
        text-align: center;
    }

    .el-pagination.is-background .btn-next, .el-pagination.is-background .btn-prev, .el-pagination.is-background .el-pager li {
        background-color: unset !important;
        border: 1px solid #9a9a9a !important;
    }

    .el-pagination.is-background .el-pager li:not(.disabled).active {
        background-color: #ffac29 !important;
    }
</style>

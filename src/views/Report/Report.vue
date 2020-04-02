<template>
  <div class>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col :span="24">
          <div id="main" style="width: 100%; height:500px;"></div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
// 导入 echarts
import echarts from 'echarts'
import _ from 'lodash'
import { getReport } from '../../api/report'
export default {
  name: '',
  data() {
    return {
      // 需要合并的数据(使用)
      option: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '3%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  created() {},
  async mounted() {
    // DOM 挂载完成
    var chart = echarts.init(document.getElementById('main'))
    // 请求折线图数据
    const res = await getReport()
    if (res.meta.status !== 200) return this.$message.error('获取折线图数据失败！')
    // 合并数据(data中的数据和响应数据合并)
    const result = _.merge(res.data, this.option)
    chart.setOption(result)
    // 自适应
    window.addEventListener('resize', () => {
      chart.resize()
    })
  }
}
</script>

<style scoped lang="scss">
</style>

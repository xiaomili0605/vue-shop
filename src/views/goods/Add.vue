<template>
  <div class>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <!-- 点击标签页 激活对应的步骤条 -->
      <!-- align-center 步骤条居中 -->
      <!-- 把标签页的name值设置为索引值012345 -->
      <!-- v-model="activeName" 设置标签页的激活值 -->
      <!-- :active="Number(activeName)" 步骤条激活项绑定=>标签页的激活值 -->
      <!-- 注意：步骤条激活值必须是数字，所以Number(activeName) -->
      <el-steps :space="200" :active="Number(activeName)" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tabs 标签页区域 -->
      <!-- :tab-position="'left'" 标签方向 -->
      <!-- el-form 包裹 tabs 因为：el-tab-pane只能在 el-tabs 里 -->
      <!-- el-form-item 写在 el-tab-pane 中-->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="activeName"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="商品信息" name="0">
            <!-- el-form-item 写在 el-tab-pane 中 -->
            <el-form-item label="商品名称" prop="goods_name">
              <el-input type="text" v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <!-- type="number" 只能输入数字，输入其他字符输不进去 -->
            <el-form-item label="商品价格" prop="goods_prive">
              <el-input type="number" v-model="addForm.goods_prive"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input type="number" v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input type="number" v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <!-- 商品分类 el-form-item 包级联选择框 -->
            <!-- 把 v-model="addForm.goods_cat" 绑定的 goods_cat 在请求参数中定义，请求时需要转成字符串 -->
            <!-- prop 直接绑定到 goods_cat ，进行校验 -->
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="catelist"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <!-- 多选框区域，把响应数据中的每一条的 attr_vals ，使用v-for渲染出来每一项 :label="item" label绑定响应数据 -->
              <!-- 多选框和tag一样，在页面上修改数据（勾选或去掉勾选），也把真实数据更改掉了，可以理解成双向数据绑定的意思 -->
              <!-- el-checkbox border 每一个加上边框 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="item" v-for="(item, ind) in item.attr_vals" :key="ind" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action 上传到的后台API地址，完整API地址 -->
            <!-- :on-preview="handlePreview" 指定预览事件 -->
            <!-- :on-remove="handleRemove" 处理移除图片事件 -->
            <!-- list-type="picture" 文件列表的类型 缩列图类型 -->
            <el-upload
              class="upload-demo"
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- 添加商品按钮 -->
            <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <!-- img 绑定 预览图片的真实url -->
      <img :src="previewPath" alt class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
import { getCate, getMany, addInfo } from '../../api/add'
export default {
  name: '',
  data() {
    return {
      // 切换标签页时，返回当前 name 值 (当前标签页索引值)
      activeName: 0,
      // 添加商品数据，命名以接口文档为准
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类数组
        goods_cat: [],
        // 图片
        pics: [],
        // 商品详情描述
        goods_introduce: '',
        attrs: []
      },
      addFormRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_prive: [{ required: true, message: '请求输入商品价格', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请求输入商品重量', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请求输入商品数量', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请选择商品分类', trigger: 'blur' }]
      },
      // 商品分类列表
      catelist: [],
      // 级联选择框配置项
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 响应回来的动态属性数据
      manyTableData: [],
      // 响应回来的静态属性数据
      onlyTableData: [],
      // 上传图片的URL地址
      uploadURL: 'https://www.liulongbin.top:8888/api/private/v1/upload',
      // 图片上传组件的headers请求头对象
      // upload组件使用自己的请求方式，所以上传时没有携带token，需要单独配置请求头信息
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 把缩列图的真实url绑定到data中，然后渲染页面dialog中，即可实现点击缩列图渲染效果
      previewPath: '',
      // 控制图片预览dialog的显示隐藏
      previewVisible: false
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类数据
    async getCateList() {
      const res = await getCate()
      if (res.meta.status !== 200) return this.$message.error('获取商品分类数据失败！')
      this.catelist = res.data
    },
    // 级联选择器发送变化触发这个函数
    handleChange() {
      // 实现级联选择器选择范围的控制，只能选中3级分类
      // 判断 选中值的 length 不为3，就没有选中3级，清空选中值
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    // 标签页切换效果实现（不满足切换条件时，阻止用户切换）
    // 1 :before-leave="beforeTabLeave" 在 tabs 绑定事件函数
    // 2 切换 tab 标签页前触发这个函数
    // 3 activeName 即将进入的标签页名字， oldActiveName 即将离开的标签页名字
    // 4 return false 可以阻止标签页切换
    beforeTabLeave(activeName, oldActiveName) {
      // 如果标签页为0时，级联选择框的选中值不是3级，阻止切换，先提示用户在阻止切换
      if (oldActiveName == 0 && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类！')
        return false
      }
    },
    // tab 切换时触发这个函数
    async tabClicked() {
      // 通过当前标签页的索引值判断当前点击的是哪个面板，把请求回来的动态属性数据绑定到data上
      // 请求参数：分类id，params
      // this.activeName == 1 访问的是动态属性面板 el-tab-pane
      // this.activeName == 2 访问的是静态属性面板 el-tab-pane
      if (this.activeName == 1) {
        const res = await getMany(this.cateId, { sel: 'many' })
        if (res.meta.status !== 200) return this.$message.error('获取动态参数失败！')
        // 把响应数据中的每一条中的 vals 字符串转数组，空字符串转空数组，避免渲染bug
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length == 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTableData = res.data
      } else if (this.activeName == 2) {
        const res = await getMany(this.cateId, { sel: 'only' })
        if (res.meta.status !== 200) return this.$message.error('获取静态属性失败！')
        this.onlyTableData = res.data
        console.log(res.data)
      }
    },
    // 图片上传成功事件，根据接口文档处理响应数据，保存到请求参数中
    handleSuccess(response) {
      // response 是上传成功返回的响应数据，file文件信息，fileList当前上传组件的文件列表
      // 1 拼接得到一个图片信息对象，data.tmp_path响应回来的临时路径
      const picInfo = { pic: response.data.tmp_path }
      // 2 将图片信息对象，push到pics数组中（接口文档要求：pics为数组，数组包对象 pics: [{},{}]）
      this.addForm.pics.push(picInfo)
    },
    // 处理移除图片的操作，当移除图片时，需要把请求参数中对应的图片数据也删除掉
    handleRemove(file) {
      // file.response.data.tmp_path 将要移除的图片的临时路径
      const filePath = file.response.data.tmp_path
      // 找到索引值
      const ind = this.addForm.pics.findIndex(item => item.pic === filePath)
      // 删除索引为ind的这项
      this.addForm.pics.splice(ind, 1)
    },
    // 处理图片预览效果，点击缩列图时
    handlePreview(file) {
      // 点击缩列图时，把缩列图中的真实url赋值到data中，然后渲染到页面dialog中
      // console.log(file.response)
      this.previewPath = file.response.data.url
      // 点击缩列图时显示预览图片dialog
      this.previewVisible = true
    },
    // 发起添加数据请求
    add() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请填写必要的表单项目！')
        // 请求参数处理：数组转字符串
        // 页面渲染数据类型和请求参数数据类型不统一时，例如级联选择框只能使用数组，但作为请求参数时只能是字符串，使用深拷贝处理
        // this.addForm.goods_cat = this.addForm.goods_cat.join(',') 使用这种报错，页面级联选择框porp要求是数组类型，确使用用了字符串
        // 深拷贝后，把参数转字符串
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数：循环数组，提取满足条件的值做为参数，然后push到请求参数中
        this.manyTableData.forEach(item => {
          const newInfo = { 
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
            }
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        // 处理动态静态只是改变了addForm中的attrs，深拷贝中是需要处理添加的，这样深拷贝后的数据也就有了
        form.attrs = this.addForm.attrs
        // 发起请求添加商品
        // 商品名称，必须是唯一的
        const res = await addInfo(form)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success('添加商品成功！')
        // 添加成功后路由跳转
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    // 只有选中三级分类时，才需要获取索引为2的值（分类id）
    // 不是三级时返回 null
    cateId() {
      if (this.addForm.goods_cat.length == 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  },
  components: {
    quillEditor
  }
}
</script>

<style scoped lang="scss">
.el-alert {
  margin: 15px 0;
}
/deep/.el-step__title {
  font-size: 14px;
}
.el-tabs {
  margin-top: 20px;
}
.el-checkbox {
  margin: 0 10px 0 0;
}
.previewImg {
  width: 100%;
}

/**
  最新高度 字体大小
*/
/deep/.ql-toolbar.ql-snow + .ql-container.ql-snow {
  min-height: 300px;
  font-size: 16px;
}

.btnAdd {
  margin-top: 15px;
}
</style>

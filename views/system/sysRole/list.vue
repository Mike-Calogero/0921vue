<template>
  <div class="app-container">
    <!-- 角色列表 -->
    <!--查询表单-->

    <div class="search-div">
      <el-form label-width="70px" size="small">
        <el-row>
          <el-col :span="24">
            <el-form-item label="角色名称">
              <el-input style="width: 30%" v-model="searchObj.roleName" placeholder="角色名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="display:flex">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="fetchData()">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetData">重置</el-button>
        </el-row>
      </el-form>
    </div>

    <!-- 工具条 -->
    <div class="tools-div">
      <el-button type="success" icon="el-icon-plus" size="mini" @click="add">添 加</el-button>
      <el-button class="btn-add" size="mini" @click="batchRemove()">批量删除</el-button>
    </div>

    <!-- 表格 -->
    <el-table v-loading="listLoading" :data="list" stripe border style="width: 100%; margin-top: 10px"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" />
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="roleName" label="角色名称" />
      <el-table-column prop="roleCode" label="角色编码" />
      <el-table-column prop="description" label="角色编码" />
      <el-table-column prop="createTime" label="创建时间" width="160" />
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row.id)" title="修改" />
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row.id)" title="删除" />
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination :current-page="page" :total="total" :page-size="limit" style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper" @current-change="fetchData" />

    <!-- 添加弹出层 -->
    <el-dialog title="添加/修改" :visible.sync="dialogVisible" width="40%">
      <el-form ref="dataForm" :model="sysRole" label-width="150px" size="small" style="padding-right: 40px;">
        <el-form-item label="角色名称">
          <el-input v-model="sysRole.roleName" />
        </el-form-item>
        <el-form-item label="角色编码">
          <el-input v-model="sysRole.roleCode" />
        </el-form-item>
        <el-form-item label="角色编码">
          <el-input v-model="sysRole.description" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small" icon="el-icon refresh-right">取 消</el-button>
        <el-button type="primary" icon="el-icon-check" @click="saveOrUpdate()" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// shfit+alt+f

import api from "@/api/system/sysRole";

//vue
export default {

  //定义数据模型
  data() {
    return {
      listLoading: true,
      list: [], // 角色列表
      page: 1, // 页码
      total: 0, // 总记录数
      limit: 2, // 每页记录数
      searchObj: {}, // 查询条件
      dialogVisible: false, //对话框是否可见
      sysRole: {}, //角色对象
      multipleSelection: [],//多选
    };
  },

  created() {
    this.fetchData();

  },

  // 定义的方法
  methods: {

    handleSelectionChange(selection){
      this.multipleSelection =selection
    },

    //批量删除
    batchRemove() {
      if (this.multipleSelection.length == 0) {
        this.$message.warning("请选择要删除的记录");
        return
      }
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //定义数组
        var idList = []
        this.multipleSelection.forEach(item => {
          idList.push(item.id)
        });
        api.batchRemove(idList).then(response => {
          this.fetchData(this.page)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        })
      })
    },

    //编辑
    edit(id) {
      this.dialogVisible = true
      api.getById(id).then(response => {
        this.sysRole = response.data
      })
    },

    //更新
    update() {
      api.updateById(this.sysRole).then(response => {
        this.$message.success(response.message || '操作成功')
        this.dialogVisible = false
        this.fetchData(this.page)
      })
    },

    //添加
    save() {
      api.save(this.sysRole).then(response => {
        this.$message.success(response.message || '操作成功')
        this.dialogVisible = false
        this.fetchData(this.page)
      })
    },

    //添加或更新
    saveOrUpdate() {
      api.save(this.sysRole).then(response => {
        this.$message.success('添加成功')
        this.fetchData()
        this.dialogVisible = false
      })
    },

    //角色添加
    add() {
      this.dialogVisible = true
      this.sysRole = {}
    },

    //删除
    removeById(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //调用API 删除
        api.removeById(id).then(response => {
          console.log(response)
          this.fetchData() //调用列表
          //删除成功提示
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },

    //重置
    resetData() {
      this.searchObj = {}
      this.fetchData()

    },

    fetchData(pageNum = 1) {
      this.listLoading = false
      this.page = pageNum
      // 调用API
      api
        .getPageList(this.page, this.limit, this.searchObj)
        .then((response) => {
          // console.log(response)
          this.list = response.data.records;
          this.total = response.data.total;
        });
    },
  },
};
</script>
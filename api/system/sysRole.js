import request from '@/utils/request'

const api_name="/admin/system/sysRole"

export default{

    //批量删除
    batchRemove(idList) {
        return request({
            url: `${api_name}/delBatches`,
            method: `delete`,
            data: idList
        })
    },

    //编辑
    getById(id) {
        return request({
        url: `${api_name}/get/${id}`,
        method: 'get'
        })
    },

    //更新
    updateById(role) {
        return request({
            url: `${api_name}/update`,
            method: 'put',
            data: role
        })
    },

    //添加角色对象
    save(sysRole){
        return request({
            url: `${api_name}/save`,
            method: 'post',
            data: sysRole
        })
    },

    //删除
    removeById(id){
        return request({
            url: `${api_name}/delete/${id}`,
            method: 'delete'
        })
    },

    // 分页查询
    getPageList(page,limit,searchObj){
        return request({
            url: `${api_name}/${page}/${limit}`,
            method: 'get',
            params: searchObj 
        })
    }
}
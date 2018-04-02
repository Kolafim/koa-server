/*
* @ use 管理后台侧边栏菜单配置文件
*/
export default {
   // 分类管理
   category: [
    {
      label:'一级分类',
      route: '/server/category?type=category'
    },{
      label:'二级分类',
      route: '/server/category?type=category&item=1'
    }],
    // 文章管理
    article: [
    {
      label:'文章列表',
      route: '/server/article?type=article'
    },{
      label:'评论管理',
      route: '/server/article?type=article&item=1'
    }],
    // 用户管理
    user: [
    {
      label:'用户列表',
      route: '/server/user?type=user'
    },{
      label:'权限管理',
      route: '/server/user?type=user&item=1'
    }],
}

# 明道云视图插件案例

插件名称 | 源代码
--- | ---
地图 | [https://github.com/mingdaocom/plugin_view_samples/tree/master/map](https://github.com/mingdaocom/plugin_view_samples/tree/master/map)
明细表 | [https://github.com/mingdaocom/plugin_view_samples/tree/master/table](https://github.com/mingdaocom/plugin_view_samples/tree/master/table)
时间轴 | [https://github.com/mingdaocom/plugin_view_samples/tree/master/timeline](https://github.com/mingdaocom/plugin_view_samples/tree/master/timeline)


## 如何开发一个插件
[视图插件开发文档](/wiki)

## 如何安装已有插件到组织

### 克隆案例或其它视图插件仓库到本地
克隆仓库到本地
`git clone https://github.com/mingdaocom/plugin_view_samples.git`  

编辑器打开插件目录，以map为例

### 新建开发插件视图
在您的应用里新建一个工作表并新建一个开发插件视图。  
跟随视图配置"开发调试"引导完成到”安装 mdye cli“这一步。

<!-- ![新建开发视图插件](_readme_static_assets/developer_view9.png)   -->

### 更改本地mdye.json配置

查看"建立本地项目"这一步里的具体命令，使用 --id、--template 和 --host 后跟的参数替换您本地项目内mdye.json文件内的对应配置，没有 --host的话不需要替换host。  

<!-- ![新建开发视图插件](_readme_static_assets/developer_view9.png)   -->

到这一步你已经将本地的项目与你明道云内的视图进行了关联  
如果项目仓库存在`.config/params-config.json`文件，请执行 `mdye sync-params` 命令来将插件的参数配置同步到您在明道云建立的视图插件。

### 构建插件并推送到明道云
执行 `mdye build` 构建项目  
执行 `mdye push -m 初始化` 推送构建好的文件到明道云  

打开视图配置查看"提交"部分，已提交下面会出现刚刚提交的版本，可以选中前面的单选框来预览此次提交。

### 发布插件

### 管理在插件中心开启插件
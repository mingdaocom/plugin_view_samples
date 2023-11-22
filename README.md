# 明道云视图插件案例

| 插件名称 | 源代码                                                                                                                                           |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| 地图     | [https://github.com/mingdaocom/plugin_view_samples/tree/master/map](https://github.com/mingdaocom/plugin_view_samples/tree/master/map)           |
| 明细表   | [https://github.com/mingdaocom/plugin_view_samples/tree/master/table](https://github.com/mingdaocom/plugin_view_samples/tree/master/table)       |
| 时间轴   | [https://github.com/mingdaocom/plugin_view_samples/tree/master/timeline](https://github.com/mingdaocom/plugin_view_samples/tree/master/timeline) |

## 如何开发一个插件

[视图插件开发文档](https://help.mingdao.com/extensions/developer/view/)

## 如何安装已有插件到组织

### 克隆案例或其它视图插件仓库到本地

打开控制台，克隆仓库到本地
`git clone https://github.com/mingdaocom/plugin_view_samples.git`

![Alt text](.assets/image.png)

编辑器打开插件目录，以 timeline 为例。  
在 timeline 文件夹内执行 `npm i` 安装项目依赖

![Alt text](.assets/image-3.png)

### 新建开发插件视图

在您的应用里新建一个工作表并新建一个开发插件视图。

![Alt text](.assets/image-1.png)

跟随视图配置"开发调试"引导，完成”安装 mdye cli“这一步，完成后输入`mdye --version` 确认是否安装成功，正常显示版本号即为成功。

![Alt text](.assets/image-2.png)

### 更改本地 mdye.json 配置

查看"建立本地项目"这一步，使用 --id、--template 和 --host 后跟的参数替换您本地项目内 mdye.json 文件里的对应的配置，没有 --host 时不需要替换 host。

![Alt text](.assets/image-4.png)

修改后的 mdye.json 文件

![Alt text](.assets/image-7.png)

到这一步您已成功将本地的项目与你明道云内建立的视图插件进行了关联。  
如果项目仓库存在`.config/params-config.json`文件，请执行 `mdye sync-params` 命令来将插件的参数配置同步到您在明道云建立的视图插件。

![Alt text](.assets/image-23.png)

刷新明道云页面，打开对应视图的视图配置，您会在"插件设置"里看到刚刚同步上去的参数配置，这个时候可以将插件名称改成您想要的名字，这里改成"时间轴视图"。

![Alt text](.assets/image-20.png)

### 构建插件并推送到明道云

执行 `mdye build` 构建项目

> 如果 build 报错，请先确认第一步里的 `npm i` 是否已正确执行。

执行 `mdye push -m 初始化` 推送文件到明道云

![Alt text](.assets/image-24.png)

打开视图配置查看"提交"部分，标题"已提交"下面会出现刚刚提交的版本，可以选中前面的单选框来预览此次提交，选中后视图区域会自动刷新。

![Alt text](.assets/image-10.png)

时间轴视图插件时间字段为必填字段，请先在表单配置内添加一个日期字段，在"参数映射"配置内将"时间"字段设为刚刚添加的字段后插件即可运行，右上角新建记录查看效果。

![Alt text](.assets/image-12.png)

### 发布插件

在上面提到的提交列表里可以点击更多按钮发布您选择的提交记录。

![Alt text](.assets/image-13.png)

![Alt text](.assets/image-14.png)

### 应用管理员在插件中心开启插件

从明道云首页进入插件中心就可以看到刚刚发布的插件了。

![Alt text](.assets/image-27.png)

开启插件发布状态

![Alt text](.assets/image-26.png)

这个时候您已经可以在新建视图里看到刚刚发布的"时间轴视图"了，Enjoy it!

![Alt text](.assets/image-18.png)

<!-- <style> img { max-width: 800px;  height: auto; } </style> -->

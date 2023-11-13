# 视图插件源码示例

|插件名称|作者|源代码|
|-|-|-|
|地图|裴晓闯|Github 地址：[https://github.com/mingdaocom/plugin_view_samples/map](https://github.com/mingdaocom/plugin_view_samples/map)<br />Gitee 地址：[https://gitee.com/mingdaocloud/plugin_view_samples/map](https://gitee.com/mingdaocloud/plugin_view_samples/map)|
|明细表|谢成刚|Github 地址：[https://github.com/mingdaocom/plugin_view_samples/table](https://github.com/mingdaocom/plugin_view_samples/table)<br />Gitee 地址：[https://gitee.com/mingdaocloud/plugin_view_samples/table](https://gitee.com/mingdaocloud/plugin_view_samples/table)|
|时间轴|安萍|Github 地址：[https://github.com/mingdaocom/plugin_view_samples/timeline](https://github.com/mingdaocom/plugin_view_samples/timeline)<br />Gitee 地址：[https://gitee.com/mingdaocloud/plugin_view_samples/timeline](https://gitee.com/mingdaocloud/plugin_view_samples/timeline)|

# 视图插件开发文档

从 V10.0 开始，明道云正式支持插件架构。本文档是供开发者阅读的「视图」插件开发文档，需要开发者具备前端开发基础，掌握Javascript、CSS和HTML等相关知识。
> 如果开发者熟悉 React JS，也可以通过查看明道云前端开源项目 [https://github.com/mingdaocom/pd-openweb](https://github.com/mingdaocom/pd-openweb) ，参考明道云系统视图代码进行插件的开发。

## 关于视图插件

### 什么是视图插件？
视图插件又叫「自定义视图」，当明道云的表格、看板、层级、日历、画廊、详情、甘特图等系统视图不能满足用户视图展示需求的时候，开发者可以通过自己编写代码实现一个完全自定义的视图页面，用于展示工作表的记录数据。自定义视图支持搜索、筛选、统计、快速筛选和筛选列表等操作，还可以通过明道云公共Javascript接口实现调用系统组件，比如展示记录详情弹窗、调用新建记录窗口等等。
### 视图插件和系统视图有什么区别？
从使用者的角度看，视图插件和普通视图是没有任何区别的。当组织管理员通过发布开发者插件、安装插件或者导入插件后，所有已启用的插件即对组织下的所有用户生效，用户可以像使用表格、看板、日历等系统视图一样使用这些视图，也可以正常的为视图分配权限和进行视图分享等操作。

## 开发步骤


### 准备工作

  -  安装 Node.js（>=16.20） 和 npm
  -  准备集成开发环境（IDE），推荐 VS Code
  -  如果是团队开发，请准备好代码版本管理工具，推荐 Git

### 创建视图插件

要创建一个视图插件，有两种方式。

#### 1. 创建自定义视图

通过在新建视图时，创建一个「自定义视图」，此时系统会自动创建一个视图插件，并以当前工作表为该视图的开发调试环境。

![从工作表视图创建](_readme_static_assets/developer_view1.png)

#### 2. 在插件中心制作插件

在系统首页进入「插件中心」

![插件中心](_readme_static_assets/developer_view2.png)

在插件「我开发的」页面中点击「制作插件」

![插件中心—我开发的](_readme_static_assets/developer_view3.png)

通过此方式创建插件时，仍然需要选择一张工作表作为开发调试环境，选择后会自动在该工作表下创建一个新的视图用于开发调试视图插件。

创建好插件后，进入到工作表下新创建的这个自定义视图，可以进行下一步开发。

![自定义视图](_readme_static_assets/developer_view4.png)

#### 3. 插件需求分析

在制作视图插件之前，一定要对要开发的视图进行需求分析，明确视图的适用范围，并通过设计合理的设置项来提高视图插件的通用性。

比如，有两张工作表：订单和订单明细。

|订单表|订单明细表|
|-|-|
|![订单表](_readme_static_assets/developer_view5.png)|![订单明细表](_readme_static_assets/developer_view5-2.png)|

现在开发者想自己开发一个视图，将「订单明细」的数据显示到主「订单」的表格中，主订单的数据将以合并单元格的方式同时展示两张表的数据，大概类似这样：

![明细表](_readme_static_assets/developer_view6.png)

首先，在功能实现上，我们可以采取先加载主表格，再通过异步的方式获取子表数据进行加载。

其次，经过分析，这个视图插件如果要做到有一定的通用性，给任意一个工作表都能使用，那就需要增加一些使用者可以自由配置的内容：

- 这个视图表格的显示字段和顺序是允许使用者自行调整配置的；
- 一个工作表可能存在多张子表，那么就需要使用者配置要把哪张子表展示到主表格中；

通过对视图需求的整理，可以让用户更加明确开发的目标和实现的边界，也更容易将插件做到适应更多的通用场景，降低开发的成本。

#### 4. 插件基础设置

![插件配置](_readme_static_assets/developer_view7.png)

##### i. 图标和名称

插件的名称建议能准确表达视图的作用，且不用带“视图”二字，比如：「地图」、「思维导图」、「树型表格」等等。

图标可以使用自定义图标，这个相当于插件的logo。

##### ii. 功能启用

视图插件允许用户自由选择是否启用「快速筛选」和「筛选列表」。当启用后，视图使用者在操作了快速筛选项和筛选列表后，系统将向插件发送事件触发消息，开发者需要在插件中添加事件处理句柄并通过传入的筛选条件处理数据筛选逻辑。

可以参考本文档附录中的 [mdye 消息系统](#mdye-消息系统) 示例代码。

##### iii. 定义视图设置项参数

|![主表](_readme_static_assets/developer_view8-1.png)|![子表](_readme_static_assets/developer_view8-2.png)|![配置](_readme_static_assets/developer_view8-3.png)|
|:-:|:-:|:-:|
|主表显示字段|明细表字段|参数映射配置|

在以上这个示例中，我们定义了两个视图设置项：「显示字段(`showFields`)」和「子表明细字段(`sub`)」，分别对应两个配置的需求。在「参数映射」中，开发者可以将实际的视图配置映射到字段里，并在代码中通过 `env` 变量获取到它的值。参考代码：

```javascript
import { env } from "mdye";
const { showFields, sub } = env;
// showFields, sub 即为使用者配置的值，变量名称和配置中的变量ID一一对应
```

设置项参数有如下几种类型：

|设置项类型|子类型|值类型|备注|
|-|-|-|-|
|字段选择器|字段单选<br />字段多选|array[string]|字段多选时，可以限制选择字段的数量|
|字符串||string||
|数值||double||
|枚举值|单选框<br />下拉菜单|array[string]|选项格式为 key=value ，其中 vlaue 为呈现给使用者的文字，key 为代码中获取到的值；<br />样式为单选框时，可以选择横向或竖向排列；|
|布尔值|开关<br />勾选框|boolean||
|分组标题||null||

#### 5. 创建本地项目

接下来，切换到「开发调试」面板，我们将根据向导创建一个本地项目，并将本地项目运行在调试工作表中。

![开发调试向导](_readme_static_assets/developer_view9.png)

##### i. 选择脚手架模板

目前系统提供了「React 基础示例模板」和「Javascript 基础示例模板」，选择对应的模板后，在执行初始化命令时会创建对应的模板文件。

##### ii. 安装 mdye cli 命令行工具

本地项目的初始化创建是通过明道云的命令行工具 `mdye` 来实现的，所以需要事先全局安装这个工具。`mdye` 是 MingDaoYun Extensions 的首字母缩写。

![安装mdye-cli](_readme_static_assets/developer_view10.png)

请在计算机终端命令行用以下命令安装：

```shell
$ npm install -g mdye-cli
```

如果报没有权限的错误，请用 `sudo` 来安装：

```shell
$ sudo npm install -g mdye-cli
```

安装完成后，可以用下面的命令来验证是否安装成功：

```shell
$ mdye --version
beta-0.0.15
```
如果能正常输出版本号，则表示安装成功。这个工具的安装通常来说是一次性的，即后续开发新插件时无需再次安装该工具。如果该工具将来有新版本，则可以重新安装该工具进行升级。

`mdye` 完整的命令如下：

```shell
Usage: mdye [options] [command]

Options:
  -v, --version   查看 mdye 版本
  -h, --help      帮助

Commands:
  auth            mdye auth  授权登录
  init [options]  mdye init view --id <id> --template <template-name> 初始化项目，请从web端复制命令
  start           mdye start 开始开发
  build           mdye build
  push [options]  mdye push -m <message> 提交插件
  whoami          mdye whoami  我是谁
  logout          mdye logout  注销当前环境账户
  help [command]  子命令帮助
```

##### iii. 初始化本地项目

![本地项目](_readme_static_assets/developer_view11.png)

在「建立本地项目」步骤中复制创建插件本项目的命令，在本地终端中执行。

![本地项目命令](_readme_static_assets/developer_view12.png)

你可以自定义本地项目文件夹名称，直接回车则使用系统给定的文件夹名称。

接下来需要启动本地项目，我们先进入插件本地项目文件夹，然后打开 VS Code，接下来的所有插件开发操作都在VS Code中完成：

```shell
$ cd mdye_view_6541abe07a43f661079c234f  #进入项目文件夹
$ code .   #在 VS code 中打开项目
```

在VS Code中打开项目后，从菜单「终端>新建终端」新建一个「终端」窗口，依次输入以下命令：

```shell
$ npm i        #安装项目依赖
$ mdye start   #启动本地项目调试
```

执行之后，可以看到如下画面：

![执行结果](_readme_static_assets/developer_view13.png)

##### iv. 调试本地插件

项目运行成功后，会生成一个本地服务器js文件，把这个地址填入插件的「调试」页面，并点击「加载」：

![调试运行本地项目](_readme_static_assets/developer_view14.png)

此时，视图页面会动态渲染该视图插件，我们在初始化脚本里写一了些简单的和明道云工作表交互的方法：

![调试运行本地项目](_readme_static_assets/developer_view15.png)

你可以尝试修改 `src/App.js` 文件并保存，由于采用了热更新技术，所以代码修改保存后会在视图上实时生效。

##### v. 配置代码级环境参数

环境参数对于插件的作用，主要是存放一些在代码级别会用到的开发配置，用于将来插件上架后被安装时或导出到别的环境中时可以更换配置值。例如开发者在开发视图插件时使用了一个付费的第三方组件（前端），在开发时开发者填入的是自己的 license Key。开发者希望用户安装或导入插件后可以使用自己的 Key不要共享开发者的付费授权。此时就可以使用环境参数配置来处理。

但是这个配置不是视图的使用者要去关心的，也不必在每次使用插件视图时都配置这个 key。所以它是一个管理员级别的只需要配置一次的值。

![配置环境参数](_readme_static_assets/developer_view16.png)

这个参数是JSON格式，它会直接被注入在 `mdye.env` 的参数中，开发者在编写环境参数时，注意不要和配置项参数的ID重复。

#### 6. 编写插件代码

##### i. 文件结构

视图插件的实现原理，是通过嵌入iframe来展示完全自定义代码的视图。在插件页面上，我们事先嵌入一个HTML页面，这页面中有一个 `div` 容器，它的 `id` 是 `app` ，`index.js` 是 `javascript` 入口文件。 因此我们只需要在 `index.js` 中最终把 HTML 内容渲染到 `#app` 即可。

这个文件结构是符合现代主流前端工程的，你也可以采用 `Vue.js` 或 `AngularJS` 等你更熟悉的前端开发框架，只需要把 `index.js` 作为入口文件即可。

> 📢 需要特别注意的是，移动端的适配需要开发者自行实现。如果移动端有特殊的配置，也可以增加一些设置项参数来处理。开发者可以通过检测当前页面中路径中是否以 `/mobile` 开头来判断是否处于移动端设备中。

##### ii. 代码调试

视图插件代码的开发和调试，和普通前端项目并无不同，开发者可以在浏览器使用 WebDevTools 进行代码的跟踪与调试。

##### iii. 与明道云数据的交互

我们提供了一个 `mdye` 的JSSDK包来实现与明道云应用工作表数据的交互。脚手架中已经默认安装了此依赖，如果你要手动安装，可以在项目中使用如下命令安装：

```shell
$ npm i mdye --save
```
在项目代码中，引入 `mdye` ：


```shell
import { env, config, api, utils } from "mdye";
```

`mdye` 提供了4个对象：

- `env` 用于获取视图设置项参数
- `config` 用于获取当前应用、工作表、视图相关的配置
- `api` 提供一系列的方法与明道云工作表的数据进行交互
- `utils` 调用明道云公共组件

详细用法可以查看本文档附录中的 [JSSDK API](#附录一mdye-jssdk-api) 。

下面是按上述示例需求开发完成的视图插件的截图：

![视图插件截图](_readme_static_assets/developer_view17.png)

#### 7. 提交本地代码

在视图插件开发过程中，可以随时将编译后的插件代码提交到服务器端保存。如果自定义视图使用了某个已提交的版本作为当前代码（需要清除本地加载的调试文件），则其他任何有该视图访问权限的人都将看到在服务端渲染的视图。而在「调试」模式下的本地地址，是只有开发者本人可以预览到视图的样式的。

提交本地代码使用如下命令：

```shell
$ mdye push -m "首次提交demo"
```

此时，如果开发者还没有登录授权到本地项目，则系统会弹出授权页面进行自动授权。然后，会自动编译和打包代码，并以当前登录的用户身份进行代码提交。

![提交插件](_readme_static_assets/developer_view18.png)

提交成功后，在插件的「提交」历史中可以查看到提交的代码。

![提交历史](_readme_static_assets/developer_view19.png)

#### 8. 发布插件

视图插件在发布之前，只能在调试应用中被使用。如果想要全组织都可以使用开发好的插件，则需要将插件发布到组织。插件的发布是基于开发者提交的代码的，开发者可以选择将某次提交的代码发布为一个正式的版本。发布时，需要定义版本号，且每次发布的版本号只能大于当前的版本号。

![插件发布](_readme_static_assets/developer_view20.png)

如果管理员在「插件中心」中启用了该插件，则该插件将对全组织下的成员生效，此时所有人都可以在搭建应用时使用该视图。

![启用插件](_readme_static_assets/developer_view21.png)

此时为工作表「添加视图」时就会出现视图插件的可选项：

![添加视图](_readme_static_assets/developer_view22.png)

#### 9. 插件管理

在「插件中心」，可以对开发中和已发布的插件进行管理。

「我开发的」列表中的插件为开发者自己创建的插件。可以在此为插件添加调试应用、查看提交历史与发布历史、发布新的插件版本。

![我开发的插件](_readme_static_assets/developer_view23.png)

「组织」列表中是组织下已经发布的所有插件。可以在此查看插件的发布历史，对插件进行环境参数配置，以及查看插件的使用明细。管理员也可以在此发布新版本对插件升级和回滚插件版本。

![组织下的插件](_readme_static_assets/developer_view24.png)

> 注：普通用户（非组织应用管理员）对组织下的插件只有列表查看权限，没有管理权限

#### 10. 插件的导出导入

暂未开放插件导出导入功能，敬请期待。

#### 11. 上架到插件库与安装插件

暂未开放上架到插件库功能，敬请期待。




## 附录一：`mdye` JSSDK API

### mdye.env

```javascript
{
    "env": {
      "fields": ["controlId"], // 字段选择器
      "string": "string",      // 字符串
      "numeric": 10,           // 数值
      "enum": ["key"],         // 枚举值
      "boolean": true,         // 布尔值
    }
}
```

### mdye.config

```javascript
{
    "config": {
      "appId": "string",         // 当前应用ID
      "worksheetId": "string",   // 当前工作表ID  
      "viewId": "string",        // 当前视图ID
      "controls": [{             // 当前视图下的字段配置信息
        "controlId": "string",
        "controlName": "string",
        ......
      }],
      "worksheetInfo": {...}    // 当前工作表配置信息
    }
}
```

### mdye.api

使用VS Code 等支持代码提示的编辑器时编辑器会自动显示使用方法

![代码提示](_readme_static_assets/developer_view25.png)

#### getFilterRows(*params*)<br />获取工作表行记录数据

```javascript
/**
* 获取指定视图下工作表记录
* @param params 参数
* @param {string} params.worksheetId 工作表id
* @param params.viewId 视图id
* @param params.pageSize 每页数量
* @param params.pageIndex 页码
* @param params.sortId 排序字段
* @param params.isAsc 是否升序
* @param params.notGetTotal 不返回总数，设为 true 时接口速度快
* @returns { data }
*/
```

#### getFilterRowsTotalNum(*params*)<br />获取工作表行记录数

```javascript
/**
* @param params 参数
* @param {string} params.worksheetId 工作表id
* @param {string} params.viewId 视图id
* @param {number} params.pageSize 每页数量
* @param {number} params.pageIndex 页码
* @returns { data } { state: 1, data: "100" }
*/
```

#### getRowDetail(*params*)<br />获取行记录详情

```javascript
/**
* 获取视图下指定记录详情
* @param params 参数
* @param params.appId 应用id
* @param params.worksheetId 工作表id
* @param params.viewId 视图id
* @param params.rowId 记录id
* @param params.getTemplate 返回对应表信息
* @returns { data }
*/
```

#### getRowRelationRows(*params*)<br />获取关联记录

```javascript
/**
* 获取视图下指定记录所关联的子表、关联记录列表
* @param params 参数
* @param params.controlId 关联记录字段或子表字段的controlId
* @param params.rowId 记录id
* @param params.worksheetId 当前表(关联记录字段或子表字段所在表)id
* @param params.keywords 搜索记录关键字
* @param params.pageSize 每页数量
* @param params.pageIndex 页码
* @param params.getWorksheet 对应关联表对象
* @returns { data }
*/
```

#### addWorksheetRow(*params*)<br />创建记录

```javascript
/**
* 添加记录
* @param params 参数
* @param params.appId 应用id
* @param params.worksheetId 应用id
* @param params.receiveControls 字段数据 具体看文档
* @returns { data }
*/

receiveControls: [
  {
    controlId: "",
    value: "",
  },
]
```

#### updateWorksheetRow(*params*)<br />更新行记录

```javascript
/**
* 保存记录
* @param params 参数
* @param params.appId 应用id
* @param params.worksheetId 工作表id
* @param params.rowId 记录id
* @param params.newOldControl 字段数据 具体看文档
* @returns { data }
*/
```

#### deleteWorksheetRow(*params*)<br />删除行记录

```javascript
/**
* 删除记录
* @param params 参数
* @param params.appId 应用id
* @param params.worksheetId 工作表id
* @param params.rowIds 记录id列表
* @returns { data }
*/
```

### mdye.utils

#### openNewRecord(*params*)<br />打开新建记录弹窗

```javascript
/**
 * 打开创建记录弹窗
 * @param params 参数
 * @param params.appId 应用id
 * @param params.worksheetId 工作表id
 * @param params.onAdd 创建记录成功回调 (newRow) => {}
 */
openNewRecord: (params: {
    appId: string;
    worksheetId: string;
    onAdd: function;
}) => any;
```

#### openRecordInfo(*params*)<br />打开记录详情弹窗

```javascript
/**
 * 打开记录详情弹窗
 * @param params 参数
 * @param params.appId 应用id
 * @param params.worksheetId 工作表id
 * @param params.viewId 视图id
 * @param params.recordId 记录id
 * @param params.onClose 关闭弹窗回调
 * @param params.updateRows 更新记录回调 (rowIds, newRow) => {}
 */
openRecordInfo: (params: {
    appId: string;
    worksheetId: string;
    viewId: string;
    recordId: string;
    onClose: function;
    updateRows: function;
}) => any;
```

#### selectRecord(*params*)<br />打开选择记录弹窗

```javascript
/**
 * 选择记录
 * @param params 参数
 * @param params.projectId 组织id[可选]默认当前应用所在组织
 * @param params.multiple 选多个
 * @param params.relateSheetId 对应的工作表 id
 * @param params.onSelect 选择完成回调 (records) => {}
 */
selectRecord: (params: {
    projectId: string,
    relateSheetId: string,
    multiple: boolean,
    onSelect: function;
}) => any;
```

#### selectUsers(*params*)<br />打开选择成员弹窗

```javascript
/**
 * 选择人员
 * @param params 参数
 * @param params.projectId 组织id[可选]默认当前应用所在组织
 * @param params.unique 只能选一个
 * @param params.onSelect 选择完成回调 (users) => {}
 */
selectUsers: (params: {
    projectId: string,
    unique: boolean,
    onSelect: function;
}) => any;
```

#### selectDepartments(*params*)<br />打开选择部门弹窗

```javascript
/**
 * 选择部门
 * @param params 参数
 * @param params.projectId 组织id[可选]默认当前应用所在组织
 * @param params.unique 只能选一个
 * @param params.onSelect 选择完成回调 (departments) => {}
 */
selectDepartments: (params: {
    projectId: string,
    unique: boolean,
    onSelect: function;
}) => any;
```

#### selectOrgRole(*params*)<br />打开选择组织角色弹窗

```javascript
/**
 * 选择组织角色
 * @param params 参数
 * @param params.projectId 组织id[可选]默认当前应用所在组织
 * @param params.unique 只能选一个
 * @param params.onSelect 选择完成回调 (departments) => {}
 */
selectOrgRole: (params: {
    projectId: string,
    unique: boolean,
    onSelect: function;
}) => any;
```

#### selectLocation(*params*)<br />打开选择地图定位弹窗

```javascript
/**
 * 选择地图定位
 * @param params 参数
 * @param params.distance 距离
 * @param params.closeAfterSelect 选择地点后关闭弹窗
 * @param params.multiple 选多个
 * @param params.defaultPosition  默认位置 {lat, lng}
 * @param params.onSelect 选择完成回调 () => {}
 * @param params.onClose 关闭回调 () => {}
 */
selectLocation: (params: {
    distance: number,
    defaultPosition: Object,
    multiple: boolean,
    onSelect: function,
    onClose: function
}) => any;
```

### mdye 消息系统

mdye支持以发布订阅的模式响应插件外部的操作，比如当视图筛选发生变化时插件可以接收到变更后的筛选值去重新请求数据。

一个简单的用法：

#### 

```javascript
import React, { useEffect, useState, useCallback } from "react";
import { env, config, api, utils, md_emitter } from "mdye";
import { parseEnv } from "./utils";
const { getFilterRows } = api;

export default function App() {
  const { appId, worksheetId, viewId, controls } = config;
  const mapViewConfig = parseEnv(env);
  const { loadNum } = mapViewConfig;
  const [records, setRecords] = useState([]);
  const [filters, setFilters] = useState({});
  async function loadRecords() {
    const res = await getFilterRows({
      worksheetId,
      viewId,
      pageIndex: 1,
      pageSize: loadNum,
      ...filters,
    });
    setRecords(res.data);
  }
  const handleFiltersUpdate = useCallback((newFilers) => {
    setFilters(newFilers);
  }, []);
  useEffect(() => {
    loadRecords();
  }, [filters]);
  useEffect(() => {
    md_emitter.addListener("filters-update", handleFiltersUpdate);
    return () => {
      md_emitter.removeListener("filters-update", handleFiltersUpdate);
    };
  }, []);
  return (
    <div>
        { records.length }
    </div>
  );
}
```
当前支持的事件：

- `filters-update` 筛选条件变更
- `new-record` 按钮添加记录
# c310-Example-of-Park-Visualization

园区可视化示例项目，本项目基于自己封装的 [threejs-tools](https://github.com/LearnWebGLSeries/threejs-tools)，想看源码可以点进去自行查找。

[English](README.md) | 中文

![](./assets/images/banner.png)

## 帮助

如果对该项目有什么需求和建议，请直接在 `issue` 中提交以 `[需求]` 或者 `[建议]` 开头的内容，最好留下联系方式，我会不定期查看。

## 说明

- 基于 threejs.r158、ThreeMeshUI.v6.5.4、ThreeQuarks.v0.11.2 开发
- 使用 blender 构建的场景，导出成 gltf ( 通过自定义属性配置在前端进行控制 )
  - `level` 层级
  - `name` 物体名 用于查找
  - `parent` 父层级物体 用于层级分类
  - `selectable` 可选择
- 线框渲染 (在 GltfLevelConstructureLoader 中手动执行方法 进行渲染)
- 支持 Level 层级渲染（不限制结构，目前是楼 楼层 房间...）
- 颜色选择（ColorPicker）
- 简单的轮廓渲染 (SimpleOutlinePass， 删除了 OutlinePass 深度和贴图)
- FXAA (THREE 自带 FXAAPass) 
- [SSR](https://github.com/0beqz/screen-space-reflections) 
- Bloom (THREE 自带 UnrealBloomPass)
- SAO (THREE 自带 SAOPass)
- Vignette (sketchfab 的 VignettePass)
- 步进相机控制器 ( 将输入和输出分离设计 )
- 三种不同的背景图
- 业务范围 
  - 点击物体缩放到到物体位置
  - 物体顶牌信息 （css2d）
  - 选中物体 显示 锚点面板 （html）
  - 进入下一个层级
  - 进入前一个层级
  - 聚焦当前选择层级
  - 报警 和 取消报警
  - 屏幕报警 和 取消屏幕报警
  - 围栏 和 清理围栏

## 如何使用

使用 blender 创建场景，使用自定义属性配置场景。导出 gltf（需要包含自定义属性），使用 自定义 Loader 加载分离模型导入层级系统。

## 层级系统

```js
scene 
  - level building 1
    - containerObj
    - level floor 1
      - containerObj
      - level room 1
        - containerObj
      - level room 2
    - level floor 2
```

所有的 `level` 和 `containerObj` 构建于 `THREE.Group` 之上。 使用 `level` 控制物体显示隐藏。单独设备可以 独立控制显示隐藏。

## 推荐

- 使用 Blender 烘培所有的贴图到一张上。
- 使用盒子代替背景模型。

## 记录建议和需求

- 虚位以待

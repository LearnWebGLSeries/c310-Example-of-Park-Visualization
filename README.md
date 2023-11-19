# c310-Example-of-Park-Visualization

Example of Park Visualization, if you want some more, check [threejs-tools](https://github.com/LearnWebGLSeries/threejs-tools) out.

English  | [中文](README.ZH.md)


![](./assets/images/banner.png)

## Needs and Suggestions

If you have any requirements or suggestions for this project, please submit the content starting with `[requirements]` or `[suggestions]` directly in the `issue` section. It is best to leave your contact information, and I will check it periodically.

## introduce

- Developed based on Threejs r158, ThreeMeshUI v6.5.4 and ThreeQuarks v0.11.2
- Scenarios built using Blender, exported as gltf (controlled on the front-end through custom attribute configuration)
  - `level` hierarchy level
  - `name` object name is used for searching
  - `parent` parent level object is used for hierarchical classification
  - `selectable` 
- Wireframe rendering (manually executing methods for rendering in GltfLevelConstructLoader)
- Support for level rendering (not limited to structure, currently only building, floors and rooms...)
- Color Picker
- Simple OutlinePass (with OutlinePass depth and texture removed)
- FXAA (comes from THREE)
- [SSR](https://github.com/0beqz/screen-space-reflections)
- Bloom (comes from THREE UnrealBloomPass)
- SAO (comes from THREE SAOPass)
- Vignette (VignettePass of sketchfab)
- Stepping camera controller (designed to separate input and output)
- Three different background images
- Business scope
  - Click on the object to zoom to its position
  - Object top card information (css2d)
  - Display Anchor Panel for Selected Objects (HTML)
  - Go to the next level
  - Enter the previous level
  - Focus on the current selection level
  - Alarm and Cancel Alarm
  - Screen alarm and cancel screen alarm
  - Fencing and cleaning of fences

## How to use

Create a scene using Blender and configure the scene using custom attributes. Export gltf (including custom attributes), use custom Loader to load the detached model and import it into the hierarchical system.

## hierarchical system

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

All `level` and `containerObj` are built on top of `THREE.Group`. Use `level` to control the display and hiding of objects.

## recommend

- Use Blender to bake all the textures onto one.
- Use boxes instead of background models.

## Record suggestions and requirements

- leave a seat vacant for sb

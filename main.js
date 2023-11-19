import {
    THREE,
    ThreeMeshUI,
    QK, 
 
    CSS2DObject,

    ParkApp as App,
    GltfLevelConstructureLoader,

    Dock,
    DockPanel,
    
    DigitalGround,
    TexturedFence,
} from './assets/lib/three.module.min.js';

window.THREE = THREE; 

const app = new App({
    width: window.innerWidth,
    height: window.innerHeight,
    domElement: document.getElementById('div3d'),
    config: {
        debug: {
            ui: true,
            uiConfig: {
                theme: '黑金'
            }
        },
        camera: {
            position: new THREE.Vector3(37, 14, -45),
            far: 1000.0,
            near: 0.1
        },
        scene: {
            background: new THREE.Color(0xff0000).setHex(1),
        },
        outlinePass: {
            edgeColor: new THREE.Color(0xffff00)
        },
        bloomPass: {
            enabled: false,
            threshold: 0.5,
            strength: 0.4,
            radius: 0,
        }
    }
});

const dock = new Dock(app); 
    
const funcConfig = {
    enterLevel () {
        if (app.selectObj === undefined) {
            console.log('no obj selected !');
            return;
        }

        dock.clear();

        const level = app.selectObj.getLevel();
        
        if (level === undefined) {
            console.warn('no level find');
            return;
        }
    
        if (!level.hasChildrenLevel()) {
            console.warn('no next level');
            return;
        }

        level.next();
        // 手动取消选择外层物体
        app.mouseOverObj = undefined;
        app._onClick();
    },
    focusLevel () {
        if (app.selectObj === undefined) {
            console.log('no obj selected !');
            return;
        } 

        const level = app.selectObj.getLevel();
        
        if (level === undefined) {
            console.warn('no level find');
            return;
        }
    
        level.focus();
    },
    preLevel() {
        if (app.selectObj === undefined) {
            console.log('no obj selected !');
            return;
        }

        const level = app.selectObj.getLevel();

        if (level === undefined) {
            console.warn('no visible level !');
            return;
        }

        level.pre();

        // 取消选择
        app.mouseOverObj = undefined;
        app._onClick();
    },
    setAlarm() {
        if (app.selectObj === undefined) {
            console.log('no obj selected !');
            return;
        }
        // 查询设置报警
        app.alarm(app.selectObj.userData.name);
    },
    clearAlarm() {
        // 查询设置报警
        app.clearAlarm();
    },
    setFence() {
        if (app.selectObj === undefined) {
            console.log('no obj selected !');
            return;
        }

        const box = app.selectObj.getBoundingBox();

        const textureloader = new THREE.TextureLoader();
        const texture = textureloader.load('./assets/images/fence.png');

        const fence = new TexturedFence({
            height: box.max.y * 0.3,
            extension: 0.2,
            texture,
            objects: [app.selectObj]
        }); 

        app.scene.add(fence);
    },
    clearFence() {
        for (let i = 0; i < app.scene.children.length; i++) {
            if (app.scene.children[i].isFence) {
                // TODO app.scene.children[i].destory();
                app.scene.remove(app.scene.children[i]);
                i--;
            }
        }
    },
    screenAlarm() {
        app.screenAlarm();
    },
    cancelScreenAlarm() {
        app.cancelScreenAlarm();
    },
    showCss2dLabel() {
        if (app.selectObj === undefined) {
            console.log('no obj selected !');
            return;
        }

        const box = app.selectObj.getBoundingBox();

        const div = document.createElement( 'div' ); 
        div.textContent = app.selectObj.userData.name;
        div.style.backgroundColor = '#3EE5E7';
        div.style.border = '1px solid #fff';

        const label = new CSS2DObject( div ); 
        // 原始缩放 导致 对包围盒最高点 还要计算
        label.position.set(0, box.max.y * 1000, 0);
        label.center.set( 0, 0 ); 
        app.selectObj.add(label);
    },
    hiddenCss2dLabel() {
        if (app.selectObj === undefined) {
            console.log('no obj selected !');
            return;
        }

        for (let i = 0; i < app.selectObj.children.length; i++) {
            if (app.selectObj.children[i].isCSS2DObject) {
                app.selectObj.remove(app.selectObj.children[i]);
                i--;
            }
        }
    },
};

function changeTheme() {
    // 背景
    let backgroundImg = 'icon_20211207124700775_59418.jpg';

    if (app.config.debug.uiConfig.theme === '浅蓝') {
        backgroundImg = 'icon_20201225173803651_225213.jpg';
    } else if (app.config.debug.uiConfig.theme === '灰蓝') {
        backgroundImg = 'icon_20211103135353734_16845.jpg';
    }

    new THREE.TextureLoader()
        .setPath('./assets/images/background/')
        .load(
            backgroundImg,
            function (tex) {
                app.scene.background = tex;
                app.scene.environment = tex;
            }
        );
}

if (app.config.debug.ui === true) {
    app.debugUI_theme.add(app.config.debug.uiConfig, 'theme', ['黑金', '浅蓝', '灰蓝']).name('背景').onChange(() => {
        changeTheme();
    });

    app.ssrPass._ssrMaterial.uniforms.rayDistance.value = 16.0;
    app.ssrPass._finalSSRMaterial.uniforms.blur.value = 1.0;
    app.ssrPass._finalSSRMaterial.uniforms.blurKernel.value = 3.0;

    const ssrFolder = app.debugUI_theme.addFolder('SSR Pass');

    ssrFolder.add(app.ssrPass, 'enabled').name('启用');
    ssrFolder.add(app.ssrPass._ssrMaterial.uniforms.rayDistance, 'value', 0.0, 100.0, 1.0).name('射线长度');
    ssrFolder.add(app.ssrPass._finalSSRMaterial.uniforms.blur, 'value', 0.0, 5.0, 0.1).name('模糊');
    ssrFolder.add(app.ssrPass._finalSSRMaterial.uniforms.blurSharpness, 'value', 0.0, 1.0, 0.1).name('模糊锐化');
    ssrFolder.add(app.ssrPass._finalSSRMaterial.uniforms.blurKernel, 'value', 0.0, 6.0, 1.0).name('模糊核');

    const bloomPassFolder = app.debugUI_theme.addFolder('Bloom Pass');

    bloomPassFolder.add(app.bloomPass, 'enabled').name('启用');
    bloomPassFolder.add(app.bloomPass, 'threshold', 0.0, 1.0, 0.1).name('阈值');
    bloomPassFolder.add(app.bloomPass, 'strength', 0.0, 1.0, 0.1).name('强度');
    bloomPassFolder.add(app.bloomPass, 'radius', 0.0, 10.0, 0.1).name('半径');

    app.debugUI_func.add(funcConfig, 'enterLevel').name('进入下一个层级');
    app.debugUI_func.add(funcConfig, 'focusLevel').name('聚焦当前层级');
    app.debugUI_func.add(funcConfig, 'preLevel').name('进入上一个层级');
    app.debugUI_func.add(funcConfig, 'setAlarm').name('报警');
    app.debugUI_func.add(funcConfig, 'clearAlarm').name('清除报警');

    app.debugUI_func.add(funcConfig, 'setFence').name('创建围栏');
    app.debugUI_func.add(funcConfig, 'clearFence').name('清理围栏');

    app.debugUI_func.add(funcConfig, 'screenAlarm').name('屏幕报警');
    app.debugUI_func.add(funcConfig, 'cancelScreenAlarm').name('停止屏幕报警');

    app.debugUI_func.add(funcConfig, 'showCss2dLabel').name('显示label');
    app.debugUI_func.add(funcConfig, 'hiddenCss2dLabel').name('删除label');
}

changeTheme();

function createGround(app) {
    const textures = [];
    const textureloader = new THREE.TextureLoader();

    textures.push(textureloader.load('./assets/images/ground/02.png'));
    textures.push(textureloader.load('./assets/images/ground/icon_20210418125256801_956034.png'));
    textures.push(textureloader.load('./assets/images/ground/icon_20210625174703331_294105.png'));
    textures.push(textureloader.load('./assets/images/ground/icon_20210625175116741_958937.png'));

    for (let i = 0; i < textures.length; i++) {
        textures[i].colorSpace = THREE.LinearSRGBColorSpace;
        textures[i].wrapS = THREE.RepeatWrapping;
        textures[i].wrapT = THREE.RepeatWrapping;
        textures[i].magFilter = THREE.LinearFilter;
        textures[i].minFilter = THREE.LinearMipmapLinearFilter;
    } 

    const ground = new DigitalGround({
        textures, radius: 200, ssrEnable: true
    });

    ground.position.y = -0.1;

    app.addEventListener('beforerenderer', function() {
        ground.updateTime();
    });
    app.scene.add(ground);
}

function createParticles(app) {
    const clock = new THREE.Clock();
    const batchSystem = new QK.BatchedRenderer();
    const texture = new THREE.TextureLoader().load("./assets/images/particle_default.png");
    // Particle system configuration
    const muzzle = {
        duration: 1000,
        looping: true,
        startLife: new QK.IntervalValue(0.1, 20),
        startSpeed: new QK.ConstantValue(0.6),
        startSize: new QK.IntervalValue(0.1, 0.4),
        startColor: new QK.ConstantColor(new THREE.Vector4(1, 1, 1, 1)),
        worldSpace: true,

        maxParticle: 500,
        emissionOverTime: new QK.ConstantValue(20),
        emissionBursts: [{
            time: 10,
            count: new QK.ConstantValue(100),
            cycle: 10,
            interval: 1,
            probability: 1,
        }],

        shape: new QK.GridEmitter({ width: 70, height: 70, column: 70, row: 70 }),
        material: new THREE.MeshBasicMaterial({map: texture, blending: THREE.AdditiveBlending, transparent: true}),
        startTileIndex: new QK.ConstantValue(91),
        uTileCount: 0,
        vTileCount: 0,
        renderOrder: 2,
        renderMode: QK.RenderMode.BillBoard
    };

    // Create particle system based on your configuration
    const muzzle1 = new QK.ParticleSystem(muzzle);
    // developers can customize how the particle system works by 
    // using existing behavior or adding their own Behavior.
    muzzle1.addBehavior(new QK.ColorOverLife(new QK.ColorRange(new THREE.Vector4(1, 0.3882312, 0.125, 1), new THREE.Vector4(0, 0.826827, 0.3014706, 1))));
    muzzle1.addBehavior(new QK.SizeOverLife(new QK.PiecewiseBezier([[new QK.Bezier(1, 0.95, 0.75, 0), 0]])));
    // texture atlas animation
    muzzle1.addBehavior(new QK.FrameOverLife(new QK.PiecewiseBezier([[new QK.Bezier(91, 94, 97, 100), 0]])));
    muzzle1.emitter.name = 'muzzle1';
    // muzzle1.emitter.position.x = 10;
    // muzzle1.emitter.position.y = 10;

    batchSystem.addSystem(muzzle1);

    // Add emitter to your Object3D
    app.scene.add(muzzle1.emitter);
    app.scene.add(batchSystem);

    batchSystem.rotateX(-Math.PI * 90 / 180);

    // console.log(app.scene);

    app.addEventListener( 'afterrenderer', function() {
        // console.log(1);
        batchSystem.update(clock.getDelta());
    });
} 

function createUI(app) {
    const container = new ThreeMeshUI.Block({
        width: 8,
        height: 3.5,
        padding: 1,
        fontFamily: './assets/font/custom-msdf.json',
        fontTexture: './assets/font/custom.png',
    }); 

    container.position.y = 16;
    container.lookAt(app.camera.position);

    const text = new ThreeMeshUI.Text({
        content: "城市 Demo",
        fontSize: 1.0
    });

    container.add( text );

    app.scene.add( container );
}
    
function createObject3D(app) {
    const scene = app.scene; 
        
    // 创建 level 结构
    const levelLoader = new GltfLevelConstructureLoader(app);

    levelLoader.scale.set(0.1, 0.1, 0.1);
    // app.colorPicker._pickingScene.scale.set(0.1, 0.1, 0.1);

    // 处理背景楼 
    levelLoader.handleObjectFunctions['AM_131_002_set_001_obj_0032_BoundingBox'] = function (obj) {
        obj.material.transparent = true;
        obj.material.metalness = 1.0;
        obj.position.y = 0.1;
        levelLoader._buildWireframe(obj, 0x777777);
        // obj.userData.ssrEnable = true;
        return true;
    };

    // 处理主体楼
    levelLoader.handleObjectFunctions['AM_131_002_set_001_obj_0017'] = function (obj) {
        levelLoader._buildWireframe(obj, 0x3EE5E7);
        obj.material.transparent = true;
        obj.material.opacity = 0.6;
        obj.material.color = new THREE.Color(0x3EE5E7);
        obj.userData.ssrEnable = true;
        // ！！！ 这里如果计算 boundingbox 不准确 并没有放进 app.scene  
        return true;
    };

    // 处理路面
    levelLoader.handleObjectFunctions['AM_131_002_set_001_obj_0684'] = function (obj) {
        levelLoader._buildWireframe(obj, 0x777777);
        obj.material.transparent = true;
        obj.material.opacity = 0.3;
        // obj.material.roughness = 1.0;
        obj.userData.ssrEnable = true;
        return true;
    }; 

    // 处理地面
    levelLoader.handleObjectFunctions['AM_131_002_set_001_obj_0687'] = function (obj) {
        obj.material.transparent = true;
        obj.material.opacity = 0.2;
        obj.material.metalness = 1.0;
        // obj.material.roughness = 0.05;
        // obj.userData.ssrEnable = true;
        return false;
    }; 

    // 处理车
    levelLoader.handleObjectFunctions['AM_131_002_set_001_obj_0630'] = function (obj) {
        levelLoader._buildWireframe(obj, 0x3EE5E7);
        // obj.userData.ssrEnable = true;
        return true;
    }; 
    levelLoader.handleObjectFunctions['AM_131_002_set_001_obj_0632'] = function (obj) {
        levelLoader._buildWireframe(obj, 0x3EE5E7);
        // obj.material.roughness = 0.05;
        // obj.userData.ssrEnable = true;
        return true;
    };
    levelLoader.handleObjectFunctions['AM_131_002_set_001_obj_0634'] = function (obj) {
        levelLoader._buildWireframe(obj, 0x3EE5E7);
        // obj.userData.ssrEnable = true;
        return true;
    };
    levelLoader.handleObjectFunctions['AM_131_002_set_001_obj_0635'] = function (obj) {
        levelLoader._buildWireframe(obj, 0x3EE5E7);
        // obj.userData.ssrEnable = true;
        return true;
    };

    // 处理路灯
    for (let i = 377; i <= 438; i++ ) {
        levelLoader.handleObjectFunctions['AM_131_002_set_001_obj_0' + i] = function (obj) {
            if (obj.isGroup) {
                obj.traverse(sub => {
                    if (sub.isMesh) {
                        levelLoader._buildWireframe(sub, 0x3EE5E7);
                        // sub.userData.ssrEnable = true;
                    }
                });
            } else if (obj.isMesh) {
                levelLoader._buildWireframe(obj, 0x3EE5E7);
                // obj.userData.ssrEnable = true;
            }  
            return true;
        };
    }

    // 处理层级
    const floors = ['floor1.005', 'floor1.004', 'floor1.003', 'floor1.002', 'floor1.001', 'floor1'];
    
    for (let i = 0; i < floors.length; i++) {
        levelLoader.handleObjectFunctions[floors[i]] = function (obj) {
            levelLoader._buildWireframe(obj, 0x3EE5E7); 
            obj.material.transparent = true;
            obj.material.opacity = 0.6;
            obj.material.color = new THREE.Color(0x3EE5E7);
            return true;
        };
    }

    levelLoader.setPath("./assets/models/city/");
    levelLoader.load("city.gltf", function(level) {
        app.scene.add(level);

        // 添加点击事件
        app.scene.traverse((obj) => {
            if (obj.userData.selectable === true) {
                obj.addEventListener('selected', function() {
                    app.fit(obj);

                    dock.clear();

                    const box = obj.getBoundingBox();  
                    const pos = box.getCenter(new THREE.Vector3()).clone();
                    pos.y = box.max.y; 

                    const dockPanel1 = new DockPanel(app, pos);

                    dockPanel1.domElement.textContent = obj.userData.name;

                    dock.add(dockPanel1); 
                });

                obj.addEventListener('unselected', function() {
                    dock.clear();
                });
            }
        });
    });

    // 创建地面

    createGround(app);

    // 创建粒子

    createParticles(app);

    // createUI

    createUI(app);   
}

createObject3D(app);

window.app = app;

app.addEventListener( 'resize', function() {
    app.resize(window.innerWidth, window.innerHeight);
});

app.addEventListener('contextmenu', funcConfig.preLevel);

app.start();

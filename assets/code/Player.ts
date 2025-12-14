import { _decorator, Component, Input, input, EventKeyboard, Node, KeyCode, Collider, Label, director, SystemEventType, Vec3, Camera } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {

    // 控制2d/3d节点显示，隐藏，销毁
    // 销毁节点：this.node.destroy();
    // 设置节点显示：this.node.active = true;
    // 设置节点隐藏：this.node.active = false;
    @property(Node)
    tipsNOde: Node | null = null;

    // 修改提示文本内容
    @property(Label)
    tipsLabel: Label | null = null;

    // 绑定玩家节点
    @property(Node)
    playerNode: Node | null = null;

    // 绑定相机节点
    @property(Node)
    cameraNode: Node | null = null;

    // 设置小车的速度是30
    @property // 装饰器 用于在编辑器中显示该属性
    moveUpSpeed:number = 30;

    // 设置小车的左右移动速度是30
    @property
    moveLrSpeed:number = 30;

    lrMove = {a:false, b:false}; // 左右移动的变量
    moveForward: boolean = true; // 前进开关


    // 监听碰撞触发：组件.on（'触发类型',肒行函数,this)
    // 监听碰撞触发类型：onTriggerEnter 开始触发
    // 监听碰撞触发类型：onTriggerStay 持续触发
    // 监听碰撞触发类型：onTriggerExit 结束触发
    playerCollider: Collider | null = null;  // 玩家碰撞组件

    @property({ tooltip: '赛道左边界（世界坐标 X）' })
    leftBound: number = -3;

    @property({ tooltip: '赛道右边界（世界坐标 X）' })
    rightBound: number = 3;

    @property({ tooltip: '是否启用拖拽控制' })
    enableDrag: boolean = true;

    private camera: Camera | null = null;
    private isTouching = false;
    private currentX = 0;

    // 监听类型如下：
    // 鼠标事件 Input.EventType.MOUSE_DOWN
    // Input. EventType MOUSE_MOVE
    // Input. EventType.MOUSE_UP
    // Input. EventType. MOUSE_WHEEL
    // 触摸事件 Input. EventType. TOUCH_START
    // Input. EventType. TOUCH_MOVE
    // Input. EventType. TOUCH_END
    // Input. EventType. TOUCH_CANCEL
    // 键盘事件 Input.EventType.KEY_DOWN（键盘按下）
    // Input.EventType.KEY_PRESSING（键盘持续按下）
    // Input.EventType.KEY_UP（键盘释放）
    // 监听写法如下：input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
    // 监听开启和关闭成对写上，防止内存泄漏
    // 先获取目标节点的碰撞组件
    protected onLoad(): void {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
        this.playerCollider = this.playerNode!.getComponent(Collider)!;
        this.playerCollider = this.playerNode!.getComponent(Collider)!;
        this.playerCollider.on('onTriggerEnter', this.onTriggerEnter, this);

        // 关键：延迟一帧
        // 获取主相机（必须存在！）
        const cameras = director.getScene().getComponentsInChildren(Camera);
        this.camera = cameras.find(cam => cam.enabled) || null;
        if (!this.camera) {
            console.error('❌ No active camera found! Car control disabled.');
            return;
        }
    

        // 监听触摸事件（适用于 UI 节点）
        // 监听 Canvas 的触摸事件（推荐挂到 Canvas 上）
        this.node.scene.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.scene.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.scene.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.scene.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

    }

    protected onDestroy(): void {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
        this.playerCollider!.off('onTriggerEnter', this.onTriggerEnter, this);

        
        this.node.scene.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.scene.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.scene.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.scene.off(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        // 初始化当前位置
        this.currentX = this.node.position.x;
    }

    


    protected onTriggerEnter(colliderInfo) { // 碰撞的信息
        console.log("碰撞到的物体是：", colliderInfo);
        this.moveForward = false; // 碰撞后停止前进
        if(colliderInfo.otherCollider.node.name === "End") {
            this.tipsLabel!.string = "挑战成功！";
        } else {
            this.tipsLabel!.string = "挑战失败！";
        }
        this.tipsNOde!.active = true; // 碰撞到其他物体，显示提示节点
    }


    onKeyDown(event: EventKeyboard) {
        console.log("按下的键位：", event.keyCode);
        if (event.keyCode === KeyCode.KEY_A) {
            console.log("按下了A键");
            if (!this.lrMove.a) {
                this.lrMove.a = true;
            }
        } else if (event.keyCode === KeyCode.KEY_D) {
            console.log("按下了D键");
            if (!this.lrMove.b) {
                this.lrMove.b = true;
            }
        }
    }

    onKeyUp(event: EventKeyboard) {
        console.log("释放的键位：", event.keyCode);
        if (event.keyCode === KeyCode.KEY_A) {
            console.log("释放了A键");
            if (this.lrMove.a) {
                this.lrMove.a = false;
            }
        } else if (event.keyCode === KeyCode.KEY_D) {
            console.log("释放了D键");
            if (this.lrMove.b) {
                this.lrMove.b = false;
            }
        }   
    }

    start() {

    }

    /**
     * 
     * 获取节点的位置 
     * 修改节点的位置
     * this.node 代表当前脚本所挂载的节点
     * 
     * @param deltaTime 
     */
    update(deltaTime: number) {
        if (!this.moveForward) {
            return;
        }
        const position = this.node.getPosition();
        // 超出跑道范围，停止前进
        // if (position.z < -200) {
        //     console.log("成功");
        //     this.moveForward = false;
        //     return;
        // }

        const cameraPosition = this.cameraNode!.getPosition();
        const deltaPos = this.moveUpSpeed * deltaTime;
        // 让相机跟随小车移动
        this.cameraNode!.setPosition(cameraPosition.x, cameraPosition.y, cameraPosition.z - deltaPos);

        // 根据按键状态进行左右移动
        let x = position.x;
        // if (this.lrMove.a && !this.lrMove.b) {
        //     // 按下A键，向左移动
        //     x -= this.moveLrSpeed * deltaTime;
        // }
        // if (this.lrMove.b && !this.lrMove.a) {
        //     // 按下D键，向右移动
        //     x += this.moveLrSpeed * deltaTime;
        // }

        // x = Math.max(Math.min(x, 3), -3); // 限制x轴移动范围在-7到7之间

        // console.log("当前节点位置：", position);
        // 设置固定的速度移动，进行帧时间补偿 可以解决帧率波动的问题
        // 由于设备帧率忽高忽低，会造成速度不对等， 为了防止这种情况，还需要进行帧时间补偿
        
        const z = position.z - deltaPos
        this.node.setPosition(x, position.y, z);
    }


    /**
     * 重新开始游戏
     * @param button 按钮的相关信息
     * @param e 按钮的参数
     */
    protected newGame(button, e) { 
        console.log(e);
        // 方式一：重新加载场景
        // // 重置小车位置
        // this.node.setPosition(0, 0, 0);
        // // 重置相机位置
        // this.cameraNode!.setPosition(0, 10, 15);
        // // 隐藏提示节点
        // this.tipsNOde!.active = false;
        // // 重置提示文本
        // this.tipsLabel!.string = "加油！冲刺吧！";
        // // 重置前进开关
        // this.moveForward = true;

        // 方式二： 重新加载场景
        // 重新加载场景会重新走一遍onLoad， start等生命周期函数
        // 优点：代码简洁，适合小游戏，缺点：场景复杂时，重新加载场景会有卡顿感
        director.loadScene("RaceRoad");

    }

    protected onTouchStart(event: any) {
        console.log("触摸开始");
        if (!this.enableDrag || !this.camera) return;
        this.isTouching = true;
        this.updateCarPosition(event.getLocationX());
    }

    onTouchMove(event: any) {
        if (!this.isTouching || !this.enableDrag || !this.camera) return;
        this.updateCarPosition(event.getLocationX());
    }

    onTouchEnd() {
        this.isTouching = false;
    }

    private updateCarPosition(screenX: number) {
        if (!this.camera) return;
        // 获取屏幕宽度（兼容不同设备）
        const screenWidth = this.camera!.width; // 注意：这是相机的 width（单位：像素）

        // 将屏幕 X 映射到 [leftBound, rightBound]
        const ratio = screenX / screenWidth;
        let targetX = this.leftBound + ratio * (this.rightBound - this.leftBound);

        // 平滑过渡（可选，注释掉则瞬移）
        this.currentX = this.currentX * 0.7 + targetX * 0.3;

        // 应用位置（保持 Y 和 Z 不变）
        const pos = this.node.position;
        this.node.setPosition(this.currentX, pos.y, pos.z);
    }

    protected findCamera() {
        const cameras = this.node.scene.getComponentsInChildren(Camera);
        this.camera = cameras.find(c => c.enabled) || null;
    }
}


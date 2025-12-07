import { _decorator, Component, Input, input, EventKeyboard, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {

    // 设置小车的速度是30
    @property // 装饰器 用于在编辑器中显示该属性
    speed:number = 30;

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
    protected onLoad(): void {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    protected onDestroy(): void {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    onKeyDown(event: EventKeyboard) {
        console.log("按下的键位：", event.keyCode);
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
        const position = this.node.getPosition();
        // console.log("当前节点位置：", position);
        // 设置固定的速度移动，进行帧时间补偿 可以解决帧率波动的问题
        const z = position.z - this.speed * deltaTime;
        // 由于设备帧率忽高忽低，会造成速度不对等， 为了防止这种情况，还需要进行帧时间补偿
        this.node.setPosition(position.x, position.y, z);
    }



}


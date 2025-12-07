import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Move')
export class Move extends Component {
    
    // cocos脚本生命周期，简单说是 每个函数的执行顺序和触发方式。
    // 1,onLoad 加载函数：脚本第一个执行的函数，一般用于 开启监听事件
    // 2, onDestroy 销毁函数：当组件或者节点被 销毁时，执行这个函数，一般用于 关闭监听事件
    // 2, start（默认）开始函数：脚本启动执行该函数
    // 3,update（默认）每帧（1秒 = 60帧）都会执行的 循环函数
    // 4,lateupdate 延迟函数：update函数执行后，执行这个函数
    // 6, onDisable 节点被禁用/隐藏时 自动执行函数
    // 7, onEnable 节点被启用/显示时 自动执行函数

    protected onLoad(): void { 
        console.log("开始加载！")

    }


    start() {
        console.log("程序开始")
    }

    update(deltaTime: number) {
        console.log("程序更新")
    }

    protected onDestroy(): void {
        console.log("程序销毁")
    }

}


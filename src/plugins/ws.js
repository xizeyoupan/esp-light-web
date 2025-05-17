import { toast } from './toast.js'
import { useDefaultStore } from '../store/defaultStore.js'
import { i18n } from '../i18n.js'
import pinia from '../store/index.js'

const default_store = useDefaultStore(pinia)
const t = i18n.global.t

class QuestBody {
    constructor(param, data = '') {
        this.body = { type: 'quest', param: param, data: data }
    }

    toText() {
        return JSON.stringify(this.body)
    }
}

class WebSocketManager {

    init(url) {
        this.url = url
        this.ws = null

        this.heartCheck = {
            timeout: 10000,
            timeoutObj: null,
            serverTimeoutObj: null,
            reset: () => {
                clearTimeout(this.heartCheck.timeoutObj)
                clearTimeout(this.heartCheck.serverTimeoutObj)
                this.heartCheck.start()
            },
            start: () => {
                this.heartCheck.timeoutObj = setTimeout(() => {
                    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                        this.ws.send(JSON.stringify({ type: "ping", param: '' })) // 发送心跳包
                        this.heartCheck.serverTimeoutObj = setTimeout(() => {
                            this.ws.close() // 关闭 WebSocket
                        }, this.heartCheck.timeout)
                    }
                }, this.heartCheck.timeout)
            },
        }


        this.connect()
    }

    connect() {
        this.del()
        this.ws = new WebSocket(this.url + `?token=${default_store.wifi_info.username}:${default_store.wifi_info.password}`)
        this.ws.binaryType = "arraybuffer"

        this.ws.onopen = () => {
            console.log("WebSocket 连接成功")
            default_store.wifi_info.isOnline = true
            this.heartCheck.start()
            this.get_config()
        }

        this.ws.onmessage = (event) => {
            default_store.wifi_info.isOnline = true
            this.heartCheck.reset()

            if (event.data instanceof ArrayBuffer) {

            } else {
                const data = JSON.parse(event.data)
                console.log("WebSocket 接收到消息:", data)

                switch (data.type) {
                case 'update':

                    switch (data.param) {
                    case 'device_info':
                        Object.assign(default_store.device_info, data.data)
                        break
                    case 'wifi_info':
                        Object.assign(default_store.wifi_info, data.data)
                        break
                    case 'wifi_list':
                        default_store.wifi_list = data.data
                        toast(t('toast.wifi_list_loaded'), 'success')
                        break
                    case 'state_info':
                        default_store.stat_data.task_list = data.data.task_list.sort((a, b) => a.xTaskNumber - b.xTaskNumber)
                        Object.assign(default_store.stat_data, data.data)
                        break
                    default:
                        break
                    }
                    break
                default:
                    break
                }
            }
        }

        this.ws.onclose = () => {
            default_store.wifi_info.isOnline = false
            console.log("WebSocket 连接关闭，尝试重连...")
            this.reconnect()
        }

        this.ws.onerror = (error) => {
            default_store.wifi_info.isOnline = false
            console.error("WebSocket 发生错误:", error)
            this.reconnect()
        }
    }

    reconnect() {
        setTimeout(() => {
            console.log("正在重连...")
            this.connect()
        }, 1000) // 1秒后重连
    }

    sendMessage(message) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(message)
            console.log("WebSocket 发送消息:", JSON.parse(message))
        } else {
            console.error("WebSocket 连接未打开，消息发送失败")
        }
    }

    close() {
        if (this.ws) {
            this.ws.close()
        }
    }

    del() {
        console.log("WebSocketManager 正在清理资源...")

        if (this.ws) {
            this.ws.onopen = null
            this.ws.onmessage = null
            this.ws.onclose = null
            this.ws.onerror = null
            this.ws.close() // 关闭 WebSocket
        }

        clearTimeout(this.heartCheck.timeoutObj)
        clearTimeout(this.heartCheck.serverTimeoutObj)
        this.ws = null

        console.log("WebSocketManager 资源清理完毕")
    }

    commit_config() {

    }

    get_config() {

    }

    reset_config() {

    }

    connect_wifi() {
        this.sendMessage(
            new QuestBody(
                'connect_wifi',
                {
                    ssid: default_store.wifi_info.input_ssid,
                    password: default_store.wifi_info.input_password
                }
            ).toText())
    }

    get_device_info() {
        this.sendMessage(new QuestBody('get_device_info').toText())
    }

    get_wifi_info() {
        this.sendMessage(new QuestBody('get_wifi_info').toText())
    }

    get_wifi_list() {
        this.sendMessage(new QuestBody('get_wifi_list').toText())
    }

    get_state_info() {
        this.sendMessage(new QuestBody('get_state_info').toText())
    }

}

export let wsmgr = new WebSocketManager()

const WsPlugin = {
    install(app) {
        app.config.globalProperties.$wsmgr = wsmgr
    }
}

export default WsPlugin

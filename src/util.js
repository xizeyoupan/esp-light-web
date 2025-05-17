import { storeToRefs } from 'pinia'
import { useDefaultStore } from './store/defaultStore.js'
import { reactive, ref, toRef, toRefs, toRaw } from 'vue'
import { api } from './api.js'
import pinia from './store/index.js'
import { toast } from './plugins/toast.js'
import { i18n } from './i18n.js'
import { wsmgr } from './plugins/ws.js'

const t = i18n.global.t
const default_store = useDefaultStore(pinia)

const get_host = async (url) => {
    let resp = await api.get(url, { timeout: 2000 })
    let resp_host = resp.url.slice(0, -7)
    resp = await resp.text()

    if (resp === '0721esp32') {
        default_store.wifi_info.host = resp_host
    } else {
        throw new Error(`${resp_host} is Not wand`)
    }
}

export const connect_device = async () => {
    let fetch_pool = []
    if (default_store.wifi_info.enable_custom_address) {
        fetch_pool.push(get_host(`http://${default_store.wifi_info.custom_address}/whoami`))
    } else {
        fetch_pool.push(get_host("http://esp-light/whoami"))
        fetch_pool.push(get_host("http://192.168.4.1/whoami"))
    }
    try {
        await Promise.any(fetch_pool)
        if(wsmgr.url) wsmgr.del()
        wsmgr.init(`ws://${default_store.wifi_info.host.slice(7)}/esp-ws`)
    } catch (error) {
        console.warn(error)
    } finally {
        // if (default_store.wifi_info.isOnline) {
        //     toast(t("toast.connect_success"), "success")
        // } else {
        //     toast(t("toast.connect_failed"), "error")
        // }
    }
}

export const check_not_online = () => {
    if (!default_store.wifi_info.isOnline) {
        // toast(t("toast.device_offline"), "error")
        console.error(t("toast.device_offline"))
        return true
    }
    return false
}

export const sleep_ms = async (ms) => {
    await new Promise(resolve => setTimeout(resolve, ms))
}

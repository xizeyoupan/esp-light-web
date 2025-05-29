<template>
  <div class="max-w-4xl mx-auto px-4 space-y-8">
    <h2 class="text-2xl font-bold">
      {{ t('config.title') }}
    </h2>

    <div class="flex space-x-2">
      <ConfirmDialog ref="confirmRef" />
      <button
        class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
        @click="async () => {
          const ok = await confirmRef.show(t('confirm_dialog.save_confirm'))
          if (ok) {
            wsmgr.save_user_config()
          }
        }"
      >
        {{ t('config.save') }}
      </button>
      <button
        class="px-3 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded"
        @click="import_user_config"
      >
        {{ t('config.import') }}
      </button>
      <button
        class="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded"
        @click="export_user_config"
      >
        {{ t('config.export') }}
      </button>
      <button
        class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded"
        @click="async () => {
          const ok = await confirmRef.show(t('confirm_dialog.reset_confirm'))
          if (ok) {
            wsmgr.reset_user_config()
          }
        }"
      >
        {{ t('config.reset') }}
      </button>
      <button
        class="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded"
        @click="async () => {
          const ok = await confirmRef.show(t('confirm_dialog.reboot_confirm'))
          if (ok) {
            wsmgr.quest_reboot()
          }
        }"
      >
        {{ t('config.reboot') }}
      </button>
      <button
        class="px-3 py-1 bg-lime-600 hover:bg-lime-700 text-white rounded"
        @click="upload_ota"
      >
        {{ t('config.ota') }}
      </button>
      <ProgressDialog ref="progressRef" />
    </div>

    <div>
      <h3 class="text-xl font-semibold border-b pb-1">
        {{ t('config.light') }}
      </h3>
      <div class="grid gap-4 mt-2">
        <div class="grid grid-cols-[150px_1fr_auto] items-center gap-2">
          <label>{{ t('config.brightness') }}</label>
          <input
            v-model.number="default_store.user_config.brightness_input"
            type="range"
            min="0"
            max="100"
            @change="wsmgr.update_ledc()"
          >
          <span>{{ default_store.user_config.brightness_input }}</span>
        </div>

        <div
          v-if="default_store.device_info.dev_mode"
          class="grid grid-cols-[150px_1fr_auto] items-center gap-2"
        >
          <label>{{ t('config.freq') }}</label>
          <input
            v-model.number="default_store.user_config.frequency"
            type="number"
            class="border rounded px-2 py-1 w-full"
            step="1000"
            @change="wsmgr.update_ledc()"
          >
        </div>

        <div
          v-if="default_store.device_info.dev_mode"
          class="grid grid-cols-[150px_1fr_auto] items-center gap-2"
        >
          <label>{{ t('config.pwm_min') }}</label>
          <input
            v-model.number="default_store.user_config.pwm_duty_min"
            type="range"
            min="0"
            max="10"
            @change="wsmgr.update_ledc()"
          >
          <span>{{ default_store.user_config.pwm_duty_min }}</span>
        </div>

        <div
          v-if="default_store.device_info.dev_mode"
          class="grid grid-cols-[150px_1fr_auto] items-center gap-2"
        >
          <label>{{ t('config.pwm_max') }}</label>
          <input
            v-model.number="default_store.user_config.pwm_duty_max"
            type="range"
            min="20"
            max="100"
            @change="wsmgr.update_ledc()"
          >
          <span>{{ default_store.user_config.pwm_duty_max }}</span>
        </div>

        <div class="grid grid-cols-[150px_1fr_auto] items-center gap-2">
          <label>{{ t('config.boot_action') }}</label>
          <select
            v-model.number="default_store.user_config.boot_action"
            class="border rounded px-2 py-1 w-full"
            @change="wsmgr.update_ledc()"
          >
            <option value="0">
              {{ t('config.boot_keep') }}
            </option>
            <option value="1">
              {{ t('config.fixed') }}
            </option>
          </select>
        </div>

        <div
          v-if="default_store.user_config.boot_action == 1"
          class="grid grid-cols-[150px_1fr_auto] items-center gap-2"
        >
          <label>{{ t('config.boot_brightness') }}</label>
          <input
            v-model.number="default_store.user_config.boot_brightness"
            type="range"
            min="0"
            max="100"
            @change="wsmgr.update_ledc()"
          >
          <span>{{ default_store.user_config.boot_brightness }}</span>
        </div>

        <div class="grid grid-cols-[150px_1fr_auto] items-center gap-2">
          <label>{{ t('config.output') }}</label>
          <select
            v-model.number="default_store.user_config.output_func"
            class="border rounded px-2 py-1 w-full"
            @change="wsmgr.update_ledc()"
          >
            <option value="0">
              {{ t('config.linear') }}
            </option>
            <option value="1">
              {{ t('config.gamma') }}
            </option>
          </select>
        </div>

        <div
          v-if="default_store.user_config.output_func == 1"
          class="grid grid-cols-[150px_1fr_auto] items-center gap-2"
        >
          <label>{{ t('config.gamma_value') }}</label>
          <input
            v-model.number="default_store.user_config.gamma_value"
            type="range"
            min="0.1"
            max="3"
            step="0.01"
            @change="wsmgr.update_ledc()"
          >
          <span>{{ default_store.user_config.gamma_value.toFixed(2) }}</span>
        </div>

        <div class="grid grid-cols-[150px_1fr_auto] items-center gap-2">
          <label>{{ t('config.duty_output') }}</label>
          <span>{{ default_store.user_config.duty_output }}</span>
        </div>
      </div>
    </div>

    <div>
      <h3 class="text-xl font-semibold border-b pb-1">
        {{ t('config.bafayun') }}
      </h3>
      <div class="space-y-2 mt-2">
        <div class="flex items-center justify-between">
          <label>{{ t('config.addr') }}</label>
          <input
            v-model="default_store.user_config.broker_address_uri"
            class="border rounded px-2 py-1 w-64"
          >
        </div>
        <div class="flex items-center justify-between">
          <label>{{ t('config.client_id') }}</label>
          <input
            v-model="default_store.user_config.mqtt_client_id"
            class="border rounded px-2 py-1 w-64"
            type="password"
          >
        </div>
        <div class="flex items-center justify-between">
          <label>{{ t('config.topic') }}</label>
          <input
            v-model="default_store.user_config.mqtt_topic"
            class="border rounded px-2 py-1 w-64"
          >
        </div>
      </div>
    </div>


    <div>
      <h3 class="text-xl font-semibold border-b pb-1">
        {{ t('config.ha') }}
      </h3>
      <div class="space-y-2 mt-2">
        <div class="flex items-center justify-between">
          <label>{{ t('config.addr') }}</label>
          <input
            v-model="default_store.user_config.ha_broker_address"
            class="border rounded px-2 py-1 w-64"
          >
        </div>
        <div class="flex items-center justify-between">
          <label>{{ t('config.username') }}</label>
          <input
            v-model="default_store.user_config.ha_broker_username"
            class="border rounded px-2 py-1 w-64"
          >
        </div>
        <div class="flex items-center justify-between">
          <label>{{ t('config.password') }}</label>
          <input
            v-model="default_store.user_config.ha_broker_password"
            class="border rounded px-2 py-1 w-64"
          >
        </div>
        <div class="flex items-center justify-between">
          <label>{{ t('config.ha_entity_name') }}</label>
          <input
            v-model="default_store.user_config.ha_entity_name"
            class="border rounded px-2 py-1 w-64"
          >
        </div>
        <div class="flex items-center justify-between">
          <label>{{ t('config.ha_unique_id') }}</label>
          <input
            v-model="default_store.user_config.ha_unique_id"
            class="border rounded px-2 py-1 w-64"
          >
        </div>
        <div class="flex items-center justify-between">
          <label>{{ t('config.ha_discovery_prefix') }}</label>
          <input
            v-model="default_store.user_config.ha_discovery_prefix"
            class="border rounded px-2 py-1 w-64"
          >
        </div>

        <div class="flex items-center justify-around">
          <button
            class="px-3 py-1 bg-blue-400 hover:bg-blue-500 text-white rounded"
            @click="wsmgr.register_ha_entity()"
          >
            {{ t('config.register') }}
          </button>
          <button
            class="px-3 py-1 bg-blue-400 hover:bg-blue-500 text-white rounded"
            @click="wsmgr.remove_ha_entity()"
          >
            {{ t('config.remove') }}
          </button>
        </div>
      </div>
    </div>

    <div>
      <h3 class="text-xl font-semibold border-b pb-1">
        {{ t('config.other') }}
      </h3>
      <div class="space-y-2 mt-2">
        <div
          v-if="default_store.device_info.dev_mode"
          class="flex items-center justify-between"
        >
          <label>{{ t(`config.pwm_gpio_num`) }}</label>
          <input
            v-model="default_store.user_config.pwm_gpio_num"
            class="border rounded px-2 py-1 w-64"
          >
        </div>

        <div
          v-if="default_store.device_info.dev_mode"
          class="flex items-center justify-between"
        >
          <label>{{ t(`config.key_gpio_num`) }}</label>
          <input
            v-model="default_store.user_config.key_gpio_num"
            class="border rounded px-2 py-1 w-64"
          >
        </div>

        <div class="flex items-center justify-between">
          <label>{{ t(`config.button_period_ms`) }}</label>
          <input
            v-model.number="default_store.user_config.button_period_ms"
            class="border rounded px-2 py-1 w-64"
            min="500"
            max="10000"
            type="number"
            step="100"
          >
        </div>

        <div
          v-if="default_store.device_info.dev_mode"
          class="flex items-center justify-between"
        >
          <label>{{ t(`config.ws_user`) }}</label>
          <input
            v-model="default_store.user_config.username"
            class="border rounded px-2 py-1 w-64"
          >
        </div>

        <div
          v-if="default_store.device_info.dev_mode"
          class="flex items-center justify-between"
        >
          <label>{{ t(`config.ws_pass`) }}</label>
          <input
            v-model="default_store.user_config.password"
            type="password"
            class="border rounded px-2 py-1 w-64"
          >
        </div>

        <div
          v-if="default_store.device_info.dev_mode"
          class="flex items-center justify-between"
        >
          <label>{{ t(`config.mdns`) }}</label>
          <input
            v-model="default_store.user_config.mdns_host_name"
            class="border rounded px-2 py-1 w-64"
          >
        </div>

        <div
          v-if="default_store.device_info.dev_mode"
          class="flex items-center justify-between"
        >
          <label>{{ t(`config.wifi_ap_name`) }}</label>
          <input
            v-model="default_store.user_config.wifi_ap_ssid"
            class="border rounded px-2 py-1 w-64"
          >
        </div>

        <div
          v-if="default_store.device_info.dev_mode"
          class="flex items-center justify-between"
        >
          <label>{{ t(`config.wifi_ap_pass`) }}</label>
          <input
            v-model="default_store.user_config.wifi_ap_pass"
            type="password"
            class="border rounded px-2 py-1 w-64"
          >
        </div>

        <div class="flex items-center justify-between">
          <label>{{ t(`config.wifi_sta_name`) }}</label>
          <input
            v-model="default_store.user_config.wifi_ssid"
            class="border rounded px-2 py-1 w-64"
          >
        </div>

        <div class="flex items-center justify-between">
          <label>{{ t(`config.wifi_sta_pass`) }}</label>
          <input
            v-model="default_store.user_config.wifi_pass"
            type="password"
            class="border rounded px-2 py-1 w-64"
          >
        </div>

        <div class="flex items-center justify-between">
          <label>{{ t(`config.wifi_scan_max_size`) }}</label>
          <input
            v-model="default_store.user_config.wifi_scan_list_size"
            type="number"
            class="border rounded px-2 py-1 w-64"
          >
        </div>

        <div class="flex items-center justify-between">
          <label>{{ t(`config.wifi_retries`) }}</label>
          <input
            v-model="default_store.user_config.wifi_connect_max_retry"
            type="number"
            class="border rounded px-2 py-1 w-64"
          >
        </div>

        <div
          v-if="default_store.device_info.dev_mode"
          class="flex items-center justify-between"
        >
          <label>{{ t(`config.ws_recv_max`) }}</label>
          <input
            v-model="default_store.user_config.ws_recv_buf_size"
            type="number"
            class="border rounded px-2 py-1 w-64"
          >
        </div>

        <div
          v-if="default_store.device_info.dev_mode"
          class="flex items-center justify-between"
        >
          <label>{{ t(`config.ws_send_max`) }}</label>
          <input
            v-model="default_store.user_config.ws_send_buf_size"
            type="number"
            class="border rounded px-2 py-1 w-64"
          >
        </div>

        <div
          v-if="default_store.device_info.dev_mode"
          class="flex items-center justify-between"
        >
          <label>{{ t(`config.ws_recv_queue`) }}</label>
          <input
            v-model="default_store.user_config.msg_buf_recv_size"
            type="number"
            class="border rounded px-2 py-1 w-64"
          >
        </div>

        <div
          v-if="default_store.device_info.dev_mode"
          class="flex items-center justify-between"
        >
          <label>{{ t(`config.ws_send_queue`) }}</label>
          <input
            v-model="default_store.user_config.msg_buf_send_size"
            type="number"
            class="border rounded px-2 py-1 w-64"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { i18n } from '../i18n.js'
import { api } from '../api.js'
import { wsmgr } from '../plugins/ws.js'
import { useDefaultStore } from '../store/defaultStore.js'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import ProgressDialog from '../components/ProgressDialog.vue'
import { check_not_online } from '../util.js'
import { toast } from '../plugins/toast.js'
const t = i18n.global.t

const default_store = useDefaultStore()
const confirmRef = ref()
const progressRef = ref()

const export_user_config = () => {
    const data = {
        time_stamp: new Date().toISOString(),
        user_config: default_store.user_config,
        version: "0.1"
    }
    const config = JSON.stringify(data, null, 2)
    const blob = new Blob([config], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'esp_light_config.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
}

const import_user_config = async (file) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json' // 只允许 JSON 文件
    input.style.display = 'none' // 隐藏 input

    input.addEventListener('change', function (event) {
        const file = event.target.files[0]
        if (!file) return

        const reader = new FileReader()

        reader.onload = function (e) {
            try {
                const jsonData = JSON.parse(e.target.result) // 解析 JSON
                console.log('JSON 数据:', jsonData)

                if (jsonData.version === "0.1") {
                    Object.assign(default_store.user_config, jsonData.user_config)
                }
            } catch (error) {
                console.error('JSON 解析失败:', error)
            }
        }

        reader.readAsText(file)
    })

    input.click()
}

const upload_ota = async () => {
    if (check_not_online()) return
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.bin'
    input.style.display = 'none'

    input.addEventListener('change', async function (event) {
        const file = event.target.files[0]
        if (!file) return

        const reader = new FileReader()

        reader.onload = async function (e) {
            const binaryData = e.target.result
            const xhr = new XMLHttpRequest()
            const url = `${default_store.wifi_info.host}/upload?token=${default_store.user_config.username}:${default_store.user_config.password}`
            xhr.open("POST", url)
            xhr.timeout = 60000
            xhr.onload = function () {
                if (xhr.status === 200) {
                    console.log('OTA 上传成功:', xhr.responseText)
                    toast(t('config.ota_success'), 'success')
                } else {
                    toast(t('config.ota_error'), 'error')
                    console.error('OTA 上传失败:', xhr.status, xhr.statusText)
                }

                setTimeout(() => progressRef.value.hide(), 500)
            }

            xhr.onerror = function () {
                toast(t('config.ota_error'), 'error')
                setTimeout(() => progressRef.value.hide(), 500)
            }

            xhr.ontimeout = function () {
                console.error('请求超时')
                setTimeout(() => progressRef.value.hide(), 500)
            }

            xhr.upload.onprogress = function (event) {
                if (event.lengthComputable) {
                    const percentComplete = (event.loaded / event.total) * 100
                    onProgress(percentComplete.toFixed(2))
                }
            }
            xhr.send(binaryData)


        }

        reader.readAsArrayBuffer(file)
    })

    input.click()
}

function onProgress(i) {
    progressRef.value.show(0, 'Uploading OTA...')
    progressRef.value.update(i, `Uploading`)
}

</script>

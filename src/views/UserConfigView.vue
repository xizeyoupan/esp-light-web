<template>
  <div class="max-w-4xl mx-auto px-4 space-y-8">
    <h2 class="text-2xl font-bold">
      {{ t('config.title') }}
    </h2>

    <div class="flex space-x-2">
      <button class="px-3 py-1 bg-green-600 text-white rounded">
        {{ t('config.save') }}
      </button>
      <button class="px-3 py-1 bg-blue-600 text-white rounded">
        {{ t('config.import') }}
      </button>
      <button class="px-3 py-1 bg-yellow-600 text-white rounded">
        {{ t('config.export') }}
      </button>
      <button class="px-3 py-1 bg-red-600 text-white rounded">
        {{ t('config.reset') }}
      </button>
    </div>

    <div>
      <h3 class="text-xl font-semibold border-b pb-1">
        {{ t('config.light') }}
      </h3>
      <div class="space-y-4 mt-2">
        <div class="flex items-center justify-between">
          <label>{{ t('config.brightness') }}</label>
          <input
            v-model="brightness"
            type="range"
            min="0"
            max="100"
          >
          <span>{{ brightness }}</span>
        </div>
        <div class="flex items-center justify-between">
          <label>{{ t('config.freq') }}</label>
          <input
            v-model="freq"
            type="number"
            class="border rounded px-2 py-1 w-32"
          >
        </div>
        <div class="flex items-center justify-between">
          <label>{{ t('config.pwm_min') }}</label>
          <input
            v-model="pwm_min"
            type="range"
            min="0"
            max="10"
          >
          <span>{{ pwm_min }}</span>
        </div>
        <div class="flex items-center justify-between">
          <label>{{ t('config.pwm_max') }}</label>
          <input
            v-model="pwm_max"
            type="range"
            min="15"
            max="100"
          >
          <span>{{ pwm_max }}</span>
        </div>
        <div class="flex items-center justify-between">
          <label>{{ t('config.boot_action') }}</label>
          <select
            v-model="boot_action"
            class="border rounded px-2 py-1"
          >
            <option value="off">
              {{ t('config.boot_off') }}
            </option>
            <option value="on">
              {{ t('config.boot_on') }}
            </option>
            <option value="keep">
              {{ t('config.boot_keep') }}
            </option>
          </select>
          <template v-if="boot_action === 'on'">
            <input
              v-model="boot_brightness"
              type="range"
              min="0"
              max="100"
            >
            <span>{{ boot_brightness }}</span>
          </template>
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
            v-model="bafa_addr"
            class="border rounded px-2 py-1 w-64"
          >
        </div>
        <div class="flex items-center justify-between">
          <label>{{ t('config.account') }}</label>
          <input
            v-model="bafa_account"
            class="border rounded px-2 py-1 w-64"
          >
        </div>
        <div class="flex items-center justify-between">
          <label>{{ t('config.password') }}</label>
          <input
            v-model="bafa_password"
            class="border rounded px-2 py-1 w-64"
          >
        </div>
      </div>
    </div>

    <div>
      <h3 class="text-xl font-semibold border-b pb-1">
        {{ t('config.other') }}
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
        <div
          v-for="item in otherItems"
          :key="item.key"
          class="flex items-center justify-between"
        >
          <label>{{ t(`config.${item.key}`) }}</label>
          <input
            v-model="item.value.value"
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

const t = i18n.global.t

const brightness = ref(50)
const freq = ref(1000)
const pwm_min = ref(1)
const pwm_max = ref(100)
const boot_action = ref('off')
const boot_brightness = ref(30)

const bafa_addr = ref('')
const bafa_account = ref('')
const bafa_password = ref('')

const otherItems = [
    { key: 'ws_user', value: ref('') },
    { key: 'ws_pass', value: ref('') },
    { key: 'mdns', value: ref('') },
    { key: 'wifi_ap_name', value: ref('') },
    { key: 'wifi_ap_pass', value: ref('') },
    { key: 'wifi_sta_name', value: ref('') },
    { key: 'wifi_sta_pass', value: ref('') },
    { key: 'wifi_scan', value: ref('') },
    { key: 'wifi_retries', value: ref('') },
    { key: 'ws_recv_max', value: ref('') },
    { key: 'ws_send_max', value: ref('') },
    { key: 'ws_recv_queue', value: ref('') },
    { key: 'ws_send_queue', value: ref('') },
]
</script>

import { defineStore } from 'pinia'
import { ref, computed, reactive } from 'vue'


const chipVersions = [
    "ESP32-C3",
    "ESP32D0WDQ5",
    "ESP32D2WDQ5",
    "ESP32PICOD2", // Deprecated
    "ESP32U4WDH",
    "ESP32PICOD4",
    "ESP32PICOV302",
    "ESP32D0WDR2V3"
]

export const useDefaultStore = defineStore('default', () => {

    const wifi_info = reactive({
        isOnline: false,
        host: "",
        enable_custom_address: false,
        custom_address: "",
        wifi_mode: 0,
        SSID: "",
        RSSI: 0,
        channel: 0,
        ip: "",
        gw: "",
        netmask: "",
        input_password: "",
        input_ssid: "",
    })

    const wifi_list = ref([])

    const device_info = reactive({
        dev_mode: false,
        compile_time: "",
        firmware_version: "",
        idf_version: "",
        git_commit_id: "",
        package_version: "",
        chip_version: "",
        cpu_freq: 0,
    })

    const stat_data = reactive({
        task_count: 0,
        task_list: [],
        total_free_bytes: 0,
        total_allocated_bytes: 0,
        largest_free_block: 0,
        minimum_free_bytes: 0,
    })

    const computed_data = reactive({
        package_version_str: computed(() => chipVersions[device_info.package_version]),
        chip_version_str: computed(() => `v${parseInt(device_info.chip_version / 100)}.${device_info.chip_version % 10}`),
        firmware_tree: computed(() => `https://github.com/xizeyoupan/esp-light/tree/${device_info.git_commit_id}`),
        cpu_freq_str: computed(() => `${device_info.cpu_freq / 1000000}Mhz`),
        used_men_percent: computed(() => {
            return (stat_data.total_allocated_bytes / (stat_data.total_allocated_bytes + stat_data.total_free_bytes) * 100).toFixed(2)
        }),
        free_men_percent: computed(() => {
            return (stat_data.total_free_bytes / (stat_data.total_allocated_bytes + stat_data.total_free_bytes) * 100).toFixed(2)
        }),
    })

    const sort_task_list = () => {
        let task_list_order_column = stat_data.task_list_order_column
        stat_data.task_list.sort((a, b) => {
            if (task_list_order_column === "task_number") {
                return stat_data.task_list_order ? a.task_number - b.task_number : b.task_number - a.task_number
            } else if (task_list_order_column === "task_name") {
                return stat_data.task_list_order ? a.task_name.localeCompare(b.task_name) : b.task_name.localeCompare(a.task_name)
            } else if (task_list_order_column === "task_state") {
                return stat_data.task_list_order ? a.task_state - b.task_state : b.task_state - a.task_state
            } else if (task_list_order_column === "stack_water_mark") {
                return stat_data.task_list_order ? a.stack_water_mark - b.stack_water_mark : b.stack_water_mark - a.stack_water_mark
            } else {
                return 0
            }
        })
    }

    const user_config = reactive({
        key_gpio_num: 0,
        pwm_gpio_num: 0,

        brightness_input: 0, // 0-100
        frequency: 0,
        pwm_duty_min: 0,
        pwm_duty_max: 0,
        boot_action: 0, // 0: keep, 1: fixed,
        boot_brightness: 0,
        output_func: 0, // 0: linear, 1: gamma
        gamma_value: 0,
        duty_output: 0,

        username: "",
        password: "",
        mdns_host_name: "",
        wifi_ap_ssid: "",
        wifi_ap_pass: "",
        wifi_ssid: "",
        wifi_pass: "",
        wifi_scan_list_size: 0,
        wifi_connect_max_retry: 0,
        ws_recv_buf_size: 0,
        ws_send_buf_size: 0,
        msg_buf_recv_size: 0,
        msg_buf_send_size: 0,
        broker_address_uri: "",
        mqtt_client_id: "",
        mqtt_topic: "",
    })

    return {
        wifi_list, wifi_info, device_info, computed_data, stat_data, sort_task_list, user_config,
    }
})

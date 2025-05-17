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

    const wsmgr = reactive({})

    const wifi_info = reactive({
        isOnline: false,
        host: "",
        use_user_host: "",
        enable_custom_address: false,
        custom_address: "",
        user_host: "",
        sta_ssid: "",
        sta_pass: "",
        username: "murasame",
        password: "0d00",
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
        firmware_tree: computed(() => `https://github.com/xizeyoupan/magic-wand/tree/${device_info.git_commit_id}`),
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
        ws2812_gpio_num: { data: -1, display: true, type: 'number' },
        mpu_sda_gpio_num: { data: -1, display: true, type: 'number' },
        mpu_scl_gpio_num: { data: -1, display: true, type: 'number' },
        enable_imu_det: { data: 0, display: false, type: 'number' },
        enable_ws_log: { data: 0, display: true, type: 'number' },
    })


    return {
        wifi_list, wifi_info, device_info, computed_data, wsmgr, stat_data, sort_task_list, user_config,
    }
})

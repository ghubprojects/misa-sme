<script setup>
import { ref } from 'vue';

defineProps({
    open: {
        type: Boolean,
        required: true
    },
    menusData: {
        type: Object,
        required: true
    },
    class: String
});

const emit = defineEmits(['selectOption']);

const menuRef = ref(null);
const activeMenus = ref({});

// Kiểm tra xem menu có được mở không
const menuIsOpen = (menuKey) => activeMenus.value[menuKey];

// Khi hover vào menu, hiện danh sách option và ngược lại
const toggleMenu = (menuKey) => (activeMenus.value[menuKey] = !activeMenus.value[menuKey]);

/**
 * Xử lý lựa chọn option và emit dữ liệu option đã chọn
 * @param {string} menuKey
 * @param {string} optionKey
 * Created by: ttanh (05/10/2023)
 */
const selectOption = (menuKey, optionKey) => {
    console.log(`Selected ${menuKey} -> ${optionKey}`);
    activeMenus.value[menuKey] = false;
    emit('selectOption', { menuKey, optionKey });
};
</script>

<template>
    <ul v-if="open" class="menu" ref="menuRef">
        <li
            v-for="(menu, menuKey) in menusData"
            :key="menuKey"
            class="menu-item"
            @mouseenter="toggleMenu(menuKey)"
            @mouseleave="toggleMenu(menuKey)"
        >
            <component :is="menu.icon" class="menu-icon" />
            {{ menu.title }}
            <ul
                v-if="menuIsOpen(menuKey)"
                class="menu-options"
                :style="{ left: menuRef.clientWidth + 'px' }"
            >
                <li
                    v-for="(option, optionKey) in menu.options"
                    :key="optionKey"
                    class="option-item"
                    @click="selectOption(menuKey, optionKey)"
                >
                    <component :is="option.icon" class="option-icon" />
                    {{ option.title }}
                </li>
            </ul>
        </li>
    </ul>
</template>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';

.menu,
.menu-options {
    @include font(13);
    max-height: 200px;
    z-index: 100;
    top: 30px;

    display: flex;
    flex-direction: column;
    border-radius: 4px;

    background-color: rgb(var(--c-white));
    border: 1px solid rgb(var(--c-gray-300));

    .menu-item,
    .option-item {
        height: 40px;
        display: flex;
        align-items: center;
        padding: 10px 16px 10px 14px;
        text-wrap: nowrap;

        &:hover {
            background-color: rgb(var(--c-light-green-100));
        }
        &.selected {
            background-color: rgb(var(--c-light-green-100));
        }

        .menu-icon {
            @include size(20px);
            margin-right: 10px;
        }

        .option-icon {
            width: 25px;
            transform: scale(calc(20 / 25));
            margin-right: 6px;
        }
    }

    .menu-item {
        min-width: 160px;
    }

    .option-item {
        min-width: 120px;
    }
}

.menu {
    @include centerAbsolute('left');
    padding: 8px 0;
}

.menu-options {
    position: absolute;
    top: 0;
    padding: 0;
}
</style>

import '@/styles/global.scss';

import {
    VButton,
    VCheckbox,
    VCombobox,
    VContextMenu,
    VDateField,
    VDialog,
    VDropdownlist,
    VIcon,
    VLoading,
    VRadioButton,
    VRadioField,
    VTable,
    VTablePagination,
    VTableTree,
    VTextField,
    VTextarea,
    VToastMessage
} from './components';

import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.component('VButton', VButton)
    .component('VCheckbox', VCheckbox)
    .component('VCombobox', VCombobox)
    .component('VContextMenu', VContextMenu)
    .component('VDateField', VDateField)
    .component('VDialog', VDialog)
    .component('VDropdownlist', VDropdownlist)
    .component('VIcon', VIcon)
    .component('VLoading', VLoading)
    .component('VRadioButton', VRadioButton)
    .component('VRadioField', VRadioField)
    .component('VTable', VTable)
    .component('VTableTree', VTableTree)
    .component('VTablePagination', VTablePagination)
    .component('VTextarea', VTextarea)
    .component('VTextField', VTextField)
    .component('VToastMessage', VToastMessage);

app.use(router);
app.use(createPinia());

app.mount('#app');

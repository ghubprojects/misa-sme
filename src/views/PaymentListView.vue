<script setup>
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';
import VueResizable from 'vue-resizable';

import { PaymentForm } from '@/features';
import { TheTabNavigation } from '@/layouts';
import { TableResources } from '@/resources';
import { cashRoutes } from '@/router/constants';
import { useLanguageStore, usePaymentFormStore, usePaymentStore } from '@/stores';
import { FormMode, TableRole, TableRowOption } from '@/utils/enum';
import { PaymentDetailListColumns, PaymentFields, PaymentListColumns } from '@/utils/fields';

const paymentFormStore = usePaymentFormStore();
const paymentStore = usePaymentStore();

const LanguageStore = useLanguageStore();
const { current: lang } = storeToRefs(LanguageStore);

/**
 * === QUẢN LÝ PAYMENT DETAIL ===
 */

/**
 * === XỬ LÝ ĐỘ RỘNG BẢNG MASTER VÀ DETAIL ===
 */
const contentRef = ref(null);
const contentHeight = computed(() => contentRef.value.clientHeight - 12 * 2 - 16);
const tableInitMasterHeight = computed(() =>
    contentRef.value ? (contentHeight.value * 3) / 5 : 0
);
const tableInitDetailHeight = computed(() =>
    contentRef.value ? (contentHeight.value * 2) / 5 : 0
);

const masterHeight = ref(0);
const detailHeight = ref(0);

const isCollapsedDetail = ref(false);
const resetTableHeight = () => {
    isCollapsedDetail.value = false;
    masterHeight.value = tableInitMasterHeight.value;
    detailHeight.value = tableInitDetailHeight.value;
};

const toggleCollapseDetailTable = () => {
    if (isCollapsedDetail.value) {
        resetTableHeight();
    } else {
        isCollapsedDetail.value = true;
        detailHeight.value = 0;
        masterHeight.value = contentHeight.value - detailHeight.value;
    }
};

watch(contentRef, resetTableHeight);

const isMasterHigher = ref(true);

const onDetailResize = ({ height }) => {
    isMasterHigher.value = false;
    detailHeight.value = height;
    masterHeight.value = contentHeight.value - height;
    if (detailHeight.value < 10) isCollapsedDetail.value = true;
};
</script>

<template>
    <div class="content" ref="contentRef">
        <VueResizable
            :active="[]"
            :height="masterHeight"
            :class="['resizable-component', { 'higher-elevation': isMasterHigher }]"
        >
            <div
                v-if="masterHeight > 0"
                class="master-table-section"
                :style="{ height: masterHeight + 'px' }"
            >
                <TheTabNavigation :routes="cashRoutes" />
                <VTable
                    :role="TableRole.Master"
                    :columns-info="PaymentListColumns"
                    :id-field="PaymentFields.payment_id.field"
                    :primary-field="PaymentFields.payment_number.field"
                    :searchbar-placeholder="TableResources[lang].SearchPayment"
                    export-url="https://localhost:7089/api/Payments/Export"
                    :accumulateColumn="PaymentFields.total_amount.field"
                    :paging="true"
                    :data-store="paymentStore"
                    :form-store="paymentFormStore"
                    :options="[
                        TableRowOption.View,
                        TableRowOption.Update,
                        TableRowOption.Delete,
                        TableRowOption.Duplicate
                    ]"
                    :classes="['master-table']"
                    @click="isMasterHigher = true"
                >
                    <template #form>
                        <PaymentForm v-if="paymentFormStore.mode != FormMode.Hide" />
                    </template>
                </VTable>
            </div>
        </VueResizable>

        <VueResizable
            :active="['t']"
            :height="detailHeight"
            class="resizable-component"
            @resize:move="onDetailResize"
        >
            <div class="divider-section">
                <div class="collapse-btn" @click="toggleCollapseDetailTable">
                    <div class="icon-collapse">
                        <VIcon :class="['collapse-img', { collapsed: isCollapsedDetail }]" />
                    </div>
                </div>
            </div>

            <div class="detail-table-section" :style="{ height: detailHeight + 'px' }">
                <TheTabNavigation item="Chi tiết" />
                <VTable
                    :role="TableRole.Detail"
                    :columns-info="PaymentDetailListColumns"
                    :id-field="PaymentFields.payment_id.field"
                    :paging="true"
                    :data-store="paymentStore"
                    :classes="['detail-table']"
                />
            </div>
        </VueResizable>
    </div>
</template>

<style lang="scss" scoped>
@import '@/styles/global.scss';
@import '@/styles/mixins.scss';

$--process-content-padding: 12px 24px;

.content {
    max-height: calc(100% - 56px);
    height: calc(100vh - 56px);
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: $--process-content-padding;
    background-color: rgb(var(--c-gray-100));
}

.master-table-section,
.detail-table-section {
    height: 100%;

    .master-table,
    .detail-table {
        max-height: calc(100% - 30px);
    }
}

.higher-elevation {
    z-index: 1;
}

.detail-table-section {
    padding-top: 10px;
}

.collapse-btn {
    position: absolute;
    left: calc(50% - 30px);

    display: grid;
    place-items: center;

    width: 48px;
    height: 12px;
    border-radius: 4px;

    background: #d4d7dc;
    border: 1px solid #d4d7dc;
    cursor: pointer;
    z-index: 101;
}

.icon-collapse {
    @include size(8px);
    .collapse-img {
        width: 8px;
        height: 5px;
        background-position: -564px -365px;
        &.collapsed {
            transform: translate(-50%, -50%) rotate(180deg);
        }
    }
}

.resizable-component {
    position: sticky !important;
    width: 100% !important;
    background-color: rgb(var(--c-gray-100));
}

.divider-section {
    position: absolute;
    top: -6px;
    width: calc(100% - 48px);
    height: 12px;
    left: 0;
    margin: 0 24px;
}
</style>

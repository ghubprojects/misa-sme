<script setup>
import { storeToRefs } from 'pinia';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { IconClose, IconHelp } from '@/assets/icons';

import {
    useDialogStore,
    useEmployeeStore,
    useErrorStore,
    useLanguageStore,
    usePaymentFormStore,
    usePaymentStore,
    useSupplierStore,
    useToastMessageStore
} from '@/stores';

import {
    ButtonResources,
    DialogResources,
    ErrorResources,
    TableResources,
    ToastMessageResources
} from '@/resources';
import { ButtonStyle, InputSize, InputWidth, TooltipDirection } from '@/styles/types';
import { ResponseToDataConverter } from '@/utils/datahandler';
import { FormMode, ToastMessageType } from '@/utils/enum';
import { PaymentFields } from '@/utils/fields';

import { DialogType, TableRole } from '@/utils/enum';
import {
    EmployeeComboboxColumns,
    PaymentDetailFields,
    PaymentDetailListColumns,
    SupplierComboboxColumns,
    SupplierFields
} from '@/utils/fields';

const paymentFormStore = usePaymentFormStore();
const paymentStore = usePaymentStore();
const supplierStore = useSupplierStore();
const employeeStore = useEmployeeStore();

const {
    payment_id,
    payment_number,
    supplier_code,
    supplier_name,
    supplier_contact_name,
    supplier_address,
    journal_memo,
    employee_name,
    document_included,
    posted_date,
    payment_date,
    total_amount
} = PaymentFields;

// global states
const ErrorStore = useErrorStore();
const DialogStore = useDialogStore();
const ToastMessageStore = useToastMessageStore();

const PaymentFormStore = usePaymentFormStore();
const PaymentStore = usePaymentStore();

const LanguageStore = useLanguageStore();
const { current: lang } = storeToRefs(LanguageStore);
const { currentData: formData, currentItem } = storeToRefs(PaymentFormStore);

const isShowValidateError = ref(false);

const route = useRoute();
onMounted(async () => {
    PaymentFormStore.mode = PaymentFormStore.mode ?? FormMode.View;

    await supplierStore.getAllAsync(null, null, null);
    await employeeStore.getAllAsync(null, null, null);

    if (!Object.keys(currentItem.value).length && route.params.id) {
        try {
            currentItem.value = await PaymentStore.getByIdAsync(route.params.id);
            formData.value = currentItem.value;
            PaymentFormStore.mode = FormMode.View;
        } catch (err) {
            console.log(err);
        }
    }
});

/**
 * Tự động sinh mã nhân viên khi thêm nhân viên mới
 * @returns mã nhân viên mới
 * Created by: ttanh (27/09/2023)
 */
const generateEmployeeCode = () => {
    const pattern = 'PC';
    const sortedListCode = Employee.listAll
        .map((emp) => emp.EmployeeCode)
        .sort(
            (code, anotherCode) => code.slice(pattern.length) - anotherCode.slice(pattern.length)
        );
    const lastCode = sortedListCode[sortedListCode.length - 1].slice(pattern.length);
    const newEmployeeCode = `${pattern}${parseInt(lastCode) + 1}`;
    return newEmployeeCode;
};

/**
 * === SỬA DỮ LIỆU NHÂN VIÊN ===
 */

const isUpdated = ref(false);

/**
 * ẩn form khi click vào close icon
 * 1. thực hiện so sánh dữ liệu trên form và dữ liệu gốc của nhân viên hiện tại
 * 2. nếu khác nhau, hiển thị Dialog xác nhận lưu thay đổi
 * 3. nếu không, ẩn form chi tiết
 * Created by: ttanh (22/08/2023)
 * Modified by: ttanh (23/08/2023)
 */
const handleHideForm = () => {
    console.log('hide form');
    console.log('data', formData.value);

    if (JSON.stringify(formData.value) !== JSON.stringify(PaymentFormStore.currentItem)) {
        isUpdated.value = true;
        DialogStore.show(
            DialogType.Error,
            DialogResources[lang.value].SaveChanges.title,
            DialogResources[lang.value].SaveChanges.message,
            ButtonResources[lang.value].Store,
            handleStoreForm,
            ButtonResources[lang.value].Cancel,
            cancelUpdateForm
        );
    } else {
        PaymentFormStore.hide();
    }
};

/**
 * Thực hiện thêm nhân viên:
 * - hiển thị validate dialog (nếu có)
 * - nếu không có thông báo lỗi khi validate, thực hiện thêm nhân viên
 *   - nếu mã nhân viên chưa tồn tại, thêm nhân viên đó, thông báo thành công và đóng form
 *   - ngược lại, hiển thị dialog thông báo mã nhân viên trùng lặp
 * - nếu gặp exception, gửi message lỗi
 * Created by: ttanh (03/08/2023)
 */
const handleAddEmployee = async () => {
    // try {
    //     showValidateDialog();
    //     if (!inputErrorList.value.size) {
    //         console.log(dataHandler.getCreateDtoFromEmployee(formData.value));
    //         const result = await Employee.addAsync(
    //             dataHandler.getCreateDtoFromEmployee(formData.value)
    //         );

    //         // check affected rows is 1
    //         if (result.Succeeded && result.Data === 1) {
    //             await Employee.getPaginationAsync(Table.recordPerPage, Table.offsetValue);
    //             ToastMessage.show(
    //                 ToastMessageType.Success,
    //                 ToastMessageResources[lang].AddEmployee.success(
    //                     formData.value.EmployeeCode
    //                 )
    //             );
    //             Employee.form.hide();
    //             Employee.checklist = [];
    //         }
    //     }
    // } catch (err) {
    //     console.log(err);
    //     ToastMessage.show(
    //         ToastMessageType.Error,
    //         ToastMessageResources[lang].AddEmployee.error
    //     );
    // }
    try {
        if (PaymentFormStore.validateErrors.length === 0) {
            console.log(formData.value);

            ToastMessageStore.show(
                ToastMessageType.Success,
                ToastMessageResources[lang.value].AddPayment.success(
                    formData.value[payment_number.field]
                )
            );
            PaymentFormStore.hide();
        }
    } catch (err) {
        console.log(err);
        ToastMessageStore.show(
            ToastMessageType.Error,
            ToastMessageResources[lang.value].AddPayment.error
        );
    }
};

/**
 * Thực hiện cập nhật nhân viên
 * - hiển thị validate dialog (nếu có)
 * - nếu không có thông báo lỗi khi validate, thực hiện cập nhật nhân viên
 *   - nếu mã nhân viên chưa tồn tại, cập nhật nhân viên đó, thông báo thành công và đóng form
 *   - ngược lại, hiển thị dialog thông báo mã nhân viên trùng lặp
 * - nếu gặp exception, gửi message lỗi
 * Created by: ttanh (03/08/2023)
 * Modified by: ttanh (26/09/2023)
 */
const handleUpdateEmployee = async () => {
    // try {
    //     formData.value.CurrentEmployeeCode = Employee.current.EmployeeCode;
    //     showValidateDialog();
    //     if (!inputErrorList.value.size) {
    //         console.log(dataHandler.getUpdateDtoFromEmployee(formData.value));
    //         const result = await Employee.updateAsync(
    //             dataHandler.getUpdateDtoFromEmployee(formData.value)
    //         );

    //         // check affected rows is 1
    //         if (result.Succeeded && result.Data === 1) {
    //             await Employee.getPaginationAsync(Table.recordPerPage, Table.offsetValue);
    //             ToastMessage.show(
    //                 ToastMessageType.Success,
    //                 ToastMessageResources[lang].UpdateEmployee.success(
    //                     Employee.current.EmployeeCode
    //                 )
    //             );
    //             isUpdated.value = false;
    //             Employee.form.hide();
    //             Employee.checklist = [];
    //         }
    //     }
    // } catch (err) {
    //     console.log(err);
    //     isUpdated.value = false;

    //     ToastMessage.show(
    //         ToastMessageType.Error,
    //         ToastMessageResources[lang].UpdateEmployee.error(
    //             Employee.current.EmployeeCode
    //         )
    //     );
    // }
    try {
        formData.value.Currentpayment_number = PaymentFormStore.currentItem[payment_number.field];
        if (PaymentFormStore.validateErrors.length === 0) {
            console.log(formData.value);

            ToastMessageStore.show(
                ToastMessageType.Success,
                ToastMessageResources[lang.value].UpdateAccount.success(
                    formData.value[payment_number.field]
                )
            );
            isUpdated.value = false;
            PaymentFormStore.hide();
        }
    } catch (err) {
        console.log(err);
        isUpdated.value = false;

        ToastMessageStore.show(
            ToastMessageType.Error,
            ToastMessageResources[lang.value].UpdateEmployee.error(
                formData.value[payment_number.field]
            )
        );
    }
};

/**
 * Thực hiện cất form:
 * - nếu Employee.formMode là Create, thêm nhân viên
 * - ngược lại, cập nhật nhân viên
 * Created by: ttanh (03/08/2023)
 */
const handleStoreForm = async () => {
    PaymentFormStore.isValidating = true;
    if (PaymentFormStore.validateErrors.length > 0) {
        console.log(PaymentFormStore.validateErrors);
        isShowValidateError.value = true;
        DialogStore.show(
            DialogResources[lang.value].Validate.title,
            PaymentFormStore.validateErrors[0].message,
            ButtonResources[lang.value].Close,
            hideValidateDialog
        );
    }

    switch (PaymentFormStore.mode) {
        case FormMode.Create:
        case FormMode.Duplicate:
            await handleAddEmployee();
            break;
        case FormMode.Update:
            await handleUpdateEmployee();
            break;
        default:
            Error.setCurrent('Không thể cất dữ liệu');
            break;
    }
};

/**
 * Force rerender cho component khi language thay đổi
 * Created by: ttanh (05/10/2023)
 */
// Tạo key cho employeeForm
const tableFormKey = ref(0);

// Force rerender bằng cách cập nhật giá trị cho tableFormKey
const forceRerender = () => {
    tableFormKey.value += 1;
};

watch(currentItem, forceRerender);

// ẩn Dialog Validate khi click vào nút Đóng của Dialog Validate
const hideValidateDialog = () => {
    DialogStore.hide();
    forceRerender();
};

// hủy cập nhật dữ liệu nhân viên và đóng form khi click vào nút hủy
const cancelUpdateForm = () => {
    formData.value = {};
    isUpdated.value = false;
    PaymentFormStore.hide();
};

const handleEditForm = () => {
    PaymentFormStore.mode = FormMode.Update;
};

/**
 * Cất và tạo mới form
 * Created by: ttanh (28/08/2023)
 * Modified by: ttanh (29/08/2023)
 */
const handleStoreAndCreateForm = async () => {
    try {
        await handleStoreForm();
        PaymentFormStore.create();
    } catch (err) {
        console.log(err);
    }
};

/**
 * === XỬ LÝ PHÍM TẮT ===
 */

/**
 * Khi ấn phím CTRL F8, thực hiện lưu và cất form
 * Khi ấn phím CTRL F9, thực hiện hủy và đóng form
 * @param {event} event
 * Created by: ttanh (02/10/2023)
 */
const handleKeyDownForm = async (event) => {
    if (event.ctrlKey && event.code === 'F8') {
        event.preventDefault();
        await handleStoreForm();
    } else if (event.shiftKey && event.code === 'F8') {
        event.preventDefault();
        await handleStoreAndCreateForm();
    } else if (event.ctrlKey && event.code === 'F9') {
        event.preventDefault();
        PaymentFormStore.hide();
    }
};
</script>

<template>
    <div
        class="form"
        @keydown.esc="handleHideForm"
        @keydown.stop="handleKeyDownForm"
        :key="tableFormKey"
    >
        <div class="form-container">
            <!-- form header -->
            <div class="form-header">
                <!-- form-header left-group -->
                <div class="left-group">
                    <div class="heading-1 heading">
                        {{ TableResources[lang].PaymentForm(formData[payment_number.field] ?? '') }}
                    </div>
                </div>

                <!-- form-header right-group -->
                <div class="right-group">
                    <IconHelp class="help-icon" />
                    <IconClose
                        class="close-icon"
                        :title="ButtonResources[lang].CloseTooltip"
                        @click="handleHideForm"
                    />
                </div>
            </div>

            <!-- form content -->
            <div class="form-content">
                <div class="payment-info">
                    <div class="left-section">
                        <div class="column-group-1">
                            <div class="row-group-1">
                                <div class="row-1">
                                    <VCombobox
                                        type="Table"
                                        :size="InputSize.Medium"
                                        :width="InputWidth.Full"
                                        :id="supplier_code.field"
                                        :label="supplier_code.label"
                                        v-model="formData[supplier_code.field]"
                                        :tableInfo="{
                                            columns: SupplierComboboxColumns,
                                            dataStore: supplierStore,
                                            idField: SupplierFields.supplier_id.field,
                                            primaryField: SupplierFields.supplier_code.field
                                        }"
                                        :disabled="PaymentFormStore.mode === FormMode.View"
                                        :focus="PaymentFormStore.getFocusState(supplier_code.field)"
                                        :show-error="isShowValidateError"
                                        :err-msgs="{
                                            empty: ErrorResources[lang].EmptySupplierCode
                                        }"
                                    />

                                    <VTextField
                                        :size="InputSize.Medium"
                                        :width="InputWidth.Full"
                                        :id="supplier_name.field"
                                        :label="supplier_name.label"
                                        v-model="formData[supplier_name.field]"
                                        :min-length="supplier_name.minLength"
                                        :max-length="supplier_name.maxLength"
                                        :disabled="PaymentFormStore.mode === FormMode.View"
                                        :focus="PaymentFormStore.getFocusState(supplier_name.field)"
                                        :show-error="isShowValidateError"
                                        :err-msgs="{
                                            empty: ErrorResources[lang].EmptySupplierName,
                                            minLength: ErrorResources[lang].MinlengthSupplierName,
                                            maxLength: ErrorResources[lang].MaxLengthSupplierName
                                        }"
                                    />
                                </div>
                                <div class="row-2">
                                    <VTextField
                                        :size="InputSize.Medium"
                                        :width="InputWidth.Full"
                                        :id="supplier_contact_name.field"
                                        :label="supplier_contact_name.label"
                                        v-model="formData[supplier_contact_name.field]"
                                        :min-length="supplier_contact_name.minLength"
                                        :max-length="supplier_contact_name.maxLength"
                                        :disabled="PaymentFormStore.mode === FormMode.View"
                                        :focus="
                                            PaymentFormStore.getFocusState(
                                                supplier_contact_name.field
                                            )
                                        "
                                        :show-error="isShowValidateError"
                                        :err-msgs="{
                                            empty: ErrorResources[lang].EmptySupplierContactName,
                                            minLength:
                                                ErrorResources[lang].MinlengthSupplierContactName,
                                            maxLength:
                                                ErrorResources[lang].MaxLengthSupplierContactName
                                        }"
                                    />

                                    <VTextField
                                        :size="InputSize.Medium"
                                        :width="InputWidth.Full"
                                        :id="supplier_address.field"
                                        :label="supplier_address.label"
                                        v-model="formData[supplier_address.field]"
                                        :min-length="supplier_address.minLength"
                                        :max-length="supplier_address.maxLength"
                                        :disabled="PaymentFormStore.mode === FormMode.View"
                                        :focus="
                                            PaymentFormStore.getFocusState(supplier_address.field)
                                        "
                                        :show-error="isShowValidateError"
                                        :err-msgs="{
                                            empty: ErrorResources[lang].EmptySupplierAddress,
                                            minLength:
                                                ErrorResources[lang].MinlengthSupplierAddress,
                                            maxLength: ErrorResources[lang].MaxLengthSupplierAddress
                                        }"
                                    />
                                </div>
                            </div>

                            <div class="row-group-2">
                                <VTextField
                                    :size="InputSize.Medium"
                                    :width="InputWidth.Full"
                                    :id="journal_memo.field"
                                    :label="journal_memo.label"
                                    v-model="formData[journal_memo.field]"
                                    :min-length="journal_memo.minLength"
                                    :max-length="journal_memo.maxLength"
                                    :disabled="PaymentFormStore.mode === FormMode.View"
                                    :focus="PaymentFormStore.getFocusState(journal_memo.field)"
                                    :show-error="isShowValidateError"
                                    :err-msgs="{
                                        empty: ErrorResources[lang].EmptyJournalMemo,
                                        minLength: ErrorResources[lang].MinlengthJournalMemo,
                                        maxLength: ErrorResources[lang].MaxLengthJournalMemo
                                    }"
                                />
                            </div>

                            <div class="row-group-3">
                                <VCombobox
                                    type="Table"
                                    :size="InputSize.Medium"
                                    :width="InputWidth.Full"
                                    :id="PaymentFields.employee_name.field"
                                    :label="PaymentFields.employee_name.label"
                                    v-model="formData[PaymentFields.employee_name.field]"
                                    :tableInfo="{
                                        columns: EmployeeComboboxColumns,
                                        dataStore: employeeStore,
                                        idField: PaymentFields.employee_id.field,
                                        primaryField: PaymentFields.employee_code.field
                                    }"
                                    :disabled="PaymentFormStore.mode === FormMode.View"
                                    :focus="
                                        PaymentFormStore.getFocusState(
                                            PaymentFields.employee_name.field
                                        )
                                    "
                                    :show-error="isShowValidateError"
                                    :err-msgs="{
                                        empty: ErrorResources[lang].EmptyEmployeeCode
                                    }"
                                />

                                <div class="document-included-field">
                                    <VTextField
                                        :size="InputSize.Medium"
                                        :width="InputWidth.Medium"
                                        :id="document_included.field"
                                        :label="document_included.label"
                                        v-model="formData[document_included.field]"
                                        :min-length="document_included.minLength"
                                        :max-length="document_included.maxLength"
                                        :disabled="PaymentFormStore.mode === FormMode.View"
                                        :focus="
                                            PaymentFormStore.getFocusState(document_included.field)
                                        "
                                        :show-error="isShowValidateError"
                                        :err-msgs="{
                                            empty: ErrorResources[lang].EmptyDocumentIncluded,
                                            minLength:
                                                ErrorResources[lang].MinlengthDocumentIncluded,
                                            maxLength:
                                                ErrorResources[lang].MaxLengthDocumentIncluded
                                        }"
                                    />
                                    <div class="suffix">{{ document_included.suffixText }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="column-group-2">
                            <VDateField
                                :size="InputSize.Medium"
                                :width="InputWidth.Medium"
                                :id="posted_date.field"
                                :label="posted_date.label"
                                v-model="formData[posted_date.field]"
                                :min-length="posted_date.minLength"
                                :max-length="posted_date.maxLength"
                                :disabled="PaymentFormStore.mode === FormMode.View"
                                :focus="PaymentFormStore.getFocusState(posted_date.field)"
                                :show-error="isShowValidateError"
                                :err-msgs="{
                                    empty: ErrorResources[lang].EmptyPostedDate,
                                    minLength: ErrorResources[lang].MinlengthPostedDate,
                                    maxLength: ErrorResources[lang].MaxLengthPostedDate
                                }"
                            />

                            <VDateField
                                :size="InputSize.Medium"
                                :width="InputWidth.Medium"
                                :id="payment_date.field"
                                :label="payment_date.label"
                                v-model="formData[payment_date.field]"
                                :min-length="payment_date.minLength"
                                :max-length="payment_date.maxLength"
                                :disabled="PaymentFormStore.mode === FormMode.View"
                                :focus="PaymentFormStore.getFocusState(payment_date.field)"
                                :show-error="isShowValidateError"
                                :err-msgs="{
                                    empty: ErrorResources[lang].EmptyPaymentDate,
                                    minLength: ErrorResources[lang].MinlengthPaymentDate,
                                    maxLength: ErrorResources[lang].MaxLengthPaymentDate
                                }"
                            />

                            <VTextField
                                :size="InputSize.Medium"
                                :width="InputWidth.Medium"
                                :id="payment_number.field"
                                :label="payment_number.label"
                                v-model="formData[payment_number.field]"
                                :min-length="payment_number.minLength"
                                :max-length="payment_number.maxLength"
                                :disabled="PaymentFormStore.mode === FormMode.View"
                                :focus="PaymentFormStore.getFocusState(payment_number.field)"
                                :show-error="isShowValidateError"
                                :err-msgs="{
                                    empty: ErrorResources[lang].EmptyPaymentNumber,
                                    minLength: ErrorResources[lang].MinlengthPaymentNumber,
                                    maxLength: ErrorResources[lang].MaxLengthPaymentNumber
                                }"
                            />
                        </div>
                    </div>

                    <div class="total-amount">
                        <div class="text">Tổng tiền</div>
                        <div class="amount">
                            {{
                                ResponseToDataConverter.convertCurrency(
                                    formData[total_amount.field]
                                )
                            }}
                        </div>
                    </div>
                </div>

                <div class="payment-details">
                    <div class="title">Hạch toán</div>

                    <VTable
                        :role="TableRole.DetailForm"
                        :columns-info="PaymentDetailListColumns"
                        :id-field="PaymentDetailFields.payment_detail_id.field"
                        :show-pagination="false"
                        :data-store="paymentStore"
                        :editable="true"
                        :can-add-row="true"
                        :can-delete-row="true"
                        :classes="['detail-table']"
                    />
                </div>
            </div>

            <div class="form-footer">
                <div class="left-group">
                    <VButton
                        :style="ButtonStyle.Outline"
                        :tooltip="ButtonResources[lang].CancelTooltip"
                        :tooltip-direction="TooltipDirection.Up"
                        class="cancel-btn"
                        @click="PaymentFormStore.hide"
                    >
                        {{ ButtonResources[lang].Cancel }}
                    </VButton>
                </div>

                <div class="right-group">
                    <VButton
                        v-if="PaymentFormStore.mode !== FormMode.View"
                        :style="ButtonStyle.Outline"
                        :tooltip="ButtonResources[lang].StoreTooltip"
                        :tooltip-direction="TooltipDirection.Up"
                        class="add-btn"
                        @click="handleStoreForm"
                    >
                        {{ ButtonResources[lang].Store }}
                    </VButton>
                    <VButton
                        v-if="PaymentFormStore.mode !== FormMode.View"
                        :style="ButtonStyle.Primary"
                        :tooltip="ButtonResources[lang].StoreAndAddTooltip"
                        :tooltip-direction="TooltipDirection.Up"
                        class="add-more-btn"
                        @click="handleStoreAndCreateForm"
                        @keydown.tab="forceRerender"
                    >
                        {{ ButtonResources[lang].StoreAndAdd }}
                    </VButton>
                    <VButton
                        v-if="PaymentFormStore.mode === FormMode.View"
                        :style="ButtonStyle.Primary"
                        :tooltip="ButtonResources[lang].EditTooltip"
                        :tooltip-direction="TooltipDirection.Up"
                        class="edit-btn"
                        @click="handleEditForm"
                        @keydown.tab="forceRerender"
                    >
                        {{ ButtonResources[lang].Edit }}
                    </VButton>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';

.form {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 50;

    display: flex;
    justify-content: center;
    align-items: center;

    width: 100%;
    height: 100%;
    background-color: rgb(var(--c-black), 0.4);
}

.form-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: rgb(var(--c-gray-200));
}

/* Styles for form-header */
.form-header {
    @include font(14);
    margin-top: 24px;
    padding: 0 24px;

    display: flex;
    justify-content: space-between;
    align-items: center;
    .left-group {
        display: flex;
        gap: 24px;
        .heading {
            margin-right: 6px;
        }
    }
    .right-group {
        display: flex;
        gap: 8px;
        .help-icon,
        .close-icon {
            @include size(24px);
            cursor: pointer;
        }
    }
}

/* Styles for form-content */
.form-content {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.payment-info {
    display: flex;
    justify-content: space-between;
    padding: 16px 24px;
}

.payment-details {
    flex: 1;
    padding: 16px 24px;
    background: rgb(var(--c-white));
    display: flex;
    flex-direction: column;
    gap: 12px;
    .title {
        @include font(13, 600);
    }
    .detail-table {
        max-height: 360px;
        min-height: 172px;
    }
}

.left-section {
    flex: 1;
    display: flex;
    height: fit-content;
    .column-group-1 {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 12px;

        height: fit-content;
        padding-right: 16px;
        .row-group-1 {
            display: flex;
            flex-direction: column;
            gap: 12px;
            .row-1 {
                display: flex;
                gap: 16px;
                & > * {
                    flex: 1;
                    width: calc(50% - 8px);
                }
            }
            .row-2 {
                display: flex;
                gap: 16px;
                & > * {
                    flex: 1;
                }
            }
        }
        .row-group-2 {
        }
        .row-group-3 {
            display: flex;
            gap: 16px;
            & > * {
                flex: 1;
            }

            .document-included-field {
                display: flex;
                align-items: flex-end;

                .suffix {
                    text-wrap: nowrap;
                    padding: 0 6px;
                }
            }
        }
    }

    .column-group-2 {
        display: flex;
        flex-direction: column;
        gap: 12px;

        height: fit-content;
        padding-left: 16px;
        border-left: 1px solid rgb(var(--c-gray-300));
    }
}

.total-amount {
    width: 200px;
    text-align: right;
    .text > {
    }
    .amount {
        @include font(32, 700);
    }
}

/* Styles for form-footer */
.form-footer {
    display: flex;
    justify-content: space-between;
    padding: 12px 24px;

    background-color: rgb(var(--c-gray-800));
    border-top: 1px solid rgb(var(--c-gray-300));
    .right-group {
        display: flex;
        gap: 8px;
    }
}
</style>

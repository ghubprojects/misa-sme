<script setup>
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

import { IconClose, IconHelp } from '@/assets/icons';

import {
    useAccountFormStore,
    useAccountStore,
    useDialogStore,
    useLanguageStore,
    useToastMessageStore
} from '@/stores';
import { DialogType, FormMode, ToastMessageType } from '@/utils/enum';
import { AccountComboboxColumns, AccountFormFields } from '@/utils/fields';

import {
    ButtonResources,
    DialogResources,
    ErrorResources,
    TableTreeFormResources,
    ToastMessageResources
} from '@/resources';
import { ButtonStyle, InputSize, InputWidth, TooltipDirection } from '@/styles/types';

// global states
const DialogStore = useDialogStore();
const ToastMessageStore = useToastMessageStore();

const AccountStore = useAccountStore();
const AccountFormStore = useAccountFormStore();

const LanguageStore = useLanguageStore();
const { current: lang } = storeToRefs(LanguageStore);
const { currentItem } = storeToRefs(AccountFormStore);

const {
    account_id,
    account_number,
    account_name,
    account_name_english,
    parent_id,
    parent_account,
    account_category,
    description,
    is_postable_in_foreign_currency,
    is_detail_by_account_object,
    is_detail_by_bank_account,
    is_detail_by_job,
    is_detail_by_project_work,
    is_detail_by_pu_contract,
    is_detail_by_order,
    is_detail_by_contract,
    is_detail_by_expense_item,
    is_detail_by_department,
    is_detail_by_list_item,
    detail_by_account_object,
    detail_by_job,
    detail_by_project_work,
    detail_by_pu_contract,
    detail_by_order,
    detail_by_contract,
    detail_by_expense_item,
    detail_by_department,
    detail_by_list_item
} = AccountFormFields;

const isShowValidateError = ref(false);

/**
 * === SỬA DỮ LIỆU NHÂN VIÊN ===
 */

const currentFormData = currentItem.value;

const handleSelectParentAccount = (selectedAccount) => {
    currentItem.value[parent_id.field] = selectedAccount[account_id.field];
    currentItem.value[parent_account.field] = selectedAccount[account_number.field];
    console.log(currentItem.value[parent_id.field], currentItem.value[parent_account.field]);
};

/**
 * ẩn form khi click vào close icon
 * 1. thực hiện so sánh dữ liệu trên form và dữ liệu gốc của nhân viên hiện tại
 * 2. nếu khác nhau, hiển thị Dialog xác nhận lưu thay đổi
 * 3. nếu không, ẩn form chi tiết
 * Created by: ttanh (22/08/2023)
 * Modified by: ttanh (23/08/2023)
 */
const handleHideForm = () => {
    if (JSON.stringify(currentFormData) !== JSON.stringify(currentItem.value)) {
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
        AccountFormStore.hide();
    }
};

/**
 * Thực hiện thêm tài khoản
 * Created by: ttanh (03/08/2023)
 */
const handleAddEmployee = async () => {
    try {
        if (AccountFormStore.validateErrors.length === 0) {
            const result = await AccountStore.addAsync(currentItem.value);

            // check success request
            if (result.IsSuccess) {
                AccountFormStore.hide();
                AccountStore.reloadData = true;

                ToastMessageStore.show(
                    ToastMessageType.Success,
                    ToastMessageResources[lang.value].AddAccount.success(
                        currentItem.value[account_number.field]
                    )
                );
            }
        }
    } catch (err) {
        AccountFormStore.bindingFormatData(currentItem.value);
        console.log(err);
        // ToastMessageStore.show(
        //     ToastMessageType.Error,
        //     ToastMessageResources[lang.value].AddAccount.error
        // );
    }
};

/**
 * Thực hiện cập nhật tài khoản
 * Created by: ttanh (03/08/2023)
 * Modified by: ttanh (26/09/2023)
 */
const handleUpdateEmployee = async () => {
    try {
        if (AccountFormStore.validateErrors.length === 0) {
            const result = await AccountStore.updateAsync(currentItem.value);

            // check success request
            if (result.IsSuccess) {
                AccountFormStore.hide();
                AccountStore.reloadData = true;

                ToastMessageStore.show(
                    ToastMessageType.Success,
                    ToastMessageResources[lang.value].UpdateAccount.success(
                        currentItem.value[account_number.field]
                    )
                );
            }
        }
    } catch (err) {
        AccountFormStore.bindingFormatData(currentItem.value);
        console.log(err);
        // ToastMessageStore.show(
        //     ToastMessageType.Error,
        //     ToastMessageResources[lang.value].UpdateAccount.error(
        //         currentItem.value[account_number.field]
        //     )
        // );
    }
};

/**
 * Thực hiện cất form
 * Created by: ttanh (03/08/2023)
 */
const handleStoreForm = async () => {
    AccountFormStore.isValidating = true;

    if (AccountFormStore.validateErrors.length > 0) {
        console.log(AccountFormStore.validateErrors);
        isShowValidateError.value = true;
        DialogStore.show(
            DialogType.Error,
            DialogResources[lang.value].Validate.title,
            AccountFormStore.validateErrors[0].message,
            ButtonResources[lang.value].Close,
            hideValidateDialog
        );
        // AccountFormStore.bindingFormatData(currentItem.value);
    } else {
        AccountFormStore.bindingConvertData(currentItem.value);
        switch (AccountFormStore.mode) {
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
    }
};

/**
 * Force rerender cho component khi language thay đổi
 * Created by: ttanh (05/10/2023)
 */
// Tạo key cho employeeForm
const tableTreeFormKey = ref(0);

// Force rerender bằng cách cập nhật giá trị cho tableTreeFormKey
const forceRerender = () => {
    tableTreeFormKey.value += 1;
};

// ẩn Dialog Validate khi click vào nút Đóng của Dialog Validate
const hideValidateDialog = () => {
    DialogStore.hide();
    forceRerender();
};

// hủy cập nhật dữ liệu nhân viên và đóng form khi click vào nút hủy
const cancelUpdateForm = () => {
    AccountFormStore.hide();
};

/**
 * Cất và tạo mới form
 * Created by: ttanh (28/08/2023)
 * Modified by: ttanh (29/08/2023)
 */
const handleStoreAndCreateForm = async () => {
    try {
        await handleStoreForm();
        AccountFormStore.create();
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
// const handleKeyDownForm = async (event) => {
//     if (event.ctrlKey && event.code === 'F8') {
//         event.preventDefault();
//         await handleStoreForm();
//     } else if (event.shiftKey && event.code === 'F8') {
//         event.preventDefault();
//         await handleStoreAndCreateForm();
//     } else if (event.ctrlKey && event.code === 'F9') {
//         event.preventDefault();
//         Employee.form.hide();
//     }
// };

const isShowDetailBy = ref(true);
</script>

<template>
    <div
        class="form"
        @keydown.esc="handleHideForm"
        @keydown.stop="handleKeyDownForm"
        :key="tableTreeFormKey"
    >
        <div class="form-container">
            <!-- form header -->
            <div class="form-header">
                <!-- form-header left-group -->
                <div class="left-group">
                    <div class="heading-1 heading">
                        {{ TableTreeFormResources[lang].AccountFormTitle[AccountFormStore.mode] }}
                    </div>
                </div>

                <!-- form-header right-group -->
                <div class="right-group">
                    <IconHelp class="help-icon" />
                    <IconClose
                        :title="ButtonResources[lang].CloseTooltip"
                        class="close-icon"
                        @click="handleHideForm"
                    />
                </div>
            </div>

            <!-- form content -->
            <div class="form-content">
                <div class="row-1">
                    <VTextField
                        :size="InputSize.Medium"
                        :width="InputWidth.Medium"
                        :id="account_number.field"
                        :label="account_number.label"
                        v-model="currentItem[account_number.field]"
                        :required="true"
                        :min-length="account_number.minLength"
                        :max-length="account_number.maxLength"
                        :focus="AccountFormStore.getFocusState(account_number.field)"
                        :form-store="AccountFormStore"
                        :show-error="isShowValidateError"
                        :err-msgs="{
                            empty: ErrorResources[lang].EmptyAccountNumber,
                            minLength: ErrorResources[lang].MinlengthAccountNumber,
                            maxLength: ErrorResources[lang].MaxLengthAccountNumber
                        }"
                    />
                </div>

                <div class="row-2">
                    <VTextField
                        :size="InputSize.Medium"
                        :width="InputWidth.Full"
                        :id="account_name.field"
                        :label="account_name.label"
                        v-model="currentItem[account_name.field]"
                        :required="true"
                        :max-length="account_name.maxLength"
                        :focus="AccountFormStore.getFocusState(account_name.field)"
                        :form-store="AccountFormStore"
                        :show-error="isShowValidateError"
                        :err-msgs="{
                            empty: ErrorResources[lang].EmptyAccountName,
                            maxLength: ErrorResources[lang].MaxLengthAccountName
                        }"
                    />
                    <VTextField
                        :size="InputSize.Medium"
                        :width="InputWidth.Full"
                        :id="account_name_english.field"
                        :label="account_name_english.label"
                        v-model="currentItem[account_name_english.field]"
                        :max-length="account_name_english.maxLength"
                        :focus="AccountFormStore.getFocusState(account_name_english.field)"
                        :form-store="AccountFormStore"
                        :show-error="isShowValidateError"
                        :err-msgs="{
                            maxLength: ErrorResources[lang].MaxLengthAccountNameEnglish
                        }"
                    />
                </div>

                <div class="row-3">
                    <VCombobox
                        type="Table"
                        :size="InputSize.Medium"
                        :width="InputWidth.Full"
                        :id="parent_account.field"
                        :label="parent_account.label"
                        :tableInfo="{
                            columns: AccountComboboxColumns,
                            dataStore: AccountStore,
                            idField: account_id.field,
                            primaryField: account_number.field
                        }"
                        :modelValue="currentItem[parent_account.field]"
                        :focus="AccountFormStore.getFocusState(parent_account.field)"
                        :form-store="AccountFormStore"
                        :show-error="isShowValidateError"
                        :err-msgs="{
                            invalid: ErrorResources[lang].InvalidParentAccount
                        }"
                        @update:model-value="handleSelectParentAccount"
                    />

                    <VCombobox
                        type="Options"
                        :size="InputSize.Medium"
                        :width="InputWidth.Full"
                        :id="account_category.field"
                        :label="account_category.label"
                        :items="account_category.options"
                        v-model="currentItem[account_category.field]"
                        :required="true"
                        :focus="AccountFormStore.getFocusState(account_category.field)"
                        :show-error="isShowValidateError"
                        :err-msgs="{
                            empty: ErrorResources[lang].EmptyAccountCategoryKind,
                            invalid: ErrorResources[lang].InvalidAccountCategoryKind
                        }"
                    />
                </div>

                <div class="row-4">
                    <VTextarea
                        :rows="2"
                        :size="InputSize.Medium"
                        :width="InputWidth.Full"
                        :id="description.field"
                        :label="description.label"
                        v-model="currentItem[description.field]"
                        :max-length="description.maxLength"
                        :focus="AccountFormStore.getFocusState(description.field)"
                        :show-error="isShowValidateError"
                        :err-msgs="{
                            maxLength: ErrorResources[lang].MaxLengthDescription
                        }"
                    />
                </div>

                <VCheckbox
                    :id="is_postable_in_foreign_currency.field"
                    :label="is_postable_in_foreign_currency.label"
                    v-model="currentItem[is_postable_in_foreign_currency.field]"
                />

                <div class="checkbox-container">
                    <div class="toggle-detail-by" @click="isShowDetailBy = !isShowDetailBy">
                        <div v-if="isShowDetailBy" class="icon-triangle-down">
                            <VIcon class="triangle-down-img" />
                        </div>
                        <div v-else class="icon-triangle-right">
                            <VIcon class="triangle-right-img" />
                        </div>
                        <div class="title">Theo dõi chi tiết theo</div>
                    </div>
                    <div v-if="isShowDetailBy" class="checkbox-wrapper">
                        <div class="checkbox-field">
                            <VCheckbox
                                :id="is_detail_by_account_object.field"
                                :label="is_detail_by_account_object.label"
                                v-model="currentItem[is_detail_by_account_object.field]"
                            />
                            <VDropdownlist
                                :size="InputSize.Medium"
                                :width="InputWidth.Small"
                                :id="detail_by_account_object.field"
                                :options="detail_by_account_object.options"
                                v-model="currentItem[detail_by_account_object.field]"
                                :disabled="!currentItem[is_detail_by_account_object.field]"
                            />
                        </div>
                        <div class="checkbox-field">
                            <VCheckbox
                                :id="is_detail_by_bank_account.field"
                                :label="is_detail_by_bank_account.label"
                                v-model="currentItem[is_detail_by_bank_account.field]"
                            />
                        </div>
                        <div class="checkbox-field">
                            <VCheckbox
                                :id="is_detail_by_job.field"
                                :label="is_detail_by_job.label"
                                v-model="currentItem[is_detail_by_job.field]"
                            />
                            <VDropdownlist
                                :size="InputSize.Medium"
                                :width="InputWidth.Small"
                                :id="detail_by_job.field"
                                :options="detail_by_job.options"
                                v-model="currentItem[detail_by_job.field]"
                                :disabled="!currentItem[is_detail_by_job.field]"
                            />
                        </div>
                        <div class="checkbox-field">
                            <VCheckbox
                                :id="is_detail_by_project_work.field"
                                :label="is_detail_by_project_work.label"
                                v-model="currentItem[is_detail_by_project_work.field]"
                            />
                            <VDropdownlist
                                :size="InputSize.Medium"
                                :width="InputWidth.Small"
                                :id="detail_by_project_work.field"
                                :options="detail_by_project_work.options"
                                v-model="currentItem[detail_by_project_work.field]"
                                :disabled="!currentItem[is_detail_by_project_work.field]"
                            />
                        </div>
                        <div class="checkbox-field">
                            <VCheckbox
                                :id="is_detail_by_pu_contract.field"
                                :label="is_detail_by_pu_contract.label"
                                v-model="currentItem[is_detail_by_pu_contract.field]"
                            />
                            <VDropdownlist
                                :size="InputSize.Medium"
                                :width="InputWidth.Small"
                                :id="detail_by_pu_contract.field"
                                :options="detail_by_pu_contract.options"
                                v-model="currentItem[detail_by_pu_contract.field]"
                                :disabled="!currentItem[is_detail_by_pu_contract.field]"
                            />
                        </div>
                        <div class="checkbox-field">
                            <VCheckbox
                                :id="is_detail_by_order.field"
                                :label="is_detail_by_order.label"
                                v-model="currentItem[is_detail_by_order.field]"
                            />
                            <VDropdownlist
                                :size="InputSize.Medium"
                                :width="InputWidth.Small"
                                :id="detail_by_order.field"
                                :options="detail_by_order.options"
                                v-model="currentItem[detail_by_order.field]"
                                :disabled="!currentItem[is_detail_by_order.field]"
                            />
                        </div>
                        <div class="checkbox-field">
                            <VCheckbox
                                :id="is_detail_by_contract.field"
                                :label="is_detail_by_contract.label"
                                v-model="currentItem[is_detail_by_contract.field]"
                            />
                            <VDropdownlist
                                :size="InputSize.Medium"
                                :width="InputWidth.Small"
                                :id="detail_by_contract.field"
                                :options="detail_by_contract.options"
                                v-model="currentItem[detail_by_contract.field]"
                                :disabled="!currentItem[is_detail_by_contract.field]"
                            />
                        </div>
                        <div class="checkbox-field">
                            <VCheckbox
                                :id="is_detail_by_expense_item.field"
                                :label="is_detail_by_expense_item.label"
                                v-model="currentItem[is_detail_by_expense_item.field]"
                            />
                            <VDropdownlist
                                :size="InputSize.Medium"
                                :width="InputWidth.Small"
                                :id="detail_by_expense_item.field"
                                :options="detail_by_expense_item.options"
                                v-model="currentItem[detail_by_expense_item.field]"
                                :disabled="!currentItem[is_detail_by_expense_item.field]"
                            />
                        </div>
                        <div class="checkbox-field">
                            <VCheckbox
                                :id="is_detail_by_department.field"
                                :label="is_detail_by_department.label"
                                v-model="currentItem[is_detail_by_department.field]"
                            />
                            <VDropdownlist
                                :size="InputSize.Medium"
                                :width="InputWidth.Small"
                                :id="detail_by_department.field"
                                :options="detail_by_department.options"
                                v-model="currentItem[detail_by_department.field]"
                                :disabled="!currentItem[is_detail_by_department.field]"
                            />
                        </div>
                        <div class="checkbox-field">
                            <VCheckbox
                                :id="is_detail_by_list_item.field"
                                :label="is_detail_by_list_item.label"
                                v-model="currentItem[is_detail_by_list_item.field]"
                            />
                            <VDropdownlist
                                :size="InputSize.Medium"
                                :width="InputWidth.Small"
                                :id="detail_by_list_item.field"
                                :options="detail_by_list_item.options"
                                v-model="currentItem[detail_by_list_item.field]"
                                :disabled="!currentItem[is_detail_by_list_item.field]"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div class="form-footer">
                <div class="left-group">
                    <VButton
                        :style="ButtonStyle.Outline"
                        :tooltip="ButtonResources[lang].CancelTooltip"
                        :tooltip-direction="TooltipDirection.Up"
                        class="cancel-btn"
                        @click="AccountFormStore.hide"
                    >
                        {{ ButtonResources[lang].Cancel }}
                    </VButton>
                </div>

                <div class="right-group">
                    <VButton
                        :style="ButtonStyle.Outline"
                        :tooltip="ButtonResources[lang].StoreTooltip"
                        :tooltip-direction="TooltipDirection.Up"
                        class="add-btn"
                        @click="handleStoreForm"
                    >
                        {{ ButtonResources[lang].Store }}
                    </VButton>
                    <VButton
                        :style="ButtonStyle.Primary"
                        :tooltip="ButtonResources[lang].StoreAndAddTooltip"
                        :tooltip-direction="TooltipDirection.Up"
                        class="add-more-btn"
                        @click="handleStoreAndCreateForm"
                        @keydown.tab="forceRerender"
                    >
                        {{ ButtonResources[lang].StoreAndAdd }}
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
    width: 800px;
    height: 100%;
    right: 0;
    position: absolute;

    display: flex;
    flex-direction: column;
    border-radius: 4px 0 0 4px;
    background-color: rgb(var(--c-white));
}

/* Styles for form-header */
.form-header {
    @include font(14);
    margin-top: 20px;
    padding: 0 16px;

    display: flex;
    justify-content: space-between;
    align-items: center;
    .left-group {
        display: flex;
        gap: 24px;
        .heading {
            font-weight: 500;
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
    gap: 8px;
    padding: 16px;

    .row-1 {
        display: flex;
    }

    .row-2 {
        display: flex;
        gap: 16px;
        & > * {
            flex: 1;
        }
    }

    .row-3 {
        display: flex;
        width: calc(50% - 8px);
        gap: 16px;
    }

    .row-4 {
        display: flex;
        & > * {
            flex: 1;
        }
    }
}

.checkbox-container {
    margin-top: 8px;
    .toggle-detail-by {
        display: flex;
        align-items: center;
        gap: 2px;

        padding: 12px 0;
        cursor: pointer;

        &:hover {
            color: rgb(var(--c-primary));
        }

        .icon-triangle-down {
            position: relative;
            @include size(16px);
            .triangle-down-img {
                width: 10px;
                height: 8px;
                background-position: -371px -364px;
            }
        }

        .icon-triangle-right {
            position: relative;
            @include size(16px);
            .triangle-right-img {
                width: 8px;
                height: 10px;
                background-position: -324px -363px;
            }
        }

        .title {
            @include font(16);
        }
    }
    .checkbox-wrapper {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        column-gap: 80px;
        row-gap: 10px;
        padding: 0 12px;

        .checkbox-field {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
    }
}

/* Styles for form-footer */
.form-footer {
    display: flex;
    justify-content: space-between;
    padding: 12px 24px;
    border-radius: 0 0 4px 4px;

    border-top: 1px solid rgb(var(--c-gray-300));
    .right-group {
        display: flex;
        gap: 8px;
    }
}
</style>

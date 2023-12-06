<script setup>
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

import { AccountForm } from '@/features';
import {
    ButtonResources,
    DialogResources,
    TableResources,
    ToastMessageResources
} from '@/resources';
import {
    useAccountFormStore,
    useAccountStore,
    useDialogStore,
    useLanguageStore,
    useToastMessageStore
} from '@/stores';
import { DialogType, FormMode, ToastMessageType } from '@/utils/enum';
import { AccountFields, AccountListColumns } from '@/utils/fields';

const LanguageStore = useLanguageStore();
const { current: lang } = storeToRefs(LanguageStore);
const DialogStore = useDialogStore();
const ToastMessageStore = useToastMessageStore();

const { account_id, account_number, is_parent, parent_id, inactive } = AccountFields;

const AccountStore = useAccountStore();
const AccountFormStore = useAccountFormStore();

const { selectedItem } = storeToRefs(AccountStore);

/**
 * === DELETE ===
 */

const showDialogDeleteParentAccount = () => {
    DialogStore.show(
        DialogType.Error,
        DialogResources[lang.value].DeleteParentAccount.title,
        DialogResources[lang.value].DeleteParentAccount.message,
        ButtonResources[lang.value].Close,
        DialogStore.hide
    );
};

const showDialogDeleteAccount = () => {
    if (selectedItem.value[is_parent.field]) showDialogDeleteParentAccount();
    else
        DialogStore.show(
            DialogType.Warning,
            DialogResources[lang.value].DeleteAccount.title,
            DialogResources[lang.value].DeleteAccount.message(
                selectedItem.value[account_number.field]
            ),
            ButtonResources[lang.value].Yes,
            handleDelete,
            ButtonResources[lang.value].No,
            DialogStore.hide
        );
};

const handleDelete = async () => {
    const deletedAccount = selectedItem.value;
    const result = await AccountStore.removeAsync(selectedItem.value);
    if (result.IsSuccess) {
        try {
            AccountStore.reloadData = true;

            DialogStore.hide();
            ToastMessageStore.show(
                ToastMessageType.Success,
                ToastMessageResources[lang.value].DeleteAccount.success(
                    deletedAccount[account_number.field]
                )
            );
        } catch (err) {
            console.log(err);

            DialogStore.hide();
            ToastMessageStore.show(
                ToastMessageType.Error,
                ToastMessageResources[lang.value].DeleteAccount.error(
                    deletedAccount[account_number.field]
                )
            );
        }
    }
};

/**
 * === CEASE USING / USING ===
 */

const toggleInactiveAccount = async () => {
    switch (selectedItem.value[is_parent.field]) {
        case true:
            if (selectedItem.value[inactive.field])
                showDialogUsingParentAccount(selectedItem.value[account_id.field]);
            else handleUpdateInactiveAccount(selectedItem.value[account_id.field], true, true);
            break;
        case false:
            if (selectedItem.value[inactive.field]) {
                if (!selectedItem.value[parent_id.field])
                    handleUpdateInactiveAccount(selectedItem.value[account_id.field], false, false);
                else {
                    const parentItem = await AccountStore.getByIdAsync(
                        selectedItem.value[parent_id.field]
                    ).then((res) => res.Result);
                    if (parentItem[inactive.field]) showDialogUsingAccount();
                    else
                        handleUpdateInactiveAccount(
                            selectedItem.value[account_id.field],
                            false,
                            false
                        );
                }
            } else handleUpdateInactiveAccount(selectedItem.value[account_id.field], true, false);
            break;
    }
};

/**
 * Ngừng sử dụng / Sử dụng tài khoản
 */
const handleUpdateInactiveAccount = async (accountId, inactive, forceChild) => {
    DialogStore.hide();
    const result = await AccountStore.updateInactiveAsync(accountId, inactive, forceChild);
    if (result.IsSuccess) AccountStore.reloadData = true;
};

/**
 * Sử dụng tài khoản cha
 * @param {*} accountId
 */
const showDialogUsingParentAccount = (accountId) => {
    DialogStore.show(
        DialogType.Warning,
        DialogResources[lang.value].UsingParentAccount.title,
        DialogResources[lang.value].UsingParentAccount.message,
        ButtonResources[lang.value].Yes,
        () => handleUpdateInactiveAccount(accountId, false, true),
        ButtonResources[lang.value].No,
        () => handleUpdateInactiveAccount(accountId, false, false)
    );
};

/**
 * Sử dụng tài khoản con
 * @param {*} accountId
 * @param {*} accountNumber
 */
const showDialogUsingAccount = () => {
    DialogStore.show(
        DialogType.Error,
        DialogResources[lang.value].UsingAccount.title,
        DialogResources[lang.value].UsingAccount.message,
        ButtonResources[lang.value].Close,
        DialogStore.hide
    );
};

/**
 * === TABLE ROW OPTIONS ===
 */

const primaryRowOption = computed(() => ({
    title: TableResources[lang.value].Update,
    method: AccountFormStore.update
}));

const otherRowOptions = computed(() => [
    {
        title: TableResources[lang.value].Delete,
        method: showDialogDeleteAccount
    },
    {
        title: TableResources[lang.value].Duplicate,
        method: AccountFormStore.duplicate
    },
    {
        title: selectedItem.value[inactive.field]
            ? TableResources[lang.value].Using
            : TableResources[lang.value].CeaseUsing,
        method: toggleInactiveAccount
    }
]);
</script>

<template>
    <div class="content">
        <div class="content-header heading-1">Hệ thống tài khoản</div>
        <VTableTree
            :columns-info="AccountListColumns"
            :id-field="account_id.field"
            :primary-field="account_number.field"
            :searchbar-placeholder="TableResources[lang].SearchAccount"
            :data-store="AccountStore"
            :form-store="AccountFormStore"
            :primary-row-option="primaryRowOption"
            :other-row-options="otherRowOptions"
        >
            <template #form>
                <AccountForm v-if="AccountFormStore.mode != FormMode.Hide" />
            </template>
        </VTableTree>
    </div>
</template>

<style lang="scss" scoped>
@import '@/styles/global.scss';

$--process-content-padding: 16px 20px 20px;
$--process-content-height: calc(100% - var(--tab-navigation-height));

.content {
    max-height: var(--main-content-height);
    height: 100%;
    padding: $--process-content-padding;
    background-color: rgb(var(--c-gray-100));

    display: flex;
    flex-direction: column;
    align-items: center;
    .content-header {
        width: 100%;
        height: var(--main-content-header-height);
        margin-bottom: 12px;
        display: flex;
        align-items: center;
    }
}
</style>

<script setup>
import { TheTabNavigation } from '@/layouts';
import { cashRoutes } from '@/router/constants';
import { usePaymentFormStore } from '@/stores';
import { useRouter } from 'vue-router';

const PaymentFormStore = usePaymentFormStore();

const router = useRouter();
const handleCreatePayment = () => {
    PaymentFormStore.create();
    router.push(`${PaymentFormStore.formRoute}`);
};
</script>

<template>
    <div class="content">
        <TheTabNavigation :routes="cashRoutes" />
        <div class="form-process">
            <div class="process-area">
                <div class="process-text">Nghiệp vụ tiền mặt</div>
                <img src="src/assets/images/cash-image.svg" alt="cash-image" />

                <div class="process-button receipt-button">
                    <div class="title-button">Thu tiền</div>
                </div>
                <div class="process-button payment-button" @click="handleCreatePayment">
                    <div class="title-button">Chi tiền</div>
                </div>
                <div class="process-button audit-button">
                    <div class="title-button">Kiểm kê quỹ</div>
                </div>
            </div>

            <RouterLink to="account-list" class="account-system-button">
                <div class="icon-account-system">
                    <VIcon class="account-system-img" />
                </div>
                <div>Hệ thống tài khoản</div>
            </RouterLink>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/styles/global.scss';

$--process-content-padding: 12px 24px 24px;
$--process-content-height: calc(100% - var(--tab-navigation-height));

.content {
    max-height: var(--main-content-height);
    height: 100%;
    padding: $--process-content-padding;
    background-color: rgb(var(--c-gray-100));

    display: flex;
    flex-direction: column;
    align-items: center;
}

.form-process {
    max-height: $--process-content-height;
    height: 100%;
    width: 690px;

    display: flex;
    flex-direction: column;
    justify-content: center;
}

.process-area {
    position: relative;
    background: rgb(var(--c-white));
    .process-text {
        @include font(14, 700);
        text-transform: uppercase;
        height: 40px;
        display: grid;
        place-items: center;
        border-bottom: 1px solid #e5e5e5;
    }
}

.process-button {
    @include font(13);
    position: absolute;
    width: 90px;
    padding-top: 60px;

    text-align: center;
    transition: all 0.2s ease;
    cursor: pointer;

    &:hover {
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.25);
    }

    &.receipt-button {
        top: 82px;
        left: 90px;
    }

    &.payment-button {
        top: 258px;
        left: 90px;
    }

    &.audit-button {
        top: 170px;
        left: 351px;
    }
}

.title-button {
    display: flex;
    justify-content: center;
    height: 100%;
    align-items: flex-end;
    padding-bottom: 10px;
}

.account-system-button {
    @include font(13);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    margin-top: 10px;
    height: 70px;
    width: 100%;
    background: rgb(var(--c-white));
    cursor: pointer;

    &:hover {
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.25);
    }
}

.icon-account-system {
    position: relative;
    @include size(28px);
    cursor: pointer;
    .account-system-img {
        width: 21px;
        height: 22px;
        background-position: -1378px -257px;
    }
}
</style>

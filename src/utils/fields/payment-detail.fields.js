import { PaymentFields } from './payment.fields';

export const PaymentDetailFields = Object.freeze({
    payment_detail_id: {
        field: 'payment_detail_id',
        label: '',
        type: String
    },
    payment_id: {
        field: 'payment_id',
        label: '',
        type: String
    },
    description: {
        field: 'description',
        label: '',
        type: String
    },
    debit_account: {
        field: 'debit_account',
        label: '',
        type: String
    },
    credit_account: {
        field: 'credit_account',
        label: '',
        type: String
    },
    amount: {
        field: 'amount',
        label: '',
        type: String
    },
    created_date: {
        field: 'created_date',
        label: '',
        type: String
    },
    created_by: {
        field: 'created_by',
        label: '',
        type: String
    },
    modified_date: {
        field: 'modified_date',
        label: '',
        type: String
    },
    modified_by: {
        field: 'modified_by',
        label: '',
        type: String
    }
});

export const PaymentDetailListColumns = [
    {
        title: '#',
        field: 'Index',
        width: 16,
        minWidth: 16
    },
    {
        title: 'Diễn giải',
        field: PaymentDetailFields.description.field,
        canSort: false,
        canFilter: false,
        dataType: String,
        width: 240,
        minWidth: 120
    },
    {
        title: 'TK nợ',
        tooltip: 'Tài khoản nợ',
        field: PaymentDetailFields.debit_account.field,
        canSort: false,
        canFilter: false,
        dataType: String,
        width: 120,
        minWidth: 40
    },
    {
        title: 'TK có',
        tooltip: 'Tài khoản có',
        field: PaymentDetailFields.credit_account.field,
        canSort: false,
        canFilter: false,
        dataType: String,
        width: 120,
        minWidth: 40
    },
    {
        title: 'Số tiền',
        field: PaymentDetailFields.amount.field,
        canSort: false,
        canFilter: false,
        dataType: Number,
        formatType: 'Currency',
        width: 140,
        minWidth: 60
    },
    {
        title: 'Đối tượng',
        field: PaymentFields.supplier_code.field,
        canSort: false,
        canFilter: false,
        dataType: String,
        width: 140,
        minWidth: 100
    },
    {
        title: 'Tên đối tượng',
        field: PaymentFields.supplier_name.field,
        canSort: false,
        canFilter: false,
        dataType: String,
        width: 240,
        minWidth: 120
    }
];

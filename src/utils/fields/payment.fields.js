export const PaymentFields = Object.freeze({
    posted_date: {
        field: 'posted_date',
        label: 'Ngày hạch toán',
        type: Date
    },
    payment_id: {
        field: 'payment_id',
        label: '',
        type: String
    },
    payment_date: {
        field: 'payment_date',
        label: 'Ngày phiếu chi',
        type: Date
    },
    total_amount: {
        field: 'total_amount',
        label: '',
        type: String
    },
    payment_number: {
        field: 'payment_number',
        label: 'Số phiếu chi',
        type: String
    },
    journal_memo: {
        field: 'journal_memo',
        label: 'Lý do chi',
        type: String
    },
    document_included: {
        field: 'document_included',
        label: 'Kèm theo',
        suffixText: 'chứng từ gốc',
        type: String
    },
    employee_id: {
        field: 'employee_id',
        label: '',
        type: String
    },
    employee_code: {
        field: 'employee_code',
        label: 'Mã nhân viên',
        type: String
    },
    employee_name: {
        field: 'employee_name',
        label: 'Nhân viên',
        type: String
    },
    supplier_code: {
        field: 'supplier_code',
        label: 'Mã đối tượng',
        type: String
    },
    supplier_contact_name: {
        field: 'supplier_contact_name',
        label: 'Người nhận',
        type: String
    },
    supplier_id: {
        field: 'supplier_id',
        label: '',
        type: String
    },
    supplier_name: {
        field: 'supplier_name',
        label: 'Tên đối tượng',
        type: String
    },
    supplier_address: {
        field: 'supplier_address',
        label: 'Địa chỉ',
        type: String
    },
    created_date: {
        field: 'created_date',
        label: '',
        type: Date
    },
    created_by: {
        field: 'created_by',
        label: '',
        type: String
    },
    modified_date: {
        field: 'modified_date',
        label: '',
        type: Date
    },
    modified_by: {
        field: 'modified_by',
        label: '',
        type: String
    }
});

export const PaymentListColumns = [
    {
        field: 'CheckItem',
        width: 19,
        minWidth: 19
    },
    {
        title: 'Ngày hạch toán',
        field: PaymentFields.posted_date.field,
        canSort: false,
        canFilter: false,
        dataType: Date,
        width: 120,
        minWidth: 70
    },
    {
        title: 'Ngày chứng từ',
        field: PaymentFields.payment_date.field,
        canSort: false,
        canFilter: false,
        dataType: Date,
        width: 120,
        minWidth: 70
    },
    {
        title: 'Số chứng từ',
        field: PaymentFields.payment_number.field,
        canSort: false,
        canFilter: false,
        dataType: String,
        width: 110,
        minWidth: 80
    },
    {
        title: 'Diễn giải',
        field: PaymentFields.journal_memo.field,
        canSort: false,
        canFilter: false,
        dataType: String,
        width: 220,
        minWidth: 80
    },
    {
        title: 'Số tiền',
        field: PaymentFields.total_amount.field,
        canSort: false,
        canFilter: false,
        dataType: Number,
        formatType: 'Currency',
        width: 120,
        minWidth: 80
    },
    {
        title: 'Mã đối tượng',
        field: PaymentFields.supplier_code.field,
        canSort: false,
        canFilter: false,
        dataType: String,
        width: 120,
        minWidth: 80
    },
    {
        title: 'Đối tượng',
        field: PaymentFields.supplier_name.field,
        canSort: false,
        canFilter: false,
        dataType: String,
        width: 140,
        minWidth: 80
    },
    {
        title: 'Địa chỉ',
        field: PaymentFields.supplier_address.field,
        canSort: false,
        canFilter: false,
        dataType: String,
        width: 200,
        minWidth: 80
    },
    {
        title: 'Chức năng',
        field: 'Options',
        canSort: false,
        canFilter: false,
        dataType: String,
        width: 100,
        minWidth: 80
    }
];

export const PaymentFormFields = {
    supplier_code: PaymentFields.supplier_code,
    supplier_name: PaymentFields.supplier_name,
    supplier_contact_name: PaymentFields.supplier_contact_name,
    supplier_address: PaymentFields.supplier_address,
    journal_memo: PaymentFields.journal_memo,
    employee_name: PaymentFields.employee_name,
    document_included: PaymentFields.document_included,
    posted_date: PaymentFields.posted_date,
    payment_date: PaymentFields.payment_date,
    payment_number: PaymentFields.payment_number
};

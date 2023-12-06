export const SupplierFields = Object.freeze({
    supplier_id: {
        field: 'supplier_id',
        label: '',
        type: String
    },
    supplier_code: {
        field: 'supplier_code',
        label: 'Mã đối tượng',
        type: String,
        minLength: 3,
        maxLength: 25
    },
    supplier_name: {
        field: 'supplier_name',
        label: 'Tên đối tượng',
        type: String,
        maxLength: 255
    },
    phone_number: {
        field: 'phone_number',
        label: 'Điện thoại',
        type: String,
        maxLength: 50
    },
    address: {
        field: 'address',
        label: 'Địa chỉ',
        type: String,
        maxLength: 255
    },
    created_date: {
        field: 'created_date',
        label: '',
        type: String
    },
    modified_date: {
        field: 'modified_date',
        label: '',
        type: String
    },
    created_by: {
        field: 'created_by',
        label: '',
        type: String
    },
    modified_by: {
        field: 'modified_by',
        label: '',
        type: String
    }
});

export const SupplierComboboxColumns = [
    {
        title: 'Đối tượng',
        field: SupplierFields.supplier_code.field,
        canSort: false,
        canFilter: false,
        dataType: Number,
        minWidth: 90
    },
    {
        title: 'Tên đối tượng',
        field: SupplierFields.supplier_name.field,
        canSort: false,
        canFilter: false,
        dataType: String,
        width: 220,
        minWidth: 80
    },
    {
        title: 'Địa chỉ',
        field: SupplierFields.address.field,
        canSort: false,
        canFilter: false,
        dataType: String,
        width: 220,
        minWidth: 80
    },
    {
        title: 'Điện thoại',
        field: SupplierFields.phone_number.field,
        canSort: false,
        canFilter: false,
        dataType: String,
        width: 220,
        minWidth: 80
    }
];

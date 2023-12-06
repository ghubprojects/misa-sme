export const AccountCategories = Object.freeze({
    Debit: 'Dư Nợ',
    Credit: 'Dư Có',
    Neutral: 'Lưỡng Tính',
    NoBalance: 'Không có số dư'
});

export const AccountObjects = Object.freeze({
    Customer: 'Khách hàng',
    Supplier: 'Nhà cung cấp',
    Employee: 'Nhân viên'
});

export const AccountStatus = Object.freeze({
    Active: 'Đang sử dụng',
    Inactive: 'Ngưng sử dụng'
});

export const DetailByOptions = Object.freeze({
    OnlyWarning: 'Chỉ cảnh báo',
    Required: 'Bắt buộc nhập'
});

const convertDataDetailBy = (value) => Object.values(DetailByOptions).indexOf(value);

export const AccountFields = Object.freeze({
    account_id: {
        field: 'account_id',
        label: '',
        type: String,
        defaultValue: '00000000-0000-0000-0000-000000000000'
    },
    account_category: {
        field: 'account_category',
        label: 'Tính chất',
        type: String,
        defaultValue: Object.values(AccountCategories).indexOf(AccountCategories.Debit),
        options: Object.values(AccountCategories),
        formatData: (value) => Object.values(AccountCategories)[value],
        convertData: (value) => Object.values(AccountCategories).indexOf(value)
    },
    account_number: {
        field: 'account_number',
        label: 'Số tài khoản',
        type: String,
        minLength: 3,
        maxLength: 25
    },
    current_account_number: {
        field: 'current_account_number',
        label: '',
        type: String
    },
    account_name: {
        field: 'account_name',
        label: 'Tên tài khoản',
        type: String,
        maxLength: 255
    },
    account_name_english: {
        field: 'account_name_english',
        label: 'Tên tiếng Anh',
        type: String,
        maxLength: 255
    },
    description: {
        field: 'description',
        label: 'Diễn giải',
        type: String,
        maxLength: 255
    },
    is_parent: {
        field: 'is_parent',
        label: '',
        type: String
    },
    parent_id: {
        field: 'parent_id',
        label: '',
        type: String,
        defaultValue: null
    },
    parent_account: {
        field: 'parent_account',
        label: 'Tài khoản tổng hợp',
        type: String
    },
    grade: {
        field: 'grade',
        label: '',
        type: String
    },
    is_postable_in_foreign_currency: {
        field: 'is_postable_in_foreign_currency',
        label: 'Có hạch toán ngoại tệ',
        type: Boolean
    },
    is_detail_by_account_object: {
        field: 'is_detail_by_account_object',
        label: 'Đối tượng',
        type: Boolean
    },
    is_detail_by_bank_account: {
        field: 'is_detail_by_bank_account',
        label: 'Tài khoản ngân hàng',
        type: Boolean
    },
    is_detail_by_job: {
        field: 'is_detail_by_job',
        label: 'Đối tượng THCP',
        type: Boolean
    },
    is_detail_by_project_work: {
        field: 'is_detail_by_project_work',
        label: 'Công trình',
        type: Boolean
    },
    is_detail_by_pu_contract: {
        field: 'is_detail_by_pu_contract',
        label: 'Hợp đồng mua',
        type: Boolean
    },
    is_detail_by_order: {
        field: 'is_detail_by_order',
        label: 'Đơn đặt hàng',
        type: Boolean
    },
    is_detail_by_contract: {
        field: 'is_detail_by_contract',
        label: 'Hợp đồng bán',
        type: Boolean
    },
    is_detail_by_expense_item: {
        field: 'is_detail_by_expense_item',
        label: 'Khoản mục CP',
        type: Boolean
    },
    is_detail_by_department: {
        field: 'is_detail_by_department',
        label: 'Đơn vị',
        type: Boolean
    },
    is_detail_by_list_item: {
        field: 'is_detail_by_list_item',
        label: 'Mã thống kê',
        type: Boolean
    },
    detail_by_account_object: {
        field: 'detail_by_account_object',
        label: 'Đối tượng',
        defaultValue: Object.values(AccountObjects).indexOf(AccountObjects.Customer),
        options: Object.values(AccountObjects),
        formatData: (value) => Object.values(AccountObjects)[value],
        convertData: (value) => Object.values(AccountObjects).indexOf(value)
    },
    detail_by_job: {
        field: 'detail_by_job',
        label: 'Đối tượng THCP',
        defaultValue: Object.values(DetailByOptions).indexOf(DetailByOptions.OnlyWarning),
        options: Object.values(DetailByOptions),
        formatData: (value) => Object.values(DetailByOptions)[value],
        convertData: convertDataDetailBy
    },
    detail_by_project_work: {
        field: 'detail_by_project_work',
        label: 'Công trình',
        defaultValue: Object.values(DetailByOptions).indexOf(DetailByOptions.OnlyWarning),
        options: Object.values(DetailByOptions),
        formatData: (value) => Object.values(DetailByOptions)[value],
        convertData: convertDataDetailBy
    },
    detail_by_pu_contract: {
        field: 'detail_by_pu_contract',
        label: 'Hợp đồng mua',
        defaultValue: Object.values(DetailByOptions).indexOf(DetailByOptions.OnlyWarning),
        options: Object.values(DetailByOptions),
        formatData: (value) => Object.values(DetailByOptions)[value],
        convertData: convertDataDetailBy
    },
    detail_by_order: {
        field: 'detail_by_order',
        label: 'Đơn đặt hàng',
        defaultValue: Object.values(DetailByOptions).indexOf(DetailByOptions.OnlyWarning),
        options: Object.values(DetailByOptions),
        formatData: (value) => Object.values(DetailByOptions)[value],
        convertData: convertDataDetailBy
    },
    detail_by_contract: {
        field: 'detail_by_contract',
        label: 'Hợp đồng bán',
        defaultValue: Object.values(DetailByOptions).indexOf(DetailByOptions.OnlyWarning),
        options: Object.values(DetailByOptions),
        formatData: (value) => Object.values(DetailByOptions)[value],
        convertData: convertDataDetailBy
    },
    detail_by_expense_item: {
        field: 'detail_by_expense_item',
        label: 'Khoản mục CP',
        defaultValue: Object.values(DetailByOptions).indexOf(DetailByOptions.OnlyWarning),
        options: Object.values(DetailByOptions),
        formatData: (value) => Object.values(DetailByOptions)[value],
        convertData: convertDataDetailBy
    },
    detail_by_department: {
        field: 'detail_by_department',
        label: 'Đơn vị',
        defaultValue: Object.values(DetailByOptions).indexOf(DetailByOptions.OnlyWarning),
        options: Object.values(DetailByOptions),
        formatData: (value) => Object.values(DetailByOptions)[value],
        convertData: convertDataDetailBy
    },
    detail_by_list_item: {
        field: 'detail_by_list_item',
        label: 'Mã thống kê',
        defaultValue: Object.values(DetailByOptions).indexOf(DetailByOptions.OnlyWarning),
        options: Object.values(DetailByOptions),
        formatData: (value) => Object.values(DetailByOptions)[value],
        convertData: convertDataDetailBy
    },
    inactive: {
        field: 'inactive',
        label: '',
        type: Boolean,
        defaultValue: false,
        options: Object.values(DetailByOptions),
        formatData: (value) => (value ? AccountStatus.Inactive : AccountStatus.Active)
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

export const AccountListColumns = [
    {
        title: 'Số tài khoản',
        field: AccountFields.account_number.field,
        canSort: false,
        canFilter: false,
        dataType: Number,
        minWidth: 90
    },
    {
        title: 'Tên tài khoản',
        field: AccountFields.account_name.field,
        canSort: false,
        canFilter: false,
        dataType: String,
        width: 220,
        minWidth: 80
    },
    {
        title: 'Tính chất',
        field: AccountFields.account_category.field,
        canSort: false,
        canFilter: false,
        dataType: Number,
        width: 110,
        minWidth: 80,
        formatData: AccountFields.account_category.formatData
    },
    {
        title: 'Tên tiếng Anh',
        field: AccountFields.account_name_english.field,
        canSort: false,
        canFilter: false,
        dataType: String,
        width: 220,
        minWidth: 80
    },
    {
        title: 'Diễn giải',
        field: AccountFields.description.field,
        canSort: false,
        canFilter: false,
        dataType: String,
        width: 220,
        minWidth: 80
    },
    {
        title: 'Trạng thái',
        field: AccountFields.inactive.field,
        canSort: false,
        canFilter: false,
        dataType: Boolean,
        width: 120,
        minWidth: 80,
        formatData: AccountFields.inactive.formatData
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

export const AccountComboboxColumns = [
    {
        title: 'Số tài khoản',
        field: AccountFields.account_number.field,
        canSort: false,
        canFilter: false,
        dataType: Number,
        minWidth: 90
    },
    {
        title: 'Tên tài khoản',
        field: AccountFields.account_name.field,
        canSort: false,
        canFilter: false,
        dataType: String,
        width: 220,
        minWidth: 80
    }
];

export const AccountFormFields = {
    account_id: AccountFields.account_id,
    account_number: AccountFields.account_number,
    account_name: AccountFields.account_name,
    account_name_english: AccountFields.account_name_english,
    parent_id: AccountFields.parent_id,
    parent_account: AccountFields.parent_account,
    account_category: AccountFields.account_category,
    description: AccountFields.description,
    is_postable_in_foreign_currency: AccountFields.is_postable_in_foreign_currency,
    is_detail_by_account_object: AccountFields.is_detail_by_account_object,
    is_detail_by_bank_account: AccountFields.is_detail_by_bank_account,
    is_detail_by_job: AccountFields.is_detail_by_job,
    is_detail_by_project_work: AccountFields.is_detail_by_project_work,
    is_detail_by_pu_contract: AccountFields.is_detail_by_pu_contract,
    is_detail_by_order: AccountFields.is_detail_by_order,
    is_detail_by_contract: AccountFields.is_detail_by_contract,
    is_detail_by_expense_item: AccountFields.is_detail_by_expense_item,
    is_detail_by_department: AccountFields.is_detail_by_department,
    is_detail_by_list_item: AccountFields.is_detail_by_list_item,
    detail_by_account_object: AccountFields.detail_by_account_object,
    detail_by_job: AccountFields.detail_by_job,
    detail_by_project_work: AccountFields.detail_by_project_work,
    detail_by_pu_contract: AccountFields.detail_by_pu_contract,
    detail_by_order: AccountFields.detail_by_order,
    detail_by_contract: AccountFields.detail_by_contract,
    detail_by_expense_item: AccountFields.detail_by_expense_item,
    detail_by_department: AccountFields.detail_by_department,
    detail_by_list_item: AccountFields.detail_by_list_item
};

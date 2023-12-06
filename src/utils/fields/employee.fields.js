export const EmployeeFields = Object.freeze({
    employee_id: {
        field: 'employee_id',
        label: '',
        type: String
    },
    employee_code: {
        field: 'employee_code',
        label: 'Mã nhân viên',
        type: String,
        minLength: 3,
        maxLength: 20
    },
    full_name: {
        field: 'full_name',
        label: 'Họ và tên',
        type: String,
        maxLength: 100
    },
    date_of_birth: {
        field: 'date_of_birth',
        label: 'Ngày sinh',
        type: Date
    },
    gender: {
        field: 'gender',
        label: 'Giới tính',
        type: Number
    },
    identity_number: {
        field: 'identity_number',
        label: 'Số CMND',
        type: String,
        maxLength: 25
    },
    identity_date: {
        field: 'identity_date',
        label: 'Ngày cấp CMND',
        type: Date
    },
    identity_place: {
        field: 'identity_place',
        label: 'Nơi cấp CMND',
        type: String,
        maxLength: 255
    },
    position_name: {
        field: 'position_name',
        label: 'Chức vụ',
        type: String,
        maxLength: 100
    },
    department_id: {
        field: 'department_id',
        label: 'ID Phòng ban',
        type: String
    },
    address: {
        field: 'address',
        label: 'Địa chỉ',
        type: String,
        maxLength: 255
    },
    email: {
        field: 'email',
        label: 'Email',
        type: String,
        maxLength: 100
    },
    mobile_phone: {
        field: 'mobile_phone',
        label: 'Điện thoại di động',
        type: String,
        maxLength: 50
    },
    landline_phone: {
        field: 'landline_phone',
        label: 'Điện thoại cố định',
        type: String,
        maxLength: 50
    },
    bank_account: {
        field: 'bank_account',
        label: 'Số tài khoản ngân hàng',
        type: String,
        maxLength: 25
    },
    bank_name: {
        field: 'bank_name',
        label: 'Ngân hàng',
        type: String,
        maxLength: 255
    },
    bank_branch: {
        field: 'bank_branch',
        label: 'Chi nhánh ngân hàng',
        type: String,
        maxLength: 255
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

export const EmployeeComboboxColumns = [
    {
        title: 'Mã nhân viên',
        field: EmployeeFields.employee_code.field,
        canSort: false,
        canFilter: false,
        dataType: Number,
        minWidth: 90
    },
    {
        title: 'Tên nhân viên',
        field: EmployeeFields.full_name.field,
        canSort: false,
        canFilter: false,
        dataType: String,
        width: 220,
        minWidth: 80
    },
    {
        title: 'ĐT di động',
        field: EmployeeFields.mobile_phone.field,
        canSort: false,
        canFilter: false,
        dataType: String,
        width: 220,
        minWidth: 80
    }
];

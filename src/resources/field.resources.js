import { EmployeeFields } from "@/utils/enum";

export const FieldResources = {
    VI: {
        [EmployeeFields.EmployeeCode]: 'Mã',
        [EmployeeFields.FullName]: 'Tên',
        [EmployeeFields.DepartmentName]: 'Đơn vị',
        [EmployeeFields.PositionName]: 'Chức danh',

        [EmployeeFields.Gender]: 'Giới tính',
        GenderMale: 'Nam',
        GenderFemale: 'Nữ',
        GenderOther: 'Khác',
        GenderInvalid: 'Không hợp lệ',


        [EmployeeFields.DateOfBirth]: 'Ngày sinh',
        [EmployeeFields.IdentityNumber]: 'Số CMND',
        [EmployeeFields.IdentityIssuedDate]: 'Ngày cấp',
        [EmployeeFields.IdentityIssuedPlace]: 'Nơi cấp',

        [EmployeeFields.Address]: 'Địa chỉ',
        [EmployeeFields.MobilePhone]: 'ĐT di động',
        [EmployeeFields.LandlinePhone]: 'ĐT cố định',
        [EmployeeFields.Email]: 'Email',

        [EmployeeFields.BankAccount]: 'Tài khoản ngân hàng',
        [EmployeeFields.BankName]: 'Tên ngân hàng',
        [EmployeeFields.BankBranch]: 'Chi nhánh',

        IdentityNumberTitle: 'Số chứng minh nhân dân',
        MobilePhoneTitle: 'Điện thoại di động',
        LandlinePhoneTitle: 'Điện thoại cố định',

        TodayButtonText: 'Hôm nay'
    },
    EN: {
        [EmployeeFields.EmployeeCode]: 'Code',
        [EmployeeFields.FullName]: 'Name',
        [EmployeeFields.DepartmentName]: 'Department',
        [EmployeeFields.PositionName]: 'Position',

        [EmployeeFields.Gender]: 'Gender',
        GenderMale: 'Male',
        GenderFemale: 'Female',
        GenderOther: 'Other',
        GenderInvalid: 'Invalid',

        [EmployeeFields.DateOfBirth]: 'Date of birth',
        [EmployeeFields.IdentityNumber]: 'Identity number',
        [EmployeeFields.IdentityIssuedDate]: 'Identity issued date',
        [EmployeeFields.IdentityIssuedPlace]: 'Identity issued place',

        [EmployeeFields.Address]: 'Address',
        [EmployeeFields.MobilePhone]: 'Mobile phone',
        [EmployeeFields.LandlinePhone]: 'Landline phone',
        [EmployeeFields.Email]: 'Email',

        [EmployeeFields.BankAccount]: 'Bank account',
        [EmployeeFields.BankName]: 'Bank name',
        [EmployeeFields.BankBranch]: 'Bank branch',

        TodayButtonText: 'Today'
    }
}
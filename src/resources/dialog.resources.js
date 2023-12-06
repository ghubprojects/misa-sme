import { DialogType } from '@/utils/enum';

export const DialogResources = {
    VI: {
        GlobalError: {
            title: ''
        },
        SaveChanges: {
            title: 'Lưu thay đổi',
            message: 'Dữ liệu đã bị thay đổi. Bạn có muốn cất không?'
        },
        Validate: {
            title: 'Lỗi nhập liệu'
        },

        /**
         * Employee resources
         */
        DeleteEmployee: {
            title: 'Xóa nhân viên',
            message: (employeeCode) =>
                `Bạn có chắc chắn muốn xóa nhân viên <${employeeCode}> không?`
        },
        DeleteMultipleEmployees: {
            title: 'Xóa danh sách nhân viên đã chọn?',
            message: 'Danh sách nhân viên sau khi xóa sẽ không thể khôi phục lại được.'
        },

        DuplicatedEmployeeCode: {
            title: 'Dữ liệu trùng lặp',
            message: (employeeCode) =>
                `Mã nhân viên <${employeeCode}> đã tồn tại trong hệ thống, vui lòng kiểm tra lại.`
        },

        /**
         * Account Resources
         */
        DeleteParentAccount: {
            title: 'Xóa không thành công',
            message: 'Bạn phải xóa tất cả các tài khoản con trước khi xóa tài khoản cha.'
        },
        DeleteAccount: {
            title: 'Xóa tài khoản',
            message: (accountNumber) =>
                `Bạn có thực sự muốn xóa Tài khoản <${accountNumber}> đã chọn không?`
        },

        UsingParentAccount: {
            title: '',
            message: 'Bạn có muốn thiết lập trạng thái "Sử dụng" cho tất cả Tài khoản con không?"'
        },

        UsingAccount: {
            title: '',
            message:
                'Tài khoản cha đang ở trạng thái "Ngừng sử dụng". Bạn không thể thiết lập trạng thái "Sử dụng" cho Tài khoản con.'
        },

        /**
         * Payment Resources
         */
        DeletePayment: {
            title: 'Xóa chứng từ',
            message: (accountNumber) =>
                `Bạn có chắc chắn muốn xóa chứng từ <${accountNumber}> không?`
        },
        DeleteMultiplePayments: {
            title: '',
            message: 'Bạn có muốn xóa những chứng từ này không?'
        }
    },
    EN: {
        DeleteEmployee: {
            title: 'Delete Employee',
            message: (employeeCode) => `Are you sure you want to delete employee <${employeeCode}>?`
        },
        DeleteMultipleEmployees: {
            title: 'Delete Selected Employees?',
            message: 'The selected employees will be permanently deleted.'
        },
        SaveChanges: {
            title: 'Save Changes',
            message: 'Data has been changed. Do you want to store?'
        },
        Validate: {
            title: 'Input Error'
        },
        DuplicatedEmployeeCode: {
            title: 'Duplicate Data',
            message: (employeeCode) =>
                `Employee code <${employeeCode}> already exists in the system. Please check again.`
        },
        GlobalError: {
            title: 'Error'
        }
    }
};

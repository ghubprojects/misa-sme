import { EmployeeFields } from "./enum";

export const columnInfos = [
    {
        name: 'employee-check',
        width: 19
    },
    {
        name: 'employee-code',
        property: EmployeeFields.EmployeeCode,
        width: 140,
        minWidth: 52
    },
    {
        name: 'full-name',
        property: EmployeeFields.FullName,
        width: 220,
        minWidth: 140
    },
    {
        name: 'gender',
        property: EmployeeFields.Gender,
        width: 100,
        minWidth: 24
    },
    {
        name: 'date-of-birth',
        property: EmployeeFields.DateOfBirth,
        width: 140,
        minWidth: 80
    },
    {
        name: 'identity-number',
        property: EmployeeFields.IdentityNumber,
        title: 'Số chứng minh nhân dân',
        width: 140,
        minWidth: 100
    },
    {
        name: 'position-name',
        property: EmployeeFields.PositionName,
        width: 220,
        minWidth: 200
    },
    {
        name: 'department-name',
        property: EmployeeFields.DepartmentName,
        width: 220,
        minWidth: 120
    },
    {
        name: 'bank-account',
        property: EmployeeFields.BankAccount,
        width: 140,
        minWidth: 120
    },
    {
        name: 'bank-name',
        property: EmployeeFields.BankName,
        width: 220,
        minWidth: 140
    },
    {
        name: 'bank-branch',
        property: EmployeeFields.BankBranch,
        title: 'Chi nhánh tài khoản ngân hàng',
        width: 220,
        minWidth: 120
    },
]

export const table =
{
    INIT_RECORD_PER_PAGE: 20,
    INIT_OFFSET_VALUE: 0,
    INIT_CURRENT_PAGE: 1,
    // các cột được cố định khi scroll
    fixedColumns: ['employee-check', 'employee-code', 'full-name'],
    // số bản ghi mỗi trang
    recordsPerPage: [10, 20, 30, 50, 100],

    /**
     * Định dạng danh sách trang hiển thị theo trang hiện tại và tổng số trang
     * @param {int} currentPage trang hiện tại
     * @param {int} totalPages tổng số trang
     * @returns Danh sách trang đã được định dạng
     * Created by: ttanh (06/09/2023)
     */
    generatePageNumbers: (currentPage, totalPages) => {
        // số trang hiển thị bên trái, ở giữa, bên phải
        const visibleLeftPages = 3
        const visibleMiddlePages = 3
        const visibleRightPages = 3

        // trang đầu, trang cuối
        const startPage = 1;
        const endPage = totalPages

        // mảng lưu trữ các trang bên trái, ở giữa, bên phải
        const leftPages = [startPage];
        const middlePages = [];
        const rightPages = [endPage];

        const isHandlingLeftPages = currentPage < visibleLeftPages
        const isHandlingMiddlePages = currentPage >= visibleLeftPages && currentPage <= endPage - visibleRightPages
        const isHandlingRightPages = currentPage > endPage - visibleRightPages && currentPage <= endPage

        // nếu số trang nhỏ hơn visibleLeftPages, thêm vào leftPages và trả về
        if (totalPages <= visibleLeftPages) {
            for (let i = startPage + 1; i <= totalPages; i++) {
                leftPages.push(i)
            }
            return leftPages
        }

        if (isHandlingLeftPages) {
            for (let i = startPage + 1; i <= visibleLeftPages; i++) {
                leftPages.push(i)
            }
        } else if (isHandlingMiddlePages) {
            for (let i = currentPage; i <= currentPage + visibleMiddlePages - 1; i++) {
                middlePages.push(i)
            }
        } else if (isHandlingRightPages) {
            for (let i = endPage - 1; i > endPage - visibleRightPages; i--) {
                rightPages.unshift(i)
            }
        }

        return [leftPages, middlePages.length ? ['...', ...middlePages, '...'] : ['...'], rightPages].flat()
    }
}

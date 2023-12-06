import { useDateFormatStore } from '@/stores';
import { DateFormatList, EmployeeFields, Gender } from './enum';

/**
 * Convert dữ liệu nhân viên sang DTO
 * Created by: ttanh (28/09/2023)
 */
export const EmployeeToDtoConverter = {
    convertDate: (date) => {
        const DateFormat = useDateFormatStore();

        if (!date) return null;

        // local time
        let convertedDate;
        const dateArray = date.split('/').map(Number);
        switch (DateFormat.current) {
            case DateFormatList.DMY:
                convertedDate = new Date(dateArray[2], dateArray[1] - 1, dateArray[0]);
                break;

            case DateFormatList.MDY:
                convertedDate = new Date(dateArray[2], dateArray[0] - 1, dateArray[1]);
                break;

            case DateFormatList.YMD:
                convertedDate = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
                break;
        }

        // convert to UTC
        const localMinutes = convertedDate.getMinutes();
        const timezoneOffsetMinutes = convertedDate.getTimezoneOffset();
        convertedDate.setMinutes(localMinutes - timezoneOffsetMinutes);

        return convertedDate;
    },
    convertGender: (gender) => (gender === '' ? Gender.Male : gender)
};

/**
 * Convert DTO sang dữ liệu nhân viên
 * Created by: ttanh (28/09/2023)
 */
export const ResponseToDataConverter = {
    convertDate: (date) => {
        const DateFormat = useDateFormatStore();

        if (!date) return '';

        const inputDate = new Date(date);
        const day = inputDate.getDate().toString().padStart(2, '0');
        const month = (inputDate.getMonth() + 1).toString().padStart(2, '0');
        const year = inputDate.getFullYear().toString();

        switch (DateFormat.current) {
            case DateFormatList.DMY:
                return `${day}/${month}/${year}`;
            case DateFormatList.MDY:
                return `${month}/${day}/${year}`;
            case DateFormatList.YMD:
                return `${year}/${month}/${day}`;
            default:
                return '';
        }
    },
    convertCurrency: (amount) => {
        const formatter = new Intl.NumberFormat('vi', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0
        });

        const formattedAmount = formatter.format(amount);
        return formattedAmount.replace(/[^\d.-]/g, '');
    }
};

/**
 * Chuyển đổi từ DTO thành dữ liệu nhân viên và in ra dữ liệu.
 * @param {object} employeeDto - Đối tượng DTO của nhân viên.
 * @returns {object} - Đối tượng dữ liệu nhân viên sau khi chuyển đổi.
 * Created by: ttanh (01/10/2023)
 */
export const getEmployeeFromDto = (employeeDto) => {
    console.log(employeeDto);
    const result = { ...employeeDto };

    result[EmployeeFields.DateOfBirth] = DtoToEmployeeConverter.convertDate(
        employeeDto[EmployeeFields.DateOfBirth]
    );
    result[EmployeeFields.IdentityIssuedDate] = DtoToEmployeeConverter.convertDate(
        employeeDto[EmployeeFields.IdentityIssuedDate]
    );

    return result;
};

/**
 * Chuyển đổi từ dữ liệu nhân viên thành DTO tạo mới và in ra dữ liệu.
 * @param {object} employee - Đối tượng dữ liệu nhân viên.
 * @returns {object} - Đối tượng DTO của nhân viên sau khi chuyển đổi.
 * Created by: ttanh (01/10/2023)
 */
export const getCreateDtoFromEmployee = (employee) => {
    const createDto = { ...employee };
    delete createDto[EmployeeFields.EmployeeID];
    createDto[EmployeeFields.DateOfBirth] = EmployeeToDtoConverter.convertDate(
        employee[EmployeeFields.DateOfBirth]
    );
    createDto[EmployeeFields.IdentityIssuedDate] = EmployeeToDtoConverter.convertDate(
        employee[EmployeeFields.IdentityIssuedDate]
    );
    createDto[EmployeeFields.Gender] = EmployeeToDtoConverter.convertGender(
        employee[EmployeeFields.Gender]
    );
    console.log('create dto:', createDto);
    return createDto;
};

/**
 * Chuyển đổi từ dữ liệu nhân viên thành DTO cập nhật và in ra dữ liệu.
 * @param {object} employee - Đối tượng dữ liệu nhân viên.
 * @returns {object} - Đối tượng DTO cập nhật của nhân viên sau khi chuyển đổi.
 * Created by: ttanh (01/10/2023)
 */
export const getUpdateDtoFromEmployee = (employee) => {
    const updateDto = { ...employee };
    updateDto[EmployeeFields.DateOfBirth] = EmployeeToDtoConverter.convertDate(
        employee[EmployeeFields.DateOfBirth]
    );
    updateDto[EmployeeFields.IdentityIssuedDate] = EmployeeToDtoConverter.convertDate(
        employee[EmployeeFields.IdentityIssuedDate]
    );
    console.log('update dto:', updateDto);
    return updateDto;
};

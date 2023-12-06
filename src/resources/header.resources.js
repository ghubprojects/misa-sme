import { HeaderContextMenu } from "@/utils/enum";

export const HeaderResources = {
    VI: {
        BranchName: "Công ty Cổ phần MISA",
        UserName: "Tăng Thế Anh",
        ContextMenu: {
            [HeaderContextMenu.DateFormat]: 'Định dạng thời gian',
            [HeaderContextMenu.Language]: 'Ngôn ngữ'
        }
    },
    EN: {
        BranchName: "MISA Joint Stock Company",
        ContextMenu: {
            [HeaderContextMenu.DateFormat]: 'Date format',
            [HeaderContextMenu.Language]: 'Language'
        }
    }
}
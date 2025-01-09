export const adminMenu = [
    { //Quản lý người dùng
        name: 'menu.admin.user',
        menus: [
            {
                name: 'menu.admin.manage-doctor', link: '/system/manage-doctor'
                // subMenus: [
                //     { name: 'menu.system.system-administrator.user-manage', link: '/system/user-manage' },
                //     { name: 'menu.system.system-administrator.user-redux', link: '/system/user-redux' },
                // ]
            },
            // {
            //     name: 'menu.admin.manage-admin', link: '/system/user-admin'
            // },
            // {
            //     name: 'menu.admin.crud', link: '/system/user-manage'
            // },
            {
                name: 'menu.admin.manage-user', link: '/system/user-redux'
            }
            ,
            {
                name: 'menu.doctor.manage-schedule', link: '/doctor/manage-schedule'
            },
            {
                name: 'menu.doctor.manage-patient', link: '/doctor/manage-patient'
            }
        ]

    },
    { //Quản lý phòng khám
        name: 'menu.admin.clinic', menus: [
            {
                name: 'menu.admin.manage-clinic', link: '/system/manage-clinic'
            }
        ]

    },
    { //Quản lý chuyên khoa
        name: 'menu.admin.specialty', menus: [
            {
                name: 'menu.admin.manage-specialty', link: '/system/manage-specialty'
            }
        ]

    },
    { //Quản lý tin tức
        name: 'menu.admin.news',
        menus: [
            {
                name: 'menu.admin.manage-news', link: '/system/manage-news'
            }
        ]

    }
    ,
    { //Quản lý tin tức
        name: 'menu.admin.analyst', menus: [
            {
                name: 'menu.admin.dash-board', link: '/system/show-dashboard'
            }
        ]

    }
    ,
    { //Quản lý thuốc
        name: 'menu.admin.medicine', menus: [
            {
                name: 'menu.admin.manage-medicine', link: '/system/manage-medicine',
            },
            // {
            //     name: 'menu.admin.manage-type-medicine', link: '/system/manage-type-medicine'
            // }
        ]

    },
    { //Quản lý hóa đơn
        name: 'menu.admin.invoice', menus: [
            {
                name: 'menu.doctor.list-invoice', link: '/doctor/manage-invoice'
            }
        ]

    }
];

export const doctorMenu = [
    { //Quản lý lịch khám
        name: 'menu.admin.manage-user',
        menus: [
            {
                name: 'menu.doctor.manage-schedule', link: '/doctor/manage-schedule'
            },
            {
                name: 'menu.doctor.manage-patient', link: '/doctor/manage-patient'
            }
        ]

    }, {
        name: 'menu.doctor.manage-invoice',
        menus: [
            {
                name: 'menu.doctor.list-invoice', link: '/doctor/manage-invoice'
            }
        ]
    }
    ,
    {
        name: 'menu.admin.news',
        menus: [
            {
                name: 'menu.admin.manage-news', link: '/system/manage-news'
            }
        ]
    }
];
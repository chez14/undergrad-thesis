export let entityRules = {
    exams: {
        name: "Exam",
        apiPath: "manage/exam",
        fields: {
            _id: { type: "number", name: "id", note: "", allow: { create: false, update: false } },
            lecture: { type: "link", name: "Lecture", table: "lecture", link_label: "name", note: "", allow: { create: true, update: true } },
            lecture_period: { type: "link", name: "Lecture Period", table: "lectureperiods", link_label: "period_code", note: "", allow: { create: true, update: true } },
            time_start: { type: "text", name: "Exam Start", note: "", allow: { create: true, update: true } },
            time_duration: { type: "number", name: "Exam Duration", note: "", allow: { create: true, update: true } },
            time_opened: { type: "text", name: "Timer Open", note: "", allow: { create: false, update: false } },
            time_ended: { type: "text", name: "Timer End", note: "", allow: { create: false, update: false } },
            uts: { type: "text", name: "UTS", note: "", allow: { create: true, update: true } },
            shift: { type: "text", name: "SHIFT", note: "", allow: { create: true, update: true } },
        },
        list_display: ["_id", "lecture:name", "lecture_period:period_code", "time_start", "uts", "shift", "updated_on"]
    },
    lectureperiods: {
        name: "Lecture Periodes",
        apiPath: "manage/lectureperiod",
        fields: {
            _id: { type: "number", name: "id", note: "", allow: { create: false, update: false } },
            period_code: { type: "text", name: "Period Code", allow: { create: true, update: true } }
        },
        list_display: ["_id", "name", "lecture_code", "updated_on"]
    },
    lecture: {
        name: "Lecture",
        apiPath: "manage/lecture",
        fields: {
            _id: { type: "number", name: "id", note: "", allow: { create: false, update: false } },
            name: { type: "text", name: "Name", note: "", allow: { create: true, update: true } },
            lecture_code: { type: "text", name: "Lecture Code", allow: { create: true, update: true } }
        },
        list_display: ["_id", "name", "lecture_code", "updated_on"]
    },
    iplogins: {
        name: "IP Login",
        apiPath: "manage/iplogin",
        fields: {
            _id: { type: "number", name: "id", note: "", allow: { create: false, update: false } },
            ip: { type: "text", name: "IP", allow: { create: true, update: true } },
            user: { type: "link", name: "User", table: "admins", link_label: "username", allow: { create: true, update: true } },
            notes: { type: "text", name: "Notes", allow: { create: true, update: true } },
            locations: { type: "links", name: "Linked Location(s)", table: "locations", link_label: "room_name", allow: { create: true, update: true } },
        },
        list_display: ["_id", "ip", "user:username", "notes"]
    },
    lectureperiod: {
        name: "Lecture Period",
        apiPath: "manage/lectureperiod",
        fields: {
            _id: { type: "number", name: "id", note: "", allow: { create: false, update: false } },
            period_code: { type: "text", allow: { create: true, update: true } },
        },
        list_display: ["_id", "period_code", "updated_on"]
    },
    computers: {
        name: "Computers",
        apiPath: "manage/computer",
        fields: {
            _id: { type: "number", name: "id", note: "", allow: { create: false, update: false } },
            name: { type: "text", allow: { create: true, update: true } },
            ip: { type: "text", allow: { create: true, update: true } },
            reverse_dns: { type: "text", allow: { create: true, update: true } },
            d_pos: { type: "json", allow: { create: true, update: true } },
            location: { type: "link", table: "locations", link_label: "room_name", allow: { create: true, update: true } },
        },
        list_display: ["_id", "name", "ip", "location:room_name", "updated_on"]
    },
    locations: {
        name: "Location",
        apiPath: "manage/location",
        fields: {
            _id: { type: "number", name: "id", note: "", allow: { create: false, update: false } },
            room_name: { type: "text", allow: { create: true, update: true } },
            name_alias: { type: "text", allow: { create: true, update: true } },
        },
        list_display: ["_id", "room_name", "name_alias", "updated_on"]
    },
    acls: {
        name: "Access Control List",
        apiPath: "manage/acl",
        fields: {
            _id: { type: "number", name: "id", note: "", allow: { create: false, update: false } },
            name: { type: "text", allow: { create: true, update: true } },
        },
        list_display: ["_id", "name"]
    },
    admins: {
        name: "Administrator",
        apiPath: "manage/user",
        fields: {
            _id: { type: "number", name: "id", note: "", allow: { create: false, update: false } },
            username: { type: "text", allow: { create: true, update: true } },
            password: { type: "password", allow: { create: true, update: true } },
            email: { type: "text", allow: { create: true, update: true } },
            acl: { type: "link", table: "acls", link_label: "name", allow: { create: true, update: true } },
        },
        list_display: ["_id", "username", "email", "acl:name", "updated_on"],
    },
}
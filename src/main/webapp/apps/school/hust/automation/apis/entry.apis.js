import CONFIG from "../configs/config";

const baseUrl = "/api/school/hust/automation/entries";

export default {
    async insert(params = { entry: {} }) {
        const url = baseUrl;
        const requestInfo = {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({
                data: params.entry,
            }),
        };
        return fetch(url, requestInfo).then((resp) => resp.json());
    },
    async insertAutoRegisterClasses(params = { entry: {} }) {
        // eslint-disable-next-line no-param-reassign
        params.entry.actionId = CONFIG.ACTION_IDS.AUTO_REGISTER_CLASSES;
        return this.insert(params);
    },
    async insertGetStudentTimetable(params = { entry: {} }) {
        // eslint-disable-next-line no-param-reassign
        params.entry.actionId = CONFIG.ACTION_IDS.GET_STUDENT_TIMETABLE;
        return this.insert(params);
    },
    async update(params = { entryId: "", entry: {} }) {
        const url = `${baseUrl}/${params.entryId}`;
        const requestInfo = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({
                data: params.entry,
            }),
        };
        return fetch(url, requestInfo).then((resp) => resp.json());
    },
    async cancel(params = { entryId: "", entry: {} }) {
        // eslint-disable-next-line no-param-reassign
        params.entry.status = "CANCELED";
        return this.update(params);
    },
    async find(params = { username: "", password: "" }) {
        const url = `${baseUrl}`;
        const requestInfo = {
            method: "GET",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                Authorization: `Basic ${window.btoa(`${params.username}:${params.password}`)}`,
            },
        };
        return fetch(url, requestInfo).then((resp) => resp.json());
    },
};

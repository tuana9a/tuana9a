const baseUrl = "/api/school/automation/entry";

export default {
    async insert(params = { entry: {} }) {
        const url = baseUrl;
        const requestInfo = {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify(params.entry),
        };
        return fetch(url, requestInfo).then((resp) => resp.json());
    },
    async insertAutoRegisterClasses(params = { entry: {} }) {
        // eslint-disable-next-line no-param-reassign
        params.entry.actionId = "autoRegisterClasses";
        return this.insert(params);
    },
    async insertGetStudentTimetable(params = { entry: {} }) {
        // eslint-disable-next-line no-param-reassign
        params.entry.actionId = "getStudentTimetable";
        return this.insert(params);
    },
    async update(params = { entryId: "", entry: {} }) {
        const url = `${baseUrl}/${params.entryId}`;
        const requestInfo = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify(params.entry),
        };
        return fetch(url, requestInfo).then((resp) => resp.json());
    },
    async cancel(params = { entryId: "", entry: {} }) {
        // eslint-disable-next-line no-param-reassign
        params.entry.status = "CANCELED";
        return this.update(params);
    },
};
const baseUrl = "/api/school/hust/register-preview/classes";

export default {
    async find(params = { semester: "", classIds: [], method: "match" }) {
        const classIds = params.classIds.join(",");
        const query = `method=${params.method}&semester=${params.semester}&classIds=${classIds}`;
        const url = `${baseUrl}?${query}`;
        return fetch(url).then((resp) => resp.json());
    },
    async findWithMatch(params = { semester: "", classIds: [] }) {
        // eslint-disable-next-line no-param-reassign
        params.method = "match";
        return this.find(params);
    },
    async findByRange(params = { semester: "", classIds: [] }) {
        // eslint-disable-next-line no-param-reassign
        params.method = "range";
        return this.find(params);
    },
    async insert(params = { semester: "", secret: "", file: false }) {
        const query = `semester=${params.semester}`;
        const url = `${baseUrl}?${query}`;
        const formData = new FormData();
        formData.append("file", params.file);
        const requestInfo = {
            method: "POST",
            headers: {
                secret: params.secret,
            },
            body: formData,
        };
        return fetch(url, requestInfo).then((resp) => resp.json());
    },
    async delete(params = { semester: "", secret: "" }) {
        const query = `semester=${params.semester}`;
        const url = `${baseUrl}?${query}`;
        const requestInfo = {
            method: "DELETE",
            headers: {
                secret: params.secret,
            },
        };
        return fetch(url, requestInfo).then((resp) => resp.json());
    },
};

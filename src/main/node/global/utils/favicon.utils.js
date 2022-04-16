module.exports = {
    createFaviconUrl(token) {
        const encodeValue = Buffer.from(token).toString("hex");
        return `https://avatars.dicebear.com/api/identicon/${encodeValue}.svg`;
    },
};

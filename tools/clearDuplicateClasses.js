const mongodb = require("mongodb");
const dotenv = require("dotenv");

dotenv.config();

async function main() {
    const client = await new mongodb.MongoClient(process.env.MONGODB_CONNECTION_STRING).connect();
    const collection = client.db(process.env.MONGODB_DATABASE_NAME).collection("school.classes");
    const cursor = collection.find();
    // eslint-disable-next-line no-await-in-loop
    while (await cursor.hasNext()) {
        // eslint-disable-next-line no-await-in-loop
        const schoolClass = await cursor.next();
        const MaLop = schoolClass.MaLop;
        const BuoiHocSo = schoolClass.BuoiHocSo;
        const classes = await collection.find({ MaLop, BuoiHocSo }).sort({ created: -1 }).limit(1).toArray();
        const newestClassCreated = classes[0].created;
        await collection.deleteMany({ MaLop, BuoiHocSo, created: { $ne: newestClassCreated } });
    }
}

main();

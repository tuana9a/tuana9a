/* eslint-disable no-console */
/* eslint-disable object-curly-newline */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const mongodb = require("mongodb");
const config = require("./config.local");

async function main() {
    const client = await new mongodb.MongoClient(config.connectionString).connect();
    const db = client.db(config.databaseName);
    const collection = db.collection(config.schoolClassCollectionName);
    const cursor = collection.find();
    const ids = new Set();

    while (await cursor.hasNext()) {
        const schoolClass = await cursor.next();
        const { MaLop, BuoiHocSo, semester } = schoolClass;
        ids.add(`${semester}-${MaLop}-${BuoiHocSo}`);
    }

    for (const id of ids) {
        const [p1, p2, p3] = id.split("-");
        const semester = p1;
        const MaLop = parseInt(p2);
        const BuoiHocSo = parseInt(p3);
        const newestClass = (await collection.find({
            MaLop,
            BuoiHocSo,
            semester,
        }).sort({ created: -1 }).limit(1).toArray())[0];
        const newestClassCreated = newestClass.created;
        const deleteResult = await collection.deleteMany({
            MaLop,
            BuoiHocSo,
            semester,
            created: { $ne: newestClassCreated },
        });
        const deleteCount = deleteResult.deletedCount;
        if (deleteCount > 0) console.log(`${id}: ${deleteCount}`);
    }

    console.log("done");
}

main();

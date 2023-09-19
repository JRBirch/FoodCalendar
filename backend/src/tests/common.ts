import { disconnectDB, dropDatabase } from "../db/connect";

const tearDownDb = async () => {
  await dropDatabase();
  return disconnectDB();
};

export {tearDownDb};

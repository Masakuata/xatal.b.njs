import * as process from 'process';
import { Collection, Db, Document, MongoClient, ObjectId } from 'mongodb';

export class MongoHandler {
  private static readonly connString: string =
    'mongodb+srv://<username>:<password>@netherite.4zr0v.mongodb.net/?retryWrites=true&w=majority'
      .replace('<username>', process.env.MONGO_USER)
      .replace('<password>', process.env.MONGO_PASSWORD);

  private static readonly client = new MongoClient(MongoHandler.connString);
  public collection: Collection = null;
  private database: Db = null;

  constructor(database: string, collection: string) {
    this.database = MongoHandler.client.db(database);
    this.collection = this.database.collection(collection);
  }

  public setDatabase(database: string): void {
    this.database = MongoHandler.client.db(database);
  }

  public setCollection(collection: string): void {
    this.collection = this.database.collection(collection);
  }

  public async findById(id: string) {
    await MongoHandler.client.connect();
    const result = await this.collection.findOne(new ObjectId(id));
    await MongoHandler.client.close();
    return result;
  }

  public async findOne(filter: Document) {
    await MongoHandler.client.connect();
    const result = await this.collection.findOne(filter);
    await MongoHandler.client.close();
    return result;
  }

  public async findMany(filter: Document) {
    await MongoHandler.client.connect();
    const result = this.collection.find(filter);
    await MongoHandler.client.close();
    return result;
  }

  public async insertOne(value: Document): Promise<Document | null> {
    await MongoHandler.client.connect();
    const result = await this.collection.insertOne(value);
    await MongoHandler.client.close();
    if (result.insertedId !== null) {
      return value;
    }
    return null;
  }

  public async count(filter: Document): Promise<number> {
    await MongoHandler.client.connect();
    const count = await this.collection.countDocuments(filter);
    await MongoHandler.client.close();
    return count;
  }

  public async updateOne(filter: Document, updatedData: Document) {
    await MongoHandler.client.connect();
    const result = await this.collection.updateOne(
      filter,
      { $set: { updatedData } },
      { upsert: true });
    await MongoHandler.client.close();
    return result.upsertedCount > 0;
  }

  public async updateMany(filter: Document, updatedData: Document) {
    await MongoHandler.client.connect();
    const result = await this.collection.updateMany(
      filter,
      { $set: { updatedData } });
    await MongoHandler.client.close();
    return result.upsertedCount > 0;
  }

  public async deleteById(id: string) {
    await MongoHandler.client.connect();
    const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
    await MongoHandler.client.close();
    return result.deletedCount > 0;
  }

  public async deleteOne(filter: Document) {
    await MongoHandler.client.connect();
    const result = await this.collection.deleteOne(filter);
    await MongoHandler.client.close();
    return result.deletedCount > 0;
  }

  public async deleteMany(filter: Document) {
    await MongoHandler.client.connect();
    const result = await this.collection.deleteMany(filter);
    await MongoHandler.client.close();
    return result.deletedCount > 0;
  }
}

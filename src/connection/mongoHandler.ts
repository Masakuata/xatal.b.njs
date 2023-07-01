import * as process from 'process';
import { Collection, Db, Document, MongoClient, ObjectId } from 'mongodb';

export class MongoHandler {
  private static readonly connString: string = process.env.MONGO_URL
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
    return await this.collection.findOne(new ObjectId(id));
  }

  public async findOne(filter: Document) {
    return await this.collection.findOne(filter);
  }

  public async findMany(filter: Document) {
    return this.collection.find(filter);
  }

  public async insertOne(value: Document): Promise<Document | null> {
    const result = await this.collection.insertOne(value);
    if (result.insertedId !== null) {
      return value;
    }
    return null;
  }

  public async count(filter: Document): Promise<number> {
    return await this.collection.countDocuments(filter);
  }

  public async updateById(id: string, updatedData: Document): Promise<boolean> {
    const result = await this.collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedData });
    return result.modifiedCount > 0;
  }

  public async updateOne(filter: Document, updatedData: Document): Promise<boolean> {
    const result = await this.collection.updateOne(
      filter,
      { $set: updatedData },
      { upsert: false });
    return result.modifiedCount > 0;
  }


  public async updateMany(filter: Document, updatedData: Document) {
    const result = await this.collection.updateMany(
      filter,
      { $set: { updatedData } });
    return result.upsertedCount > 0;
  }

  public async deleteById(id: string) {
    const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  public async deleteOne(filter: Document) {
    const result = await this.collection.deleteOne(filter);
    return result.deletedCount > 0;
  }

  public async deleteMany(filter: Document) {
    const result = await this.collection.deleteMany(filter);
    return result.deletedCount > 0;
  }
}

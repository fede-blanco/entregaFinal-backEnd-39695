
export class MongooseManager {
  db
  constructor(db) {
    this.db = db
  }

  async add(data){
    return await this.db.create(data)
  }

  async obtainById(id){
    return await this.db.findOne({_id: id})
  }

  async obtainAll(){
    return await this.db.find();
  }
}
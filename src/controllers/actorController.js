import dbService from '../services/dbService.js';

class ActorController {
    async getAwardWinners(n) {
      const db = await dbService.connect();
      return db.collection('actors').find({"awards.name": "Oscar Award"}).toArray();
    }
  
    async getTotalAwardsPerActor() {
      const db = await dbService.connect();
      return db.collection('actors').aggregate([
        { $unwind: "$awards" },
        { $group: {
          _id: "$_id",
          name: { $first: "$name" },
          totalAwards: { $sum: 1 }
        }},
        { $sort: { totalAwards: -1 }}
      ]).toArray();
    }
  
    async getActorsBornAfter1980() {
      const db = await dbService.connect();
      return db.collection('actors').find({
        birthdate: { $gt: new Date("1980-12-31") }
      }).toArray();
    }
  
    async getMostAwardedActor() {
      const db = await dbService.connect();
      const result = await db.collection('actors').aggregate([
        {
          '$unwind': '$awards'
        }, {
          '$group': {
            '_id': '$_id', 
            'full_name': {
              '$first': '$full_name'
            }, 
            'award_count': {
              '$sum': 1
            }
          }
        }, {
          '$sort': {
            'award_count': -1
          }
        }, {
          '$limit': 1
        }
      ]);
      return result;
    }
  
    async getTotalActors() {
      const db = await dbService.connect();
      return db.collection('actors').countDocuments();
    }
  
    async getAverageActorAge() {
      const db = await dbService.connect();
      const result = await db.collection('actors').aggregate([
        {
          $group: {
            _id: null,
            avgAge: {
              $avg: {
                $divide: [
                  { $subtract: [new Date(), "$birthdate"] },
                  (365 * 24 * 60 * 60 * 1000)
                ]
              }
            }
          }
        }
      ]).toArray();
      return result[0]?.avgAge || 0;
    }
  
    async getActorsWithInstagram() {
      const db = await dbService.connect();
      return db.collection('actors').find({ "social_media.instagram": { $exists: true, $ne: "" } }).toArray();
    }
  
    async getActorsWithAwardsAfter2015() {
      const db = await dbService.connect();
      return db.collection('actors').find({
        "awards.year": { $gt: 2015 }
      }).toArray();
    }
  
    async getActorById(actorId) {
      const db = await dbService.connect();
      return db.collection('actors').findOne({ _id: actorId });
    }
  
    async updateActorSocialMedia(actorId, socialMedia) {
      const db = await dbService.connect();
      return db.collection('actors').updateOne(
        { _id: actorId },
        { $set: { social_media: socialMedia } }
      );
    }
  
    async addAwardToActor(actorId, award) {
      const db = await dbService.connect();
      return db.collection('actors').updateOne(
        { _id: actorId },
        { $push: { awards: award } }
      );
    }
  
    async getActorsByAwardType(awardName) {
      const db = await dbService.connect();
      return db.collection('actors').find({ "awards.name": awardName }).toArray();
    }
  
    async getTopNMostAwardedActors(n) {
      const db = await dbService.connect();
      return db.collection('actors').aggregate([
        { $unwind: "$awards" },
        { $group: {
          _id: "$_id",
          name: { $first: "$name" },
          totalAwards: { $sum: 1 }
        }},
        { $sort: { totalAwards: -1 }},
        { $limit: n }
      ]).toArray();
    }
  }

export default new ActorController();
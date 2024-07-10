import dbService from '../services/dbService.js';

class movieController {
    async getTotalDVDCopies() {
      const db = await dbService.connect();
      const result = await db.collection('movies').aggregate([
        { $unwind: '$format' },
        { $match: { 'format.name': 'DVD' } },
        {
          $group: {
            _id: null,
            totalDVDs: { $sum: '$format.copies' }
          }
        },
        { $project: { _id: 0, totalDVDs: 1 } }
      ]).toArray();
      return result[0]?.totalDVDs || 0;
    }
  
    async getDistinctGenres() {
      const db = await dbService.connect();
      return db.collection('movies').distinct("genre");
    }
  
    async getMoviesByActorId(actorId) {
      const db = await dbService.connect();
      return db.collection('movies').find({"character.id_actor": actorId}).toArray();
    }
  
    async getTotalDVDValue() {
      const db = await dbService.connect();
      const result = await db.collection('movies').aggregate([ 
        {$match:{"format.name": "dvd"}}, 
        {$unwind: "$format"}, 
        {$match: {"format.name": "dvd"}}, 
        {$group: 
         { _id: null,
          totalValue: {$sum: "$format.value"} 
         }
        }
      ]).toArray();
      return result[0]?.totalValue || 0;
    }
  
    async getMoviesByActorName(actorName) {
      const db = await dbService.connect();
      return db.collection('movies').aggregate([
        {
          $lookup: {
            from: "actors",
            localField: "character.id_actor",
            foreignField: "_id",
            as: "actor_info"
          }
        },
        { $unwind: "$actor_info" },
        {
          $match: {
            "actor_info.name": actorName
          }
        },
        {
          $project: {
            _id: 1,
            name: 1,
            "actor_info.name": 1,
            "actor_info.birthdate": 1
          }
        }
      ]).toArray();
    }
  
    async getMoviesWithPrincipalActors() {
      const db = await dbService.connect();
      return db.collection('movies').find({ "character.role": "Principal" }).toArray();
    }
  
    async getTotalMovieAwards() {
      const db = await dbService.connect();
      const result = await db.collection('movies').aggregate([
        { $unwind: "$awards" },
        { $group: {
          _id: null,
          totalAwards: { $sum: 1 }
        }}
      ]).toArray();
      return result[0]?.totalAwards || 0;
    }
  
    async getMoviesByActorNameAndFormat(actorName, format) {
      const db = await dbService.connect();
      return db.collection('movies').aggregate([
        { $lookup: {
          from: "actors",
          localField: "character.id_actor",
          foreignField: "_id",
          as: "actor_info"
        }},
        { $unwind: "$actor_info" },
        { $match: {
          "actor_info.name": actorName,
          "format.name": format
        }},
        { $project: {
          _id: 1,
          name: 1,
          "actor_info.name": 1,
          format: 1
        }}
      ]).toArray();
    }
  
    async getSciFiMoviesByActorId(actorId) {
      const db = await dbService.connect();
      return db.collection('movies').find({
        "character.id_actor": actorId,
        "genre": "Ciencia Ficción"
      }).toArray();
    }
  
    async getMovieWithMostDVDCopies() {
      const db = await dbService.connect();
      const result = await db.collection('movies').aggregate([
        { $unwind: '$format' },
        { $match: { 'format.name': 'DVD' } },
        { $sort: { 'format.copies': -1 } },
        { $limit: 1 }
      ]).toArray();
      return result[0];
    }
  
    async getTotalBluRayValue() {
      const db = await dbService.connect();
      const result = await db.collection('movies').aggregate([
        { $unwind: "$format" },
        { $match: { "format.name": "Blu-ray" }},
        { $group: {
          _id: null,
          totalValue: { $sum: { $multiply: ["$format.copies", "$format.value"] }}
        }}
      ]).toArray();
      return result[0]?.totalValue || 0;
    }
  
    async addNewMovie(movieData) {
      const db = await dbService.connect();
      return db.collection('movies').insertOne(movieData);
    }
  
    async updateMovieFormat(movieId, newFormat) {
      const db = await dbService.connect();
      return db.collection('movies').updateOne(
        { _id: movieId },
        { $push: { format: newFormat } }
      );
    }
  
    async getMoviesByGenre(genre) {
      const db = await dbService.connect();
      return db.collection('movies').find({ genre: genre }).toArray();
    }
  
    async getTopNMoviesByAwards(n) {
      const db = await dbService.connect();
      return db.collection('movies').aggregate([
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
  

export default new movieController();
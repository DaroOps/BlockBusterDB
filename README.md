# Consultas Blockbuster

1. **Contar el número total de copias de DVD disponibles en todos los registros:**

   ```javascript
   db.getCollection('movies').aggregate(
     [
       { $unwind: '$format' },
       { $match: { 'format.name': 'DVD' } },
       {
         $group: {
           _id: null,
           totalDVDs: { $sum: '$format.copies' }
         }
       },
       { $project: { _id: 0, totalDVDs: 1 } }
     ],
     { maxTimeMS: 60000, allowDiskUse: true }
   );
   ```

2. **Encontrar todos los actores que han ganado premios Oscar:**

   ```javascript
   db.actors.find({"awards.name": "Oscar Award"})
   ```

3. **Encontrar la cantidad total de premios que ha ganado cada actor:**

   ```javascript
   db.actors.aggregate([
     { $unwind: "$awards" },
     { $group: {
       _id: "$_id",
       name: { $first: "$name" },
       totalAwards: { $sum: 1 }
     }},
     { $sort: { totalAwards: -1 }}
   ])
   ```

4. **Obtener todos los actores nacidos después de 1980:**

   ```javascript
   db.actors.find({
     birthdate: { $gt: new Date("1980-12-31") }
   })
   ```

5. **Encontrar el actor con más premios:**

   ```javascript
   db.actors.aggregate([
     { $unwind: "$awards" },
     { $group: {
       _id: "$_id",
       name: { $first: "$name" },
       totalAwards: { $sum: 1 }
     }},
     { $sort: { totalAwards: -1 }},
     { $limit: 1 }
   ])
   ```

6. **Listar todos los géneros de películas distintos:**

   ```javascript
   db.movies.distinct("genre")
   ```

7. **Encontrar películas donde el actor con id 1 haya participado:**

   ```javascript
   db.movies.find({"character.id_actor": 1})
   ```

8. **Calcular el valor total de todas las copias de DVD disponibles:**

   ```javascript
   db.movies.aggregate([ 
       {$match:{"format.name": "dvd"}}, 
       {$unwind: "$format"}, 
       {$match: {"format.name": "dvd"}}, 
       {$group: 
        { _id: null,
         totalValue: 
         	{
             $sum: "$format.value"\
           } 
        }
       }
   ])
   ```

9. **Encontrar todas las películas en las que John Doe ha actuado:**

   ```javascript
   db.movies.aggregate([
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
         "actor_info.name": "John Doe"
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
   ])
   ```

10. **Encontrar el número total de actores en la base de datos:**

    ```javascript
    db.actors.countDocuments()
    ```

11. **Encontrar la edad promedio de los actores en la base de datos:**

    ```javascript
    db.actors.aggregate([
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
    ])
    ```

12. **Encontrar todos los actores que tienen una cuenta de Instagram:**

    ```javascript
    db.actors.find({ "social_media.instagram": { $exists: true, $ne: "" } })
    ```

13. **Encontrar todas las películas en las que participan actores principales:**

    ```javascript
    db.movies.find({ "character.role": "Principal" })
    ```

14. **Encontrar el número total de premios que se han otorgado en todas las películas:**

    ```javascript
    db.movies.aggregate([
      { $unwind: "$awards" },
      { $group: {
        _id: null,
        totalAwards: { $sum: 1 }
      }}
    ])
    ```

15. **Encontrar todas las películas en las que John Doe ha actuado y que estén en formato Blu-ray:**

    ```javascript
    db.movies.aggregate([
      { $lookup: {
        from: "actors",
        localField: "character.id_actor",
        foreignField: "_id",
        as: "actor_info"
      }},
      { $unwind: "$actor_info" },
      { $match: {
        "actor_info.name": "John Doe",
        "format.name": "Blu-ray"
      }},
      { $project: {
        _id: 1,
        name: 1,
        "actor_info.name": 1,
        format: 1
      }}
    ])
    ```

16. **Encontrar todas las películas de ciencia ficción que tengan al actor con id 3:**

    ```javascript
    db.movies.find({
      "character.id_actor": 3,
      "genre": "Ciencia Ficción"
    })
    ```

17. **Encontrar la película con más copias disponibles en formato DVD:**

    ```javascript
    db.getCollection('movies').aggregate(
      [
        { $unwind: '$format' },
        { $match: { 'format.name': 'DVD' } },
        { $sort: { 'format.copies': -1 } },
        { $limit: 1 }
      ],
      { maxTimeMS: 60000, allowDiskUse: true }
    );
    ```

18. **Encontrar todos los actores que han ganado premios después de 2015:**

    ```javascript
    db.actors.find({
      "awards.year": { $gt: 2015 }
    })
    ```

19. **Calcular el valor total de todas las copias de Blu-ray disponibles:**

    ```javascript
    db.movies.aggregate([
      { $unwind: "$format" },
      { $match: { "format.name": "Blu-ray" }},
      { $group: {
        _id: null,
        totalValue: { $sum: { $multiply: ["$format.copies", "$format.value"] }}
      }}
    ])
    ```

20. **Encontrar todas las películas en las que el actor con id 2 haya participado:**

    ```javascript
    db.movies.find({ "character.id_actor": 2 })
    ```


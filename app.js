
import dbService from './src/services/dbService.js';
import movieController from './src/controllers/movieController.js';
import actorController from './src/controllers/actorController.js';

async function main() {
    try {
        await dbService.connect();
        //actors querys
        console.log('Ganadores de Oscar:', await actorController.getOscarWinners());
        console.log('Total de premios por actor:', await actorController.getTotalAwardsPerActor());
        console.log('Actores nacidos después de 1980:', await actorController.getActorsBornAfter1980());
        console.log('Actor más premiado:', await actorController.getMostAwardedActor());
        console.log('Total de actores:', await actorController.getTotalActors());
        console.log('Edad promedio de actores:', await actorController.getAverageActorAge());
        console.log('Actores con Instagram:', await actorController.getActorsWithInstagram());
        console.log('Actores con premios después de 2015:', await actorController.getActorsWithAwardsAfter2015());

        const actorId = 1;
        console.log('Actor por ID:', await actorController.getActorById(actorId));

        await actorController.updateActorSocialMedia(actorId, { instagram: '@actor1' });
        console.log('Actor actualizado:', await actorController.getActorById(actorId));

        await actorController.addAwardToActor(actorId, { name: "Golden Globe", year: 2023 });
        console.log('Actor con nuevo premio:', await actorController.getActorById(actorId));

        console.log('Actores con Golden Globe:', await actorController.getActorsByAwardType("Golden Globe"));
        console.log('Top 5 actores más premiados:', await actorController.getTopNMostAwardedActors(5));


        // movies querys
        console.log('Total de copias de DVD:', await movieController.getTotalDVDCopies());
        console.log('Géneros distintos:', await movieController.getDistinctGenres());
        console.log('Películas del actor con ID 1:', await movieController.getMoviesByActorId(1));
        console.log('Valor total de DVDs:', await movieController.getTotalDVDValue());
        console.log('Películas de John Doe:', await movieController.getMoviesByActorName("John Doe"));
        console.log('Películas con actores principales:', await movieController.getMoviesWithPrincipalActors());
        console.log('Total de premios de películas:', await movieController.getTotalMovieAwards());
        console.log('Películas de John Doe en Blu-ray:', await movieController.getMoviesByActorNameAndFormat("John Doe", "Blu-ray"));
        console.log('Películas de ciencia ficción del actor con ID 3:', await movieController.getSciFiMoviesByActorId(3));
        console.log('Película con más copias de DVD:', await movieController.getMovieWithMostDVDCopies());
        console.log('Valor total de Blu-rays:', await movieController.getTotalBluRayValue());


        const newMovie = {
            name: "Nueva Película",
            genre: "Acción",
            format: [{ name: "DVD", copies: 1000, value: 15 }]
        };
        const insertResult = await movieController.addNewMovie(newMovie);
        console.log('Nueva película añadida:', insertResult);

        const movieId = insertResult.insertedId;
        const newFormat = { name: "Blu-ray", copies: 500, value: 25 };
        await movieController.updateMovieFormat(movieId, newFormat);
        console.log('Formato actualizado para la película');

        console.log('Películas de Acción:', await movieController.getMoviesByGenre("Acción"));
        console.log('Top 5 películas con más premios:', await movieController.getTopNMoviesByAwards(5));



    } catch (error) {
        console.error('Error:', error);
    } finally {
        await dbService.close();
    }
}

main();
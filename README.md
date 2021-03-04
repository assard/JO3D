# JO3D
Cette application est issu d'un projet que nous avons réalisés lors de notre 3ème année de cycle ingénieur à l'ENSG-Géomatique en spécialité Technologie des Systèmes d'Informations. 

Il s'agit d'une application interactive 3D pour les Jeux Olympiques de Paris 2024. Son objectif est de pouvoir visualiser des lieux qui seront utilisés lors des JO et avoir des informations dessus.

![Capture écran de l'application](../assets/screenshot_demo.png)

## Utilisation du projet

Pour utiliser le projet, rendez-vous au lien suivant : https://assard.github.io/

Pour voir une démonstration, rendez-vous au lien suivant : 

## Installation et utilisation du code source

1. Décompression des fichiers gltf

Les fichiers gltf étant volumineux, nous les avons placé dans un fichier compressé. Pour visualiser les modèles gltf, vous avez besoin de les décompresser avec la commande : 

    
    unzip public/data/gltf.zip -d ./public/data
    
Une meilleur pratique aurait été d'utiliser un serveur de données gltf et de le requêter pour récupérer ces modèles. Nous n'avons pas mis cela en place car ce n'était pas le coeur de notre projet.

2. Installation des dépendances et lancement du serveur

Ce projet a été réalisé avec les versions suivantes : 

- node 10
- npm 6

Pour installer les dépendances : 

    npm install

Pour lancer le serveur : 

    npm start



## Source de données 

- "Aviva Stadium" (https://skfb.ly/MQKU) by S.Gandini is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).

- "Tennis Court (Animation)" (https://skfb.ly/6CJ8J) by Anthony Yanez is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).

- "IGN_MNT_HIGHRES" (https://wxs.ign.fr/3ht7xcw6f7nciopo16etuqp2/geoportail/wmts ou https://geoservices.ign.fr/documentation/donnees-ressources-wfs.html#ressources-wfs-g%C3%A9oportail---bd-ortho-graphes-de-mosaiquage) par IGN (http://www.ign.fr/)

- "Ortho" (https://wxs.ign.fr/3ht7xcw6f7nciopo16etuqp2/geoportail/wmts ou https://geoservices.ign.fr/documentation/donnees-ressources-wfs.html#ressources-wfs-g%C3%A9oportail---bd-ortho-graphes-de-mosaiquage) par IGN (http://www.ign.fr/)

- "MNT_WORLD_SRTM3" (https://wxs.ign.fr/3ht7xcw6f7nciopo16etuqp2/geoportail/wmts ou https://geoservices.ign.fr/documentation/donnees-ressources-wfs.html#ressources-wfs-g%C3%A9oportail---bd-ortho-graphes-de-mosaiquage) par IGN (http://www.ign.fr/)


## Auteurs

- Axel CHASSARD - étudiant en cycle ingénieur à l'ENSG-Géomatique
- Clarisse DUCATILLION - étudiante en cycle ingénieur à l'ENSG-Géomatique
- Alex VAN HECKE - étudiant en cycle ingénieur à l'ENSG-Géomatique

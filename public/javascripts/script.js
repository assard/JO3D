// import * as THREE from 'https://unpkg.com/three/build/three.module.js';
// import { GLTFLoader } from 'https://unpkg.com/three/examples/jsm/loaders/GLTFLoader.js';

const viewerDiv = document.getElementById('viewerDiv');
const position = {
    coord: new itowns.Coordinates('EPSG:4326', 2.36,48.924444),
    range: 2000
};
const view = new itowns.GlobeView(viewerDiv, position);

const orthoSource = new itowns.WMTSSource({
    url: 'http://wxs.ign.fr/3ht7xcw6f7nciopo16etuqp2/geoportail/wmts',
    crs: 'EPSG:3857',
    name: 'ORTHOIMAGERY.ORTHOPHOTOS',
    tileMatrixSet: 'PM',
    format: 'image/jpeg',
});

const orthoLayer = new itowns.ColorLayer('Ortho', {
    source: orthoSource,
});

view.addLayer(orthoLayer);


const elevationSource = new itowns.WMTSSource({
    url: 'http://wxs.ign.fr/3ht7xcw6f7nciopo16etuqp2/geoportail/wmts',
    crs: 'EPSG:4326',
    name: 'ELEVATION.ELEVATIONGRIDCOVERAGE.SRTM3',
    tileMatrixSet: 'WGS84G',
    format: 'image/x-bil;bits=32',
    zoom: {min: 3, max: 10}
});

const elevationLayer = new itowns.ElevationLayer('MNT_WORLD', {
    source: elevationSource,
});

view.addLayer(elevationLayer);

async function loadGLTF(){


    let gltf = await ThreeLoader.load('GLTF','../data/aviva_stadium/scene.gltf');

    //Base on the example https://github.com/iTowns/itowns/blob/master/examples/misc_collada.html

    //Get the ThreeGroup
    let model = gltf.scene;

    //Building coordinate
    let coord = new itowns.Coordinates('EPSG:4326',2.36,48.924444,46);

    //Set the model position to the coord define before
    model.position.copy(coord.as(view.referenceCrs));

    //Align up vector with geodesic normal
    model.lookAt(model.position.clone().add(coord.geodesicNormal));

    // user rotate building to align with ortho image
    model.rotateZ(-Math.PI/12);
    model.rotateX(Math.PI/2);
    model.rotateY(Math.PI/8);
    model.scale.set(0.002, 0.002, 0.002);


    // update coordinate of the mesh
    model.updateMatrixWorld();

    view.scene.add(model);

    //
    //itowns.CameraUtils.sequenceAnimationsToLookAtTarget(view, camera, pathTravel);
}

loadGLTF();
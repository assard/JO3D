const viewerDiv = document.getElementById('viewerDiv');
const position = {
    coord: new itowns.Coordinates('EPSG:4326', 2.25359366707031848,84595076292729),
    range: 30000
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


async function loadComplex(dataPath,coords,rotateX,rotateY,rotateZ,scaleX,scaleY,scaleZ){


    let gltf = await ThreeLoader.load('GLTF',dataPath);

    //Base on the example https://github.com/iTowns/itowns/blob/master/examples/misc_collada.html

    //Get the ThreeGroup
    let model = gltf.scene;

    let coord = new itowns.coordinates('EPSG:4326',coords.lng,coords.lat,coords.alt);


    //Set the model position to the coord define before
    model.position.copy(coord.as(view.referenceCrs));

    //Align up vector with geodesic normal
    model.lookAt(model.position.clone().add(coord.geodesicNormal));

    // user rotate building to align with ortho image
    model.rotateZ(rotateZ);
    model.rotateX(rotateX);
    model.rotateY(rotateY);
    model.scale.set(scaleX,scaleY,scaleZ);

    // update coordinate of the mesh
    model.updateMatrixWorld();

    view.scene.add(model);
}

//Load Stade de France

stdfCoord = {
    lng : 2.36,
    lat : 48.924444,
    alt : 46
}

loadComplex('../data/aviva_stadium/scene.gltf',
            stdfCoord,
            Math.PI/2,
            Math.PI/8,
            -Math.PI/12,
            0.002, 0.002, 0.002);

//Load Tennis Court
loadComplex('../data/aviva_stadium/scene.gltf',
            new itowns.Coordinates('EPSG:4326', 2.25,48.845950,46),
            Math.PI/2,
            0,
            0,
            1, 1, 1);


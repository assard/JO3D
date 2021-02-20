import {Complex} from './Complex.js'

const viewerDiv = document.getElementById('viewerDiv');
const position = {
    coord: new itowns.Coordinates('EPSG:4326', 2.253593667070318,48.84595076292729),
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


//Load models

const stadeDeFrance = new Complex('../data/aviva_stadium/scene.gltf',2.36,48.924444,46);
const tennisCourt = new Complex('../data/aviva_stadium/scene.gltf',2.25,48.845950,46);

const rotateStdf = {
    x: Math.PI/8,
    y: -Math.PI/12,
    z: Math.PI/2
}
const scaleStdf = {
    x: 0.002,
    y: 0.002,
    z: 0.002
}
stadeDeFrance.render(view,rotateStdf,scaleStdf);





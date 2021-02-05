const viewerDiv = document.getElementById('viewerDiv');
const placement = {
    coord: new itowns.Coordinates('EPSG:4326', 2.35, 48.8),
    range: 1E3
};
const view = new itowns.GlobeView(viewerDiv, placement);

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

const colorSource = new itowns.WMTSSource({
    url: 'http://wxs.ign.fr/3ht7xcw6f7nciopo16etuqp2/geoportail/wmts',
    crs: 'EPSG:3857',
    name: 'GEOGRAPHICALGRIDSYSTEMS.PLANIGN',
    tileMatrixSet: 'PM',
    format: 'image/jpeg'
});

const colorLayer = new itowns.ColorLayer('Ortho', {
    source: colorSource,
});

view.addLayer(colorLayer);

function setAltitude(properties) {
    return -properties.hauteur;
}

function setExtrusion(properties) {
    return properties.hauteur;
}

function setColorRed(properties) {
    return new itowns.THREE.Color(0xff0000);
}

function setColorGreen(properties) {
    return new itowns.THREE.Color(0x00ff00);
}

function setColorBlue(properties) {
    return new itowns.THREE.Color(0x0000ff);
}

const geometrySourceIndifferencie = new itowns.WFSSource({
    url: 'http://wxs.ign.fr/3ht7xcw6f7nciopo16etuqp2/geoportail/wfs?',
    typeName: 'BDTOPO_BDD_WLD_WGS84G:bati_indifferencie',
    crs: 'EPSG:4326',
});

const geometryLayerIndifferencie = new itowns.GeometryLayer('BuildingsIndifferencie', new itowns.THREE.Group(), {
    source: geometrySourceIndifferencie,
    update: itowns.FeatureProcessing.update,
    convert: itowns.Feature2Mesh.convert({
        altitude: setAltitude,
        extrude: setExtrusion,
        color: setColorRed
    }),
    zoom: { min: 14 },
});

view.addLayer(geometryLayerIndifferencie);

const geometrySourceIndustriel = new itowns.WFSSource({
    url: 'http://wxs.ign.fr/3ht7xcw6f7nciopo16etuqp2/geoportail/wfs?',
    typeName: 'BDTOPO_BDD_WLD_WGS84G:bati_industriel',
    crs: 'EPSG:4326',
});

const geometryLayerIndustriel = new itowns.GeometryLayer('BuildingsIndustriel', new itowns.THREE.Group(), {
    source: geometrySourceIndustriel,
    update: itowns.FeatureProcessing.update,
    convert: itowns.Feature2Mesh.convert({
        altitude: setAltitude,
        extrude: setExtrusion,
        color: setColorGreen
    }),
    zoom: { min: 14 },
});

view.addLayer(geometryLayerIndustriel);

const geometrySourceTerrainSport = new itowns.WFSSource({
    url: 'http://wxs.ign.fr/3ht7xcw6f7nciopo16etuqp2/geoportail/wfs?',
    typeName: 'BDTOPO_BDD_WLD_WGS84G:terrain_sport',
    crs: 'EPSG:4326',
});

const geometryLayerTerrainSport = new itowns.GeometryLayer('BuildingsTerrainSport', new itowns.THREE.Group(), {
    source: geometrySourceTerrainSport,
    update: itowns.FeatureProcessing.update,
    convert: itowns.Feature2Mesh.convert({
        altitude: setAltitude,
        extrude: setExtrusion,
        color: setColorBlue
    }),
    zoom: { min: 14 },
});

view.addLayer(geometryLayerTerrainSport);
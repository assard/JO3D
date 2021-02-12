// Define crs projection that we will use (taken from https://epsg.io/3946, Proj4js section)
itowns.proj4.defs('EPSG:3946', '+proj=lcc +lat_1=45.25 +lat_2=46.75 +lat_0=46 +lon_0=3 +x_0=1700000 +y_0=5200000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');
// # Simple Globe viewer

// Define initial camera position
var positionOnGlobe = { longitude: 2.338, latitude: 48.859, altitude: 3000 };
var placement = {
    coord: new itowns.Coordinates('EPSG:4326', 2.338, 48.859),
    range: 3000,
    tilt: 45,
}
var meshes = [];
var linesBus = [];
var scaler;

// `viewerDiv` will contain iTowns' rendering area (`<canvas>`)
var viewerDiv = document.getElementById('viewerDiv');

// Instanciate iTowns GlobeView*
var view = new itowns.GlobeView(viewerDiv, placement);
setupLoadingScreen(viewerDiv, view);

// // Add one imagery layer to the scene
// // This layer is defined in a json file but it could be defined as a plain js
// // object. See Layer* for more info.
// itowns.Fetcher.json('javascripts/layers/JSONLayers/Ortho.json').then(function _(config) {
//     config.source = new itowns.WMTSSource(config.source);
//     var layer = new itowns.ColorLayer('Ortho', config);
//     view.addLayer(layer).then(menuGlobe.addLayerGUI.bind(menuGlobe));
// });

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

// Add two elevation layers.
// These will deform iTowns globe geometry to represent terrain elevation.
function addElevationLayerFromConfig(config) {
    config.source = new itowns.WMTSSource(config.source);
    var layer = new itowns.ElevationLayer(config.id, config);
    view.addLayer(layer).then(menuGlobe.addLayerGUI.bind(menuGlobe));
}
itowns.Fetcher.json('javascripts/layers/JSONLayers/WORLD_DTM.json').then(addElevationLayerFromConfig);
itowns.Fetcher.json('javascripts/layers/JSONLayers/IGN_MNT_HIGHRES.json').then(addElevationLayerFromConfig);

var color = new itowns.THREE.Color();
var tile;

function colorBuildings(properties) {
    if (properties.id.indexOf('bati_remarquable') === 0) {
        return color.set(0x5555ff);
    } else if (properties.id.indexOf('bati_industriel') === 0) {
        return color.set(0xff5555);
    } else if (properties.id.indexOf('terrain_sport') === 0) {
        return color.set(0x55ff55);
    }
    return color.set(0xeeeeee);
}

function altitudeBuildings(properties) {
    return properties.z_min - properties.hauteur;
}

function extrudeBuildings(properties) {
    return properties.hauteur;
}

function acceptFeature(properties) {
    return !!properties.hauteur;
}

scaler = function update(/* dt */) {
    var i;
    var mesh;
    if (meshes.length) {
        view.notifyChange(view.camera.camera3D, true);
    }
    for (i = 0; i < meshes.length; i++) {
        mesh = meshes[i];
        if (mesh) {
            mesh.scale.z = Math.min(
                1.0, mesh.scale.z + 0.1);
            mesh.updateMatrixWorld(true);
        }
    }
    meshes = meshes.filter(function filter(m) { return m.scale.z < 1; });
};

view.addFrameRequester(itowns.MAIN_LOOP_EVENTS.BEFORE_RENDER, scaler);

var wfsBuildingSource = new itowns.WFSSource({
    url: 'https://wxs.ign.fr/3ht7xcw6f7nciopo16etuqp2/geoportail/wfs?',
    version: '2.0.0',
    typeName: 'BDTOPO_BDD_WLD_WGS84G:bati_remarquable,BDTOPO_BDD_WLD_WGS84G:bati_indifferencie,BDTOPO_BDD_WLD_WGS84G:bati_industriel,BDTOPO_BDD_WLD_WGS84G:terrain_sport',
    crs: 'EPSG:4326',
    ipr: 'IGN',
    format: 'application/json',
    extent: {
        west: 2.200,
        east: 2.500,
        south: 48.750,
        north: 48.950,
    },
});

var wfsBuildingLayer = new itowns.GeometryLayer('WFS Building', new itowns.THREE.Group(), {
    update: itowns.FeatureProcessing.update,
    convert: itowns.Feature2Mesh.convert({
        color: colorBuildings,
        batchId: function (property, featureId) { return featureId; },
        altitude: altitudeBuildings,
        extrude: extrudeBuildings }),
    onMeshCreated: function scaleZ(mesh) {
        mesh.scale.z = 0.01;
        meshes.push(mesh);
    },
    filter: acceptFeature,
    overrideAltitudeInToZero: true,
    source: wfsBuildingSource,
    zoom: { min: 14 },
});
view.addLayer(wfsBuildingLayer);

var menuGlobe = new GuiTools('menuDiv', view);
// Listen for globe full initialisation event
view.addEventListener(itowns.GLOBE_VIEW_EVENTS.GLOBE_INITIALIZED, function () {
    // eslint-disable-next-line no-console
    console.info('Globe initialized');
});

debug.createTileDebugUI(menuGlobe.gui, view);

function picking(event) {
    if(view.controls.isPaused) {
        var htmlInfo = document.getElementById('info');
        var intersects = view.pickObjectsAt(event, 3, 'WFS Building');
        var properties;
        var info;
        var batchId;

        htmlInfo.innerHTML = ' ';

        if (intersects.length) {
            batchId = intersects[0].object.geometry.attributes.batchId.array[intersects[0].face.a];
            properties = intersects[0].object.feature.geometries[batchId].properties;

            Object.keys(properties).map(function (objectKey) {
                var value = properties[objectKey];
                var key = objectKey.toString();
                if (key[0] !== '_' && key !== 'geometry_name') {
                    info = value.toString();
                    htmlInfo.innerHTML +='<li><b>' + key + ': </b>' + info + '</li>';
                }
            });
        }
    }
}

for (var layer of view.getLayers()) {
    if (layer.id === 'WFS Bus lines') {
        layer.whenReady.then( function _(layer) {
            var gui = debug.GeometryDebug.createGeometryDebugUI(menuGlobe.gui, view, layer);
            debug.GeometryDebug.addMaterialLineWidth(gui, view, layer, 1, 10);
        });
    }
    if (layer.id === 'WFS Building') {
        layer.whenReady.then( function _(layer) {
            var gui = debug.GeometryDebug.createGeometryDebugUI(menuGlobe.gui, view, layer);
            debug.GeometryDebug.addWireFrameCheckbox(gui, view, layer);
            window.addEventListener('mousemove', picking, false);
        });
    }
    if (layer.id === 'WFS Route points') {
        layer.whenReady.then( function _(layer) {
            var gui = debug.GeometryDebug.createGeometryDebugUI(menuGlobe.gui, view, layer);
            debug.GeometryDebug.addMaterialSize(gui, view, layer, 1, 200);
        });
    }
}

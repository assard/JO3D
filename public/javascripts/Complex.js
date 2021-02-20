class Complex {
    constructor(url,lng,lat,alt,){
        this.url = url,
        this.lng = lng,
        this.lat = lat,
        this.alt = alt
    }

    async render(viewer,rotation,scale){
        let gltf = await ThreeLoader.load('GLTF',this.url);

        //Base on the example https://github.com/iTowns/itowns/blob/master/examples/misc_collada.html

        //Get the ThreeGroup
        let model = gltf.scene;

        let coord = new itowns.coordinates('EPSG:4326',this.lng,this.lat,this.alt);

        //Set the model position to the coord define before
        model.position.copy(coord.as(viewer.referenceCrs));

        //Align up vector with geodesic normal
        model.lookAt(model.position.clone().add(coord.geodesicNormal));

        // user rotate building to align with ortho image
        model.rotateZ(rotation.z);
        model.rotateX(rotation.x);
        model.rotateY(rotation.z);
        model.scale.set(scale.x,scale.y,scale.z);

        // update coordinate of the mesh
        model.updateMatrixWorld();

        viewer.scene.add(model);
    }
}

export {Complex}
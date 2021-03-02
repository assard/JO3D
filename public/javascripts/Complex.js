class Complex {
    constructor(url,lng,lat,alt,rotationX,rotationY,rotationZ,scaleX,scaleY,scaleZ,name,sport,capacity){
        this.url = url,
        this.lng = lng,
        this.lat = lat,
        this.alt = alt,
        this.rotationX = rotationX,
        this.rotationY = rotationY,
        this.rotationZ = rotationZ,
        this.scaleX = scaleX,
        this.scaleY = scaleY,
        this.scaleZ = scaleZ,
        this.name = name,
        this.sport = sport,
        this.capacity = capacity
    }

    async render(viewer){
        let gltf = await ThreeLoader.load('GLTF',this.url);

        //Base on the example https://github.com/iTowns/itowns/blob/master/examples/misc_collada.html

        //Get the ThreeGroup
        let model = gltf.scene;

        let coord = new itowns.Coordinates('EPSG:4326',this.lng,this.lat,this.alt);

        //Set the model position to the coord define before
        model.position.copy(coord.as(viewer.referenceCrs));

        //Align up vector with geodesic normal
        model.lookAt(model.position.clone().add(coord.geodesicNormal));

        // user rotate building to align with ortho image
        model.rotateZ(this.rotationZ);
        model.rotateX(this.rotationX);
        model.rotateY(this.rotationY);
        model.scale.set(this.scaleX,this.scaleY,this.scaleZ);

        // update coordinate of the mesh
        model.updateMatrixWorld();

        viewer.scene.add(model);
    }
}

export {Complex}
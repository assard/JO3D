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

    /**
     * Render the complex on the viewer
     * 
     * @param {Object} viewer - Viewer itowns where we want to render the complex
     */
    async render(viewer){
        let gltf = await ThreeLoader.load('GLTF',this.url);

        //Base on the example https://github.com/iTowns/itowns/blob/master/examples/misc_collada.html

        //Get the ThreeGroup
        let model = gltf.scene;

        //coords of the complex 
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

        // add model to the viewer
        viewer.scene.add(model);
    }

    /**
     * Add the name of the complex on the menu which show data information
     * If the user click on this name, the camera ill zoom to it
     * 
     * @param {Object} ulMenu - The ul element where the name will be put
     * @param {Object} viewer - The itowns viewer where the data are rendered
     */
    addComplexOnInfoMenu(ulMenu,viewer){
        const li = document.createElement('li');
        ulMenu.appendChild(li);
        const button = document.createElement('button');
        button.innerHTML = this.name;
        button.addEventListener('click',()=>{
            this.zoomTo(viewer);
            const ulInfoComplexes = document.getElementById('ulInfoComplexes');
            this.showInfos(ulInfoComplexes);
        });
        li.appendChild(button);
    }

    /**
     * Zoom the camera to the complex
     * 
     * @param {Object} viewer - The itowns viewer where the data are rendered
     */
    zoomTo(viewer){
        const pathTravel = [{ coord: new itowns.Coordinates('EPSG:4326',this.lng,this.lat,this.alt), range: 2000, time: 4000 }];
        const camera = viewer.camera.camera3D;
        itowns.CameraUtils.sequenceAnimationsToLookAtTarget(viewer, camera, pathTravel);
    }

    showInfos(ulInfos){
        while(ulInfos.firstChild) {    
            ulInfos.removeChild(ulInfos.firstChild);
        }
        for (const attribute in this) {
            if (['name','sport','capacity'].includes(attribute)) {
                const li = document.createElement('li');
                li.innerText = `${attribute} : ${this[attribute]}` ;
                ulInfos.appendChild(li);
            }            
        }
    }
}

export {Complex}
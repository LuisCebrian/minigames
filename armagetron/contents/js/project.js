//Variables threejs
var renderer, scene, camera, camera1, camera2;
var cameraControls;
var stela;
var stats;
var clock = new THREE.Clock();
var textureLoader = new THREE.TextureLoader();
var fontLoader = new THREE.FontLoader();

//GAME VARIABLES
var sizeBoard = 200;
var velocity = 40;
var collidableMeshList = [];

//Fonts
var fontProperties ={
    size: 20,
    height: 0,
    curveSegments: 4,
    bevelThickness: 1,
    bevelSize: 0,
    bevelEnabled: true
}

//Materials and textures
var whiteMaterial = new THREE.MeshPhongMaterial({color:0xffffff, side: THREE.DoubleSide});
var redMaterial = new THREE.MeshPhongMaterial({color: 0xff0000, side: THREE.DoubleSide});
var blueMaterial = new THREE.MeshPhongMaterial({color: 0x0000ff, side: THREE.BackSide});
var bikeWallTexture = textureLoader.load("contents/textures/dir_wall.png");
bikeWallTexture.wrapS = bikeWallTexture.wrapT = THREE.RepeatWrapping;
bikeWallTexture.repeat.set(3,1);
var ceilingTexture = textureLoader.load('contents/textures/sky.png')
ceilingTexture.wrapS = ceilingTexture.wrapT = THREE.RepeatWrapping;
ceilingTexture.repeat.set(2,2);
var ceilingMaterial = new THREE.MeshPhongMaterial({color:0xffffff, side: THREE.DoubleSide, map: ceilingTexture, transparent: true});
var redTextureMaterial = new THREE.MeshPhongMaterial({color: 0xff0000, side: THREE.DoubleSide, map: bikeWallTexture});
var blueTextureMaterial = new THREE.MeshPhongMaterial({color: 0x0000ff, side: THREE.DoubleSide, map: bikeWallTexture});
var blackMaterial = new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide});
var wireframeMaterial = new THREE.MeshBasicMaterial({color: 'blue', wireframe: true});
var wallTexture = textureLoader.load("contents/textures/rim_wall.png");
var wallMaterial = new THREE.MeshPhongMaterial({color: 0xffffff, side: THREE.BackSide, map:wallTexture})
wallTexture.wrapS = THREE.RepeatWrapping;
wallTexture.wrapT = THREE.MirroredRepeatWrappin;
wallTexture.repeat.set(3,2);


//POSITION STELAS
var turnPosition = new THREE.Vector3(0,0,0);
var stelaGeometry = new THREE.PlaneGeometry(1,1,1,1);
var stelaBoxGeometry = new THREE.BoxGeometry(1,1,1);

//Players variables
var box; var boxCore;
var player1;
var dir1 = new THREE.Vector3(0,0,-1);

//FLAGS
var FLAG_PAUSE = false;
var FLAG_INIT_GAME = true;
init();
loadInstructions();
loadScene();
animate();

function loadInstructions(){
    fontLoader.load( 'contents/fonts/helvetiker_bold.typeface.json', function ( font ) {
        fontProperties.font = font;

        // game Title
        var textGeo = new THREE.TextGeometry( "Armagetron", fontProperties);
        var mesh = new THREE.Mesh( textGeo, redMaterial);
        textGeo.computeBoundingBox();
        var centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
        mesh.position.set(1000+centerOffset,1080,1200);
        scene.add( mesh );

        //Player 1
        fontProperties.size = 15;
        var textPlayer1 = new THREE.TextGeometry( "Player 1", fontProperties);
        textPlayer1.computeBoundingBox();
        mesh = new THREE.Mesh(textPlayer1,whiteMaterial);
        centerOffset =  -0.5 * ( textPlayer1.boundingBox.max.x - textPlayer1.boundingBox.min.x );
        mesh.position.set(900+centerOffset,1020,1200);
        scene.add(mesh);

        fontProperties.size = 10;
        var controls = new THREE.TextGeometry("Controls: A and D",fontProperties);
        controls.computeBoundingBox();
        mesh = new THREE.Mesh(controls,whiteMaterial);
        centerOffset =  -0.5 * ( controls.boundingBox.max.x - controls.boundingBox.min.x );
        mesh.position.set(900+centerOffset,980,1200);
        scene.add(mesh);

        //Player 2
        fontProperties.size = 15;
        var textPlayer2 = new THREE.TextGeometry( "Player 2", fontProperties);
        textPlayer2.computeBoundingBox();
        mesh = new THREE.Mesh(textPlayer2,whiteMaterial);
        centerOffset =  -0.5 * ( textPlayer2.boundingBox.max.x - textPlayer2.boundingBox.min.x );
        mesh.position.set(1100+centerOffset,1020,1200);
        scene.add(mesh);

        fontProperties.size = 10;
        controls = new THREE.TextGeometry("Controls: Left and Right",fontProperties);
        controls.computeBoundingBox();
        mesh = new THREE.Mesh(controls,whiteMaterial);
        centerOffset =  -0.5 * ( controls.boundingBox.max.x - controls.boundingBox.min.x );
        mesh.position.set(1100+centerOffset,980,1200);
        scene.add(mesh);

        //Intro to begin
        fontProperties.size = 10;
        controls = new THREE.TextGeometry("(Press Intro to Begin)", fontProperties);
        controls.computeBoundingBox();
        mesh = new THREE.Mesh(controls,whiteMaterial);
        centerOffset =  -0.5 * ( controls.boundingBox.max.x - controls.boundingBox.min.x );
        mesh.position.set(1000+centerOffset,920,1200);
        scene.add(mesh);
    } );
}
function init(){

    //Renderer setup
    renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.autoClear = false;
    document.getElementById('container').appendChild(renderer.domElement);

    //Scene setup
    scene = new THREE.Scene();

    //Camera setup
    var aspectRatio = window.innerWidth / window.innerHeight;
    var viewAngle = 45; var near = 0.1; var far = 20000

    //Camera used to display text
    camera = new THREE.PerspectiveCamera(viewAngle, aspectRatio, near, far);
    camera.position.set(1000,1000,1500);
    camera.lookAt(new THREE.Vector3(1000,1000,1000));
    scene.add(camera);
    //Camera player 1
    camera1 = new THREE.PerspectiveCamera(viewAngle, aspectRatio, near, far);
    camera1.position.set(10,5,0);
    camera1.lookAt(new THREE.Vector3(0,0,0));
    scene.add(camera1);

    //Camera Controls setup
    cameraControls = new THREE.OrbitControls(camera1, renderer.domElement);
    cameraControls.maxPolarAngle = Math.PI/2;
    cameraControls.target.set(0,0,0);

    //Stats setup
    stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);

    /*
    camera2 = new THREE.PerspectiveCamera(viewAngle, aspectRatio, near, far);
    camera2.position.set(0,120,-80);
    camera2.lookAt(new THREE.Vector3(0,50,0));
    scene.add(camera2);
    */

    document.addEventListener('keydown',manageInput);
}


function loadScene(){
    //Light
    scene.add( new THREE.AmbientLight( 0xeef0ff ) );
    var directional = new THREE.DirectionalLight( 0xffffff, 2 );
    directional.position.set( 0, 1, 0 );
    scene.add( directional);

    //Environment
    var planeGeometry = new THREE.PlaneGeometry(sizeBoard,sizeBoard,20,20);
    var plane = new THREE.Mesh(planeGeometry,wireframeMaterial);
    plane.rotation.x = Math.PI/2;
    scene.add(plane);

    var blackFloor = new THREE.Mesh(planeGeometry,blackMaterial);
    blackFloor.rotation.x = Math.PI/2;
    blackFloor.position.y = -0.99;
    scene.add(blackFloor);

    var blackCeiling = new THREE.Mesh(planeGeometry,ceilingMaterial);
    blackCeiling.rotation.x = Math.PI/2;
    blackCeiling.position.y = sizeBoard/4 - 2;
    scene.add(blackCeiling);


    var wallBox = new THREE.BoxGeometry(sizeBoard,sizeBoard/2,sizeBoard);
    var wallMesh = new THREE.Mesh(wallBox,wallMaterial);
    wallMesh.position.y = sizeBoard/4 - 1;
    scene.add(wallMesh);

    //Players
    player = new THREE.Object3D();

    var boxGeometry = new THREE.BoxGeometry(1,1,1);

    box = new THREE.Mesh(boxGeometry,wireframeMaterial);
    box.position.set(0,0.5,-0.5);
    box.scale.x = 0.5;

    boxCore = new THREE.Mesh(boxGeometry,redMaterial);
    boxCore.scale.set(0.3,0.8,0.79);
    boxCore.position.set(0,0.5,-0.5);

    player.add(box);
    player.add(boxCore) ;
    scene.add(player);

    stela = new THREE.Mesh(stelaBoxGeometry,redTextureMaterial);
    stela.scale.z = 0.2;
    stela.position.y = 0.5;
    stela.rotation.y = Math.PI/2;
    scene.add(stela);

    //Axis Helper
    var axisHelper = new THREE.AxisHelper( 5 );
    scene.add( axisHelper );
}

function manageInput(event){
    //A
    if(event.keyCode == 65){
        player.rotation.y += Math.PI/2;
        turnPosition = player.position.clone();
        collidableMeshList.push(stela);
        newStela();
        dir1.applyAxisAngle(new THREE.Vector3(0,1,0),Math.PI/2);
    }
    //D
    if(event.keyCode == 68){
        player.rotation.y -= Math.PI/2;
        turnPosition = player.position.clone();
        collidableMeshList.push(stela);
        newStela();
        dir1.applyAxisAngle(new THREE.Vector3(0,1,0),-Math.PI/2);
    }
    //Space
    if (event.keyCode == 32){
        if(FLAG_PAUSE)
            FLAG_PAUSE = false;
        else {
            FLAG_PAUSE = true;
        }
    }
    //Intro
    if (event.keyCode == 13){
        FLAG_INIT_GAME = !FLAG_INIT_GAME;
    }
}

function newStela(){
    stela = new THREE.Mesh(stelaBoxGeometry,redTextureMaterial);
    stela.scale.z = 0.2;
    stela.position.y = 0.5;
    if(dir1.x > 0.1 || dir1.x < -0.1)
        stela.rotation.y = Math.PI/2;

    scene.add(stela);
}
function animate(){
    stats.begin();
    render();
    if (!FLAG_PAUSE)
        update();
    else {
        clock.getDelta();
    }
    stats.end();
    requestAnimationFrame(animate);
}

function updateStela(delta){
    var m = player.position.clone().add(turnPosition).divideScalar(2);
    var disToTurnPoint = player.position.clone().sub(turnPosition).divideScalar(2);
    stela.position.set(m.x,0.5,m.z);
    if(dir1.z > 0.1 || dir1.z < -0.1)
        stela.scale.x = disToTurnPoint.z * 2;
    else
        stela.scale.x = disToTurnPoint.x * 2;

}
function update(){
    //bikeWallTexture.repeat.set(stela.scale.x/5, 1);
    stela.material.map.repeat.set(stela.scale.x/5,1)
    var delta = clock.getDelta();
    var speed = dir1.clone();
    speed.multiplyScalar(velocity);
    speed.multiplyScalar(delta);
    player.position.add(speed);
    updateStela(delta);
    checkCollision();
    updateCamera();
}
function updateCamera(){
    camera1.position.set(player.position.x+10,player.position.y+5,player.position.z+30);
    camera1.lookAt(player.position);
}

function checkCollision(){

	var originPoint = boxCore.getWorldPosition().clone();

	for (var vertexIndex = 0; vertexIndex < boxCore.geometry.vertices.length; vertexIndex++)
	{
		var localVertex = box.geometry.vertices[vertexIndex].clone();
        var mt = player.matrix.clone();
        mt.multiply(boxCore.matrix);
        var globalVertex = localVertex.applyMatrix4( mt );
		var directionVector = globalVertex.sub( originPoint );

		var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
		var collisionResults = ray.intersectObjects( collidableMeshList );
		if ( collisionResults.length > 0 && collisionResults[0].distance <= directionVector.length() ){
            FLAG_PAUSE = true;
        }
	}

}

function render(){
    if(FLAG_INIT_GAME){
        renderer.clear();
        renderer.render(scene,camera);
    }else{
        renderer.clear();
        renderer.render(scene,camera1);
    }
    /*
    var aspectRatio = window.innerWidth / window.innerHeight;
    camera1.aspect = 2*aspectRatio;
    camera2.aspect = 2*aspectRatio;
    camera1.updateProjectionMatrix();
    camera2.updateProjectionMatrix();

    renderer.setViewport(0,0,window.innerWidth,window.innerHeight);
    renderer.clear();

    //renderer.setViewport(1, 1, 0.5 * window.innerWidth - 2, window.innerHeight -2);
    renderer.setViewport(1, 0.5 * window.innerHeight + 1, window.innerWidth - 2, 0.5 * window.innerHeight -2);
    renderer.render(scene,camera1);

    //renderer.setViewport(0.5 * window.innerWidth + 1, 1, 0.5 * window.innerWidth - 2, window.innerHeight -2);
    renderer.setViewport(1, 1, window.innerWidth - 2, 0.5 * window.innerHeight -2);
    renderer.render(scene,camera2);
    */
}

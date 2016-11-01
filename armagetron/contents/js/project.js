//Variables threejs
var renderer, scene, camera1, camera2;
var cameraControls;
var keyboard = new THREEx.KeyboardState();
var stela;
var stats;
var clock = new THREE.Clock();
var textureLoader = new THREE.TextureLoader();

//GAME VARIABLES
var sizeBoard = 200;
var velocity = 40;
var collidableMeshList = [];

//Materials and textures
var redMaterial = new THREE.MeshPhongMaterial({color: 0xff0000, side: THREE.DoubleSide});
var bikeWallTexture = textureLoader.load("contents/textures/dir_wall.png");
bikeWallTexture.wrapS = bikeWallTexture.wrapT = THREE.RepeatWrapping;
bikeWallTexture.repeat.set(3,1);
var redTextureMaterial = new THREE.MeshPhongMaterial({color: 0xff0000, side: THREE.DoubleSide, map: bikeWallTexture});
var blueTextureMaterial = new THREE.MeshPhongMaterial({color: 0x0000ff, side: THREE.DoubleSide, map: bikeWallTexture});
var blackMaterial = new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide});
var wireframeMaterial = new THREE.MeshBasicMaterial({color: 'blue', wireframe: true});
var wallTexture = textureLoader.load("contents/textures/rim_wall.png");
var wallMaterial = new THREE.MeshPhongMaterial({color: 0xffffff, side: THREE.DoubleSide, map:wallTexture})
wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
wallTexture.repeat.set(3,1);


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

init();
loadScene();
animate();

function init(){

    //Renderer setup
    renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(new THREE.Color(0x0000AA));
    renderer.autoClear = false;
    document.getElementById('container').appendChild(renderer.domElement);

    //Scene setup
    scene = new THREE.Scene();

    //Camera setup
    var aspectRatio = window.innerWidth / window.innerHeight;
    var viewAngle = 45; var near = 0.1; var far = 20000
    camera1 = new THREE.PerspectiveCamera(viewAngle, aspectRatio, near, far);
    camera1.position.set(30,5,0);
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
    blackFloor.position.y = -0.5;
    scene.add(blackFloor);

    var wallBox = new THREE.BoxGeometry(sizeBoard,sizeBoard/4,sizeBoard);
    var wallMesh = new THREE.Mesh(wallBox,wallMaterial);
    wallMesh.position.y = sizeBoard/8 - 1;
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

    var mv = new TWEEN.Tween(camera1.position).to({x: player.position.x, y: player.position.y, z: player.position.z}, 3000).onUpdate(function(){
        camera1.position.set(this.x,this.y+5,this.z);
        //camera1.lookAt(player.position);
    }).onComplete(function(){
        camera1.lookAt(player.position);
    });
    mv.easing(TWEEN.Easing.Bounce.Out);
    mv.interpolation( TWEEN.Interpolation.Bezier );
    mv.start();
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
    TWEEN.update();
}
function updateCamera(){
    camera1.position.set(player.position.x+20,player.position.y+5,player.position.z);
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
    renderer.render(scene,camera1);
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

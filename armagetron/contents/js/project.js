//Variables threejs
var renderer, scene, camera, camera1, camera2;
var cameraControls;
var stats;
var clock = new THREE.Clock();
var textureLoader = new THREE.TextureLoader();
var fontLoader = new THREE.FontLoader();

//GAME VARIABLES
var sizeBoard = 200;
var velocity = 40;
var collidableMeshList = [];
var textMenu = new THREE.Object3D();
textMenu.name = "menu";
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
var orangeMaterial = new THREE.MeshPhongMaterial({color: 0xffAA00, side: THREE.DoubleSide})
var redMaterial = new THREE.MeshPhongMaterial({color: 0xff0000, side: THREE.DoubleSide});
var blueMaterial = new THREE.MeshPhongMaterial({color: 0x0000ff, side: THREE.DoubleSide});
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
var wireframeMaterial = new THREE.MeshBasicMaterial({color: 'blue', wireframe: true, wireframeLinewidth: 3, transparent:true, opacity:0.1});
var wallTexture = textureLoader.load("contents/textures/rim_wall.png");
var wallMaterial = new THREE.MeshPhongMaterial({color: 0xffffff, side: THREE.BackSide, map:wallTexture})
wallTexture.wrapS = THREE.RepeatWrapping;
wallTexture.wrapT = THREE.MirroredRepeatWrappin;
wallTexture.repeat.set(3,2);


//POSITION STELAS
var turnPosition1 = new THREE.Vector3(0,0,sizeBoard/4);
var stelaGeometry = new THREE.PlaneGeometry(1,1,1,1);
var stelaBoxGeometry = new THREE.BoxGeometry(1,1,1);

//Players variables
var box1 = new THREE.Object3D();
var boxCore1;
var player1;
var dir1 = new THREE.Vector3(0,0,-1);
var stela1;
var turnPosition1 = new THREE.Vector3(0,0,sizeBoard/4);

var box2; var boxCore2;
var player2;
var dir2 = new THREE.Vector3(0,0,1);
var stela2;
var turnPosition2 = new THREE.Vector3(0,0,-sizeBoard/4);

//FLAGS
var FLAG_PAUSE = false;
var FLAG_INIT_GAME = true;
var FLAG_GAME_OVER = false;

init();
loadInstructions();
loadScene();
animate();

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
    //Camera player 2
    camera2 = new THREE.PerspectiveCamera(viewAngle, aspectRatio, near, far);
    camera2.position.set(0,120,-80);
    camera2.lookAt(new THREE.Vector3(0,0,0));
    scene.add(camera2);

    //Camera Controls setup
    cameraControls = new THREE.OrbitControls(camera1, renderer.domElement);
    cameraControls.maxPolarAngle = Math.PI/2;
    cameraControls.target.set(0,0,0);
    cameraControls.noKeys = true;
    //Stats setup
    stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);

    document.addEventListener('keydown',manageInput);
    window.addEventListener('resize',onResize);
}

function loadInstructions(){
    fontLoader.load( 'contents/fonts/helvetiker_bold.typeface.json', function ( font ) {
        fontProperties.font = font;
        // game Title
        displayText("Armagetron",25,orangeMaterial,new THREE.Vector3(1000,1080,1200));
        //Player 1
        displayText("Player 1",15,redMaterial,new THREE.Vector3(900,1020,1200));
        displayText("Controls: A and D", 10, whiteMaterial, new THREE.Vector3(900,980,1200));
        //Player 2
        displayText("Player 2",15,blueMaterial,new THREE.Vector3(1100,1020,1200));
        displayText("Controls: Left and Right", 10, whiteMaterial, new THREE.Vector3(1100,980,1200));
        //Intro to begin
        displayText("(Press Intro to Begin)", 10, whiteMaterial, new THREE.Vector3(1000,920,1200));
        scene.add(textMenu);
    } );
}

function loadScene(color){
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
    setUpPlayer1();
    setUpPlayer2();
}

function loadBike(color,bikeRotation){
    var colorMaterial;
    if (color == "red"){
        colorMaterial = redTextureMaterial;
    }else{
        colorMaterial = blueTextureMaterial;
    }
    var bike = new THREE.Object3D();
    var loader = new THREE.OBJLoader( );
	loader.load( 'contents/models/cycle_body.obj', function ( object ) {
		object.traverse( function ( child ) {
			if ( child instanceof THREE.Mesh ) {
				child.material = colorMaterial;
			}
		} );
        object.rotation.x = -Math.PI/2;
        object.position.y =-0.3;
		bike.add( object );
	});
	loader.load( 'contents/models/cycle_rear.obj', function ( object ) {
		object.traverse( function ( child ) {
			if ( child instanceof THREE.Mesh ) {
				child.material = blackMaterial;
			}
		} );
        object.rotation.x = Math.PI/2;
        object.position.y = 0.5;
		bike.add( object );
	});
	loader.load( 'contents/models/cycle_front.obj', function ( object ) {
		object.traverse( function ( child ) {
			if ( child instanceof THREE.Mesh ) {
				child.material = blackMaterial;
			}
		} );
        object.position.x = 1.6;
        object.position.y = 0.3;
        object.rotation.x = Math.PI/2;
		bike.add( object );
	});
    bike.rotation.y = bikeRotation;
    return bike;
}

function setUpPlayer1(){
    player1 = new THREE.Object3D();
    player1.name = "Player 1";
    var boxGeometry = new THREE.BoxGeometry(1,1,1);

    /*
    box1 = new THREE.Mesh(boxGeometry,wireframeMaterial);
    box1.position.set(0,0.5,-0.5);
    box1.scale.x = 0.5;
    */
    var bike = loadBike("red",Math.PI/2);
    box1.add(bike);

    boxCore1 = new THREE.Mesh(boxGeometry,redMaterial);
    boxCore1.scale.set(0.3,0.8,0.79);
    boxCore1.position.set(0,0.5,-0.5);

    player1.add(box1);
    player1.add(boxCore1) ;
    player1.position.set(0,0,sizeBoard/4);
    scene.add(player1);

    stela1 = new THREE.Mesh(stelaBoxGeometry,redTextureMaterial);
    stela1.scale.z = 0.2;
    stela1.position.y = 0.5;
    stela1.rotation.y = Math.PI/2;
    collidableMeshList.push(stela1);
    scene.add(stela1);
}

function setUpPlayer2(){
    player2 = new THREE.Object3D();
    player2.name = "Player 2";

    var boxGeometry = new THREE.BoxGeometry(1,1,1);
    /*
    box2 = new THREE.Mesh(boxGeometry,wireframeMaterial);
    box2.position.set(0,0.5,+0.5);
    box2.scale.x = 0.5;
    */
    box2 = loadBike("blue", -Math.PI/2);

    boxCore2 = new THREE.Mesh(boxGeometry,blueMaterial);
    boxCore2.scale.set(0.3,0.8,0.79);
    boxCore2.position.set(0,0.5,+0.5);

    player2.add(box2);
    player2.add(boxCore2) ;
    player2.position.set(0,0,-sizeBoard/4);
    scene.add(player2);

    stela2 = new THREE.Mesh(stelaBoxGeometry,blueTextureMaterial);
    stela2.scale.z = 0.2;
    stela2.position.y = 0.5;
    stela2.rotation.y = Math.PI/2;
    collidableMeshList.push(stela2);
    scene.add(stela2);
}

function rotateLeftPlayer(player,num){
    player.rotation.y += Math.PI/2;
    if(num == 1){
        turnPosition1 = player.position.clone();
        newStela(stela1,1);
        dir1.applyAxisAngle(new THREE.Vector3(0,1,0),Math.PI/2);
    }else{
        turnPosition2 = player.position.clone();
        newStela(stela2,2);
        dir2.applyAxisAngle(new THREE.Vector3(0,1,0),Math.PI/2);

    }
}

function rotateRightPlayer(player,num){
    player.rotation.y -= Math.PI/2;
    if(num == 1){
        turnPosition1 = player.position.clone();
        newStela(stela1,1);
        dir1.applyAxisAngle(new THREE.Vector3(0,1,0),-Math.PI/2);

    }else{
        turnPosition2 = player.position.clone();
        newStela(stela2,2);
        dir2.applyAxisAngle(new THREE.Vector3(0,1,0),-Math.PI/2);
    }
}

function manageInput(event){
    //A
    if(event.keyCode == 65){
        rotateLeftPlayer(player1,1);
    }
    //D
    if(event.keyCode == 68){
        rotateRightPlayer(player1,1);
    }
    //Left
    if(event.keyCode == 37){
        rotateLeftPlayer(player2,2);
    }
    //Right
    if(event.keyCode == 39){
        rotateRightPlayer(player2,2);
    }
    //Space
    if (event.keyCode == 32){
        if(!FLAG_INIT_GAME){
            if(FLAG_PAUSE)
                FLAG_PAUSE = false;
            else {
                FLAG_PAUSE = true;
            }
        }
    }
    //Intro
    if (event.keyCode == 13){
        if(FLAG_GAME_OVER){
            location.reload();
        }
        FLAG_INIT_GAME = false;
        cleanTextMenu();
    }
}

function newStela(stela,num){
    if(num == 1){
        stela = new THREE.Mesh(stelaBoxGeometry,redTextureMaterial);
        stela.scale.z = 0.2;
        stela.position.y = 0.5;
        if(dir1.x > 0.1 || dir1.x < -0.1)
            stela.rotation.y = Math.PI/2;
        stela1 = stela;
    }else{
        stela = new THREE.Mesh(stelaBoxGeometry,blueTextureMaterial);
        stela.scale.z = 0.2;
        stela.position.y = 0.5;
        if(dir2.x > 0.1 || dir2.x < -0.1)
            stela.rotation.y = Math.PI/2;
        stela2 = stela;
    }
    collidableMeshList.push(stela);
    scene.add(stela);

}

function animate(){
    stats.begin();
    render();
    if (!FLAG_INIT_GAME && !FLAG_GAME_OVER){
        if (!FLAG_PAUSE)
            update();
        else {
            clock.getDelta();
        }
    }
    stats.end();
    requestAnimationFrame(animate);
}

function updateStela1(delta){
    var m = player1.position.clone().add(turnPosition1).divideScalar(2);
    var disToTurnPoint = player1.position.clone().sub(turnPosition1).divideScalar(2);
    stela1.position.set(m.x,0.5,m.z);
    if(dir1.z > 0.1 || dir1.z < -0.1)
        stela1.scale.x = disToTurnPoint.z * 2;
    else
        stela1.scale.x = disToTurnPoint.x * 2;

}

function updateStela2(delta){
    var m = player2.position.clone().add(turnPosition2).divideScalar(2);
    var disToTurnPoint = player2.position.clone().sub(turnPosition2).divideScalar(2);
    stela2.position.set(m.x,0.5,m.z);
    if(dir2.z > 0.1 || dir2.z < -0.1)
        stela2.scale.x = disToTurnPoint.z * 2;
    else
        stela2.scale.x = disToTurnPoint.x * 2;

}

function updatePlayerPosition(player,num,time){
    var speed;
    if(num == 1){
        speed = dir1.clone();
    }else{
        speed = dir2.clone();
    }
    speed.multiplyScalar(velocity);
    speed.multiplyScalar(time);
    player.position.add(speed);
}

function update(){
    stela1.material.map.repeat.set(stela1.scale.x/5,1)
    stela2.material.map.repeat.set(stela2.scale.x/5,1)
    var delta = clock.getDelta();
    updatePlayerPosition(player1,1,delta);
    updatePlayerPosition(player2,2,delta);
    updateStela1(delta);
    updateStela2(delta);
    checkCollision();
    updateCameras();
}

function updateCameras(){
    camera1.position.set(player1.position.x+10,player1.position.y+5,player1.position.z+30);
    camera1.lookAt(player1.position);
    camera2.position.set(player2.position.x-10,player2.position.y+5,player2.position.z-30);
    camera2.lookAt(player2.position);
}

function checkCollision(){
    checkOutBounder();
    collision(boxCore1,box1,player1);
    collision(boxCore2,box2,player2);
}

function collision(boxCore,box,player){
	var originPoint = boxCore.getWorldPosition().clone();
	for (var vertexIndex = 0; vertexIndex < boxCore.geometry.vertices.length; vertexIndex++)
	{
		var localVertex = boxCore.geometry.vertices[vertexIndex].clone();
        var mt = player.matrix.clone();
        mt.multiply(boxCore.matrix);
        var globalVertex = localVertex.applyMatrix4( mt );
		var directionVector = globalVertex.sub( originPoint );

		var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
		var collisionResults = ray.intersectObjects( collidableMeshList );
		if ( collisionResults.length > 0 && collisionResults[0].distance <= directionVector.length() ){
            //FLAG_PAUSE = true;
            if(player.name == "Player 1"){
                gameOver("Player 2");
            }else{
                gameOver("Player 1");
            }
        }
	}
}

function checkOutBounder(){
    var pos = player1.position.clone();
    if (pos.x < -sizeBoard/2 || pos.x > sizeBoard/2 ||
        pos.z < -sizeBoard/2 || pos.z > sizeBoard/2){
            gameOver("Player 2");
        }
    pos = player2.position.clone();
    if (pos.x < -sizeBoard/2 || pos.x > sizeBoard/2 ||
        pos.z < -sizeBoard/2 || pos.z > sizeBoard/2){
            gameOver("Player 1");
        }
}

function render(){
    if(FLAG_INIT_GAME || FLAG_GAME_OVER){
        renderer.setViewport(0,0,window.innerWidth,window.innerHeight);
        renderer.clear();
        renderer.render(scene,camera);
    }else{
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
    }
}

function displayText(text,size,material,position){
    fontProperties.size = size;
    var textGeo = new THREE.TextGeometry( text, fontProperties);
    var mesh = new THREE.Mesh(textGeo, material);
    textGeo.computeBoundingBox();
    var centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
    mesh.position.set(position.x+centerOffset,position.y,position.z);
    textMenu.add(mesh);
}

function cleanTextMenu(){
    scene.remove(textMenu);
    textMenu = new THREE.Object3D();
    scene.add(textMenu);
}

function gameOver(winner){
    FLAG_GAME_OVER = true;
    fontLoader.load( 'contents/fonts/helvetiker_bold.typeface.json', function ( font ) {
        fontProperties.font = font;
        displayText("GAME OVER",35,orangeMaterial,new THREE.Vector3(1000,1060,1200));
        //Display Winner
        if (winner == "Player 1"){
            displayText(winner + " wins", 15, redMaterial, new THREE.Vector3(1000,980,1200));
        }else{
            displayText(winner + " wins", 15, blueMaterial, new THREE.Vector3(1000,980,1200));
        }
        displayText("(Press Intro to restart)",10,whiteMaterial,new THREE.Vector3(1000,900,1200));
    } );
}

function onResize(){
    renderer.setSize(window.innerWidth, window.innerHeight);
    var aspectRatio = window.innerWidth / window.innerHeight;
    camera1.aspect = 2*aspectRatio;
    camera2.aspect = 2*aspectRatio;
    camera1.updateProjectionMatrix();
    camera2.updateProjectionMatrix();

    camera.aspect = aspectRatio;
    camera.updateProjectionMatrix();
}

//Variables globales consensuadas
var renderer, scene, camera;
var cameraControls;
var clock = new THREE.Clock();

var box;
init();
loadScene();
startAnimation();
render();

function init(){
    //Configurar el motor de renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(new THREE.Color(0x0000AA));
    document.getElementById('container').appendChild(renderer.domElement);

    //Escena
    scene = new THREE.Scene();

    //Camara
    var aspectRatio = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(40, aspectRatio, 1, 2000);
    camera.position.set(350,350,0);
    camera.lookAt(new THREE.Vector3(0,0,0));

    cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
    cameraControls.maxPolarAngle = Math.PI/2;
    cameraControls.target.set(0,0,0);

    document.addEventListener('keydown',manageInput);

}

function manageInput(event){
    //A
    if(event.keyCode == 65){
        box.position.x += 1
    }
    //D
    if(event.keyCode == 68){
        box.position.x -= 1
    }
}
function startAnimation(){
    var mv = new TWEEN.Tween(camera.position).to(box.position, 10000).onUpdate(function(){
        camera.position.set(this.x,this.y,this.z);
    });
    mv.easing(TWEEN.Easing.Bounce.Out);
    mv.interpolation( TWEEN.Interpolation.Bezier );
    mv.start();
}
function loadScene(){
    //LIGHTS
	var ambient = new THREE.AmbientLight( 0x444444 );
	scene.add( ambient );
	var directionalLight = new THREE.DirectionalLight( 0xffeedd );
	directionalLight.position.set( 0, 0, 1 ).normalize();
	scene.add( directionalLight );

    var wireframeMaterial = new THREE.MeshBasicMaterial({color: 'yellow',
                                                wireframe: true});

    var planeGeometry = new THREE.PlaneGeometry(1000,1000,20,20);
    var plane = new THREE.Mesh(planeGeometry,wireframeMaterial);
    plane.rotation.x = Math.PI/2;
    scene.add(plane);

    var boxGeometry = new THREE.BoxGeometry(10,10,10);
    box = new THREE.Mesh(boxGeometry,wireframeMaterial);

    scene.add(box);
    var loader = new THREE.TextureLoader();
    // load a resource
    var texture = loader.load('contents/textures/rim_wall.png');
    var textureMaterial = new THREE.MeshPhongMaterial({color: 0xffffff, side: THREE.DoubleSide, map:texture})
    textureMaterial.wrapS = textureMaterial.wrapT = THREE.RepeatWrapping;

//PRUEBA
/*
	var onProgress = function ( xhr ) {
		if ( xhr.lengthComputable ) {
			var percentComplete = xhr.loaded / xhr.total * 100;
			console.log( Math.round(percentComplete, 2) + '% downloaded' );
		}
	};
	var onError = function ( xhr ) { };
	THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );
	var mtlLoader = new THREE.MTLLoader();
	mtlLoader.setPath( 'contents/models/Batcycle/' );
	mtlLoader.load( 'Batcycle.mtl', function( materials ) {
		materials.preload();
		var objLoader = new THREE.OBJLoader();
		objLoader.setMaterials( materials );
		objLoader.setPath( 'contents/models/Batcycle/' );
		objLoader.load( 'Batcycle.obj', function ( object ) {
            //object.rotation.x = -Math.PI/2;
            object.scale.set(1,1,1);
			scene.add( object );
		}, onProgress, onError );
	});
    */
    /*
    var boxGeometry = new THREE.BoxGeometry(1000,1000,1000);
    var box = new THREE.Mesh(boxGeometry,textureMaterial);
    scene.add(box);
    */
    //Axis Helper
    var axisHelper = new THREE.AxisHelper( 5 );
    scene.add( axisHelper );
}

function update(){
    var time = clock.getDelta();
    TWEEN.update();
}

function render(){
    requestAnimationFrame(render);
    update()
    renderer.render(scene,camera);
}

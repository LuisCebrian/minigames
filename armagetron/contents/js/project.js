
//Variables globales consensuadas
var renderer, scene, camera1, camera2;

init();
loadScene();
render();

function init(){
    //Configurar el motor de renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(new THREE.Color(0x0000AA));
    renderer.autoClear = false;
    document.getElementById('container').appendChild(renderer.domElement);

    //Escena
    scene = new THREE.Scene();

    //Camara
    var aspectRatio = window.innerWidth / window.innerHeight;
    var viewAngle = 45;
    var near = 0.1;
    var far = 20000
    camera1 = new THREE.PerspectiveCamera(viewAngle, aspectRatio, near, far);
    camera1.position.set(0,120,80);
    camera1.lookAt(new THREE.Vector3(0,50,0));
    scene.add(camera1);

    camera2 = new THREE.PerspectiveCamera(viewAngle, aspectRatio, near, far);
    camera2.position.set(0,120,-80);
    camera2.lookAt(new THREE.Vector3(0,50,0));
    scene.add(camera2);
}

function loadScene(){
    var wireframeMaterial = new THREE.MeshBasicMaterial({color: 'yellow',
                                                wireframe: true});

    var planeGeometry = new THREE.PlaneGeometry(1000,1000,20,20);
    var plane = new THREE.Mesh(planeGeometry,wireframeMaterial);
    plane.rotation.x = Math.PI/2;
    scene.add(plane);

    var sphere_geometry = new THREE.SphereGeometry( 35, 5, 5 );
    var sphere = new THREE.Mesh(sphere_geometry,wireframeMaterial);
    sphere.position.set(100,0,0);
    scene.add(sphere);


    //Axis Helper
    var axisHelper = new THREE.AxisHelper( 5 );
    scene.add( axisHelper );
}

function render(){
    requestAnimationFrame(render);
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

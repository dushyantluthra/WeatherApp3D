import '../src/style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


const locationInput = document.getElementById('location-input');
			const city = document.getElementById('city');
			const overall = document.getElementById('overall');
			const overall2 = document.getElementById('overall2');
			const minTemp = document.getElementById('min-temp');
			const maxTemp = document.getElementById('max-temp');
			const imageIcon = document.getElementById('image');
			const currentTemp = document.getElementById('current-temp');
			let lat;
			let long;
            let xVal;
            let yVal;
            let zVal; 

function calcPosFromLatLonRad(lat,lon,radius){
	
var phi   = (90-lat)*(Math.PI/180);
var theta = (lon+180)*(Math.PI/180);

const xPos = -((radius) * Math.sin(phi)*Math.cos(theta));
const zPos = ((radius) * Math.sin(phi)*Math.sin(theta));
const yPos = ((radius) * Math.cos(phi));
    
    
    xVal = xPos
    yVal = yPos
    zVal = zPos
   return [xPos,yPos,zPos];
}
const sizes = {
	width: document.getElementById('right').clientWidth,
	height: document.getElementById('right').clientHeight, 
};

const canvas = document.getElementById('three');
 
			async function getData(params) {
				const url = `http://api.openweathermap.org/data/2.5/weather?q=${params}&appid=6e9b250106dd23d87878f8f7092dfb25`;
				const res = await fetch(url);
				const json = await res.json();
				const { coord, main, name, sys, weather, wind, visibility } = json;
				const icon = `http://openweathermap.org/img/wn/${weather[0].icon}.png`;

				city.textContent = `${name}, ${sys.country}`;
				overall.textContent = `${weather[0].main} | visibility: ${
					visibility / 100
				}%`;
				currentTemp.innerHTML = `${Math.round(
					main.temp - 273
				)}<sup id="sup1">°C</sup>`;

				minTemp.innerHTML = `Min Temp: ${Math.round(
					main.temp_min - 273
				)} <sup id="sup2">°C</sup>`;
				maxTemp.innerHTML = `Max temp: ${Math.round(
					main.temp_max - 273
				)} <sup id="sup2">°C</sup>`;
				overall2.innerHTML = `Wind Speed: ${wind.speed}Km/Hr | Humidity: ${main.humidity}%`;
				imageIcon.innerHTML = `<img src=${icon}>`;
    lat = coord.lat
    long =coord.lon

    calcPosFromLatLonRad(lat, long, 0.5)
markermesh.position.set(xVal, yVal, zVal)                
                

                
			}

			locationInput.addEventListener('change', (e) => {
				getData(e.target.value);
			});

			


            // scene
const scene = new THREE.Scene();

// geometry
const geometry = new THREE.SphereGeometry(0.5, 32, 32);

//texture
const texture = new THREE.TextureLoader().load('/earthmap1k.jpg')
const bump = new THREE.TextureLoader().load('earthbump.jpg')
const cloud = new THREE.TextureLoader().load('earthCloud.png')
const star = new THREE.TextureLoader().load('galaxy.png')
// material
const material = new THREE.MeshPhongMaterial({ 
shininess:1,
map: texture,
bumpMap: bump,
bumpScale:0.5
});

// mesh
const mesh = new THREE.Mesh(geometry, material);

// geometry 2
const geometry2 = new THREE.SphereGeometry(0.52,32,32)
const material2 = new THREE.MeshPhongMaterial({map: cloud, transparent : true, opacity:0.7})
const mesh2 = new THREE.Mesh(geometry2, material2)
scene.add(mesh2)

// marker mesh
const markerGeometry = new THREE.SphereGeometry(0.015,20,20)
const markermaterial = new THREE.MeshBasicMaterial({color: 0xff0000})
const markermesh = new THREE.Mesh(markerGeometry, markermaterial)



 

const meshGroup = new THREE.Group();
meshGroup.add(mesh)
meshGroup.add(markermesh)
scene.add(meshGroup)


const starGeometry = new THREE.SphereGeometry(80,64,64)
const starMaterial = new THREE.MeshBasicMaterial({map: star, side: THREE.BackSide})
const starMesh = new THREE.Mesh(starGeometry, starMaterial)
scene.add(starMesh)


//light source
const lightSource = new THREE.AmbientLight(0xffffff,0.7)
scene.add(lightSource)

const pointLight = new THREE.PointLight(0xffffff, 1)
pointLight.position.set(5,3,5)
scene.add(pointLight)
// camera
const camera = new THREE.PerspectiveCamera(
	60,
	sizes.width / sizes.height,
	1,
	500 
);
scene.add(camera);
camera.position.set(0, 0, 1.7);

// console.log(camera.position.length(mesh.position)) 

//renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas });

renderer.setSize(sizes.width, sizes.height);

const render = () =>{
    renderer.render(scene, camera)
}
const animate = () =>{
    requestAnimationFrame(animate)
    //mesh.rotation.y -= 0.0015 
    //markermesh.position.set(0.10442472571754294, 0.3261436016961024, 0.36431556064970655)  
    meshGroup.rotation.y -= 0.0015
    mesh2.rotation.y -= 0.0030
    starMesh.rotation.y -= 0.0005
    render()  
}


const upd = () => {
	//set width and height
	sizes.width = document.getElementById('right').offsetWidth;
	sizes.height = document.getElementById('right').offsetHeight;

	//update camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix(); //no distortion
	//set renderer size
	renderer.setSize(sizes.width, sizes.height);

	// console.log(camera.position.length(mesh.position)) camera ki position vahi rehti h
	//bass size k hisab se aspect ratio kam ho jati h

	//device pixel ratio
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};

window.addEventListener('resize', upd);

//double click to fullscreen
// const fullcreen_func = () => {
// 	if (!document.fullscreenElement) {
// 		canvas.requestFullscreen();
// 	} else {
// 		document.exitFullscreen();
// 	}
// };

// window.addEventListener('dblclick', fullcreen_func);

// controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false

// pixel ratio : pixel ratio means how much how many physical pixels that you have for one software unit pixel
//sometomes we might see a blurry render or pixelated render because od the
// pixel ratio of devices being more than 1, so we set the limit to pixel ratio for soomth renders
//more pixel ratio means more GPU power going to the render the each part of pixel

//

//animate
// const movement = () => {
// 	camera.lookAt(mesh.position);
// 	controls.update();
// 	renderer.render(scene, camera);
// 	window.requestAnimationFrame(movement);
// };

// movement();

getData(locationInput.value);
animate() 
// Constants
const targetDiv = "projectioncontainer";
const Projection_width = window.innerWidth * 0.7;
const Projection_height = Projection_width / 954 * 600;
const outline = { type: "Sphere" };
const graticule = d3.geoGraticule10();
const worldJsonPath = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const totalDragonballs = 6;
const ease = d3.easeCubicInOut;
const globeColor = "#00820C";
const graticuleColor = "#000";
const landColor = "#000";
const pointColor = "#FEFDDF";
const pointColorSelected = "red";
const pathColor = "orange";
const pathLineWidth = 2;
const pathLineDash = [5, 5];

// Variables
let previousProjection = d3.geoEquirectangularRaw;
let startLat = 50.8503;
let startLng = 4.3517;
let pointLocations = [];
let clickedPointIndex = 0;
let world;
let land;
let points;
let paths;
let currentProjectionIndex;
let animationId;
let currentInterpolation;
let currentRotation = 0;
let glowScale = 2;
let glowDirection = 2;

// Elements
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
const startPointType = document.getElementById('startPointType'); 
const latLngInputs = document.getElementById('latLngInputs'); 
const addressInput = document.getElementById('addressInput'); 
const newStartLat = document.getElementById('newStartLat'); 
const newStartLng = document.getElementById('newStartLng'); 
const startAddress = document.getElementById('startAddress'); 
const updateStartPointBtn = document.getElementById('updateStartPoint');
const movementToggle = document.getElementById('movementToggle');
const interpolationToggle = document.getElementById('interpolationToggle');
const projectionSelect = document.getElementById('projectionSelect');

// Projections
projections = [
    { name: "Aitoff", value: d3.geoAitoffRaw },
    { name: "American polyconic", value: d3.geoPolyconicRaw },
    { name: "August", value: d3.geoAugustRaw },
    { name: "Baker dinomic", value: d3.geoBakerRaw },
    { name: "Boggs’ eumorphic", value: d3.geoBoggsRaw },
    { name: "Bonne", value: d3.geoBonneRaw(Math.PI / 4) },
    { name: "Bottomley", value: d3.geoBottomleyRaw(0.5) },
    { name: "Bromley", value: d3.geoBromleyRaw },
    { name: "Collignon", value: d3.geoCollignonRaw },
    { name: "conic equal-area", value: d3.geoConicEqualAreaRaw(0, Math.PI / 3) },
    { name: "conic equidistant", value: d3.geoConicEquidistantRaw(0, Math.PI / 3) },
    { name: "Craster parabolic", value: d3.geoCrasterRaw },
    { name: "cylindrical equal-area", value: d3.geoCylindricalEqualAreaRaw(38.58 / 180 * Math.PI) },
    { name: "cylindrical stereographic", value: d3.geoCylindricalStereographicRaw(0) },
    { name: "Eckert I", value: d3.geoEckert1Raw },
    { name: "Eckert II", value: d3.geoEckert2Raw },
    { name: "Eckert III", value: d3.geoEckert3Raw },
    { name: "Eckert IV", value: d3.geoEckert4Raw },
    { name: "Eckert V", value: d3.geoEckert5Raw },
    { name: "Eckert VI", value: d3.geoEckert6Raw },
    { name: "Eisenlohr conformal", value: d3.geoEisenlohrRaw },
    { name: "Equal Earth", value: d3.geoEqualEarthRaw },
    { name: "Equirectangular (plate carrée)", value: d3.geoEquirectangularRaw },
    { name: "Fahey pseudocylindrical", value: d3.geoFaheyRaw },
    { name: "flat-polar parabolic", value: d3.geoMtFlatPolarParabolicRaw },
    { name: "flat-polar quartic", value: d3.geoMtFlatPolarQuarticRaw },
    { name: "flat-polar sinusoidal", value: d3.geoMtFlatPolarSinusoidalRaw },
    { name: "Foucaut’s stereographic equivalent", value: d3.geoFoucautRaw },
    { name: "Foucaut’s sinusoidal", value: d3.geoFoucautSinusoidalRaw(0.5) },
    { name: "Ginzburg V", value: d3.geoGinzburg5Raw },
    { name: "Ginzburg VI", value: d3.geoGinzburg6Raw },
    { name: "Ginzburg VIII", value: d3.geoGinzburg8Raw },
    { name: "Ginzburg IX", value: d3.geoGinzburg9Raw },
    { name: "Goode’s homolosine", value: d3.geoHomolosineRaw },
    { name: "Hammer", value: d3.geoHammerRaw(2) },
    { name: "Hill eucyclic", value: d3.geoHillRaw(1) },
    { name: "Hufnagel pseudocylindrical", value: d3.geoHufnagelRaw(1, 0, Math.PI / 4, 2) },
    { name: "Kavrayskiy VII", value: d3.geoKavrayskiy7Raw },
    { name: "Lagrange conformal", value: d3.geoLagrangeRaw(0.5) },
    { name: "Larrivée", value: d3.geoLarriveeRaw },
    { name: "Laskowski tri-optimal", value: d3.geoLaskowskiRaw },
    { name: "Loximuthal", value: d3.geoLoximuthalRaw(40 / 180 * Math.PI) },
    { name: "Miller cylindrical", value: d3.geoMillerRaw },
    { name: "Mollweide", value: d3.geoMollweideRaw },
    { name: "Natural Earth", value: d3.geoNaturalEarth1Raw },
    { name: "Natural Earth II", value: d3.geoNaturalEarth2Raw },
    { name: "Nell–Hammer", value: d3.geoNellHammerRaw },
    { name: "Nicolosi globular", value: d3.geoNicolosiRaw },
    { name: "Patterson cylindrical", value: d3.geoPattersonRaw },
    { name: "rectangular polyconic", value: d3.geoRectangularPolyconicRaw(0) },
    { name: "Robinson", value: d3.geoRobinsonRaw },
    { name: "sinusoidal", value: d3.geoSinusoidalRaw },
    { name: "sinu-Mollweide", value: d3.geoSinuMollweideRaw },
    { name: "Times", value: d3.geoTimesRaw },
    { name: "Tobler hyperelliptical", value: d3.geoHyperellipticalRaw(0, 2.5, 1.183136) },
    { name: "Van der Grinten", value: d3.geoVanDerGrintenRaw },
    { name: "Van der Grinten II", value: d3.geoVanDerGrinten2Raw },
    { name: "Van der Grinten III", value: d3.geoVanDerGrinten3Raw },
    { name: "Van der Grinten IV", value: d3.geoVanDerGrinten4Raw },
    { name: "Wagner IV", value: d3.geoWagner4Raw },
    { name: "Wagner VI", value: d3.geoWagner6Raw },
    { name: "Wagner VII", value: d3.geoWagnerRaw(65 / 180 * Math.PI, 60 / 180 * Math.PI, 0, 200) },
    { name: "Wagner VIII", value: d3.geoWagnerRaw(65 / 180 * Math.PI, 60 / 180 * Math.PI, 20, 200) },
    { name: "Werner", value: d3.geoBonneRaw(Math.PI / 2) },
    { name: "Winkel tripel", value: d3.geoWinkel3Raw }
]

// Initialize the map
initializeMap();

function initializeMap() {
    // Set up canvas
    canvas.width = Projection_width;
    canvas.height = Projection_height;
    canvas.style.display = "block";
    canvas.style.maxWidth = "100%";
    canvas.setAttribute('willReadFrequently', 'true');
    document.getElementById(targetDiv).appendChild(canvas);

    // Calculate initial points and paths
    points = calculatePoints(startLat, startLng, totalDragonballs);
    paths = getPathsBetweenPoints(points);

    // Load world data and render the map
    loadWorldData();

    // Set up event listeners
    startPointType.addEventListener('change', handleStartPointTypeChange);
    updateStartPointBtn.addEventListener('click', handleUpdateStartPoint);
    interpolationToggle.addEventListener('change', handleInterpolationToggle);

    // Populate projection dropdown
    populateProjectionDropdown();

    // Start the map animation
    currentProjectionIndex = Math.floor(Math.random() * projections.length);
    update(getRandomProjection());
}

function loadWorldData() {
    fetch(worldJsonPath)
        .then(response => response.json())
        .then(data => {
            world = data;
            land = topojson.feature(world, world.objects.land);
            render(d3.geoProjection(previousProjection), canvas.width, canvas.height, outline, graticule, land);
        })
        .catch(error => {
            console.error("Error loading the JSON data:", error);
        });
}

function drawGlowingPoint(x, y, radius, color, glowColor, glowRadius, isClicked) {
    if (isFinite(x) && isFinite(y) && isFinite(radius) && isFinite(glowRadius)) {
        const currentGlowRadius = glowRadius * (1 + glowScale);
        context.beginPath();
        const gradient = context.createRadialGradient(x, y, radius, x, y, currentGlowRadius);
        gradient.addColorStop(0, isClicked ? pointColorSelected : glowColor);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        context.fillStyle = gradient;
        context.arc(x, y, currentGlowRadius, 0, 2 * Math.PI);
        context.fill();

        context.beginPath();
        context.fillStyle = color;
        context.arc(x, y, radius, 0, 2 * Math.PI);
        context.fill();
    }
}

function render(projection, Projection_width, Projection_height, outline, graticule, land) {
    const path = d3.geoPath(projection, context);
    context.clearRect(0, 0, Projection_width, Projection_height);
    context.save();
    context.beginPath(), path(outline), context.clip(), context.fillStyle = globeColor, context.fillRect(0, 0, Projection_width, Projection_height);
    context.beginPath(), path(land), context.fillStyle = landColor, context.fill();
    context.restore();
    
    // Determine if each point is on land or sea before drawing the points
    if (pointLocations.length === 0) {
        points.forEach((point, index) => {
            const [lng, lat] = point;
            const [x, y] = projection([lng, lat]);
            const pixelData = context.getImageData(x, y, 1, 1).data;
            const isLand = pixelData[0] === 0 && pixelData[1] === 0 && pixelData[2] === 0;
            pointLocations[index] = isLand ? 'Land' : 'Sea';
            document.getElementById(`location-${index}`).textContent = pointLocations[index] || 'Loading...';   
        });
    }
    
    // Draw the graticules after the land/sea check
    context.beginPath(), path(graticule), context.strokeStyle = graticuleColor, context.stroke();
    context.beginPath(), path(outline), context.strokeStyle = graticuleColor, context.stroke();
    
    // Draw the points
    points.forEach((point, index) => {
        const [x, y] = projection(point);
        const isClicked = index === clickedPointIndex;
        drawGlowingPoint(x, y, 5, pointColor, 'rgba(255, 255, 255, 0.5)', 15, isClicked);
    });

    // Draw the paths between points
    if (document.getElementById('showPathsToggle').checked) {
        context.save(); // Save the context state
        paths.forEach(path => {
            context.strokeStyle = pathColor;
            context.lineWidth = pathLineWidth;
            context.setLineDash(pathLineDash);
            context.beginPath();
            path.forEach(point => {
                const [x, y] = projection(point);
                if (isFinite(x) && isFinite(y)) {
                    context.lineTo(x, y);
                }
            });
            context.stroke();
        });
        context.restore(); // Restore the context state
    }
    
    glowScale += 0.01 * glowDirection;
    if (glowScale >= 0.2 || glowScale <= 0) {
        glowDirection *= -1;
    }
}

function getRandomProjection() {
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * projections.length);
    } while (newIndex === currentProjectionIndex);
    currentProjectionIndex = newIndex;
    return projections[newIndex].value;
}

function update(newProjection) {
    const r0 = previousProjection;
    const r1 = newProjection;
    if (r0 === r1) return;
    previousProjection = r1;
    
    if (interpolationToggle.checked) {
      const interpolate = interpolateProjection(r0, r1);
      let j = 1;
      const m = 45;
  
      function animate() {
        const t = Math.min(1, ease(j / m));
        currentInterpolation = interpolate(t);
        currentRotation = movementToggle.checked
          ? performance.now() / 100
          : currentRotation;
        render(
          currentInterpolation.rotate([currentRotation, 0]),
          Projection_width,
          Projection_height,
          outline,
          graticule,
          land
        );
        j++;
        if (j <= m) {
          animationId = requestAnimationFrame(animate);
        } else {
          const randomProjection = getRandomProjection();
          update(randomProjection);
        }
      }
  
      animate();
    } else {
      currentInterpolation = d3.geoProjection(r1)
        .fitExtent([[0, 0], [Projection_width, Projection_height]], outline);
      currentRotation = movementToggle.checked
        ? performance.now() / 100
        : currentRotation;
      render(
        currentInterpolation.rotate([currentRotation, 0]),
        Projection_width,
        Projection_height,
        outline,
        graticule,
        land
      );
      animationId = requestAnimationFrame(rotateAnimation);
    }
  }
  
  function getProjectionName(projectionFunction) {
    const projectionObject = projections.find(projection => projection.value === projectionFunction);
    return projectionObject ? projectionObject.name : "Unknown";
  }

function rotateAnimation() {
    currentRotation = movementToggle.checked ? performance.now() / 100 : currentRotation;
    render(currentInterpolation.rotate([currentRotation, 0]), Projection_width, Projection_height, outline, graticule, land);
    animationId = requestAnimationFrame(rotateAnimation);
}

function calculatePoints(startLat, startLng, n) {
    pointLocations = []; 
    const points = [[startLng, startLat]];
    
    for (let i = 1; i <= n; i++) {
        const lat = Math.random() * 180 - 90;
        const lng = Math.random() * 360 - 180;
        points.push([lng, lat]);
    }
    
    const numIterations = 1000;
    const stepSize = 30;
    
    for (let iter = 0; iter < numIterations; iter++) {
        for (let i = 1; i < points.length; i++) {
            let maxDistance = 0;
            let bestPoint = points[i];
            
            for (let dx = -stepSize; dx <= stepSize; dx += stepSize) {
                for (let dy = -stepSize; dy <= stepSize; dy += stepSize) {
                    const newLat = points[i][1] + dy;
                    const newLng = points[i][0] + dx;
                    
                    let minDistance = Infinity;
                    for (let j = 0; j < points.length; j++) {
                        if (i !== j) {
                            const distance = getDistance([newLng, newLat], points[j]);
                            minDistance = Math.min(minDistance, distance);
                        }
                    }
                    
                    if (minDistance > maxDistance) {
                        maxDistance = minDistance;
                        bestPoint = [newLng, newLat];
                    }
                }
            }
            
            points[i] = bestPoint;
        }
    }
    
    const locationList = document.getElementById('locationList'); 
    locationList.innerHTML = '';

    points.forEach((point, index) => {
        const [lng, lat] = point;
        const listItem = document.createElement('li');
        listItem.innerHTML = `<strong>Dragonball ${index + 1}:</strong><br>
            Latitude: ${lat.toFixed(2)}, Longitude: ${lng.toFixed(2)}<br>
            Elevation: <span id="elevation-${index}">Loading...</span><br>
            Location: <span id="location-${index}">Loading...</span>`;
        locationList.appendChild(listItem);
        listItem.addEventListener('click', () => {
            clickedPointIndex = index;
            update(previousProjection);
        });

        setTimeout(() => {
            const elevationUrl = `https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lng}`;
            fetch(elevationUrl)
                .then(response => response.json())
                .then(data => {
                    const elevation = data.results[0].elevation;
                    document.getElementById(`elevation-${index}`).textContent = `${elevation.toFixed(2)} meters`;
                })
                .catch(error => {
                    console.error('Error fetching elevation data:', error);
                    document.getElementById(`elevation-${index}`).textContent = 'N/A';
                });
        }, index * 1000);

        document.getElementById(`location-${index}`).textContent = pointLocations[index] || 'Loading...';
    });

    return points;
}

function isPointOnLand(lng, lat) {
    const [x, y] = currentInterpolation([lng, lat]);
    const pixelData = context.getImageData(x, y, 1, 1).data;
    return pixelData[0] === 0 && pixelData[1] === 0 && pixelData[2] === 0;
}

function getDistance(point1, point2) {
    const [lng1, lat1] = point1;
    const [lng2, lat2] = point2;
    
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = 6371 * c;
    
    return distance;
}

function getPathsBetweenPoints(points) {
    const paths = [];
    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            const interpolator1 = d3.geoInterpolate(points[0], points[i]);
            const interpolator2 = d3.geoInterpolate(points[i], points[j]);
            const numPoints = 50;
            const path1 = [];
            const path2 = [];
            for (let t = 0; t <= 1; t += 1 / numPoints) {
                path1.push(interpolator1(t));
                path2.push(interpolator2(t));
            }
            paths.push(path1);
            paths.push(path2);
        }
    }
    return paths;
}   

function interpolateProjection(raw0, raw1) {
    const { scale: scale0, translate: translate0 } = fit(raw0);
    const { scale: scale1, translate: translate1 } = fit(raw1);
    return t => d3.geoProjection((x, y) => lerp2(raw0(x, y), raw1(x, y), t))
        .scale(lerp1(scale0, scale1, t))
        .translate(lerp2(translate0, translate1, t))
        .precision(0.1);
}

function lerp1(x0, x1, t) {
    return (1 - t) * x0 + t * x1;
}

function lerp2([x0, y0], [x1, y1], t) {
    return [(1 - t) * x0 + t * x1, (1 - t) * y0 + t * y1];
}

function fit(raw) {
    const p = d3.geoProjection(raw).fitExtent([[0.5, 0.5], [Projection_width - 0.5, Projection_height - 0.5]], outline);
    return { scale: p.scale(), translate: p.translate() };
}

function handleStartPointTypeChange() {
    if (startPointType.value === 'latLng') {
        latLngInputs.style.display = 'block';
        addressInput.style.display = 'none';
    } else {
        latLngInputs.style.display = 'none';
        addressInput.style.display = 'block';
    }
}

function handleUpdateStartPoint() {
    if (startPointType.value === 'latLng') {
        startLat = parseFloat(newStartLat.value);
        startLng = parseFloat(newStartLng.value);
        points = calculatePoints(startLat, startLng, totalDragonballs);
        clickedPointIndex = 0;
        paths = getPathsBetweenPoints(points);
        update(previousProjection);
        } else {
        const address = startAddress.value;
        geocodeAddress(address)
        .then(([lat, lng]) => {
        startLat = lat;
        startLng = lng;
        points = calculatePoints(startLat, startLng, totalDragonballs);
        paths = getPathsBetweenPoints(points);
        update(previousProjection);
        })
        .catch(error => {
        console.error('Geocoding error:', error);
        });
        }
        }
        
        function handleInterpolationToggle() {
        if (!interpolationToggle.checked) {
        cancelAnimationFrame(animationId);
        animationId = requestAnimationFrame(rotateAnimation);
        } else {
        update(getRandomProjection());
        }
        }
        
        function populateProjectionDropdown() {
            projections.forEach(projection => {
              const encodedName = encodeURIComponent(projection.name);
              const option = document.createElement('option');
              option.value = encodedName;
              option.text = projection.name;
              projectionSelect.add(option);
            });
          
            projectionSelect.addEventListener('change', () => {
              const encodedSelectedProjectionName = projectionSelect.value;
              const selectedProjectionName = decodeURIComponent(encodedSelectedProjectionName);
          
              const selectedProjection = projections.find(projection => projection.name === selectedProjectionName);
              update(selectedProjection.value);

            });
          }

        function geocodeAddress(address) {
        const geocodingUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
        return fetch(geocodingUrl)
        .then(response => response.json())
        .then(data => {
        if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        return [lat, lng];
        } else {
        throw new Error('No geocoding results found');
        }
        });
        }
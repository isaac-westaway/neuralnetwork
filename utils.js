const graphWidth = 974;
const graphHeight = 476;

function normalizeX(input) {
  const normalized = (input - (graphWidth / 2)) / (graphWidth / 2);
  return normalized;
}

function normalizeY(input) {
  const normalized = (input - (graphHeight / 2)) / (graphHeight / 2);
  return normalized;
}

function nearestpoint(x, y, array_of_points) {
  let point_distance = Infinity;
  let index_of_point = 0;

  for (let i = 0; i < array_of_points.length; i++) {
      let k = Math.sqrt((Math.pow((array_of_points[i][0] - x), 2)) + (Math.pow((array_of_points[i][1] - y), 2)));
      if (k < point_distance) {
          point_distance = k;
          index_of_point = i;
      }
  }

  return index_of_point;
}

async function fetchPoints(points) {
  const res = await fetch(`http://localhost:3000/${points}`)
  const body = await res.json();
      
  return body;
}

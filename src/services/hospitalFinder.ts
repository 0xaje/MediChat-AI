export async function findNearbyHospitals(
  location: string
) {

  // later:
  // Google Maps API
  // OpenStreetMap
  // Mapbox

  const hospitals: Record<string, string[]> = {
    "london": ["University College Hospital", "St Mary's Hospital", "Guy's Hospital"],
    "new york": ["Mount Sinai Hospital", "NYU Langone Health", "NewYork-Presbyterian"],
    "lagos": ["Lagos University Teaching Hospital", "Reddington Hospital", "St. Nicholas Hospital"],
  };

  const normalized = location.toLowerCase().trim();
  
  for (const [key, list] of Object.entries(hospitals)) {
    if (normalized.includes(key)) return list;
  }

  return [
    "General Medical Center",
    "City Central Hospital",
    "Community Health Clinic",
  ];
}


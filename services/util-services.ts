export const requestLocationPermission = (): Promise<{ latitude: number; longitude: number; address: string }> => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
              );
              const data = await response.json();
              const address = data.display_name;
              resolve({ latitude, longitude, address });
            } catch (error) {
              console.error("Error fetching address:", error);
              reject("Failed to fetch address");
            }
          },
          (error) => {
            console.error("Error getting location:", error);
            reject("Failed to get location");
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
        reject("Geolocation is not supported by this browser");
      }
    });
  };
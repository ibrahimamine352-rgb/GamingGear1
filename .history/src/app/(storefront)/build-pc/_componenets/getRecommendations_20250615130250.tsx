export async function getRecommendations(features:any) {
  const featureCols = [
    'CPU_Core_Count',
    'CPU_Performance_Core_Clock',
    'Memory_Speed',
    'Video Card_Memory',
    'Power Supply_Wattage'
  ];

  // Validate input features
  const validFeatures:any = {};
  featureCols.forEach(col => {
    if (features[col] !== undefined) {
      validFeatures[col] = features[col];
    }
  });

  try {
    const response = await fetch('http://127.0.0.1:5000/recommend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validFeatures),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Type checking for the response
    if (!data.message || !data.recommendations || !Array.isArray(data.recommendations.knn)) {
      throw new Error('Invalid response format from server');
    }

    return {
      message: data.message,
      recommendations: data.recommendations.knn.map((build: { [x: string]: any; CPU_Core_Count: any; CPU_Performance_Core_Clock: any; Memory_Speed: any; }) => ({
        buildTitle: build['Build Title'],
        cpuCoreCount: build.CPU_Core_Count,
        cpuClock: build.CPU_Performance_Core_Clock,
        memorySpeed: build.Memory_Speed,
        powerSupplyWattage: build['Power Supply_Wattage'],
        videoCardMemory: build['Video Card_Memory']
      }))
    };
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw error;
  }
}
// src/app/(storefront)/build-pc/_componenets/getRecommendations.tsx

const RECO_API_BASE =
  process.env.NEXT_PUBLIC_RECO_API_URL || ""; // leave empty if no API in prod

type RawBuild = {
  [key: string]: any;
  CPU_Core_Count: any;
  CPU_Performance_Core_Clock: any;
  Memory_Speed: any;
};

type RecommendationResult = {
  message: string;
  recommendations: {
    buildTitle: string;
    cpuCoreCount: any;
    cpuClock: any;
    memorySpeed: any;
    powerSupplyWattage: any;
    videoCardMemory: any;
  }[];
};

export async function getRecommendations(features: any): Promise<RecommendationResult> {
  const featureCols = [
    "CPU_Core_Count",
    "CPU_Performance_Core_Clock",
    "Memory_Speed",
    "Video Card_Memory",
    "Power Supply_Wattage",
  ];

  // 1) Validate input features
  const validFeatures: Record<string, any> = {};
  featureCols.forEach((col) => {
    if (features && features[col] !== undefined) {
      validFeatures[col] = features[col];
    }
  });

  // 2) If no API URL configured, just return empty list (no crash)
  if (!RECO_API_BASE) {
    console.warn(
      "NEXT_PUBLIC_RECO_API_URL not set. Skipping recommendation API call."
    );
    return {
      message: "Recommendation service unavailable",
      recommendations: [],
    };
  }

  try {
    const response = await fetch(`${RECO_API_BASE}/recommend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validFeatures),
    });

    if (!response.ok) {
      console.error("Recommendation API HTTP error:", response.status);
      return {
        message: "Recommendation service unavailable",
        recommendations: [],
      };
    }

    const data = await response.json();

    // 3) Validate response format
    const knn = data?.recommendations?.knn;
    if (!Array.isArray(knn)) {
      console.error("Invalid recommendation response format:", data);
      return {
        message: "Recommendation service unavailable",
        recommendations: [],
      };
    }

    // 4) Map raw builds to your internal shape
    const recommendations = knn.map((build: RawBuild) => ({
      buildTitle: build["Build Title"],
      cpuCoreCount: build.CPU_Core_Count,
      cpuClock: build.CPU_Performance_Core_Clock,
      memorySpeed: build.Memory_Speed,
      powerSupplyWattage: build["Power Supply_Wattage"],
      videoCardMemory: build["Video Card_Memory"],
    }));

    return {
      message: data.message ?? "OK",
      recommendations,
    };
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    // 5) On any error, return empty recommendations instead of throwing
    return {
      message: "Recommendation service unavailable",
      recommendations: [],
    };
  }
}

import { z } from 'zod';

// Define the schema for our data
export const DataPointSchema = z.object({
  id: z.string(),
  features: z.record(z.number()),
  label: z.number().optional(),
});

export type DataPoint = z.infer<typeof DataPointSchema>;

// Function to handle missing values
export const handleMissingValues = (
  data: DataPoint[],
  strategy: 'mean' | 'median' | 'mode' | 'drop' = 'mean'
): DataPoint[] => {
  if (strategy === 'drop') {
    return data.filter(point => 
      Object.values(point.features).every(value => value !== null && value !== undefined)
    );
  }

  const processedData = [...data];
  const featureNames = Object.keys(data[0].features);

  featureNames.forEach(feature => {
    const values = data.map(point => point.features[feature]);
    const validValues = values.filter(v => v !== null && v !== undefined) as number[];

    let replacementValue: number;
    let sorted: number[];
    let counts: Record<number, number>;
    
    switch (strategy) {
      case 'mean':
        replacementValue = validValues.reduce((a, b) => a + b, 0) / validValues.length;
        break;
      case 'median':
        sorted = [...validValues].sort((a, b) => a - b);
        replacementValue = sorted[Math.floor(sorted.length / 2)];
        break;
      case 'mode':
        counts = validValues.reduce((acc, val) => {
          acc[val] = (acc[val] || 0) + 1;
          return acc;
        }, {} as Record<number, number>);
        replacementValue = Number(Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]);
        break;
    }

    processedData.forEach(point => {
      if (point.features[feature] === null || point.features[feature] === undefined) {
        point.features[feature] = replacementValue;
      }
    });
  });

  return processedData;
};

// Function to detect and handle outliers using IQR method
export const handleOutliers = (
  data: DataPoint[],
  threshold: number = 1.5
): DataPoint[] => {
  const processedData = [...data];
  const featureNames = Object.keys(data[0].features);

  featureNames.forEach(feature => {
    const values = data.map(point => point.features[feature]);
    const sorted = [...values].sort((a, b) => a - b);
    
    const q1 = sorted[Math.floor(sorted.length * 0.25)];
    const q3 = sorted[Math.floor(sorted.length * 0.75)];
    const iqr = q3 - q1;
    
    const lowerBound = q1 - threshold * iqr;
    const upperBound = q3 + threshold * iqr;

    processedData.forEach(point => {
      if (point.features[feature] < lowerBound) {
        point.features[feature] = lowerBound;
      } else if (point.features[feature] > upperBound) {
        point.features[feature] = upperBound;
      }
    });
  });

  return processedData;
};

// Function to normalize features using Min-Max scaling
export const normalizeFeatures = (
  data: DataPoint[]
): DataPoint[] => {
  const processedData = [...data];
  const featureNames = Object.keys(data[0].features);

  featureNames.forEach(feature => {
    const values = data.map(point => point.features[feature]);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;

    processedData.forEach(point => {
      point.features[feature] = (point.features[feature] - min) / range;
    });
  });

  return processedData;
};

// Function to split data into training and testing sets
export const splitData = (
  data: DataPoint[],
  testSize: number = 0.2
): { train: DataPoint[]; test: DataPoint[] } => {
  const shuffled = [...data];
  
  // Simple Fisher-Yates shuffle
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const splitIndex = Math.floor(shuffled.length * (1 - testSize));
  
  return {
    train: shuffled.slice(0, splitIndex),
    test: shuffled.slice(splitIndex)
  };
};

// Example usage:
/*
const processedData = handleMissingValues(rawData, 'mean');
const outlierHandledData = handleOutliers(processedData);
const normalizedData = normalizeFeatures(outlierHandledData);
const { train, test } = splitData(normalizedData, 0.2);
*/ 
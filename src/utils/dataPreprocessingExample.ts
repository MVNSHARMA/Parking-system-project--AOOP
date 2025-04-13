import { DataPoint, handleMissingValues, handleOutliers, normalizeFeatures, splitData } from './dataPreprocessing';

// Sample data with some missing values and outliers
const sampleData: DataPoint[] = [
  {
    id: '1',
    features: {
      age: 25,
      income: 50000,
      experience: 3
    },
    label: 1
  },
  {
    id: '2',
    features: {
      age: 30,
      income: 60000,
      experience: 5
    },
    label: 1
  },
  {
    id: '3',
    features: {
      age: 35,
      income: null as unknown as number, // Missing value
      experience: 7
    },
    label: 0
  },
  {
    id: '4',
    features: {
      age: 40,
      income: 1000000, // Outlier
      experience: 10
    },
    label: 0
  },
  {
    id: '5',
    features: {
      age: 45,
      income: 70000,
      experience: 12
    },
    label: 1
  }
];

// Example usage of preprocessing functions
const processedData = handleMissingValues(sampleData, 'mean');
console.log('After handling missing values:', processedData);

const outlierHandledData = handleOutliers(processedData);
console.log('After handling outliers:', outlierHandledData);

const normalizedData = normalizeFeatures(outlierHandledData);
console.log('After normalization:', normalizedData);

const { train, test } = splitData(normalizedData, 0.2);
console.log('Training set:', train);
console.log('Testing set:', test); 
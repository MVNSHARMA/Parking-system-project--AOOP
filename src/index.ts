import { DataPoint, handleMissingValues, handleOutliers, normalizeFeatures, splitData } from './utils/dataPreprocessing';

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

// Run the preprocessing pipeline
console.log('Original Data:');
console.log(JSON.stringify(sampleData, null, 2));

const processedData = handleMissingValues(sampleData, 'mean');
console.log('\nAfter handling missing values:');
console.log(JSON.stringify(processedData, null, 2));

const outlierHandledData = handleOutliers(processedData);
console.log('\nAfter handling outliers:');
console.log(JSON.stringify(outlierHandledData, null, 2));

const normalizedData = normalizeFeatures(outlierHandledData);
console.log('\nAfter normalization:');
console.log(JSON.stringify(normalizedData, null, 2));

const { train, test } = splitData(normalizedData, 0.2);
console.log('\nTraining set:');
console.log(JSON.stringify(train, null, 2));
console.log('\nTesting set:');
console.log(JSON.stringify(test, null, 2)); 
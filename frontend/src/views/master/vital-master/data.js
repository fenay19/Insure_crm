const respiratoryData = {
  heading: 'Respiratory Rate (RR)',
  parameters: ['Depth of Breathing', 'Pattern of Breathing'],
  'Depth of Breathing': {
    type: 'chip',
    options: ['Normal', 'Hyperpnea', 'Hyperventilation']
  },
  'Pattern of Breathing': {
    type: 'chip',
    options: ['Normal', 'Biot’s respiration', 'Cheyne-Stokes respiration', 'Kussmaul’s breathing', 'Orthopnea', 'Paradoxical ventilation']
  }
};
const pulseData = {
  heading: 'Pulse (Radial)/Heart Rate',
  parameters: ['Rhythm', 'Volume', 'Symmetry', 'Amplitude and Rate of Increase'],
  Rhythm: {
    type: 'chip',
    options: ['Regular', 'Irregular']
  },
  Volume: {
    type: 'chip',
    options: ['Normal', 'Low', 'High']
  },
  Symmetry: {
    type: 'chip',
    options: ['Asymmetrical', 'Symmetrical on Both sides']
  },
  'Amplitude and Rate of Increase': {
    type: 'chip',
    options: ['Normal', 'Low', 'High']
  }
};

const bpdata = {
  heading: 'Blood Pressure (BP)',
  Methods: {
    type: 'checkbox',
    options: ['Systolic', 'Diastolic']
  }
};

const painData = {
  heading: 'Pain', // Single Heading for the Pain section
  Methods: {
    type: 'checkbox',
    options: ['Mild', 'Moderate', 'Severe', 'Very Severe', 'Worst Possible'] // Methods for pain intensity
  },
  parameters: ['Nature of Pain', 'Duration/Timing', 'Location', 'Aggravating Factors', 'Relieving Factors', 'Quality'], // parameters for pain
  'Nature of Pain': {
    type: 'chip',
    options: ['Localized', 'Generalized', 'Radiating']
  },
  'Duration/Timing': {
    type: 'chip',
    options: ['Acute', 'Chronic', 'Constant', 'Intermittent']
  },
  Location: {
    type: 'chip',
    options: ['Superficial', 'Deep']
  },
  'Aggravating Factors': {
    type: 'chip',
    options: ['Movement', 'Eating', 'Light', 'Heat', 'Cold']
  },
  'Relieving Factors': {
    type: 'chip',
    options: ['Rest', 'Ointment', 'Specific Posture']
  },
  Quality: {
    type: 'chip',
    options: ['Sharp', 'Dull', 'Stabbing', 'Burning', 'Pricking']
  }
};

const painDataForChiefComplaint = {
  heading: 'Pain', // Single Heading for the Pain section

  parameters: ['Nature of Pain', 'Duration/Timing', 'Location', 'Aggravating Factors', 'Relieving Factors', 'Quality'], // parameters for pain
  'Nature of Pain': {
    type: 'chip',
    options: ['Localized', 'Generalized', 'Radiating']
  },
  'Duration/Timing': {
    type: 'chip',
    options: ['Acute', 'Chronic', 'Constant', 'Intermittent']
  },
  Location: {
    type: 'chip',
    options: ['Superficial', 'Deep']
  },
  'Aggravating Factors': {
    type: 'chip',
    options: ['Movement', 'Eating', 'Light', 'Heat', 'Cold']
  },
  'Relieving Factors': {
    type: 'chip',
    options: ['Rest', 'Ointment', 'Specific Posture']
  },
  Quality: {
    type: 'chip',
    options: ['Sharp', 'Dull', 'Stabbing', 'Burning', 'Pricking']
  }
};
const tempData = {
  heading: 'Temperature',
  Methods: {
    type: 'checkbox',
    options: ['Oral', 'Axial', 'Rectal', 'Skin']
  },
  // parameters: ['Fahrenheit (F)', 'Degree Celsius'],
  // 'Fahrenheit (F)': {
  //   type: 'chip',
  //   options: ['97.8 F - 99.1 F']
  // },
  // 'Degree Celsius': {
  //   type: 'chip',
  //   options: ['36.11 °C - 37.27 °C']
  // },
  input: {
    label: 'Enter Value'
  }
};

const bmiData = {
  heading: 'Body Mass Index (BMI)', // Single Heading for BMI
  Methods: {
    type: 'checkbox',
    options: ['Normal', 'Underweight', 'Overweight', 'Obesity']
  }
};
const bmiVital = {
  heading: 'Body Mass Index (BMI)', // Single Heading for BMI
 
};
function calculateBMI(weightKg, heightCm) {
  if (!weightKg || !heightCm) return null; // Handle missing values

  let heightM = heightCm / 100; // Convert cm to meters
  let bmi = weightKg / (heightM * heightM);
  return bmi.toFixed(2); // Return BMI with 2 decimal places
}



const respiratoryRate = {
  heading: 'Respiratory Rate (RR)',
  parameters: [
    {
      name: 'Depth of Breathing',
      type: 'chip',
      options: ['Normal', 'Hyperpnea', 'Hyperventilation']
    },
    {
      name: 'Pattern of Breathing',
      type: 'chip',
      options: [
        'Normal',
        'Biot’s respiration',
        'Cheyne-Stokes respiration',
        'Kussmaul’s breathing',
        'Orthopnea',
        'Paradoxical ventilation'
      ]
    }
  ]
};

const pulseRate = {
  heading: 'Pulse (Radial)/Heart Rate',
  parameters: [
    {
      name: 'Rhythm',
      type: 'chip',
      options: ['Regular', 'Irregular']
    },
    {
      name: 'Volume',
      type: 'chip',
      options: ['Normal', 'Low', 'High']
    },
    {
      name: 'Symmetry',
      type: 'chip',
      options: ['Asymmetrical', 'Symmetrical on Both sides']
    },
    {
      name: 'Amplitude and Rate of Increase',
      type: 'chip',
      options: ['Normal', 'Low', 'High']
    }
  ]
};

export { pulseData, respiratoryData, bpdata, painData, tempData, bmiData, painDataForChiefComplaint, calculateBMI ,respiratoryRate,pulseRate};

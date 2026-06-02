export const data = {
  totalPatients: 500,
  ipd: { cash: 200, credit: 500 },
  bedPosition: {
    totalBed: 200,
    vacant: 50,
    toBeDischarged: 30,
    occupied: 120,
    maintenance: 10
  },
  ipdRevenue: 500,
  receipt: { cash: 500, credit: 500 },
  discharge: 30,
  death: 10,
  dama: 20
};

export const floorsData = [
  {
    name: 'First Floor',
    rooms: [
      { name: 'Private room | 1', background: '#90EE90' },
      { name: 'Semi-private room | 2', background: '#ffff80' },
      { name: 'General ward Female GW1', background: '#ff4d4d' }
    ]
  },
  {
    name: 'Second Floor',
    rooms: [
      { name: 'General ward Male GW2', background: '#ff4d4d' },
      { name: 'General ward Pediatric GW3', background: '#ff4d4d' },
      { name: 'Private room 1,3', background: '#d9d9d9' }
    ]
  }
];

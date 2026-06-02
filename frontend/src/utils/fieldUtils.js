export const generateId = () => Math.random().toString(36).substr(2, 9);

export const createEmptyField = () => ({
  id: generateId(),
  name: '',
  type: 'single',
  children: [],
});

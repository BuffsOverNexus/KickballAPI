export default function getRandomNumber(min: number, max: number): number {
  // Generate a random number between 0 (inclusive) and 1 (exclusive)
  const random = Math.random();

  // Scale the random number to fit within the desired range
  const scaledRandom = random * (max - min);

  // Shift the scaled number to start from the 'min' value
  const result = scaledRandom + min;

  return Math.floor(result); // Use Math.floor to get an integer result
}

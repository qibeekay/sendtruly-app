export function parsePhoneNumbers(inputString) {
  // Split the input string by commas
  const numbersArray = inputString.split(",");

  // Trim whitespaces from each phone number
  const trimmedNumbers = numbersArray.map((number) => number.trim());

  // Filter out empty strings
  const validNumbers = trimmedNumbers.filter((number) => number !== "");

  return validNumbers;
}


export function unparsePhoneNumbers(numbersArray) {
  // Join the array elements using commas
  const formattedString = numbersArray.join(', ');

  return formattedString;
}
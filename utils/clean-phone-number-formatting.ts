export function cleanPhoneNumberFormatting(phoneNumber: string): string {
  return phoneNumber
    .replace(/\s+/g, '') // Remove all spaces
    .replace(/^\+/, '00') // Replace leading '+' with '00'
    .replace(/[()]/g, ''); // Remove parentheses
}

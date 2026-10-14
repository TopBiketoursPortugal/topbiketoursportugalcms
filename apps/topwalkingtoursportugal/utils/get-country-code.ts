import CountryData from '@ttp/data/countries.json';

export function getCountryCode(country: string = ''): string | null {
  if (country?.trim().length === 0) {
    return null;
  }

  const countryCodes = CountryData.filter(
    (c) =>
      c.englishName.toLocaleLowerCase() ===
        country?.toLocaleLowerCase().trim() ||
      c.portugueseName.toLocaleLowerCase() ===
        country?.toLocaleLowerCase().trim() ||
      c.englishName.toLocaleLowerCase() ===
        country?.toLocaleLowerCase().split(',')?.at(-1)?.trim() ||
      c.portugueseName.toLocaleLowerCase() ===
        country?.toLocaleLowerCase().split(',')?.at(-1)?.trim() ||
      c.alpha3.toLocaleLowerCase() === country?.toLocaleLowerCase() ||
      c.alpha3.toLocaleLowerCase() ===
        country?.toLocaleLowerCase().split(',')?.at(-1)?.trim()
  );

  if (countryCodes?.length === 0) {
    return null;
  }

  return countryCodes[0]?.alpha2;
}

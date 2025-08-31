import { z } from 'astro:content';

export function unionOfLiterals<T extends string | number>(
  constants: ReadonlyArray<T>
) {
  const literals = constants.map(
    (x) => z.literal(x) satisfies z.ZodLiteral<T>
  ) as unknown as readonly [
    z.ZodLiteral<T>,
    z.ZodLiteral<T>,
    ...z.ZodLiteral<T>[]
  ];

  return z.union(literals);
}

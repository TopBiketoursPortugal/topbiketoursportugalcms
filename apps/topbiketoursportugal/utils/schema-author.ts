/**
 * Resolve a blog `author` frontmatter string into a schema.org author node.
 *
 * The field is free text typed in CloudCannon, so across the two blogs it holds
 * at least five different kinds of thing:
 *
 *   - nothing at all
 *   - a CMS placeholder ("Admin")
 *   - the name of a group ("Top Bike Tours Portugal Editorial Team")
 *   - an English byline ("Written by Sérgio Marques, Founder & Route Designer,
 *     Top Bike Tours Portugal")
 *   - a Portuguese one ("Escrito por Sérgio Marques")
 *
 * …plus the results of a placeholder and a byline being concatenated by a
 * folded YAML block ("AdminWritten by Sérgio Marques").
 *
 * Previously all of these were emitted as `Person.name` verbatim, which made
 * the editorial team and the string "Admin" into people, and — because the
 * byline varies by a stray space or comma between posts — turned one founder
 * into several distinct persons in the entity graph.
 */

/**
 * Not people: groups, and CMS placeholders. Matched against the whole value.
 *
 * The house byline is written in the language of the post, so the English
 * "Editorial Team" alone missed the German, Spanish, French and Dutch forms
 * and turned each of them into a `Person` named after a department.
 */
const NON_PERSON_AUTHORS = [
  /editorial\s*team/i,
  /redaktionsteam/i,
  /equipo\s+editorial/i,
  /[ée]quipe\s+[ée]ditoriale/i,
  /redactie(team)?\s+van/i,
  /^redactie(team)?$/i,
  /^top bike tours portugal$/i,
  /^admin(istrator)?$/i,
  /^author$/i
];

/**
 * Byline lead-ins, in every language the site publishes.
 *
 * Without the German, French and Dutch forms the prefix stayed glued to the
 * name: French posts published `Person.name = "Par Sérgio Marques"` and Dutch
 * ones `"Geschreven door Sérgio Marques"`. Because that string then matched no
 * team member, those posts also lost the `url` back to the author page — so
 * the locales with the most posts had the weakest author entity.
 */
const BYLINE_PREFIX =
  /^(written by|escrito por|geschreven door|[ée]crit par|von|par|by|por|door)\s+/i;

/** The employer, which is already the `publisher`. */
const EMPLOYER = /^top bike tours portugal$/i;

/**
 * A role can end with the connector that introduced the employer — "fundador y
 * diseñador de rutas **de** Top Bike Tours Portugal" leaves a trailing "de"
 * once the employer is stripped. Dangling prepositions read as typos in the
 * knowledge panel.
 */
const TRAILING_CONNECTOR = /[\s,]+(of|de|da|do|du|van|von|bei|chez|di)$/i;

export type SchemaAuthor =
  | { '@type': 'Organization'; '@id': string }
  | { '@type': 'Person'; 'name': string; 'jobTitle'?: string; 'url'?: string };

/**
 * Split a byline into the person and their role.
 *
 * `knownNames` are the team members' names. They are consulted because several
 * bylines have no comma to split on ("Sérgio Marques Founder of Top Bike Tours
 * Portugal"), and a known name is a far more reliable boundary than guessing at
 * where a job title starts.
 */
export function parseByline(
  raw: string,
  knownNames: string[] = []
): { name: string; jobTitle?: string } {
  let cleaned = raw.replace(/\s+/g, ' ').trim();

  // A folded YAML block can weld the placeholder onto the byline that replaced
  // it, with no separator: "AdminWritten by Sérgio Marques".
  cleaned = cleaned.replace(/^admin\s*(?=[A-ZÀ-Þ])/i, '').trim();
  cleaned = cleaned.replace(BYLINE_PREFIX, '').trim();

  // Prefer an exact known name at the start — survives missing punctuation.
  const match = knownNames
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)
    .find((name) => cleaned.toLowerCase().startsWith(name.toLowerCase()));

  if (match) {
    const role = cleaned
      .slice(match.length)
      .replace(/^[\s,;–-]+/, '')
      .replace(
        /[\s,]*(?:de|da|do|du|van|von|of)?\s*top bike tours portugal\s*$/i,
        ''
      )
      .replace(TRAILING_CONNECTOR, '')
      .trim();
    return role ? { name: match, jobTitle: role } : { name: match };
  }

  const parts = cleaned
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
  const [name, ...rest] = parts;
  const role = rest
    .filter((part) => !EMPLOYER.test(part))
    .join(', ')
    .replace(
      /[\s,]*(?:de|da|do|du|van|von|of)?\s*top bike tours portugal\s*$/i,
      ''
    )
    .replace(TRAILING_CONNECTOR, '')
    .trim();

  return role ? { name, jobTitle: role } : { name: name ?? cleaned };
}

/**
 * @param author         raw frontmatter value
 * @param organisationId canonical Organization `@id` — one per site, never per
 *                       locale, so the English and Portuguese trees describe
 *                       the same entity rather than two competing ones
 * @param teamUrl        absolute URL of the author's team page, when one exists
 */
export function resolveSchemaAuthor(
  author: string | null | undefined,
  organisationId: string,
  teamUrl?: string,
  knownNames: string[] = []
): SchemaAuthor {
  const raw = (author ?? '').replace(/\s+/g, ' ').trim();

  if (!raw || NON_PERSON_AUTHORS.some((pattern) => pattern.test(raw))) {
    return { '@type': 'Organization', '@id': organisationId };
  }

  const { name, jobTitle } = parseByline(raw, knownNames);

  // Stripping the prefix can leave nothing usable behind.
  if (!name || NON_PERSON_AUTHORS.some((pattern) => pattern.test(name))) {
    return { '@type': 'Organization', '@id': organisationId };
  }

  return {
    '@type': 'Person',
    name,
    ...(jobTitle ? { jobTitle } : {}),
    ...(teamUrl ? { url: teamUrl } : {})
  };
}

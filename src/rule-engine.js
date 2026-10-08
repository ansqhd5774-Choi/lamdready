// No production travel rules are embedded in this module.
export const UNKNOWN = 'UNKNOWN';
const axes = ['entry', 'duty', 'declaration', 'permit', 'aviation'];
const operators = {
  eq: (a, b) => a === b,
  ne: (a, b) => a !== b,
  gte: (a, b) => a >= b,
  lte: (a, b) => a <= b,
  gt: (a, b) => a > b,
  lt: (a, b) => a < b,
};
const dateValid = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
const read = (object, path) => path.split('.').reduce((value, key) => value?.[key], object);

export function matchCondition(condition, context) {
  if (condition.all || condition.any) {
    const mode = condition.all ? 'all' : 'any';
    const children = condition[mode];
    if (!Array.isArray(children) || children.length === 0) throw new Error('Empty condition group');
    const results = children.map(child => matchCondition(child, context));
    const values = results.map(result => result.value);
    const value = mode === 'all'
      ? values.includes(false) ? false : values.includes(UNKNOWN) ? UNKNOWN : true
      : values.includes(true) ? true : values.includes(UNKNOWN) ? UNKNOWN : false;
    return { value, missing: value === UNKNOWN ? [...new Set(results.flatMap(result => result.missing))] : [] };
  }
  if (typeof condition.field !== 'string' || !operators[condition.op]) throw new Error('Invalid condition');
  const value = read(context, condition.field);
  if (value === undefined || value === null) return { value: UNKNOWN, missing: [condition.field] };
  if (typeof value !== typeof condition.value || (typeof value === 'number' && !Number.isFinite(value))) {
    return { value: UNKNOWN, missing: [condition.field] };
  }
  return { value: operators[condition.op](value, condition.value), missing: [] };
}

export function evaluate(rules, context) {
  if (!dateValid(context.eventDate)) throw new Error('Valid local eventDate required');
  const result = Object.fromEntries(axes.map(axis => [axis, UNKNOWN]));
  const applied = [], missing = new Set(), conflicts = [], candidates = [];
  for (const rule of rules) {
    if (rule.jurisdiction !== context.jurisdiction || rule.item !== context.item) continue;
    if (rule.status !== 'APPROVED' || !rule.evidence?.length || !rule.verifiedAt) continue;
    if (!dateValid(rule.effectiveFrom) || (rule.effectiveTo && !dateValid(rule.effectiveTo))) throw new Error('Invalid rule dates');
    // effectiveTo is exclusive.
    if (context.eventDate < rule.effectiveFrom || (rule.effectiveTo && context.eventDate >= rule.effectiveTo)) continue;
    const match = matchCondition(rule.condition, context);
    if (match.value === false) continue;
    if (match.value === UNKNOWN) match.missing.forEach(field => missing.add(field));
    candidates.push({ rule, match });
  }
  for (const axis of axes) {
    const relevant = candidates.filter(candidate => candidate.rule.outcome[axis] !== undefined);
    if (relevant.some(candidate => candidate.match.value === UNKNOWN)) continue;
    const values = [...new Set(relevant.map(candidate => candidate.rule.outcome[axis]))];
    if (values.length > 1) conflicts.push(axis);
    else if (values.length === 1) result[axis] = values[0];
  }
  for (const { rule, match } of candidates) {
    if (match.value === true) applied.push({ id: rule.id, version: rule.version, evidence: rule.evidence, verifiedAt: rule.verifiedAt });
  }
  return { result, applied, missing: [...missing], conflicts, status: conflicts.length ? 'CONFLICT' : missing.size ? 'NEEDS_INPUT' : applied.length ? 'EVALUATED' : 'UNVERIFIED' };
}

export function validateRelease(release) {
  const errors = [];
  for (const key of ['schemaVersion', 'engineVersion', 'releaseId']) if (!release[key]) errors.push(`Missing ${key}`);
  const ids = new Set();
  for (const rule of release.rules ?? []) {
    if (!rule.id || ids.has(rule.id)) errors.push(`Duplicate or missing rule id: ${rule.id}`);
    ids.add(rule.id);
    if (rule.status !== 'APPROVED') errors.push(`Unapproved rule: ${rule.id}`);
    if (!rule.evidence?.length || !rule.verifiedAt) errors.push(`Missing evidence: ${rule.id}`);
    if (!rule.version || !rule.jurisdiction || !rule.item || !rule.outcome) errors.push(`Incomplete rule: ${rule.id}`);
    if (!dateValid(rule.effectiveFrom) || (rule.effectiveTo && (!dateValid(rule.effectiveTo) || rule.effectiveTo <= rule.effectiveFrom))) errors.push(`Invalid period: ${rule.id}`);
    if (Object.keys(rule.outcome ?? {}).some(axis => !axes.includes(axis))) errors.push(`Invalid outcome axis: ${rule.id}`);
    try { matchCondition(rule.condition, {}); } catch { errors.push(`Invalid condition: ${rule.id}`); }
  }
  if (!Array.isArray(release.rules) || release.rules.length === 0) errors.push('No rules');
  return { valid: errors.length === 0, errors };
}

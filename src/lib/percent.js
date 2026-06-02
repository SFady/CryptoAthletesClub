/**
 * Calcule la part (%) de chaque utilisateur selon la pondération par racine carrée.
 * Part(u) = √invest(u) / Σ√invest(tous)
 *
 * @param {Array<{ id: any, invest: number }>} users
 * @returns {Array<{ id: any, invest: number, sqrt: number, percent: number }>}
 */
export function calcSqrtPercents(users) {
  const withSqrt = users.map(u => ({ ...u, sqrt: Math.sqrt(u.invest) }));
  const total    = withSqrt.reduce((sum, u) => sum + u.sqrt, 0);
  return withSqrt.map(u => ({
    ...u,
    percent: total > 0 ? u.sqrt / total : 0,
  }));
}

/**
 * Retourne uniquement la part d'un utilisateur parmi un groupe.
 *
 * @param {number} userInvest   - invest de l'utilisateur cible
 * @param {number[]} allInvests - invest de tous les utilisateurs (y compris le cible)
 * @returns {number} part entre 0 et 1
 */
export function sqrtPercent(userInvest, allInvests) {
  const total = allInvests.reduce((sum, v) => sum + Math.sqrt(v), 0);
  return total > 0 ? Math.sqrt(userInvest) / total : 0;
}

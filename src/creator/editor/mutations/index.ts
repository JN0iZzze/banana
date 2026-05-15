/**
 * Barrel для internal-зоны document-операций редактора Creator.
 *
 * Точка входа для всего, что иммутабельно правит `JsonSlideDocument`:
 * - низкоуровневые document ops (без знания о "kinds") — в `./documentOps.ts`;
 * - типы semantic action API по kind — в `./actionTypes.ts`;
 * - фабрики этих action-объектов — в `./nodeActions.ts`.
 *
 * См. также `.cursor/plans/creator-semantic-mutations_e5f84304.plan.md`.
 */

export * from './documentOps';
export * from './actionTypes';
export * from './nodeActions';
export * from './slideActions';

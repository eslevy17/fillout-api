// sample:
// type FilterClauseType = {
//     id: string;
//     condition: 'equals' | 'does_not_equal' | 'greater_than' | 'less_than';
//     value: number | string;
// }

const conditionsSet = new Set([
    'equals',
    'does_not_equal',
    'greater_than',
    'less_than'
])

export function validateFilterClause(filterClauses) {
    return !filterClauses.find(clause => {
        return (
               !clause.id || typeof clause.id !== 'string'
            || !conditionsSet.has(clause.condition)
            || (typeof clause.value !== 'number' && typeof clause.value !== 'string')
        )
    })
}

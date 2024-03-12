export function applyFilters(responses, filters) {
    return responses.filter(response => {
        return filters.every(filter => {
            const question = response.questions.find(question => question.id === filter.id)
            if (!question) return false

            return applyFilter(question, filter)
        })
    })
}

function applyFilter(question, filter) {
    if (   question.value === null
        || question.value === 'undefined'
    ) {
        return false // would need more info on whether this is the desired behavior or not, but it seems intuitive enough
    }

    const condition = filter.condition

    const questionValue = question.value
    const filterValue = filter.value

    if (condition === 'equals') {
        return questionValue === filterValue
    }
    if (condition === 'does_not_equal') {
        return questionValue !== filterValue
    }
    if (condition === 'greater_than') {
        return questionValue > filterValue
    }
    if (condition === 'less_than') {
        return questionValue < filterValue
    }
}

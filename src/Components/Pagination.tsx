import '../css/Pagination.css'

interface PaginationProps {
    page: number
    totalPages: number
    onPageChange: (page: number) => void
    disabled?: boolean
}

function Pagination({ page, totalPages, onPageChange, disabled = false }: PaginationProps) {
    return (
        <nav aria-label="Pagination des Pokémon">
            <button
                type="button"
                disabled={disabled || page <= 1}
                onClick={() => onPageChange(page - 1)}
            >
                ← Précédent
            </button>
            <span aria-live="polite"> Page {page} sur {totalPages} </span>
            <button
                type="button"
                disabled={disabled || page >= totalPages}
                onClick={() => onPageChange(page + 1)}
            >
                Suivant →
            </button>
        </nav>
    )
}

export default Pagination

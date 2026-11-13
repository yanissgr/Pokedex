import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import Pagination from './Pagination'

describe('Pagination', () => {
  it('désactive Précédent sur la page 1', () => {
    // Arrange + Act : on affiche le composant sur la première page
    render(<Pagination page={1} totalPages={5} onPageChange={() => {}} />)

    // Assert : le bouton Précédent ne doit pas être cliquable
    const bouton = screen.getByRole('button', { name: /précédent/i })
    expect(bouton).toBeDisabled()
  })

  it('appelle onPageChange avec page + 1 au clic sur Suivant', async () => {
    // Arrange : une fonction espion pour savoir si elle est appelée
    const onPageChange = vi.fn()
    render(<Pagination page={2} totalPages={5} onPageChange={onPageChange} />)

    // Act : on clique comme un utilisateur
    await userEvent.click(screen.getByRole('button', { name: /suivant/i }))

    // Assert : la page demandée est la 3
    expect(onPageChange).toHaveBeenCalledWith(3)
  })
})

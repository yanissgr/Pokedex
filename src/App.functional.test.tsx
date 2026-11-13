import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import api from './Services/api'

// On remplace l'appel réseau par un faux : les tests ne dépendent pas de PokeAPI
vi.mock('./Services/api', () => ({ default: { get: vi.fn() } }))

const pikachu = {
  id: 25,
  name: 'pikachu',
  height: 4,
  weight: 60,
  sprites: { front_default: null },
  types: [{ type: { name: 'electric' } }],
  abilities: [{ ability: { name: 'static' } }],
  stats: [{ base_stat: 35, stat: { name: 'hp' } }],
}

const liste = {
  count: 1,
  results: [{ name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' }],
}

// Réponse du faux serveur selon l'URL demandée (liste, ou détails d'un Pokémon)
function fauxServeur(url: string) {
  if (url === '') return Promise.resolve({ data: liste })
  return Promise.resolve({ data: pikachu })
}

function renderApp() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  )
}

describe('Parcours utilisateur', () => {
  beforeEach(() => {
    vi.mocked(api.get).mockReset()
  })

  it('affiche la liste, ouvre un Pokémon puis revient à la liste', async () => {
    vi.mocked(api.get).mockImplementation(fauxServeur as never)
    renderApp()

    // 1. La liste se charge et affiche la carte
    await userEvent.click(await screen.findByRole('heading', { name: 'pikachu' }))

    // 2. On arrive sur la page de détails avec ses infos
    expect(await screen.findByRole('heading', { name: /#25 - pikachu/i })).toBeInTheDocument()
    expect(screen.getByText(/static/)).toBeInTheDocument()
    expect(screen.getByRole('rowheader', { name: 'hp' })).toBeInTheDocument()

    // 3. Le lien de retour ramène à la liste
    await userEvent.click(screen.getByRole('link', { name: /retour au pokédex/i }))
    expect(await screen.findByRole('heading', { name: 'pikachu' })).toBeInTheDocument()
  })

  it('affiche une erreur puis recharge la liste au clic sur Réessayer', async () => {
    // Le premier appel échoue, les suivants fonctionnent
    vi.mocked(api.get).mockRejectedValueOnce(new Error('réseau KO'))
    vi.mocked(api.get).mockImplementation(fauxServeur as never)
    renderApp()

    expect(await screen.findByRole('alert')).toHaveTextContent('Erreur de chargement.')

    await userEvent.click(screen.getByRole('button', { name: /réessayer/i }))

    expect(await screen.findByRole('heading', { name: 'pikachu' })).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})

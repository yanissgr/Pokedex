import { useEffect, useState } from "react"
import { PokeCard } from "../../../entities/pokemon"
import type { Pokemon, PokemonListResponse } from "../../../entities/pokemon"
import { Pagination } from "../../../features/pagination"
import { api } from "../../../shared/api"
import './Home.css'

const LIMIT = 100

function Home() {
    const [page, setPage] = useState(1)
    const [pokemons, setPokemons] = useState<Pokemon[]>([])
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [retry, setRetry] = useState(0)

    useEffect(() => {
        const controller = new AbortController()

        async function loadPokemons() {
            setLoading(true)
            setError("")

            try {
                const { data } = await api.get<PokemonListResponse>("", {
                    params: { offset: (page - 1) * LIMIT, limit: LIMIT },
                    signal: controller.signal,
                })

                const detailedPokemons = await Promise.all(
                    data.results.map(async (pokemon) => {
                        const { data: details } = await api.get<Pokemon>(pokemon.url, {
                            signal: controller.signal,
                        })
                        return details
                    })
                )

                if (!controller.signal.aborted) {
                    setPokemons(detailedPokemons)
                    setTotalPages(Math.max(1, Math.ceil(data.count / LIMIT)))
                }
            } catch {
                if (!controller.signal.aborted) {
                    setError("Erreur de chargement.")
                }
            } finally {
                if (!controller.signal.aborted) setLoading(false)
            }
        }

        loadPokemons()
        return () => controller.abort()
    }, [page, retry])

    return (
        <main>
            <h1>Pokédex</h1>
            {loading && <p role="status">Chargement…</p>}
            {error && (
                <div role="alert">
                    <p>{error}</p>
                    <button type="button" onClick={() => setRetry(retry + 1)}>
                        Réessayer
                    </button>
                </div>
            )}
            {!loading && !error && (
                <div id="list">
                    {pokemons.length === 0 && <p>Aucun Pokémon trouvé.</p>}
                    {pokemons.map((pokemon) => (
                        <PokeCard key={pokemon.id} pokemon={pokemon} />
                    ))}
                </div>
            )}
            <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
                disabled={loading}
            />
        </main>
    )
}

export default Home

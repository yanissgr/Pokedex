import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { api } from "../../../shared/api"
import "./PokeDetails.css"
import { Commentaires } from "../../../features/comments"
import { PokeSprite } from "../../../entities/pokemon"
import type { Pokemon } from "../../../entities/pokemon"

function PokeDetails() {
    const { id } = useParams()
    const [pokemon, setPokemon] = useState<Pokemon | null>(null)
    const [error, setError] = useState("")

    useEffect(() => {
        const controller = new AbortController()
        setPokemon(null)
        setError("")

        api.get<Pokemon>(`/${id}`, { signal: controller.signal })
            .then(({ data }) => {
                if (!controller.signal.aborted) setPokemon(data)
            })
            .catch(() => {
                if (!controller.signal.aborted) setError("Erreur de chargement.")
            })

        return () => controller.abort()
    }, [id])

    return (
        <main className="poke-details" data-type={pokemon?.types[0]?.type.name}>
            <Link id="back-link" to="/">
                ← Retour au Pokédex
            </Link>
            {error ? <p role="alert">{error}</p> : !pokemon ? (
                <p role="status">Chargement…</p>
            ) : (
                <>
                    <div id="details">
                        <PokeSprite pokemon={pokemon} />
                        <div id="bottom">
                            <p><b>Taille</b> : {pokemon.height / 10} m</p>
                            <p><b>Poids</b> : {pokemon.weight / 10} kg</p>
                            <p><b>Talents</b> : {pokemon.abilities.map(({ ability }) => ability.name).join(", ")}</p>
                            <table className="stats">
                                <caption>Statistiques</caption>
                                <thead>
                                    <tr><th scope="col">Statistique</th><th scope="col">Valeur</th></tr>
                                </thead>
                                <tbody>
                                    {pokemon.stats.map(({ stat, base_stat }) => (
                                        <tr key={stat.name}>
                                            <th scope="row">{stat.name}</th>
                                            <td>{base_stat}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <Commentaires />

                </>

            )}
        </main>
    )
}

export default PokeDetails

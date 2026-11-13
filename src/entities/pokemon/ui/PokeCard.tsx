import { Link } from "react-router-dom"
import './PokeCard.css'
import type { Pokemon } from '../model/types'

function PokeCard({ pokemon }: { pokemon: Pokemon }) {
    return (
        <article>
            <Link to={`/pokeDetails/${pokemon.id}`}>
            <h2>{pokemon.name}</h2>
            {pokemon.sprites.front_default && (
                <img src={pokemon.sprites.front_default} alt={pokemon.name} loading="lazy" />
            )}
            <div className="types">
                {pokemon.types.map(({ type }) => (
                    <span key={type.name} data-type={type.name}>{type.name}</span>
                ))}
            </div>
            <button>Voir les détails</button>
            </Link>
        </article>
    )
}

export default PokeCard

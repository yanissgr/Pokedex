import "../css/PokeSprite.css";
import type { Pokemon } from "../types/pokemon"

function PokeSprite({ pokemon }: { pokemon: Pokemon }) {
    return (
        <div id="top">
            <h1>#{pokemon.id} - {pokemon.name}</h1>

            <div id="slider">
                <button id="prev" aria-label="Précédent" disabled>←</button>
                {pokemon.sprites.front_default && (
                    <img src={pokemon.sprites.front_default} alt={pokemon.name} width="200" />
                )}
                <button id="next" aria-label="Suivant" disabled>→</button>
            </div>


            <div className="types">
                {pokemon.types.map(({ type }) => (
                    <span key={type.name} data-type={type.name}>{type.name}</span>
                ))}
            </div>
        </div>
    )
}

export default PokeSprite
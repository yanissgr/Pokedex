export interface PokemonType {
    type: { name: string }
}

export interface Pokemon {
    id: number
    name: string
    height: number
    weight: number
    sprites: { front_default: string | null }
    types: PokemonType[]
    abilities: { ability: { name: string } }[]
    stats: { base_stat: number; stat: { name: string } }[]
}

export interface PokemonListResponse {
    count: number
    results: { name: string; url: string }[]
}

export interface Comment {
    id: string
    text: string
    date: string
}

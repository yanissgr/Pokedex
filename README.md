# Pokédex

Application Pokédex en React + TypeScript + Vite, utilisant l'API [PokeAPI](https://pokeapi.co/).

## Fonctionnalités

- Liste paginée des Pokémon (100 par page) avec leur image et leurs types
- Page de détails : taille, poids, talents, statistiques
- Commentaires sauvegardés dans le `localStorage` du navigateur
- Gestion des états de chargement et d'erreur (avec bouton « Réessayer »)

## Lancer le projet

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` : serveur de développement
- `npm run build` : vérification TypeScript puis build de production
- `npm run lint` : analyse avec Oxlint
- `npm test` : lance les tests avec Vitest

## Architecture

Le projet suit la méthodologie **Feature-Sliced Design (FSD)** : le code est découpé en *couches*, chaque couche ne pouvant importer que celles situées **en dessous** d'elle.

```
app  →  pages  →  features  →  entities  →  shared
```

```
src/
├── app/                        Initialisation : point d'entrée, routes, styles globaux
│   ├── main.tsx
│   ├── App.tsx
│   └── App.css
├── pages/                      Écrans reliés aux routes
│   ├── home/                   Liste paginée des Pokémon
│   └── poke-details/           Détails d'un Pokémon
├── features/                   Actions utilisateur
│   ├── pagination/             Navigation entre les pages de la liste
│   └── comments/               Ajout et affichage de commentaires (localStorage)
├── entities/                   Objets métier
│   └── pokemon/                Types Pokemon, PokeCard, PokeSprite
└── shared/                     Code générique, sans logique métier
    ├── api/                    Client axios (PokeAPI)
    └── assets/                 Images (fond, curseur)
```

Chaque *slice* (`home`, `pokemon`, `comments`…) est organisée en segments (`ui/` pour les composants et leurs styles, `model/` pour les types) et expose une **API publique** via son `index.ts` : les autres couches n'importent jamais un fichier interne directement.

Exemple : `pages/home` utilise `PokeCard` via `entities/pokemon`, `Pagination` via `features/pagination` et le client HTTP via `shared/api`.

### Technologies

| Rôle | Outil |
| --- | --- |
| Framework | React 19 |
| Langage | TypeScript |
| Bundler | Vite |
| Routage | react-router-dom |
| Requêtes HTTP | axios |
| Lint | Oxlint |
| Tests | Vitest + Testing Library |

## Tests

Les tests sont lancés avec `npm test` (Vitest, environnement jsdom).

- **Tests unitaires** ([Pagination.test.tsx](src/features/pagination/ui/Pagination.test.tsx)) : vérifient le composant `Pagination` isolé (bouton « Précédent » désactivé sur la page 1, clic sur « Suivant »).
- **Tests fonctionnels** ([App.functional.test.tsx](src/app/App.functional.test.tsx)) : montent toute l'application avec une API simulée. Ils couvrent le parcours liste → détails → retour, ainsi que l'erreur de chargement suivie du « Réessayer ».

L'API est simulée avec `vi.mock`, les tests ne dépendent donc pas d'Internet.

## CI/CD

Le workflow GitHub Actions ([deploy.yaml](.github/workflows/deploy.yaml)) se déclenche à chaque push sur `main` :

1. **test** : installation (`npm ci`), lint, tests.
2. **deploy** : déploiement en production sur Vercel (uniquement si `test` réussit).

Secrets requis dans le dépôt GitHub : `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.

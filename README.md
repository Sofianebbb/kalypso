# Kalipso Trio — Le Badamier

Projet pilote d'habitat modulaire reproductible à La Réunion. Trois cases, un terrain mutualisé, trois titres de propriété individuels, ~80 k€ par foyer. Porté par Sofiane Hakoury Behdad & Florent Clayes — Édition 2026.

## Lancer localement

Aucune dépendance, aucun build. Ouvrir directement dans un navigateur :

```bash
open index.html
```

Ou via un serveur local (recommandé pour le chargement JSON) :

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

## Structure

```
├── index.html                  Hub d'entrée + sélecteur de cible
├── vues/
│   ├── coacquereurs.html       Cible 01 — familles
│   ├── bailleurs.html          Cible 02 — bailleurs sociaux & SEM
│   ├── politique.html          Cible 03 — collectivités, élus
│   └── mecenat.html            Cible 04 — mécènes, fondations RSE
├── styles/
│   ├── tokens.css              Variables charte (couleurs, typo, ombres)
│   ├── base.css                Reset, typographie, grille
│   ├── components.css          Cartes, boutons, tableaux, citations
│   ├── motion.css              Animations CSS + reduced-motion
│   └── print.css               @media print — export PDF
├── scripts/
│   ├── motion.js               GSAP elevator reveal + scroll
│   ├── pdf-export.js           Déclencheur window.print()
│   └── data-loader.js          Chargement acteurs.json + filtres
├── data/
│   ├── acteurs.json            12 acteurs stratégiques
│   ├── piliers.json            4 piliers modulés par cible
│   ├── budget.json             Postes budgétaires nominal/structurel
│   └── qqopq.json              QQOPQ enrichi par cible
└── assets/
    ├── svg/                    Logo Kalipso
    ├── img/                    Rendus 3D (façade, terrasse, intérieur)
    ├── maps/                   Carte satellite La Réunion
    ├── pdf/                    PDFs générés (4 cibles × 9 pages)
    └── pdf-src/                Sources HTML des PDFs (Chrome headless)
```

## PDFs

Quatre dossiers PDF pré-générés sont disponibles dans `assets/pdf/` (9 pages chacun).
Les sources HTML sont dans `assets/pdf-src/` — régénérer avec Chrome headless :

```bash
# Serveur local depuis assets/
cd assets && python3 -m http.server 9222
# Puis dans un autre terminal :
chrome --headless --print-to-pdf="pdf/KalipsoTrio_coacquereurs.pdf" \
  --no-pdf-header-footer http://localhost:9222/pdf-src/coacquereurs.html
```

Chaque vue dispose aussi d'un bouton **PDF ↓** pour télécharger directement.

## Modifier la charte graphique

Toutes les variables visuelles sont centralisées dans `styles/tokens.css` :

- Couleurs : `--ink`, `--paper`, `--red`, `--navy`, `--yellow`, `--turquoise`, `--pink`
- Polices : `--font-display` (Playfair Display), `--font-body` (Inter)
- Bordures et ombres : `--border`, `--shadow`

## Ajouter un acteur

Éditer `data/acteurs.json` en ajoutant un objet avec les champs :

```json
{
  "id": 13,
  "nom": "Nom de l'acteur",
  "type": "Bailleur social",
  "secteur": "Logement, aménagement",
  "rse": "Orientation RSE",
  "potentiel": "Potentiel pour le projet Kalipso",
  "site": "https://example.com"
}
```

Les types disponibles pour les filtres : `Groupe privé`, `SEM`, `Bailleur social`, `Foncière`, `Public`, `Coopérative`, `Promoteur`.

## Roadmap

- [x] Intégration des rendus 3D (façade, terrasse, intérieur)
- [x] PDFs 9 pages avec page photo dédiée
- [x] Design responsive mobile (375px+)
- [x] Elevator animé GSAP + mode lecture
- [ ] Overlay KML Google Earth (parcelles repérées, dents creuses)
- [ ] Formulaires de contact embarqués (remplacement des mailto)
- [ ] Intégration CRM pour le suivi des contacts
- [ ] Vue Discovery (historique, hypothèses, transparence)
- [ ] Version anglaise pour les fonds internationaux

# Résultats Courses

Application Web de saisie rapide des résultats des compétitions d'athlétisme.

L'application est destinée aux clubs utilisant **NocoDB Cloud** comme base de données.

Elle permet de saisir rapidement plusieurs résultats en une seule opération, grâce à une grille de saisie inspirée d'Excel.

---

## Fonctionnalités

- Saisie multi-lignes
- Copier / Coller depuis Excel
- Import de fichiers Excel (.xlsx)
- Sauvegarde automatique
- Validation des données
- Envoi "Bulk" vers NocoDB
- Compatible PC, Mac et tablette
- Fonctionne avec Netlify
- API Token sécurisé (jamais exposé)

---

## Architecture

```
Navigateur
      │
      ▼
Application HTML / JavaScript
      │
      ▼
Netlify Function
      │
      ▼
NocoDB Cloud
```

---

## Structure du projet

```
resultats-courses/

├── README.md
├── LICENSE
├── package.json
├── netlify.toml
├── .gitignore

├── index.html

├── css/
│   └── style.css

├── js/
│   ├── app.js
│   ├── config.js
│   ├── api.js
│   ├── grid.js
│   ├── excel.js
│   ├── validation.js
│   ├── storage.js
│   ├── ui.js
│   └── utils.js

├── assets/

└── netlify/
    └── functions/
        └── save.js
```

---

# Fonctionnement

L'utilisateur renseigne :

- Date
- Épreuve
- Distance

Puis saisit tous les résultats dans une grille.

Exemple :

| Classement | Nom | Temps | Distinction |
|------------|------|---------|-------------|
| 1 | Martin | 15:22.34 | |
| 2 | Dupont | 15:45.11 | RC |
| 3 | Bernard | 16:01.45 | |

Un clic sur **Enregistrer** crée tous les enregistrements dans NocoDB.

---

# Technologies

- HTML5
- CSS3
- JavaScript ES2023
- Netlify Functions
- NocoDB REST API

Aucun framework JavaScript n'est utilisé.

---

# Configuration

Les paramètres de connexion sont stockés dans les variables d'environnement Netlify.

Exemple :

```
NOCODB_URL=https://xxxx.nocodb.com
NOCODB_TOKEN=xxxxxxxxxxxxxxxxxxxx
NOCODB_TABLE=resultats-courses
```

---

# Développement local

Installation :

```
npm install
```

Lancement :

```
netlify dev
```

Puis ouvrir

```
http://localhost:8888
```

---

# Déploiement

```
git push origin main
```

Netlify déploie automatiquement l'application.

---

# Roadmap

Version 0.1

- [ ] Interface

Version 0.2

- [ ] Grille dynamique

Version 0.3

- [ ] Copier / Coller Excel

Version 0.4

- [ ] Import XLSX

Version 0.5

- [ ] Sauvegarde locale

Version 0.6

- [ ] API NocoDB

Version 1.0

- [ ] Production

---

# Licence

MIT

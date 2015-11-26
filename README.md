# [Blog] Sécuriser une API REST et CORS compatible avec JSON Web Token (JWT)

Ce dépôt contient le code source d'une API REST, CORS compatible et sécurisée illustrant un [article de mon blog](http://blog.inovia-conseil.fr/?p=236).

Les comptes utilisateurs sont stockés via le service de gestion d'identité [**Stormpath**](https://stormpath.com/).<br/>
Le code de l'application utilise par défaut une application *Stormpath* que j'ai créée à des fins de test, et que vous pouvez  utiliser librement. Les comptes disponibles sont les suivants :
- `demo1` / `Demo2015`
- `demo2` / `Demo2015`
- `demo3` / `Demo2015`

Pour utiliser votre propre compte *Stormpath*, éditer le fichier `conf/conf.js` et renseigner vos clés d'API ainsi que l'URL de votre application *Stormpath* consultables sur [l'interface d'administration](https://api.stormpath.com/ui2/index.html#/)  :
```
stormpath: {
  apiKeyId:     '9OCCS8J3XJ765705JHT5CFJSJ',
  apiKeySecret: 'UGLKgIsKLRkc99K7GmTDto8Un9rOf6e3nXqv0aHXiI',
  appHref:      'https://api.stormpath.com/v1/applications/8b51wZlRUIxvGnhjTsLw74'
}
```

La clé privée utilisée pour signer le jeton ainsi que sa durée de validité sont définies dans le fichier `conf/conf.js` :
```
jwt: {
  expiresInSeconds: 60,
  secret: "thisIsTheNotSoSecretKey"
}
```

## Mode opératoire
### Prérequis
- Node.js 0.10+ (*testé avec Node.js 0.12*)

### Installation
```
git clone https://github.com/ksahnine/jwt-secured-api-node.git
cd jwt-secured-api-node
npm install
```

### Démarrage des services
```
npm start
```

## Exemples de requêtes
### Cas 1 : accès à une ressource protégée sans jeton
`curl http://localhost:8000/api/restricted/accounts`

```
{
  "status": "error",
  "msg": "Jeton invalide",
  "url": "/api/restricted/accounts"
}
```

### Cas 2 : authentification et récupération d'un jeton
`curl -X POST --data "username=demo1&password=Demo2015" http://localhost:8000/api/authenticate`

```
{
  "status": "ok",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImRlbW8xIiwiZnVsbE5hbWUiOiJ1dGlsaXNhdGV1ciBkZSBkZW1vIDEiLCJlbWFpbCI6ImRlbW8xQGZvb2Jhci5jb20iLCJpYXQiOjE0NDg1MjgyMDUsImV4cCI6MTQ0ODUyODI2NX0.CZDBoMEr-QjtSMVU67tRfrcgwZIocK9yypTZicP-xNc"
}
```

### Cas 3 : accès à une ressource protégée avec jeton valide
`curl -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImRlbW8xIiwiZnVsbE5hbWUiOiJ1dGlsaXNhdGV1ciBkZSBkZW1vIDEiLCJlbWFpbCI6ImRlbW8xQGZvb2Jhci5jb20iLCJpYXQiOjE0NDg1MjgyMDUsImV4cCI6MTQ0ODUyODI2NX0.CZDBoMEr-QjtSMVU67tRfrcgwZIocK9yypTZicP-xNc" http://localhost:8000/api/restricted/accounts`

```
[
  {
    "id": 0,
    "name": "Account 0"
  },
  {
    "id": 1,
    "name": "Account 1"
  },
  {
    "id": 2,
    "name": "Account 2"
  },
  {
    "id": 3,
    "name": "Account 3"
  },
  {
    "id": 4,
    "name": "Account 4"
  }
]
```
### Cas 4 : vecteurs d'accréditation incorrects
`curl -X POST --data "username=foobar&password=incorrect" http://localhost:8000/api/authenticate`
```
{
  "status": "error",
  "msg": "Invalid username or password."
}
```

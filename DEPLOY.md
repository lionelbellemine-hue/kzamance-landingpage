# Déploiement — pro.k-zamance.fr (Cloudflare Workers via OpenNext)

L'app est déjà préparée pour Cloudflare : `open-next.config.ts`, `wrangler.jsonc`
(worker **`kzamance-pro`**, `nodejs_compat`), scripts `cf:build` / `cf:deploy`,
Next bumpé en 16.2.8, plus de `proxy.ts` (incompatible Workers).

Build OpenNext + run local sur workerd : ✅ vérifiés.

## 1. Auth wrangler (depuis le PC — le plus simple)

```bash
cd landingpage
npx wrangler login          # ouvre le navigateur, OAuth → zéro galère de token
# (alternative : export CLOUDFLARE_API_TOKEN=... avec un token qui a
#  "Account · Workers Scripts · Edit" + "Zone · DNS · Edit" sur k-zamance.fr)
```

> Compte Cloudflare cible : **Lionel.bellemine@gmail.com's Account**
> (`f0ce0ed5b5ab2575f75245370e9742a4`), où vit déjà la zone `k-zamance.fr`.
> ⚠️ Si Workers n'a jamais été utilisé : va une fois sur **Workers & Pages**
> dans le dashboard pour activer le sous-domaine `*.workers.dev`.

## 2. Déployer

```bash
pnpm cf:deploy        # = opennextjs-cloudflare build && ... deploy
```

Ça publie le worker `kzamance-pro` (URL `kzamance-pro.<ton-sous-domaine>.workers.dev`).

## 3. Secrets (valeurs du .env.local)

```bash
npx wrangler secret put BREVO_API_KEY      # clé du compte Brevo K-zamance
npx wrangler secret put TWENTY_BASE_URL    # https://crm.k-zamance.fr
npx wrangler secret put TWENTY_API_KEY
npx wrangler secret put LEAD_FROM_NAME     # Leads K-zamance
npx wrangler secret put LEAD_NOTIFY_EMAIL  # boîte mail de l'équipe (À REMPLIR)
npx wrangler secret put LEAD_FROM_EMAIL    # sender validé @k-zamance.fr (À REMPLIR)
# BREVO_LIST_ID : seulement si tu utilises la waitlist B2C
```

> Sans `LEAD_NOTIFY_EMAIL` + `LEAD_FROM_EMAIL`, le lead arrive dans Twenty mais
> l'email à l'équipe ne part pas.

## 4. Domaine pro.k-zamance.fr

Dashboard → **Workers & Pages → kzamance-pro → Settings → Domains & Routes →
Add → Custom Domain →** `pro.k-zamance.fr`.
Le DNS + le certificat sont créés automatiquement (la zone est déjà sur Cloudflare).

## 5. (Optionnel) Redirect de la racine du sous-domaine

Pour que `pro.k-zamance.fr/` renvoie vers le site principal (les LP vivent sur
`/<segment>`), dashboard → **k-zamance.fr → Rules → Redirect Rules → Create** :

- Si `Hostname` = `pro.k-zamance.fr` **ET** `URI Path` = `/`
- Alors **302** vers `https://k-zamance.fr`

## Vérif après déploiement

```
https://pro.k-zamance.fr/producteur-miel-gard   → la LP doit s'afficher
```

Le bouton de l'email Brevo (template id 18) pointe déjà sur cette URL.

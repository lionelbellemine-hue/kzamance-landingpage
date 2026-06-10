import { defineCloudflareConfig } from "@opennextjs/cloudflare"

// Config OpenNext pour Cloudflare Workers (déploiement de l'app Next 16 SSR).
// Cache incrémental par défaut (en mémoire) - suffisant ici, l'app est dynamique.
export default defineCloudflareConfig()

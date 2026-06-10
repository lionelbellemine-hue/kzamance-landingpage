import nextCoreWebVitals from "eslint-config-next/core-web-vitals"
import nextTypescript from "eslint-config-next/typescript"
import eslintConfigPrettier from "eslint-config-prettier"

// ESLint flat config (ESLint 9 / Next 16). eslint-config-next 16 expose
// directement des flat configs — plus besoin de FlatCompat.
const eslintConfig = [
  {
    ignores: [
      ".next/**",
      ".open-next/**",
      ".wrangler/**",
      "node_modules/**",
      "next-env.d.ts",
      "*.tsbuildinfo",
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  // En dernier (des presets) : désactive les règles de mise en forme gérées par Prettier.
  eslintConfigPrettier,
  {
    rules: {
      // Contenu FR : les apostrophes en JSX sont légitimes (React les rend correctement).
      "react/no-unescaped-entities": "off",
    },
  },
  {
    // Primitives générées (shadcn/v0), non éditées : on neutralise les règles
    // react-hooks récentes qu'elles déclenchent (patterns shadcn officiels).
    files: ["components/ui/**", "hooks/**", "components/countdown.tsx"],
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/purity": "off",
    },
  },
]

export default eslintConfig

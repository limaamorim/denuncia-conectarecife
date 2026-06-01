# Conecta Recife — Denúncias

Plataforma web para registro e gestão de denúncias urbanas na cidade do Recife. O sistema oferece dois perfis de acesso: **cidadão** (abertura e acompanhamento de solicitações) e **admin** (dashboard, triagem com IA e indicadores).

## Stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [TanStack Router](https://tanstack.com/router) (SPA, file-based routing)
- [Tailwind CSS 4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- [Leaflet](https://leafletjs.com/) + OpenStreetMap (mapa de localização)
- [Recharts](https://recharts.org/) (gráficos do painel admin)

## Estrutura do projeto

```
src/
├── components/
│   ├── layout/          # Cabeçalho e estrutura global
│   ├── shared/          # Componentes reutilizados (ex.: StatusBadge)
│   └── ui/              # Componentes base shadcn/ui
├── data/
│   └── denuncias.ts     # Dados mock de denúncias
├── features/
│   ├── admin/           # Painel do gestor municipal
│   │   ├── AdminPage.tsx
│   │   ├── components/  # KPI, mapa, fila de triagem…
│   │   └── data/        # Estatísticas e gráficos
│   └── cidadao/         # Painel do cidadão
│       ├── CidadaoPage.tsx
│       └── components/  # Mapa, upload, nova denúncia…
├── hooks/
├── lib/                 # Auth, utilitários, helpers de servidor
├── routes/              # Rotas TanStack (apenas wiring)
├── types/               # Tipos TypeScript compartilhados
└── styles.css
```

### Rotas

| URL        | Perfil   | Descrição                          |
| ---------- | -------- | ---------------------------------- |
| `/login`   | Público  | Autenticação                       |
| `/cidadao` | Cidadão  | Histórico e nova denúncia          |
| `/admin`   | Admin    | Dashboard, triagem e mapa          |

## Como rodar

```bash
# Instalar dependências
npm install

# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview

# Lint
npm run lint
```

## Acesso demo

Na tela de login, use qualquer senha:

- **Cidadão:** qualquer e-mail (ex.: `cidadao@recife.gov`)
- **Admin:** e-mail contendo `admin` (ex.: `admin@recife.gov`)

## Scripts disponíveis

| Comando           | Descrição                    |
| ----------------- | ---------------------------- |
| `npm run dev`     | Servidor de desenvolvimento  |
| `npm run build`   | Build para produção          |
| `npm run preview` | Preview do build             |
| `npm run lint`    | ESLint                       |
| `npm run format`  | Prettier                     |

## Convenções

- **Rotas** ficam em `src/routes/` — são arquivos finos que importam páginas de `src/features/`.
- **Lógica de tela** fica em `src/features/{admin|cidadao}/`.
- **Componentes compartilhados** entre perfis ficam em `src/components/shared/`.
- **Tipos de domínio** ficam em `src/types/`.
- Dados mock ficam em `src/data/` até integração com API real.

## Deploy (Vercel / Netlify)

O build gera um site estático em `dist/` (`index.html` + `assets/`).

### Vercel

- **Framework Preset:** Vite (ou Other)
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- O arquivo `vercel.json` na raiz já configura fallback SPA para rotas como `/login`, `/admin` e `/cidadao`.

### Netlify

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- O arquivo `netlify.toml` na raiz já define build, publish e redirect `/* → /index.html`.

## Licença

Projeto interno — Prefeitura do Recife.

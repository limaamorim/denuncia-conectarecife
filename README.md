# Conecta Recife — Denúncias

**Prototipo funcional para registro, acompanhamento e triagem inteligente de ocorrências urbanas**

---

## 1. Capa

**Conecta Recife — Denúncias**

**Plataforma digital para centralização e gestão de denúncias urbanas com suporte à tomada de decisão**


---

## 2. Visão Geral

O **Conecta Recife — Denúncias** é um protótipo de sistema web inspirado no ecossistema **Conecta Recife**, desenvolvido para organizar o fluxo de denúncias cidadãs e apoiar a gestão municipal com informações estruturadas e indicativos de prioridade.

O projeto busca resolver desafios recorrentes identificados em contextos urbanos: dificuldade de comunicação entre cidadãos e administração pública, baixa rastreabilidade dos protocolos, ausência de critérios consistentes para triagem e limitação de indicadores estratégicos para o planejamento e a alocação de recursos.

Ao centralizar o registro das ocorrências e possibilitar acompanhamento por protocolo, o sistema **amplia a participação cidadã** e **qualifica a resposta do poder público**, criando uma base de dados (ainda que inicialmente mock) preparada para evolução em direção a integração com serviços e banco de dados.

---

## 3. Problema Identificado

A partir da análise de dados públicos relacionados a problemas urbanos no Recife, foi observado que diferentes tipos de ocorrências — como falhas de infraestrutura, questões ambientais e demandas de manutenção — apresentam obstáculos comuns:

1. **Fragmentação do registro de denúncias**: canais e fluxos distintos dificultam o entendimento do cidadão sobre onde e como comunicar a ocorrência.
2. **Baixa rastreabilidade do andamento**: após o registro, o acompanhamento do protocolo nem sempre é evidente, gerando sensação de invisibilidade e baixa confiança.
3. **Dificuldade na priorização eficiente**: a triagem tende a depender de rotinas operacionais com pouca padronização e, frequentemente, com baixa capacidade de classificar urgência a partir do conteúdo.
4. **Ausência de indicadores estratégicos**: sem consolidação adequada, gestores têm dificuldades para visualizar tendências por categoria, distribuição geográfica e evolução de casos.
5. **Impactos negativos na gestão urbana**: quando não há categorização e indicadores consistentes, ocorre atraso na resposta, maior custo operacional e menor efetividade no planejamento.

Nesse cenário, a proposta do sistema é oferecer um fluxo integrado, com organização do dado e suporte computacional (simulado no protótipo) para orientar decisões.

---

## 4. Objetivos do Projeto

### Objetivo Geral

Desenvolver um sistema digital que centralize denúncias urbanas, preserve o acompanhamento por protocolo e apoie a gestão pública por meio de **visualização estratégica** e **triagem inteligente simulada**, contribuindo para maior efetividade e transparência no atendimento.

### Objetivos Específicos

- Permitir que o cidadão registre uma denúncia com **etapas guiadas**, reduzindo inconsistências e aumentando qualidade das informações.
- Facilitar o acompanhamento por **protocolo e status**, garantindo rastreabilidade do processo.
- Integrar recursos de **suporte à comunicação**, como **reconhecimento de voz** (quando disponível no navegador).
- Coletar e estruturar **geolocalização** e informações complementares para análise e priorização.
- Oferecer ao gestor um **dashboard administrativo** com filtros, KPIs e mapas para leitura situacional.
- Simular uma **classificação de urgência** e motivos por categoria, favorecendo uma triagem inicial mais uniforme.
- Manter a arquitetura orientada a evolução, preparando o protótipo para integração futura com banco de dados e serviços em nuvem.

---

## 5. Principais Funcionalidades

### Portal do Cidadão

- **Cadastro de denúncias (wizard multi-etapas)**
  - Seleção de categoria
  - Título e descrição
  - Localização via mapa
  - Anexos (evidências) — opcional
  - Revisão final antes do envio
- **Consulta de protocolos**
  - Histórico com busca por título/protocolo
  - Filtro por status
- **Upload de evidências**
  - Anexação de arquivos (fotos do local) para subsidiar a avaliação
- **Localização via mapa**
  - Marcação do ponto de ocorrência, com dados associados para uso operacional
- **Acompanhamento de status**
  - Timeline e badges de status para transparência do andamento
- **Reconhecimento de voz (assistivo)** 🎙️
  - Ditado para complementar a descrição, com fallback conforme suporte do navegador

### Dashboard Administrativo

- **Gestão das denúncias**
  - Visualização do conjunto de ocorrências e consulta por filtros
- **Filtros avançados**
  - Período (intervalo de datas), urgência, categoria e bairro
- **Indicadores estratégicos (KPIs)** 📊
  - Total de casos, pendências, em andamento e tempo médio estimado
- **Mapa interativo (leitura situacional)** 🗺️
  - Visualização mock de distribuição espacial para apoiar análise
- **Triagem inteligente** 🤖
  - Simulação de priorização por categoria com urgência, motivo e nível de confiança

---

## 6. Diferenciais da Solução

- **Interface moderna e orientada à experiência**
  - Fluxo guiado que reduz ambiguidades no registro
- **Mapa interativo e geolocalização**
  - Coleta espacial para análise, agrupamento e acompanhamento
- **Visualização estratégica**
  - KPIs e gráficos para leitura rápida do panorama (volume, distribuição e evolução)
- **Simulação de classificação inteligente de urgência**
  - Priorização inicial com base em categoria e inferência determinística no protótipo
- **Arquitetura preparada para crescimento**
  - Separação por responsabilidades (pages/components/hooks/services e camadas de features)
  - Dados mock substituíveis por fonte persistente (API/DB/serviços em nuvem)

---

## 7. Tecnologias Utilizadas

| Tecnologia | Papel no projeto |
|---|---|
| **React** | Construção das interfaces e componentes reutilizáveis |
| **TypeScript** | Tipagem estática para reduzir inconsistências e melhorar manutenção |
| **Vite** | Ambiente de build e desenvolvimento com otimização de desempenho |
| **Tailwind CSS** | Estilização responsiva e rápida com utilitários |
| **shadcn/ui** | Componentes UI consistentes (cards, dialogs, inputs, tabelas etc.) |
| **Leaflet** | Suporte a mapas e visualização geoespacial (base para componentes de localização) |
| **OpenStreetMap** | Camada de mapas para contexto geográfico |
| **Recharts** | Gráficos (ex.: distribuição por categoria e evolução temporal) |
| **Git / GitHub** | Versionamento, organização de mudanças e colaboração |

---

## 8. Arquitetura do Projeto

A estrutura do repositório foi organizada para favorecer modularidade e evolução.

```
src/
├── pages/ (ou rotas e feature/pages no fluxo atual)
├── components/
│   ├── layout/          # Cabeçalho e estrutura global
│   ├── shared/          # Componentes reutilizados
│   └── ui/              # Componentes base (shadcn/ui)
├── hooks/               # Hooks reutilizáveis
├── services/           # Camada de integração (futura)
├── mocks/              # Dados e simulações (mock)
├── features/
│   ├── admin/          # Dashboard e triagem administrativa
│   └── cidadao/        # Portal do cidadão e wizard de denúncia
├── data/               # Dados mock de denúncias
├── routes/             # Wiring e rotas da aplicação
└── types/              # Tipos de domínio compartilhados
```

---

## 9. Fluxo do Sistema

1. O usuário **acessa a plataforma**.
2. Realiza **login** com acesso ao perfil correspondente.
3. O cidadão inicia o processo em **“Nova Denúncia”**.
4. Define a **categoria** da ocorrência.
5. Preenche **título** e **descrição** (com possibilidade de ditado por voz, quando disponível).
6. Localiza a ocorrência via **mapa** e complementa informações (bairro, endereço e campos correlatos).
7. Anexa **evidências** (opcional) para qualificar o registro.
8. O sistema executa uma **análise simulada** que estima **urgência**, **motivo** e **nível de confiança**.
9. A denúncia é registrada e recebe um **protocolo**, com timeline inicial.
10. O administrador acompanha a ocorrência via **dashboard**, consultando indicadores e mapa.
11. A gestão realiza **tomada de decisão** apoiada por filtros, KPIs e triagem.

---

## 11. Resultados Esperados

A implementação proposta visa produzir benefícios mensuráveis em diferentes dimensões:

- **Para cidadãos**
  - Maior clareza do processo de denúncia
  - Rastreabilidade por protocolo e status
  - Melhor experiência de registro (wizard guiado e suporte por voz)
- **Para gestores públicos**
  - Triagem inicial mais consistente
  - Leitura situacional via indicadores e mapas
  - Redução de retrabalho por padronização de dados
- **Para a administração municipal**
  - Organização de demandas por categoria e região
  - Base para planejamento e priorização com orientação por dados
  - Evolução do atendimento com integração a serviços reais
- **Para o planejamento urbano**
  - Consolidação de ocorrências como insumo para decisões estratégicas
  - Construção progressiva de indicadores georreferenciados

---

## 12. Trabalhos Futuros

Para amadurecer o protótipo e aproximá-lo de implantação real, estão previstos:

- **Integração com Supabase** (ou provedor equivalente)
- **Banco de dados real** com persistência e histórico completo
- **Autenticação completa** e políticas de acesso (papéis e permissões)
- **IA para classificação automática** com modelo treinado em dados reais (e não apenas simulação)
- **Aplicativo mobile** (PWA/Android/iOS) para registros em campo
- **Notificações em tempo real** (status e encaminhamentos)
- **Integração com órgãos públicos**
  - Encaminhamento automatizado e interoperabilidade por APIs
- **Governança e qualidade de dados**
  - Validação, auditoria e regras de padronização

---

## 13. Equipe de Desenvolvimento

### Equipe

- **José Fernando de Lima Amorim**
- **Marcello Henrique**
- **Glewbber Spindolla**
- **Carlos Eduardo**

### Orientação

- **Professor André Silva**

---

## 14. Licença

Este projeto é apresentado para **fins educacionais e de demonstração acadêmica**. A utilização integral ou parcial deve respeitar critérios de uso compatíveis com o ambiente universitário e com a finalidade pedagógica.

---

## Como rodar (desenvolvimento)

```bash
# instalar dependências
npm install

# ambiente de desenvolvimento
npm run dev

# build de produção
npm run build

# preview do build
npm run preview

# lint
npm run lint
```

---




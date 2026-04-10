# Infine Viagens — Agência de Conteúdo
## Guia de Setup e Uso no Claude Code

---

## Estrutura do projeto

```
infine-agencia/
│
├── CLAUDE.md                    ← Orquestrador (ler primeiro sempre)
├── README.md                    ← Este arquivo
│
├── .claude/
│   └── commands/                ← Comandos slash
│       ├── landing.md           → /landing
│       ├── post.md              → /post
│       ├── roteiro.md           → /roteiro
│       └── outros.md            → /email, /blog, /pitch
│
├── agents/
│   ├── frontend/CLAUDE.md       ← Landing pages & web
│   ├── social/CLAUDE.md         ← Posts & redes sociais
│   ├── roteiros/CLAUDE.md       ← Roteiros & itinerários
│   ├── email/CLAUDE.md          ← E-mails & newsletters
│   ├── editorial/CLAUDE.md      ← Blog & artigos
│   └── pitch/CLAUDE.md          ← Apresentações & pitches
│
├── skills/
│   ├── copywriting.md           ← Fórmulas, verbos, padrões de escrita
│   ├── visual-direction.md      ← Paleta, tipografia, fotografia
│   ├── frontend.md              ← (adicionar: padrões técnicos)
│   ├── seo.md                   ← (adicionar: palavras-chave, estrutura)
│   └── research.md              ← (adicionar: fontes, metodologia)
│
├── brand/
│   ├── brand-guide.md           ← (mover/adaptar do CLAUDE.md atual)
│   ├── tom-de-voz.md            ← (extrair do brand guide)
│   └── destinos-principais.md  ← (criar: destinos ativos + ângulos)
│
├── templates/
│   ├── brief-conteudo.md        ← Brief padrão para qualquer tarefa
│   ├── post-instagram.md        ← (criar: estruturas por formato)
│   ├── email-boas-vindas.md     ← (criar: estrutura base)
│   └── roteiro-7dias.md         ← (criar: estrutura base)
│
└── output/
    ├── landing/
    ├── posts/
    ├── roteiros/
    ├── emails/
    ├── blog/
    └── pitches/
```

---

## Como usar no Claude Code (CLI)

### Tarefa simples — ir direto ao agente
```bash
# Dentro da pasta do projeto, no Claude Code:
/post
# Claude pergunta: destino, formato, pilar, tom
# Entrega: copy pronta para publicar
```

```bash
/roteiro
# Claude pergunta: destino, duração, perfil, orçamento
# Entrega: roteiro completo curado
```

### Tarefa complexa — orquestrador monta a campanha
```
Preciso de uma campanha completa para a jornada à Patagônia em outubro.
Grupo de 8 mulheres, perfil aventura contemplativa.
Preciso: 1 post de anúncio, 1 sequência de stories, 1 e-mail de convite, 1 deck de jornada.
```
O orquestrador monta o brief e delega sequencialmente para cada agente.

### Iteração — ajustes sem recarregar contexto
```
Reescreve o segundo parágrafo com mais detalhes sensoriais sobre a gastronomia.
```
Manter no mesmo chat. Não abrir nova conversa para ajustes.

---

## Economia de tokens — regras práticas

| Situação | O que fazer |
|----------|-------------|
| 1 post simples | `/post` → responder perguntas → output direto |
| Campanha multi-formato | Brief completo → orquestrador → agentes em sequência |
| Ajustes em peça existente | Mesmo chat, não recarregar skills |
| Destino novo (pesquisa) | Carregar `skills/research.md` explicitamente |
| Destino já no `brand/destinos-principais.md` | Referenciar o arquivo, não descrever do zero |

---

## Próximos arquivos a criar (backlog)

- [ ] `skills/frontend.md` — padrões técnicos (aproveitar skill existente)
- [ ] `skills/seo.md` — palavras-chave por destino, intenções de busca
- [ ] `skills/research.md` — como pesquisar destinos, fontes confiáveis
- [ ] `brand/destinos-principais.md` — destinos ativos com ângulo editorial
- [ ] `brand/tom-de-voz.md` — exemplos reais de copy aprovada
- [ ] `templates/post-instagram.md` — estruturas por formato
- [ ] `templates/email-boas-vindas.md` — sequência de boas-vindas
- [ ] `templates/roteiro-7dias.md` — estrutura base de roteiro semanal

---

## Convenção de nomes nos outputs

```
output/posts/2026-04-[destino]-[formato].md
output/roteiros/[destino]-[N]dias-[perfil].md
output/emails/2026-04-[tipo]-[tema].md
output/blog/2026-04-[slug-do-artigo].md
output/landing/2026-04-[campanha].html
output/pitches/2026-04-[destino]-deck.md
```

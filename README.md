# Projeto2 - Inovation Class

> Projeto criado para consultar usuários do github, consumindo a api do github

### Funcionalidades
- Buscas de perfil
- Histórico de buscas
- Cache com localstorage
- Animação de loading durante as requisições

### Objetivos pessoais com o projeto

- Criar components reutilizáveis
- Estudar funcionalidades do React
- Explorar técnicas para otimizar o desempenho nas renderizações do React
- Usar cache como uma estratégia para melhorar a experiência do usuário (UX)
- Garantir responsividade para diferentes dispositivos

### Desafios

- Ao tentar precocimente otimizar o desempenho com useCallback, foi dificultoso trabalhar com o array de dependecias.
Isso me gerou bugs dificeis de rastrear e me fez respensar o uso deles, além de não ter tido diferença notável entre
o uso e não uso da hook. Agora estou em busca por melhores práticas e casos de uso da hook useCallback.

### Planos

- Adicionar um tamanho limite para history
**AnyDex**

**Trabalho 4o Bimestre**

Prezados, chegamos ao último trabalho do curso Integrado de Informática para Internet do Campus Rio Grande, turma de 2022. Este trabalho será realizado em conjunto entre as disciplinas de Desenvolvimento de Sistemas I e Desenvolvimento de Sistemas II.

O objetivo deste trabalho é a implementação de dois projetos, um de backend (DSII) e outro de frontend (DSI). Os projetos irão se comunicar através de chamadas HTTP e, em conjunto, simularão a chamada AnyDex, uma PokeDex personalizada de acordo com o tema escolhido.

O trabalho pode ser desenvolvido sozinho ou em grupos de até 3\* pessoas. Trabalhos em dupla ou trio terão itens de dificuldade extra conforme descrição abaixo.

Requisitos básicos

- Cada Dex pertence a um usuário, logo, deve ser possível se cadastrar na plataforma e computar seus itens na sua Dex.

- Deve existir uma forma de buscar por Colecionadores, ou lista paginada ou busca.

- A pessoa dona de uma conta na sua plataforma Dex, deve poder adicionar um item na sua coleção (vinculado/foreignKey), com algum tipo de evidência, foto (resize e armazenem no banco em Base64 tipo texto), link de vídeo.
  - Deve ser possível deletar um item.

- A coleção inicial apresentada deve possuir pelo menos 50 itens.

**Backend**

- Deve ser desenvolvido em NodeJS + Express + Sequelize TypeOrm

- Senha criptografada
- Validação das chamads com JOI ou YUP
- Sequelize ORM ou TypeOrm
- Persistência dos dados em um banco PostgreSQL (quem tiver com dificuldades aqui me pede ajuda para não deixar para a última hora).

- API de consulta paginada e ordenada
- Soft Delete de perfil
  - outros usuários não conseguem mais visualizar deste usuário
- Endpoints de Estatísticas do Usuário em relação ao mundo - no perfil
- Upload de Imagem (do perfil do usuário e/ou do item colecionável)
- Autorização - apenas o usuário pode marcar sua própria coleção

- Dupla
  - Ranking mundo (quem tem mais itens (5 primeiros), quais os itens que mais pessoas possuem (5 primeiros),
- Trio
  - Itens de quem faz em dupla + os itens abaixo
  - Deve existir um DataMaster, que pode inserir novos itens na coleção.
  - Estrelar o item da coleção de alguém. Nas estatísticas devem aparecer os itens mais estrelados.

**Frontend**

- React + Styled Components
- Listagens paginadas
- Obviamente, todas as ações do backend devem estar mapeadas

- Dupla
  - Ações do backend dupla devem estar implementadas aqui.
- Trio
  - Ações do backend dupla e trio devem estar implementadas aqui.
  - Apresentação das estatísticas de maneira gráfica (Victory.js do Formidable)

Sobre as possibilidades…

Vocês podem implementar quaisquer tipos de itens, desde que contenham alguns atributos associados a ele, por exemplo, em pokédex, é apresentado o tipo do pokémon, a cor, nome, dentre outros. Pode ser uma AnyDex de copos de cerveja e, dentro das estatísticas, quantos usuários tem um copo Stanley. Camisetas de super herói, jogos de videogame, produtos de estética, livros, música, etc..

A imaginação não tem limites!!! Mas, porém, contudo, entretanto, todavia, nós temos pouco tempo, então não complique demais.

Data de entrega: Primeira semana de Dezembro… sem prorrogação, prazos legais para entregas de notas e coisas do tipo.

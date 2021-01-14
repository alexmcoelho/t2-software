<h1>Desafio T2 Software </h1>
<b>Desenvolver CRUD de usuário</b>
<h2>Passos para executar o backend:</h2>
 <h4>1º</h4>
  Instalar yarn através do link abaixo.
  <blockquote><a href="https://classic.yarnpkg.com/pt-BR/docs/install/#debian-stable">Instalar yarn</a></blockquote>

 <h4>2º</h4>
 Instalar as dependências com o comando a seguir.
  <blockquote>yarn</blockquote>
 
 <h4>3º</h4>
 Instalar o mongodb na porta 27017, pode ser via docker ou localmente.
 
 <h4>4º</h4>
 Copiar e colar o arquivo <i>.env.example</i>, em seguida renomeá-lo para <i>.env</i>. Nele tem algumas variáveis de ambiente necessárias para rodar o projeto. As variáveis: <i>AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY e AWS_DEFAULT_REGION</i>, não precisam ser configuradas, a não ser que fosse preciso salvar os arquivos de imagem dos usuários na AWS. E fazer a mesma coisa com o arquivo <i>ormconfig.example.json</i>, e renomeá-lo para <i>ormconfig.json</i>

 <h4>5º</h4>
 Executar o projeto.
 <blockquote>yarn dev:server</blockquote>

<h4>6º</h4>
Para testar a aplicação, basta usar o seguinte comando.
<blockquote>yarn test</blockquote>

<h2>Passos para executar o frontend:</h2>

<h4>1º</h4>
Instalar as dependências com o comando a seguir.
<blockquote>yarn</blockquote>

<h4>2º</h4>
Executar o projeto.
<blockquote>yarn start</blockquote>

<h4>3º</h4>
Para testar a aplicação, basta usar o seguinte comando.
<blockquote>yarn test</blockquote>

<h4>Observações</h4>
1 - Para criar um usuário basta clicar no link disponível na página inicial, chamado Criar conta, este por sua vez irá direcionar para a página onde é possível criar um usuário;
<br/>
2 - Para trocar o avatar do usuário basta clicar sobre o nome do usuário na tela inicial (dashboard), em seguida irá abrir uma tela onde é possível trocar a imagem.

Criar um projeto Web usando react para as Oficinas poderem cadastrar suas empresas (conter nome, especialidades, localização, logo, etc...)
Criar um aplicativo usando react native para usuários localizarem estas oficinas a partir da sua localização atual...

Tecnologias usadas:

Web: React(TypeScript)
-> react-router-dom: navegação (BrowserRouter, Link, useHistory)
->leaflet & react-leaflet: mapa escolhido para ser usado na web;
->react-icons
->axios: para alimentar a aplicação com a api local(items) e com api do IBGE(informando os dados da citye  uf)
->formik e yup: para validação do formulário no frontend
->react-dropzone: campo para arrastar arquivos(no caso, somente uma foto do estabelecimento)

Mobile: React Native(TypeScript)
->Expo
->react-native-maps: usar o mapa no mobile;
->@react-navigation/native && @react-navigation/stack: lidar com navegação;
->expo install react-native-screens && react-native-safe-area-context;
->axios: para alimentar a aplicação com a api local(items) e com api do IBGE(informando os dados da citye  uf)
->react-native-picker-select: criado pickr para seleção dos dados uf/city
->react-native-gesture-handler: import do RectButton
->@expo-google-fonts/ubuntu && @expo-google-fonts/roboto: fontes usadas no app;
->expo install expo-mail-composer: poder abrir o email diretamente do aplicativo;

Backend: Node.js
-express: lidar com rotas
-knex: parar fazer as query usando java script, servindo para todos sql
-knex-migrations: criar as migrations;
-knex-seed: para os itens que vão ser pré-estabelecidos pela aplicação
-multer: upload de imagens
-crypto: gerar um hash aleatorio de dados
-celebrate: validação de dados no back (integração da library(Joi-validacao) com o express)
-npm install cors

Banco de dados: SQLite



 

AUTOPRIME PEÇAS - SITE PARA KODER

ARQUIVOS
- index.html
- styles.css
- script.js

COMO ABRIR NO KODER
1. Extraia o arquivo ZIP.
2. Abra a pasta autopecas_koder no Koder.
3. Abra index.html.
4. Use a opção Preview / Browser do Koder para visualizar.

COMO PERSONALIZAR
Abra script.js e altere o bloco STORE no começo do arquivo:
- name: nome da loja
- whatsapp: 55 + DDD + telefone, somente números
- phoneLabel: telefone que aparece na tela
- address: endereço
- hours: horário
- pixKey: chave Pix

PRODUTOS
No mesmo script.js, edite a lista PRODUCTS para alterar peças, marcas, códigos e preços.

IMPORTANTE
Este projeto é um front-end estático, ideal para abrir no Koder ou hospedar em serviços simples.
Ele não confirma Pix automaticamente e não possui banco de dados/estoque em servidor.
O checkout monta o pedido e abre o WhatsApp da loja.
Para pagamento Pix automático com confirmação, painel administrativo, estoque real, login e pedidos persistentes, é necessário adicionar um backend e integrar um provedor de pagamento.

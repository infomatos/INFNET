export const CATEGORIAS = [
  {
    id: 'lan',
    titulo: 'Lanches',
    capa: 'https://images.unsplash.com/photo-1550317138-10000687a72b?w=600&q=60&auto=format&fit=crop',
  },
  {
    id: 'beb',
    titulo: 'Bebidas',
    capa: 'https://images.unsplash.com/photo-1689910138858-5282476bf656?q=80&w=830&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 'sob',
    titulo: 'Sobremesas',
    capa: 'https://images.unsplash.com/photo-1626014692567-e3a764c54d69?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 'mas',
    titulo: 'Massas',
    capa: 'https://images.unsplash.com/photo-1734356959885-54fe2e99c1cd?q=80&w=1548&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 'sal',
    titulo: 'Saudáveis',
    capa: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=60&auto=format&fit=crop',
  },
  {
    id: 'jap',
    titulo: 'Japonesa',
    capa: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=600&q=60&auto=format&fit=crop',
  },
];

export const PRODUTOS_POR_CATEGORIA = {
  lan: [
    {
      id: 'lan-1',
      nome: 'Cheeseburger',
      preco: 22.9,
      img: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&q=60&auto=format&fit=crop',
      desc: 'Pão, carne 120g, queijo, molho da casa.',
    },
    {
      id: 'lan-2',
      nome: 'Chicken Crispy',
      preco: 24.5,
      img: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&q=60&auto=format&fit=crop',
      desc: 'Frango crocante, alface e maionese.',
    },
    {
      id: 'lan-3',
      nome: 'Veggie Burger',
      preco: 23.0,
      img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=60&auto=format&fit=crop',
      desc: 'Grão-de-bico, salada e pesto.',
    },
  ],
  beb: [
    {
      id: 'beb-1',
      nome: 'Refrigerante Lata',
      preco: 6.5,
      img: 'https://images.unsplash.com/photo-1622484212374-52f1d7878b24?w=600&q=60&auto=format&fit=crop',
      desc: '350ml, diversos sabores.',
    },
    {
      id: 'beb-2',
      nome: 'Suco Natural',
      preco: 9.9,
      img: 'https://images.unsplash.com/photo-1535914254981-b5012eebbd15?w=600&q=60&auto=format&fit=crop',
      desc: 'Laranja, uva ou abacaxi.',
    },
    {
      id: 'beb-3',
      nome: 'Água Mineral',
      preco: 4.0,
      img: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600&q=60&auto=format&fit=crop',
      desc: 'Sem gás, 500ml.',
    },
  ],
  sob: [
    {
      id: 'sob-1',
      nome: 'Brownie',
      preco: 12.0,
      img: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476e?w=600&q=60&auto=format&fit=crop',
      desc: 'Chocolate meio amargo.',
    },
    {
      id: 'sob-2',
      nome: 'Açaí 300ml',
      preco: 16.9,
      img: 'https://images.unsplash.com/photo-1613478223719-6f8f3b1b8c50?w=600&q=60&auto=format&fit=crop',
      desc: 'Com granola e banana.',
    },
    {
      id: 'sob-3',
      nome: 'Pudim',
      preco: 10.0,
      img: 'https://images.unsplash.com/photo-1541782814451-2f2f83f0a6f8?w=600&q=60&auto=format&fit=crop',
      desc: 'Tradicional, calda de caramelo.',
    },
  ],
  mas: [
    {
      id: 'mas-1',
      nome: 'Spaghetti Bolonhesa',
      preco: 29.9,
      img: 'https://images.unsplash.com/photo-1523986371872-9d3ba2e2f642?w=600&q=60&auto=format&fit=crop',
      desc: 'Molho de carne e tomate.',
    },
    {
      id: 'mas-2',
      nome: 'Penne ao Pesto',
      preco: 27.5,
      img: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=600&q=60&auto=format&fit=crop',
      desc: 'Manjericão, azeite e nozes.',
    },
  ],
  sal: [
    {
      id: 'sal-1',
      nome: 'Bowl Proteico',
      preco: 32.0,
      img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=60&auto=format&fit=crop',
      desc: 'Frango, quinoa, legumes.',
    },
    {
      id: 'sal-2',
      nome: 'Salada Caesar',
      preco: 24.9,
      img: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=60&auto=format&fit=crop',
      desc: 'Alface, frango e molho Caesar.',
    },
  ],
  jap: [
    {
      id: 'jap-1',
      nome: 'Combinado 12 peças',
      preco: 39.9,
      img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=60&auto=format&fit=crop',
      desc: 'Salmão, atum e joy.',
    },
    {
      id: 'jap-2',
      nome: 'Temaki Salmão',
      preco: 22.0,
      img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=60&auto=format&fit=crop',
      desc: 'Salmão, cream cheese e cebolinha.',
    },
  ],
};

export const PEDIDOS_MOCK = [
  {
    id: 'P-2025-0001',
    dataISO: '2025-09-28T16:20:00-03:00',
    restaurante: 'Burger Master - Centro',
    itens: [
      { id: 'lan-1', nome: 'Cheeseburger', qty: 1, preco: 22.9 },
      { id: 'beb-1', nome: 'Refrigerante Lata', qty: 2, preco: 6.5 },
    ],
    status: 'Saiu para entrega', // "Em preparo" | "Saiu para entrega" | "Entregue"
  },
  {
    id: 'P-2025-0002',
    dataISO: '2025-09-27T19:05:00-03:00',
    restaurante: 'Temaki House - Centro',
    itens: [{ id: 'jap-2', nome: 'Temaki Salmão', qty: 2, preco: 22.0 }],
    status: 'Entregue',
  },
  {
    id: 'P-2025-0003',
    dataISO: '2025-09-28T11:45:00-03:00',
    restaurante: 'Pasta & Co - Centro',
    itens: [
      { id: 'mas-1', nome: 'Spaghetti Bolonhesa', qty: 1, preco: 29.9 },
      { id: 'beb-3', nome: 'Água Mineral', qty: 1, preco: 4.0 },
    ],
    status: 'Em preparo',
  },
];

export const RESTAURANTES_CENTRO = [
  // x e y são percentuais relativos à imagem (0–100)
  {
    id: 'r1',
    nome: 'Burger Master - Centro',
    categoria: 'Lanches',
    endereco: 'Av. Rio Branco, 50',
    nota: 4.6,
    tempo: '35–45 min',
    pos: { x: 22, y: 28 },
  },
  {
    id: 'r2',
    nome: 'Temaki House - Centro',
    categoria: 'Japonesa',
    endereco: 'R. da Quitanda, 80',
    nota: 4.7,
    tempo: '30–40 min',
    pos: { x: 38, y: 26 },
  },
  {
    id: 'r3',
    nome: 'Pasta & Co - Centro',
    categoria: 'Massas',
    endereco: 'R. Buenos Aires, 120',
    nota: 4.5,
    tempo: '25–35 min',
    pos: { x: 30, y: 40 },
  },
  {
    id: 'r4',
    nome: 'Açaí Rei',
    categoria: 'Sobremesas',
    endereco: 'Av. Passos, 200',
    nota: 4.3,
    tempo: '20–30 min',
    pos: { x: 50, y: 35 },
  },
  {
    id: 'r5',
    nome: 'Sucos da Praça',
    categoria: 'Bebidas',
    endereco: 'Praça XV, 10',
    nota: 4.2,
    tempo: '15–25 min',
    pos: { x: 62, y: 30 },
  },
  {
    id: 'r6',
    nome: 'Caesar Fit',
    categoria: 'Saudáveis',
    endereco: 'R. do Rosário, 33',
    nota: 4.4,
    tempo: '25–35 min',
    pos: { x: 44, y: 48 },
  },
  {
    id: 'r7',
    nome: 'Sushi Express',
    categoria: 'Japonesa',
    endereco: 'Av. Beira Mar, 300',
    nota: 4.1,
    tempo: '30–40 min',
    pos: { x: 68, y: 44 },
  },
  {
    id: 'r8',
    nome: 'Padoca do Centro',
    categoria: 'Lanches',
    endereco: 'R. do Ouvidor, 150',
    nota: 4.0,
    tempo: '20–30 min',
    pos: { x: 28, y: 55 },
  },
  {
    id: 'r9',
    nome: 'Brownie&Co',
    categoria: 'Sobremesas',
    endereco: 'R. São José, 220',
    nota: 4.8,
    tempo: '20–30 min',
    pos: { x: 54, y: 58 },
  },
  {
    id: 'r10',
    nome: 'Água na Boca',
    categoria: 'Bebidas',
    endereco: 'R. Uruguaiana, 99',
    nota: 4.2,
    tempo: '15–25 min',
    pos: { x: 40, y: 66 },
  },
];

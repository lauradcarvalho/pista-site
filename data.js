// TROQUE pelos links reais: abra cada formulário no Notion → botão de
// compartilhar (Share) → "Copy link" → cole aqui.
const FORM_LINKS = {
  sugerirEvento: 'https://worried-germanium-065.notion.site/a2c3382365f4442cbf7a5d723b046e63?pvs=105',
  criarPerfil: 'https://worried-germanium-065.notion.site/e12ae1bbb48a41c5a357ef2682d5e85b?pvs=105',
  euVouCorrer: 'https://worried-germanium-065.notion.site/a23089e03492479aa9349b3595d0f1c9?pvs=105',
};

// Edite esta lista sempre que aprovar um evento no Notion (marcar "Publicado no site").
const events = [
  {id:'e1', day:'25', month:'JUL', title:'Top Street RS', type:'drag', local:'Autódromo de Tarumã, Viamão/RS', horario:'', fonte:'Instagram', confirmado:true, lineup:[]},
  {id:'e2', day:'31', month:'JUL', title:'3ª Etapa Copa FT BR Sport de Arrancada', type:'drag', local:'Autódromo FuelTech Velopark, Nova Santa Rita/RS', horario:'', fonte:'pascoaldragster.com', confirmado:true, lineup:[]},
  {id:'e3', day:'15', month:'AGO', title:'Racha 51 No Prep', type:'drag', local:'Autódromo FuelTech Velopark, Nova Santa Rita/RS', horario:'', fonte:'Instagram', confirmado:true, lineup:[]},
  {id:'e4', day:'30', month:'OUT', title:'Armageddon', type:'drag', local:'Autódromo FuelTech Velopark, Nova Santa Rita/RS', horario:'', fonte:'Instagram', confirmado:true, lineup:[]},
];

// Edite esta lista sempre que aprovar um cadastro de pilota/equipe no Notion.
// Campos: id, name, role (equipe/categoria), cat (texto curto tipo "ARRANCADA"),
// bio (opcional, aparece no modal), instagram (opcional, aparece no modal),
// photo (opcional — caminho tipo 'images/nome-da-pilota.jpg'; sem essa foto pronta
// ainda, é só não incluir o campo que o espaço de imagem some sozinho, sem placeholder).
// Exemplo: {id:'p1', name:'Nome da Pilota', role:'Equipe X', cat:'ARRANCADA', bio:'Breve histórico.', instagram:'@perfil', photo:'images/nome.jpg'}
const people = [
  {id:'p1', name:'Driely Quoos', role:'Categoria TST — Chevette Tubarão Vermelho', cat:'ARRANCADA', bio:'Piloto de arrancada, esposa de piloto e mãe de piloto também. Única mulher na categoria TST por enquanto, melhor tempo até agora: 5,6s nos 200m. Compete no Autódromo FuelTech Velopark (Nova Santa Rita/RS) e em etapas na SPID (Itatiba/SP).', instagram:'@drielyquoos_tst944'},
  {id:'p2', name:'Sheila Opaleira', role:'Arrancada — Opala', cat:'ARRANCADA', bio:'Apaixonada por Opalas e arrancada.', instagram:'@sheila_opaleira'},
];

function findPerson(id){ return people.find(p => p.id === id); }
function eventsForPerson(id){ return events.filter(e => e.lineup.some(l => l.riders.includes(id))); }

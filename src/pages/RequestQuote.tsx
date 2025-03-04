
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CONTACTS = {
  "Rafael Filme Pack": "+5554999232189",
  "Patricia Disk Embalagem": "+5554999327677",
  "Patrício Plásticos Luz": "+5551998304704",
  "Marco Akorel": "+5551980882561"
};

const RequestQuote = () => {
  const navigate = useNavigate();
  const [selectedContact, setSelectedContact] = useState(Object.keys(CONTACTS)[0]);
  const [materials, setMaterials] = useState({
    stretchFilm: false,
    bubbleWrap: false,
    kraftPaper: false,
    corrugatedPaper: false
  });
  const [status, setStatus] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!Object.values(materials).some(Boolean)) {
      setStatus('Selecione pelo menos um material');
      return;
    }

    const selectedMaterials = [];
    if (materials.stretchFilm) selectedMaterials.push("- Material: Filme Stretch\n  Peso: 200Kg");
    if (materials.bubbleWrap) selectedMaterials.push("- Material: Plástico Bolha\n  Quantidade: 05 un.");
    if (materials.kraftPaper) selectedMaterials.push("- Material: Bobina Papel Kraft\n  Quantidade: 03 un.");
    if (materials.corrugatedPaper) selectedMaterials.push("- Material: Bobina Papel Ondulado\n  Quantidade: 03 un.");

    const firstName = selectedContact.split(' ')[0];
    const message = `Olá, ${firstName}, tudo bem?\n\n` +
      `Aqui é Lenoir da Gplásticos.\n` +
      `Estou entrando em contato para fazer uma cotação.\n\n` +
      `${selectedMaterials.join('\n\n')}\n\n` +
      `- Horários para entrega: Segunda a Sexta, das 08h às 18h\n` +
      `- Endereço: R. Demétrio Ângelo Tiburi, 1716 - Bela Vista, Caxias do Sul - RS, 95072-150`;

    const phone = CONTACTS[selectedContact as keyof typeof CONTACTS];
    // Modificando para abrir apenas WhatsApp Web
    const url = `https://web.whatsapp.com/send?phone=${phone.replace(/\D/g, '')}&text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    setStatus('Mensagem enviada!');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-eink-white text-eink-black animate-fadeIn">
      <div className="flex-grow">
        <div className="max-w-[80%] mx-auto px-3 py-6 md:py-12">
          <button 
            onClick={() => navigate('/')}
            className="mb-6 md:mb-8 text-eink-gray hover:text-eink-black text-xs md:text-sm uppercase"
          >
            ← VOLTAR
          </button>

          <h1 className="text-lg md:text-2xl font-light text-center mb-6 uppercase">Solicitar Cotação</h1>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <select
                value={selectedContact}
                onChange={(e) => setSelectedContact(e.target.value)}
                className="w-[200px] h-[40px] p-2.5 bg-eink-lightGray rounded-lg outline-none text-xs md:text-sm uppercase font-quicksand mx-auto block"
              >
                {Object.keys(CONTACTS).map((contact) => (
                  <option key={contact} value={contact}>
                    {contact}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2.5 max-w-[200px] mx-auto">
              {[
                { key: 'stretchFilm', label: 'FILME STRETCH' },
                { key: 'bubbleWrap', label: 'PLÁSTICO BOLHA' },
                { key: 'kraftPaper', label: 'BOBINA PAPEL KRAFT' },
                { key: 'corrugatedPaper', label: 'BOBINA PAPEL ONDULADO' }
              ].map((item) => (
                <label key={item.key} className="flex items-center space-x-3 p-2.5 bg-eink-lightGray rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={materials[item.key as keyof typeof materials]}
                    onChange={(e) => setMaterials({...materials, [item.key]: e.target.checked})}
                    className="form-checkbox h-4 w-4 text-eink-black rounded border-eink-gray"
                  />
                  <span className="text-xs md:text-sm">{item.label}</span>
                </label>
              ))}
            </div>

            {status && (
              <div className="text-center text-eink-gray text-xs md:text-sm uppercase">
                {status}
              </div>
            )}

            <button
              type="submit"
              className="w-[200px] h-[40px] p-2.5 bg-eink-black text-eink-white rounded-lg hover:bg-eink-gray transition-colors duration-200 text-xs md:text-sm uppercase font-medium font-quicksand mx-auto block"
            >
              ENVIAR
            </button>
          </form>
        </div>
      </div>
      
      <footer className="w-full py-3 text-xs text-eink-gray text-center uppercase">
        © 2103 CREATIVE - 2025
      </footer>
    </div>
  );
};

export default RequestQuote;

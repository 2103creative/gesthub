
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ScheduleCollection = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    whatsapp: '',
    name: '',
    city: '',
    volume: '',
    weight: '',
    cubicMeters: ''
  });
  const [status, setStatus] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (Object.values(formData).some(value => !value)) {
      setStatus('Preencha todos os campos');
      return;
    }

    const phone = formData.whatsapp.replace(/\D/g, '');
    const message = `Olá, ${formData.name}, tudo bem?\n\n` +
      `Me chamo Lenoir e falo da Gplásticos\n` +
      `Estou entrando em contato para agendar uma coleta.\n\n` +
      `- CNPJ: 16.914.559/0001-67\n` +
      `- Cidade destino: ${formData.city}\n` +
      `- Volume: ${formData.volume} vol.\n` +
      `- Peso: ${formData.weight} kg\n` +
      `- Cubagem: ${formData.cubicMeters} M³\n` +
      `- Horários para coleta: Segunda a Sexta, das 08h às 18h\n` +
      `- Endereço: R. Demétrio Ângelo Tiburi, 1716 - Bela Vista, Caxias do Sul - RS, 95072-150`;

    const url = `https://wa.me/55${phone}?text=${encodeURIComponent(message)}`;
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

          <h1 className="text-lg md:text-2xl font-light text-center mb-6 uppercase">Agendar Coleta</h1>

          <form onSubmit={handleSubmit} className="space-y-3">
            {[
              { key: 'whatsapp', placeholder: 'WHATSAPP (COM DDD)', type: 'tel' },
              { key: 'name', placeholder: 'NOME DO CLIENTE', type: 'text' },
              { key: 'city', placeholder: 'CIDADE DESTINO', type: 'text' },
              { key: 'volume', placeholder: 'VOLUME', type: 'text' },
              { key: 'weight', placeholder: 'PESO', type: 'text' },
              { key: 'cubicMeters', placeholder: 'CUBAGEM', type: 'text' }
            ].map((field) => (
              <div key={field.key}>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  value={formData[field.key as keyof typeof formData]}
                  onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                  className="w-[200px] h-[40px] p-2.5 bg-eink-lightGray rounded-lg outline-none text-xs md:text-sm uppercase font-quicksand mx-auto block"
                />
              </div>
            ))}

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
        © 2025 - DESENVOLVIDO POR 2103 CREATIVE - DESDE 2024
      </footer>
    </div>
  );
};

export default ScheduleCollection;

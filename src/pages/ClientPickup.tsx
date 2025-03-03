
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import type { NotaFiscal } from "../types/NotaFiscal";
import { NotasService } from "../services/notasService";

const ClientPickup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    whatsapp: '',
    contato: '',
    razaoSocial: '',
    invoice: ''
  });
  const [status, setStatus] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.whatsapp || !formData.contato || !formData.invoice || !formData.razaoSocial) {
      setStatus('Preencha todos os campos');
      return;
    }

    if (enviando) {
      toast.error("Enviando mensagem, aguarde...");
      return;
    }

    try {
      setEnviando(true);
      
      const phone = formData.whatsapp.replace(/\D/g, '');
      const message = `Olá, ${formData.contato}, tudo bem?\n\n` +
        `Me chamo Lenoir e falo da Gplásticos.\n` +
        `Estou entrando em contato para avisar que a sua mercadoria está pronta para coleta.\n\n` +
        `- Nota Fiscal Nº ${formData.invoice}\n` +
        `- Horários para coleta: Segunda a Sexta, das 08h às 18h\n` +
        `- Endereço: R. Demétrio Ângelo Tiburi, 1716 - Bela Vista, Caxias do Sul - RS, 95072-150`;

      const url = `https://wa.me/55${phone}?text=${encodeURIComponent(message)}`;
      
      // Salvar dados da nota no Supabase
      const novaNota: NotaFiscal = {
        razaoSocial: formData.razaoSocial,
        numeroNota: formData.invoice,
        dataEmissao: new Date(),
        dataEnvioMensagem: new Date(),
        contato: formData.contato,
        telefone: formData.whatsapp,
        status: 'pendente'
      };

      await NotasService.create(novaNota);
      
      window.open(url, '_blank');
      setStatus('Mensagem enviada!');
      toast.success("Nota registrada com sucesso!");
      
      // Limpar o formulário
      setFormData({
        whatsapp: '',
        contato: '',
        razaoSocial: '',
        invoice: ''
      });
    } catch (error) {
      console.error("Erro ao registrar nota:", error);
      toast.error("Erro ao registrar nota. Tente novamente.");
      setStatus('Erro ao enviar. Tente novamente.');
    } finally {
      setEnviando(false);
    }
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

          <h1 className="text-lg md:text-2xl font-light text-center mb-6 uppercase">Cliente Retira</h1>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <input
                type="text"
                placeholder="RAZÃO SOCIAL"
                value={formData.razaoSocial}
                onChange={(e) => setFormData({...formData, razaoSocial: e.target.value})}
                className="w-[200px] h-[40px] p-2.5 bg-eink-lightGray rounded-lg outline-none text-xs md:text-sm uppercase font-quicksand mx-auto block"
              />
            </div>

            <div>
              <input
                type="tel"
                placeholder="WHATSAPP (COM DDD)"
                value={formData.whatsapp}
                onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                className="w-[200px] h-[40px] p-2.5 bg-eink-lightGray rounded-lg outline-none text-xs md:text-sm uppercase font-quicksand mx-auto block"
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="CONTATO"
                value={formData.contato}
                onChange={(e) => setFormData({...formData, contato: e.target.value})}
                className="w-[200px] h-[40px] p-2.5 bg-eink-lightGray rounded-lg outline-none text-xs md:text-sm uppercase font-quicksand mx-auto block"
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="NOTA FISCAL"
                value={formData.invoice}
                onChange={(e) => setFormData({...formData, invoice: e.target.value})}
                className="w-[200px] h-[40px] p-2.5 bg-eink-lightGray rounded-lg outline-none text-xs md:text-sm uppercase font-quicksand mx-auto block"
              />
            </div>

            {status && (
              <div className="text-center text-eink-gray text-xs md:text-sm uppercase">
                {status}
              </div>
            )}

            <button
              type="submit"
              disabled={enviando}
              className="w-[200px] h-[40px] p-2.5 bg-[#ea384c] text-eink-white rounded-lg hover:bg-red-600 transition-colors duration-200 text-xs md:text-sm uppercase font-bold font-quicksand mx-auto block"
            >
              {enviando ? "ENVIANDO..." : "ENVIAR"}
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

export default ClientPickup;

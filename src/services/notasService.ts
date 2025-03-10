
import { NotasFiscaisQueryService } from "./notasFiscaisQuery";
import { NotasFiscaisCommandService } from "./notasFiscaisCommand"; 
import { NotasFiscaisStatusService } from "./notasFiscaisStatus";
import { NotasFiscaisMensagemService } from "./notasFiscaisMensagem";
import { dbToNotaFiscal, notaFiscalToDB } from "../utils/notasFiscaisConverter";

// Export the converter functions for convenience
export { dbToNotaFiscal, notaFiscalToDB };

// Main service facade that combines all nota fiscal services
export const NotasService = {
  // Query operations
  getAll: NotasFiscaisQueryService.getAll,
  
  // Command operations
  create: NotasFiscaisCommandService.create,
  update: NotasFiscaisCommandService.update,
  delete: NotasFiscaisCommandService.delete,
  
  // Status operations
  atualizarStatus: NotasFiscaisStatusService.atualizarStatus,
  marcarRetirado: NotasFiscaisStatusService.marcarRetirado,
  
  // Message operations
  reenviarMensagem: NotasFiscaisMensagemService.reenviarMensagem
};

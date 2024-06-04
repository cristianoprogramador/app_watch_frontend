import { SetStateAction, useState } from "react";
import Modal from "../Modal";
import ModalHeader from "../ModalHeader";
import { api } from "../../utils/api";

interface ModalSendEmailProps {
  modalInfo: boolean;
  setModalInfo: (value: SetStateAction<boolean>) => void;
}

export const ModalSendEmail = ({
  modalInfo,
  setModalInfo,
}: ModalSendEmailProps) => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await api.post("/auth/request-reset-password", { email });
      alert(
        "Se o email estiver cadastrado, você receberá um link para redefinir sua senha."
      );
      setModalInfo(false)
    } catch (error) {
      console.error("Erro ao enviar email de redefinição de senha:", error);
      alert("Erro ao enviar email de redefinição de senha.");
    }
  };

  return (
    <Modal isOpen={modalInfo} setIsOpen={setModalInfo}>
      <ModalHeader onClose={() => setModalInfo(false)} title="Resetar Senha" />
      <form onSubmit={handleSubmit} className="flex flex-col">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite seu email"
          required
          className="p-2 border"
        />
        <button
          type="submit"
          className="cursor-pointer mt-5 font-semibold rounded-lg text-base text-center w-full bg-[#0C346E] text-white hover:opacity-80 py-3"
        >
          Resetar Senha
        </button>
      </form>
    </Modal>
  );
};

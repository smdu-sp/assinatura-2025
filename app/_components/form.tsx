/** @format */

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ViewAssinatura } from "@/components/view-assinatura";
import { Session } from "next-auth";
import * as htmlToImage from "html-to-image";
import { Copy, Download } from "lucide-react";
import { DatePicker } from "@/components/date-picker";
import { format } from "date-fns";
import React from "react";

type CustomUser = {
  id: string;
  email: string;
  nome: string;
  login: string;
  // eslint-disable-next-line
  permissao: any;
  cargo?: string;
  unidade?: string;
  andar?: string;
  aniversario?: string;
  ramal?: string;
};

interface CustomSession extends Session {
  user: CustomUser;
}

interface InputFormProps extends React.ComponentPropsWithoutRef<"div"> {
  className?: string;
  session: CustomSession | null;
}

// eslint-disable-next-line
const PhoneMask = (value: any) => {
  if (!value) return "";
  value = value.replace(/\D/g, "");
  value = value.replace(/(\d{2})(\d)/, "($1) $2");
  value = value.replace(/(\d)(\d{4})$/, "$1-$2");
  return value;
};

export function InputForm({ className, session, ...props }: InputFormProps) {
  // eslint-disable-next-line
  const router = useRouter();

  const getShortName = (fullName: string | undefined) => {
    if (!fullName) return "";
    if (fullName.length >= 30) {
      const nameParts = fullName.split(" ");
      return `${nameParts[0]} ${nameParts[nameParts.length - 1]}`;
    }
    return fullName;
  };

  const [setores, setSetores] = useState<{ id: string; nome: string }[]>([]);
  const [nome, setNome] = useState(getShortName(session?.user?.nome) || "");
  const [cargo, setCargo] = useState(session?.user?.cargo || "");
  const [unidade, setUnidade] = useState(session?.user?.unidade || "");
  const secretaria = "URBANISMO E LICENCIAMENTO";
  const [email, setEmail] = useState(session?.user?.email || "");
  const [andar, setAndar] = useState(session?.user?.andar || "");
  const [nascimento, setNascimento] = React.useState<string>(
    session?.user?.aniversario || ""
  );
  const endereco = `Rua São Bento, 405 | ${andar}º andar`;
  const endereco2 = "01011 100 | São Paulo | SP";
  const site = "www.prefeitura.sp.gov.br";
  const [ramal, setRamal] = useState(PhoneMask(session?.user?.ramal) || "");
  const displaySignatureRef = useRef<HTMLDivElement>(null);
  const copySignatureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadInitialData() {
      if (!session?.user?.id) return;

      try {
        // Busca setores
        const setoresResponse = await fetch("/api/setores");
        if (!setoresResponse.ok) throw new Error("Erro ao buscar setores");
        const setoresData = await setoresResponse.json();
        setSetores(setoresData);

        // Busca dados completos do usuário, incluindo ramal de grupo
        const usuarioResponse = await fetch("/api/usuarios/proprio/get-user");
        if (!usuarioResponse.ok)
          throw new Error("Erro ao buscar dados do usuário");
        const usuarioData = await usuarioResponse.json();

        if (usuarioData) {
          setNome(getShortName(usuarioData.nome));
          setEmail(usuarioData.email || "");
          setCargo(usuarioData.cargo || "");
          setUnidade(usuarioData.setorId || "");
          setAndar(usuarioData.andar || "");
          setNascimento(usuarioData.aniversario || "");
          setRamal(PhoneMask(usuarioData.ramal) || "");
        }
      } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error);
        toast.error("Erro ao carregar dados iniciais do usuário.");
      }
    }

    loadInitialData();
  }, [session]);


  const generateSignatureImage = async (): Promise<string | null> => {
    if (displaySignatureRef.current === null) {
      toast.error(
        "Erro ao gerar imagem da assinatura: Elemento não encontrado."
      );
      return null;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 50));
      const dataUrl = await htmlToImage.toPng(displaySignatureRef.current);
      return dataUrl;
      // eslint-disable-next-line
    } catch (error) {
      toast.error("Erro ao gerar imagem da assinatura.");
      return null;
    }
  };

  const saveDataToDatabase = async (
    unidade: string,
    cargo: string,
    aniversario: string,
    andar: string,
    ramal: string
  ) => {
    try {
      if (!session?.user?.email) {
        toast.error("Usuário não autenticado.");
        return;
      }

      // eslint-disable-next-line
      const formattedAniversario = aniversario
        ? format(aniversario, "yyyy-MM-dd")
        : "";
      const response = await fetch("/api/usuarios/proprio", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session.user.email,
          unidade,
          cargo,
          aniversario: aniversario,
          andar,
          ramal,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Erro ao salvar dados:", data.error);
        toast.error(
          `Erro ao salvar dados`
        );
      }
    } catch (error) {
      console.error("Erro de rede ou inesperado:", error);
      toast.error("Ocorreu um erro inesperado ao salvar os dados.");
    }
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const submitter = (event.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement | null;
    const actionType = submitter?.name;

    if (!nome || !email || !cargo || !unidade || !andar || !ramal) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    await saveDataToDatabase(unidade, cargo, nascimento, andar, ramal);

    if (actionType === "download") {
      const signatureDataUrl = await generateSignatureImage();
      if (signatureDataUrl) {
        const link = document.createElement("a");
        link.href = signatureDataUrl;
        link.download = "assinatura_email.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Assinatura baixada com sucesso!");
      } else {
        console.error(
          "Falha ao gerar a imagem da assinatura. Download não realizado."
        );
      }
    } else if (actionType === "copy") {
      handleCopy();
    }
  }

  function handleCopy() {
    const divToCopy = copySignatureRef.current;

    if (!divToCopy) {
      toast.error("Não foi possível copiar a assinatura. Tente novamente.");
      return;
    }

    try {
      const range = document.createRange();
      range.selectNode(divToCopy);

      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);

        const success = document.execCommand("copy");
        selection.removeAllRanges();

        if (success) {
          toast.success("Assinatura copiada com sucesso!");
        } else {
          toast.error(
            "Falha ao copiar a assinatura. Seu navegador pode não suportar esta ação."
          );
        }
      } else {
        toast.error("Erro ao acessar a seleção do navegador.");
      }
    } catch (err) {
      console.error("Erro durante a operação de cópia:", err);
      toast.error("Ocorreu um erro inesperado ao copiar a assinatura.");
    }
  }

  return (
    <div
      className={cn("flex flex-col gap-6 w-full mx-auto", className)}
      {...props}
    >
      <div className="-translate-y-14">
        <ViewAssinatura
          nome={nome}
          cargo={cargo}
          unidade={setores.find((setor) => setor.id === unidade)?.nome || ""}
          secretaria={secretaria}
          email={email}
          endereco={endereco}
          endereco2={endereco2}
          andar={andar}
          site={site}
          ramal={ramal}
          mode="display"
          ref={displaySignatureRef}
        />

        <ViewAssinatura
          nome={nome}
          cargo={cargo}
          unidade={setores.find((setor) => setor.id === unidade)?.nome || ""}
          secretaria={secretaria}
          email={email}
          endereco={endereco}
          endereco2={endereco2}
          andar={andar}
          site={site}
          ramal={ramal}
          mode="copy"
          ref={copySignatureRef}
        />

        <form className="mt-10 w-full" onSubmit={handleSubmit}>
          <p className="text-sm text-muted-foreground">
            {" "}
            Os campos marcados com * são obrigatórios.{" "}
          </p>{" "}
          <br />
          <div className="grid grid-cols-6 gap-4">
            <div className="grid col-span-6 md:col-span-3 gap-2">
              <Label htmlFor="nome">Nome *</Label>
              <Input
                className="bg-background"
                id="nome"
                type="text"
                name="nome"
                placeholder="Nome"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
            <div className="grid col-span-6 md:col-span-3 gap-2">
              <Label htmlFor="email">E-mail *</Label>
              <Input
                disabled
                className="bg-background"
                id="email"
                placeholder="example@example.com"
                type="email"
                name="email"
                required
                value={email}
              />
            </div>
            <div className="grid col-span-6 md:col-span-2 gap-2">
              <Label htmlFor="unidade">Unidade *</Label>
              <Select
                required
                name="unidade"
                value={unidade}
                onValueChange={(value) => setUnidade(value)}
              >
                <SelectTrigger className="w-full bg-background">
                  <SelectValue placeholder="Selecione a unidade" />
                </SelectTrigger>
                <SelectContent>
                  {setores.map((setor) => (
                    <SelectItem key={setor.id} value={setor.id}>
                      {setor.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid col-span-6 md:col-span-2 gap-2">
              <Label htmlFor="cargo">Cargo *</Label>
              <Input
                className="bg-background"
                id="cargo"
                placeholder="Assessor"
                type="text"
                name="cargo"
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
              />
            </div>
            <div className="grid col-span-6 md:col-span-2 gap-2">
              <Label htmlFor="andar">Andar *</Label>
              <Select
                required
                name="andar"
                value={andar}
                onValueChange={(value) => setAndar(value)}
              >
                <SelectTrigger size="default" className="w-full bg-background">
                  <SelectValue placeholder="Selecione o andar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="8">8</SelectItem>
                  <SelectItem value="17">17</SelectItem>
                  <SelectItem value="18">18</SelectItem>
                  <SelectItem value="19">19</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="21">21</SelectItem>
                  <SelectItem value="22">22</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid col-span-6 md:col-span-3 gap-2">
              <Label htmlFor="cargo">Ramal de Grupo *</Label>
              <Input
                className="bg-background"
                id="ramal"
                placeholder="(11) 99999-9999"
                type="text"
                name="ramal"
                value={ramal}
                onChange={(e) => setRamal(PhoneMask(e.target.value))}
              />
            </div>
            <div className="grid col-span-6 md:col-span-3 gap-2">
              <Label htmlFor="nascimento">Aniversário</Label>
              <DatePicker
                value={nascimento}
                onChange={(val) => setNascimento(val || "")}
              />
            </div>
            <div className="grid col-span-6 md:col-span-3 mt-4">
              <Button type="submit" name="download">
                <Download className="mr-2 h-4 w-4" />
                Baixar Assinatura
              </Button>
            </div>
            <div className="grid col-span-6 md:col-span-3 mt-4">
              <Button type="submit" name="copy">
                <Copy className="mr-2 h-4 w-4" />
                Copiar Assinatura
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

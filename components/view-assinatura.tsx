
import Image from 'next/image';
import logo from '@/public/img_assinatura.png';
import { color } from 'framer-motion';

interface ViewAssinaturaProps {
  nome: string;
  cargo: string;
  unidade: string;
  email: string;
  telefone: string;
  endereco: string;
  andar: string;
  endereco2 : string;
  site: string;
}

export function ViewAssinatura({
  nome,
  cargo,
  unidade,
  email,
  telefone,
  endereco,
  andar,
  endereco2,
  site,
}: ViewAssinaturaProps) {
  return (
    <div className="flex items-center border p-4 rounded-md bg-white">
      <Image
        src={logo.src}
        alt="logo"
        width={200}
        height={200}
        className="mr-0"
      />
      <div className="border-l-4 border-black h-50 mr-4"></div>
      <div>
        <p className="font-bold text-black-800">{nome.toUpperCase()}</p>
        <p className="text-black-600">{cargo.toUpperCase()} / {unidade}</p>
        <br></br>
        <p className="text-black-600">{email}</p>
        <p className="text-black-600">{telefone}</p>
        <p className="text-black-600">{endereco.replace('${andar}', andar)}</p>
        <p className="text-black-600">{endereco2}</p>
        <p className="text-black-500">{site}</p>
      </div>
    </div>
  );
}

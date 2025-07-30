
import Image from 'next/image';
import logo from '@/public/img_assinatura.png';
import React, { forwardRef } from 'react';

interface ViewAssinaturaProps {
  nome: string;
  cargo: string;
  // unidade: string;
  secretaria: string;
  email: string;
  telefone: string;
  endereco: string;
  andar: string;
  endereco2 : string;
  site: string;
}

export const ViewAssinatura = forwardRef<HTMLDivElement, ViewAssinaturaProps>(
  (
    {
  nome,
  cargo,
  // unidade,
  secretaria,
  email,
  telefone,
  endereco,
  andar,
  endereco2,
  site, 
    },
    ref
  ) => {
  return (
    <div id='assinatura' ref={ref} className="flex items-center border p-4 rounded-md bg-white">
        <Image
          src={logo.src}
          alt="logo"
          width={200}
          height={200}
          className="mr-2"
        />
        <div className="border-l-3 border-gray-400 h-60 mr-4"></div>
        <div className="flex flex-col gap-4">
          <div>
            <p className="font-title-sans font-bold text-[18.5px]">{nome.toUpperCase()}</p>
            <p className="font-sans text-[12px]">{cargo.toUpperCase()}</p>
          </div>
          <div>
            <p className="font-sans underline font-bold text-[12px]">{secretaria.toUpperCase()}</p>
          </div>
          <div>
            <p className="font-sans text-[12px]">{email}</p>
          </div>
          <div>
            <p className="font-sans text-[12px]">{endereco.replace('${andar}', andar)}</p>
            <p className="font-sans text-[12px]">{telefone}</p>
            <p className="font-sans text-[12px]">{endereco2}</p>
          </div>
          <div>
            <p className="font-sans text-[12px]">{site}</p>
          </div>
      </div>
    </div>
  );
}
);

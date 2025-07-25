/** @format */

'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PrismaClient } from '@prisma/client';
import { ViewAssinatura } from '@/components/view-assinatura';
import { Session } from 'next-auth';
import * as htmlToImage from 'html-to-image';



const handlePhone = (event : any) => {
  let input = event.target
  input.value = PhoneMask(input.value)
}
const PhoneMask = (value : any) => {
  if (!value) return ""
  value = value.replace(/\D/g,'')
  value = value.replace(/(\d{2})(\d)/,"($1) $2")
  value = value.replace(/(\d)(\d{4})$/,"$1-$2")
  return value
}

interface InputFormProps extends React.ComponentPropsWithoutRef<'div'> {
  className?: string,
  session: Session | null
}
export function InputForm({
  className,
  session,
  ...props
}: InputFormProps) {
  const router = useRouter();
  const shortName = () => {
    if ((session?.user?.nome?.length || 0) >= 30) {
      const name = (session?.user?.nome ?? '').split(' ');
      return `${name[0]} ${name[name.length - 1]}`;
    }
    else {
      return session?.user?.nome;
    }
  };

  const [setores, setSetores] = useState<{id: string; nome: string;}[]>([]);
  const [nome, setNome] = useState(shortName() || '');
  const [cargo, setCargo] = useState('');
  const [unidade, setUnidade] = useState('');
  const [email, setEmail] = useState(session?.user?.email || '');
  const [telefone, setTelefone] = useState(PhoneMask(session?.user?.telefone) || '');
  const [andar, setAndar] = useState('');
  const endereco = 'Rua São Bento, 405 | ${andar}º andar';
  const endereco2 = '01011 100 | São Paulo | SP';
  const site = 'www.prefeitura.sp.gov.br';

  useEffect(() => {
    async function loadSetores() {
      try {
        const response = await fetch('/api/setores');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSetores(data);
      } catch (error) {
        console.error("Erro ao buscar setores:", error);
      }
    }

    loadSetores();

    if (session?.user?.nome) {
      const nomeInput = document.querySelector<HTMLInputElement>('input[name="nome"]');
      if (nomeInput) {
        nomeInput.value = session.user.nome;
      }
    }
    if (session?.user?.email) {
      const emailInput = document.querySelector<HTMLInputElement>('input[name="email"]');
      if (emailInput) {
        emailInput.value = session.user.email;
      }
    }
  }, [session]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nome = form.get('nome');
    const email = form.get('email');
    const unidade = form.get('unidade');
    const cargo = form.get('cargo');
    const telefone = form.get('tel');
    const nascimento = form.get('nascimento');

    console.log({ nome, email, unidade, cargo, telefone, nascimento });
  }

  return (
    <div
      className={cn('flex flex-col gap-6 w-full mx-auto', className)}
      {...props}>
      <div className='-translate-y-14'>

      <ViewAssinatura
        nome={nome}
        cargo={cargo}
        unidade={unidade}
        email={email}
        telefone={telefone}
        endereco={endereco}
        endereco2={endereco2}
        andar={andar}
        site={site}
      />

        <form
          onSubmit={handleSubmit}
          className='mt-10 w-full'>
            <div className='grid grid-cols-6 gap-4'>
              <div className='grid col-span-6 md:col-span-3 gap-2'>
                <Label htmlFor='nome'>Nome</Label>
                <Input
                  className='bg-background'
                  id='nome'
                  type='text'
                  name='nome'
                  placeholder='Nome'
                  required
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>
              <div className='grid col-span-6 md:col-span-3 gap-2'>
                <Label htmlFor='email'>E-mail</Label>
                <Input
                  disabled
                  className='bg-background'
                  id='email'
                  placeholder='example@example.com'
                  type='email'
                  name='email'
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className='grid col-span-6 md:col-span-3 gap-2'>
                <Label htmlFor='unidade'>Unidade</Label>
                <Select required name="unidade" onValueChange={(value) => setUnidade(value)}>
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder="Selecione a unidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {setores.map((setor) => (
                      <SelectItem key={setor.id} value={setor.nome}>
                        {setor.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='grid col-span-6 md:col-span-3 gap-2'>
                <Label htmlFor='cargo'>Cargo</Label>
                <Input
                  className='bg-background'
                  id='cargo'
                  placeholder='Acessor'
                  type='text'
                  name='cargo'
                  required
                  value={cargo}
                  onChange={(e) => setCargo(e.target.value)}
                />
              </div>
              <div className='grid col-span-6 md:col-span-2 gap-2'>
                <Label htmlFor='andar'>Andar</Label>
                <Select required name="andar" onValueChange={(value) => setAndar(value)}>
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
              <div className='grid col-span-6 md:col-span-2 gap-2'>
                <Label htmlFor='tel'>Telefone</Label>
                <Input
                  className='bg-background'
                  id='tel'
                  placeholder='(11) 99999-9999'
                  type='tel'
                  name='tel'
                  maxLength={15}
                  required
                  value={telefone}
                  onChange={(e) => setTelefone(PhoneMask(e.target.value))}
                />
              </div>
              <div className='grid col-span-6 md:col-span-2 gap-2'>
                <Label htmlFor='nascimento'>Data de nascimento</Label>
                <Input
                  className='bg-background'
                  id='nascimento'
                  placeholder='DD/MM/AAAA'
                  type='date'
                  name='nascimento'
                />
              </div>
              <div className='grid h-full col-span-6'>
                <Button
                  type='submit'
                  className='w-full'>
                  Atualizar Cadastro
                </Button>
              </div>
            </div>
        </form>
      </div>
    </div>
  );
}

/** @format */

'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { usePathname } from 'next/navigation';

export default function UserLogged() {
	const path = usePathname();
	return (
		path === '/aptidao' && (
			<div className='flex items-center gap-3'>
				<p className='text-base font-semibold'>David Diniz Dos Santos</p>
				<Avatar>
					<AvatarImage
						src='https://github.com/shadcn.png'
						alt='@shadcn'
					/>
					<AvatarFallback>CN</AvatarFallback>
				</Avatar>
			</div>
		)
	);
}

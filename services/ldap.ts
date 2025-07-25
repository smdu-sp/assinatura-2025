/** @format */

import 'server-only';
import { db } from '@/lib/prisma';
import { Client as LdapClient } from 'ldapts';

const ldap = new LdapClient({
	url: process.env.LDAP_SERVER || 'ldap://1.1.1.1',
});

async function bind(login: string, senha: string) {
	let usuario = await db.usuario.findUnique({ where: { login } });
	if (!usuario) {
		const buscaUsuario = await buscarPorLogin(login);
		console.log(buscaUsuario);
		if (!buscaUsuario) return null;
		const novoUsuario = await db.usuario.create({ data: buscaUsuario });
		if (!novoUsuario) return null;
		usuario = novoUsuario;
	}
	if (process.env.ENVIRONMENT == 'local') return usuario;
	try {
		await ldap.bind(`${login}${process.env.LDAP_DOMAIN}`, senha);
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (error) {
		usuario = null;
	}
	await ldap.unbind();
	return usuario;
}

async function buscarPorLogin(
	login: string,
): Promise<{ nome: string; email: string; login: string; telefone?: string } | null> {
	if (!login || login === '') return null;
	let resposta = null;
	console.log({ login });
	try {
		await ldap.bind(
			`${process.env.LDAP_USER}${process.env.LDAP_DOMAIN}`,
			process.env.LDAP_PASS || '',
		);
		const usuario = await ldap.search(process.env.LDAP_BASE || '', {
			filter: `(&(samaccountname=${login})(|(company=SMUL)(company=SPURBANISMO)))`,
			scope: 'sub',
		});
		const { name, mail, telephoneNumber } = usuario.searchEntries[0];
		const nome = name.toString();
		const email = mail.toString().toLowerCase();
		const telefone = telephoneNumber.toString().replace('55', '').replace(/\D/g, '');
		resposta = { nome, email, login, telefone };
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (err) {}
	ldap.unbind();
	return resposta;
}

async function buscarPorNome(
	nome: string,
): Promise<{ nome: string; email: string; login: string; telefone?: string } | null> {
	if (!nome || nome === '') return null;
	let resposta = null;
	nome = nome.toLowerCase();
	try {
		await ldap.bind(
			`${process.env.LDAP_USER}${process.env.LDAP_DOMAIN}`,
			process.env.LDAP_PASS || '',
		);
		const usuario = await ldap.search(process.env.LDAP_BASE || '', {
			filter: `(&(name=${nome})(|(company=SMUL)(company=SPURBANISMO)))`,
			attributes: ['samaccountname', 'mail', 'name', 'telephoneNumber'],
			scope: 'sub',
		});
		if (usuario.searchEntries && usuario.searchEntries.length > 0) {
			const { sAMAccountName, mail, name, telephoneNumber } = usuario.searchEntries[0];
			const login = sAMAccountName.toString();
			const email = mail.toString().toLowerCase();
			const telefone = telephoneNumber.toString();
			nome = name.toString();
			resposta = { nome, email, login, telefone };
		}
	} catch (err) {
		console.log(err);
	}
	ldap.unbind();
	return resposta;
}

async function buscarPorLoginOuNome(
	login: string,
	nome: string,
): Promise<{ nome: string; email: string; login: string  } | null> {
	let resposta = buscarPorLogin(login);
	if (!resposta) resposta = buscarPorNome(nome);
	return resposta;
}

export { bind, buscarPorLogin, buscarPorNome, buscarPorLoginOuNome };

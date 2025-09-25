/** @format */

import 'server-only';
import { db } from '@/lib/prisma';
import { Client as LdapClient } from 'ldapts';

const ldapServers = [
  "ldap://10.10.53.10",
  "ldap://10.10.53.11",
  "ldap://10.10.53.12",
  "ldap://10.10.64.213",
  "ldap://10.10.65.242",
  "ldap://10.10.65.90",
  "ldap://10.10.65.91",
  "ldap://10.10.66.85",
  "ldap://10.10.68.42",
  "ldap://10.10.68.43",
  "ldap://10.10.68.44",
  "ldap://10.10.68.45",
  "ldap://10.10.68.46",
  "ldap://10.10.68.47",
  "ldap://10.10.68.48",
  "ldap://10.10.68.49",
];

function createLdapServer(server: string) {
	return new LdapClient({
		url: server,
	});
}

async function bind(login: string, senha: string) {
	let usuario = await db.usuario.findUnique({ where: { login } });
	if (!usuario) {
		const buscaUsuario = await buscarPorLogin(login);
		if (!buscaUsuario) return null;
		const novoUsuario = await db.usuario.create({ data: buscaUsuario });
		if (!novoUsuario) return null;
		usuario = novoUsuario;
	}
	if (process.env.ENVIRONMENT == 'local') return usuario;
	let serverNum = 0;
	do {
		try {
			const ldap = createLdapServer(ldapServers[serverNum]);
			await ldap.bind(`${login}${process.env.LDAP_DOMAIN}`, senha);
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (error) {
			usuario = null;
		}
		serverNum++;
		if (usuario) break;
	} while (serverNum < ldapServers.length);
	return usuario;
}

async function buscarPorLogin(
	login: string,
): Promise<{ nome: string; email: string; login: string; telefone?: string } | null> {
	if (!login || login === '') return null;
	let resposta = null;
	let serverNum = 0;
	const errors: any[] = [];
	do {
		try {
			const ldap = createLdapServer(ldapServers[serverNum]);
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
			const telefone = telephoneNumber ? telephoneNumber.toString().replace('55', '').replace(/\D/g, '') : undefined;
			resposta = { nome, email, login, telefone };
			ldap.unbind();
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (err) {
			resposta = null;
			errors.push({
				server: ldapServers[serverNum],
				error: err,
			});
		}
		serverNum++;
		if (resposta) break;
	} while (serverNum < ldapServers.length);
	return resposta;
}

async function buscarPorNome(
	nome: string,
): Promise<{ nome: string; email: string; login: string; telefone?: string } | null> {
	if (!nome || nome === '') return null;
	let resposta = null;
	nome = nome.toLowerCase();
	let serverNum = 0;
	do {
		try {
			const ldap = createLdapServer(ldapServers[serverNum]);
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
			ldap.unbind();
		} catch (err) {
			resposta = null;
		}
		serverNum++;
		if (resposta) break;
	} while (serverNum < ldapServers.length);
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

const { create, Client } = require('@open-wa/wa-automate')
const fs = require('fs-extra')
const kconfig = require('./config')
const { color, sleep, options } = require('./lib/functions')
const config = require('./lib/config/Gerais/config.json')
const canvas = require('discord-canvas')
const { mylang } = require('./lib/lang')
const axios = require('axios')
const irisvs = require('./package.json')
var welcOn = 0;var abayo = 0
const { decryptMedia } = require('@open-wa/wa-decrypt')
const { gaming } = require('./lib/functions')
const nivel = JSON.parse(fs.readFileSync('./lib/config/Gerais/level.json'))
const moment = require('moment-timezone')
var region = config.Language
var mess = mylang(region);moment.tz.setDefault('America/Sao_Paulo').locale('pt_BR')
const uaOverride = config.User_Agent
const getrphoto = () => { return Math.floor(Math.random() * 4) + 1 }
const lastchanged = JSON.parse(fs.readFileSync('./lib/config/Utilidades/lastchanged.json'))
const ownerNumber = config.Owner



// Quantidade máxima de Backups do Level.json e MsgCount.json
const maxBackups = Math.floor(Math.random() * 2) + 1

// Apaga a pasta de cache do Chrome caso exista
if (fs.existsSync('./logs/Chrome')) { fs.rmdirSync('./logs/Chrome', { recursive: true }) }

// Verifica por mudanças e se encontrado, recarrega o arquivo
const watchFile = (file) => { fs.watchFile(file, async () => { return new Promise((resolve, reject) => { try { console.log(color('[EDIÇÃO]', 'crimson'), color(`Uuuu! Melhorias em tempo real! Irei usar agora mesmo, estou reiniciando!`, 'yellow'));delete require.cache[require.resolve(file)];resolve();console.log(color('[EDIÇÃO]', 'lime'), color(`Reiniciei com sucesso! Testa, Testa!`, 'yellow')) } catch (error) { reject(error) } }) }) }

// Cria um cliente de inicialização da BOT
const start = async (kill = new Client(message)) => {

	const getversion = await axios.get('https://raw.githubusercontent.com/KillovSky/iris/main/package.json')
	if (irisvs.version !== getversion.data.version) { console.log(color('\n[UPDATE]', 'crimson'), color(`Uma nova versão da Íris foi lançada [${getversion.data.version}], atualize para obter melhorias e correções! → ${irisvs.homepage}`, 'gold')) }
	console.log(color('\n[SUPORTE]', 'magenta'), color(`https://bit.ly/3owVJoB | ${irisvs.bugs.url}\n`, 'lime'), color(`\n[ÍRIS ${irisvs.version} - BETA]`, 'magenta'), color('Estamos prontos para começar mestre!\n', 'lime'))
	//await kill.sendText("559391546825-1519748070@g.us", 'estou online!!');


	// Auto Recarregamento da Config.js sem reiniciar, para casos de edições em tempo real, use com cautela e ative a require la em baixo se usar
	await watchFile('./config.js') //24*60*60*1000


	// Backup dos arquivos toda vez que religaFr a BOT
	const whotobackup = ['level.json', 'custom.json', 'greetings.json', 'cmds.json', 'functions.json']
	for (let i = 0; i < whotobackup.length; i++) {
		var fileReadBk = JSON.parse(fs.readFileSync('./lib/config/Gerais/' + whotobackup[i]))
		await fs.writeFileSync(`./lib/config/Gerais/Backup/${maxBackups}-${whotobackup[i]}`, JSON.stringify(fileReadBk))
	}
	
	// Forçar recarregamento caso obtenha erros
	kill.onStateChanged(async (state) => {
		console.log(color('[RELOAD]', 'red'), color('Isso pode ser ignorado →', 'lime'), color(state, 'yellow'))
		if (state === 'UNPAIRED' || state === 'CONFLICT' || state === 'UNLAUNCHED') await kill.forceRefocus()
	})

	// Lê as mensagens, se você quer usar o watchFile, mude para o require | Ative a await se quiser auto limpeza de cache, 3000 significa limpeza a cada 3000 mensagens
	kill.onMessage(async (message) => {
		await kill.getAmountOfLoadedMessages().then(async (msg) => { if (msg >= 3000) { await kill.cutMsgCache();await kill.cutChatCache() } })
		await kconfig(kill, message) // require('./config')(kill, message)
	})
	// Você pode rodar certos comandos(/enviar por exemplo) pelo próprio WhatsApp da BOT trocando o "kill.onMessage" por "kill.onAnyMessage", não recomendado.
	// Caso deseje, faça um "wa.me" do próprio número e rode os comandos em um chat consigo mesmo.

	/*if (Date.now() - Number(lastchanged[0].profile) > 60000 ) {
		if (!fs.existsSync(`./lib/config/Utilidades/lastchanged.json`)) { await fs.writeFile(`./lib/config/Utilidades/lastchanged.json`, '[{"profile":[],"group":[]}]') }
		const novafoto = await fs.readFileSync(`./lib/media/fotos/foto(${getrphoto()}).png`)
		await kill.setProfilePic(`data:image/png;base64,${novafoto.toString('base64')}`)
		lastchanged[0].profile = Date.now()
		await fs.writeFileSync(`./lib/config/Utilidades/lastchanged.json`, JSON.stringify(lastchanged))
		//await kill.sendText("559391546825-1519748070@g.us", '[FOTO DO PERFIL ALTERADA]');
		console.log(color('[FOTO DO PERFIL ALTERADA]', 'red'))
	}*

	/*if (Date.now() - Number(lastchanged[0].group) > 60000 ) {
		var novafoto = await fs.readFileSync(`./lib/media/fotos/foto(${getrphoto()}).png`)
		await kill.setGroupIcon('559391546825-1519748070@g.us', `data:image/png;base64,${novafoto.toString('base64')}`, `foto(${getrphoto()}).png`)
		lastchanged[0].group = Date.now()
		await fs.writeFileSync(`./lib/config/Utilidades/lastchanged.json`, JSON.stringify(lastchanged))
		console.log(color('[FOTO DO GRUPO ALTERADA]', 'red'))
	}*/

	kill.onMessageDeleted(async (msg) => {
		const moment = require('moment-timezone')
		var deleted = JSON.parse(fs.readFileSync('./lib/config/Utilidades/deleted.json'))
		msg.t = moment(msg.t * 1000).format('DD/MM/YY HH:mm:ss')
		if (!deleted[0].exceptions.includes(msg.from)) {
			var contato = await kill.getContact(msg.from)
			var nome = contato.pushname == null ? 'wa.me/' + msg.from.replace('@c.us', '') : contato.pushname
			console.log('[DELETED]', msg.body, 'AS', color(msg.t, 'yellow'), 'DE', nome, '-', msg.from.replace('@c.us', ''))
			deleted[0].msgs.push(msg)
			console.log(deleted[0].msgs.length)
			if (deleted[0].msgs.length > 50) { deleted[0].msgs.shift() }
			await fs.writeFileSync('./lib/config/Utilidades/deleted.json', JSON.stringify(deleted));
		}
	})

	kill.onButton(async (msg) => {
		const checkLvL = await gaming.getValue(msg.author, nivel, 'level')
		const time = moment(msg.t * 1000).format('DD/MM HH:mm:ss')
		const processTime = (timestamp, now) => { return moment.duration(now - moment(timestamp * 1000)).asSeconds() }
		const patente = await gaming.getPatent(checkLvL)
		const getReqXP = (theRcvLvL) => { return Number(config.XP_Difficulty) * Math.pow(theRcvLvL, 2) * Number(config.XP_Difficulty) + 1000 }
		const theMsg = await gaming.getValue(msg.author, nivel, 'msg')
		const uzrXp = await gaming.getValue(msg.author, nivel, 'xp')
		const uzrlvl = await gaming.getValue(msg.author, nivel, 'level')
		const mping = processTime(msg.t, moment())
		if(msg.body == '!menu' && msg.type == 'buttons_response'){
			await kill.sendText(msg.from, mess.menu(msg.sender.pushname, time, theMsg, uzrXp, getReqXP(uzrlvl), uzrlvl, mping, patente))
		}
	})

	
	kill.onButton(async (msg) => {
		if(msg.selectedButtonId == '1'){
			await kill.sendImageAsSticker(msg.from, './lib/media/figurinhas/foto(1)2.png') 
			await kill.sendImageAsSticker(msg.from, './lib/media/figurinhas/foto(2)2.png')
			await kill.sendImageAsSticker(msg.from, './lib/media/figurinhas/foto(3)2.png')
			await kill.sendImageAsSticker(msg.from, './lib/media/figurinhas/foto(4)2.png')
			await sleep(100)
			await kill.sendButtons(msg.from, "Clique no butão", [{id: "2", "text": 'Quero!!'}], `Quer mais figurinhas?`)
		}
		if(msg.selectedButtonId == '2'){
			await kill.sendImageAsSticker(msg.from, './lib/media/figurinhas/foto(1)3.png') 
			await kill.sendImageAsSticker(msg.from, './lib/media/figurinhas/foto(2)3.png')
			await kill.sendImageAsSticker(msg.from, './lib/media/figurinhas/foto(3)3.png')
			await kill.sendImageAsSticker(msg.from, './lib/media/figurinhas/foto(4)3.png')
			await sleep(100)
			await kill.sendButtons(msg.from, "Clique no butão", [{id: "3", "text": 'Quero!!'}], `Quer mais figurinhas?`)
		}
		if(msg.selectedButtonId == '3'){
			await kill.sendImageAsSticker(msg.from, './lib/media/figurinhas/foto(1)4.png') 
			await kill.sendImageAsSticker(msg.from, './lib/media/figurinhas/foto(2)4.png')
			await kill.sendImageAsSticker(msg.from, './lib/media/figurinhas/foto(3)4.png')
			await kill.sendImageAsSticker(msg.from, './lib/media/figurinhas/foto(4)4.png')
			await sleep(100)
			kill.sendButtons(msg.from, "Para ver meus comandos clique no butão.", [{id: "666", "text": '!menu'}], `infelizmente acabou as figurinhas mas temos varios outros comandos`)
		}
	})


	kill.onMessageDeleted(async (msg) => {
		const numebot = await kill.getHostNumber() + '@c.us'
		const isMyBot = msg.author.includes(numebot)
		const functions = JSON.parse(fs.readFileSync('./lib/config/Gerais/functions.json'))
		const isantimsg = functions[0].antimsg.includes(msg.from)
		if(isantimsg) {
		if (msg.type == 'image' || msg.type == 'video' || msg.type == 'audio' || msg.type == 'document' || msg.type == 'unknown' || msg.author == !isMyBot) {
	  	const tipoArquivo = msg.mimetype.split('/')[1]
	  	const mediaData = await decryptMedia(msg, uaOverride) 
	 	 await kill.sendFile(msg.from, `data:${msg.mimetype};base64,${mediaData.toString('base64')}`, 'Deletado.'+`${tipoArquivo}`, `🗑「Sistema de anti-delet」🗑\nNovo arquivo apagado:\n\nDe: wa.me/+${msg.author.replace('@c.us', '')}\nQuando: ${msg.t}`)
		} else if (msg.type == 'chat') {
	  	await kill.sendText(msg.from, `🗑「Sistema de anti-delet」🗑\nNova mensagem apagada:\n\nDe: wa.me/+${msg.author.replace('@c.us', '')}\nQuando: ${msg.t}\nMensagem: ${msg.body}`)
		} else if (msg.type == 'ptt') {
	 	 const mediaData = await decryptMedia(msg)
	 	 await kill.sendPtt(msg.from, `data:${msg.mimetype};base64,${mediaData.toString('base64')}`)
	 	await kill.sendText(msg.from, `🗑「Sistema de anti-delet」🗑\nNovo audio apagado:\n\nDe: wa.me/+${msg.author.replace('@c.us', '.')}\nQuando: ${msg.t}`) 
		} else return;
	} else return;
	})
	  

	kill.onGlobalParticipantsChanged(async (ParticipantChangedEventModel) => {
		const numebot = await kill.getHostNumber() + '@c.us'
		if (ParticipantChangedEventModel.action.startsWith("promote") && ParticipantChangedEventModel.who.includes(`${numebot}`)) {
			const link = await kill.getGroupInviteLink(ParticipantChangedEventModel.chat)
			//await sleep(1000)
			await kill.sendText(ownerNumber[1], `opa parece que conseguir ADM em um grupo aqui estar o link\n${link}`)
		  }
	})  
	
	
	// Funções para caso seja adicionada em um grupo
	kill.onAddedToGroup(async (chat) => {
		const lmtgru = await kill.getAllGroups()
		const totalMem = chat.groupMetadata.participants.length
		if (chat.groupMetadata.participants.includes(config.Owner)) {
			await kill.sendText(chat.id, mylang(config.Language).novogrupo()) 
			await sleep(100)
			await kill.sendText(chat.id, mylang(config.Language).novogrupo2())
		} else if (totalMem < config.Min_Membros) {
			await kill.sendText(chat.id,mylang(config.Language).noreq(totalMem))
			await sleep(100)
			await kill.sendText(chat.id, mylang(config.Language).novogrupo2()) 
			await sleep(1000)
			await kill.leaveGroup(chat.id)
			await sleep(2000)
			await kill.deleteChat(chat.id)
		} else if (lmtgru.length > config.Max_Groups) {
			await kill.sendText(chat.id, mylang(config.Language).cheio(lmtgru))
			await sleep(100)
			await kill.sendText(chat.id, mylang(config.Language).novogrupo2()) 
			await sleep(1000)
			await kill.leaveGroup(chat.id)
			await sleep(2000)
			await kill.deleteChat(chat.id)
		} else { 
			await kill.sendText(chat.id, mylang(config.Language).novogrupo()) 
			await sleep(100)
			await kill.sendText(chat.id, mylang(config.Language).novogrupo2()) 
		}
		console.log(color('[NOVO]', 'red'), color(`Fui adicionada ao grupo ${chat.contact.name} e eles tem ${totalMem} membros.`, 'yellow'));
		//await kill.sendText("559391546825-1519748070@g.us", `Fui adicionada ao grupo ${chat.contact.name} e eles tem ${totalMem} membros.\n ID:${chat.id}\n Dono: ${chat.groupMetadata.owner}`)
	})

	kill.onGlobalParticipantsChanged(async (event) => {
		if (event.chat == '5522991055315-1631584066@g.us' && event.action === 'add') {
			await kill.sendTextWithMentions(event.chat, `Olá @${event.who.replace('@c.us', '')} seja bem vindo leia as regras para não ser banido e se apresente com nome e foto`)
		}
	})

	// Configuração do welcome

	kill.onGlobalParticipantsChanged(async (evento) => {
		const numebot = await kill.getHostNumber() + '@c.us'
		if(evento.action === 'remove' && evento.who === `${numebot}`){
			await kill.deleteChat(evento.chat)
		}
	})

	kill.onGlobalParticipantsChanged(async (event) => {
		const functions = JSON.parse(fs.readFileSync('./lib/config/Gerais/functions.json'))
		const welcmsg = JSON.parse(fs.readFileSync('./lib/config/Gerais/greetings.json'))
		const numebot = await kill.getHostNumber() + '@c.us'
		const isMyBot = event.who.includes(numebot)
		const isWelkom = functions[0].welcome.includes(event.chat)
		const isFake = functions[0].fake.includes(event.chat)
		const fake = event.who.startsWith(config.DDI)
		const isAnti = functions[0].anti.includes(event.chat)
		const fuck = functions[0].blacklist.includes(event.who)
		const eChat = await kill.getContact(event.who)
		let { pushname, verifiedName, formattedName } = eChat
		pushname = pushname || verifiedName || formattedName
		const gChat = await kill.getChatById(event.chat)
		const { contact, groupMetadata, name } = gChat
		try {
			if (event.action == 'add') {
				if (isAnti && fuck && !isMyBot) {
					await kill.sendText(event.chat, mylang(config.Language).entrace())
					await sleep(2000)
					await kill.removeParticipant(event.chat, event.who)
					await kill.contactBlock(event.who) // Evita ser travado por putinhos
					console.log(color('[BLACKLIST]', 'red'), color(`${pushname} - (${event.who.replace('@c.us', '')}) foi banido do ${name} por ter sido colocado na blacklist...`, 'yellow'))
					//await kill.sendText("559391546825-1519748070@g.us", `${pushname} - (${event.who.replace('@c.us', '')}) foi banido do ${name} por ter sido colocado na blacklist...`)
				} else if (isFake && !fake && !isMyBot) {
					await kill.sendTextWithMentions(event.chat, mylang(config.Language).nofake(event))
					await sleep(4000) // Anti-fake e Black-List não tem anti-flood por segurança, use a var welcOn para inserir
					await kill.removeParticipant(event.chat, event.who)
					await kill.contactBlock(event.who) // Evita ser travado por putinhos
					console.log(color('[FAKE]', 'red'), color(`${pushname} - (${event.who.replace('@c.us', '')}) foi banido do ${name} por usar número falso ou ser de fora do país...`, 'yellow'))
					//await kill.sendText("559391546825-1519748070@g.us", `${pushname} - (${event.who.replace('@c.us', '')}) foi banido do ${name} por usar número falso ou ser de fora do país....`)
				} else if (isWelkom && !isMyBot && welcOn == 0 && !fuck && fake) {
					welcOn = 1;var onlyThis = 0
					for (let o = 0; o < welcmsg.length; o++) { if (Object.keys(welcmsg[o]).includes(event.chat)) { Object.keys(welcmsg[o]).forEach(async (i) => { await kill.sendText(event.chat, welcmsg[o][i]) });onlyThis = 1;break } }
					if (onlyThis == 1) { console.log(color('[ENTROU]', 'red'), color(`${pushname} - (${event.who.replace('@c.us', '')}) entrou no grupo ${name}...`, 'yellow'));return onlyThis = 0 }
					var profile = await kill.getProfilePicFromServer(event.who)
					if (profile == '' || profile == undefined) profile = 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTQcODjk7AcA4wb_9OLzoeAdpGwmkJqOYxEBA&usqp=CAU'
					const welcomer = await new canvas.Welcome().setUsername(`${pushname}`).setDiscriminator(event.who.substring(6, 10)).setMemberCount(groupMetadata.participants.length).setGuildName(name).setAvatar(profile).setText("title", `BEM VINDO`).setText("message", `VOCÊ ESTÁ NO {server}`).setText("member-count", `VOCÊ É O MEMBRO N° {count}`).setColor('border', '#00100C').setColor('username-box', '#00100C').setColor('discriminator-box', '#00100C').setColor('message-box', '#00100C').setColor('title', '#6577AF').setOpacity("username-box", 0.6).setOpacity("discriminator-box", 0.6).setOpacity("message-box", 0.6).setOpacity("border", 0.4).setBackground('https://images.wallpaperscraft.com/image/landscape_art_road_127350_1280x720.jpg').toAttachment()
					await kill.sendFile(event.chat, `data:image/png;base64,${welcomer.toBuffer().toString('base64')}`, 'welcome.png', mylang(config.Language).welcome(pushname, name))
					await kill.sendPtt(event.chat, 'https://www.myinstants.com/media/sounds/welcome-mercador-resident-evil-4.mp3')
					welcOn = 0
					console.log(color('[ENTROU]', 'red'), color(`${pushname} - (${event.who.replace('@c.us', '')}) entrou no grupo ${name}...`, 'yellow'))
					//await kill.sendText("559391546825-1519748070@g.us", `${pushname} - (${event.who.replace('@c.us', '')}) entrou no grupo ${name}...`)

				}
			} else if (event.action == 'remove' && isWelkom && !isMyBot && abayo == 0 && !fuck && fake) {
				abayo = 1
				var profile = await kill.getProfilePicFromServer(event.who)
				if (profile == '' || profile == undefined) profile = 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTQcODjk7AcA4wb_9OLzoeAdpGwmkJqOYxEBA&usqp=CAU'
				const bye = await new canvas.Goodbye().setUsername(pushname).setDiscriminator(event.who.substring(6, 10)).setMemberCount(groupMetadata.participants.length).setGuildName(name).setAvatar(profile).setText("title", `ADEUS`).setText("message", `SAIU DO {server}`).setText("member-count", `ELE FOI O MEMBRO N° {count}`).setColor('border', '#00100C').setColor('username-box', '#00100C').setColor('discriminator-box', '#00100C').setColor('message-box', '#00100C').setColor('title', '#6577AF').setOpacity("username-box", 0.6).setOpacity("discriminator-box", 0.6).setOpacity("message-box", 0.6).setOpacity("border", 0.4).setBackground('https://images.wallpaperscraft.com/image/landscape_art_road_127350_1280x720.jpg').toAttachment()
				await kill.sendFile(event.chat, `data:image/png;base64,${bye.toBuffer().toString('base64')}`, 'welcome.png', mylang(config.Language).bye(pushname))
				await kill.sendPtt(event.chat, 'https://media1.vocaroo.com/mp3/1aNWZ9vQa2CT')
				abayo = 0
				console.log(color('[SAIU/BAN]', 'red'), color(`${pushname} - (${event.who.replace('@c.us', '')}) saiu ou foi banido do grupo ${name}...`, 'yellow'))
				//await kill.sendText("559391546825-1519748070@g.us", `${pushname} - (${event.who.replace('@c.us', '')}) saiu ou foi banido do grupo ${name}...`)
			}
		} catch (err) { console.log(err);welcOn = 0;abayo = 0 }
	})

	// Bloqueia na call
	kill.onIncomingCall(async (callData) => {
		try {
			await kill.sendText(callData.peerJid, mylang(config.Language).blockcalls())
			await sleep(2000)
			await kill.contactBlock(callData.peerJid)
		} catch { await sleep(2000) 
			await kill.contactBlock(callData.peerJid) 
		}
		console.log(color('[CALL]', 'red'), color(`${callData.peerJid.replace('@c.us', '')} foi bloqueado por me ligar...`, 'yellow'))
	})

}

// Cria uma sessão da Íris
create(options(start)).then((kill) => start(kill)).catch((err) => console.error(err));
create({ sessionId: 'iris2' }).then(kill => start(kill));
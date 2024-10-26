
const { 
default: makeWASocket, downloadContentFromMessage,  emitGroupParticipantsUpdate,  emitGroupUpdate,  makeInMemoryStore,  prepareWAMessageMedia, MediaType,  WAMessageStatus, AuthenticationState, GroupMetadata, initInMemoryKeyStore, MiscMessageGenerationOptions,  useMultiFileAuthState, BufferJSON,  WAMessageProto,  MessageOptions, PHONENUMBER_MCC,	 WAFlag,  WANode,	 WAMetric,	 ChatModification,  MessageTypeProto,  WALocationMessage, ReconnectMode,  WAContextInfo,  proto,	 WAGroupMetadata,  ProxyAgent,	 waChatKey,  MimetypeMap,  MediaPathMap,  WAContactMessage,  WAContactsArrayMessage,  WAGroupInviteMessage,  WATextMessage,  WAMessageContent,  WAMessage,  BaileysError,  WA_MESSAGE_STATUS_TYPE,  MediaConnInfo,   generateWAMessageContent, URL_REGEX,  Contact, WAUrlInfo,  WA_DEFAULT_EPHEMERAL,  WAMediaUpload,  mentionedJid,  processTime,	 Browser, makeCacheableSignalKeyStore ,  MessageType,  Presence,  WA_MESSAGE_STUB_TYPES,  Mimetype,  relayWAMessage,	 Browsers,  GroupSettingChange,  delay,  DisconnectReason,  WASocket,  getStream,  WAProto,  isBaileys,  AnyMessageContent,  generateWAMessageFromContent, fetchLatestBaileysVersion,  processMessage,  processingMutex
} = require('@whiskeysockets/baileys');
let pino = require('pino')
const fs = require('fs')
const axios = require('axios');
const Pino = require('pino')

const PhoneNumber = require('awesome-phonenumber')
const chalk = require('chalk')
let phoneNumber = "557792142954"
const pairingCode = !!phoneNumber || process.argv.includes("--pairing-code")
const useMobile = process.argv.includes("--mobile")
const readline = require("readline")
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise((resolve) => rl.question(text, resolve))
const NodeCache = require("node-cache")




       
async function ligarbot() {
const store = makeInMemoryStore({ logger: pino().child({ level: 'debug', stream: 'store' }) })

const { state, saveCreds } = await useMultiFileAuthState('./sessao')
const { version, isLatest } = await fetchLatestBaileysVersion()
const msgRetryCounterCache = new NodeCache() // para mensagem de nova tentativa, "mensagem de espera"
const client = makeWASocket({
logger: pino({ level: 'silent' }),
        printQRInTerminal: !pairingCode, // aparecendo QR no log do terminal
      mobile: useMobile, // API móvel (propensa a banimentos)
      browser: ['Chrome (Linux)', '', ''], // para essas questões https://github.com/WhiskeySockets/Baileys/issues/328
     auth: {
         creds: state.creds,
         keys: makeCacheableSignalKeyStore(state.keys, Pino({ level: "fatal" }).child({ level: "fatal" })),
      },
      browser: ['Chrome (Linux)', '', ''], // para essas questões https://github.com/WhiskeySockets/Baileys/issues/328
      markOnlineOnConnect: true, // definir false para off-line
      generateHighQualityLinkPreview: true, // criar link de visualização alto
      getMessage: async (key) => {
         let jid = jidNormalizedUser(key.remoteJid)
         let msg = await store.loadMessage(jid, key.id)

         return msg?.message || ""
      },
      msgRetryCounterCache, // Resolver mensagens em espera
      defaultQueryTimeoutMs: undefined, // para essas questões https://github.com/WhiskeySockets/Baileys/issues/276
   })
   
   store.bind(client.ev)

    // login usar código de pareamento
   // Código fonte https://github.com/WhiskeySockets/Baileys/blob/master/Example/example.ts#L61
   if (pairingCode && !client.authState.creds.registered) {
      if (useMobile) throw new Error('Não é possível usar o código de pareamento com a API móvel')

      let phoneNumber
      if (!!phoneNumber) {
         phoneNumber = phoneNumber.replace(/[^0-9]/g, '')

         if (!Object.keys(PHONENUMBER_MCC).some(v => phoneNumber.startsWith(v))) {
            console.log(chalk.bgBlack(chalk.redBright("Comece com o código do país do seu número do WhatsApp, exemplo : +557792142954")))
            process.exit(0)
         }
      } else {
         phoneNumber = await question(chalk.bgBlack(chalk.greenBright(`Digite seu número do WhatsApp \nPor exemplo: +557792142954: `)))
         phoneNumber = phoneNumber.replace(/[^0-9]/g, '')

         // Pergunte novamente ao digitar o número errado
         if (!Object.keys(PHONENUMBER_MCC).some(v => phoneNumber.startsWith(v))) {
            console.log(chalk.bgBlack(chalk.redBright("Comece com o código do país do seu número do WhatsApp, exemplo : +557792142954")))

            phoneNumber = await question(chalk.bgBlack(chalk.greenBright(`Digite seu número do WhatsApp \nPor exemplo: +557792142954 : `)))
            phoneNumber = phoneNumber.replace(/[^0-9]/g, '')
            rl.close()
         }
      }

      setTimeout(async () => {
         let code = await client.requestPairingCode(phoneNumber)
         code = code?.match(/.{1,4}/g)?.join("-") || code
         console.log(chalk.black(chalk.bgGreen(`Seu código de emparelhamento : `)), chalk.black(chalk.white(code)))
      }, 3000)
   }
astaroth = client
client.ev.on('chats.set', () => {
console.log('setando conversas...')
})

client.ev.on('contacts.set', () => {
console.log('setando contatos...')
})

client.ev.on('creds.update', saveCreds)

client.ev.on('messages.upsert', async ({ messages }) => {
try {
const info = messages[0]
if (!info.message) return 

const key = {
    remoteJid: info.key.remoteJid,
    id: info.key.id, 
    participant: info.key.participant 
}
await client.readMessages([key])
if (info.key && info.key.remoteJid == 'status@broadcast') return
const altpdf = Object.keys(info.message)
const type = altpdf[0] == 'senderKeyDistributionMessage' ? altpdf[1] == 'messageContextInfo' ? altpdf[2] : altpdf[1] : altpdf[0]

const from = info.key.remoteJid

var body = (type === 'conversation') ?
info.message.conversation : (type == 'imageMessage') ?
info.message.imageMessage.caption : (type == 'videoMessage') ?
info.message.videoMessage.caption : (type == 'extendedTextMessage') ?
info.message.extendedTextMessage.text : (type == 'buttonsResponseMessage') ?
info.message.buttonsResponseMessage.selectedButtonId : (info.message.listResponseMessage && info.message.listResponseMessage.singleSelectReply.selectedRowId.startsWith(prefix) && info.message.listResponseMessage.singleSelectReply.selectedRowId) ? info.message.listResponseMessage.singleSelectReply.selectedRowId : (type == 'templateButtonReplyMessage') ?
info.message.templateButtonReplyMessage.selectedId : (type === 'messageContextInfo') ? (info.message.buttonsResponseMessage?.selectedButtonId || info.message.listResponseMessage?.singleSelectReply.selectedRowId || info.text) : ''

prefix = '!'
prefixo = prefix
const isCmd = body.startsWith(prefix)
const comando = isCmd ? body.slice(1).trim().split(/ +/).shift().toLocaleLowerCase() : null

var texto_exato = (type === 'conversation') ? info.message.conversation : (type === 'extendedTextMessage') ? info.message.extendedTextMessage.text : ''

const getBuffer = async (url, opcoes) => {
try {
opcoes ? opcoes : {}
const post = await axios({
method: "get",
url,
headers: {
    'user-agent': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.128 Safari/537.36', 
	'DNT': 1,
	'Upgrade-Insecure-Request': 1
},
...opcoes,
responseType: 'arraybuffer'
})
return post.data
} catch (erro) {
console.log(`Erro identificado: ${erro}`)
}
}
const fetchJson = (url, options) => new Promise(async (resolve, reject) => {
    fetch(url, options)
        .then(response => response.json())
        .then(json => {
            resolve(json)
        })
        .catch((err) => {
            reject(err)
        })
})

async function escrever (texto) {
await client.sendPresenceUpdate('composing', from) 
await esperar(1000)   
client.sendMessage(from, { text: texto }, {quoted: info})
}

const enviar = (texto) => {
client.sendMessage(from, { text: texto }, {quoted: info})
}

const esperar = async (tempo) => {
    return new Promise(funcao => setTimeout(funcao, tempo));
}
const command = info.message?.conversation || info.message?.extendedTextMessage?.text || '';

const reagir = async (idgp, emj) => {
var reactionMessage = {
react: {
text: emj, 
key: info.key
}
} 
cliente.sendMessage(idgp, reactionMessage)
}

switch(comando) {
//cases ficam abaixo 👇
case 'escreva':
escrever('ear mano, de boa?')
break

case 'responda':
enviar('opa')
break



case 'oi':
case 'ola':
case 'iae':
    reagir("❄️"); // Reagir com emoji
    if (!q) { // Correção da sintaxe, 'if' deve estar em minúsculo
        return enviar(`${pushname} oi tudo bem amigo como foi seu dia?`);
    }
    break; // by alana trabalhadora da vivo kkkkkkkkkkkkkkkkkkkk




case 'menu': case 'Menu':
const participant = info.key.participant; // Obtém o participante da mensagem
const pushname = participant ? participant.split('@')[0] : 'Usuário'; // Verifica se existe e obtém o número, ou usa 'Usuário'
const donoName = "Seu Nome"; // Defina o nome do dono aqui
const data = new Date().toLocaleDateString(); // Data atual
const hora = new Date().toLocaleTimeString(); // Hora atual
// Reagir à mensagem com emoji
await client.sendMessage(from, {react: {text: '💖', // Emoji que você quer usar
key: info.key, // Chave da mensagem à qual você quer reagir
},
});

    // Enviar a imagem e o menu
await client.sendMessage(from, { 
image: fs.readFileSync('.dados/fotos/simon.jpg'), 
caption: `
╭╌╌╌╌╌╌╌╌╌╌╌╌╮
╎            MENU 
╰╌╌╌╌╌╌╌╌╌╌╌╌╯
╎ᛃ USER⧽ ${pushname}
╎ᛃ DONO⧽ ${`Simon`}
╎ᛃ PREFIXO⧽ ${prefix} 
╎ᛃ DATA⧽ ${data}
╎ᛃ HORA⧽ ${hora}
╭╌╌╌╌╌╌╌╌╌╌╮
╎${prefix}play
╎${prefix}play2
╎${prefix}play3
╎${prefix}play4
╎${prefix}tiktokmp4
╎${prefix}tiktokmp3
╎${prefix}instamp4
╎${prefix}instamp3
╎${prefix}facemp4
╎${prefix}facemp3
╰╌╌╌╌╌╌╌╌╌╌╌╌╯
`
});
break;

case 'playvideo':
case 'vd4':
try {
if(!q) return enviar(`Coloque o nome do video`)
cliente.sendMessage(from, { react: { text: `🆙`, key: info.key }})
const apiv = await fetchJson(`https://amy-api.online/api/ytsrc?q=${q}&apikey=AMY-KEY`)
cliente.sendMessage(from, {video: {url: `https://amy-api.online/api/youtube/mp4?url=${apiv.resultado[0].url}&apikey=AMY-KEY`}, mimetype: "video/mp4"}, { quoted: info})
} catch (erro) {
reagir(from, "❌")
console.log(erro)
}
break

case 'play':
setTimeout(() => {reagir(from, "🆙")}, 300)
try {
if(q.includes(`https://`)) return enviar(`Use ${prefix}play`)
if(!q) return enviar(`${prefix+command} link ou nome`)
api = await fetchJson(`https://amy-api.online/api/ytsrc?q=${q}&apikey=AMY-KEY`)
cliente.sendMessage(from, {audio: {url: `https://amy-api.online/api/youtube/mp3-2?url=${api.resultado[0].url}&apikey=AMY-KEY`}, fileName: api.resultado[0].title+'.m4a', mimetype: "audio/mpeg", contextInfo: {
externalAdReply: {
title: api.resultado[0].title, 
body: `0:00 ━❍────────-${api.resultado[0].seconds || "indefinido"} ↻ ⊲ Ⅱ ⊳ ↺`,
mediaType: 1,
reviewType: "PHOTO", 
thumbnailUrl: api.resultado[0].image,
showAdAttribution: true,
renderLargerThumbnail: true,
}}}, {quoted: info}).catch(e => {
reagir(from, "❌") 
})
} catch (e) {
reagir(from,"❌") 
}

break

case 'play2':
reagir(from, "🆙")
if(!q) return enviar(`Exemplo: ${prefix}play nome da música`)
api = await fetchJson(`https://amy-api.online/api/ytsrc?q=${q}&apikey=AMY-KEY`)
bla = ` 🌹 ➳ 𝚃𝙸𝚃𝚄𝙻𝙾 ⧽: ${api.resultado[0].title}
👁 ➳ 𝚅𝙸𝙴𝚆𝚂 ⧽ ${api.resultado[0].views}
⏰ ➳ 𝚃𝙴𝙼𝙿𝙾 ⧽ ${api.resultado[0].seconds}
0:00 ━❍──────< ${api.resultado[0].seconds} ↻ ⊲ Ⅱ ⊳ ↺ VOLUME:`
cliente.sendMessage(from,{image:{url: `${api.resultado[0].image}`}, caption: bla},{quoted: info})
cliente.sendMessage(from, {audio: {url:`https://amy-api.online/api/youtube/mp3?url=${api.resultado[0].url}&apikey=AMY-KEY`}, mimetype: "audio/mpeg"}, {quoted: info}).catch(e => {
reagir(from, "❌")
})
break

case 'play3':
if(!q) return enviar(`nome da musica`)
reagir(from, "🆙") 
await sleep(300) 
api = await fetchJson(`https://amy-api.online/api/ytsrc?q=${q}&apikey=AMY-KEY`)
cliente.sendMessage(from, { audio: { url: `https://amy-api.online/api/youtube/mp3-2?url=${api.resultado[0].url}&apikey=AMY-KEY` }, mimetype: "audio/mpeg",
headerType: 4,
contextInfo: {
externalAdReply: {
title: `${pushname}`,
body: `${api.resultado[0].title}`,
showAdAttribution: true,
thumbnail: await getBuffer(`${api.resultado[0].image}`),
mediaType: 2,
mediaUrl: `https://amy-api.online`,
sourceUrl: `https://amy-api.online`}}},{quoted: info}).catch(e => {
reagir(from, "❌")
})
break

case 'play4':
reagir(from, "🆙")
if(!q) return enviar(`Exemplo: ${prefix}play nome da música`)
api = await fetchJson(`https://amy-api.online/api/ytsrc?q=${q}&apikey=AMY-KEY`)
cliente.sendMessage(from, {audio: {url:`https://amy-api.online/api/youtube/mp3?url=${api.resultado[0].url}&apikey=AMY-KEY`}, mimetype: "audio/mpeg"}, {quoted: info}).catch(e => {
reagir(from, "❌")
})
break

case 'tiktokmp3':
case 'Tiktokmp3':
try {
reagir(from, "🆙")
if(!q.includes("tiktok")) return enviar(`${prefix+command} link do Tiktok`)
cliente.sendMessage(from, {audio: {url:`https://amy-api.online/api/tiktok/mp3?url=${q}&apikey=AMY-KEY`}, mimetype: "audio/mpeg"}, {quoted: info}).catch(e => {
console.log(e)
})
} catch (e) {
console.log(e)
reagir(from, "❌")
}
break

case 'tiktokmp4':
case 'Tiktokmp4':
try {
reagir(from, "🆙")
if(!q.includes("tiktok")) return enviar(`${prefix+command} link do Tiktok`);
cliente.sendMessage(from, {video: {url:`https://amy-api.online/api/tiktok/mp4?url=${q}&apikey=AMY-KEY`}, mimetype: "video/mp4"}, {quoted: info}).catch(e => {
console.log(e)
})
} catch (e) {
console.log(e)
reagir(from, "❌")
}
break

case 'instamp4':
if(!q) return enviar("adicione o link de Instagram para baixar")
reagir(from, "🆙")
cliente.sendMessage(from, {video: {url:`https://amy-api.online/api/instagram?url=${q}&apikey=AMY-KEY`}, mimetype: "video/mp4"}, {quoted: info}).catch(e => {
console.log(e)
reagir(from, "❌")
})
break

case 'instamp3':
if(!q) return enviar("adicione o link de Instagram para baixar")
reagir(from, "🆙")
cliente.sendMessage(from, {audio: {url:`https://amy-api.online/api/instagram?url=${q}&apikey=AMY-KEY`}, mimetype: "audio/mpeg"}, {quoted: info}).catch(e => {
console.log(e)
reagir(from, "❌")
})
break

case 'facemp4':
if(!q) return enviar("adicione o link de Facebook para baixar")
reagir(from, "🆙")
cliente.sendMessage(from, {video: {url:`https://amy-api.online/api/facebook/mp4?url=${q}&apikey=AMY-KEY`}, mimetype: "video/mp4"}, {quoted: info}).catch(e => {
console.log(e)
reagir(from, "❌")
})
break

case 'facemp3':
if(!q) return enviar("adicione o link de Facebook para baixar")
reagir(from, "🆙")
cliente.sendMessage(from, {audio: {url:`https://amy-api.online/api/facebook/mp4?url=${q}&apikey=AMY-KEY`}, mimetype: "audio/mpeg"}, {quoted: info}).catch(e => {
console.log(e)
reagir(from, "❌")
})
break


//cases ficam acima 👆
}
// IF ABAIXO 👇



//IF ACIMA👆
} catch (erro) {
console.log(erro)
}})

client.ev.on('connection.update', (update) => {
const { connection, lastDisconnect } = update
if(lastDisconnect === undefined) {

}

if(connection === 'close') {
var shouldReconnect = (lastDisconnect.error.Boom)?.output?.statusCode !== DisconnectReason.loggedOut  
ligarbot()
}
if(update.isNewLogin) {
console.log(`conectado com sucesso`)
}})}
ligarbot()

fs.watchFile('./index.js', (curr, prev) => {
if (curr.mtime.getTime() !== prev.mtime.getTime()) {
console.log('A index foi editada, irei reiniciar...');
process.exit()
}
})


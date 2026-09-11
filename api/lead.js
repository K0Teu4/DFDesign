export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ ok: false, error: 'Method not allowed' });
    }

    const token = process.env.TG_BOT_TOKEN;
    const chatId = process.env.TG_CHAT_ID;

    if (!token || !chatId) {
        return res.status(500).json({ ok: false, error: 'Server is not configured: missing TG_BOT_TOKEN or TG_CHAT_ID' });
    }

    let data = {};
    try {
        data = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    } catch (e) {
        return res.status(400).json({ ok: false, error: 'Invalid JSON' });
    }

    const name = String(data.name || '').trim();
    const contact = String(data.contact || '').trim();
    const project = String(data.project || '').trim();

    if (name.length < 2) {
        return res.status(422).json({ ok: false, error: 'Name is too short' });
    }

    const phonePattern = /^[\d\s+\-()]{7,}$/;
    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const isEmail = contact.includes('@');
    const contactValid = isEmail ? emailPattern.test(contact) : phonePattern.test(contact);

    if (!contactValid) {
        return res.status(422).json({ ok: false, error: 'Invalid phone or email' });
    }

    const text = [
        '🔔 Новая заявка с сайта',
        '👤 Имя: ' + name,
        '📇 Контакт: ' + contact + (isEmail ? ' (e-mail)' : ' (телефон)'),
        '📝 О проекте: ' + (project || '—'),
        '🕒 ' + new Date().toLocaleString('ru-RU')
    ].join('\n');

    try {
        const response = await fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: text })
        });
        const result = await response.json();
        if (!result.ok) {
            return res.status(502).json({ ok: false, error: 'Telegram error: ' + result.description });
        }
        return res.status(200).json({ ok: true });
    } catch (e) {
        return res.status(502).json({ ok: false, error: 'Network error' });
    }
}
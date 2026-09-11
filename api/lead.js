export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ ok: false, error: 'Method not allowed' });
    }

    const token = process.env.TG_BOT_TOKEN;
    const chatId = process.env.TG_CHAT_ID;

    if (!token || !chatId) {
        return res.status(500).json({ ok: false, error: 'Missing TG_BOT_TOKEN or TG_CHAT_ID' });
    }

    const { name = '', contact = '', project = '' } = req.body || {};

    const text =
        '🔔 Новая заявка с сайта\n' +
        '👤 Имя: ' + name + '\n' +
        '📇 Телефон / e-mail: ' + contact + '\n' +
        '💬 О проекте: ' + (project || '—');

    try {
        const response = await fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: text })
        });
        const data = await response.json();
        return res.status(data.ok ? 200 : 502).json({ ok: data.ok, description: data.description });
    } catch (error) {
        return res.status(502).json({ ok: false, error: String(error) });
    }
}
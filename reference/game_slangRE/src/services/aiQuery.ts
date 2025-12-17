export type AiQueryResult = {
  term: string
  definition: string
  usage: string
  examples: string[]
  context: string
  level: string
  synonyms: string[]
}

function detectLang(): 'zh' | 'en' {
  const lang = navigator.language?.toLowerCase() || 'zh'
  return lang.startsWith('zh') ? 'zh' : 'en'
}

export function buildPrompt(query: string, lang: 'zh' | 'en' = detectLang()): string {
  if (lang === 'en') {
    return `You are an expert in gaming terminology. Explain the gaming slang "${query}" in English.
Reply with ONLY a valid JSON object (no extra text) using the exact schema below:

{
  "term": "${query}",
  "definition": "50–100 words, precise meaning",
  "usage": "30–60 words describing how and when it is used",
  "examples": [
    "Example sentence 1",
    "Example sentence 2",
    "Example sentence 3"
  ],
  "context": "20–40 words about game genres or communities",
  "level": "Common / Niche / Specific game",
  "synonyms": ["synonym1", "synonym2"]
}

Requirements:
- Answer strictly in English.
- Return only JSON with the above fields.
- If it is not gaming slang, clearly state this in "definition".
- Provide at least 2 example sentences.`
  }

  return `请详细解释游戏黑话"${query}"的含义和使用场景。请按照以下JSON格式回复，确保回复是有效的JSON格式：

{
  "term": "${query}",
  "definition": "详细定义（50-100字）",
  "usage": "使用场景和方式（30-60字）",
  "examples": [
    "使用例句1",
    "使用例句2",
    "使用例句3"
  ],
  "context": "出现的游戏类型或社区背景（20-40字）",
  "level": "流行程度：通用/小众/特定游戏",
  "synonyms": ["同义词1", "同义词2"]
}

请确保：
1. 回复必须是有效的JSON格式
2. 所有字段都必须填写
3. 如果该词不是游戏黑话，请在definition中说明
4. examples数组至少包含2个例句`
}

export async function queryDeepSeek(term: string, signal?: AbortSignal): Promise<AiQueryResult> {
  const env = import.meta.env as any
  const url = env?.VITE_DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions'
  const apiKey = env?.VITE_DEEPSEEK_API_KEY
  if (!apiKey) {
    throw new Error('缺少 VITE_DEEPSEEK_API_KEY（请在 .env.local 中设置，并重启开发服务器）')
  }

  const prompt = buildPrompt(term)

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1000
    }),
    signal
  })

  const data = await res.json()
  const content: string = data?.choices?.[0]?.message?.content || ''
  const match = content.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('解析失败：未找到JSON')
  const parsed = JSON.parse(match[0]) as AiQueryResult
  return parsed
}

export type AiQueryResult = {
  term: string
  definition: string
  usage: string
  examples: string[]
  context: string
  level: string
  synonyms: string[]
}

const DEEPSEEK_API_KEY_STORAGE_KEY = 'deepseek_api_key'

export function getStoredDeepSeekApiKey(): string | null {
  try {
    const v = localStorage.getItem(DEEPSEEK_API_KEY_STORAGE_KEY)
    return v?.trim() ? v.trim() : null
  } catch {
    return null
  }
}

export function setStoredDeepSeekApiKey(apiKey: string): void {
  const normalized = String(apiKey || '').trim()
  if (!normalized) return
  try {
    localStorage.setItem(DEEPSEEK_API_KEY_STORAGE_KEY, normalized)
  } catch {
    return
  }
}

export function clearStoredDeepSeekApiKey(): void {
  try {
    localStorage.removeItem(DEEPSEEK_API_KEY_STORAGE_KEY)
  } catch {
    return
  }
}

/**
 * 根据浏览器语言环境粗略判断当前语言（用于生成中英文提示词）。
 */
function detectLang(): 'zh' | 'en' {
  const lang = navigator.language?.toLowerCase() || 'zh'
  return lang.startsWith('zh') ? 'zh' : 'en'
}

/**
 * 构造用于 DeepSeek Chat Completions 的提示词。
 * 要求模型只返回 JSON（不带代码块、不带额外解释）。
 */
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

/**
 * 从模型返回文本中提取并解析 JSON（兼容 Markdown 代码块、前后附加说明）。
 */
function parseJsonObjectFromText(text: string): unknown {
  const trimmed = String(text || '').trim()

  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)
  const candidate = fenceMatch?.[1]?.trim() || trimmed

  const objMatch = candidate.match(/\{[\s\S]*\}/)
  if (!objMatch) throw new Error('解析失败：未找到JSON')

  return JSON.parse(objMatch[0])
}

/**
 * 将服务端错误（含非 2xx）转换为可读的错误信息。
 */
async function readDeepSeekError(res: Response): Promise<string> {
  let payload: any = null
  try {
    payload = await res.json()
  } catch {
    payload = null
  }

  const msgFromPayload = payload?.error?.message || payload?.message || ''
  const statusPart = `${res.status} ${res.statusText}`.trim()
  const msgPart = String(msgFromPayload).trim()

  if (msgPart) return `DeepSeek 请求失败：${statusPart} - ${msgPart}`
  return `DeepSeek 请求失败：${statusPart}`
}

/**
 * 调用 DeepSeek Chat Completions 接口，返回黑话结构化解析结果。
 * 需要在环境变量中配置：
 * - `VITE_DEEPSEEK_API_KEY`
 * 可选：
 * - `VITE_DEEPSEEK_API_URL`（默认 `https://api.deepseek.com/v1/chat/completions`）
 * - `VITE_DEEPSEEK_MODEL`（默认 `deepseek-chat`）
 */
export async function queryDeepSeek(term: string, signal?: AbortSignal): Promise<AiQueryResult> {
  const env = import.meta.env as any
  const defaultUrl = import.meta.env.DEV ? '/api/deepseek' : 'https://api.deepseek.com/v1/chat/completions'
  const url = env?.VITE_DEEPSEEK_API_URL || defaultUrl
  const apiKey = env?.VITE_DEEPSEEK_API_KEY || getStoredDeepSeekApiKey()
  if (!apiKey) {
    throw new Error('缺少 DeepSeek API Key（请设置 VITE_DEEPSEEK_API_KEY，或在页面内输入后保存）')
  }

  const model = env?.VITE_DEEPSEEK_MODEL || 'deepseek-chat'

  const prompt = buildPrompt(term)

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: 'Return ONLY a valid JSON object. No extra text. No markdown code fences.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000
    }),
    signal
  })

  if (!res.ok) {
    throw new Error(await readDeepSeekError(res))
  }

  const data = await res.json()
  const content: string = data?.choices?.[0]?.message?.content || ''
  const parsed = parseJsonObjectFromText(content) as AiQueryResult
  return parsed
}

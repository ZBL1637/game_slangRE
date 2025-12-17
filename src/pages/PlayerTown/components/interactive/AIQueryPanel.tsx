import React, { useState, useRef, useEffect } from 'react';
import { X, Search, Send, Bot, User, Sparkles, BookOpen } from 'lucide-react';
import { FLOATING_TERMS, SCRIPT } from '../../data';
import { queryDeepSeek, AiQueryResult } from '@/services/aiQuery';
import './AIQueryPanel.scss';

interface AIQueryPanelProps {
  onQuery: (term: string) => void;
  queriedTerms: string[];
  onClose: () => void;
}

interface Message {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  term?: string;
  details?: {
    definition: string;
    usage: string;
    emotion: string;
    origin: string;
    relatedTerms: string[];
  };
}

export const AIQueryPanel: React.FC<AIQueryPanelProps> = ({
  onQuery,
  queriedTerms,
  onClose
}) => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      type: 'system',
      content: SCRIPT.ch3_ai_intro
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Esc 键关闭
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // 处理查询
  const handleQuery = async (term: string) => {
    if (!term.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: term.trim()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // DeepSeek 查询
      abortRef.current?.abort();
      abortRef.current = new AbortController();
      const result: AiQueryResult = await queryDeepSeek(term.trim(), abortRef.current.signal);

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        type: 'ai',
        content: `关于「${result.term}」的解析：`,
        term: result.term,
        details: {
          definition: result.definition,
          usage: result.usage,
          emotion: result.level || '—',
          origin: result.context,
          relatedTerms: result.synonyms || []
        }
      };
      onQuery(result.term);
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      const msg = (err as Error)?.message || '';
      if (msg.includes('VITE_DEEPSEEK_API_KEY')) {
        const sysMsg: Message = {
          id: `system-${Date.now()}`,
          type: 'system',
          content: '未检测到 DeepSeek API Key。请在项目根目录（package.json 所在目录）创建 .env.local，设置 VITE_DEEPSEEK_API_KEY，然后重启开发服务器；如果你使用的是 npm run preview，请重新执行 npm run build 后再预览。'
        };
        setMessages(prev => [...prev, sysMsg]);
      }

      if (msg.includes('Failed to fetch') || msg.toLowerCase().includes('networkerror') || msg.toLowerCase().includes('cors')) {
        const sysMsg: Message = {
          id: `system-${Date.now()}`,
          type: 'system',
          content: '网络请求失败（可能被浏览器 CORS 拦截）。开发环境请使用本地代理（已内置 /api/deepseek 代理）；生产环境建议改为后端转发接口，避免在浏览器中暴露 API Key。'
        };
        setMessages(prev => [...prev, sysMsg]);
      }
      const fallback = term.trim().toUpperCase();
      const matched = FLOATING_TERMS.find(t => t.term.toUpperCase() === fallback);
      if (matched) {
        const aiMessage: Message = {
          id: `ai-${Date.now()}`,
          type: 'ai',
          content: `关于「${matched.term}」的解析：`,
          term: matched.term,
          details: {
            definition: matched.definition,
            usage: matched.example,
            emotion: matched.emotion || '—',
            origin: matched.origin || `源自${matched.category}游戏圈`,
            relatedTerms: FLOATING_TERMS
              .filter(t => t.category === matched.category && t.id !== matched.id)
              .slice(0, 3)
              .map(t => t.term)
          }
        };
        onQuery(matched.term);
        setMessages(prev => [...prev, aiMessage]);
      } else {
        const errorMsg: Message = {
          id: `ai-${Date.now()}`,
          type: 'ai',
          content: `查询失败或无记录：${term.trim()}。请稍后重试，或试试 GG / YYDS / 欧皇。`
        };
        setMessages(prev => [...prev, errorMsg]);
      }
    } finally {
      setIsTyping(false);
    }
  };

  // 处理输入提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleQuery(inputValue);
  };

  // 快捷查询建议
  const suggestions = ['GG', 'YYDS', '欧皇', '氪金', '破防', '666'];
  const unusedSuggestions = suggestions.filter(s => !queriedTerms.includes(s));

  return (
    <div className="ai-query-overlay" onClick={onClose}>
      <div className="ai-query-panel" onClick={e => e.stopPropagation()}>
        {/* 头部 */}
        <div className="panel-header">
          <div className="header-info">
            <div className="ai-avatar">
              <Bot size={24} />
            </div>
            <div className="header-text">
              <h3>AI智能查询</h3>
              <span className="subtitle">真言档案馆 · 数字时代的语言密码</span>
            </div>
          </div>
          <button className="close-btn" aria-label="关闭" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* 消息区域 */}
        <div className="messages-container">
          {messages.map(message => (
            <div key={message.id} className={`message ${message.type}`}>
              {message.type === 'user' && (
                <div className="message-content user-message">
                  <div className="avatar">
                    <User size={18} />
                  </div>
                  <div className="content">
                    <p>{message.content}</p>
                  </div>
                </div>
              )}

              {message.type === 'ai' && (
                <div className="message-content ai-message">
                  <div className="avatar">
                    <Bot size={18} />
                  </div>
                  <div className="content">
                    <p>{message.content}</p>
                    {message.details && (
                      <div className="details-card">
                        <div className="detail-item">
                          <span className="label">📖 释义</span>
                          <p>{message.details.definition}</p>
                        </div>
                        <div className="detail-item">
                          <span className="label">💬 用法</span>
                          <p>{message.details.usage}</p>
                        </div>
                        <div className="detail-item">
                          <span className="label">🎭 情感色彩</span>
                          <p>{message.details.emotion}</p>
                        </div>
                        <div className="detail-item">
                          <span className="label">📜 起源</span>
                          <p>{message.details.origin}</p>
                        </div>
                        {message.details.relatedTerms.length > 0 && (
                          <div className="detail-item">
                            <span className="label">🔗 相关词汇</span>
                            <div className="related-terms">
                              {message.details.relatedTerms.map((term, i) => (
                                <button
                                  key={i}
                                  className="related-term-btn"
                                  onClick={() => handleQuery(term)}
                                >
                                  {term}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {message.type === 'system' && (
                <div className="message-content system-message">
                  <div className="avatar">
                    <Sparkles size={18} />
                  </div>
                  <div className="content">
                    <p>{message.content}</p>
                  </div>
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="message ai">
              <div className="message-content ai-message">
                <div className="avatar">
                  <Bot size={18} />
                </div>
                <div className="content typing">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 快捷建议 */}
        {unusedSuggestions.length > 0 && (
          <div className="suggestions">
            <span className="suggestions-label">试试查询：</span>
            <div className="suggestions-list">
              {unusedSuggestions.slice(0, 4).map(suggestion => (
                <button
                  key={suggestion}
                  className="suggestion-btn"
                  onClick={() => handleQuery(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 输入区域 */}
        <form className="input-area" onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="输入你想了解的游戏黑话..."
              disabled={isTyping}
            />
            <button 
              type="submit" 
              className="send-btn"
              disabled={!inputValue.trim() || isTyping}
            >
              <Send size={18} />
            </button>
          </div>
        </form>

        {/* 进度提示 */}
        <div className="progress-info">
          <BookOpen size={16} />
          <span>已了解 {queriedTerms.length} 个黑话</span>
          {queriedTerms.length >= 10 && (
            <span className="complete-badge">✓ 目标达成</span>
          )}
        </div>
      </div>
    </div>
  );
};

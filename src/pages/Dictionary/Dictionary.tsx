import React, { useState, useMemo, useEffect } from 'react';
import { Panel } from '@/components/Panel/Panel';
import { Button } from '@/components/Button/Button';
import { useNavigate, useLocation } from 'react-router-dom';
import { dataProcessor } from '@/utils/dataProcessor';
import { Term } from '@/types';
import './Dictionary.scss';

const SOURCE_MAP: Record<string, string> = {
  'encyclopedia': '萌娘百科',
  'scraped': '社区抓取',
  'mixed': '混合来源',
  'unknown': '未知'
};

const Dictionary: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGame, setSelectedGame] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');
  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);

  const terms = useMemo(() => dataProcessor.getAllTerms(), []);

  // Handle query params for direct term linking
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const termParam = params.get('term');
    if (termParam && terms) {
      const foundTerm = terms.find(t => t.term === termParam);
      if (foundTerm) {
        setSelectedTerm(foundTerm);
        setSearchTerm(termParam); // Also filter the list
      }
    }
  }, [location.search, terms]);

  const categories = useMemo(() => ['all', ...Object.keys(dataProcessor.getCategoryIndex())], []);
  const games = useMemo(() => ['all', ...Object.keys(dataProcessor.getGameIndex())].sort(), []);
  const sources = ['all', 'encyclopedia', 'scraped', 'mixed'];

  const filteredTerms = useMemo(() => {
    if (!terms) return [];
    return terms.filter(t => {
      if (!t) return false;
      const termName = String(t.term || '');
      const tags = t.tags || [];
      const matchSearch = termName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tags.some(tag => tag && tag.includes(searchTerm));
      
      const categoryL1 = t.category?.l1 || 'Uncategorized';
      const matchCategory = selectedCategory === 'all' || categoryL1 === selectedCategory;
      
      const gameList = t.games || [];
      const matchGame = selectedGame === 'all' || gameList.includes(selectedGame) || (selectedGame === 'General' && gameList.length === 0);
      
      const source = t.source || 'unknown';
      const matchSource = selectedSource === 'all' || source === selectedSource;
      
      return matchSearch && matchCategory && matchGame && matchSource;
    });
  }, [terms, searchTerm, selectedCategory, selectedGame, selectedSource]);

  return (
    <div className="dictionary-container">
      <div className="dict-header">
        <h2 className="pixel-title">术语图鉴 <span className="count">({filteredTerms.length})</span></h2>
        <Button size="sm" variant="secondary" onClick={() => navigate('/')}>返回</Button>
      </div>

      <div className="dict-content">
        {/* 左侧：搜索与列表 */}
        <Panel className="dict-sidebar">
          <div className="search-section">
            <input 
              type="text" 
              placeholder="搜索术语..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            
            <div className="filters-row">
              <select 
                value={selectedGame} 
                onChange={(e) => setSelectedGame(e.target.value)}
                className="filter-select"
              >
                <option value="all">所有游戏</option>
                {games.filter(g => g !== 'all').map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>

              <select 
                value={selectedSource} 
                onChange={(e) => setSelectedSource(e.target.value)}
                className="filter-select"
              >
                <option value="all">所有来源</option>
                {sources.filter(s => s !== 'all').map(s => (
                  <option key={s} value={s}>{SOURCE_MAP[s] || s}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="filter-tags">
             {categories.map(cat => (
               <span 
                 key={cat} 
                 className={`filter-tag ${selectedCategory === cat ? 'active' : ''}`}
                 onClick={() => setSelectedCategory(cat)}
               >
                 {cat === 'all' ? '全部' : cat}
               </span>
             ))}
          </div>

          <div className="term-list">
            {filteredTerms.map(term => (
              <div 
                key={term.id} 
                className={`term-item ${selectedTerm?.id === term.id ? 'active' : ''}`}
                onClick={() => setSelectedTerm(term)}
              >
                <div className="term-main">
                  <span className="term-name">{term.term}</span>
                  <span className="term-badges">
                    {(term.games || []).slice(0, 2).map(g => <span key={g} className="mini-badge">{g}</span>)}
                  </span>
                </div>
                <span className="term-cat">{term.category?.l2 || 'General'}</span>
              </div>
            ))}
            {filteredTerms.length === 0 && (
              <div className="empty-state">未找到相关术语</div>
            )}
          </div>
        </Panel>

        {/* 右侧：详情展示 */}
        <Panel className="dict-details">
          {selectedTerm ? (
            <div className="term-detail-view">
              <div className="detail-header">
                <h1 className="term-title">{selectedTerm.term}</h1>
                <div className="term-meta">
                  <span className="badge game">{(selectedTerm.games || []).join(', ') || 'General'}</span>
                  <span className="badge category">{selectedTerm.category?.l1 || '?'} &gt; {selectedTerm.category?.l2 || '?'}</span>
                  <span className="badge source">{SOURCE_MAP[selectedTerm.source] || selectedTerm.source}</span>
                </div>
              </div>
              
              <div className="detail-body">
                <h3>定义</h3>
                <p className="definition-text">{selectedTerm.definition}</p>
                
                {selectedTerm.tags && selectedTerm.tags.length > 0 && (
                  <div className="tags-section">
                    <h3>标签</h3>
                    <div className="tags-list">
                      {selectedTerm.tags.map(tag => <span key={tag} className="tag">#{tag}</span>)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="details-placeholder">
              <div className="book-icon">📖</div>
              <p>从左侧选择术语以查看详情</p>
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
};

export default Dictionary;

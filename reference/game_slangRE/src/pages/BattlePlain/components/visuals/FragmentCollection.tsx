import React from 'react';
import { TimeFragment } from '../../types';
import './FragmentCollection.scss';

interface FragmentCollectionProps {
  fragments: TimeFragment[];
}

export const FragmentCollection: React.FC<FragmentCollectionProps> = ({ fragments }) => {
  const collectedCount = fragments.filter(f => f.collected).length;
  const allCollected = collectedCount === fragments.length;

  return (
    <div className="fragment-collection">
      <div className="collection-header">
        <h3>时间碎片</h3>
        <span className="count">{collectedCount} / {fragments.length}</span>
      </div>

      <div className="fragments-grid">
        {fragments.map((fragment, index) => (
          <div 
            key={fragment.id}
            className={`fragment-slot ${fragment.collected ? 'collected' : 'empty'}`}
          >
            {fragment.collected ? (
              <>
                <div className="fragment-glow"></div>
                <div className="fragment-icon">💎</div>
                <div className="fragment-info">
                  <span className="fragment-name">{fragment.name}</span>
                  <div className="fragment-keywords">
                    {fragment.keywords.slice(0, 2).map((kw, i) => (
                      <span key={i} className="keyword">{kw}</span>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="empty-slot">
                  <span className="slot-number">{index + 1}</span>
                </div>
                <span className="empty-hint">未收集</span>
              </>
            )}
          </div>
        ))}
      </div>

      {allCollected && (
        <div className="all-collected-hint">
          <span className="sparkle">✨</span>
          <span>所有碎片已收集！可以合成时之罗盘了</span>
          <span className="sparkle">✨</span>
        </div>
      )}

      {!allCollected && (
        <div className="collection-hint">
          <p>探索各个时代，完成挑战以收集碎片</p>
        </div>
      )}
    </div>
  );
};

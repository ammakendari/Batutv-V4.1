import React from 'react';
import { generateTagSlug } from '../data/tagAdminStore';

interface TrendingTopicsBarProps {
  topics?: string[];
  onSelectTopic: (topic: string) => void;
  activeTopic?: string;
}

const DEFAULT_FEATURED_TOPICS = [
  'Rektor Unsoed Terjaring OTT KPK',
  'Gempa Guncang Sumut',
  'Gempa Guncang NTT',
  'Piala AFF 2026',
  'KPK OTT Pejabat',
  'Festival Bunga Batu 2026',
  'Wisata Apel Malang Raya',
  'Tol Trans Jawa 2026',
  'Pertanian Organik Kota Batu',
];

export const TrendingTopicsBar: React.FC<TrendingTopicsBarProps> = ({
  topics = DEFAULT_FEATURED_TOPICS,
  onSelectTopic,
  activeTopic,
}) => {
  const displayTopics = topics && topics.length > 0 ? topics : DEFAULT_FEATURED_TOPICS;

  return (
    <div id="trending-topics-bar" className="w-full bg-transparent py-1.5 sm:py-2">
      <div className="max-w-[980px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-[#940a13]/40 rounded-lg shadow-xs px-3.5 py-2 flex items-center gap-3 overflow-hidden">
          {/* Label # TOPIK */}
          <div className="flex items-center gap-1 text-xs sm:text-[13px] font-black text-[#940a13] uppercase tracking-wider flex-shrink-0">
            <span># TOPIK</span>
          </div>

          {/* Tags List */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 text-xs font-bold text-slate-800">
            {displayTopics.map((topic, idx) => {
              const cleanTopic = topic.replace(/^#/, '');
              const isSelected = activeTopic === topic || activeTopic === cleanTopic;
              const tagSlug = generateTagSlug(cleanTopic);

              return (
                <a
                  key={idx}
                  id={`topic-tag-${idx}`}
                  href={`/tag/${tagSlug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectTopic(cleanTopic);
                  }}
                  className={`text-[11.5px] sm:text-xs px-3 py-1 rounded-full font-bold whitespace-nowrap transition cursor-pointer ${
                    isSelected
                      ? 'bg-[#940a13] text-white shadow-2xs'
                      : 'bg-[#f1f3f5] text-slate-800 hover:bg-red-50 hover:text-[#940a13]'
                  }`}
                >
                  {cleanTopic}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};



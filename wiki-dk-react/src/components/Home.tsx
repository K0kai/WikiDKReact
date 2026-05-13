import { useContext, useState } from "react";
import { ArticleContext } from "../context/ArticleContext";
import type { ArticleGroup } from "../types/articleGroup";
import banner from "../assets/dkbanner.png";
import "./Home.css";
import { ArticleGroupContext } from "../context/ArticleGroupContext";

function Home() {
  const articleContext = useContext(ArticleContext);
  const articleGroupContext = useContext(ArticleGroupContext);
  const [selectedGroup, setSelectedGroup] = useState<ArticleGroup | null>(null);

  if (!articleContext)
    return <img className="mediumicon" src="https://raw.githubusercontent.com/n3r4zzurr0/svg-spinners/main/preview/ring-resize-white-36.svg" />;

  const { articles } = articleContext;
  const homeGroups = articleGroupContext?.groups.filter((g) => g.displayOnHome);

  const groupArticles = selectedGroup
    ? articleGroupContext?.groupItems
        .filter((i) => i.articleGroupId === selectedGroup.id)
        .map((i) => articles.find((a) => a.id === i.articleId))
        .filter(Boolean)
    : [];

  return (
    <div className="home-page">
      <img className="Banner" src={banner} />
      <div className="home-content">

        {selectedGroup ? (
          <>
            <div className="home-section-header">
              <button className="home-back-btn" onClick={() => setSelectedGroup(null)}>←</button>
              <h2>{selectedGroup.title}</h2>
            </div>
            {selectedGroup.description && (
              <p className="home-group-desc home-group-desc--hero">{selectedGroup.description}</p>
            )}
            <div className="home-articles-list">
              {groupArticles?.length === 0 && (
                <p className="home-empty">No articles in this group yet.</p>
              )}
              {groupArticles?.map((article) => article && (
                <div key={article.id} className="home-article-card">
                  {article.thumbnailLink && (
                    <img className="home-article-thumb" src={article.thumbnailLink} alt="" />
                  )}
                  <div className="home-article-info">
                    <div className="home-article-title">{article.title}</div>
                    <div className="home-article-meta">
                      Atualizado em: {new Date(article.updated).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="home-section-header"><h2>Importantes</h2></div>
            <div className="home-groups-grid">
              {homeGroups?.map((group) => (
                <div
                  key={group.id}
                  className={`home-group-card ${group.locked ? "locked" : ""}`}
                  onClick={() => !group.locked && setSelectedGroup(group)}
                >
                  <div className="home-group-title fontgermania">
                    {group.title}
                    {group.locked && <span className="home-lock-icon">🔒</span>}
                  </div>
                  {group.description && <p className="home-group-desc fontinter">{group.description}</p>}
                  {group.items && (
                    <div className="home-group-count">
                      {group.items.length} artigo{group.items.length !== 1 ? "s" : ""}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default Home;
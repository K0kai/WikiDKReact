import { useContext, useState } from "react";
import { ArticleContext } from "../context/ArticleContext";
import type { ArticleGroup } from "../types/articleGroup";
import banner from "../assets/dkbanner.png";
import "./Home.css";
import { ArticleGroupContext } from "../context/ArticleGroupContext";
import { useNavigate } from "react-router-dom";
import type { Article } from "../types/article";
import { useQuery } from "@tanstack/react-query";
import { createSingleUserQueryOptions } from "./query_options/userQueryOptions";

function ArticleCard({ article }: { article: Article }) {

  var editorQuery = useQuery(createSingleUserQueryOptions(article.lastEditorId));
  var userQuery = useQuery(createSingleUserQueryOptions(article.authorId))
  const navigate = useNavigate();
  return <div onClick={() => navigate(`article/${article.id}`)} key={article.id} className="home-article-card">
    {article.thumbnailLink && (
      <img className="home-article-thumb" src={article.thumbnailLink} alt="" />
    )}
    <div className="home-article-info">
      <div className="home-article-title">{article.title}</div>
      <div className="home-article-meta">
        <div>
          <div className="flex side-by-side align-center">
            Autor:
            <img className="margin-left5 margin-right5 smallicon circular" src={userQuery.data?.userIcon ?? "https://cdn-icons-png.flaticon.com/512/149/149071.png"} />
            {userQuery.data?.name ?? "Desconhecido"}
          </div>
          <div className="flex side-by-side align-center">
            Ultimo editor:
            <img className="margin-left5 margin-right5 smallicon circular" src={editorQuery.data?.userIcon ?? "https://cdn-icons-png.flaticon.com/512/149/149071.png"} />
            {editorQuery.data?.name ?? "Desconhecido"}
          </div>
          Atualizado em: {new Date(article.updated).toLocaleDateString()}
        </div>

      </div>
    </div>
  </div>
}

function Home() {
  const articleContext = useContext(ArticleContext);
  const articleGroupContext = useContext(ArticleGroupContext);
  const [selectedGroup, setSelectedGroup] = useState<ArticleGroup | null>(null);

  if (!articleContext || !articleGroupContext) {
    return <div>Error: context missing</div>;
  }
  if (articleContext.isLoading)
    return <div className="margin-left15 th-loader">
      <img className="" src="https://raw.githubusercontent.com/n3r4zzurr0/svg-spinners/main/preview/ring-resize-white-36.svg" />
    </div>
  const { articles } = articleContext;
  const homeGroups = articleGroupContext?.groups.filter((g) => g.displayOnHome);
  const articleKeys = Object.keys(articles).map(Number);

  const groupArticles = selectedGroup
    ? articleGroupContext.groupItems
      .filter((i) => i.articleGroupId === selectedGroup.id)
      .filter((i) => articleKeys.includes(i.articleId))
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
                <p className="home-empty">Sem artigos neste grupo ainda.</p>
              )}
              {groupArticles?.map((articleGroupItem) => articleGroupItem && (
                <ArticleCard key={articleGroupItem.id} article={articles[articleGroupItem.articleId]} />
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
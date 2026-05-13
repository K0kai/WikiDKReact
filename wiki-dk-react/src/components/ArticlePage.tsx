import { AuthContext } from "../context/AuthContext";
import { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './ArticlePage.css';
import ReactMarkdown from "react-markdown";
import editIcon from "../assets/edit-icon.png"
import trashIcon from "../assets/trash-icon.png"
import type { Article } from "../types/article";
import remarkGfm from "remark-gfm";
import { ArticleContext } from "../context/ArticleContext";





function ArticlePage(){
  const articleContext = useContext(ArticleContext);
   const { id } = useParams<{ id: string }>();
    const articleId = parseInt(id || '0');
    const [article, setArticle] = useState<Article | null>(articleContext?.articles.filter(a => a.id == articleId)[0] ?? null);

    useEffect(() => {
      setArticle(articleContext?.articles.filter(a => a.id == articleId)[0] ?? null)

    },[id])
   

  function ManageButtons() {
    const navigate = useNavigate();
    var authContext = useContext(AuthContext);
    if (!authContext?.hasRole(1)) return null;

    async function handleDelete(){
      var con = confirm("Essa ação é irreversível, deseja prosseguir?")
      if (!con)
        return;
      var result = await articleContext?.deleteArticle(articleId);
      if (result){
        alert("Artigo deletado com sucesso!");
        navigate(-1);
      }
      else{
        alert("Ocorreu um erro ao deletar o artigo.")
      }
    }

  

    return (
      <div className="manager buttons-ui">
        <button className="transparent btn" onClick={() => navigate(`/article/${id}/edit`)}>
          <img className="buttonimg" src={editIcon} />
        </button>
        <button className="transparent btn">
          <img className="buttonimg trash" onClick={handleDelete} src={trashIcon} />
        </button>
      </div>
    );
  }

    return( 
      <>
        {article ? (
          <div className="grid gothborder articlectr">
            <ManageButtons />
            <div>
              <h1 className="article-title">{article?.title}</h1>
              <br />
              <br />
              <div className="markdown-body articlebody ">
                <ReactMarkdown remarkPlugins={[remarkGfm]} children={article?.content || 'Carregando...'} />
              </div>
              <br />
              <p className="article-updated fontinter">Atualizado em: {article ? new Date(article.updated).toLocaleString() : 'Carregando...'}</p>
            </div>
          </div>)
          : (
            <img src="https://raw.githubusercontent.com/SamHerbert/SVG-Loaders/master/svg-loaders/oval.svg" />
          )
        }
      </>
    )
}

export default ArticlePage;
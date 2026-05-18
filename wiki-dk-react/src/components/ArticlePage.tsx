import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './ArticlePage.css';
import ReactMarkdown from "react-markdown";
import editIcon from "../assets/edit-icon.png"
import trashIcon from "../assets/trash-icon.png"
import remarkGfm from "remark-gfm";
import { useQuery } from "@tanstack/react-query";
import { createSingleArticleQueryOptions } from "./query_options/articleQueryOptions";
import { deleteArticle } from "../api/articleAPI";





function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  const articleId = parseInt(id || '0');
  const {data} = useQuery(createSingleArticleQueryOptions(articleId));
  const article = data

  useEffect(() => {

  }, [id, article])


  function ManageButtons() {
    const navigate = useNavigate();

    async function handleDelete() {
      var con = confirm("Essa ação é irreversível, deseja prosseguir?")
      if (!con)
        return;
      var result = await deleteArticle(articleId);
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
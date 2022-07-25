import styles from './post.module.scss';
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { getPrismicClient } from "../../services/prismic";
import { RichText } from 'prismic-dom';

interface PostProps {

    post: {
        slug: string;
        title: string;
        content: string; 
        uipdatedAt: string  
    }
}

export default function Post({post}:PostProps){
    return(
        <>
            <Head>
                <title>{post.title} | Ignews </title>
            </Head>

            <main className={styles.container}  key={post.slug} >
                <article className={styles.post}   >
                  <h1>{post.title}</h1>
                  <time>{post.uipdatedAt}</time>
                   <div 
                   
                    className={styles.postContent}
                   dangerouslySetInnerHTML={{__html:post.content}} 
                   />
                </article>
            </main>
        </>
    );
}



export const getServerSideProps: GetServerSideProps  = async ({req,params}) =>{
    const session  = await getSession({req})
     
    const {slug} = params;

    console.log(session);

      //verificar subscription nao esta funcionando ver com stripe 
   
     /*  if(!session?.activeSubscription){
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }    */

    const prismic = getPrismicClient(req)

    const response = await prismic.getByUID<any>('publication',String(slug),{})

        if (!response) {
        return {
            redirect: {
            destination: '/',
            permanent: false
            }
        }
        }

   const post = {
    slug: response.uid,
    title: response.data.title,
    content: RichText.asHtml(response.data.Content),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR',{
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    })
   };
 
   return {
    props:{
        post,
    }
   }

}
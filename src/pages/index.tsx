import { GetStaticProps } from 'next';
import Head from 'next/head';

import { SubscribeButton } from '../components/SubscribeButton';
import { stripe } from '../services/stripe';
import styles from './home.module.scss';


interface HomeProps {
  product: {
    priceId: string,
    amount: number
  }
}


export default function Home({ product }: HomeProps) {


  return (
    <>
      <Head>
        <title>Home | Ig.News</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey,Welcome</span>
          <h1>News About the <span>React</span> World</h1>
          <p>Get access to all the publication  <br />
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>
        <img src="/images/avatar.svg" alt="ig.news" />
      </main>
    </>
  )
}



export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1LFHurDBHXOcNi9RzkRRXgLN');
  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-Us', {
       style: 'currency',
      currency: 'USD'
  }).format((price.unit_amount / 100)),

   };
 
  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24 // 24 horas 
  }
}
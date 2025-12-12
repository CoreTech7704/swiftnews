import React, { useEffect, useState } from 'react';
import NewsCard from '../components/NewsCard';
import { Helmet } from 'react-helmet';
import { fetchNews } from '../lib/fetchNews'; // uses /api/news proxy

export default function Home({ loadingBar }) {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        if (loadingBar?.current) loadingBar.current.staticStart();

        // fetch 6 top headlines (via serverless proxy)
        const items = await fetchNews({ country: 'in', category: 'general', max: 6, page: 1 });
        setArticles(items);
      } catch (err) {
        console.error('Error fetching news:', err);
      } finally {
        if (loadingBar?.current) loadingBar.current.complete();
      }
    };

    load();
  }, [loadingBar]);

  return (
    <>
      <Helmet>
        <title>Swift News - Your Daily Dose of Top Headlines</title>
        <meta
          name="description"
          content="Welcome to Swift News – your go-to source for trending global headlines. Stay informed with verified and real-time news updates."
        />
        <meta
          name="keywords"
          content="news, top headlines, latest news, global news, swift news"
        />
        <meta property="og:title" content="Swift News - Top Headlines" />
        <meta
          property="og:description"
          content="Swift News brings you the latest and most important stories from around the world. Stay informed, stay ahead."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/" />
        <meta property="og:image" content="/cover.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 dark:bg-gray-900 dark:text-white">
        {/* Hero */}
        <section className="text-center my-10">
          <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
            Welcome to <span className="text-blue-600">Swift News</span> 🗞️
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Stay informed with the latest headlines from around the world.
          </p>
        </section>

        {/* News Grid */}
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 my-10">
          {articles.map((article, idx) => (
            <NewsCard
              key={article.url ?? idx}
              title={article.title}
              description={article.description}
              image={article.image}
              url={article.url}
            />
          ))}
        </section>
      </div>
    </>
  );
}

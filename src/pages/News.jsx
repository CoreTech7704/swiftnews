import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Helmet } from "react-helmet";
import { useSearchParams } from 'react-router-dom';
import NewsCard from '../components/NewsCard';
import { fetchNews } from '../lib/fetchNews'; // uses /api/news proxy

const countryMap = {
  in: 'India',
  us: 'United States',
  uk: 'United Kingdom',
  au: 'Australia',
  ca: 'Canada',
};

export default function News({ loadingBar }) {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || 'general';
  const country = searchParams.get('country') || 'in';
  const formatCategory = (cat) => cat.charAt(0).toUpperCase() + cat.slice(1);

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const observer = useRef();

  // fetch page of news from serverless proxy
  const loadPage = useCallback(async (p = 1) => {
    try {
      setLoading(true);
      if (loadingBar?.current) loadingBar.current.staticStart();

      const items = await fetchNews({ country, category, page: p, max: 12 });
      if (Array.isArray(items) && items.length > 0) {
        setArticles(prev => (p === 1 ? items : [...prev, ...items]));
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
      if (loadingBar?.current) loadingBar.current.complete();
    }
  }, [category, country, loadingBar]);

  // When category or country changes, reset articles and page
  useEffect(() => {
    setArticles([]);
    setPage(1);
    // immediately load first page for new filters
    loadPage(1);
  }, [category, country, loadPage]);

  // When page increments (infinite scroll), load that page
  useEffect(() => {
    if (page === 1) return; // already loaded by reset effect
    loadPage(page);
  }, [page, loadPage]);

  const lastArticleElementRef = useCallback(
    node => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          setPage(prevPage => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading]
  );

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Helmet>
        <title>{`${formatCategory(category)} News - ${countryMap[country] || 'World'} | Swift News`}</title>
        <meta
          name="description"
          content={`Get the latest ${category} news from ${countryMap[country] || 'around the world'} on Swift News. Real-time, reliable headlines across topics.`}
        />
        <meta name="keywords" content={`news, ${category} news, ${country} news, latest headlines, swift news`} />
        <meta property="og:title" content={`Top ${category} News from ${countryMap[country] || 'World'} | Swift News`} />
        <meta property="og:description" content={`Stay updated with real-time ${category} news from ${countryMap[country] || 'around the world'}.`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://yourdomain.com/news?category=${category}&country=${country}`} />
        <meta property="og:image" content="/cover.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 py-8 relative">
        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            {category.charAt(0).toUpperCase() + category.slice(1)} News from{' '}
            <span className="text-blue-600 dark:text-blue-400 font-semibold">
              {countryMap[country] || 'Unknown'}
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
            Stay updated with the latest {category} news.
          </p>
        </div>

        {/* News Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, idx) => {
            const card = (
              <NewsCard
                key={article.url ?? idx}
                title={article.title}
                description={article.description}
                image={article.image || '/placeholder.jpg'}
                url={article.url}
              />
            );
            return idx === articles.length - 1 ? (
              <div ref={lastArticleElementRef} key={article.url ?? idx}>
                {card}
              </div>
            ) : (
              card
            );
          })}
        </div>

        {/* No articles message */}
        {!loading && articles.length === 0 && (
          <p className="text-center text-red-500 mt-6 dark:text-red-400">
            No articles found. Please try another category or country.
          </p>
        )}

        {/* Loader */}
        {loading && (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-4">
            Loading more news...
          </p>
        )}

        {/* Scroll To Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-full shadow-md transition-all"
            title="Go to top"
          >
            ↑ Top
          </button>
        )}
      </div>
    </>
  );
}

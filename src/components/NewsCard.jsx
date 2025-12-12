export default function NewsCard({ title, description, image, url }) {
  const short = description ? `${description.slice(0, 150)}...` : "";
  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm dark:shadow-md transition-colors duration-300">
      <img
        src={image}
        alt={title}
        loading="lazy"
        className="w-full h-48 object-cover rounded-t-xl"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/cover.png";
        }}
      />

      <div className="flex flex-col flex-grow p-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{title}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          {short}
        </p>

        <div className="mt-auto">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
          >
            Read More
          </a>
        </div>
      </div>
    </div>
  );
}

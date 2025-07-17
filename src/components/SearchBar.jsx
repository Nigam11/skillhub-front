const categories = ['Notes', 'Portfolio', 'eCommerce', 'Marketing', 'Minimal'];

const SearchBar = () => (
  <div className="text-center mt-12">
    <h1 className="text-4xl font-semibold">Inspiring by sharing, empowering by learning</h1>
    <input
      type="text"
      placeholder="Search resources..."
      className="mt-6 w-full max-w-lg border px-4 py-2 rounded shadow"
    />
    <div className="flex flex-wrap justify-center mt-4 gap-2">
      {categories.map(tag => (
        <button key={tag} className="px-4 py-1 rounded-full bg-gray-100 hover:bg-black hover:text-white">
          {tag}
        </button>
      ))}
    </div>
  </div>
);

export default SearchBar;
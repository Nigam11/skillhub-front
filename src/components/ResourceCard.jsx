const ResourceCard = ({ resource }) => (
  <div className="w-full rounded shadow hover:scale-105 transition-transform bg-white">
    <img src={resource.imageUrl} alt="preview" className="rounded-t h-48 object-cover w-full" />
    <div className="p-4">
      <h2 className="font-semibold">{resource.title}</h2>
      <p className="text-sm text-gray-500">{resource.platform}</p>
      <div className="mt-2 text-sm font-medium">₹{resource.price}</div>
      <div className="flex justify-between mt-4 text-sm text-blue-500">
        <a href={`https://wa.me/${resource.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp</a>
        <a href={`https://instagram.com/${resource.instagram}`} target="_blank" rel="noreferrer">Instagram</a>
      </div>
    </div>
  </div>
);

export default ResourceCard;
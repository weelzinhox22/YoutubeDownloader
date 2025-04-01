import { AdBanner } from "@/services/ads";

const Home = () => {
  return (
    <div>
      {/* Conteúdo da página */}
      
      {/* Adicionar banner de anúncio */}
      <div className="mt-8">
        <AdBanner />
      </div>
    </div>
  );
};

export default Home; 
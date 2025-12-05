import { Header } from "./header";
import { Content } from "./content";


export const ClientPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto space-y-3">
        <Header />
        <Content />
      </div>
    </div>
  );
};